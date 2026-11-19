<div align="center">

<img src="./assets/clivibe-banner.svg" alt="clivibe banner" width="100%"/>

<br/>

<h1>clivibe ⚡</h1>

<p><strong>The Zero-Dependency Developer Cockpit, Swiss-Army CLI & Terminal UI Design System for Modern Engineers.</strong></p>

<p>
  <a href="https://www.npmjs.com/package/clivibe"><img src="https://img.shields.io/npm/v/clivibe?color=%235271FF&style=for-the-badge&logo=npm&logoColor=white" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/clivibe"><img src="https://img.shields.io/npm/dm/clivibe?color=%23FF61D2&style=for-the-badge&logo=npm&logoColor=white" alt="downloads"/></a>
  <img src="https://img.shields.io/badge/dependencies-0-success?style=for-the-badge&color=%2300F260" alt="zero dependencies"/>
  <a href="https://github.com/dnuzi/clivibe/actions"><img src="https://img.shields.io/github/actions/workflow/status/dnuzi/clivibe/ci.yml?branch=main&style=for-the-badge&label=CI&logo=github&logoColor=white" alt="CI Status"/></a>
  <a href="https://github.com/dnuzi/clivibe/discussions"><img src="https://img.shields.io/badge/discussions-active-blueviolet?style=for-the-badge&logo=github&logoColor=white" alt="Discussions"/></a>
  <a href="https://github.com/sponsors/dnuzi"><img src="https://img.shields.io/badge/sponsor-💖-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="Sponsor"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="license"/></a>
</p>

<br/>

<img src="./assets/demo.gif" alt="clivibe terminal demo" width="90%"/>

<br/>
<br/>

<p>
  <a href="#-quickstart"><strong>Quickstart</strong></a> ·
  <a href="#-terminal-ui-design-suite-zero-deps"><strong>UI Design Suite</strong></a> ·
  <a href="#-developer-cockpit-features"><strong>Developer Cockpit</strong></a> ·
  <a href="#-why-zero-dependencies"><strong>Philosophy</strong></a> ·
  <a href="#-contributing"><strong>Contributing</strong></a> ·
  <a href="#-sponsorship"><strong>Sponsor</strong></a>
</p>

</div>

---

## ⚡ Quickstart

**Run instantly from terminal with zero installation:**
```bash
npx clivibe
```

**Or install globally (provides both `clivibe` and the lightning-fast `cv` alias):**
```bash
npm install -g clivibe

cv              # Interactive TUI menu
cv doctor       # Scan your environment
cv top          # System dashboard
cv image logo.png  # Preview any image in TrueColor inside terminal
```

**Or import into your own Node.js project as a library:**
```javascript
import { c, chalk, gradient, renderImage, boxen, createSpinner, ProgressBar, sparkline, plot } from 'clivibe';
```

> Works natively on **macOS**, **Linux**, and **Windows** with Node.js 18+.

---

## 🎨 Terminal UI Design Suite (Zero Dependencies)

`clivibe` isn't just a CLI — it is also a complete, drop-in design system for building beautiful terminal apps without inflating your `node_modules`.

### 1. 🌈 Native Chalk Replacement (`c` or `chalk`)
Zero-dependency, chainable ANSI & TrueColor 24-bit styling:

```javascript
import { c, chalk } from 'clivibe';

console.log(c.bold.red('Error: connection timed out'));
console.log(c.bgHex('#5271FF').white.bold(' NEW '));
console.log(c.hex('#FF61D2').underline('Neon pink link'));
```

### 2. 🌌 Multi-Stop Gradient Engine (`gradient-string` alternative)
Multi-stop RGB color interpolation with gorgeous built-in palettes:

```javascript
import { gradient, gradients } from 'clivibe';

// Built-in presets: synthwave, fire, cyber, retro, aurora, sunset
console.log(gradients.synthwave('CLIVIBE GRADIENT ENGINE'));
console.log(gradients.fire('FIRE IN THE DISCO'));

// Custom gradient
const customGrad = gradient(['#FF007A', '#7928CA', '#00DFD8']);
console.log(customGrad('Custom multi-stop colors!'));
```

### 3. 🖼️ Terminal Image Previewer (`terminal-image` alternative)
Decodes PNG (using native `zlib`), BMP, and PPM in pure Node.js and renders them using Unicode half-blocks (`▀`) in 24-bit TrueColor:

```bash
# From CLI:
clivibe image ./assets/logo.png
```

```javascript
// As a library:
import { renderImage, renderAscii } from 'clivibe';

// TrueColor terminal rendering
console.log(renderImage('./screenshot.png', { width: 60 }));

// Pure ASCII characters fallback
console.log(renderAscii('./screenshot.png', { width: 40 }));
```

### 4. 📦 Boxen-Compatible ANSI Boxes
Create rounded, double, or bold borders with custom titles and alignments:

```javascript
import { boxen, createBox } from 'clivibe';

console.log(boxen('Server listening on http://localhost:3000', {
  title: '🚀 Deployment Ready',
  titleAlignment: 'center',
  borderColor: '#5271FF',
  borderStyle: 'round',
  padding: 1
}));
```

### 5. ⏳ Ora-Compatible Spinners
Zero-dependency animated terminal spinners with automatic TTY cursor control:

```javascript
import { createSpinner } from 'clivibe';

const spinner = createSpinner('Connecting to database...').start();
setTimeout(() => {
  spinner.succeed('Connected successfully!');
}, 1000);
```

### 6. 📊 Progress Bar (`cli-progress` alternative)
Smooth animated progress bar with ETA, elapsed time, and gradient fills:

```javascript
import { ProgressBar, gradients } from 'clivibe';

const bar = new ProgressBar(100, {
  gradient: gradients.synthwave,
  width: 30
});

bar.update(45); // [█████████████░░░░░░░] 45% | 45/100 | ETA: 1.2s
```

### 7. 📈 Sparklines & 2D Line Charts (`asciichart` alternative)
Render inline data trends or full 2D terminal line graphs:

```bash
# From CLI:
clivibe chart 10,25,18,34,42,29,55,48,62
clivibe spark 1,4,2,8,12,6,15,9,20
```

```javascript
// As a library:
import { sparkline, plot, gradients } from 'clivibe';

console.log(sparkline([1, 4, 2, 8, 12, 6, 15, 9, 20], { gradient: gradients.synthwave }));
// Output:  ▂ ▃▅▂▄▆▃█

console.log(plot([10, 25, 18, 34, 42, 29, 55, 48, 62], { height: 6, gradient: gradients.cyber }));
```

---

## 🧰 Developer Cockpit Features

### 🚨 `clivibe wtf` — Error Explainer
The fastest way to understand and fix broken commands. Pipe any failed output directly:

```bash
# JavaScript / Node.js
npm run build 2>&1 | clivibe wtf

# Python
python main.py 2>&1 | clivibe wtf

# Rust
cargo build 2>&1 | clivibe wtf

# Go
go run . 2>&1 | clivibe wtf

# Or paste the error directly
clivibe wtf "Error: listen EADDRINUSE: address already in use :::3000"
```

Recognizes **10+ common error patterns** across all languages and runtimes including port conflicts, missing packages, database auth failures, React hydration errors, Rust borrow checker violations, and Go import issues.

---

### 📜 `clivibe logsee` — JSON Log Viewer

Turn messy JSON / ndjson streams into beautiful, color-coded, searchable log views:

```bash
clivibe logsee server.log
clivibe logsee server.log --level error
clivibe logsee server.log --search "user_id"

# Pipe directly from a running process:
node server.js | clivibe logsee
python api.py  | clivibe logsee --level warn
```

---

### 🌿 `clivibe git` — Git AI Assistant

```bash
clivibe git commit    # Analyzes staged diff → proposes conventional commit
clivibe git clean     # Arrow-key branch cleaner TUI
clivibe git standup   # Generates Markdown standup from recent commits
```

---

### 🩺 `clivibe doctor` — Environment Doctor

Scans your project and runtime environment end-to-end:

| Check | What It Inspects |
|-------|-----------------|
| **Runtimes** | Node.js, Python, Go, Rust/Cargo |
| **Project Manifests** | `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml` |
| **Environment** | `.env.example` vs `.env` missing keys |
| **Ports** | 3000, 5173, 8080, 5432 — reports live conflicts |
| **Docker** | Daemon health and active containers |

```bash
clivibe doctor
```

---

### 🖥️ `clivibe top` — Terminal Cockpit Dashboard

```bash
clivibe top
```

Shows live system telemetry, Git working tree status, and Docker containers in one single terminal screen:

```
╭── SYSTEM METRICS ───────────────────────────────╮
│  Host:    MacBook-Pro (darwin arm64)            │
│  CPUs:    8 cores @ Apple M2                    │
│  Memory:  [████████░░░░░░░░] 52% (8.3 / 16 GB) │
│  Uptime:  4.2 hours                             │
╰─────────────────────────────────────────────────╯

╭── GIT REPOSITORY ──────────────────────╮
│  Branch:  main ✔ (clean)               │
│  Commit:  feat: add logsee filter cli  │
╰────────────────────────────────────────╯
```

---

### 🤖 `clivibe ai` — Codebase AI Assistant

Query any codebase locally — no cloud, no API key required:

```bash
clivibe ai "where is auth handled?"
clivibe ai "find all database query functions"
clivibe ai "where is the JWT token validated?"
```

Crawls `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, `.yaml`, `.md` and more. Connects to local **Ollama** models (`llama3`, `deepseek-r1`, `qwen2.5-coder`) when available with instant heuristic fallback.

---

### 🛠️ `clivibe utils` — Daily Developer Utilities

```bash
clivibe kill-port 3000               # Kill process locking a port (macOS, Linux, Windows)
clivibe curl https://api.github.com  # Smart HTTP client with latency breakdown
clivibe cron "*/15 * * * *"          # Explain cron schedule in human language
clivibe hash "my-api-key"            # MD5, SHA1, SHA256, Base64 & UUID in one shot
```

---

### 📦 `clivibe scaffold` — Project Scaffolder

```bash
clivibe scaffold my-api
```

Generates a production-ready project starter with Dockerfile, CI workflow, linting, and directory structure for:
- **Full-Stack Next.js** (TypeScript + Tailwind)
- **REST API** (Node.js + Express + Docker + healthcheck)
- **Python Microservice** (FastAPI + Pydantic + Uvicorn + Docker)
- **Zero-Dependency CLI Tool** (Node.js, native test runner)

---

## 💡 Why Zero Dependencies?

| Concern | With other libraries (`chalk`, `boxen`, etc.) | With `clivibe` |
|---------|-----------------------------------------------|----------------|
| **Cold Start** | 50–500ms loading 30+ transitive packages | **< 20ms** instant |
| **Install Size** | 50MB+ `node_modules` | **0 bytes** |
| **Supply Chain Risk** | Hundreds of dependencies to audit | **None** |
| **Offline Usage** | Package lock resolution required | **Always works** |

Every utility and UI component is built purely from native Node.js standard library APIs: `net`, `readline`, `child_process`, `crypto`, `os`, `fs`, `zlib`, `http`.

---

## 💬 Community & Discussions

Have a question, feature idea, or error pattern suggestion?
Join the conversation in [GitHub Discussions](https://github.com/dnuzi/clivibe/discussions)!

---

## 💖 Sponsorship

If `clivibe` makes your life easier or speeds up your workflow, please consider sponsoring:

- [Sponsor on GitHub](https://github.com/sponsors/dnuzi)
- [Buy Me a Coffee](https://buymeacoffee.com/dnuzi)

---

## 🤝 Contributing

Contributions, bug fixes, and new error pattern recognition are very welcome!

```bash
# 1. Fork the repository and clone it
git clone https://github.com/your-username/clivibe.git
cd clivibe

# 2. Run the CLI locally
node bin/clivibe.js

# 3. Run tests (zero dependencies, native Node.js test runner)
npm test
```

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) first.

---

## 📄 License

MIT © [DanuZz](https://github.com/dnuzi)

---

<div align="center">

**If `clivibe` saved you time, please ⭐ star the repo — it helps others discover it!**

<br/>

<sub>Built with ❤️ and zero `node_modules`.</sub>

</div>
