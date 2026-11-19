// Zero-Dependency Native Sparkline & ASCII Line Chart Engine
// Inspired by asciichart

import { c, gradients } from './colors.js';

const TICKS = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

// Generates an inline sparkline string (e.g.  ▃▂▅█▄▆)
export function sparkline(numbers, options = {}) {
  if (!Array.isArray(numbers) || numbers.length === 0) return '';

  const min = options.min !== undefined ? options.min : Math.min(...numbers);
  const max = options.max !== undefined ? options.max : Math.max(...numbers);
  const range = max - min || 1;

  let out = '';
  for (const n of numbers) {
    const val = Math.max(min, Math.min(max, n));
    const normalized = (val - min) / range;
    const tickIdx = Math.min(Math.floor(normalized * (TICKS.length - 1)), TICKS.length - 1);
    out += TICKS[tickIdx];
  }

  if (options.gradient && typeof options.gradient === 'function') {
    return options.gradient(out);
  }
  if (options.color) {
    return c.hex(options.color)(out);
  }
  return c.hex('#12D8FA')(out);
}

// 2D Terminal Line Chart Renderer
export function plot(series, options = {}) {
  if (!Array.isArray(series) || series.length === 0) return '';

  const height = options.height || 10;
  const min = options.min !== undefined ? options.min : Math.min(...series);
  const max = options.max !== undefined ? options.max : Math.max(...series);
  const range = max - min || 1;

  const width = series.length;
  const grid = Array.from({ length: height }, () => Array(width).fill(' '));

  // Plot points into grid
  for (let x = 0; x < width; x++) {
    const norm = (series[x] - min) / range;
    const y = Math.min(height - 1, Math.max(0, Math.round(norm * (height - 1))));
    // Invert y so 0 is bottom
    const gridY = height - 1 - y;

    if (x > 0) {
      const prevNorm = (series[x - 1] - min) / range;
      const prevY = height - 1 - Math.min(height - 1, Math.max(0, Math.round(prevNorm * (height - 1))));

      if (gridY < prevY) {
        // Going up
        grid[prevY][x - 1] = '╭';
        for (let fillY = prevY - 1; fillY > gridY; fillY--) {
          grid[fillY][x - 1] = '│';
        }
        grid[gridY][x] = '╯';
      } else if (gridY > prevY) {
        // Going down
        grid[prevY][x - 1] = '╰';
        for (let fillY = prevY + 1; fillY < gridY; fillY++) {
          grid[fillY][x - 1] = '│';
        }
        grid[gridY][x] = '╮';
      } else {
        grid[gridY][x] = '─';
      }
    } else {
      grid[gridY][x] = '●';
    }
  }

  // Format Y-axis labels
  const maxLabel = max.toFixed(1);
  const minLabel = min.toFixed(1);
  const midLabel = ((max + min) / 2).toFixed(1);
  const labelWidth = Math.max(maxLabel.length, minLabel.length, midLabel.length);

  const lines = [];
  for (let y = 0; y < height; y++) {
    let axisLabel = ' '.repeat(labelWidth);
    if (y === 0) axisLabel = maxLabel.padStart(labelWidth);
    else if (y === Math.floor(height / 2)) axisLabel = midLabel.padStart(labelWidth);
    else if (y === height - 1) axisLabel = minLabel.padStart(labelWidth);

    const axis = c.dim(`${axisLabel} ┤ `);
    const rowContent = grid[y].join('');
    const styledRow = options.gradient ? options.gradient(rowContent) : c.cyan(rowContent);
    lines.push(axis + styledRow);
  }

  // Bottom X-axis
  const bottomAxis = c.dim(`${' '.repeat(labelWidth)} └${'─'.repeat(width + 2)}`);
  lines.push(bottomAxis);

  return lines.join('\n');
}
