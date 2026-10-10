#!/usr/bin/env node
import assert from "node:assert/strict";
import { loadPublishConfig } from "@gooddog/kb-core";
import {
  buildGoodDogCrashCourseExport,
  buildGoodDogGuidesExport
} from "./good-dog-export.mjs";

const guides = buildGoodDogGuidesExport();
const course = buildGoodDogCrashCourseExport(guides);
const config = loadPublishConfig();

assert.equal(course.stages.length, 10);
assert.deepEqual(
  course.stages.map((stage) => stage.order),
  [...course.stages.map((stage) => stage.order)].sort((a, b) => a - b)
);

const pathIds = new Set(course.path);
for (const lessonId of config.pilotLessonIds) {
  assert.ok(pathIds.has(lessonId), `${lessonId} is on the crash-course path`);
}
assert.equal(course.path.length, new Set(course.path).size, "path has no duplicates");
assert.equal(course.path.includes("lesson-muzzle-training"), false, "held lesson not on path");

const muzzleStage = course.stages.find((stage) => stage.id === "stage-handling-and-vet");
assert.deepEqual(muzzleStage.heldLessonIds, ["lesson-muzzle-training"]);

const exportedGuideIds = new Set(guides.guides.map((guide) => guide.lessonId));
for (const stage of course.stages) {
  assert.equal(typeof stage.title, "string");
  assert.equal(typeof stage.aim, "string");
  if (stage.coverage === "covered") {
    assert.ok(stage.lessons.length > 0, `${stage.id} covered needs a lesson`);
    assert.equal(stage.gaps.length, 0);
  }
  if (stage.coverage === "evidence_only") assert.equal(stage.lessons.length, 0);
  for (const lesson of stage.lessons) {
    assert.equal(lesson.kind === "guide", exportedGuideIds.has(lesson.lessonId));
  }
}

assert.equal(course.practicalExercises.length, 12, "twelve assessed exercises mapped");
for (const row of course.practicalExercises) {
  if (row.status === "covered") assert.ok(row.lessons.length > 0, row.imdtExercise);
  if (row.status === "held_for_review") assert.ok(row.heldLessonIds.length > 0, row.imdtExercise);
  if (row.status === "gap") assert.equal(row.lessons.length, 0, row.imdtExercise);
}

assert.equal(course.theoryAreas.reduce((sum, area) => sum + area.marks, 0), 50);
for (const area of course.theoryAreas) {
  assert.equal(area.evidenceStatus, "evidence", `${area.area} has at least one claim`);
}

assert.match(course.alignment.disclaimer, /Not affiliated/);
const text = JSON.stringify(course.stages.map((stage) => [stage.title, stage.aim]));
assert.equal(/IMDT/i.test(text), false, "owner-facing stage text does not name IMDT");

console.log("good-dog-crash-course tests passed");
