import { c } from './colors.js';
import { stripAnsi } from './box.js';

export function renderTable(headers, rows) {
  const colCount = headers.length;
  const colWidths = headers.map((h, i) => {
    let max = stripAnsi(h).length;
    for (const row of rows) {
      if (row[i] !== undefined) {
        max = Math.max(max, stripAnsi(String(row[i])).length);
      }
    }
    return max + 2; // padding
  });

  const sep = (l, m, r, fill = '─') =>
    c.dim(l + colWidths.map((w) => fill.repeat(w)).join(m) + r);

  const top = sep('┌', '┬', '┐');
  const mid = sep('├', '┼', '┤');
  const bot = sep('└', '┴', '┘');

  const formatRow = (cells, isHeader = false) => {
    const formatted = cells.map((cell, i) => {
      const rawLen = stripAnsi(String(cell)).length;
      const pad = ' '.repeat(Math.max(0, colWidths[i] - rawLen - 1));
      const text = isHeader ? c.bold(cell) : cell;
      return ` ${text}${pad}`;
    });
    return c.dim('│') + formatted.join(c.dim('│')) + c.dim('│');
  };

  const headerLine = formatRow(headers, true);
  const rowLines = rows.map((r) => formatRow(r));

  return [top, headerLine, mid, ...rowLines, bot].join('\n');
}
