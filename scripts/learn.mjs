#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { copyStarter, labById, manifest, resetStarter, safeLab, validateLab, workspaceRoot } from './learn-lib.mjs';

const [command, id, ...flags] = process.argv.slice(2);
const usage = 'Usage: npm run learn -- list | start <id> | check <id> | status | reset <id> --yes';
function result(lab, errors) { if (errors.length) { console.error(`${lab.id}: not complete\n- ${errors.join('\n- ')}`); process.exitCode = 1; } else console.log(`${lab.id}: complete`); }
try {
  if (command === 'list') {
    if (id || flags.length) throw new Error(usage);
    console.log('ID\tDOMAIN\tMODE\tGOAL\tTITLE');
    for (const lab of manifest.labs) console.log(`${lab.id}\t${lab.domain}\t${lab.mode}\t${lab.goal}\t${lab.title}`);
  } else if (command === 'start') {
    if (!id || flags.length) throw new Error(usage); const lab = safeLab(id); const destination = copyStarter(lab); console.log(`Started ${lab.id} (${lab.mode}).\nGoal: ${lab.goal}\nTask: ${lab.task}\nEdit: ${path.relative(process.cwd(), destination)}/${lab.file}\nSuccess: ${lab.success}\nHint: ${lab.hint}\nSolution: ${lab.solution || `learning/solutions/${lab.id}/${lab.file}`}\nNext: npm run learn -- check ${lab.id}`);
  } else if (command === 'check') { if (!id || flags.length) throw new Error(usage); result(safeLab(id), validateLab(safeLab(id))); }
  else if (command === 'status') {
    if (id || flags.length) throw new Error(usage);
    if (!fs.existsSync(workspaceRoot)) console.log('No learner workspaces started. Run: npm run learn -- list');
    else for (const lab of manifest.labs.filter((item) => fs.existsSync(path.join(workspaceRoot, item.id)))) result(lab, validateLab(lab));
  } else if (command === 'reset') { if (!id || flags.some((flag) => flag !== '--yes')) throw new Error(usage); const lab = safeLab(id); const destination = resetStarter(lab, workspaceRoot, flags.includes('--yes')); console.log(`Reset ${lab.id} in ${path.relative(process.cwd(), destination)}.`); }
  else throw new Error(usage);
} catch (error) { console.error(error.message); process.exitCode = 1; }
