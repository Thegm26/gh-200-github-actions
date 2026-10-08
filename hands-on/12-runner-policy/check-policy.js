import fs from 'node:fs';

const candidatePath = process.argv[2];
if (!candidatePath) throw new Error('usage: node check-policy.js <candidate.json>');

const candidate = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
const policy = {
  selectedRepositories: ['octo-org/approved-repository'],
  requiredLabel: 'trusted',
  allowedRequestedRunner: 'self-hosted',
};

const repositoryAllowed = policy.selectedRepositories.includes(candidate.repository);
const labelMatches = Array.isArray(candidate.labels) && candidate.labels.includes(policy.requiredLabel);
const runnerAllowed = candidate.job?.requestedRunner === policy.allowedRequestedRunner;

console.log(JSON.stringify({ repositoryAllowed, labelMatches, runnerAllowed }));
if (!repositoryAllowed || !labelMatches || !runnerAllowed) {
  throw new Error('candidate does not satisfy the runner policy model');
}
