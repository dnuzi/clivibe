// Native Zero-Dependency System & Hardware Inspector
// Pure standard library — 0 external dependencies

import os from 'os';
import { c, badges, glyphs } from '../ui/colors.js';
import { renderTable } from '../ui/table.js';
import { renderGauge } from '../ui/widgets.js';

function formatBytes(bytes) {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d > 0 ? `${d}d ` : ''}${h}h ${m}m`;
}

export function runSysinfo() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);

  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(`${name}: ${iface.address}`);
      }
    }
  }

  console.log(`\n${badges.primary('SYSTEM & HARDWARE SPECS')}\n`);

  const rows = [
    ['Operating System', `${os.type()} ${os.release()} (${os.platform()})`],
    ['Architecture', `${os.arch()} / Endian: ${os.endianness()}`],
    ['CPU Model', `${cpus[0]?.model || 'Generic'} (${cpus.length} cores)`],
    ['CPU Speed', `${cpus[0]?.speed || 0} MHz`],
    ['Memory Total', formatBytes(totalMem)],
    ['Memory Used', `${formatBytes(usedMem)} (${memPercent}%)`],
    ['Memory Free', formatBytes(freeMem)],
    ['System Uptime', formatUptime(os.uptime())],
    ['Host Name', os.hostname()],
    ['Local IPv4', ips.join(', ') || '127.0.0.1'],
    ['Node.js Runtime', `${process.version} (V8: ${process.versions.v8})`]
  ];

  console.log(renderTable(['Property', 'Value'], rows));
  console.log('');
  console.log(`  RAM Utilization: ${renderGauge(memPercent, { width: 30 })}`);
  console.log('');
}
