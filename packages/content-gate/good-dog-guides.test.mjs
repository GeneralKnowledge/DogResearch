#!/usr/bin/env node
import assert from "node:assert/strict";
import { loadGoodDogCrosswalk, loadMergedRegistry } from "@gooddog/kb-core";
import {
  buildGoodDogAskPatternsExport,
  buildGoodDogDomainExport,
  buildGoodDogGuidesExport,
  buildGoodDogReferralsExport,
  buildGoodDogSafetyExport,
  toOwnerVoice
} from "./good-dog-export.mjs";

const EXPECTED_GUIDE_IDS = [
  "lesson-adolescent-regression",
  "lesson-alone-prevention",
  "lesson-equipment-and-law",
  "lesson-fireworks-management",
  "lesson-how-dogs-learn",
  "lesson-multi-dog-household",
  "lesson-outdoor-rewards",
  "lesson-plan-and-measure",
  "lesson-puppy-socialisation",
  "lesson-reactive-management",
  "lesson-read-your-dog-stress",
  "lesson-rescue-settling",
  "lesson-steal-chase",
  "lesson-vet-handling-prep"
];

const guides = buildGoodDogGuidesExport();
assert.equal(
  guides.guides.length,
  14,
  "guides export includes 14 entries (12 previous, outdoor rewards, and the two-dog household guide)"
);
assert.deepEqual(
  guides.guides.map((guide) => guide.lessonId).sort(),
  EXPECTED_GUIDE_IDS
);

for (const guide of guides.guides) {
  assert.equal(typeof guide.title, "string");
  assert.equal(typeof guide.summary, "string");
  assert.equal(typeof guide.advisory, "boolean");
  assert.equal(typeof guide.protocolId, "string");
  assert.match(guide.ownerBodyMarkdown, /^#|[\s\S]*## What to try/);
  assert.ok(guide.ownerBodyMarkdown.includes("## What to try"));
  assert.equal(guide.provenance.protocolId, guide.protocolId);
  assert.ok(guide.provenance.claimIds.length > 0, `${guide.lessonId} claimIds`);
  assert.ok(guide.provenance.sourceIds.length > 0, `${guide.lessonId} sourceIds`);
  assert.equal(typeof guide.provenance.reviewStatus, "string");
  assert.ok(guide.provenance.lastVerified, `${guide.lessonId} lastVerified`);
  assert.ok(guide.suggestedAskKeywords.length > 0, `${guide.lessonId} ask keywords`);
  assert.equal(
    guide.ownerBodyMarkdown.includes("safe-00"),
    false,
    `${guide.lessonId} owner body should not leak safety rule ids`
  );
  assert.equal(guide.ownerBodyMarkdown.includes("Direct owner"), false);
  assert.equal(/extinction burst/i.test(guide.ownerBodyMarkdown), false);
}

const steal = guides.guides.find((guide) => guide.lessonId === "lesson-steal-chase");
assert.match(steal.ownerBodyMarkdown, /When your dog picks up/);
const stress = guides.guides.find((guide) => guide.lessonId === "lesson-read-your-dog-stress");
assert.match(stress.ownerBodyMarkdown, /whale eye/i);
assert.match(stress.ownerBodyMarkdown, /as a whole, together with the situation/i);
assert.equal(/Qualified behaviourist; veterinary/.test(stress.ownerBodyMarkdown), false);
assert.equal(
  /distance or duration|distraction/i.test(stress.ownerBodyMarkdown),
  false,
  "stress guide must not teach distance/duration/distraction progression"
);
assert.equal(stress.protocolId, "proto-recognise-stress-signals");
const vet = guides.guides.find((guide) => guide.lessonId === "lesson-vet-handling-prep");
assert.match(vet.ownerBodyMarkdown, /three seconds/i);

for (const guide of guides.guides) {
  assert.equal(
    /\b(a|an|the|your|this|that) your dog\b/i.test(guide.ownerBodyMarkdown),
    false,
    `${guide.lessonId} has a doubled determiner before "your dog"`
  );
}
assert.equal(toOwnerVoice("Reward a dog for sitting."), "Reward a dog for sitting.");
assert.equal(toOwnerVoice("Dog should sit."), "Your dog should sit.");

assert.ok(
  guides.excluded.every((row) => row.reason === "source_not_paraphrase_ok" || row.reason === "missing_bundle"),
  "excluded guides are only those without paraphrase_ok sources"
);

const referrals = buildGoodDogReferralsExport();
const referralEntries = Object.values(referrals.referrals);
assert.ok(referralEntries.length > 0, "referrals non-empty");
for (const item of referralEntries) {
  assert.equal(typeof item.title, "string");
  assert.ok(item.title.length > 0);
  assert.equal(typeof item.body, "string");
  assert.ok(item.body.length > 0);
  assert.ok(Array.isArray(item.rationaleClaimIds));
  assert.ok(item.rationaleClaimIds.length > 0, `${item.title} rationaleClaimIds`);
}
assert.equal(typeof referrals.referrals.abtcRegister.url, "string");
assert.equal(referrals.referrals.vetFirst.url, undefined);

const domain = buildGoodDogDomainExport();
const crosswalk = loadGoodDogCrosswalk();
const crosswalkIds = new Set(
  (crosswalk.mappings ?? []).map((mapping) => mapping.goodDogExerciseId)
);
assert.ok(domain.exercises.length > 0);
for (const exercise of domain.exercises) {
  const inCrosswalk = crosswalkIds.has(exercise.id);
  assert.ok(
    inCrosswalk || exercise.newExercise === true,
    `${exercise.id} is in exercises[] without a crosswalk row or newExercise flag`
  );
  if (exercise.contentCompleteness === "steps_only") {
    assert.ok(Array.isArray(exercise.glossaryTermIds));
    assert.equal(typeof exercise.topicGroup, "string");
    assert.equal(typeof exercise.purposeOneLine, "string");
    assert.ok(exercise.purposeOneLine.length > 0);
  }
}

const safety = buildGoodDogSafetyExport();
const ask = buildGoodDogAskPatternsExport(guides);
assert.deepEqual(ask.violatesNoAversivePatterns, safety.violatesNoAversivePatterns);
assert.ok(ask.escalateQuestionPatterns.length >= 5);

const ruleIds = new Set(loadMergedRegistry().safetyRules.map((rule) => rule.id));
const guideIds = new Set(guides.guides.map((guide) => guide.lessonId));
for (const pattern of ask.escalateQuestionPatterns) {
  assert.ok(pattern.safetyRuleIds.length > 0, pattern.id);
  assert.ok(pattern.safetyRuleIds.every((id) => ruleIds.has(id)), pattern.id);
  assert.ok(pattern.guideLessonIds.every((id) => guideIds.has(id)), pattern.id);
  assert.doesNotThrow(() => new RegExp(pattern.pattern, pattern.flags), pattern.id);
  assert.ok(pattern.keywords.length > 0, pattern.id);
}

function assertOneLink(node) {
  const hasHelp = typeof node.goodDogHelpId === "string" && node.goodDogHelpId.length > 0;
  const hasGuide = typeof node.guideLessonId === "string" && node.guideLessonId.length > 0;
  assert.equal(Number(hasHelp) + Number(hasGuide), 1, node.id);
  if (hasGuide) assert.ok(guideIds.has(node.guideLessonId), node.id);
}

for (const category of ask.ownerQuestionTaxonomy) {
  assertOneLink(category);
  assert.ok(category.questions.length > 0, category.id);
  for (const question of category.questions) assertOneLink(question);
}

for (const metric of safety.assessmentMetrics) {
  assert.ok(Array.isArray(metric.goodDogInferenceHints.exerciseIds), metric.id);
  assert.ok(Array.isArray(metric.goodDogInferenceHints.learningObjectiveIds), metric.id);
  assert.ok(metric.goodDogInferenceHints.exerciseIds.length > 0, metric.id);
  assert.ok(metric.goodDogInferenceHints.learningObjectiveIds.length > 0, metric.id);
}

const nameMetric = safety.assessmentMetrics.find((metric) => metric.id === "metric-name-latency-2s");
assert.ok(nameMetric.goodDogInferenceHints.exerciseIds.includes("ex-name-response"));
assert.ok(nameMetric.goodDogInferenceHints.learningObjectiveIds.includes("name-response"));

const looseLead = safety.assessmentMetrics.find((metric) => metric.id === "metric-loose-lead-10-steps");
assert.ok(looseLead.goodDogInferenceHints.exerciseIds.includes("ex-lead-loose"));
assert.ok(looseLead.goodDogInferenceHints.learningObjectiveIds.includes("lead-walking"));

const recall = safety.assessmentMetrics.find((metric) => metric.id === "metric-recall-long-line-5m");
assert.ok(recall.goodDogInferenceHints.exerciseIds.includes("ex-recall-foundation"));
assert.ok(recall.goodDogInferenceHints.exerciseIds.includes("ex-kb-emergency-recall"));

console.log("good-dog-guides tests passed");
