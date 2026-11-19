import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import { stripAnsi, createBox, boxen } from '../src/ui/box.js';
import { renderTable } from '../src/ui/table.js';
import { c, gradient, gradients } from '../src/ui/colors.js';
import { sparkline, plot } from '../src/ui/chart.js';
import { renderImage } from '../src/ui/image.js';
import { ProgressBar } from '../src/ui/progress.js';
import { computeDiff } from '../src/commands/diff.js';
import { highlightJson } from '../src/commands/json.js';
import * as clivibe from '../src/index.js';

test('clivibe --version outputs correct version', () => {
  const output = execSync('node bin/clivibe.js --version', { encoding: 'utf-8' });
  assert.match(output, /clivibe v1\.3\.0/);
});

test('clivibe --help displays all primary commands and UI suite', () => {
  const output = execSync('node bin/clivibe.js --help', { encoding: 'utf-8' });
  assert.ok(output.includes('doctor'));
  assert.ok(output.includes('wtf'));
  assert.ok(output.includes('serve'));
  assert.ok(output.includes('diff'));
  assert.ok(output.includes('json'));
  assert.ok(output.includes('sysinfo'));
  assert.ok(output.includes('logsee'));
  assert.ok(output.includes('top'));
  assert.ok(output.includes('scaffold'));
  assert.ok(output.includes('image'));
  assert.ok(output.includes('gradient'));
  assert.ok(output.includes('chart'));
  assert.ok(output.includes('spark'));
});

test('clivibe cron parses 5-field expression accurately', () => {
  const output = execSync('node bin/clivibe.js cron "*/15 * * * *"', { encoding: 'utf-8' });
  assert.ok(output.includes('Runs every 15 minutes'));
});

test('clivibe hash generates valid SHA-256 and UUID', () => {
  const output = execSync('node bin/clivibe.js hash "hello world"', { encoding: 'utf-8' });
  const expectedHash = crypto.createHash('sha256').update('hello world').digest('hex');
  assert.ok(output.includes(expectedHash));
  assert.ok(output.includes('Random UUID'));
});

test('clivibe sysinfo returns CPU, OS and RAM specs', () => {
  const output = execSync('node bin/clivibe.js sysinfo', { encoding: 'utf-8' });
  assert.ok(output.includes('Operating System'));
  assert.ok(output.includes('CPU Model'));
  assert.ok(output.includes('Memory Total'));
});

test('Diff engine correctly calculates line changes', () => {
  const linesA = ['apple', 'banana', 'cherry'];
  const linesB = ['apple', 'blueberry', 'cherry', 'date'];
  const diff = computeDiff(linesA, linesB);
  
  assert.equal(diff[0].type, 'same');
  assert.equal(diff[0].text, 'apple');
  assert.ok(diff.some(d => d.type === 'del' && d.text === 'banana'));
  assert.ok(diff.some(d => d.type === 'add' && d.text === 'blueberry'));
  assert.ok(diff.some(d => d.type === 'add' && d.text === 'date'));
});

test('JSON highlighter highlights valid JSON syntax', () => {
  const colored = highlightJson({ name: 'clivibe', active: true, count: 42 });
  assert.ok(colored.includes('name'));
  assert.ok(colored.includes('true'));
  assert.ok(colored.includes('42'));
});

test('UI box renderer produces expected borders and strips ANSI correctly', () => {
  const box = createBox('Test Line', 'Title');
  const clean = stripAnsi(box);
  assert.ok(clean.includes('Test Line'));
  assert.ok(clean.includes('Title'));
  assert.ok(clean.includes('╭'));
  assert.ok(clean.includes('╯'));

  const customBox = boxen('Custom Content', { borderStyle: 'double', title: 'Double Box' });
  const cleanCustom = stripAnsi(customBox);
  assert.ok(cleanCustom.includes('Custom Content'));
  assert.ok(cleanCustom.includes('╔'));
  assert.ok(cleanCustom.includes('╝'));
});

test('UI table renderer aligns columns and headers', () => {
  const table = renderTable(['Col A', 'Col B'], [['Val 1', 'Val 2']]);
  const clean = stripAnsi(table);
  assert.ok(clean.includes('Col A'));
  assert.ok(clean.includes('Val 1'));
  assert.ok(clean.includes('┌'));
  assert.ok(clean.includes('┘'));
});

test('UI sparkline and 2D chart plot render numeric data accurately', () => {
  const spark = sparkline([1, 5, 2, 8, 12]);
  assert.ok(spark.length > 0);
  assert.ok(stripAnsi(spark).includes('█'));

  const chart = plot([10, 20, 15, 30, 25], { height: 6 });
  const cleanChart = stripAnsi(chart);
  assert.ok(cleanChart.includes('30.0'));
  assert.ok(cleanChart.includes('10.0'));
  assert.ok(cleanChart.includes('┤'));
});

test('UI image renderer handles binary PPM TrueColor buffers', () => {
  const ppm = Buffer.from(
    'P6\n2 2\n255\n' +
    '\xff\x00\x00\x00\xff\x00' +
    '\x00\x00\xff\xff\xff\x00',
    'binary'
  );
  const rendered = renderImage(ppm, { width: 4 });
  assert.ok(rendered.includes('▀'));
});

test('UI progress bar initializes and renders', () => {
  let captured = '';
  const mockStream = {
    isTTY: false,
    write(chunk) {
      captured += chunk;
    }
  };
  const bar = new ProgressBar(50, { stream: mockStream, width: 10 });
  bar.update(25);
  bar.stop();
  assert.ok(captured.includes('50%'));
  assert.ok(captured.includes('25/50'));
});

test('Library exports all UI and CLI components', () => {
  assert.ok(typeof clivibe.c === 'function');
  assert.ok(typeof clivibe.gradient === 'function');
  assert.ok(typeof clivibe.renderImage === 'function');
  assert.ok(typeof clivibe.boxen === 'function');
  assert.ok(typeof clivibe.createBox === 'function');
  assert.ok(typeof clivibe.sparkline === 'function');
  assert.ok(typeof clivibe.plot === 'function');
  assert.ok(typeof clivibe.ProgressBar === 'function');
  assert.ok(typeof clivibe.createSpinner === 'function');
  assert.ok(typeof clivibe.renderGauge === 'function');
  assert.ok(typeof clivibe.renderTree === 'function');
  assert.ok(typeof clivibe.badge === 'function');
  assert.ok(typeof clivibe.divider === 'function');
  assert.ok(typeof clivibe.keyvalue === 'function');
  assert.ok(typeof clivibe.runTask === 'function');
  assert.ok(typeof clivibe.runTasks === 'function');
  assert.ok(typeof clivibe.computeDiff === 'function');
  assert.ok(typeof clivibe.highlightJson === 'function');
  assert.ok(typeof clivibe.startServer === 'function');
});
