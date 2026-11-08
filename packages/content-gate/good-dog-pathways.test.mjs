#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildGoodDogPathwaysExport, validateGoalPathways } from "./good-dog-export.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const exerciseIds = new Set(
  JSON.parse(
    readFileSync(
      join(root, "packages/content-gate/tests/fixtures/good-dog-exercise-ids.json"),
      "utf8"
    )
  ).exerciseIds
);

const exported = buildGoodDogPathwaysExport();
const { pathways } = exported;
assert.equal(typeof exported.schemaVersion, "string");
assert.deepEqual(
  pathways.map((p) => p.id),
  ["path-recall", "path-loose-lead", "path-settle", "path-visitors"]
);
assert.deepEqual(validateGoalPathways(pathways, { exerciseIds }), []);

// Every gate is a plain question to the owner about their own dog.
for (const p of pathways) {
  for (const stage of p.stages) {
    assert.match(stage.gate.ownerCheck, /\{dog\}/, `${p.id}/${stage.id} names the dog`);
    assert.match(stage.gate.ownerCheck, /\?$/, `${p.id}/${stage.id} is a question`);
  }
}

// Recall stays behind the recall-management rule, and nothing promises off-lead freedom.
const recall = pathways.find((p) => p.id === "path-recall");
for (const stage of recall.stages.slice(1)) {
  assert.ok(stage.safetyRuleIds.includes("safe-002-recall-management"), stage.id);
}
const recallMetrics = recall.stages.flatMap((s) => s.gate.metricIds);
assert.equal(recallMetrics.includes("metric-off-lead-not-unlocked"), false);

// The checks catch broken pathways.
const broken = structuredClone(pathways.slice(0, 1));
broken[0].stages[0].exerciseIds.push("ex-nope");
broken[0].stages[0].gate.metricIds.push("metric-nope");
broken[0].stages[1].opensAfter = ["recall-later"];
broken[0].stages[1].safetyRuleIds.push("safe-999");
const problems = validateGoalPathways(broken, { exerciseIds });
for (const text of ["ex-nope", "metric-nope", "recall-later", "safe-999"]) {
  assert.ok(problems.some((p) => p.includes(text)), `${text}: ${problems.join("; ")}`);
}

console.log("good-dog-pathways tests passed");
