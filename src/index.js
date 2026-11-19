import { showBanner } from './ui/banner.js';
import { c } from './ui/colors.js';
import { showMenu } from './commands/menu.js';
import { explainError } from './commands/wtf.js';
import { viewLogs } from './commands/logsee.js';
import { gitHelper } from './commands/git.js';
import { runDoctor } from './commands/doctor.js';
import { scaffoldProject } from './commands/scaffold.js';
import { showDashboard } from './commands/top.js';
import { askAi } from './commands/ai.js';
import { handleUtils } from './commands/utils.js';

export async function runCli(argv = process.argv.slice(2)) {
  const cmd = argv[0];

  if (!cmd) {
    await showMenu();
    return;
  }

  if (cmd === '-v' || cmd === '--version') {
    console.log('clivibe v1.0.0');
    return;
  }

  if (cmd === '-h' || cmd === '--help' || cmd === 'help') {
    showBanner();
    console.log(`Usage: ${c.bold(c.hex('#5271FF')('clivibe'))} ${c.dim('[command] [options]')}  ${c.dim('(alias: cv)')}\n`);
    console.log(c.bold('Commands:'));
    console.log(`  ${c.hex('#8be9fd')('clivibe')}                    Launch interactive TUI menu`);
    console.log(`  ${c.hex('#8be9fd')('clivibe wtf [error]')}         Explain failed command/error and suggest fix`);
    console.log(`  ${c.hex('#8be9fd')('clivibe logsee [file]')}       Stream or view JSON logs with colors & search`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git commit')}          Smart conventional commit generator`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git clean')}           Interactive branch cleaner`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git standup')}         Generate markdown standup from commits`);
    console.log(`  ${c.hex('#8be9fd')('clivibe doctor')}              Scan environment, missing envs & ports`);
    console.log(`  ${c.hex('#8be9fd')('clivibe scaffold [name]')}     Generate production-ready starters`);
    console.log(`  ${c.hex('#8be9fd')('clivibe top')}                 Terminal cockpit: system, git & docker gauges`);
    console.log(`  ${c.hex('#8be9fd')('clivibe ai <prompt>')}         Query codebase with local Ollama or heuristics`);
    console.log(`  ${c.hex('#8be9fd')('clivibe kill-port <port>')}    Kill process occupying port`);
    console.log(`  ${c.hex('#8be9fd')('clivibe curl <url>')}          Smart cURL with latency breakdown`);
    console.log(`  ${c.hex('#8be9fd')('clivibe cron "<expr>"')}       Explain cron schedule in plain English`);
    console.log(`  ${c.hex('#8be9fd')('clivibe hash <string>')}       MD5, SHA256, Base64 & UUID suite`);
    console.log(`  ${c.hex('#8be9fd')('clivibe utils')}               Access all developer utilities\n`);
    return;
  }

  switch (cmd) {
    case 'wtf':
    case 'explain':
      await explainError(argv.slice(1).join(' '));
      break;

    case 'logsee':
    case 'logs': {
      let level = null;
      let search = null;
      const fileArgs = [];
      for (let i = 1; i < argv.length; i++) {
        if (argv[i] === '--level' && argv[i + 1]) {
          level = argv[++i];
        } else if (argv[i] === '--search' && argv[i + 1]) {
          search = argv[++i];
        } else {
          fileArgs.push(argv[i]);
        }
      }
      await viewLogs(fileArgs[0], { level, search });
      break;
    }

    case 'git':
      await gitHelper(argv[1], { days: argv.includes('--days') ? argv[argv.indexOf('--days') + 1] : 1 });
      break;

    case 'doctor':
    case 'check':
      await runDoctor();
      break;

    case 'init':
    case 'create':
    case 'scaffold':
      await scaffoldProject(argv[1]);
      break;

    case 'top':
    case 'dash':
    case 'dashboard':
      showDashboard();
      break;

    case 'ai':
    case 'ask':
      await askAi(argv.slice(1).join(' '));
      break;

    case 'kill-port':
      await handleUtils('port', [argv[1]]);
      break;

    case 'curl':
      await handleUtils('curl', [argv[1]]);
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

    default:
      console.log(c.red(`Unknown command: "${cmd}". Run "velx --help" for available commands.\n`));
  }
}
