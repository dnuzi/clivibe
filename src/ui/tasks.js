// Native Zero-Dependency Terminal Task Runner
// Pure standard library — 0 external dependencies

import { c, glyphs } from './colors.js';

export async function runTask(label, taskFn) {
  const startTime = performance.now();
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let idx = 0;

  process.stdout.write(`${c.hex('#5271FF')(frames[0])} ${label}`);

  const timer = setInterval(() => {
    idx = (idx + 1) % frames.length;
    process.stdout.write(`\r${c.hex('#5271FF')(frames[idx])} ${label}`);
  }, 80);

  try {
    const result = await taskFn();
    clearInterval(timer);
    const elapsed = Math.round(performance.now() - startTime);
    process.stdout.write(`\r${glyphs.success} ${label} ${c.dim(`(${elapsed}ms)`)}\n`);
    return result;
  } catch (err) {
    clearInterval(timer);
    const elapsed = Math.round(performance.now() - startTime);
    process.stdout.write(`\r${glyphs.error} ${label} ${c.dim(`(${elapsed}ms)`)}\n`);
    console.log(c.red(`    Error: ${err.message}`));
    throw err;
  }
}

export async function runTasks(taskList) {
  for (const item of taskList) {
    await runTask(item.title, item.task);
  }
}
