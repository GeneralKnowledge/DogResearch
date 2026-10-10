#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPublishableBundle } from "@gooddog/content-gate";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const previewMode = process.argv.includes("--preview");
const outDir = join(root, "apps/web/content");
const outFile = join(outDir, "publishable.json");

mkdirSync(outDir, { recursive: true });

const bundle = buildPublishableBundle(previewMode);
writeFileSync(outFile, JSON.stringify(bundle, null, 2));

console.log(
  `Exported ${bundle.lessons.length} lessons to apps/web/content/publishable.json` +
    (bundle.skipped.length ? ` (${bundle.skipped.length} skipped)` : "")
);
if (bundle.skipped.length) {
  for (const s of bundle.skipped) {
    console.log(`  skip ${s.lessonId}: ${s.reason}`);
  }
}
