#!/usr/bin/env node
/**
 * Automated QA for Good Dog knowledge base batch integrity.
 */
import { loadMergedRegistry, loadAssessmentMetrics } from "./load-registry.mjs";

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

for (const r of relationships) {
  if (!entityIds.has(r.from)) warnings.push(`Relationship from unknown id: ${r.from}`);
  if (!entityIds.has(r.to) && !sourceIds.has(r.to) && !studyIds.has(r.to) && !safetyIds.has(r.to)) {
    warnings.push(`Relationship to unknown id: ${r.to}`);
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
