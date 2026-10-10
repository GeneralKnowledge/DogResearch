import assert from "node:assert/strict";
import {
  buildPublishableBundle,
  violatesNoAversiveRule,
  isOffLeadUnlocked,
  blocksOffLeadPromotion,
  sanitizeProtocolForExport
} from "./index.mjs";

const bundle = buildPublishableBundle(false);

assert.ok(bundle.lessons.length >= 20, "expected 20 pilot lessons in export");
assert.ok(
  bundle.lessons.some((l) => l.lesson.id === "lesson-recall-basics"),
  "recall lesson included"
);
assert.ok(
  bundle.lessons.some((l) => l.lesson.id === "lesson-reactive-management"),
  "reactive lesson exported after review-009"
);
assert.ok(bundle.cpdPaths?.length > 0, "CPD paths exported");
assert.ok(bundle.assessmentMetrics?.length >= 4, "assessment metrics exported");
assert.ok(bundle.catalogSearch?.length > 0, "catalog search index exported");

const recallEntry = bundle.lessons.find((l) => l.lesson.id === "lesson-recall-basics");
assert.ok(recallEntry?.protocol.safe002Sanitized, "recall protocol sanitized for safe-002");
const stepText = recallEntry?.protocol.steps?.map((s) => s.instruction).join(" ") ?? "";
assert.ok(!/\boff-lead\b/i.test(stepText) || stepText.includes("tier-2"), "off-lead phrasing gated in export");

assert.equal(isOffLeadUnlocked({}), false);
assert.equal(
  isOffLeadUnlocked({
    "metric-recall-long-line-5m": true,
    "metric-recall-long-line-10m": true
  }),
  true
);
assert.equal(blocksOffLeadPromotion({}), true);

const sanitized = sanitizeProtocolForExport(
  {
    id: "test",
    title: "t",
    steps: [{ stepNumber: 1, instruction: "Go off-lead in the park." }]
  },
  true
);
assert.match(sanitized.steps[0].instruction, /tier-2/);

assert.equal(violatesNoAversiveRule("use a shock collar"), true);
assert.equal(violatesNoAversiveRule("reward calm behaviour"), false);

console.log("content-gate tests passed");
