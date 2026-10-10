#!/usr/bin/env node
/**
 * Refresh packages/content-gate/tests/fixtures/good-dog-exercise-ids.json
 * from Good Dog main exercises.ts (requires network).
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url =
  "https://raw.githubusercontent.com/GeneralKnowledge/Good-Dog/main/src/lib/domains/dog-training/content/exercises.ts";

const res = await fetch(url);
if (!res.ok) {
  console.error(`Failed to fetch ${url}: ${res.status}`);
  process.exit(1);
}
const text = await res.text();
const ids = [...text.matchAll(/id:\s*"(ex-[^"]+)"/g)].map((m) => m[1]);
const unique = [...new Set(ids)].sort();

const out = {
  vendoredFrom:
    "https://github.com/GeneralKnowledge/Good-Dog/blob/main/src/lib/domains/dog-training/content/exercises.ts",
  vendoredAt: new Date().toISOString().slice(0, 10),
  exerciseIds: unique
};

const outPath = join(
  root,
  "packages/content-gate/tests/fixtures/good-dog-exercise-ids.json"
);
writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${unique.length} exercise ids to ${outPath}`);
