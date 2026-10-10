#!/usr/bin/env node
/**
 * Automated QA for Good Dog knowledge base batch integrity.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getLessonBundle, loadCrashCourse } from "@gooddog/kb-core";
import {
  buildGoodDogGuidesExport,
  isSourceGoodDogDisplayEligible
} from "@gooddog/content-gate/good-dog-export.mjs";
import { loadMergedRegistry, loadAssessmentMetrics } from "./load-registry.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const errors = [];
const warnings = [];

const {
  sources,
  claims,
  protocols,
  studies,
  safetyRules,
  relationships,
  lessons,
  behaviours,
  disagreements,
  reviewItems
} = loadMergedRegistry();

const sourceIds = new Set(sources.map((s) => s.id));
const studyIds = new Set(studies.map((s) => s.id));
const claimIds = new Set(claims.map((c) => c.id));
const protocolIds = new Set(protocols.map((p) => p.id));
const safetyIds = new Set(safetyRules.map((s) => s.id));

const seenSource = new Set();
for (const s of sources) {
  if (seenSource.has(s.id)) errors.push(`Duplicate source id: ${s.id}`);
  seenSource.add(s.id);
  if (!s.canonicalUrl) errors.push(`Source ${s.id} missing canonicalUrl`);
  if (!s.retrievedDate) warnings.push(`Source ${s.id} missing retrievedDate`);
  if (!s.extractionStatus) warnings.push(`Source ${s.id} missing extractionStatus`);
}

const seenClaim = new Set();
for (const c of claims) {
  if (seenClaim.has(c.id)) errors.push(`Duplicate claim id: ${c.id}`);
  seenClaim.add(c.id);
  if (!c.supportingSourceId && !c.studyId) {
    errors.push(`Claim ${c.id} missing supportingSourceId/studyId`);
  }
  if (
    c.supportingSourceId &&
    !sourceIds.has(c.supportingSourceId) &&
    !studyIds.has(c.supportingSourceId)
  ) {
    errors.push(`Claim ${c.id} references unknown source ${c.supportingSourceId}`);
  }
  if (c.goodDogRecommendationEligible && c.confidence === "low") {
    warnings.push(`Claim ${c.id} eligible for app but confidence low`);
  }
  for (const cid of c.contradictingClaimIds ?? []) {
    if (!claimIds.has(cid)) errors.push(`Claim ${c.id} contradicts unknown claim ${cid}`);
  }
}

const seenProto = new Set();
for (const p of protocols) {
  if (seenProto.has(p.id)) errors.push(`Duplicate protocol id: ${p.id}`);
  seenProto.add(p.id);
  if (!p.supportingSourceIds?.length) errors.push(`Protocol ${p.id} missing supportingSourceIds`);
  for (const sid of p.supportingSourceIds ?? []) {
    if (!sourceIds.has(sid)) errors.push(`Protocol ${p.id} unknown source ${sid}`);
  }
  for (const cid of p.supportingClaimIds ?? []) {
    if (!claimIds.has(cid)) errors.push(`Protocol ${p.id} unknown claim ${cid}`);
  }
  for (const bid of p.targetBehaviourIds ?? []) {
    if (!behaviours.some((b) => b.id === bid)) {
      errors.push(`Protocol ${p.id} unknown behaviour ${bid}`);
    }
  }
  if (p.reviewStatus === "requires_human_review" && !p.reviewReason) {
    warnings.push(`Protocol ${p.id} requires review but no reviewReason`);
  }
  if (!p.steps?.length) errors.push(`Protocol ${p.id} has no steps`);
  for (const step of p.steps ?? []) {
    if (!step.progressCriteria) warnings.push(`Protocol ${p.id} step ${step.stepNumber} missing progressCriteria`);
  }
}

for (const st of studies) {
  if (st.sourceId && !sourceIds.has(st.sourceId)) {
    errors.push(`Study ${st.id} sourceId not in sources registry`);
  }
}

for (const rule of safetyRules) {
  for (const cid of rule.rationaleClaimIds ?? []) {
    if (!claimIds.has(cid)) errors.push(`Safety rule ${rule.id} unknown claim ${cid}`);
  }
}

for (const l of lessons) {
  if (l.derivedFromProtocolId && !protocolIds.has(l.derivedFromProtocolId)) {
    errors.push(`Lesson ${l.id} unknown protocol`);
  }
}

const behaviourIds = new Set(behaviours.map((b) => b.id));
const lessonIds = new Set(lessons.map((l) => l.id));
const disagreementIds = new Set(disagreements.map((d) => d.id));
const metricIds = new Set(loadAssessmentMetrics().map((m) => m.id));
const entityIds = new Set([
  ...sourceIds,
  ...studyIds,
  ...claimIds,
  ...protocolIds,
  ...safetyIds,
  ...behaviourIds,
  ...lessonIds,
  ...disagreementIds,
  ...metricIds
]);

const seenReview = new Set();
for (const item of reviewItems) {
  const rid = item.id;
  if (seenReview.has(rid)) errors.push(`Duplicate review queue id: ${rid}`);
  seenReview.add(rid);
}

for (const r of relationships) {
  if (!entityIds.has(r.from)) warnings.push(`Relationship from unknown id: ${r.from}`);
  if (!entityIds.has(r.to) && !sourceIds.has(r.to) && !studyIds.has(r.to) && !safetyIds.has(r.to)) {
    warnings.push(`Relationship to unknown id: ${r.to}`);
  }
}

const publishConfig = JSON.parse(
  readFileSync(join(repoRoot, "kb/meta/publish-config.json"), "utf8")
);
const crosswalk = JSON.parse(
  readFileSync(join(repoRoot, "kb/meta/good-dog-exercise-crosswalk.json"), "utf8")
);
const managementIds = new Set(publishConfig.managementLessonIds ?? []);
const educationIds = new Set(publishConfig.educationOnlyLessonIds ?? []);
const allowReview = new Set(publishConfig.allowProtocolsDespiteReview ?? []);

for (const lessonId of publishConfig.pilotLessonIds ?? []) {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) {
    errors.push(`Pilot lesson ${lessonId} not found in registry`);
    continue;
  }
  const protocol = protocols.find((p) => p.id === lesson.derivedFromProtocolId);
  if (
    lesson.traceabilityStatus !== "complete" &&
    !(protocol && allowReview.has(protocol.id))
  ) {
    errors.push(
      `Pilot lesson ${lessonId} traceabilityStatus is ${lesson.traceabilityStatus} (not complete)`
    );
  }

  if (managementIds.has(lessonId) || educationIds.has(lessonId) || lesson.educationOnly) {
    continue;
  }

  const mapping = (crosswalk.mappings ?? []).find((m) => m.lessonId === lessonId);
  if (!mapping) {
    errors.push(`Pilot skill lesson ${lessonId} missing Good Dog crosswalk entry`);
    continue;
  }
  if (mapping.newExercise !== true && !/^ex-/.test(mapping.goodDogExerciseId ?? "")) {
    errors.push(
      `Crosswalk for ${lessonId} must have goodDogExerciseId /^ex-/ or newExercise: true`
    );
  }
}

const guidesExport = buildGoodDogGuidesExport();
const exportedGuideIds = new Set(guidesExport.guides.map((guide) => guide.lessonId));
for (const lessonId of [...managementIds, ...educationIds]) {
  const bundle = getLessonBundle(lessonId);
  const sources = bundle?.sources ?? [];
  const paraphraseOk =
    sources.length > 0 && sources.every((source) => isSourceGoodDogDisplayEligible(source));
  if (paraphraseOk && !exportedGuideIds.has(lessonId)) {
    errors.push(
      `Guide lesson ${lessonId} has paraphrase_ok sources but is missing from good-dog-guides export`
    );
  }
  if (!paraphraseOk && exportedGuideIds.has(lessonId)) {
    errors.push(
      `Guide lesson ${lessonId} is in good-dog-guides export without paraphrase_ok sources`
    );
  }
}

const seenExerciseIds = new Set();
for (const mapping of crosswalk.mappings ?? []) {
  const gid = mapping.goodDogExerciseId;
  if (!gid) continue;
  if (seenExerciseIds.has(gid)) {
    errors.push(`Duplicate goodDogExerciseId in crosswalk: ${gid}`);
  }
  seenExerciseIds.add(gid);
}

const crashCourse = loadCrashCourse();
const lessonIdSet = new Set(lessons.map((l) => l.id));
const COVERAGE = new Set(["covered", "partial", "evidence_only", "gap"]);
const EXERCISE_STATUS = new Set(["covered", "partial", "claims_only", "held_for_review", "gap"]);
const partIds = new Set((crashCourse.parts ?? []).map((part) => part.id));
const stagedLessonIds = new Set();
const seenStage = new Set();
for (const stage of crashCourse.stages ?? []) {
  if (seenStage.has(stage.id)) errors.push(`Duplicate crash-course stage id: ${stage.id}`);
  seenStage.add(stage.id);
  if (!partIds.has(stage.part)) errors.push(`Crash-course stage ${stage.id} unknown part ${stage.part}`);
  if (!COVERAGE.has(stage.coverage)) {
    errors.push(`Crash-course stage ${stage.id} invalid coverage ${stage.coverage}`);
  }
  if (stage.coverage === "covered" && stage.gaps?.length) {
    errors.push(`Crash-course stage ${stage.id} is covered but lists gaps`);
  }
  if (stage.coverage !== "covered" && stage.coverage !== "evidence_only" && !stage.gaps?.length) {
    errors.push(`Crash-course stage ${stage.id} is ${stage.coverage} but lists no gaps`);
  }
  for (const lessonId of stage.lessonIds ?? []) {
    stagedLessonIds.add(lessonId);
    if (!lessonIdSet.has(lessonId)) errors.push(`Crash-course stage ${stage.id} unknown lesson ${lessonId}`);
  }
  for (const cid of stage.claimIds ?? []) {
    if (!claimIds.has(cid)) errors.push(`Crash-course stage ${stage.id} unknown claim ${cid}`);
  }
}
for (const row of crashCourse.practicalExercises ?? []) {
  if (!EXERCISE_STATUS.has(row.status)) {
    errors.push(`Crash-course exercise ${row.imdtExercise} invalid status ${row.status}`);
  }
  for (const lessonId of [...(row.lessonIds ?? []), ...(row.nearestLessonIds ?? [])]) {
    if (!lessonIdSet.has(lessonId)) {
      errors.push(`Crash-course exercise ${row.imdtExercise} unknown lesson ${lessonId}`);
    }
  }
  for (const cid of row.claimIds ?? []) {
    if (!claimIds.has(cid)) errors.push(`Crash-course exercise ${row.imdtExercise} unknown claim ${cid}`);
  }
}
for (const sid of crashCourse.alignment?.sourceIds ?? []) {
  if (!sourceIds.has(sid)) errors.push(`Crash-course alignment unknown source ${sid}`);
}
for (const cid of crashCourse.alignment?.claimIds ?? []) {
  if (!claimIds.has(cid)) errors.push(`Crash-course alignment unknown claim ${cid}`);
}
for (const lessonId of publishConfig.pilotLessonIds ?? []) {
  if (!stagedLessonIds.has(lessonId)) {
    errors.push(`Pilot lesson ${lessonId} is not placed in any crash-course stage`);
  }
}

console.log("Good Dog KB QA report");
console.log("=====================");
console.log(
  `Sources: ${sources.length}, Claims: ${claims.length}, Protocols: ${protocols.length}, Studies: ${studies.length}`
);
console.log(`Review queue: ${reviewItems.length} items`);
console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
for (const e of errors) console.log(`  ERROR: ${e}`);
for (const w of warnings) console.log(`  WARN: ${w}`);

if (errors.length > 0) process.exit(1);
process.exit(0);
