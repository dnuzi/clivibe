// Zero-Dependency Native Terminal Progress Bar
// Inspired by cli-progress and progress

import { c, gradients } from './colors.js';

export class ProgressBar {
  constructor(total = 100, options = {}) {
    this.total = Math.max(1, total);
    this.current = 0;
    this.width = options.width || 30;
    this.completeChar = options.complete || '█';
    this.incompleteChar = options.incomplete || '░';
    this.headChar = options.head || '';
    this.format = options.format || '  :bar :percent | :value/:total | ETA: :eta';
    this.stream = options.stream || process.stderr;
    this.gradient = options.gradient || null;
    this.startTime = Date.now();
    this.lastRenderTime = 0;
    this.stopped = false;

    if (this.stream.isTTY) {
      this.stream.write('\x1b[?25l'); // Hide cursor
    }
  }

  update(current, tokens = {}) {
    if (this.stopped) return;
    this.current = Math.min(Math.max(0, current), this.total);

    const now = Date.now();
    // Throttle rendering to ~60fps
    if (now - this.lastRenderTime < 16 && this.current < this.total) return;
    this.lastRenderTime = now;

    this.render(tokens);

    if (this.current >= this.total) {
      this.stop();
    }
  }

  increment(step = 1, tokens = {}) {
    this.update(this.current + step, tokens);
  }

  render(tokens = {}) {
    const ratio = this.current / this.total;
    const percent = Math.floor(ratio * 100);

    const completeLength = Math.round(this.width * ratio);
    const incompleteLength = this.width - completeLength;

    let barStr = this.completeChar.repeat(Math.max(0, completeLength));
    if (this.headChar && completeLength > 0 && incompleteLength > 0) {
      barStr = barStr.slice(0, -1) + this.headChar;
    }

    if (this.gradient && typeof this.gradient === 'function') {
      barStr = this.gradient(barStr);
    } else {
      barStr = c.hex('#5271FF')(barStr);
    }

    const incompleteStr = c.dim(this.incompleteChar.repeat(Math.max(0, incompleteLength)));
    const fullBar = `[${barStr}${incompleteStr}]`;

    // ETA calculation
    const elapsed = (Date.now() - this.startTime) / 1000;
    const rate = this.current / (elapsed || 1);
    const remaining = (this.total - this.current) / (rate || 1);
    const etaStr = ratio >= 1 ? '0.0s' : `${remaining.toFixed(1)}s`;
    const elapsedStr = `${elapsed.toFixed(1)}s`;

    let line = this.format
      .replace(':bar', fullBar)
      .replace(':percent', `${percent.toString().padStart(3)}%`)
      .replace(':value', String(this.current))
      .replace(':total', String(this.total))
      .replace(':eta', etaStr)
      .replace(':elapsed', elapsedStr);

    for (const [key, val] of Object.entries(tokens)) {
      line = line.replace(`:${key}`, String(val));
    }

    if (this.stream.isTTY) {
      this.stream.cursorTo(0);
      this.stream.write(line);
      this.stream.clearLine(1);
    } else {
      this.stream.write(`${line}\n`);
    }
  }

  stop() {
    if (this.stopped) return;
    this.stopped = true;
    if (this.stream.isTTY) {
      this.stream.write('\x1b[?25h\n'); // Restore cursor and newline
    } else {
      this.stream.write('\n');
    }
  }
}

export function createProgressBar(total, options) {
  return new ProgressBar(total, options);
}
