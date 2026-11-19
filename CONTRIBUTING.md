# Contributing to clixy

Thank you for your interest in contributing to clixy! We welcome contributions, bug fixes, feature proposals, and ideas from everyone.

---

## Zero-Dependency Philosophy

clixy is committed to **zero external runtime dependencies**. All features must be implemented using native Node.js APIs (`net`, `readline`, `child_process`, `crypto`, `os`, `fs`, `http`, etc.).

Before submitting a PR:
- Do not add packages to `dependencies` in `package.json`.
- Ensure tests pass with `npm test`.

---

## Development Setup

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/clixy.git
   cd clixy
   ```
3. Run the CLI locally:
   ```bash
   node bin/clixy.js
   ```
4. Run the automated test suite:
   ```bash
   npm test
   ```

---

## Adding a New Command

1. Create your command file in `src/commands/<command-name>.js`.
2. Export an `async` function.
3. Register the command in `src/index.js` and in the launcher menu in `src/commands/menu.js`.
4. Add a test in `tests/cli.test.js`.

---

## Submitting a Pull Request

- Keep PRs focused on a single feature or bug fix.
- Follow conventional commit style (`feat: ...`, `fix: ...`, `docs: ...`).
- Open a PR against the `main` branch.
