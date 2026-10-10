#!/usr/bin/env node
import assert from "node:assert/strict";
import { buildPublishableBundle } from "@gooddog/content-gate";

const bundle = buildPublishableBundle(false);

assert.ok(bundle.lessons.length >= 21);
assert.ok(!bundle.skipped.some((s) => s.lessonId === "lesson-stay-basics"));
assert.ok(bundle.lessons.every((l) => l.lesson.id && l.protocol.id));
assert.ok(
  bundle.lessons.some((l) => l.lesson.educationOnly === true),
  "educationOnly lesson in bundle"
);

console.log("export snapshot tests passed");
