import os from 'os';
import { execSync } from 'child_process';
import { c, badges } from '../ui/colors.js';
import { createBox } from '../ui/box.js';
import { renderTable } from '../ui/table.js';

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function getMemoryBar(percent, width = 24) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  const bar = c.hex('#00F260')('█'.repeat(filled)) + c.dim('░'.repeat(empty));
  return `[${bar}] ${percent.toFixed(1)}%`;
}

export function showDashboard() {
  console.clear();
  console.log(`\n${badges.tag('DEVPULSE COCKPIT & SYSTEM DASHBOARD')}\n`);

  // System Metrics
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = (usedMem / totalMem) * 100;
  const cpus = os.cpus();
  const uptimeHours = (os.uptime() / 3600).toFixed(1);

  const sysInfo = [
    `Host:     ${c.bold(os.hostname())} (${os.platform()} ${os.arch()})`,
    `CPUs:     ${cpus.length} cores @ ${cpus[0]?.model ? cpus[0].model.trim() : 'Unknown'}`,
    `Memory:   ${getMemoryBar(memPercent)} (${(usedMem / 1024 / 1024 / 1024).toFixed(1)} GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(1)} GB)`,
    `Uptime:   ${uptimeHours} hours`,
    `Node.js:  ${process.version}`
  ].join('\n');

  console.log(createBox(sysInfo, 'SYSTEM METRICS', '#5271FF'));

  // Git Status
  const branch = safeExec('git branch --show-current');
  let gitContent = '';
  if (branch) {
    const status = safeExec('git status --porcelain');
    const changedCount = status ? status.split('\n').filter(Boolean).length : 0;
    const lastCommit = safeExec('git log -1 --pretty=format:"%h - %s (%cr)"') || 'No commits';

    gitContent = [
      `Branch:      ${c.hex('#50fa7b').bold(branch)}`,
      `Working Tree: ${changedCount > 0 ? c.yellow(`${changedCount} modified files`) : c.green('Clean ✔')}`,
      `Last Commit:  ${c.dim(lastCommit)}`
    ].join('\n');
  } else {
    gitContent = c.dim('Current folder is not a git repository.');
  }

  console.log(createBox(gitContent, 'GIT REPOSITORY', '#FF61D2'));

  // Docker Overview
  const dockerPs = safeExec('docker ps --format "{{.Names}}\t{{.Status}}\t{{.Ports}}"');
  if (dockerPs) {
    const containers = dockerPs.split('\n').filter(Boolean).map((line) => line.split('\t'));
    console.log(c.bold(c.hex('#12D8FA')('  📦 Active Docker Containers:')));
    console.log(renderTable(['Name', 'Status', 'Ports'], containers));
    console.log('');
  } else {
    console.log(c.dim('  📦 Docker daemon inactive or no containers running.\n'));
  }
}
