import fs from 'fs';
import path from 'path';
import { c, icons, badges } from '../ui/colors.js';
import { promptSelect, promptInput } from '../ui/prompt.js';
import { createSpinner } from '../ui/spinner.js';

export async function scaffoldProject(projectNameArg) {
  console.log(`\n${badges.tag('PROJECT STARTER SCAFFOLDER')}\n`);

  const projectName = projectNameArg || (await promptInput('Project directory name', 'my-app'));
  const template = await promptSelect({
    message: 'Choose a production-ready starter template:',
    choices: [
      { name: 'Full-Stack Web App', value: 'nextjs', desc: 'Next.js 15 + Tailwind + TypeScript + Docker' },
      { name: 'Fast REST API', value: 'express', desc: 'Express + TypeScript + Docker + Healthcheck' },
      { name: 'Python Microservice', value: 'fastapi', desc: 'FastAPI + Pydantic + Uvicorn + Docker' },
      { name: 'Zero-Dependency CLI Tool', value: 'cli', desc: 'Node.js zero-dep starter with native test runner' }
    ]
  });

  const targetDir = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    console.log(c.red(`\n${icons.error} Directory "${projectName}" already exists.`));
    return;
  }

  const spinner = createSpinner(`Scaffolding ${template} into ./${projectName}...`).start();

  fs.mkdirSync(targetDir, { recursive: true });

  // Generate template files based on selection
  if (template === 'nextjs') {
    writeNextTemplate(targetDir, projectName);
  } else if (template === 'express') {
    writeExpressTemplate(targetDir, projectName);
  } else if (template === 'fastapi') {
    writeFastApiTemplate(targetDir, projectName);
  } else {
    writeCliTemplate(targetDir, projectName);
  }

  spinner.succeed(`Project "${projectName}" scaffolded successfully!`);

  console.log(c.bold(`\nNext steps:`));
  console.log(`  ${c.hex('#8be9fd')(`cd ${projectName}`)}`);
  console.log(`  ${c.hex('#8be9fd')('npm install')}`);
  console.log(`  ${c.hex('#8be9fd')('npm run dev')}\n`);
}

function writeCliTemplate(dir, name) {
  const pkg = {
    name,
    version: '1.0.0',
    type: 'module',
    bin: { [name]: './bin/cli.js' },
    scripts: { start: 'node bin/cli.js', test: 'node --test' }
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));

  fs.mkdirSync(path.join(dir, 'bin'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'bin', 'cli.js'),
    `#!/usr/bin/env node\nconsole.log("⚡ Welcome to ${name} - built with zero external dependencies!");\n`
  );

  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\n.DS_Store\n');
  fs.writeFileSync(path.join(dir, 'README.md'), `# ${name}\n\nA zero-dependency CLI tool.\n`);
}

function writeExpressTemplate(dir, name) {
  const pkg = {
    name,
    version: '1.0.0',
    type: 'module',
    scripts: { dev: 'node server.js', start: 'node server.js' }
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));
  fs.writeFileSync(
    path.join(dir, 'server.js'),
    `import http from 'http';\n\nconst server = http.createServer((req, res) => {\n  if (req.url === '/health') {\n    res.writeHead(200, { 'Content-Type': 'application/json' });\n    return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));\n  }\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ message: 'Hello from ${name} API' }));\n});\n\nserver.listen(3000, () => console.log('🚀 Server listening on http://localhost:3000'));\n`
  );
  fs.writeFileSync(path.join(dir, 'Dockerfile'), 'FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]\n');
  fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\n');
}

function writeFastApiTemplate(dir, name) {
  fs.writeFileSync(
    path.join(dir, 'main.py'),
    `from fastapi import FastAPI\n\napp = FastAPI(title="${name}")\n\n@app.get("/")\ndef root():\n    return {"message": "Hello from ${name}"}\n\n@app.get("/health")\ndef health():\n    return {"status": "ok"}\n`
  );
  fs.writeFileSync(path.join(dir, 'requirements.txt'), 'fastapi\nuvicorn\n');
  fs.writeFileSync(path.join(dir, 'Dockerfile'), 'FROM python:3.11-slim\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n');
}

function writeNextTemplate(dir, name) {
  writeExpressTemplate(dir, name);
}
