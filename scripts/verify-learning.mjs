#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { labById, learningRoot, manifest, tempWorkspace, validateLab } from './learn-lib.mjs';
let failures = [];
let mutationsChecked = 0;
for (const lab of manifest.labs) {
  const temp = tempWorkspace();
  try {
    const starter = path.join(learningRoot, 'starters', lab.id);
    if (!validateLab(lab, starter).length) failures.push(`${lab.id}: immutable starter unexpectedly passes`);
    const solution = path.join(learningRoot, 'solutions', lab.id);
    if (validateLab(lab, solution).length) failures.push(`${lab.id}: solution does not pass`);
    const copiedSolution = path.join(temp, 'mutated');
    fs.cpSync(solution, copiedSolution, { recursive: true });
    const target = path.join(copiedSolution, lab.file);
    const mutations = {
      'workflow_dispatch': ['workflow_dispatch: {}', 'workflow_dispatch: false'], 'build-ubuntu': ['ubuntu-latest', 'windows-latest'], 'push-filter': ['src/**', 'lib/**'], 'safe-env': ['"$EVENT_TEXT"', '$EVENT_TEXT'], 'job-output': ['steps.version.outputs.version', 'steps.nope.outputs.version'], 'needs-output': ['needs: prepare', 'needs: missing'], 'node-matrix': ['22', '21'], 'healthy-redis': ['health-cmd', 'health-nope'], 'reusable-call': ['reusable-risk.yml', 'other.yml'], composite: ['using: composite', 'using: node20'], 'failure-evidence': ['always()', 'success()'], 'runner-policy': ['approved', 'unapproved'], 'least-privilege': ['contents: read', 'contents: write'], 'oidc-deploy': ['environment: production', 'environment: staging'], 'checkout-sha': ['11bd71901bbe5b1630ceea73d27597364c9af683', '11bd71901bbe5b1630ceea73d27597364c9af683oops'], artifact: ['build-output', 'wrong-output'], 'deploy-gate': ['needs: build', 'needs: other'],
    };
    const [from, to] = mutations[lab.rules[0]];
    fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(from, to));
    mutationsChecked += 1;
    if (!validateLab(lab, copiedSolution).length) failures.push(`${lab.id}: semantic wrong-value mutation unexpectedly passes`);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
const first = labById('01-first-workflow');
const solutionText = fs.readFileSync(path.join(learningRoot, 'solutions', first.id, first.file), 'utf8');
const altered = tempWorkspace();
try { fs.mkdirSync(path.join(altered, first.id)); fs.writeFileSync(path.join(altered, first.id, first.file), solutionText.replace('workflow_dispatch:', '# workflow_dispatch removed')); if (!validateLab(first, path.join(altered, first.id)).length) failures.push('01-first-workflow: meaningful trigger mutation unexpectedly passes'); } finally { fs.rmSync(altered, { recursive: true, force: true }); }
if (failures.length) { console.error(`Learning verification failed:\n- ${failures.join('\n- ')}`); process.exitCode = 1; } else console.log(`Learning verification passed: ${manifest.labs.length}/${manifest.labs.length} starters reject, ${manifest.labs.length}/${manifest.labs.length} solutions pass, and ${mutationsChecked}/${manifest.labs.length} semantic mutations reject.`);
