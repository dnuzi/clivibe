// Native Terminal Color & Gradient System
// Pure standard library — 0 external dependencies

const hasColors = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);

// Named Color Palette Mapping
const NAMED_COLORS = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  maroon: '#800000',
  olive: '#808000',
  navy: '#000080',
  purple: '#800080',
  teal: '#008080',
  orange: '#ffa500',
  gold: '#ffd700',
  pink: '#ffc0cb',
  lime: '#00ff00',
  aqua: '#00ffff',
  coral: '#ff7f50',
  indigo: '#4b0082',
  crimson: '#dc143c',
  violet: '#ee82ee',
  turquoise: '#40e0d0',
  salmon: '#fa8072',
  plum: '#dda0dd'
};

// ANSI Codes mapping
const ANSI_CODES = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  // Foreground standard
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  // Bright Foreground
  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  // Background
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],
  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49]
};

export function parseColor(color) {
  if (Array.isArray(color)) return color;
  if (typeof color !== 'string') return [255, 255, 255];

  const trimmed = color.trim().toLowerCase();
  if (NAMED_COLORS[trimmed]) {
    return parseColor(NAMED_COLORS[trimmed]);
  }

  // Handle rgb(r, g, b) format
  const rgbMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)];
  }

  // Handle Hex
  const clean = trimmed.replace('#', '');
  if (clean.length === 3) {
    const bigint = parseInt(clean.split('').map(c => c + c).join(''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }
  const bigint = parseInt(clean, 16);
  if (isNaN(bigint)) return [255, 255, 255];
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// RGB to HSV Conversion
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, v];
}

// HSV to RGB Conversion
function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Chainable Color Styler
function createStyler(openSeq = [], closeSeq = []) {
  const format = (strings, ...values) => {
    let str;
    if (Array.isArray(strings) && strings.raw) {
      // Tagged template literal
      str = strings.reduce((acc, curr, i) => acc + curr + (values[i] ?? ''), '');
    } else {
      str = String(strings ?? '');
    }

    if (!hasColors || str === '') return str;
    return `${openSeq.map(s => `\x1b[${s}m`).join('')}${str}${closeSeq.map(s => `\x1b[${s}m`).join('')}`;
  };

  for (const [name, [open, close]] of Object.entries(ANSI_CODES)) {
    Object.defineProperty(format, name, {
      get() {
        return createStyler([...openSeq, open], [close, ...closeSeq]);
      }
    });
  }

  // 24-bit TrueColor Foreground
  format.rgb = (r, g, b) =>
    createStyler([...openSeq, `38;2;${r};${g};${b}`], [39, ...closeSeq]);

  format.hex = (hexStr) => {
    const [r, g, b] = parseColor(hexStr);
    return format.rgb(r, g, b);
  };

  // 24-bit TrueColor Background
  format.bgRgb = (r, g, b) =>
    createStyler([...openSeq, `48;2;${r};${g};${b}`], [49, ...closeSeq]);

  format.bgHex = (hexStr) => {
    const [r, g, b] = parseColor(hexStr);
    return format.bgRgb(r, g, b);
  };

  return format;
}

export const c = createStyler();

// Gradient Generator
export function gradient(...colorInputs) {
  let colors = colorInputs.flat();
  let options = { interpolation: 'rgb', hsvSpin: 'short' };

  if (colors.length > 0 && typeof colors[colors.length - 1] === 'object' && !Array.isArray(colors[colors.length - 1])) {
    options = { ...options, ...colors.pop() };
  }
  if (colors.length === 0) colors = ['#FF61D2', '#5271FF', '#12D8FA'];

  const parsedRgbs = colors.map(parseColor);

  const interpolateColor = (progress) => {
    const segment = progress * (parsedRgbs.length - 1);
    const index = Math.min(Math.floor(segment), parsedRgbs.length - 2);
    const factor = segment - index;

    if (options.interpolation === 'hsv') {
      const hsv1 = rgbToHsv(...parsedRgbs[index]);
      const hsv2 = rgbToHsv(...parsedRgbs[index + 1]);

      let dH = hsv2[0] - hsv1[0];
      if (options.hsvSpin === 'short') {
        if (dH > 0.5) dH -= 1;
        else if (dH < -0.5) dH += 1;
      } else if (options.hsvSpin === 'long') {
        if (dH > 0 && dH < 0.5) dH -= 1;
        else if (dH <= 0 && dH > -0.5) dH += 1;
      }
      const h = (hsv1[0] + factor * dH + 1) % 1;
      const s = hsv1[1] + factor * (hsv2[1] - hsv1[1]);
      const v = hsv1[2] + factor * (hsv2[2] - hsv1[2]);
      return hsvToRgb(h, s, v);
    }

    const r = Math.round(parsedRgbs[index][0] + factor * (parsedRgbs[index + 1][0] - parsedRgbs[index][0]));
    const g = Math.round(parsedRgbs[index][1] + factor * (parsedRgbs[index + 1][1] - parsedRgbs[index][1]));
    const b = Math.round(parsedRgbs[index][2] + factor * (parsedRgbs[index + 1][2] - parsedRgbs[index][2]));
    return [r, g, b];
  };

  const applyGradientToLine = (line) => {
    if (!hasColors || !line) return line;
    const chars = Array.from(line);
    if (chars.length === 0) return '';
    if (chars.length === 1) {
      const [r, g, b] = parsedRgbs[0];
      return `\x1b[38;2;${r};${g};${b}m${chars[0]}\x1b[39m`;
    }

    return chars
      .map((char, i) => {
        if (char === ' ') return char;
        const progress = i / (chars.length - 1);
        const [r, g, b] = interpolateColor(progress);
        return `\x1b[38;2;${r};${g};${b}m${char}`;
      })
      .join('') + '\x1b[39m';
  };

  const fn = (strings, ...values) => {
    let str;
    if (Array.isArray(strings) && strings.raw) {
      str = strings.reduce((acc, curr, i) => acc + curr + (values[i] ?? ''), '');
    } else {
      str = String(strings ?? '');
    }
    return str.split('\n').map(applyGradientToLine).join('\n');
  };

  fn.multiline = (text) => {
    const lines = String(text ?? '').split('\n');
    if (lines.length <= 1) return fn(text);
    return lines.map((line, i) => {
      const progress = i / (lines.length - 1);
      const [r, g, b] = interpolateColor(progress);
      return `\x1b[38;2;${r};${g};${b}m${line}\x1b[39m`;
    }).join('\n');
  };

  return fn;
}

// Built-in Gradient Palettes
export const gradients = {
  rainbow: gradient(['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8800ff', '#ff00ff']),
  pastel: gradient(['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff']),
  cristal: gradient(['#00f2fe', '#4facfe', '#ffffff']),
  mind: gradient(['#473b7b', '#3584a7', '#30d2be']),
  passion: gradient(['#e53935', '#e35d5b']),
  retro: gradient(['#fe5f55', '#f0b67f', '#d6d1cd', '#c2bbf0', '#8fb8ed']),
  fire: gradient(['#ff0844', '#ffb199']),
  cyber: gradient(['#00f260', '#0575e6']),
  synthwave: gradient(['#ff61d2', '#fe90af', '#5271ff', '#12d8fa']),
  aurora: gradient(['#00c6ff', '#0072ff']),
  sunset: gradient(['#fa8bff', '#2bd2ff', '#2bff88']),
  vice: gradient(['#5de6de', '#b58ecc']),
  fruit: gradient(['#ff4e50', '#f9d423']),
  summer: gradient(['#22c1c3', '#fdbb2d']),
  atlas: gradient(['#feac5e', '#c779d0', '#4bc0c8']),
  sublime: gradient(['#fc5c7d', '#6a82fb'])
};

// Refined Developer Glyphs & Status Indicators (No casual emojis)
export const glyphs = {
  bullet: c.dim('›'),
  pointer: c.hex('#5271FF')('❯'),
  success: c.green('✔'),
  error: c.red('✖'),
  warning: c.yellow('▲'),
  info: c.cyan('●'),
  diamond: c.hex('#FF61D2')('◆'),
  square: c.hex('#5271FF')('■'),
  bar: c.dim('│'),
  branch: c.dim('├──'),
  lastBranch: c.dim('└──')
};

export const badges = {
  success: (text) => c.bgGreen.black.bold(` ${text} `),
  error: (text) => c.bgRed.brightWhite.bold(` ${text} `),
  warning: (text) => c.bgYellow.black.bold(` ${text} `),
  info: (text) => c.bgCyan.black.bold(` ${text} `),
  primary: (text) => c.bgHex('#5271FF').brightWhite.bold(` ${text} `),
  dim: (text) => c.bgHex('#2E3440').hex('#88C0D0').bold(` ${text} `),
  tag: (text) => c.bgHex('#5271FF').brightWhite.bold(` ${text} `)
};

// Backward-compatible alias
export const icons = glyphs;
