import assert from "node:assert/strict";
import {
  buildPublishableBundle,
  violatesNoAversiveRule,
  isOffLeadUnlocked,
  blocksOffLeadPromotion
} from "./index.mjs";

const bundle = buildPublishableBundle(false);

assert.ok(bundle.lessons.length >= 12, "expected expanded pilot lessons in export");
assert.ok(
  bundle.lessons.some((l) => l.lesson.id === "lesson-recall-basics"),
  "recall lesson included after batch 007 review"
);
assert.ok(
  !bundle.lessons.some((l) => l.lesson.id === "lesson-reactive-management"),
  "reactive lesson must be excluded"
);
assert.ok(bundle.assessmentMetrics?.length >= 4, "assessment metrics exported");
assert.ok(bundle.catalogSearch?.length > 0, "catalog search index exported");

assert.equal(isOffLeadUnlocked({}), false);
assert.equal(
  isOffLeadUnlocked({
    "metric-recall-long-line-5m": true,
    "metric-recall-long-line-10m": true
  }),
  true
);
assert.equal(blocksOffLeadPromotion({}), true);

assert.equal(violatesNoAversiveRule("use a shock collar"), true);
assert.equal(violatesNoAversiveRule("reward calm behaviour"), false);

console.log("content-gate tests passed");
