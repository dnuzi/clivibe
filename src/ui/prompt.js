import readline from 'readline';
import { c } from './colors.js';

export function promptSelect({ message, choices }) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      // Fallback for non-interactive
      resolve(choices[0].value !== undefined ? choices[0].value : choices[0]);
      return;
    }

    let selectedIndex = 0;
    const stdin = process.stdin;
    const stdout = process.stdout;

    readline.emitKeypressEvents(stdin);
    if (stdin.isTTY) stdin.setRawMode(true);
    stdout.write('\x1b[?25l'); // hide cursor

    console.log(c.bold(c.cyan(`? `)) + c.bold(message));

    function render(firstTime = false) {
      if (!firstTime) {
        // move cursor up
        stdout.write(`\x1b[${choices.length}A`);
      }

      choices.forEach((choice, idx) => {
        const isSelected = idx === selectedIndex;
        const label = choice.name || choice.title || choice;
        const desc = choice.desc ? c.dim(` - ${choice.desc}`) : '';
        const pointer = isSelected ? c.hex('#5271FF')('❯ ') : '  ';
        const text = isSelected ? c.bold(c.hex('#5271FF')(label)) : c.dim(label);
        stdout.write(`\x1b[2K\r${pointer}${text}${desc}\n`);
      });
    }

    render(true);

    function onKeypress(str, key) {
      if (!key) return;

      if (key.name === 'up') {
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
        render();
      } else if (key.name === 'down') {
        selectedIndex = (selectedIndex + 1) % choices.length;
        render();
      } else if (key.name === 'return') {
        cleanup();
        const selected = choices[selectedIndex];
        const val = selected.value !== undefined ? selected.value : selected;
        stdout.write(c.hex('#5271FF')(`✔ Selected: `) + c.bold(selected.name || selected) + '\n\n');
        resolve(val);
      } else if (key.ctrl && key.name === 'c') {
        cleanup();
        process.exit(0);
      }
    }

    function cleanup() {
      stdin.removeListener('keypress', onKeypress);
      if (stdin.isTTY) stdin.setRawMode(false);
      stdout.write('\x1b[?25h'); // restore cursor
    }

    stdin.on('keypress', onKeypress);
  });
}

export function promptInput(question, defaultValue = '') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const display = defaultValue ? `${question} (${c.dim(defaultValue)}): ` : `${question}: `;
    rl.question(c.cyan('? ') + c.bold(display), (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}
