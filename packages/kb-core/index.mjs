import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadMergedRegistry as loadFromScripts,
  loadAssessmentMetrics as loadMetricsFromScripts
} from "../../scripts/load-registry.mjs";

const pkgRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(pkgRoot, "../..");

/** @returns {import('./types.d.ts').MergedRegistry} */
export function loadMergedRegistry() {
  return /** @type {import('./types.d.ts').MergedRegistry} */ (loadFromScripts());
}

export function getRepoRoot() {
  return repoRoot;
}

/**
 * @param {string} lessonId
 * @returns {import('./types.d.ts').LessonBundle | null}
 */
export function getLessonBundle(lessonId) {
  const registry = loadMergedRegistry();
  const lesson = registry.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  const protocol = registry.protocols.find((p) => p.id === lesson.derivedFromProtocolId);
  if (!protocol) return null;

  const claimIds = new Set([
    ...(lesson.supportingClaimIds ?? []),
    ...(protocol.supportingClaimIds ?? [])
  ]);
  const claims = registry.claims.filter((c) => claimIds.has(c.id));

  const sourceIds = new Set([
    ...(protocol.supportingSourceIds ?? []),
    ...claims.map((c) => c.supportingSourceId).filter(Boolean)
  ]);
  const sources = registry.sources.filter((s) => sourceIds.has(s.id));

  return { lesson, protocol, claims, sources };
}

/** @returns {import('./types.d.ts').OwnerQuestionCategory[]} */
export function loadOwnerQuestions() {
  const raw = JSON.parse(
    readFileSync(join(repoRoot, "kb/registry/owner-questions-taxonomy.json"), "utf8")
  );
  return raw.categories ?? [];
}

/** @returns {Record<string, unknown>} */
export function loadPublishConfig() {
  return JSON.parse(readFileSync(join(repoRoot, "kb/meta/publish-config.json"), "utf8"));
}

/** @returns {import('./types.d.ts').AssessmentMetric[]} */
export function loadAssessmentMetrics() {
  return /** @type {import('./types.d.ts').AssessmentMetric[]} */ (loadMetricsFromScripts());
}

/** @returns {Record<string, unknown>} */
export function loadGoodDogCrosswalk() {
  return JSON.parse(
    readFileSync(join(repoRoot, "kb/meta/good-dog-exercise-crosswalk.json"), "utf8")
  );
}

/** @returns {Record<string, unknown>} */
export function loadGoodDogFieldDefaults() {
  return JSON.parse(
    readFileSync(join(repoRoot, "kb/meta/good-dog-field-defaults.json"), "utf8")
  );
}
