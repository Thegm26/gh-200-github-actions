import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { validateLearningSource } from './learning-checks.mjs';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const learningRoot = path.join(root, 'learning');
export const manifest = JSON.parse(fs.readFileSync(path.join(learningRoot, 'manifest.json'), 'utf8'));
export const workspaceRoot = path.join(root, manifest.workspace);
export const labById = (id) => manifest.labs.find((lab) => lab.id === id);
export function safeLab(id) { const lab = labById(id); if (!lab) throw new Error(`Unknown lab '${id}'. Run: npm run learn -- list`); return lab; }
function safeDirectory(base, lab) { const resolved = path.resolve(base); if (fs.existsSync(resolved) && fs.lstatSync(resolved).isSymbolicLink()) throw new Error('Refusing a symbolic-link workspace root.'); const target = path.resolve(resolved, lab.id); if (!target.startsWith(`${resolved}${path.sep}`)) throw new Error('Unsafe workspace path.'); return target; }
export function copyStarter(lab, base = workspaceRoot) { const target = safeDirectory(base, lab); if (fs.existsSync(target)) throw new Error(`Workspace already exists: ${path.relative(root, target)}. Use reset ${lab.id} --yes to replace it.`); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.cpSync(path.join(learningRoot, 'starters', lab.id), target, { recursive: true, errorOnExist: true }); return target; }
export function resetStarter(lab, base = workspaceRoot, confirmed = false) { if (!confirmed) throw new Error(`Reset refused. Re-run: npm run learn -- reset ${lab.id} --yes`); const target = safeDirectory(base, lab); if (fs.existsSync(target) && fs.lstatSync(target).isSymbolicLink()) throw new Error('Refusing to reset a symbolic-link lab directory.'); if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true }); return copyStarter(lab, base); }
export function validateLab(lab, directory = safeDirectory(workspaceRoot, lab)) {
  const file = path.resolve(directory, lab.file); if (!file.startsWith(`${path.resolve(directory)}${path.sep}`) || !fs.existsSync(file)) return [`Missing learner file: ${lab.file}`];
  const source = fs.readFileSync(file, 'utf8');
  return validateLearningSource(lab, source, (yaml) => {
    const document = parseDocument(yaml, { merge: true });
    if (document.errors.length) throw new Error(document.errors[0].message);
    return document.toJS({ merge: true });
  });
}
/** Validate a checked-in exercise without creating or touching a learner workspace. */
export function validateExercise(id, directory) {
  const lab = safeLab(id);
  const errors = validateLab(lab, directory);
  return errors.map((error) => error.startsWith('Workflow baseline needs') ? `${lab.success} (${lab.hint})` : error);
}
export function tempWorkspace() { return fs.mkdtempSync(path.join(os.tmpdir(), 'gh200-learning-')); }
