<div align="center">

# velx ⚡

**The Zero-Dependency Developer Cockpit & Swiss-Army CLI for Modern Engineers.**

[![npm version](https://img.shields.io/npm/v/velx?color=blue&style=flat-square)](https://www.npmjs.com/package/velx)
[![dependencies](https://img.shields.io/badge/dependencies-0-success?style=flat-square)](package.json)
[![node version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

<br/>

<img src="./assets/demo.svg" alt="velx terminal demo" width="100%" />

<br/>

One command. Zero `node_modules` overhead. Instant execution.  
Diagnose cryptic errors, stream JSON logs, clean Git branches, check environment health, and access daily developer utilities in milliseconds.

</div>

---

## ⚡ Quickstart

Run directly without installing anything:

```bash
npx velx
```

Or install globally:

```bash
npm install -g velx
```

> **Pro-tip:** You can also use the ultra-fast shorthand alias **`vx`**!
> ```bash
> vx top
> vx wtf "Error: listen EADDRINUSE :3000"
> ```

---

## 🧰 The Developer Suite

### 1. Interactive Cockpit Menu
Launch the arrow-key interactive TUI launcher:
```bash
velx
```

### 2. Error Explainer (`wtf`)
Pipe any failed command or paste an error string to get an instant diagnosis and copyable fixes:
```bash
velx wtf "Error: listen EADDRINUSE :3000"
# or pipe from your terminal:
npm run build 2>&1 | velx wtf
python main.py 2>&1 | velx wtf
cargo build 2>&1 | velx wtf
```

### 3. JSON Log Viewer (`logsee`)
View and search structured JSON log streams with color-coded severity pills:
```bash
velx logsee server.log
velx logsee server.log --level error
cat app.log | velx logsee --search "user_id"
```

### 4. Git Assistant
Automate daily Git chore workflows:
```bash
velx git commit     # Proposes conventional commit message from staged diff
velx git clean      # Interactive branch cleaner
velx git standup    # Summarizes recent commits into a Markdown standup report
```

### 5. Environment Doctor (`doctor`)
Scan local project manifests, runtime versions (Node, Python, Go, Rust), port collisions, and `.env` discrepancies:
```bash
velx doctor
```

### 6. System & Container Cockpit (`top`)
View memory gauges, listening ports, Docker container health, and Git working tree status:
```bash
velx top
```

### 7. Codebase Assistant (`ai`)
Query repository files locally using Ollama (`llama3`, `deepseek-r1`) or built-in semantic crawlers:
```bash
velx ai "where is authentication defined?"
```

### 8. Daily Developer Utilities (`utils`)
Fast helpers for everyday workflows:
```bash
velx kill-port 3000                 # Terminate process locking a port
velx curl https://api.github.com   # HTTP client with latency metrics
velx cron "*/15 * * * *"            # Explains cron schedule in plain English
velx hash "input-text"              # MD5, SHA256, Base64 & UUID generator
```

---

## 💡 Why Zero Dependencies?

1. **Instant Cold Start:** Starts in **0.1 seconds**. No waiting for 50MB of third-party packages to download.
2. **Zero Supply-Chain Risks:** 100% built on native Node.js APIs (`net`, `readline`, `child_process`, `crypto`, `os`, `fs`).
3. **Universal Portability:** Runs identically on macOS, Linux, and Windows.

---

## 🤝 Contributing

Contributions, new error patterns, and ideas are welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md) for guidelines.

```bash
git clone https://github.com/dnuzi/velx.git
cd velx
npm test
```

---

## 📄 License

MIT © [DanuZz](https://github.com/dnuzi)
