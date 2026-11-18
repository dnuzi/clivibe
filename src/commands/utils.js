import crypto from 'crypto';
import { execSync } from 'child_process';
import { c, icons, badges } from '../ui/colors.js';
import { renderTable } from '../ui/table.js';
import { createBox } from '../ui/box.js';

export async function handleUtils(subtool, args = []) {
  if (subtool === 'port' || subtool === 'kill-port') {
    await handlePort(args[0]);
  } else if (subtool === 'curl') {
    await handleCurl(args[0]);
  } else if (subtool === 'cron') {
    handleCron(args.join(' '));
  } else if (subtool === 'hash') {
    handleHash(args.join(' '));
  } else {
    console.log(`\n${badges.tag('DEVPULSE DEVELOPER UTILITIES')}\n`);
    console.log(`Commands:`);
    console.log(`  ${c.hex('#8be9fd')('devpulse utils port <port>')}     - Inspect and terminate process on port`);
    console.log(`  ${c.hex('#8be9fd')('devpulse utils curl <url>')}       - Smart HTTP tester with latency metrics`);
    console.log(`  ${c.hex('#8be9fd')('devpulse utils cron "<expr>">')}    - Cron expression human explainer`);
    console.log(`  ${c.hex('#8be9fd')('devpulse utils hash <text>')}      - MD5, SHA256, Base64 & UUID generator\n`);
  }
}

async function handlePort(port) {
  if (!port) {
    console.log(c.yellow(`\n${icons.warning} Please specify a port (e.g. devpulse utils port 3000)`));
    return;
  }

  console.log(`\n${badges.tag(`PORT INSPECTOR - :${port}`)}\n`);

  try {
    if (process.platform === 'win32') {
      const netstat = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' }).trim();
      const lines = netstat.split('\n').filter(Boolean);
      if (lines.length === 0) {
        console.log(c.green(`${icons.success} Port ${port} is free!`));
        return;
      }
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') pids.add(pid);
      }
      for (const pid of pids) {
        console.log(c.yellow(`Process PID ${pid} is occupying port ${port}.`));
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(c.green(`${icons.success} Terminated process PID ${pid}. Port ${port} is now free!`));
        } catch {
          console.log(c.red(`${icons.error} Failed to kill PID ${pid}. Try running as Administrator.`));
        }
      }
    } else {
      const pid = execSync(`lsof -ti:${port}`, { encoding: 'utf-8' }).trim();
      if (!pid) {
        console.log(c.green(`${icons.success} Port ${port} is free!`));
        return;
      }
      execSync(`kill -9 ${pid}`);
      console.log(c.green(`${icons.success} Killed process ${pid} on port ${port}!`));
    }
  } catch {
    console.log(c.green(`${icons.success} Port ${port} is currently free!`));
  }
}

async function handleCurl(url) {
  if (!url) {
    console.log(c.yellow(`\n${icons.warning} Please provide a URL (e.g. devpulse utils curl https://api.github.com)`));
    return;
  }
  const targetUrl = url.startsWith('http') ? url : `http://${url}`;
  console.log(`\n${badges.tag('SMART CURL')}: ${c.bold(targetUrl)}\n`);

  const startTime = performance.now();
  try {
    const res = await fetch(targetUrl);
    const duration = Math.round(performance.now() - startTime);

    const statusBadge = res.ok ? c.bgGreen(c.black(` ${res.status} ${res.statusText} `)) : c.bgRed(c.brightWhite(` ${res.status} ${res.statusText} `));

    console.log(`Status:   ${statusBadge}`);
    console.log(`Latency:  ${c.hex('#50fa7b').bold(`${duration} ms`)}`);
    console.log(`Type:     ${c.dim(res.headers.get('content-type') || 'unknown')}\n`);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      console.log(c.dim('--- Response Body (JSON) ---'));
      console.log(JSON.stringify(json, null, 2).slice(0, 1000));
      if (JSON.stringify(json).length > 1000) console.log(c.dim('... (truncated)'));
    } else {
      const text = await res.text();
      console.log(c.dim('--- Response Body ---'));
      console.log(text.slice(0, 500));
      if (text.length > 500) console.log(c.dim('... (truncated)'));
    }
    console.log('');
  } catch (err) {
    console.log(c.red(`\n${icons.error} Request failed: ${err.message}\n`));
  }
}

function handleCron(expr) {
  if (!expr) {
    console.log(c.yellow(`\n${icons.warning} Provide a cron expression (e.g. devpulse utils cron "*/15 * * * *")`));
    return;
  }

  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5) {
    console.log(c.red(`\n${icons.error} Invalid cron format. Expected 5 fields (minute hour day month weekday)`));
    return;
  }

  const [min, hour, dom, mon, dow] = parts;
  let explanation = 'Runs ';

  if (min === '*' && hour === '*') explanation += 'every minute';
  else if (min.startsWith('*/')) explanation += `every ${min.replace('*/', '')} minutes`;
  else if (hour === '*' && min !== '*') explanation += `at minute ${min} of every hour`;
  else explanation += `at ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;

  if (dom !== '*') explanation += ` on day-of-month ${dom}`;
  if (mon !== '*') explanation += ` in month ${mon}`;
  if (dow !== '*') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    explanation += ` on ${dow.split(',').map((d) => days[d] || d).join(', ')}`;
  }

  const box = [
    `Expression:  ${c.bold(c.hex('#8be9fd')(expr))}`,
    `Meaning:     ${c.hex('#50fa7b').bold(explanation)}`,
    '',
    `Field breakdown:`,
    `  Minute:  ${min} | Hour: ${hour} | Day: ${dom} | Month: ${mon} | Weekday: ${dow}`
  ].join('\n');

  console.log(createBox(box, 'CRON EXPLAINER', '#00F260'));
}

function handleHash(input) {
  const text = input || 'hello world';
  const md5 = crypto.createHash('md5').update(text).digest('hex');
  const sha1 = crypto.createHash('sha1').update(text).digest('hex');
  const sha256 = crypto.createHash('sha256').update(text).digest('hex');
  const base64 = Buffer.from(text).toString('base64');
  const uuid = crypto.randomUUID();

  const rows = [
    ['Input', text],
    ['MD5', md5],
    ['SHA-1', sha1],
    ['SHA-256', sha256],
    ['Base64', base64],
    ['Random UUID', uuid]
  ];

  console.log(`\n${badges.tag('HASH & ENCODING SUITE')}\n`);
  console.log(renderTable(['Algorithm', 'Result'], rows));
  console.log('');
}
