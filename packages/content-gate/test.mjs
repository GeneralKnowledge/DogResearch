import assert from "node:assert/strict";
import { buildPublishableBundle, violatesNoAversiveRule } from "./index.mjs";

const bundle = buildPublishableBundle(false);

assert.ok(bundle.lessons.length >= 7, "expected pilot lessons in export");
assert.ok(
  !bundle.lessons.some((l) => l.lesson.id === "lesson-recall-basics"),
  "recall lesson must be excluded"
);
assert.ok(
  !bundle.lessons.some((l) => l.lesson.id === "lesson-reactive-management"),
  "reactive lesson must be excluded"
);

const recallProto = bundle.skipped.find(
  (s) => s.lessonId === "lesson-recall-basics"
);
assert.ok(!recallProto, "recall should not appear in pilot list");

assert.equal(violatesNoAversiveRule("use a shock collar"), true);
assert.equal(violatesNoAversiveRule("reward calm behaviour"), false);

console.log("content-gate tests passed");
