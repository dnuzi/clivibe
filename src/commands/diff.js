// Native Zero-Dependency Unified Diff Engine
// Pure standard library — 0 external dependencies

import fs from 'fs';
import path from 'path';
import { c, badges, glyphs } from '../ui/colors.js';

// Longest Common Subsequence (LCS) line diff algorithm
export function computeDiff(linesA, linesB) {
  const m = linesA.length;
  const n = linesB.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (linesA[i] === linesB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.push({ type: 'same', text: linesA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: 'add', text: linesB[j - 1] });
      j--;
    } else {
      result.push({ type: 'del', text: linesA[i - 1] });
      i--;
    }
  }

  return result.reverse();
}

export function runDiff(fileA, fileB) {
  if (!fileA || !fileB) {
    console.log(c.yellow(`\n${glyphs.warning} Usage: clivibe diff <file1> <file2>\n`));
    return;
  }

  const pathA = path.resolve(process.cwd(), fileA);
  const pathB = path.resolve(process.cwd(), fileB);

  if (!fs.existsSync(pathA)) {
    console.log(c.red(`\n${glyphs.error} File not found: ${fileA}\n`));
    return;
  }
  if (!fs.existsSync(pathB)) {
    console.log(c.red(`\n${glyphs.error} File not found: ${fileB}\n`));
    return;
  }

  const contentA = fs.readFileSync(pathA, 'utf-8').split(/\r?\n/);
  const contentB = fs.readFileSync(pathB, 'utf-8').split(/\r?\n/);

  const diff = computeDiff(contentA, contentB);

  console.log(`\n${badges.primary('UNIFIED FILE DIFF')}\n`);
  console.log(c.red(`--- a/${fileA}`));
  console.log(c.green(`+++ b/${fileB}`));
  console.log(c.dim('─'.repeat(60)));

  let adds = 0;
  let dels = 0;

  for (const item of diff) {
    if (item.type === 'add') {
      adds++;
      console.log(c.green(`+ ${item.text}`));
    } else if (item.type === 'del') {
      dels++;
      console.log(c.red(`- ${item.text}`));
    } else {
      console.log(c.dim(`  ${item.text}`));
    }
  }

  console.log(c.dim('─'.repeat(60)));
  console.log(`Summary: ${c.green(`+${adds} added`)} · ${c.red(`-${dels} removed`)}\n`);
}
