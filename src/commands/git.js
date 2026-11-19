import { execSync } from 'child_process';
import { c, icons, badges } from '../ui/colors.js';
import { promptSelect, promptInput } from '../ui/prompt.js';
import { createBox } from '../ui/box.js';

function runGit(cmd) {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    return null;
  }
}

export async function gitHelper(subcommand, options = {}) {
  // Check if inside a git repository
  const isRepo = runGit('rev-parse --is-inside-work-tree');
  if (!isRepo) {
    console.log(c.red(`\n${icons.error} Not inside a git repository.`));
    return;
  }

  if (subcommand === 'commit' || subcommand === 'cm') {
    await handleAutoCommit();
  } else if (subcommand === 'clean') {
    await handleBranchClean();
  } else if (subcommand === 'standup') {
    await handleStandup(options.days || 1);
  } else {
    console.log(c.cyan(`\n${badges.primary('CLIVIBE GIT COMPANION')}`));
    console.log(`\nCommands:`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git commit')}   - Smart conventional commit from diff`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git clean')}    - TUI branch cleaner`);
    console.log(`  ${c.hex('#8be9fd')('clivibe git standup')}  - Standup report from recent commits\n`);
  }
}

async function handleAutoCommit() {
  console.log(`\n${badges.primary('SMART COMMIT GENERATOR')}\n`);

  let stagedDiff = runGit('diff --cached --stat');
  if (!stagedDiff) {
    console.log(c.yellow(`${icons.warning} No staged changes detected.`));
    const stageAll = await promptSelect({
      message: 'Would you like to stage all modified files (git add .)?',
      choices: [
        { name: 'Yes, stage all files', value: true },
        { name: 'No, abort', value: false }
      ]
    });

    if (!stageAll) return;
    runGit('add .');
    stagedDiff = runGit('diff --cached --stat');
  }

  const statusShort = runGit('status --porcelain');
  const changedFiles = statusShort.split('\n').filter(Boolean);

  // Generate intelligent conventional commit message based on diff heuristics
  let prefix = 'feat';
  let desc = 'update codebase';

  const filesLower = changedFiles.map((f) => f.toLowerCase());
  if (filesLower.some((f) => f.includes('readme') || f.includes('docs'))) {
    prefix = 'docs';
    desc = 'update documentation and usage guides';
  } else if (filesLower.some((f) => f.includes('fix') || f.includes('bug') || f.includes('patch'))) {
    prefix = 'fix';
    desc = 'resolve bug and handle edge cases';
  } else if (filesLower.some((f) => f.includes('test') || f.includes('spec'))) {
    prefix = 'test';
    desc = 'add unit and integration test suites';
  } else if (filesLower.some((f) => f.includes('package.json') || f.includes('docker') || f.includes('workflow'))) {
    prefix = 'chore';
    desc = 'update configuration and tooling dependencies';
  } else if (filesLower.some((f) => f.includes('style') || f.includes('css'))) {
    prefix = 'style';
    desc = 'improve layout, typography and UI themes';
  } else {
    // Inspect first changed file
    const sample = changedFiles[0].replace(/^[A-Z\s?]+\s+/, '');
    desc = `implement enhancements in ${sample}`;
  }

  const suggestedMsg = `${prefix}: ${desc}`;

  console.log(createBox(`Suggested Commit:\n${c.bold(c.hex('#50fa7b')(suggestedMsg))}`, 'SMART COMMIT PROPOSAL', '#5271FF'));

  const action = await promptSelect({
    message: 'What would you like to do?',
    choices: [
      { name: `Accept & Commit ("${suggestedMsg}")`, value: 'accept' },
      { name: 'Edit commit message manually', value: 'edit' },
      { name: 'Cancel', value: 'cancel' }
    ]
  });

  if (action === 'cancel') return;

  let finalMsg = suggestedMsg;
  if (action === 'edit') {
    finalMsg = await promptInput('Enter commit message', suggestedMsg);
  }

  try {
    execSync(`git commit -m "${finalMsg.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
    console.log(c.green(`\n${icons.success} Committed successfully!\n`));
  } catch (e) {
    console.log(c.red(`\n${icons.error} Commit failed: ${e.message}\n`));
  }
}

async function handleBranchClean() {
  console.log(`\n${badges.tag('GIT BRANCH CLEANER')}\n`);
  const rawBranches = runGit('branch --format="%(refname:short)"');
  if (!rawBranches) {
    console.log(c.dim('No branches found.'));
    return;
  }

  const currentBranch = runGit('branch --show-current');
  const branches = rawBranches
    .split('\n')
    .map((b) => b.trim())
    .filter((b) => b && b !== currentBranch && b !== 'main' && b !== 'master');

  if (branches.length === 0) {
    console.log(c.green(`${icons.success} Your branches are clean! No stale branches to delete.`));
    return;
  }

  const choices = branches.map((b) => ({
    name: b,
    value: b,
    desc: 'Local branch'
  }));

  choices.push({ name: 'Cancel', value: 'cancel' });

  const target = await promptSelect({
    message: 'Select a branch to delete:',
    choices
  });

  if (target === 'cancel') return;

  try {
    runGit(`branch -d ${target}`);
    console.log(c.green(`\n${icons.success} Deleted branch ${c.bold(target)}.\n`));
  } catch {
    console.log(c.yellow(`\n${icons.warning} Branch not fully merged. Force delete with git branch -D ${target}?`));
    const confirm = await promptSelect({
      message: 'Force delete?',
      choices: [
        { name: 'Yes, force delete', value: true },
        { name: 'No, keep it', value: false }
      ]
    });
    if (confirm) {
      runGit(`branch -D ${target}`);
      console.log(c.green(`\n${icons.success} Force-deleted branch ${c.bold(target)}.\n`));
    }
  }
}

async function handleStandup(days = 1) {
  console.log(`\n${badges.primary(`STANDUP REPORT - LAST ${days} DAY(S)`)}\n`);
  const author = runGit('config user.name') || '';
  const since = `${days} days ago`;
  const logOutput = runGit(`log --since="${since}" --author="${author}" --oneline --no-merges`);

  if (!logOutput) {
    console.log(c.dim(`No commits found by "${author}" in the last ${days} day(s).\n`));
    return;
  }

  const commits = logOutput.split('\n').filter(Boolean);
  const standupReport = [
    `### Standup Report (${new Date().toLocaleDateString()})`,
    '',
    `**Done / Completed:**`,
    ...commits.map((c) => `- ${c.replace(/^[a-f0-9]+\s+/, '')}`),
    '',
    `**Today's Focus:**`,
    `- Continuing integration & code review`,
    '',
    `**Blockers:**`,
    `- None`
  ].join('\n');

  console.log(createBox(standupReport, 'READY TO COPY-PASTE INTO SLACK/DISCORD', '#00F260'));
}
