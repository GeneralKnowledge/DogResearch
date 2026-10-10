import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getRepoRoot,
  loadGoodDogCrosswalk,
  loadGoodDogFieldDefaults,
  loadMergedRegistry
} from "@gooddog/kb-core";
import {
  buildPublishableBundle,
  sanitizeProtocolForExport
} from "./index.mjs";

export const NO_AVERSIVE_PATTERN_SOURCES = [
  "\\bshock collar\\b",
  "\\bchoke chain\\b",
  "\\bprong\\b",
  "\\balpha roll\\b",
  "\\bhit(ting)?\\s+(your\\s+)?dog\\b"
];

/** @param {import('@gooddog/kb-core/types').Source} source */
export function isSourceGoodDogDisplayEligible(source) {
  return (source.displayEligibility ?? "paraphrase_ok_pending_legal") === "paraphrase_ok";
}

/**
 * @param {ReturnType<typeof loadGoodDogCrosswalk>} crosswalk
 * @param {string} lessonId
 * @param {string} protocolId
 */
export function resolveCrosswalkEntry(crosswalk, lessonId, protocolId) {
  const mappings = crosswalk.mappings ?? [];
  return (
    mappings.find((m) => m.lessonId === lessonId && m.protocolId === protocolId) ??
    mappings.find((m) => m.protocolId === protocolId && !m.lessonId) ??
    null
  );
}

/** @param {string} exerciseId */
export function exerciseIdToSlug(exerciseId) {
  return exerciseId.replace(/^ex-kb-/, "kb-").replace(/^ex-/, "");
}

/**
 * @param {object} opts
 * @param {boolean} [opts.includeHeld]
 * @param {boolean} [opts.includeDrafts]
 */
export function buildGoodDogDomainExport(opts = {}) {
  const includeHeld =
    opts.includeHeld === true || process.env.GOOD_DOG_EXPORT_INCLUDE_HELD === "1";
  const includeDrafts = opts.includeDrafts === true;
  const bundle = buildPublishableBundle(false);
  const crosswalk = loadGoodDogCrosswalk();
  const fieldDefaults = loadGoodDogFieldDefaults();
  const registry = loadMergedRegistry();
  const config = JSON.parse(
    readFileSync(join(getRepoRoot(), "kb/meta/publish-config.json"), "utf8")
  );
  const schemaMeta = JSON.parse(
    readFileSync(join(getRepoRoot(), "kb/meta/schema-version.json"), "utf8")
  );

  const managementIds = new Set(config.managementLessonIds ?? []);
  const educationIds = new Set(config.educationOnlyLessonIds ?? []);

  /** @type {Array<Record<string, unknown>>} */
  const exercises = [];
  /** @type {Array<Record<string, unknown>>} */
  const held = [];
  /** @type {Array<Record<string, unknown>>} */
  const draftExercises = [];
  /** @type {Array<Record<string, unknown>>} */
  const managementModules = [];
  /** @type {Array<Record<string, unknown>>} */
  const educationOnly = [];
  /** @type {Array<Record<string, unknown>>} */
  const skipped = [];

  for (const entry of bundle.lessons) {
    const { lesson, protocol, claims, sources } = entry;

    if (educationIds.has(lesson.id) || lesson.educationOnly) {
      educationOnly.push({
        lessonId: lesson.id,
        title: lesson.title,
        summary: lesson.summary,
        protocolId: protocol.id
      });
      continue;
    }

    if (managementIds.has(lesson.id)) {
      managementModules.push({
        lessonId: lesson.id,
        title: lesson.title,
        summary: lesson.summary,
        protocolId: protocol.id,
        advisory: entry.advisory,
        advisoryMessage: entry.advisoryMessage
      });
      continue;
    }

    const mapping = resolveCrosswalkEntry(crosswalk, lesson.id, protocol.id);
    if (!mapping) {
      skipped.push({ lessonId: lesson.id, reason: "missing_crosswalk" });
      continue;
    }

    if (
      sources.some((s) => !isSourceGoodDogDisplayEligible(s))
    ) {
      skipped.push({ lessonId: lesson.id, reason: "source_not_paraphrase_ok" });
      continue;
    }

    const exportStatus = mapping.goodDogExportStatus ?? "active";
    if (exportStatus === "hold_until_method_review") {
      held.push({
        lessonId: lesson.id,
        protocolId: protocol.id,
        goodDogExerciseId: mapping.goodDogExerciseId,
        methodTags: mapping.methodTags ?? [],
        reason: exportStatus
      });
      if (!includeHeld) {
        continue;
      }
    }

    if (exportStatus === "draft" && !includeDrafts) {
      continue;
    }

    const recallRelated =
      lesson.id.includes("recall") || protocol.id.includes("recall");
    const sanitized = sanitizeProtocolForExport(protocol, recallRelated);
    const defaults =
      fieldDefaults.byLearningObjectiveId?.[mapping.learningObjectiveId] ?? {};

    const exerciseId =
      mapping.newExercise === true
        ? mapping.goodDogExerciseId
        : mapping.goodDogExerciseId;

    const fullLesson = registry.lessons.find((l) => l.id === lesson.id);
    const lastVerified =
      protocol.lastReviewed ??
      fullLesson?.lastReviewed ??
      sources.find((s) => s.lastReviewed)?.lastReviewed ??
      schemaMeta.lastUpdated;

    const exercise = {
      id: exerciseId,
      slug: exerciseIdToSlug(exerciseId),
      title: lesson.title,
      steps: sanitized.steps.map((s) => s.instruction),
      safetyNote: (sanitized.safetyPrecautions ?? []).join(" "),
      prerequisiteIds: mapping.prerequisiteIds ?? [],
      easierVariationId: mapping.easierVariationId,
      harderVariationId: mapping.harderVariationId,
      learningObjectiveId: mapping.learningObjectiveId,
      glossaryTermIds: mapping.glossaryTermIds ?? [],
      contentVersion: mapping.contentVersion ?? 1,
      estimatedMinutes: mapping.estimatedMinutes ?? defaults.estimatedMinutes ?? 3,
      difficulty: mapping.difficulty ?? defaults.difficulty ?? 1,
      category: defaults.category ?? "engagement",
      lifeStages: defaults.lifeStages ?? ["adult"],
      topicGroup: defaults.topicGroup ?? "everyday_foundations",
      contentCompleteness: "steps_only",
      newExercise: mapping.newExercise === true,
      goodDogExportStatus: exportStatus,
      provenance: {
        protocolId: protocol.id,
        claimIds: [
          ...new Set([
            ...(fullLesson?.supportingClaimIds ?? []),
            ...(protocol.supportingClaimIds ?? []),
            ...claims.map((c) => c.id)
          ])
        ],
        sourceIds: [
          ...new Set([
            ...(protocol.supportingSourceIds ?? []),
            ...sources.map((s) => s.id)
          ])
        ],
        reviewStatus: protocol.reviewStatus ?? "unknown",
        lastVerified,
        displayEligibilitySummary: sources.map((s) => ({
          sourceId: s.id,
          displayEligibility: s.displayEligibility ?? "paraphrase_ok_pending_legal"
        }))
      }
    };

    if (exportStatus === "draft") {
      draftExercises.push(exercise);
    } else {
      exercises.push(exercise);
    }
  }

  for (const mapping of crosswalk.mappings ?? []) {
    if (mapping.lessonId || mapping.goodDogExportStatus !== "draft") {
      continue;
    }
    const protocol = registry.protocols.find((p) => p.id === mapping.protocolId);
    if (!protocol) {
      skipped.push({ protocolId: mapping.protocolId, reason: "draft_protocol_missing" });
      continue;
    }
    const defaults =
      fieldDefaults.byLearningObjectiveId?.[mapping.learningObjectiveId] ?? {};
    const sanitized = sanitizeProtocolForExport(protocol, false);
    draftExercises.push({
      id: mapping.goodDogExerciseId,
      slug: exerciseIdToSlug(mapping.goodDogExerciseId),
      title: protocol.title,
      steps: sanitized.steps.map((s) => s.instruction),
      safetyNote: (sanitized.safetyPrecautions ?? []).join(" "),
      prerequisiteIds: mapping.prerequisiteIds ?? [],
      easierVariationId: mapping.easierVariationId,
      harderVariationId: mapping.harderVariationId,
      learningObjectiveId: mapping.learningObjectiveId,
      glossaryTermIds: [],
      contentVersion: 1,
      estimatedMinutes: defaults.estimatedMinutes ?? 4,
      difficulty: defaults.difficulty ?? 2,
      category: defaults.category ?? "walking",
      lifeStages: defaults.lifeStages ?? ["adult"],
      topicGroup: defaults.topicGroup ?? "walking_together",
      contentCompleteness: "steps_only",
      newExercise: true,
      goodDogExportStatus: "draft",
      provenance: {
        protocolId: protocol.id,
        claimIds: protocol.supportingClaimIds ?? [],
        sourceIds: protocol.supportingSourceIds ?? [],
        reviewStatus: protocol.reviewStatus ?? "unknown",
        lastVerified: protocol.lastReviewed ?? schemaMeta.lastUpdated,
        displayEligibilitySummary: []
      }
    });
  }

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    kbProfile: schemaMeta.goodDogKbProfile,
    generatedAt: new Date().toISOString(),
    exercises,
    held,
    draftExercises,
    managementModules,
    educationOnly,
    skipped: [...skipped, ...bundle.skipped]
  };
}

/** @param {Array<Record<string, unknown>>} exercises */
export function validateVariationGraph(exercises) {
  const errors = [];
  const byId = new Map(exercises.map((e) => [/** @type {string} */ (e.id), e]));

  /** @param {string} id */
  /** @param {Set<string>} stack */
  function visit(id, stack) {
    if (stack.has(id)) {
      errors.push(`Variation cycle detected at ${id}`);
      return;
    }
    const ex = byId.get(id);
    if (!ex) return;
    const next = new Set(stack);
    next.add(id);
    for (const key of ["easierVariationId", "harderVariationId"]) {
      const val = ex[key];
      const ids = val ? [val] : [];
      for (const ref of ids) {
        if (!byId.has(ref)) continue;
        const other = byId.get(ref);
        if (
          other &&
          ex.learningObjectiveId &&
          other.learningObjectiveId &&
          ex.learningObjectiveId !== other.learningObjectiveId
        ) {
          errors.push(
            `Variation link ${id} -> ${ref} crosses learningObjectiveId (${ex.learningObjectiveId} vs ${other.learningObjectiveId})`
          );
        }
        visit(ref, next);
      }
    }
  }

  for (const ex of exercises) {
    visit(/** @type {string} */ (ex.id), new Set());
  }

  return errors;
}

export function buildGoodDogSafetyExport() {
  const registry = loadMergedRegistry();
  const schemaMeta = JSON.parse(
    readFileSync(join(getRepoRoot(), "kb/meta/schema-version.json"), "utf8")
  );
  const assessmentMetrics = JSON.parse(
    readFileSync(join(getRepoRoot(), "kb/registry/assessment-metrics.json"), "utf8")
  ).metrics;

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    generatedAt: new Date().toISOString(),
    safetyRules: registry.safetyRules,
    assessmentMetrics,
    violatesNoAversivePatterns: NO_AVERSIVE_PATTERN_SOURCES.map((source) => ({
      source,
      flags: "i"
    })),
    blocksOffLeadPromotion: {
      description:
        "Do not promote off-lead exercise until tier-2 long-line recall metrics are met.",
      requiredMetricIds: ["metric-recall-long-line-5m", "metric-recall-long-line-10m"]
    },
    safe002Sanitized:
      "Recall-related protocol steps in good-dog-domain.json use sanitizeProtocolForExport (off-lead phrasing gated)."
  };
}
