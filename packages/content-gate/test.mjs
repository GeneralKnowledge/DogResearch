import assert from "node:assert/strict";
import {
  buildPublishableBundle,
  violatesNoAversiveRule,
  isOffLeadUnlocked,
  blocksOffLeadPromotion,
  sanitizeProtocolForExport
} from "./index.mjs";

const bundle = buildPublishableBundle(false);

assert.ok(bundle.lessons.length >= 21, "expected 21 pilot lessons in export");
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

const alone = bundle.lessons.find((l) => l.lesson.id === "lesson-alone-prevention");
assert.ok(alone, "alone-time prevention lesson exported");
assert.equal(alone?.advisory, true);
assert.match(alone?.advisoryMessage ?? "", /not a treatment|do not keep lengthening/i);
assert.ok(
  (alone?.protocol.steps ?? []).some((s) => /prevention only/i.test(s.instruction)),
  "alone protocol keeps the clinical boundary in the steps"
);

const publishedIds = new Set(bundle.lessons.map((l) => l.lesson.id));
for (const cat of bundle.ownerQuestions ?? []) {
  for (const q of cat.questions ?? []) {
    if (q.relatedLessonId) {
      assert.ok(
        publishedIds.has(q.relatedLessonId),
        `${q.id} points at unpublished lesson ${q.relatedLessonId}`
      );
    }
    if (q.relatedPath) {
      assert.match(q.relatedPath, /^\//, `${q.id} relatedPath must be an in-app path`);
    }
  }
}

assert.equal(violatesNoAversiveRule("use a shock collar"), true);
assert.equal(violatesNoAversiveRule("reward calm behaviour"), false);

console.log("content-gate tests passed");
