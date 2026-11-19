// Zero-Dependency Native Terminal Image Viewer
// Decodes PNG, BMP, and PPM in pure Node.js and renders in TrueColor half-blocks (▀)

import fs from 'node:fs';
import zlib from 'node:zlib';
import { c } from './colors.js';

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// Pure JS BMP Decoder (24-bit / 32-bit RGB/RGBA)
function decodeBMP(buffer) {
  if (buffer.length < 54 || buffer.toString('ascii', 0, 2) !== 'BM') {
    throw new Error('Not a valid BMP image');
  }

  const pixelOffset = buffer.readUInt32LE(10);
  const width = buffer.readInt32LE(18);
  const rawHeight = buffer.readInt32LE(22);
  const bpp = buffer.readUInt16LE(28);
  const compression = buffer.readUInt32LE(30);

  if (compression !== 0 && compression !== 3) {
    throw new Error('Compressed BMP formats not supported');
  }

  const isTopDown = rawHeight < 0;
  const height = Math.abs(rawHeight);
  const channels = bpp === 32 ? 4 : 3;

  const rowSize = Math.floor((bpp * width + 31) / 32) * 4;
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const srcY = isTopDown ? y : height - 1 - y;
    const rowOffset = pixelOffset + srcY * rowSize;

    for (let x = 0; x < width; x++) {
      const srcIdx = rowOffset + x * channels;
      const dstIdx = (y * width + x) * 4;

      const b = buffer[srcIdx];
      const g = buffer[srcIdx + 1];
      const r = buffer[srcIdx + 2];
      const a = channels === 4 ? buffer[srcIdx + 3] : 255;

      rgba[dstIdx] = r;
      rgba[dstIdx + 1] = g;
      rgba[dstIdx + 2] = b;
      rgba[dstIdx + 3] = a;
    }
  }

  return { width, height, data: rgba };
}

// Pure JS PNG Decoder (8-bit Grayscale, RGB, RGBA using native zlib)
function decodePNG(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error('Not a valid PNG file');
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (bitDepth !== 8) {
        throw new Error(`Only 8-bit PNG supported, got ${bitDepth}-bit`);
      }
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (width === 0 || height === 0) {
    throw new Error('Corrupt PNG headers');
  }

  // Channels: 0 = Grayscale (1), 2 = RGB (3), 3 = Palette (not supported), 4 = Gray+Alpha (2), 6 = RGBA (4)
  let bytesPerPixel = 3;
  if (colorType === 0) bytesPerPixel = 1;
  else if (colorType === 2) bytesPerPixel = 3;
  else if (colorType === 4) bytesPerPixel = 2;
  else if (colorType === 6) bytesPerPixel = 4;
  else throw new Error(`Unsupported PNG color type: ${colorType}`);

  const rawCompressed = Buffer.concat(idatChunks);
  const uncompressed = zlib.inflateSync(rawCompressed);

  const scanlineLength = 1 + width * bytesPerPixel;
  const rgba = Buffer.alloc(width * height * 4);
  let prevRow = Buffer.alloc(width * bytesPerPixel);

  for (let y = 0; y < height; y++) {
    const scanlineOffset = y * scanlineLength;
    const filterType = uncompressed[scanlineOffset];
    const currentRow = Buffer.alloc(width * bytesPerPixel);

    for (let i = 0; i < width * bytesPerPixel; i++) {
      const rawVal = uncompressed[scanlineOffset + 1 + i];
      const a = i >= bytesPerPixel ? currentRow[i - bytesPerPixel] : 0;
      const b = prevRow[i];
      const c = i >= bytesPerPixel ? prevRow[i - bytesPerPixel] : 0;

      let val = 0;
      switch (filterType) {
        case 0: // None
          val = rawVal;
          break;
        case 1: // Sub
          val = (rawVal + a) & 0xff;
          break;
        case 2: // Up
          val = (rawVal + b) & 0xff;
          break;
        case 3: // Average
          val = (rawVal + Math.floor((a + b) / 2)) & 0xff;
          break;
        case 4: // Paeth
          val = (rawVal + paethPredictor(a, b, c)) & 0xff;
          break;
        default:
          val = rawVal;
      }
      currentRow[i] = val;
    }

    prevRow = currentRow;

    // Convert scanline into RGBA
    for (let x = 0; x < width; x++) {
      const dstIdx = (y * width + x) * 4;
      const srcIdx = x * bytesPerPixel;

      if (colorType === 6) { // RGBA
        rgba[dstIdx] = currentRow[srcIdx];
        rgba[dstIdx + 1] = currentRow[srcIdx + 1];
        rgba[dstIdx + 2] = currentRow[srcIdx + 2];
        rgba[dstIdx + 3] = currentRow[srcIdx + 3];
      } else if (colorType === 2) { // RGB
        rgba[dstIdx] = currentRow[srcIdx];
        rgba[dstIdx + 1] = currentRow[srcIdx + 1];
        rgba[dstIdx + 2] = currentRow[srcIdx + 2];
        rgba[dstIdx + 3] = 255;
      } else if (colorType === 0) { // Grayscale
        const g = currentRow[srcIdx];
        rgba[dstIdx] = g;
        rgba[dstIdx + 1] = g;
        rgba[dstIdx + 2] = g;
        rgba[dstIdx + 3] = 255;
      } else if (colorType === 4) { // Grayscale + Alpha
        const g = currentRow[srcIdx];
        rgba[dstIdx] = g;
        rgba[dstIdx + 1] = g;
        rgba[dstIdx + 2] = g;
        rgba[dstIdx + 3] = currentRow[srcIdx + 1];
      }
    }
  }

  return { width, height, data: rgba };
}

// PPM (Netpbm) Decoder (P6 binary RGB)
function decodePPM(buffer) {
  let header = '';
  let idx = 0;
  while (idx < buffer.length && header.split(/\s+/).filter(Boolean).length < 4) {
    header += String.fromCharCode(buffer[idx++]);
  }
  const parts = header.trim().split(/\s+/);
  if (parts[0] !== 'P6') throw new Error('Only P6 PPM supported');
  const width = parseInt(parts[1], 10);
  const height = parseInt(parts[2], 10);
  const maxVal = parseInt(parts[3], 10);

  const rgba = Buffer.alloc(width * height * 4);
  let src = idx;
  for (let i = 0; i < width * height; i++) {
    const dst = i * 4;
    rgba[dst] = buffer[src++];
    rgba[dst + 1] = buffer[src++];
    rgba[dst + 2] = buffer[src++];
    rgba[dst + 3] = 255;
  }
  return { width, height, data: rgba };
}

// Auto-detect format & decode
export function decodeImage(input) {
  const buffer = Buffer.isBuffer(input) ? input : fs.readFileSync(input);
  if (buffer.length < 8) throw new Error('File too small to be a valid image');

  const magic = buffer.subarray(0, 4).toString('hex');
  if (magic.startsWith('89504e47')) {
    return decodePNG(buffer);
  } else if (buffer.toString('ascii', 0, 2) === 'BM') {
    return decodeBMP(buffer);
  } else if (buffer.toString('ascii', 0, 2) === 'P6') {
    return decodePPM(buffer);
  } else {
    throw new Error('Unsupported image format. Clivibe supports PNG, BMP, and PPM.');
  }
}

// Render RGBA pixel buffer to terminal using ▀ (half-block) TrueColor characters
export function renderImage(input, options = {}) {
  let decoded;
  try {
    decoded = decodeImage(input);
  } catch (err) {
    return c.red(`✖ Failed to decode image: ${err.message}`);
  }

  const { width: srcW, height: srcH, data } = decoded;
  const terminalCols = process.stdout.columns || 80;
  const targetWidth = Math.min(options.width || 60, terminalCols - 2);
  const scale = targetWidth / srcW;
  const targetHeight = Math.max(2, Math.round(srcH * scale));

  const lines = [];

  // Terminal characters are ~2:1 vertical-to-horizontal aspect ratio
  // Each line in terminal renders 2 vertical pixels (top = foreground, bottom = background)
  for (let y = 0; y < targetHeight; y += 2) {
    let line = '';
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.min(Math.floor(x / scale), srcW - 1);
      const srcY1 = Math.min(Math.floor(y / scale), srcH - 1);
      const srcY2 = Math.min(Math.floor((y + 1) / scale), srcH - 1);

      const idx1 = (srcY1 * srcW + srcX) * 4;
      const idx2 = (srcY2 * srcW + srcX) * 4;

      const r1 = data[idx1];
      const g1 = data[idx1 + 1];
      const b1 = data[idx1 + 2];
      const a1 = data[idx1 + 3];

      const r2 = data[idx2];
      const g2 = data[idx2 + 1];
      const b2 = data[idx2 + 2];
      const a2 = data[idx2 + 3];

      if (a1 < 10 && a2 < 10) {
        line += ' ';
      } else if (a1 < 10) {
        line += `\x1b[38;2;${r2};${g2};${b2}m▄\x1b[39m`;
      } else if (a2 < 10) {
        line += `\x1b[38;2;${r1};${g1};${b1}m▀\x1b[39m`;
      } else {
        // TrueColor top + bottom
        line += `\x1b[38;2;${r1};${g1};${b1}m\x1b[48;2;${r2};${g2};${b2}m▀\x1b[0m`;
      }
    }
    lines.push(line);
  }

  return lines.join('\n');
}

// Render image as ASCII characters (@%#*+=-:. )
export function renderAscii(input, options = {}) {
  const decoded = decodeImage(input);
  const { width: srcW, height: srcH, data } = decoded;
  const ramp = ' .:-=+*#%@';
  const targetWidth = options.width || 50;
  const scale = targetWidth / srcW;
  const targetHeight = Math.max(1, Math.round(srcH * scale * 0.5));

  const lines = [];
  for (let y = 0; y < targetHeight; y++) {
    let line = '';
    for (let x = 0; x < targetWidth; x++) {
      const srcX = Math.min(Math.floor(x / scale), srcW - 1);
      const srcY = Math.min(Math.floor(y / (scale * 0.5)), srcH - 1);
      const idx = (srcY * srcW + srcX) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      const charIdx = Math.floor((gray / 255) * (ramp.length - 1));
      line += ramp[charIdx];
    }
    lines.push(line);
  }
  return lines.join('\n');
}
