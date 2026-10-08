#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { learningRoot, manifest } from './learn-lib.mjs';
const major = Number(process.versions.node.split('.')[0]);
const errors = [];
if (major < 18) errors.push(`Node ${process.versions.node} found; install Node 18 or newer.`);
if (!manifest.labs.length) errors.push('Learning manifest has no labs.');
for (const lab of manifest.labs) for (const relative of ['starters', 'solutions']) if (!fs.existsSync(path.join(learningRoot, relative, lab.id, lab.file))) errors.push(`Missing ${relative}/${lab.id}/${lab.file}. Reinstall or restore the learning fixtures.`);
if (errors.length) { console.error(`Preflight failed:\n- ${errors.join('\n- ')}`); process.exitCode = 1; } else { if (major < 22) console.warn(`Warning: Node ${process.versions.node} works locally, but Node 22+ is recommended to match current GitHub-hosted runners.`); console.log(`Preflight passed: Node ${process.versions.node}; ${manifest.labs.length} fixtures available. GitHub exercises are locally validated simulations until you run them on GitHub.`); }
