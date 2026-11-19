import { showBanner } from '../ui/banner.js';
import { c, badges } from '../ui/colors.js';
import { promptSelect } from '../ui/prompt.js';
import { explainError } from './wtf.js';
import { viewLogs } from './logsee.js';
import { gitHelper } from './git.js';
import { runDoctor } from './doctor.js';
import { scaffoldProject } from './scaffold.js';
import { showDashboard } from './top.js';
import { askAi } from './ai.js';
import { handleUtils } from './utils.js';

export async function showMenu() {
  showBanner();

  const choice = await promptSelect({
    message: 'Select a developer tool to launch:',
    choices: [
      { name: '⚡ Dashboard (TUI)', value: 'top', desc: 'Live system, git, docker, and port gauges' },
      { name: '🚨 Explain Error (wtf)', value: 'wtf', desc: 'Diagnose command failure and suggest fixes' },
      { name: '📜 JSON Log Viewer (logsee)', value: 'logsee', desc: 'Inspect, filter & pretty-print JSON logs' },
      { name: '🌿 Git AI Assistant', value: 'git', desc: 'Smart commits, branch cleaner, standup report' },
      { name: '🩺 Environment Doctor', value: 'doctor', desc: 'Check runtimes, missing envs & port conflicts' },
      { name: '📦 Project Scaffolder', value: 'scaffold', desc: 'Generate production-ready starters' },
      { name: '🤖 Local AI Assistant', value: 'ai', desc: 'Ask questions about codebase' },
      { name: '🛠️  Daily Utilities', value: 'utils', desc: 'Kill-port, smart curl, cron & hash tools' },
      { name: '❌ Exit', value: 'exit', desc: 'Quit clixy' }
    ]
  });

  if (choice === 'top') {
    showDashboard();
  } else if (choice === 'wtf') {
    await explainError();
  } else if (choice === 'logsee') {
    await viewLogs();
  } else if (choice === 'git') {
    await gitHelper();
  } else if (choice === 'doctor') {
    await runDoctor();
  } else if (choice === 'scaffold') {
    await scaffoldProject();
  } else if (choice === 'ai') {
    await askAi('where is auth or api handled?');
  } else if (choice === 'utils') {
    await handleUtils();
  } else {
    console.log(c.dim('Goodbye! 👋\n'));
  }
}
