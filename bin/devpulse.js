#!/usr/bin/env node

import { runCli } from '../src/index.js';

runCli().catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', `devpulse fatal error: ${err.message}`);
  process.exit(1);
});
