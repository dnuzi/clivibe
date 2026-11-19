// Zero-Dependency Native Color & Gradient Engine
// Inspired by chalk & gradient-string algorithms

const hasColors = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);

// ANSI Codes mapping
const ANSI_CODES = {
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  strikethrough: [9, 29],

  // Foreground standard
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],

  // Bright Foreground
  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  // Background
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49]
};

function hexToRgb(hex) {
  const clean = hex.replace('#', '').trim();
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Chainable Builder Pattern (like Chalk)
function createStyler(openSeq = [], closeSeq = []) {
  const format = (text) => {
    if (!hasColors || text === undefined || text === null) return String(text ?? '');
    const str = String(text);
    return `${openSeq.map(s => `\x1b[${s}m`).join('')}${str}${closeSeq.map(s => `\x1b[${s}m`).join('')}`;
  };

  // Attach all ANSI code properties for chaining (e.g. c.bold.red('...'))
  for (const [name, [open, close]] of Object.entries(ANSI_CODES)) {
    Object.defineProperty(format, name, {
      get() {
        return createStyler([...openSeq, open], [close, ...closeSeq]);
      }
    });
  }

  // TrueColor 24-bit RGB
  format.rgb = (r, g, b) =>
    createStyler([...openSeq, `38;2;${r};${g};${b}`], [39, ...closeSeq]);

  format.hex = (hexStr) => {
    const [r, g, b] = hexToRgb(hexStr);
    return format.rgb(r, g, b);
  };

  // Background TrueColor
  format.bgRgb = (r, g, b) =>
    createStyler([...openSeq, `48;2;${r};${g};${b}`], [49, ...closeSeq]);

  format.bgHex = (hexStr) => {
    const [r, g, b] = hexToRgb(hexStr);
    return format.bgRgb(r, g, b);
  };

  return format;
}

export const c = createStyler();

// Gradient-String Engine (0 dependencies)
export function gradient(colors = ['#FF61D2', '#5271FF', '#12D8FA']) {
  const rgbs = colors.map(hexToRgb);

  const applyGradientToLine = (line) => {
    if (!hasColors || !line) return line;
    const chars = Array.from(line);
    if (chars.length === 0) return '';
    if (chars.length === 1) return `\x1b[38;2;${rgbs[0][0]};${rgbs[0][1]};${rgbs[0][2]}m${chars[0]}\x1b[39m`;

    return chars
      .map((char, i) => {
        if (char === ' ') return char;
        const progress = i / (chars.length - 1);
        const segment = progress * (rgbs.length - 1);
        const index = Math.min(Math.floor(segment), rgbs.length - 2);
        const factor = segment - index;

        const r = Math.round(rgbs[index][0] + factor * (rgbs[index + 1][0] - rgbs[index][0]));
        const g = Math.round(rgbs[index][1] + factor * (rgbs[index + 1][1] - rgbs[index][1]));
        const b = Math.round(rgbs[index][2] + factor * (rgbs[index + 1][2] - rgbs[index][2]));

        return `\x1b[38;2;${r};${g};${b}m${char}`;
      })
      .join('') + '\x1b[39m';
  };

  const fn = (text) => {
    if (!text) return '';
    return String(text).split('\n').map(applyGradientToLine).join('\n');
  };

  fn.multiline = fn;
  return fn;
}

// Built-in Gradient Presets (like gradient-string)
export const gradients = {
  retro: gradient(['#FE5F55', '#F0B67F', '#D6D1CD', '#C2BBF0', '#8FB8ED']),
  fire: gradient(['#FF0844', '#FFB199']),
  cyber: gradient(['#00F260', '#0575E6']),
  synthwave: gradient(['#FF61D2', '#FE90AF', '#5271FF', '#12D8FA']),
  aurora: gradient(['#00c6ff', '#0072ff']),
  sunset: gradient(['#FA8BFF', '#2BD2FF', '#2BFF88'])
};

// UI Badges & Icons
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
  success: (text) => c.bgGreen.black.bold(` ${text} `),
  error: (text) => c.bgRed.brightWhite.bold(` ${text} `),
  warning: (text) => c.bgYellow.black.bold(` ${text} `),
  info: (text) => c.bgCyan.black.bold(` ${text} `),
  purple: (text) => c.bgHex('#5271FF').brightWhite.bold(` ${text} `),
  tag: (text) => c.bgHex('#2E3440').hex('#88C0D0').bold(` ${text} `)
};
