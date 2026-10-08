import fs from 'node:fs';

const candidatePath = process.argv[2];
if (!candidatePath) throw new Error('usage: node check-pin.js <action-candidate.json>');

const candidate = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
const reviewed = {
  action: 'actions/checkout',
  revision: 'd23441a48e516b6c34aea4fa41551a30e30af803',
};
const fullSha = /^[0-9a-f]{40}$/;
const actionMatches = candidate.action === reviewed.action;
const pinIsFullSha = fullSha.test(candidate.ref);
const revisionMatches = candidate.ref === reviewed.revision;

console.log(JSON.stringify({ actionMatches, pinIsFullSha, revisionMatches }));
if (!actionMatches || !pinIsFullSha || !revisionMatches) {
  throw new Error('candidate action reference is not the reviewed immutable pin');
}
