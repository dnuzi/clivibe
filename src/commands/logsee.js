import fs from 'fs';
import readline from 'readline';
import { c, badges } from '../ui/colors.js';

async function readPipedStdin(timeoutMs = 60) {
  if (process.stdin.isTTY) return null;
  return new Promise((resolve) => {
    let data = '';
    const timer = setTimeout(() => {
      if (process.stdin.pause) process.stdin.pause();
      resolve(data.trim() || null);
    }, timeoutMs);

    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      clearTimeout(timer);
      resolve(data.trim() || null);
    });
  });
}

export async function viewLogs(filePath, options = {}) {
  const targetLevel = options.level ? options.level.toUpperCase() : null;
  const searchFilter = options.search ? options.search.toLowerCase() : null;

  let rawContent = null;

  if (filePath && fs.existsSync(filePath)) {
    rawContent = fs.readFileSync(filePath, 'utf-8');
  } else {
    rawContent = await readPipedStdin(60);
  }

  if (!rawContent) {
    // Generate simulated high-tech demo logs if no file/pipe is provided
    console.log(c.cyan(`\nℹ No log file or pipe provided. Showing live demo logs:`));
    console.log(c.dim(`  Tip: Pipe your logs with: app | devpulse logsee\n`));
    const demoLogs = [
      { timestamp: new Date(Date.now() - 5000).toISOString(), level: 'INFO', service: 'auth-api', msg: 'JWT issued for user_1092', status: 200, duration_ms: 18 },
      { timestamp: new Date(Date.now() - 4200).toISOString(), level: 'INFO', service: 'gateway', msg: 'Incoming GET /api/v1/orders', status: 200, duration_ms: 45 },
      { timestamp: new Date(Date.now() - 3100).toISOString(), level: 'WARN', service: 'cache', msg: 'Redis cache miss for key user:prefs:1092', latency: '12ms' },
      { timestamp: new Date(Date.now() - 2000).toISOString(), level: 'ERROR', service: 'billing', msg: 'Stripe webhook retry: timeout reaching payment gateway', status: 504, attempt: 3 },
      { timestamp: new Date(Date.now() - 800).toISOString(), level: 'INFO', service: 'worker', msg: 'Background queue processed 14 pending jobs', queue: 'email-dispatch' }
    ];

    printLogList(demoLogs);
    return;
  }

  const lines = rawContent.split('\n').filter((l) => l.trim());
  const logs = [];

  for (const line of lines) {
    try {
      logs.push(JSON.parse(line));
    } catch {
      logs.push({ timestamp: new Date().toISOString(), level: 'RAW', msg: line });
    }
  }

  const filtered = logs.filter((item) => {
    const lvl = (item.level || item.lvl || 'INFO').toUpperCase();
    if (targetLevel && lvl !== targetLevel) return false;
    if (searchFilter) {
      const str = JSON.stringify(item).toLowerCase();
      if (!str.includes(searchFilter)) return false;
    }
    return true;
  });

  printLogList(filtered);
}

function getLevelBadge(level) {
  const l = String(level).toUpperCase();
  switch (l) {
    case 'FATAL':
    case 'ERROR':
      return c.bgRed(c.brightWhite(' ERROR '));
    case 'WARN':
    case 'WARNING':
      return c.bgYellow(c.black(' WARN  '));
    case 'INFO':
      return c.bgCyan(c.black(' INFO  '));
    case 'DEBUG':
      return c.bgHex('#2E3440')(c.hex('#88C0D0')(' DEBUG '));
    default:
      return c.bgGray(c.white(` ${l.padEnd(5)} `));
  }
}

function printLogList(items) {
  if (items.length === 0) {
    console.log(c.yellow(`\nNo matching log records found.`));
    return;
  }

  console.log(`\n${badges.tag(`LOGSEE - ${items.length} RECORDS`)}\n`);

  for (const item of items) {
    const time = item.timestamp || item.time || item['@timestamp'] || '';
    const formattedTime = time ? c.dim(time.replace('T', ' ').slice(0, 19)) : c.dim('--:--:--');
    const levelBadge = getLevelBadge(item.level || item.lvl || 'INFO');
    const service = item.service || item.app || item.context ? c.hex('#FE90AF')(`[${item.service || item.app || item.context}]`) : '';
    const message = item.msg || item.message || JSON.stringify(item);

    let extra = '';
    if (item.status) {
      const statusColor = item.status >= 500 ? c.red : item.status >= 400 ? c.yellow : c.green;
      extra += ` ${statusColor(String(item.status))}`;
    }
    if (item.duration_ms) {
      extra += ` ${c.dim(`(${item.duration_ms}ms)`)}`;
    }

    console.log(`${formattedTime} ${levelBadge} ${service} ${c.white(message)}${extra}`);
  }
  console.log('');
}
