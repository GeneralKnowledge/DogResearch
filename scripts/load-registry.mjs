import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = join(root, "kb/registry");

function loadJson(name) {
  return JSON.parse(readFileSync(join(registry, name), "utf8"));
}

const arrayKeys = {
  sources: "sources.json",
  claims: "claims.json",
  protocols: "protocols.json",
  studies: "studies.json",
  safetyRules: "safety-rules.json",
  relationships: "relationships.json",
  lessons: "lessons.json",
  behaviours: "behaviours.json",
  disagreements: "disagreements.json",
  reviewItems: "review-queue.json"
};

const nestedKeys = {
  reviewItems: "reviewItems"
};

/** @returns {Record<string, unknown[]>} */
export function loadMergedRegistry() {
  /** @type {Record<string, unknown[]>} */
  const merged = {};

  for (const [key, file] of Object.entries(arrayKeys)) {
    const raw = loadJson(file);
    const prop = nestedKeys[key] ?? key;
    merged[key] = [...(raw[prop] ?? raw[key] ?? [])];
  }

  const batchDir = join(registry, "batches");
  if (existsSync(batchDir)) {
    const files = readdirSync(batchDir)
      .filter((f) => f.endsWith(".json"))
      .sort();
    for (const file of files) {
      const batch = JSON.parse(readFileSync(join(batchDir, file), "utf8"));
      for (const [key, items] of Object.entries(batch)) {
        if (!Array.isArray(items)) continue;
        if (!merged[key]) merged[key] = [];
        merged[key].push(...items);
      }
    }
  }

  return merged;
}

/** @returns {unknown[]} */
export function loadAssessmentMetrics() {
  const path = join(registry, "assessment-metrics.json");
  if (!existsSync(path)) return [];
  const raw = loadJson("assessment-metrics.json");
  return raw.metrics ?? [];
}
