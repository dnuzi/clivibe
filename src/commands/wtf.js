import { c, icons, badges } from '../ui/colors.js';
import { createBox } from '../ui/box.js';
import { createSpinner } from '../ui/spinner.js';

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

// Comprehensive pattern matching database for instant offline analysis
const ERROR_PATTERNS = [
  {
    regex: /EADDRINUSE.*?[:\s](\d+)/i,
    type: 'PORT CONFLICT',
    cause: (m) => `Port ${m[1] || 'specified'} is already in use by another process.`,
    fixes: (m) => [
      `Run ${c.hex('#8be9fd')(`devpulse utils port ${m[1] || 'PORT'}`)} to inspect and terminate it.`,
      `Or manually kill: ${c.hex('#f1fa8c')(process.platform === 'win32' ? `npx kill-port ${m[1]}` : `lsof -ti:${m[1]} | xargs kill -9`)}`,
      `Or change the port in your ${c.bold('.env')} file.`
    ]
  },
  {
    regex: /Cannot find module ['"]([^'"]+)['"]/i,
    type: 'MISSING DEPENDENCY',
    cause: (m) => `The JavaScript module ${c.bold(m[1])} is not installed in node_modules.`,
    fixes: (m) => [
      `Install the package: ${c.hex('#8be9fd')(`npm install ${m[1]}`)}`,
      `Or restore all dependencies: ${c.hex('#8be9fd')(`npm install`)}`,
      `Check your ${c.bold('package.json')} to ensure the package name is spelled correctly.`
    ]
  },
  {
    regex: /ModuleNotFoundError: No module named ['"]([^'"]+)['"]/i,
    type: 'PYTHON PACKAGE MISSING',
    cause: (m) => `Python package ${c.bold(m[1])} is not installed in the active environment.`,
    fixes: (m) => [
      `Install via pip: ${c.hex('#8be9fd')(`pip install ${m[1]}`)}`,
      `If using a virtualenv, ensure it is activated: ${c.hex('#f1fa8c')('source .venv/bin/activate')} (or .venv\\Scripts\\activate on Windows).`,
      `Or install from requirements: ${c.hex('#8be9fd')('pip install -r requirements.txt')}`
    ]
  },
  {
    regex: /borrow of moved value:? `([^`]+)`/i,
    type: 'RUST OWNERSHIP ERROR',
    cause: (m) => `Value '${m[1]}' was moved and can no longer be accessed here in Rust.`,
    fixes: (m) => [
      `Clone the value before moving: ${c.hex('#8be9fd')(`${m[1]}.clone()`)}`,
      `Borrow with a reference (&${m[1]}) instead of taking full ownership.`,
      `Check if the type can implement the ${c.bold('Copy')} trait.`
    ]
  },
  {
    regex: /imported and not used: "([^"]+)"/i,
    type: 'GO UNUSED IMPORT',
    cause: (m) => `Go compiler requires all imported packages to be referenced. Package '${m[1]}' is unused.`,
    fixes: (m) => [
      `Remove '${m[1]}' from your import declaration.`,
      `Or use a blank identifier if imported for side-effects: ${c.hex('#8be9fd')(`_ "${m[1]}"`)}`,
      `Run ${c.hex('#8be9fd')('goimports -w .')} to clean imports automatically.`
    ]
  },
  {
    regex: /ECONNREFUSED.*?([0-9.]+):(\d+)/i,
    type: 'CONNECTION REFUSED',
    cause: (m) => `Cannot connect to target service at ${m[1]}:${m[2]}. The service is not running or the port is wrong.`,
    fixes: (m) => [
      `Verify if the backend service, database, or container is running.`,
      `If it is Docker, check container status: ${c.hex('#8be9fd')('docker ps')}`,
      `Verify host and port configurations in your environment variables.`
    ]
  },
  {
    regex: /password authentication failed for user ['"]?([^'"\s]+)['"]?/i,
    type: 'DATABASE AUTH FAILURE',
    cause: (m) => `PostgreSQL rejected the password for database user '${m[1]}'.`,
    fixes: (m) => [
      `Verify ${c.bold('DATABASE_URL')} or DB_PASSWORD in your ${c.bold('.env')} file.`,
      `Test connecting directly: ${c.hex('#8be9fd')(`psql -U ${m[1]} -h localhost`)}`,
      `Reset user password in PostgreSQL: ${c.hex('#f1fa8c')(`ALTER USER ${m[1]} WITH PASSWORD 'newpassword';`)}`
    ]
  },
  {
    regex: /error: failed to push some refs to/i,
    type: 'GIT OUT OF SYNC',
    cause: () => 'The remote git branch contains commits that your local branch does not have.',
    fixes: () => [
      `Pull remote changes with rebase: ${c.hex('#8be9fd')('git pull --rebase origin <branch>')}`,
      `Resolve any merge conflicts, then push: ${c.hex('#8be9fd')('git push')}`
    ]
  },
  {
    regex: /docker: Cannot connect to the Docker daemon/i,
    type: 'DOCKER SERVICE STOPPED',
    cause: () => 'The Docker daemon is not running on this machine.',
    fixes: () => [
      `Start Docker Desktop or run ${c.hex('#8be9fd')('sudo systemctl start docker')}`,
      `Check if current user is in docker group: ${c.hex('#8be9fd')('sudo usermod -aG docker $USER')}`
    ]
  },
  {
    regex: /SyntaxError: Unexpected token/i,
    type: 'SYNTAX ERROR',
    cause: () => 'A syntax error occurred (e.g. unclosed bracket, missing quote, or unsupported JS/TS feature).',
    fixes: () => [
      `Check the file path and line number indicated in the error stack trace.`,
      `Ensure your build tools (TypeScript/Babel) are configured to support the target syntax.`
    ]
  },
  {
    regex: /Hydration failed because the initial UI does not match/i,
    type: 'REACT HYDRATION MISMATCH',
    cause: () => 'Server-rendered HTML differs from the client-rendered HTML.',
    fixes: () => [
      `Avoid using browser-only APIs (${c.bold('window')}, ${c.bold('localStorage')}, ${c.bold('Date.now()')}) during initial render.`,
      `Wrap client-only components in a ${c.bold('useEffect')} or dynamic import with ${c.bold('{ ssr: false }')}.`,
      `Check for invalid HTML nesting like ${c.bold('<p> inside <p>')} or ${c.bold('<div> inside <p>')}.`
    ]
  },
  {
    regex: /EACCES: permission denied/i,
    type: 'PERMISSION DENIED',
    cause: () => 'The current process does not have write or execute permissions for this file or directory.',
    fixes: () => [
      `Check file permissions or owner: ${c.hex('#8be9fd')('ls -la')}`,
      `Change ownership to current user: ${c.hex('#8be9fd')('sudo chown -R $USER <directory>')}`,
      `Avoid running npm with sudo; configure npm prefix instead.`
    ]
  }
];

export async function explainError(inputError) {
  let errorText = inputError ? String(inputError).trim() : '';

  // If no argument, attempt to read piped stdin
  if (!errorText) {
    errorText = (await readPipedStdin(60)) || '';
  }

  if (!errorText) {
    console.log(c.yellow(`\n${icons.warning} No error provided to explain.`));
    console.log(c.dim(`Usage:`));
    console.log(`  ${c.hex('#8be9fd')('devpulse wtf "Error: listen EADDRINUSE :3000"')}`);
    console.log(`  ${c.hex('#8be9fd')('npm run build 2>&1 | devpulse wtf')}\n`);
    return;
  }

  console.log(`\n${badges.tag('DEV-PULSE ERROR ANALYZER')}\n`);

  const spinner = createSpinner('Analyzing error signature...').start();
  await new Promise((r) => setTimeout(r, 400));

  // Match against built-in heuristics
  let matchFound = null;
  for (const pattern of ERROR_PATTERNS) {
    const match = errorText.match(pattern.regex);
    if (match) {
      matchFound = {
        type: pattern.type,
        cause: pattern.cause(match),
        fixes: pattern.fixes(match)
      };
      break;
    }
  }

  spinner.stop();

  if (matchFound) {
    const boxContent = [
      `${badges.error(matchFound.type)}`,
      '',
      `${c.bold('💡 Root Cause:')}`,
      `  ${matchFound.cause}`,
      '',
      `${c.bold('🛠️  Recommended Fixes:')}`,
      ...matchFound.fixes.map((f, i) => `  ${c.hex('#5271FF')(`${i + 1}.`)} ${f}`)
    ].join('\n');

    console.log(createBox(boxContent, 'ERROR DIAGNOSIS', '#FF61D2'));
  } else {
    // Generic fallback diagnostic
    const lines = errorText.split('\n');
    const firstFew = lines.slice(0, 4).join('\n');

    const boxContent = [
      `${badges.warning('GENERAL FAILURE')}`,
      '',
      `${c.bold('Raw Signature:')}`,
      c.dim(firstFew),
      '',
      `${c.bold('💡 Analysis:')}`,
      `  The process terminated with an unhandled exception or non-zero exit code.`,
      '',
      `${c.bold('🛠️  Recommended Debug Steps:')}`,
      `  1. Run with debug flags: ${c.hex('#8be9fd')('DEBUG=* npm run ...')} or verbose log level.`,
      `  2. Check your environment with: ${c.hex('#8be9fd')('devpulse doctor')}`,
      `  3. Check log streams with: ${c.hex('#8be9fd')('devpulse logsee <logfile>')}`
    ].join('\n');

    console.log(createBox(boxContent, 'ERROR REPORT', '#FFB199'));
  }
}
