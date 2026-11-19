<div align="center">

<img src="https://raw.githubusercontent.com/dnuzi/clivibe/main/assets/clivibe-banner.svg" width="760" alt="clivibe" />

<br/>

**The Zero-Dependency Developer Cockpit & Terminal UI System for Node.js.**

[![npm version](https://img.shields.io/npm/v/clivibe.svg?style=flat-square&color=5271FF)](https://www.npmjs.com/package/clivibe)
[![npm downloads](https://img.shields.io/npm/dm/clivibe.svg?style=flat-square&color=5271FF)](https://www.npmjs.com/package/clivibe)
[![License: MIT](https://img.shields.io/badge/License-MIT-5271FF.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-5271FF.svg?style=flat-square)](https://nodejs.org)
[![GitHub Discussions](https://img.shields.io/github/discussions/dnuzi/clivibe?style=flat-square&color=5271FF)](https://github.com/dnuzi/clivibe/discussions)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-5271FF?style=flat-square)](https://github.com/sponsors/dnuzi)

<br/><br/>

<img src="https://raw.githubusercontent.com/dnuzi/clivibe/main/assets/demo.gif" width="760" alt="clivibe in action" />

</div>

---

## Quick Start

```sh
# Run instantly without installing
npx clivibe

# Or install globally for everyday developer workflow
npm install -g clivibe

# Or add as a zero-dependency UI toolkit in your project
npm install clivibe
```

---

## Table of Contents

- [Developer Cockpit CLI](#developer-cockpit-cli)
  - [Interactive Menu Dashboard](#interactive-menu-dashboard)
  - [Environment & Project Diagnostics (`doctor`)](#environment--project-diagnostics-doctor)
  - [Instant Error Explainer (`wtf`)](#instant-error-explainer-wtf)
  - [Real-Time Terminal Monitor (`top`)](#real-time-terminal-monitor-top)
  - [Git Workflow Automations (`git`)](#git-workflow-automations-git)
  - [Structured Log Streamer (`logsee`)](#structured-log-streamer-logsee)
  - [Port Killer (`kill-port`)](#port-killer-kill-port)
  - [Smart HTTP Client (`curl`)](#smart-http-client-curl)
  - [Cron Schedule Explainer (`cron`)](#cron-schedule-explainer-cron)
  - [Hash & UUID Generator (`hash`)](#hash--uuid-generator-hash)
  - [Project Scaffolding (`scaffold`)](#project-scaffolding-scaffold)
  - [Local AI & Heuristic Helper (`ai`)](#local-ai--heuristic-helper-ai)
- [Terminal UI & Styling Engine](#terminal-ui--styling-engine)
  - [Terminal Colors & Styles](#terminal-colors--styles)
  - [Gradients & Palettes](#gradients--palettes)
  - [Borders & Boxes](#borders--boxes)
  - [Progress Bars](#progress-bars)
  - [Data Visualization (Sparklines & Charts)](#data-visualization-sparklines--charts)
  - [Widgets (Tree, Gauge, Badge, Divider, Table)](#widgets-tree-gauge-badge-divider-table)
  - [TrueColor Terminal Image Viewer](#truecolor-terminal-image-viewer)
  - [Spinners & Prompts](#spinners--prompts)
- [Zero Dependencies](#zero-dependencies)
- [License](#license)

---

# Developer Cockpit CLI

### Interactive Menu Dashboard

Launch the full interactive terminal cockpit with a single command:

```sh
clivibe
# or
cv
```

Presents an interactive keyboard-navigable menu (`↑`/`↓` and `Enter`) to access all system tools, git helpers, monitors, and UI diagnostics.

---

### Environment & Project Diagnostics (`doctor`)

Inspect your runtime environment, missing configuration files, environment variables, active ports, and project manifests across Node.js, Python, Rust, Go, and Docker.

```sh
clivibe doctor
```

**Checks performed:**
- Node.js runtime version compatibility (`>= 18.0.0`)
- Git CLI version and current committer configuration
- Docker daemon status (running / stopped)
- Multi-runtime detection (Python virtualenvs, Go modules, Cargo manifests)
- Environment variable verification: diffs `.env.example` vs `.env` to flag missing keys
- Standard dev ports availability (`3000`, `5173`, `8080`, `5432`)

---

### Instant Error Explainer (`wtf`)

Diagnose complex terminal exceptions, stack traces, and build failures. Translates raw stack traces into clear root-cause explanations and actionable, copy-paste fixes.

```sh
# Direct error argument
clivibe wtf "Error: listen EADDRINUSE :::3000"

# Pipe directly from failed builds or processes
npm run build 2>&1 | clivibe wtf
docker compose up 2>&1 | clivibe wtf
```

**Built-in heuristic patterns:**
- `EADDRINUSE` (port conflict with command to inspect and terminate PID)
- `Cannot find module` (missing dependency identification)
- `ModuleNotFoundError` (Python virtualenv & requirements resolution)
- `borrow of moved value` (Rust ownership error analysis)
- `imported and not used` (Go compiler unused import cleanup)
- `ECONNREFUSED` (database, Redis, or backend service connection failure)
- `password authentication failed` (PostgreSQL / database credential mismatch)
- `Hydration failed` (React SSR / client mismatch troubleshooting)
- `EACCES: permission denied` (file permission and ownership remediation)

---

### Real-Time Terminal Monitor (`top`)

An ultra-lightweight terminal cockpit displaying live system vitals, Git working tree status, and Docker container state.

```sh
clivibe top
```

Displays CPU utilization gauges, memory meters, active Git branch with uncommitted changes count, and running container statistics in a clean, self-updating dashboard.

---

### Git Workflow Automations (`git`)

Simplify day-to-day Git operations with streamlined subcommands:

```sh
# Generate a clean Markdown standup summary from recent commits
clivibe git standup

# Interactive Conventional Commit generator (feat, fix, docs, refactor...)
clivibe git commit

# Interactive branch cleaner (safely delete merged / stale local branches)
clivibe git clean
```

---

### Structured Log Streamer (`logsee`)

Colorize, parse, and search structured JSON or plain text logs in real time.

```sh
# Stream and follow live application logs
clivibe logsee app.log

# View structured logs with search filtering
clivibe logsee /var/log/server.log --filter error
```

Automatically formats timestamps, highlights status codes, and colors log levels (`ERROR`, `WARN`, `INFO`, `DEBUG`).

---

### Port Killer (`kill-port`)

Quickly identify and free ports occupied by orphaned processes:

```sh
clivibe kill-port 3000
clivibe kill-port 8080
```

Cross-platform: works seamlessly on macOS, Linux, and Windows without external dependencies.

---

### Smart HTTP Client (`curl`)

Test API endpoints directly from your terminal with visual status badges, latency breakdowns, and formatted JSON output:

```sh
clivibe curl https://api.github.com
clivibe curl localhost:3000/api/health
```

Outputs HTTP status badges (`200 OK`, `404 Not Found`), roundtrip response latency in milliseconds, headers, and indented JSON body preview.

---

### Cron Schedule Explainer (`cron`)

Convert 5-field cron syntax into human-readable English:

```sh
clivibe cron "*/15 * * * *"
# Outputs: Runs every 15 minutes

clivibe cron "0 9 * * 1-5"
# Outputs: Runs at 09:00, Monday through Friday
```

---

### Hash & UUID Generator (`hash`)

Generate cryptographically secure hashes and unique identifiers in one pass:

```sh
clivibe hash "my-secret-key"
```

Generates:
- **SHA-256** checksum
- **MD5** digest
- **Base64** encoded string
- **UUID v4** cryptographically random identifier

---

### Project Scaffolding (`scaffold`)

Scaffold clean starter projects configured with modern TypeScript/ESM presets:

```sh
clivibe scaffold my-project
```

Presents an interactive selector for Node.js REST API, CLI tool, or web application starter kits.

---

### Local AI & Heuristic Helper (`ai`)

Query your codebase or obtain development suggestions using local Ollama integration or built-in offline heuristics:

```sh
clivibe ai "How do I set up a rate limiter in Express?"
```

---

# Terminal UI & Styling Engine

clivibe is also a comprehensive, zero-dependency terminal UI library that you can import into your Node.js scripts.

### Terminal Colors & Styles

```js
import { c } from 'clivibe/colors';

// Standard colors
console.log(c.red('Error message'));
console.log(c.green('Operation successful'));
console.log(c.yellow('Configuration warning'));
console.log(c.cyan('System notice'));

// Modifiers & chaining
console.log(c.bold.underline.white('Important Title'));
console.log(c.dim('Secondary metadata'));
console.log(c.inverse(' Inverted label '));

// 24-bit TrueColor hex & rgb
console.log(c.hex('#5271FF')('Hex colored text'));
console.log(c.rgb(255, 97, 210)('RGB colored text'));

// Background colors
console.log(c.bgRed.brightWhite.bold(' CRITICAL '));
console.log(c.bgHex('#5271FF').white(' BADGE '));
```

---

### Gradients & Palettes

Create multi-stop linear and HSV-interpolated gradients:

```js
import { gradients, gradient } from 'clivibe/colors';

// 16 Built-in palettes
console.log(gradients.synthwave('SYNTHWAVE VIBES'));
console.log(gradients.rainbow('Spectrum of colors'));
console.log(gradients.fire('High performance engine'));
console.log(gradients.cyber('Cyberpunk terminal'));
console.log(gradients.pastel('Soft pastel tones'));
console.log(gradients.cristal('Crystal clear output'));

// Custom multi-stop gradient
const customGrad = gradient(['#FF61D2', '#5271FF', '#12D8FA']);
console.log(customGrad('Custom linear gradient text'));

// HSV color wheel interpolation
const smoothGrad = gradient(['#ff0000', '#0000ff'], {
  interpolation: 'hsv',
  hsvSpin: 'long'
});
console.log(smoothGrad('HSV interpolated gradient'));
```

**Built-in palettes:** `rainbow` · `pastel` · `cristal` · `mind` · `passion` · `retro` · `fire` · `cyber` · `synthwave` · `aurora` · `sunset` · `vice` · `fruit` · `summer` · `atlas` · `sublime`

---

### Borders & Boxes

Render styled terminal boxes with title alignment, border colors, and customizable padding:

```js
import { createBox, boxen } from 'clivibe/box';

// Fast styled box
console.log(createBox('Server running on port 3000', 'DEPLOYED', '#5271FF'));

// Advanced box configuration
console.log(boxen('Multi-line content\nAll systems operational', {
  title: 'STATUS REPORT',
  titleAlignment: 'center',
  borderStyle: 'double', // 'round' | 'single' | 'double' | 'bold' | 'classic'
  borderColor: '#12D8FA',
  padding: 1,
  margin: 1
}));
```

---

### Progress Bars

Smooth, gradient-capable terminal progress bars:

```js
import { ProgressBar } from 'clivibe/progress';

const bar = new ProgressBar(100, {
  width: 40,
  gradient: ['#5271FF', '#FF61D2'],
  format: 'Uploading :bar :percent (:current/:total)'
});

bar.update(45);
// Uploading ██████████████████░░░░░░░░░░░░░░ 45% (45/100)

bar.complete();
```

---

### Data Visualization (Sparklines & Charts)

Render inline sparklines or full 2D ASCII graphs directly in terminal output:

```js
import { sparkline, plot } from 'clivibe/chart';

// Inline sparkline
const trend = sparkline([5, 12, 18, 9, 24, 35, 42, 28, 50, 65, 72, 58, 80, 95]);
console.log(`Throughput: ${trend}`);
// Throughput:  ▂▂ ▃▄▄▃▅▆▆▅▇█

// 2D line plot with auto-scaled axes
console.log(plot([10, 25, 18, 34, 55, 42, 60, 35], {
  height: 8,
  label: 'Requests / sec'
}));
```

---

### Widgets (Tree, Gauge, Badge, Divider, Table)

```js
import { renderTree, renderGauge, badge, divider, keyvalue } from 'clivibe/widgets';
import { renderTable } from 'clivibe';

// 1. Directory & Object Tree
renderTree({
  name: 'src',
  children: [
    { name: 'index.js' },
    {
      name: 'ui',
      children: [{ name: 'colors.js' }, { name: 'widgets.js' }]
    }
  ]
});

// 2. Graphical Percentage Gauge
console.log(renderGauge(78, { label: 'Memory Usage', width: 25 }));
// Memory Usage [███████████████████░░░░░░] 78%

// 3. Status Badges
console.log(badge('v1.2.0', '#5271FF') + ' ' + badge('PASS', '#00ff00'));

// 4. Section Divider
console.log(divider('BUILD METRICS'));

// 5. Aligned Key-Value Lists
keyvalue({
  Environment: 'Production',
  Node: process.version,
  Status: 'Active'
});

// 6. Formatted ASCII Tables
console.log(renderTable(
  ['Command', 'Runtime', 'Status'],
  [
    ['doctor', '45ms', 'Passed'],
    ['wtf', '12ms', 'Passed'],
    ['chart', '8ms', 'Passed']
  ]
));
```

---

### TrueColor Terminal Image Viewer

Decode and display PNG, BMP, and PPM images right in the terminal using 24-bit ANSI half-block characters:

```js
import { renderImage } from 'clivibe/image';

// Automatically scales to fit terminal dimensions
await renderImage('./logo.png', { width: 60 });
```

---

### Spinners & Prompts

Zero-dependency interactive terminal prompts and animated spinners:

```js
import { createSpinner, promptSelect, promptInput, promptConfirm } from 'clivibe';

// Loading spinner
const spinner = createSpinner('Analyzing codebase...').start();
await doAsyncWork();
spinner.stop('Analysis complete');

// Interactive selection
const selected = await promptSelect('Choose a template:', ['Express', 'Fastify', 'CLI Tool']);

// User text input
const name = await promptInput('Project name:', 'my-app');

// Confirmation dialog
const confirmed = await promptConfirm('Deploy to production?');
```

---

## Zero Dependencies

`clivibe` contains **0 external dependencies**. Every color parser, gradient interpolator, image decoder, box renderer, chart plotter, and process inspector is implemented using native Node.js core modules (`zlib`, `net`, `fs`, `crypto`, `child_process`, `readline`).

---

## Contributing

Contributions, issues, and feature requests are welcome.

- [GitHub Discussions](https://github.com/dnuzi/clivibe/discussions)
- [Report an Issue](https://github.com/dnuzi/clivibe/issues)
- [Sponsor Development](https://github.com/sponsors/dnuzi)

---

## License

[MIT](LICENSE) © [DanuZz](https://github.com/dnuzi)
