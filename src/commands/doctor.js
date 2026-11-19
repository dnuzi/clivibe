import fs from 'fs';
import path from 'path';
import net from 'net';
import { execSync } from 'child_process';
import { c, icons, badges } from '../ui/colors.js';
import { renderTable } from '../ui/table.js';
import { createSpinner } from '../ui/spinner.js';

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
}

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

export async function runDoctor() {
  console.log(`\n${badges.tag('ENVDOCTOR - SYSTEM & PROJECT DIAGNOSTICS')}\n`);
  const spinner = createSpinner('Scanning developer environment...').start();

  const results = [];

  // 1. Node.js Check
  const nodeVer = process.version;
  const majorNode = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
  if (majorNode >= 18) {
    results.push([c.green('✔ Pass'), 'Node.js Runtime', `${nodeVer} (Supported)`]);
  } else {
    results.push([c.red('✖ Fail'), 'Node.js Runtime', `${nodeVer} (Requires >= 18.0.0)`]);
  }

  // 2. Git Check
  const gitVer = safeExec('git --version');
  if (gitVer) {
    const author = safeExec('git config user.name');
    results.push([c.green('✔ Pass'), 'Git Version Control', `${gitVer} (${author || 'No user.name set'})`]);
  } else {
    results.push([c.red('✖ Fail'), 'Git Version Control', 'Git CLI is not installed or not in PATH']);
  }

  // 3. Docker Check
  const dockerVer = safeExec('docker --version');
  if (dockerVer) {
    const dockerPs = safeExec('docker ps');
    if (dockerPs !== null) {
      results.push([c.green('✔ Pass'), 'Docker Engine', `${dockerVer} (Daemon Active)`]);
    } else {
      results.push([c.yellow('⚠ Warn'), 'Docker Engine', 'Installed, but Docker daemon is stopped']);
    }
  } else {
    results.push([c.dim('• Skip'), 'Docker Engine', 'Not installed (optional)']);
  }

  // 4. Multi-Language Runtime Checks (Python, Rust, Go)
  const pythonVer = safeExec('python --version') || safeExec('python3 --version');
  if (pythonVer) {
    results.push([c.green('✔ Pass'), 'Python Runtime', pythonVer]);
  }

  const goVer = safeExec('go version');
  if (goVer) {
    results.push([c.green('✔ Pass'), 'Go Runtime', goVer]);
  }

  const rustVer = safeExec('cargo --version');
  if (rustVer) {
    results.push([c.green('✔ Pass'), 'Rust / Cargo', rustVer]);
  }

  // 5. Project Manifest & Dependencies Detection (Multi-Language)
  let projectDetected = false;

  // Node.js
  if (fs.existsSync('package.json')) {
    projectDetected = true;
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const hasDeps = (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) ||
                      (pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0);
      const hasModules = fs.existsSync('node_modules');

      if (!hasDeps) {
        results.push([c.green('✔ Pass'), 'Node Project', 'Zero dependencies required!']);
      } else if (hasModules) {
        results.push([c.green('✔ Pass'), 'Node Project', 'node_modules is present']);
      } else {
        results.push([c.yellow('⚠ Warn'), 'Node Project', 'Dependencies listed in package.json but node_modules missing. Run npm install']);
      }
    } catch {
      results.push([c.dim('• Skip'), 'Node Project', 'Unable to parse package.json']);
    }
  }

  // Python
  if (fs.existsSync('requirements.txt') || fs.existsSync('pyproject.toml') || fs.existsSync('Pipfile')) {
    projectDetected = true;
    const hasVenv = fs.existsSync('.venv') || fs.existsSync('venv') || process.env.VIRTUAL_ENV;
    results.push([
      hasVenv ? c.green('✔ Pass') : c.yellow('⚠ Warn'),
      'Python Project',
      hasVenv ? 'Virtual environment active' : 'No .venv detected. Consider running: python -m venv .venv'
    ]);
  }

  // Rust
  if (fs.existsSync('Cargo.toml')) {
    projectDetected = true;
    results.push([c.green('✔ Pass'), 'Rust Project', 'Cargo.toml found']);
  }

  // Go
  if (fs.existsSync('go.mod')) {
    projectDetected = true;
    results.push([c.green('✔ Pass'), 'Go Project', 'go.mod module detected']);
  }

  if (!projectDetected) {
    results.push([c.dim('• Info'), 'Project Manifest', 'Generic workspace (no manifest file detected)']);
  }

  // 5. Environment Variables check (.env.example vs .env)
  if (fs.existsSync('.env.example')) {
    if (fs.existsSync('.env')) {
      const exampleContent = fs.readFileSync('.env.example', 'utf-8');
      const actualContent = fs.readFileSync('.env', 'utf-8');

      const parseKeys = (str) =>
        str
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l && !l.startsWith('#'))
          .map((l) => l.split('=')[0].trim());

      const exampleKeys = parseKeys(exampleContent);
      const actualKeys = new Set(parseKeys(actualContent));
      const missing = exampleKeys.filter((k) => !actualKeys.has(k));

      if (missing.length === 0) {
        results.push([c.green('✔ Pass'), 'Environment Variables', 'All .env.example keys exist in .env']);
      } else {
        results.push([c.red('✖ Fail'), 'Environment Variables', `Missing in .env: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}`]);
      }
    } else {
      results.push([c.yellow('⚠ Warn'), 'Environment Variables', '.env.example exists but .env is missing!']);
    }
  }

  // 6. Common Dev Ports Check
  const devPorts = [3000, 5173, 8080, 5432];
  const occupied = [];
  for (const port of devPorts) {
    const free = await isPortFree(port);
    if (!free) occupied.push(port);
  }

  if (occupied.length > 0) {
    results.push([c.yellow('⚠ Active'), 'Dev Ports in Use', `Ports ${occupied.join(', ')} currently bound`]);
  } else {
    results.push([c.green('✔ Pass'), 'Dev Ports Status', 'Standard ports (3000, 5173, 8080) are free']);
  }

  spinner.stop();

  console.log(renderTable(['Status', 'Check', 'Details'], results));
  console.log('');
}
