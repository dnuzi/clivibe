import { c } from './colors.js';

// Strip ANSI escape codes to measure true printable width
export function stripAnsi(str) {
  return String(str).replace(/\x1b\[[0-9;]*m/g, '');
}

const BORDER_STYLES = {
  round: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
  single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
  bold: { tl: '┏', tr: '┓', bl: '┗', br: '┛', h: '━', v: '┃' },
  classic: { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' }
};

export function boxen(content, options = {}) {
  const lines = String(content).split('\n');
  const style = BORDER_STYLES[options.borderStyle] || BORDER_STYLES.round;
  const borderColor = options.borderColor || '#5271FF';
  const colorFn = typeof borderColor === 'function' ? borderColor : c.hex(borderColor);

  const paddingVal = options.padding ?? 1;
  const pad = typeof paddingVal === 'number'
    ? { top: 0, bottom: 0, left: paddingVal, right: paddingVal }
    : { top: 0, bottom: 0, left: 1, right: 1, ...paddingVal };

  const marginVal = options.margin ?? 0;
  const margin = typeof marginVal === 'number'
    ? { top: marginVal, bottom: marginVal, left: marginVal, right: marginVal }
    : { top: 0, bottom: 0, left: 0, right: 0, ...marginVal };

  const rawWidths = lines.map((l) => stripAnsi(l).length);
  const title = options.title || '';
  const titleLen = title ? stripAnsi(title).length + 4 : 0;
  const minWidth = options.minWidth || 40;
  const contentWidth = Math.max(...rawWidths, titleLen, minWidth);

  const totalInnerWidth = contentWidth + pad.left + pad.right;
  const marginSpaces = ' '.repeat(margin.left);

  // Top border with optional title
  let topBorder;
  if (title) {
    const formattedTitle = ` ${c.bold(title)} `;
    const cleanTitleLen = stripAnsi(formattedTitle).length;
    let leftPad = 2;
    if (options.titleAlignment === 'center') {
      leftPad = Math.max(1, Math.floor((totalInnerWidth - cleanTitleLen) / 2));
    } else if (options.titleAlignment === 'right') {
      leftPad = Math.max(1, totalInnerWidth - cleanTitleLen - 2);
    }
    const rightPad = Math.max(0, totalInnerWidth - cleanTitleLen - leftPad);

    topBorder =
      marginSpaces +
      colorFn(style.tl + style.h.repeat(leftPad)) +
      formattedTitle +
      colorFn(style.h.repeat(rightPad) + style.tr);
  } else {
    topBorder = marginSpaces + colorFn(style.tl + style.h.repeat(totalInnerWidth) + style.tr);
  }

  const emptyLine = marginSpaces + colorFn(style.v) + ' '.repeat(totalInnerWidth) + colorFn(style.v);

  const paddedLines = lines.map((line) => {
    const visualLen = stripAnsi(line).length;
    const spaceRight = Math.max(0, contentWidth - visualLen);
    return (
      marginSpaces +
      colorFn(style.v) +
      ' '.repeat(pad.left) +
      line +
      ' '.repeat(spaceRight + pad.right) +
      colorFn(style.v)
    );
  });

  const bottomBorder = marginSpaces + colorFn(style.bl + style.h.repeat(totalInnerWidth) + style.br);

  const output = [];
  for (let i = 0; i < margin.top; i++) output.push('');
  output.push(topBorder);
  for (let i = 0; i < pad.top; i++) output.push(emptyLine);
  output.push(...paddedLines);
  for (let i = 0; i < pad.bottom; i++) output.push(emptyLine);
  output.push(bottomBorder);
  for (let i = 0; i < margin.bottom; i++) output.push('');

  return output.join('\n');
}

// Backward-compatible createBox
export function createBox(content, title = '', borderColor = '#5271FF') {
  return boxen(content, {
    title,
    borderColor,
    padding: { top: 1, bottom: 1, left: 2, right: 2 }
  });
}
