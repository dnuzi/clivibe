// Native Zero-Dependency JSON Colorizer, Validator & Query Engine
// Pure standard library — 0 external dependencies

import fs from 'fs';
import path from 'path';
import { c, badges, glyphs } from '../ui/colors.js';

export function highlightJson(jsonObj, indent = 2) {
  const jsonStr = typeof jsonObj === 'string' ? jsonObj : JSON.stringify(jsonObj, null, indent);

  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          // Key
          return c.hex('#8be9fd')(match.slice(0, -1)) + c.dim(':');
        }
        // String value
        return c.hex('#50fa7b')(match);
      }
      if (/true|false/.test(match)) {
        // Boolean
        return c.hex('#ff79c6')(match);
      }
      if (/null/.test(match)) {
        // Null
        return c.dim.italic(match);
      }
      // Number
      return c.hex('#f1fa8c')(match);
    }
  );
}

function resolvePath(obj, queryPath) {
  if (!queryPath) return obj;
  const parts = queryPath.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

export function runJson(inputSource, queryPath) {
  if (!inputSource) {
    console.log(c.yellow(`\n${glyphs.warning} Usage: clivibe json <file.json|rawJson> [queryPath]\n`));
    return;
  }

  let raw = inputSource.trim();

  // If pointing to a file
  const resolved = path.resolve(process.cwd(), inputSource);
  if (fs.existsSync(resolved)) {
    raw = fs.readFileSync(resolved, 'utf-8');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.log(`\n${badges.error('INVALID JSON')}\n`);
    console.log(c.red(`Error: ${err.message}`));
    console.log(c.dim(`Input was not valid JSON format.\n`));
    return;
  }

  const queryResult = queryPath ? resolvePath(parsed, queryPath) : parsed;

  console.log(`\n${badges.primary('JSON VIEWER')}${queryPath ? c.dim(` (query: ${c.bold(queryPath)})`) : ''}\n`);

  if (queryResult === undefined) {
    console.log(c.yellow(`  Path "${queryPath}" not found.\n`));
  } else {
    console.log(highlightJson(queryResult));
    console.log('');
  }
}
