#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadGoodDogCrosswalk } from "@gooddog/kb-core";
import {
  buildGoodDogDomainExport,
  validateVariationGraph
} from "./good-dog-export.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = JSON.parse(
  readFileSync(
    join(root, "packages/content-gate/tests/fixtures/good-dog-exercise-ids.json"),
    "utf8"
  )
);
const knownIds = new Set(fixture.exerciseIds);

const crosswalk = loadGoodDogCrosswalk();
for (const mapping of crosswalk.mappings ?? []) {
  if (mapping.newExercise === true) {
    continue;
  }
  assert.match(
    mapping.goodDogExerciseId,
    /^ex-/,
    `crosswalk id must be ex-* or newExercise: ${mapping.protocolId}`
  );
  assert.ok(
    knownIds.has(mapping.goodDogExerciseId),
    `goodDogExerciseId ${mapping.goodDogExerciseId} not in Good Dog fixture`
  );
}

const domain = buildGoodDogDomainExport();
assert.ok(domain.exercises.length >= 10, "expected skill exercises in domain export");
assert.ok(
  domain.exercises.every((e) => e.provenance?.protocolId),
  "provenance on every exported exercise"
);
assert.ok(
  domain.held.some((h) => h.goodDogExerciseId === "ex-lead-loose"),
  "loose lead held until method review"
);
assert.ok(domain.draftExercises.length >= 1, "draft force-free loose lead protocol exported");
assert.ok(
  domain.managementModules.some((m) => m.lessonId === "lesson-alone-prevention"),
  "alone-time lesson exported as a management module, not a skill exercise"
);

const variationErrors = validateVariationGraph([
  ...domain.exercises,
  ...domain.draftExercises
]);
assert.equal(variationErrors.length, 0, variationErrors.join("; "));

console.log("good-dog-crosswalk tests passed");
