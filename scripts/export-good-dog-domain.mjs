#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildGoodDogAskPatternsExport,
  buildGoodDogDomainExport,
  buildGoodDogGuidesExport,
  buildGoodDogReferralsExport,
  buildGoodDogSafetyExport,
  validateVariationGraph
} from "@gooddog/content-gate/good-dog-export.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const includeHeld = process.argv.includes("--include-held");

mkdirSync(distDir, { recursive: true });

const domain = buildGoodDogDomainExport({ includeHeld });
const variationErrors = validateVariationGraph([
  ...domain.exercises,
  ...domain.draftExercises
]);
if (variationErrors.length) {
  console.error("Good Dog export variation validation failed:");
  for (const e of variationErrors) console.error(`  ERROR: ${e}`);
  process.exit(1);
}

writeFileSync(join(distDir, "good-dog-domain.json"), JSON.stringify(domain, null, 2));

const safety = buildGoodDogSafetyExport();
writeFileSync(join(distDir, "good-dog-safety.json"), JSON.stringify(safety, null, 2));

const guides = buildGoodDogGuidesExport();
writeFileSync(join(distDir, "good-dog-guides.json"), JSON.stringify(guides, null, 2));

const referrals = buildGoodDogReferralsExport();
writeFileSync(join(distDir, "good-dog-referrals.json"), JSON.stringify(referrals, null, 2));

const askPatterns = buildGoodDogAskPatternsExport(guides);
writeFileSync(
  join(distDir, "good-dog-ask-patterns.json"),
  JSON.stringify(askPatterns, null, 2)
);

console.log(
  `Exported ${domain.exercises.length} exercises, ${domain.held.length} held, ${domain.draftExercises.length} drafts, ${guides.guides.length} guides, ${Object.keys(referrals.referrals).length} referrals to dist/`
);
