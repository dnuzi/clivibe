# DevPulse ⚡

> The Zero-Dependency Developer Cockpit & Swiss-Army CLI for Modern Engineers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](package.json)

DevPulse combines daily developer chores into a single, high-performance terminal utility built entirely on native Node.js APIs. No `node_modules` required to download or run.

---

## Quickstart

Run directly with zero installation:

```bash
npx devpulse
```

Or install globally:

```bash
npm install -g devpulse
```

---

## Features

### 1. Interactive Cockpit Menu
Launch the interactive arrow-driven menu:
```bash
devpulse
```

### 2. Error Explainer (`wtf`)
Diagnose error messages or piped stack traces:
```bash
devpulse wtf "Error: listen EADDRINUSE: address already in use :::3000"
# or pipe from command
npm run build 2>&1 | devpulse wtf
```

### 3. JSON Log Viewer (`logsee`)
View and search structured JSON log streams:
```bash
devpulse logsee server.log
devpulse logsee server.log --level error
cat app.log | devpulse logsee --search "user_id"
```

### 4. Git Assistant
Automate daily Git routines:
```bash
devpulse git commit     # Proposes conventional commit message from diff
devpulse git clean      # Interactive branch cleaner
devpulse git standup    # Summarizes recent commits into a standup report
```

### 5. Environment Doctor (`doctor`)
Inspect system and project dependencies:
```bash
devpulse doctor
```

### 6. System & Container Dashboard (`top`)
View memory gauges, listening ports, and active containers:
```bash
devpulse top
```

### 7. Codebase Assistant (`ai`)
Query repository files locally using Ollama or pattern heuristics:
```bash
devpulse ai "where is authentication defined?"
```

### 8. Developer Utilities (`utils`)
Fast helpers for everyday workflows:
```bash
devpulse kill-port 3000                 # Terminate process locking a port
devpulse curl https://api.github.com   # HTTP client with latency metrics
devpulse cron "*/15 * * * *"            # Explains cron schedule in plain English
devpulse hash "input-text"              # MD5, SHA256, Base64 & UUID generator
```

---

## Why Zero Dependencies?

- **Instant execution**: Starts up in milliseconds without downloading dozens of packages.
- **Security**: No supply-chain risks or third-party vulnerabilities.
- **Portability**: Runs on any environment with Node.js 18+.

---

## License

MIT © [dnuzi](https://github.com/dnuzi)
