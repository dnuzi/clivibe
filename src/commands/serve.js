// Native Zero-Dependency HTTP Static File Server
// Pure standard library — 0 external dependencies

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { c, badges, glyphs } from '../ui/colors.js';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.wasm': 'application/wasm'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

export function startServer(targetDir = '.', requestedPort = 3000) {
  const root = path.resolve(process.cwd(), targetDir);
  const port = parseInt(requestedPort, 10) || 3000;

  if (!fs.existsSync(root)) {
    console.log(c.red(`\n${glyphs.error} Directory not found: ${root}\n`));
    return;
  }

  const server = http.createServer((req, res) => {
    const startTime = performance.now();
    let safeUrl = decodeURI(req.url.split('?')[0]);
    if (safeUrl.endsWith('/')) safeUrl += 'index.html';

    const filePath = path.join(root, safeUrl);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(root)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      const elapsed = Math.round(performance.now() - startTime);

      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 Not Found</h1><p>${safeUrl}</p>`);
        console.log(`  ${c.bgRed.brightWhite(' 404 ')} ${c.dim(req.method)} ${safeUrl} ${c.dim(`(${elapsed}ms)`)}`);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache'
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);

      const statusBadge = c.bgGreen.black(' 200 ');
      console.log(`  ${statusBadge} ${c.bold(req.method)} ${safeUrl} ${c.dim(`${contentType} · ${elapsed}ms`)}`);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(c.yellow(`\n${glyphs.warning} Port ${port} is in use. Retrying on port ${port + 1}...`));
      startServer(targetDir, port + 1);
    } else {
      console.log(c.red(`\n${glyphs.error} Server error: ${err.message}`));
    }
  });

  server.listen(port, () => {
    const localIp = getLocalIp();
    console.log(`\n${badges.primary('HTTP STATIC SERVER')}\n`);
    console.log(`  ${glyphs.pointer} Local:    ${c.hex('#5271FF').bold(`http://localhost:${port}`)}`);
    console.log(`  ${glyphs.pointer} Network:  ${c.hex('#12D8FA')(`http://${localIp}:${port}`)}`);
    console.log(`  ${glyphs.pointer} Serving:  ${c.dim(root)}`);
    console.log(c.dim(`\n  Press Ctrl+C to terminate\n`));
  });

  return server;
}
