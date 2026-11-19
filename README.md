<div align="center">

<img src="./assets/velx-banner.svg" alt="velx banner" width="100%"/>

<br/>

<h1>velx ⚡</h1>

<p><strong>The Zero-Dependency Developer Cockpit & Swiss-Army CLI for Modern Engineers.</strong></p>

<p>
  <a href="https://www.npmjs.com/package/velx"><img src="https://img.shields.io/npm/v/velx?color=%235271FF&style=for-the-badge&logo=npm&logoColor=white" alt="npm version"/></a>
  <a href="https://www.npmjs.com/package/velx"><img src="https://img.shields.io/npm/dm/velx?color=%23FF61D2&style=for-the-badge&logo=npm&logoColor=white" alt="downloads"/></a>
  <img src="https://img.shields.io/badge/dependencies-0-success?style=for-the-badge&color=%2300F260" alt="zero dependencies"/>
  <a href="https://github.com/dnuzi/velx/actions"><img src="https://img.shields.io/github/actions/workflow/status/dnuzi/velx/ci.yml?branch=main&style=for-the-badge&label=CI&logo=github&logoColor=white" alt="CI Status"/></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge&logo=node.js&logoColor=white" alt="node"/>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="license"/></a>
</p>

<br/>

<img src="./assets/demo.svg" alt="velx terminal demo" width="90%"/>

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
npx velx
```

**Or install globally (then use the ultra-short `vx` alias):**
```bash
npm install -g velx

vx              # Interactive TUI menu
vx doctor       # Scan your environment
vx top          # System dashboard
```

> Works on **macOS**, **Linux**, and **Windows** with Node.js 18+.

---

## 🧰 Features

### 🚨 `velx wtf` — Error Explainer
The fastest way to understand and fix broken commands. Pipe any failed output directly:

```bash
# JavaScript / Node.js
npm run build 2>&1 | velx wtf

# Python
python main.py 2>&1 | velx wtf

# Rust
cargo build 2>&1 | velx wtf

# Go
go run . 2>&1 | velx wtf

# Or paste the error directly
velx wtf "Error: listen EADDRINUSE: address already in use :::3000"
```

Recognizes **10+ common error patterns** across all languages and runtimes including port conflicts, missing packages, database auth failures, React hydration errors, Rust borrow checker violations, and Go import issues.

---

### 📜 `velx logsee` — JSON Log Viewer

Turn messy JSON ndjson streams into beautiful, color-coded, searchable log views:

```bash
velx logsee server.log
velx logsee server.log --level error
velx logsee server.log --search "user_id"

# Pipe directly from a running process:
node server.js | velx logsee
python api.py  | velx logsee --level warn
```

---

### 🌿 `velx git` — Git AI Assistant

```bash
velx git commit    # Analyzes staged diff → proposes conventional commit
velx git clean     # Arrow-key branch cleaner TUI
velx git standup   # Generates Markdown standup from recent commits
```

---

### 🩺 `velx doctor` — Environment Doctor

Scans your project and runtime environment end-to-end:

| Check | What It Inspects |
|-------|-----------------|
| **Runtimes** | Node.js, Python, Go, Rust/Cargo |
| **Project Manifests** | `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml` |
| **Environment** | `.env.example` vs `.env` missing keys |
| **Ports** | 3000, 5173, 8080, 5432 — reports live conflicts |
| **Docker** | Daemon health and active containers |

```bash
velx doctor
```

---

### 🖥️ `velx top` — Terminal Cockpit Dashboard

```bash
velx top
```

Shows live system telemetry, Git working tree status, and Docker containers in one single terminal screen:

```
╭── SYSTEM METRICS ───────────────────────────────╮
│  Host:    MacBook-Pro (darwin arm64)              │
│  CPUs:    8 cores @ Apple M2                      │
│  Memory:  [████████░░░░░░░░] 52% (8.3 / 16 GB)   │
│  Uptime:  4.2 hours                               │
╰─────────────────────────────────────────────────╯

╭── GIT REPOSITORY ──────────────────────╮
│  Branch:  main ✔ (clean)               │
│  Commit:  feat: add logsee filter cli  │
╰────────────────────────────────────────╯
```

---

### 🤖 `velx ai` — Codebase AI Assistant

Query any codebase locally — no cloud, no API key required:

```bash
velx ai "where is auth handled?"
velx ai "find all database query functions"
velx ai "where is the JWT token validated?"
```

Crawls `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, `.yaml`, `.md` and more. Connects to local **Ollama** models (`llama3`, `deepseek-r1`, `qwen2.5-coder`) when available.

---

### 🛠️ `velx utils` — Daily Developer Utilities

```bash
velx kill-port 3000               # Kill process locking a port (macOS, Linux, Windows)
velx curl https://api.github.com  # Smart HTTP client with latency breakdown
velx cron "*/15 * * * *"          # Explain cron schedule in human language
velx hash "my-api-key"            # MD5, SHA1, SHA256, Base64 & UUID in one shot
```

---

### 📦 `velx scaffold` — Project Scaffolder

```bash
velx scaffold my-api
```

Generates a production-ready project starter with Dockerfile, CI workflow, linting, and directory structure for:
- **Full-Stack Next.js** (TypeScript + Tailwind)
- **REST API** (Node.js + Express + Docker + healthcheck)
- **Python Microservice** (FastAPI + Pydantic + Uvicorn + Docker)
- **Zero-Dependency CLI Tool** (Node.js, native test runner)

---

## 💡 Why Zero Dependencies?

| Concern | With `npm install` | With `velx` |
|---------|--------------------|-------------|
| **Cold Start** | 50–500ms loading packages | **< 50ms** instant |
| **Install Size** | 50MB+ `node_modules` | **0 bytes** |
| **Supply Chain Risk** | Thousands of transitive deps | **None** |
| **Offline Usage** | May fail | **Always works** |

Every utility is built from native Node.js APIs: `net`, `readline`, `child_process`, `crypto`, `os`, `fs`, `http`.

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
| Config file (`.velxrc.json`) | 🔜 Planned |
| Plugin system for custom commands | 🔜 Planned |
| Watch mode for log tailing | 🔜 Planned |

---

## 🤝 Contributing

Contributions, bug fixes, and new error pattern recognition are very welcome!

```bash
# 1. Fork the repository and clone it
git clone https://github.com/your-username/velx.git
cd velx

# 2. Run the CLI locally
node bin/velx.js

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

**If `velx` saved you time, please ⭐ star the repo — it helps others discover it!**

<br/>

<sub>Built with ❤️ and zero `node_modules`.</sub>

</div>
