import fs from 'fs';
import path from 'path';
import { c, icons, badges } from '../ui/colors.js';
import { createSpinner } from '../ui/spinner.js';
import { createBox } from '../ui/box.js';

export async function askAi(query) {
  if (!query) {
    console.log(c.yellow(`\n${icons.warning} Please specify a question about your codebase.`));
    console.log(`Example: ${c.hex('#8be9fd')('devpulse ai "where is auth handled?"')}\n`);
    return;
  }

  console.log(`\n${badges.tag('CODEBASE AI ASSISTANT')}\n`);
  const spinner = createSpinner(`Analyzing repository for: "${query}"...`).start();

  // Check if Ollama is running locally
  let ollamaAvailable = false;
  try {
    const res = await fetch('http://localhost:11434/api/tags', { signal: AbortSignal.timeout(1000) });
    if (res.ok) ollamaAvailable = true;
  } catch {}

  if (ollamaAvailable) {
    spinner.update('Querying local Ollama model...');
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `You are a developer assistant. Answer this question about code: "${query}"`,
          stream: false
        })
      });
      const data = await response.json();
      spinner.stop();
      console.log(createBox(data.response, 'OLLAMA LOCAL AI ANSWER', '#00F260'));
      return;
    } catch {
      // Fallback
    }
  }

  // Smart Offline Codebase Crawler Fallback
  await new Promise((r) => setTimeout(r, 600));
  const matches = searchCodebase(query);
  spinner.stop();

  if (matches.length > 0) {
    const findings = [
      `${c.bold('Found relevant references in local codebase:')}`,
      '',
      ...matches.map((m) => `${c.hex('#8be9fd')(m.file)}:${c.yellow(m.line)}\n  ${c.dim(m.snippet)}`),
      '',
      c.dim('💡 Tip: Start Ollama locally (ollama run llama3) for full conversational AI responses!')
    ].join('\n');

    console.log(createBox(findings, 'CODEBASE SEARCH RESULTS', '#5271FF'));
  } else {
    console.log(createBox(`No direct matches found for "${query}".\n\nEnsure you are in the project root directory or run Ollama locally for generative synthesis.`, 'AI RESPONSE', '#FF61D2'));
  }
}

function searchCodebase(query) {
  const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const results = [];
  const root = process.cwd();

  function scan(dir, depth = 0) {
    if (depth > 4 || results.length >= 6) return;
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(full, depth + 1);
        } else if (/\.(js|ts|jsx|tsx|py|go|rs|json|md|yaml)$/i.test(entry.name)) {
          const content = fs.readFileSync(full, 'utf-8');
          const lines = content.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lower = line.toLowerCase();
            if (keywords.some((kw) => lower.includes(kw))) {
              results.push({
                file: path.relative(root, full),
                line: i + 1,
                snippet: line.trim().slice(0, 80)
              });
              if (results.length >= 6) break;
            }
          }
        }
      }
    } catch {}
  }

  scan(root);
  return results;
}
