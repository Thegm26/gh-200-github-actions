import { readFileSync } from 'node:fs';
import YAML from 'yaml';

const candidatePath = process.argv[2];
if (!candidatePath) throw new Error('usage: node check-policy.mjs <candidate.yml>');

let candidate;
try {
  candidate = YAML.parse(readFileSync(candidatePath, 'utf8'));
} catch (error) {
  throw new Error(`invalid candidate policy: ${error.message}`);
}

if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
  throw new Error('candidate policy must be a YAML mapping');
}
const permissions = candidate.permissions;
if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
  throw new Error('permissions must be a mapping');
}
if (Object.keys(permissions).length !== 1 || permissions.contents !== 'read') {
  throw new Error('permissions must be exactly contents: read');
}
console.log('candidate permissions accepted');
