<div align="center">

<img src="./assets/clixy-banner.svg" alt="clixy banner" width="100%"/>

<br/>

<h1>clixy ⚡</h1>

<p><strong>The Zero-Dependency Developer Cockpit & Swiss-Army CLI for Modern Engineers.</strong></p>

<p>
  <a href="https://www.npmjs.com/package/clixy"><img src="https://img.shields.io/npm/v/clixy?color=%235271FF&style=for-the-badge&logo=npm&logoColor=white" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/clixy"><img src="https://img.shields.io/npm/dm/clixy?color=%23FF61D2&style=for-the-badge&logo=npm&logoColor=white" alt="downloads"/></a>
  <img src="https://img.shields.io/badge/dependencies-0-success?style=for-the-badge&color=%2300F260" alt="zero dependencies"/>
  <a href="https://github.com/dnuzi/clixy/actions"><img src="https://img.shields.io/github/actions/workflow/status/dnuzi/clixy/ci.yml?branch=main&style=for-the-badge&label=CI&logo=github&logoColor=white" alt="CI Status"/></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge&logo=node.js&logoColor=white" alt="node"/>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="license"/></a>
</p>

<br/>

<img src="./assets/demo.gif" alt="clixy terminal demo" width="90%"/>

<br/>
<br/>

<p>
  <a href="#-quickstart"><strong>Quickstart</strong></a> ·
  <a href="#-features"><strong>Features</strong></a> ·
  <a href="#-why-zero-dependencies"><strong>Philosophy</strong></a> ·
  <a href="#-contributing"><strong>Contributing</strong></a> ·
  <a href="#-roadmap"><strong>Roadmap</strong></a>
</p>

</div>

---

## ⚡ Quickstart

**Run instantly, zero install needed:**
```bash
npx clixy
```

**Or install globally (with the ultra-fast `cx` shortcut alias):**
```bash
npm install -g clixy

cx              # Interactive TUI menu
cx doctor       # Scan your environment
cx top          # System dashboard
```

> Works seamlessly on **macOS**, **Linux**, and **Windows** with Node.js 18+.

---

## 🧰 Features

### 🚨 `clixy wtf` — Error Explainer
The fastest way to understand and fix broken commands. Pipe any failed output directly:

```bash
# JavaScript / Node.js
npm run build 2>&1 | clixy wtf

# Python
python main.py 2>&1 | clixy wtf

# Rust
cargo build 2>&1 | clixy wtf

# Go
go run . 2>&1 | clixy wtf

# Or paste the error directly
clixy wtf "Error: listen EADDRINUSE: address already in use :::3000"
```

Recognizes **10+ common error patterns** across all languages and runtimes including port conflicts, missing packages, database auth failures, React hydration errors, Rust borrow checker violations, and Go import issues.

---

### 📜 `clixy logsee` — JSON Log Viewer

Turn messy JSON / ndjson streams into beautiful, color-coded, searchable log views:

```bash
clixy logsee server.log
clixy logsee server.log --level error
clixy logsee server.log --search "user_id"

# Pipe directly from a running process:
node server.js | clixy logsee
python api.py  | clixy logsee --level warn
```

---

### 🌿 `clixy git` — Git AI Assistant

```bash
clixy git commit    # Analyzes staged diff → proposes conventional commit
clixy git clean     # Arrow-key branch cleaner TUI
clixy git standup   # Generates Markdown standup from recent commits
```

---

### 🩺 `clixy doctor` — Environment Doctor

Scans your project and runtime environment end-to-end:

| Check | What It Inspects |
|-------|-----------------|
| **Runtimes** | Node.js, Python, Go, Rust/Cargo |
| **Project Manifests** | `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml` |
| **Environment** | `.env.example` vs `.env` missing keys |
| **Ports** | 3000, 5173, 8080, 5432 — reports live conflicts |
| **Docker** | Daemon health and active containers |

```bash
clixy doctor
```

---

### 🖥️ `clixy top` — Terminal Cockpit Dashboard

```bash
clixy top
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

### 🤖 `clixy ai` — Codebase AI Assistant

Query any codebase locally — no cloud, no API key required:

```bash
clixy ai "where is auth handled?"
clixy ai "find all database query functions"
clixy ai "where is the JWT token validated?"
```

Crawls `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, `.yaml`, `.md` and more. Connects to local **Ollama** models (`llama3`, `deepseek-r1`, `qwen2.5-coder`) when available with instant heuristic fallback.

---

### 🛠️ `clixy utils` — Daily Developer Utilities

```bash
clixy kill-port 3000               # Kill process locking a port (macOS, Linux, Windows)
clixy curl https://api.github.com  # Smart HTTP client with latency breakdown
clixy cron "*/15 * * * *"          # Explain cron schedule in human language
clixy hash "my-api-key"            # MD5, SHA1, SHA256, Base64 & UUID in one shot
```

---

### 📦 `clixy scaffold` — Project Scaffolder

```bash
clixy scaffold my-api
```

Generates a production-ready project starter with Dockerfile, CI workflow, linting, and directory structure for:
- **Full-Stack Next.js** (TypeScript + Tailwind)
- **REST API** (Node.js + Express + Docker + healthcheck)
- **Python Microservice** (FastAPI + Pydantic + Uvicorn + Docker)
- **Zero-Dependency CLI Tool** (Node.js, native test runner)

---

## 🎨 Native Color & Gradient Engine

`clixy` includes a built-in TrueColor RGB and ANSI gradient engine inspired by `chalk` and `gradient-string`, written 100% from scratch with **zero external dependencies**:

```javascript
import { c, gradients } from 'clixy/ui';

// Chainable styling (Chalk-like syntax)
console.log(c.bold.cyan('Ready'));
console.log(c.hex('#FF61D2')('Neon Pink'));

// Multi-stop gradients (Gradient-string algorithm)
console.log(gradients.synthwave('CLIXY ENGINE'));
console.log(gradients.fire('SYSTEM HOT'));
```

---

## 💡 Why Zero Dependencies?

| Concern | With `npm install` | With `clixy` |
|---------|--------------------|--------------|
| **Cold Start** | 50–500ms loading packages | **< 30ms** instant |
| **Install Size** | 50MB+ `node_modules` | **0 bytes** |
| **Supply Chain Risk** | Thousands of transitive deps | **None** |
| **Offline Usage** | May fail | **Always works** |

Every utility is built purely from native Node.js standard library APIs: `net`, `readline`, `child_process`, `crypto`, `os`, `fs`, `http`.

---

## 🗺️ Roadmap

| Feature | Status |
|---------|--------|
| Multi-language error patterns | ✅ Done |
| JSON log viewer with search | ✅ Done |
| Git smart commit + standup | ✅ Done |
| Environment doctor | ✅ Done |
| System + Docker dashboard | ✅ Done |
| Local AI codebase search | ✅ Done |
| Developer utility suite | ✅ Done |
| VHS animated demo GIF | ✅ Done |
| npm auto-publish via CI | ✅ Done |
| Config file (`.clixyrc.json`) | 🔜 Planned |
| Plugin system for custom commands | 🔜 Planned |
| Watch mode for log tailing | 🔜 Planned |

---

## 🤝 Contributing

Contributions, bug fixes, and new error pattern recognition are very welcome!

```bash
# 1. Fork the repository and clone it
git clone https://github.com/your-username/clixy.git
cd clixy

# 2. Run the CLI locally
node bin/clixy.js

# 3. Run tests (zero dependencies, native Node.js test runner)
npm test
```

> **Adding a new error pattern?** Drop a few lines into [`src/commands/wtf.js`](./src/commands/wtf.js).  
> **Adding a new utility?** Create a file in [`src/commands/`](./src/commands/) and register it in [`src/index.js`](./src/index.js).

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) first.

---

## 📄 License

MIT © [DanuZz](https://github.com/dnuzi)

---

<div align="center">

**If `clixy` saved you time, please ⭐ star the repo — it helps others discover it!**

<br/>

<sub>Built with ❤️ and zero `node_modules`.</sub>

</div>
