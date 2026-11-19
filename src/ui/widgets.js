// Native Terminal UI Widgets & Data Visualizers
// Pure standard library — 0 external dependencies

import { c, gradients, glyphs } from './colors.js';
import { stripAnsi } from './box.js';

// Renders a hierarchical tree
export function renderTree(data, prefix = '') {
  const lines = [];

  if (typeof data !== 'object' || data === null) {
    return String(data);
  }

  const entries = Array.isArray(data)
    ? data.map((v, i) => [i, v])
    : Object.entries(data);

  entries.forEach(([key, val], idx) => {
    const isLast = idx === entries.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    const keyLabel = c.bold(c.hex('#5271FF')(String(key)));

    if (typeof val === 'object' && val !== null) {
      lines.push(`${prefix}${c.dim(branch)}${keyLabel}`);
      lines.push(renderTree(val, childPrefix));
    } else {
      lines.push(`${prefix}${c.dim(branch)}${keyLabel}: ${c.hex('#12D8FA')(String(val))}`);
    }
  });

  return lines.join('\n');
}

// Renders a horizontal status gauge
export function renderGauge(value, max = 100, options = {}) {
  const width = options.width || 24;
  const ratio = Math.min(1, Math.max(0, value / max));
  const filled = Math.round(ratio * width);
  const empty = width - filled;

  const fillChar = options.fill || '█';
  const emptyChar = options.empty || '░';

  let fillStr = fillChar.repeat(filled);
  if (options.gradient && typeof options.gradient === 'function') {
    fillStr = options.gradient(fillStr);
  } else {
    fillStr = c.hex('#5271FF')(fillStr);
  }

  const emptyStr = c.dim(emptyChar.repeat(empty));
  const percent = `${Math.floor(ratio * 100)}%`.padStart(4);

  return `[${fillStr}${emptyStr}] ${c.bold(percent)}`;
}

// Renders styled pill badges
export function badge(text, variant = 'primary') {
  const label = ` ${String(text).toUpperCase()} `;
  switch (variant) {
    case 'success':
    case 'done':
      return c.bgGreen.black.bold(label);
    case 'error':
    case 'danger':
    case 'fail':
      return c.bgRed.brightWhite.bold(label);
    case 'warning':
    case 'warn':
      return c.bgYellow.black.bold(label);
    case 'info':
      return c.bgCyan.black.bold(label);
    case 'muted':
    case 'dim':
      return c.bgHex('#2E3440').hex('#D8DEE9').bold(label);
    default:
      return c.bgHex('#5271FF').brightWhite.bold(label);
  }
}

// Renders a terminal horizontal divider
export function divider(title = '', options = {}) {
  const cols = options.width || (process.stdout.columns || 80);
  const char = options.char || '─';
  const colorFn = options.color || c.dim;

  if (!title) {
    return colorFn(char.repeat(cols));
  }

  const cleanTitle = ` ${title} `;
  const titleWidth = stripAnsi(cleanTitle).length;
  const leftLen = options.align === 'center'
    ? Math.max(2, Math.floor((cols - titleWidth) / 2))
    : 4;
  const rightLen = Math.max(2, cols - titleWidth - leftLen);

  return colorFn(char.repeat(leftLen)) + c.bold(cleanTitle) + colorFn(char.repeat(rightLen));
}

// Aligned key-value pairs inspector
export function keyvalue(obj, options = {}) {
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';

  const maxKeyLen = Math.max(...entries.map(([k]) => stripAnsi(k).length));
  const sep = options.separator || c.dim('›');

  return entries.map(([k, v]) => {
    const paddedKey = k.padEnd(maxKeyLen);
    return `  ${c.dim(paddedKey)} ${sep} ${c.bold(String(v))}`;
  }).join('\n');
}
