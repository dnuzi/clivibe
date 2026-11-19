import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import { stripAnsi, createBox } from '../src/ui/box.js';
import { renderTable } from '../src/ui/table.js';
import { c } from '../src/ui/colors.js';

test('clixy --version outputs correct version', () => {
  const output = execSync('node bin/clixy.js --version', { encoding: 'utf-8' });
  assert.match(output, /clixy v1\.0\.0/);
});

test('clixy --help displays all primary commands', () => {
  const output = execSync('node bin/clixy.js --help', { encoding: 'utf-8' });
  assert.ok(output.includes('wtf'));
  assert.ok(output.includes('logsee'));
  assert.ok(output.includes('doctor'));
  assert.ok(output.includes('top'));
  assert.ok(output.includes('scaffold'));
  assert.ok(output.includes('utils'));
});

test('clixy cron parses 5-field expression accurately', () => {
  const output = execSync('node bin/clixy.js cron "*/15 * * * *"', { encoding: 'utf-8' });
  assert.ok(output.includes('Runs every 15 minutes'));
});

test('clixy hash generates valid SHA-256 and UUID', () => {
  const output = execSync('node bin/clixy.js hash "hello world"', { encoding: 'utf-8' });
  const expectedHash = crypto.createHash('sha256').update('hello world').digest('hex');
  assert.ok(output.includes(expectedHash));
  assert.ok(output.includes('Random UUID'));
});

test('UI box renderer produces expected borders and strips ANSI correctly', () => {
  const box = createBox('Test Line', 'Title');
  const clean = stripAnsi(box);
  assert.ok(clean.includes('Test Line'));
  assert.ok(clean.includes('Title'));
  assert.ok(clean.includes('╭'));
  assert.ok(clean.includes('╯'));
});

test('UI table renderer aligns columns and headers', () => {
  const table = renderTable(['Col A', 'Col B'], [['Val 1', 'Val 2']]);
  const clean = stripAnsi(table);
  assert.ok(clean.includes('Col A'));
  assert.ok(clean.includes('Val 1'));
  assert.ok(clean.includes('┌'));
  assert.ok(clean.includes('┘'));
});
