import { showBanner } from './ui/banner.js';
import { c, gradients, gradient } from './ui/colors.js';
import { showMenu } from './commands/menu.js';
import { explainError } from './commands/wtf.js';
import { viewLogs } from './commands/logsee.js';
import { gitHelper } from './commands/git.js';
import { runDoctor } from './commands/doctor.js';
import { scaffoldProject } from './commands/scaffold.js';
import { showDashboard } from './commands/top.js';
import { askAi } from './commands/ai.js';
import { handleUtils } from './commands/utils.js';
import { renderImage } from './ui/image.js';
import { boxen } from './ui/box.js';
import { sparkline, plot } from './ui/chart.js';
import { startServer } from './commands/serve.js';
import { runDiff } from './commands/diff.js';
import { runJson } from './commands/json.js';
import { runSysinfo } from './commands/sysinfo.js';

// Export all UI design primitives for library usage
export * from './ui/index.js';
export { startServer } from './commands/serve.js';
export { computeDiff, runDiff } from './commands/diff.js';
export { highlightJson, runJson } from './commands/json.js';
export { runSysinfo } from './commands/sysinfo.js';

export async function runCli(argv = process.argv.slice(2)) {
  const cmd = argv[0];

  if (!cmd) {
    await showMenu();
    return;
  }

  if (cmd === '-v' || cmd === '--version') {
    console.log('clivibe v1.3.0');
    return;
  }

  if (cmd === '-h' || cmd === '--help' || cmd === 'help') {
    showBanner();
    console.log(`Usage: ${c.bold(c.hex('#5271FF')('clivibe'))} ${c.dim('[command] [options]')}  ${c.dim('(alias: cv)')}\n`);
    console.log(c.bold('Developer Cockpit:'));
    console.log(`  ${c.hex('#8be9fd')('clivibe')}                    Launch interactive TUI menu`);
    console.log(`  ${c.hex('#8be9fd')('clivibe doctor')}              Scan environment, missing envs & ports`);
    console.log(`  ${c.hex('#8be9fd')('clivibe wtf [error]')}         Explain failed command/error and suggest fix`);
    console.log(`  ${c.hex('#8be9fd')('clivibe serve [dir] [port]')}  Instant static web server with live logger`);
    console.log(`  ${c.hex('#8be9fd')('clivibe diff <f1> <f2>')}      Unified side-by-side color file diff`);
    console.log(`  ${c.hex('#8be9fd')('clivibe json <file> [path]')}  Syntax-highlighted JSON viewer & query`);
    console.log(`  ${c.hex('#8be9fd')('clivibe sysinfo')}             Hardware, CPU, RAM & network specs`);
    console.log(`  ${c.hex('#8be9fd')('clivibe logsee [file]')}       Stream or view JSON logs with colors & search`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git commit')}          Smart conventional commit generator`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git clean')}           Interactive branch cleaner`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git standup')}         Generate markdown standup from commits`);
    console.log(`  ${c.hex('#8be9fd')('clivibe scaffold [name]')}     Generate production-ready starters`);
    console.log(`  ${c.hex('#8be9fd')('clivibe top')}                 Terminal cockpit: system, git & docker gauges`);
    console.log(`  ${c.hex('#8be9fd')('clivibe ai <prompt>')}         Query codebase with local Ollama or heuristics`);
    console.log(`  ${c.hex('#8be9fd')('clivibe kill-port <port>')}    Kill process occupying port`);
    console.log(`  ${c.hex('#8be9fd')('clivibe curl <url>')}          Smart cURL with latency breakdown`);
    console.log(`  ${c.hex('#8be9fd')('clivibe cron "<expr>"')}       Explain cron schedule in plain English`);
    console.log(`  ${c.hex('#8be9fd')('clivibe hash <string>')}       MD5, SHA256, Base64 & UUID suite`);
    console.log(`  ${c.hex('#8be9fd')('clivibe utils')}               Access all developer utilities\n`);

    console.log(c.bold('Terminal Design & UI Suite (Zero-Dependency):'));
    console.log(`  ${c.hex('#FF61D2')('clivibe image <file>')}        TrueColor image preview in terminal (PNG, BMP, PPM)`);
    console.log(`  ${c.hex('#FF61D2')('clivibe gradient "<text>')}     Colorize text with multi-stop gradients`);
    console.log(`  ${c.hex('#FF61D2')('clivibe chart <1,5,3,9>')}     Render 2D ASCII line chart`);
    console.log(`  ${c.hex('#FF61D2')('clivibe spark <1,5,3,9>')}     Render inline sparkline`);
    console.log(`  ${c.hex('#FF61D2')('clivibe box "<text>')}          Render styled box with title\n`);
    return;
  }

  switch (cmd) {
    case 'serve':
      startServer(argv[1], argv[2]);
      break;

    case 'diff':
      runDiff(argv[1], argv[2]);
      break;

    case 'json':
      runJson(argv[1], argv[2]);
      break;

    case 'sysinfo':
    case 'info':
      runSysinfo();
      break;

    case 'wtf':
    case 'explain':
      await explainError(argv.slice(1).join(' '));
      break;

    case 'logsee':
    case 'logs': {
      let level = null;
      let search = null;
      let file = null;

      for (let i = 1; i < argv.length; i++) {
        if (argv[i] === '--level' && argv[i + 1]) {
          level = argv[++i];
        } else if (argv[i] === '--search' && argv[i + 1]) {
          search = argv[++i];
        } else if (!argv[i].startsWith('-')) {
          file = argv[i];
        }
      }
      await viewLogs(file, { level, search });
      break;
    }

    case 'git':
      await gitHelper(argv.slice(1));
      break;

    case 'doctor':
      await runDoctor();
      break;

    case 'scaffold':
      await scaffoldProject(argv[1]);
      break;

    case 'top':
      await showDashboard();
      break;

    case 'ai':
      await askAi(argv.slice(1).join(' '));
      break;

    case 'kill-port':
    case 'kill':
      await handleUtils('kill-port', argv.slice(1));
      break;

    case 'curl':
      await handleUtils('curl', argv.slice(1));
      break;

    case 'cron':
      await handleUtils('cron', argv.slice(1));
      break;

    case 'hash':
      await handleUtils('hash', argv.slice(1));
      break;

    case 'utils':
      await handleUtils(argv[1], argv.slice(2));
      break;

    // UI Design Suite Subcommands
    case 'image':
    case 'preview': {
      const filePath = argv[1];
      if (!filePath) {
        console.error(c.red('Please provide an image file path. Example: clivibe image logo.png'));
        process.exit(1);
      }
      console.log(renderImage(filePath, { width: 60 }));
      break;
    }

    case 'gradient': {
      let preset = 'synthwave';
      const textParts = [];
      for (let i = 1; i < argv.length; i++) {
        if (argv[i] === '--preset' && argv[i + 1]) {
          preset = argv[++i];
        } else {
          textParts.push(argv[i]);
        }
      }
      const text = textParts.join(' ') || 'CLIVIBE GRADIENT ENGINE';
      const gradFn = gradients[preset] || gradients.synthwave;
      console.log(gradFn(text));
      break;
    }

    case 'chart': {
      const raw = argv[1] || '10,25,18,34,42,29,55,48,62,40,30';
      const numbers = raw.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
      console.log(plot(numbers, { height: 8, gradient: gradients.cyber }));
      break;
    }

    case 'spark':
    case 'sparkline': {
      const raw = argv[1] || '1,4,2,8,12,6,15,9,20,14,24';
      const numbers = raw.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
      console.log(sparkline(numbers, { gradient: gradients.synthwave }));
      break;
    }

    case 'box': {
      let title = '';
      const textParts = [];
      for (let i = 1; i < argv.length; i++) {
        if (argv[i] === '--title' && argv[i + 1]) {
          title = argv[++i];
        } else {
          textParts.push(argv[i]);
        }
      }
      const text = textParts.join(' ') || 'Hello from clivibe box!';
      console.log(boxen(text, { title, borderColor: '#5271FF' }));
      break;
    }

    default:
      console.log(c.red(`Unknown command: "${cmd}". Run "clivibe --help" for available commands.\n`));
  }
}
