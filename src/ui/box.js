import { c } from './colors.js';

// Strip ANSI escape codes to measure true printable width
export function stripAnsi(str) {
  return String(str).replace(/\x1b\[[0-9;]*m/g, '');
}

export function createBox(content, title = '', borderColor = '#5271FF') {
  const lines = String(content).split('\n');
  const colorFn = typeof borderColor === 'function' ? borderColor : c.hex(borderColor);

  const rawWidths = lines.map((l) => stripAnsi(l).length);
  const titleLen = title ? stripAnsi(title).length + 4 : 0;
  const contentWidth = Math.max(...rawWidths, titleLen, 40);

  const paddingX = 2;
  const totalInnerWidth = contentWidth + paddingX * 2;

  // Box border characters (rounded)
  const tl = '╭';
  const tr = '╮';
  const bl = '╰';
  const br = '╯';
  const h = '─';
  const v = '│';

  let topBorder;
  if (title) {
    const formattedTitle = ` ${c.bold(title)} `;
    const leftPad = 2;
    const rightPad = Math.max(0, totalInnerWidth - stripAnsi(formattedTitle).length - leftPad);
    topBorder =
      colorFn(tl + h.repeat(leftPad)) +
      formattedTitle +
      colorFn(h.repeat(rightPad) + tr);
  } else {
    topBorder = colorFn(tl + h.repeat(totalInnerWidth) + tr);
  }

  const paddedLines = lines.map((line) => {
    const visualLen = stripAnsi(line).length;
    const spaceRight = Math.max(0, contentWidth - visualLen);
    return (
      colorFn(v) +
      ' '.repeat(paddingX) +
      line +
      ' '.repeat(spaceRight + paddingX) +
      colorFn(v)
    );
  });

  const emptyLine =
    colorFn(v) + ' '.repeat(totalInnerWidth) + colorFn(v);

  const bottomBorder = colorFn(bl + h.repeat(totalInnerWidth) + br);

  return [topBorder, emptyLine, ...paddedLines, emptyLine, bottomBorder].join('\n');
}
