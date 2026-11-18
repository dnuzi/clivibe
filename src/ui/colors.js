// Zero-dependency ANSI color and styling utilities
const hasColors = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);

function wrap(open, close) {
  const fn = (text) => (hasColors ? `\x1b[${open}m${text}\x1b[${close}m` : String(text));
  fn.bold = (text) => c.bold(fn(text));
  fn.dim = (text) => c.dim(fn(text));
  return fn;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export const c = {
  reset: wrap(0, 0),
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  underline: wrap(4, 24),
  inverse: wrap(7, 27),

  // Standard Colors
  black: wrap(30, 39),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
  white: wrap(37, 39),
  gray: wrap(90, 39),

  // Bright Colors
  brightRed: wrap(91, 39),
  brightGreen: wrap(92, 39),
  brightYellow: wrap(93, 39),
  brightBlue: wrap(94, 39),
  brightMagenta: wrap(95, 39),
  brightCyan: wrap(96, 39),
  brightWhite: wrap(97, 39),

  // Backgrounds
  bgBlack: wrap(40, 49),
  bgRed: wrap(41, 49),
  bgGreen: wrap(42, 49),
  bgYellow: wrap(43, 49),
  bgBlue: wrap(44, 49),
  bgMagenta: wrap(45, 49),
  bgCyan: wrap(46, 49),
  bgWhite: wrap(47, 49),
  bgGray: wrap(100, 49),

  // TrueColor RGB
  rgb: (r, g, b) => {
    const fn = (text) => (hasColors ? `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m` : String(text));
    fn.bold = (text) => c.bold(fn(text));
    fn.dim = (text) => c.dim(fn(text));
    return fn;
  },

  bgRgb: (r, g, b) => {
    const fn = (text) => (hasColors ? `\x1b[48;2;${r};${g};${b}m${text}\x1b[49m` : String(text));
    fn.bold = (text) => c.bold(fn(text));
    fn.dim = (text) => c.dim(fn(text));
    return fn;
  },

  // Hex colors
  hex: (hexStr) => {
    const [r, g, b] = hexToRgb(hexStr);
    return c.rgb(r, g, b);
  },

  bgHex: (hexStr) => {
    const [r, g, b] = hexToRgb(hexStr);
    return c.bgRgb(r, g, b);
  },

  // Multi-color horizontal gradient
  gradient: (text, hexColors = ['#FF61D2', '#5271FF', '#12D8FA']) => {
    if (!hasColors || !text) return text;
    const cleanChars = Array.from(text);
    if (cleanChars.length === 0) return '';
    const rgbs = hexColors.map(hexToRgb);

    return (
      cleanChars
        .map((char, i) => {
          if (char === '\n' || char === '\r') return char;
          const progress = i / Math.max(1, cleanChars.length - 1);
          const segment = progress * (rgbs.length - 1);
          const index = Math.min(Math.floor(segment), rgbs.length - 2);
          const factor = segment - index;

          const r = Math.round(rgbs[index][0] + factor * (rgbs[index + 1][0] - rgbs[index][0]));
          const g = Math.round(rgbs[index][1] + factor * (rgbs[index + 1][1] - rgbs[index][1]));
          const b = Math.round(rgbs[index][2] + factor * (rgbs[index + 1][2] - rgbs[index][2]));

          return `\x1b[38;2;${r};${g};${b}m${char}`;
        })
        .join('') + '\x1b[39m'
    );
  }
};

export const icons = {
  success: c.green('✔'),
  error: c.red('✖'),
  warning: c.yellow('⚠'),
  info: c.cyan('ℹ'),
  bullet: c.hex('#5271FF')('›'),
  arrow: c.hex('#FF61D2')('➜'),
  sparkle: c.hex('#FE90AF')('✦'),
  bolt: c.yellow('⚡'),
  clock: c.gray('⏱'),
  rocket: c.red('🚀'),
  cube: c.blue('📦'),
  gear: c.magenta('⚙')
};

export const badges = {
  success: (text) => c.bgGreen(c.black(` ${text} `)),
  error: (text) => c.bgRed(c.brightWhite(` ${text} `)),
  warning: (text) => c.bgYellow(c.black(` ${text} `)),
  info: (text) => c.bgCyan(c.black(` ${text} `)),
  purple: (text) => c.bgHex('#5271FF')(c.brightWhite(` ${text} `)),
  tag: (text) => c.bgHex('#2E3440')(c.hex('#88C0D0')(` ${text} `))
};
