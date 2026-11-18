import { c } from './colors.js';

export function createSpinner(text = 'Loading...') {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let frameIndex = 0;
  let timer = null;
  let currentText = text;
  const isTTY = process.stdout.isTTY;

  return {
    start(newText) {
      if (newText) currentText = newText;
      if (!isTTY) {
        console.log(`[..] ${currentText}`);
        return this;
      }
      process.stdout.write('\x1b[?25l'); // Hide cursor
      timer = setInterval(() => {
        const frame = c.hex('#5271FF')(frames[frameIndex]);
        process.stdout.write(`\r${frame} ${currentText}`);
        frameIndex = (frameIndex + 1) % frames.length;
      }, 80);
      return this;
    },
    update(newText) {
      currentText = newText;
      return this;
    },
    succeed(successText) {
      if (timer) clearInterval(timer);
      if (isTTY) {
        process.stdout.write('\x1b[?25h'); // Show cursor
        process.stdout.write(`\r${c.green('✔')} ${successText || currentText}\n`);
      } else {
        console.log(`[✔] ${successText || currentText}`);
      }
    },
    fail(errorText) {
      if (timer) clearInterval(timer);
      if (isTTY) {
        process.stdout.write('\x1b[?25h');
        process.stdout.write(`\r${c.red('✖')} ${errorText || currentText}\n`);
      } else {
        console.log(`[✖] ${errorText || currentText}`);
      }
    },
    stop() {
      if (timer) clearInterval(timer);
      if (isTTY) {
        process.stdout.write('\x1b[?25h');
        process.stdout.write('\r\x1b[K'); // clear line
      }
    }
  };
}
