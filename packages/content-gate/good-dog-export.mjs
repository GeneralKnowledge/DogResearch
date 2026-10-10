import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getLessonBundle,
  getRepoRoot,
  loadGoodDogCrosswalk,
  loadGoodDogFieldDefaults,
  loadCrashCourse,
  loadMergedRegistry,
  loadOwnerQuestions,
  loadPublishConfig
} from "@gooddog/kb-core";
import {
  buildPublishableBundle,
  buildReferrals,
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

/** @param {unknown} text */
export function purposeOneLine(text) {
  const cleaned = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const sentence = cleaned.split(/(?<=[.!?])\s+/)[0] ?? cleaned;
  if (sentence.length <= 180) return sentence;
  return `${sentence.slice(0, 177).trimEnd()}…`;
}

function loadSchemaMeta() {
  return JSON.parse(
    readFileSync(join(getRepoRoot(), "kb/meta/schema-version.json"), "utf8")
  );
}

/**
 * @param {import('@gooddog/kb-core/types').Protocol} protocol
 * @param {import('@gooddog/kb-core/types').Lesson | undefined} lesson
 * @param {Array<{ id: string }>} claims
 * @param {Array<{ id: string; lastReviewed?: string }>} sources
 * @param {{ lastUpdated?: string }} schemaMeta
 */
function buildGuideProvenance(protocol, lesson, claims, sources, schemaMeta) {
  const lastVerified =
    protocol.lastReviewed ??
    protocol.lastVerified ??
    lesson?.lastReviewed ??
    sources.find((s) => s.lastReviewed)?.lastReviewed ??
    schemaMeta.lastUpdated;

  return {
    protocolId: protocol.id,
    claimIds: [
      ...new Set([
        ...(lesson?.supportingClaimIds ?? []),
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
    lastVerified
  };
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
      purposeOneLine: purposeOneLine(
        lesson.summary || sanitized.intendedOutcome || lesson.title
      ),
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
      purposeOneLine: purposeOneLine(protocol.intendedOutcome || protocol.title),
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
  const crosswalk = loadGoodDogCrosswalk();

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    generatedAt: new Date().toISOString(),
    safetyRules: registry.safetyRules,
    assessmentMetrics: assessmentMetrics.map((metric) => ({
      ...metric,
      goodDogInferenceHints: inferenceHintsForMetric(metric, crosswalk.mappings ?? [])
    })),
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

/**
 * Exercises and learning objectives whose sessions count toward a metric.
 * Includes every crosswalk row for the metric's protocols, plus sibling
 * exercises that share those learning objectives (held and draft ids included).
 *
 * @param {{ supportingProtocolIds?: string[] }} metric
 * @param {Array<Record<string, unknown>>} mappings
 */
export function inferenceHintsForMetric(metric, mappings) {
  const protocolIds = new Set(metric.supportingProtocolIds ?? []);
  const direct = mappings.filter(
    (m) => typeof m.protocolId === "string" && protocolIds.has(m.protocolId)
  );
  const learningObjectiveIds = [
    ...new Set(
      direct
        .map((m) => m.learningObjectiveId)
        .filter((id) => typeof id === "string" && id.length > 0)
    )
  ].sort();
  const objectiveSet = new Set(learningObjectiveIds);
  const exerciseIds = [
    ...new Set(
      mappings
        .filter((m) => {
          const protocolMatch =
            typeof m.protocolId === "string" && protocolIds.has(m.protocolId);
          const objectiveMatch =
            typeof m.learningObjectiveId === "string" &&
            objectiveSet.has(m.learningObjectiveId);
          return protocolMatch || objectiveMatch;
        })
        .map((m) => m.goodDogExerciseId)
        .filter((id) => typeof id === "string" && id.length > 0)
    )
  ].sort();

  return { exerciseIds, learningObjectiveIds };
}

/** Curated Ask phrases for guides. Owner-question subthemes are appended at export. */
const GUIDE_ASK_KEYWORDS = {
  "lesson-steal-chase": [
    "steal",
    "stolen",
    "chase",
    "runs away with",
    "drop it",
    "guarding"
  ],
  "lesson-fireworks-management": [
    "fireworks",
    "bangs",
    "noise fear",
    "thunder",
    "scared of noises"
  ],
  "lesson-reactive-management": [
    "reactive",
    "lunges",
    "barks at dogs",
    "lead reactivity",
    "on lead barking"
  ],
  "lesson-rescue-settling": ["rescue dog", "newly adopted", "settle in", "rehomed"],
  "lesson-adolescent-regression": [
    "teenager",
    "adolescent",
    "regression",
    "suddenly worse",
    "fear period"
  ],
  "lesson-puppy-socialisation": [
    "socialise",
    "socialization",
    "puppy",
    "vaccination",
    "before vaccinations"
  ],
  "lesson-read-your-dog-stress": [
    "stress signals",
    "lip lick",
    "yawning",
    "body language",
    "anxious",
    "turning away",
    "whale eye",
    "tucked tail",
    "panting"
  ],
  "lesson-vet-handling-prep": [
    "vet visit",
    "scared of the vet",
    "grooming",
    "handling",
    "nail clipping",
    "touch and treat",
    "examination"
  ],
  "lesson-how-dogs-learn": [
    "how dogs learn",
    "rewards",
    "treats",
    "marker",
    "clicker",
    "positive reinforcement",
    "why does my dog",
    "reward timing"
  ],
  "lesson-equipment-and-law": [
    "harness",
    "collar",
    "id tag",
    "microchip",
    "prong collar",
    "choke chain",
    "shock collar",
    "e-collar",
    "head collar",
    "equipment"
  ],
  "lesson-plan-and-measure": [
    "training plan",
    "session length",
    "how long to train",
    "training diary",
    "progress",
    "how often"
  ]
};

const CATEGORY_GUIDE = {
  "oq-reactivity": "lesson-reactive-management",
  "oq-noise-fireworks": "lesson-fireworks-management",
  "oq-guarding-stealing": "lesson-steal-chase",
  "oq-puppy-socialisation": "lesson-puppy-socialisation"
};

const CATEGORY_HELP = {
  "oq-recall": "help-recall",
  "oq-training-basics": "help-training-basics",
  "oq-jumping-mouthing": "help-jumping-mouthing",
  "oq-reactivity": "help-reactivity",
  "oq-noise-fireworks": "help-noise-fireworks",
  "oq-guarding-stealing": "help-guarding",
  "oq-puppy-socialisation": "help-puppy-socialisation"
};

const QUESTION_HELP = {
  "oq-train-001": "help-rewards",
  "oq-train-002": "help-find-trainer"
};

const REFERRAL_RATIONALE_CLAIM_IDS = {
  abtcRegister: ["claim-rspca-003-abtc-trainer"],
  vetFirst: ["claim-dt-reactive-002-vet-check-first"],
  dogsTrustBehaviourLine: ["claim-dt-reactive-006-behaviour-support-referral"]
};

/**
 * @param {string} lessonId
 * @param {Array<{ id: string; questions?: Array<Record<string, unknown>> }>} ownerQuestions
 * @param {Set<string>} exportedGuideIds
 */
function suggestedAskKeywords(lessonId, ownerQuestions, exportedGuideIds) {
  /** @type {string[]} */
  const keywords = [...(GUIDE_ASK_KEYWORDS[lessonId] ?? [])];
  for (const category of ownerQuestions) {
    for (const question of category.questions ?? []) {
      const link = questionCrosswalk(question, category, exportedGuideIds);
      if (link.guideLessonId !== lessonId) continue;
      for (const theme of question.subthemes ?? []) {
        if (typeof theme === "string" && theme.trim()) keywords.push(theme.trim());
      }
    }
  }
  const seen = new Set();
  const unique = [];
  for (const keyword of keywords) {
    const key = keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(keyword);
    if (unique.length >= 16) break;
  }
  return unique;
}

/**
 * @param {Record<string, unknown>} question
 * @param {{ id: string }} category
 * @param {Set<string>} exportedGuideIds
 */
export function questionCrosswalk(question, category, exportedGuideIds) {
  const related =
    typeof question.relatedLessonId === "string" ? question.relatedLessonId : "";
  if (related && exportedGuideIds.has(related)) {
    return { guideLessonId: related };
  }
  const categoryGuide = CATEGORY_GUIDE[category.id];
  if (!related && categoryGuide && exportedGuideIds.has(categoryGuide)) {
    return { guideLessonId: categoryGuide };
  }
  if (related) {
    return { goodDogHelpId: `help-${related.replace(/^lesson-/, "")}` };
  }
  const special = QUESTION_HELP[question.id];
  if (special) return { goodDogHelpId: special };
  return {
    goodDogHelpId: CATEGORY_HELP[category.id] ?? `help-${category.id.replace(/^oq-/, "")}`
  };
}

/** Owner-facing lines for safety ids stored on protocols. */
const OWNER_SAFETY_LINES = {
  "safe-001-no-aversive-routine":
    "If training uses pain, fear, or equipment such as a choke or prong, switch to a reward-based professional.",
  "safe-004-scope-referral":
    "See your vet if pain or illness might be involved, and an ABTC-registered clinical behaviourist for aggression or severe fear.",
  "safe-005-growl-not-punish":
    "Never tell your dog off for growling. It is a warning, so give them space and ask your vet and a qualified behaviourist for help.",
  "safe-007-no-confrontational-guarding":
    "If your dog growls or snaps over food or items, stop and ask an ABTC clinical animal behaviourist for help."
};

/**
 * Light owner voice for protocol text that is already a permitted paraphrase.
 * @param {string} text
 */
export function toOwnerVoice(text) {
  let out = text.replace(/\b([Dd])og\b/g, (full, letter, offset, source) => {
    const before = source.slice(Math.max(0, offset - 8), offset);
    if (/\b(your|a|an|the|this|that|each|every|any|another|one|other|their|my|our|his|her|its|whole)\s$/i.test(before)) {
      return full;
    }
    return letter === "D" ? "Your dog" : "your dog";
  });
  out = out
    .replace(/\(extinction burst\)/gi, "(it may happen more often for a short while, then fade)")
    .replace(/previous D or D level/gi, "the previous distance or duration")
    .replace(/^Management:\s*/i, "");
  out = out.trim();
  if (!out) return out;
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/**
 * @param {import('@gooddog/kb-core/types').Protocol} protocol
 * @param {Array<{ id: string; rule?: string; referralText?: string | null }>} safetyRules
 */
function ownerPauseLines(protocol, safetyRules) {
  /** @type {string[]} */
  const lines = [];
  for (const item of protocol.safetyPrecautions ?? []) {
    if (typeof item !== "string" || !item.trim()) continue;
    if (/^safe-/.test(item)) {
      const mapped = OWNER_SAFETY_LINES[item];
      if (mapped) {
        lines.push(mapped);
        continue;
      }
      const rule = safetyRules.find((r) => r.id === item);
      const text = rule?.referralText || rule?.rule;
      if (text && !/^direct owner\b/i.test(text)) lines.push(toOwnerVoice(text));
      continue;
    }
    lines.push(toOwnerVoice(item));
  }
  for (const stop of protocol.stopConditions ?? []) {
    if (typeof stop === "string" && stop.trim()) lines.push(toOwnerVoice(stop));
  }
  return [...new Set(lines)];
}

/**
 * Short owner-facing sections from protocol steps.
 * Steps are already paraphrases; only call this for paraphrase_ok lessons.
 *
 * @param {object} input
 * @param {import('@gooddog/kb-core/types').Lesson} input.lesson
 * @param {import('@gooddog/kb-core/types').Protocol} input.protocol
 * @param {string | null | undefined} input.advisoryMessage
 * @param {Array<{ id: string; rule?: string; referralText?: string | null }>} input.safetyRules
 */
export function buildOwnerBodyMarkdown({ lesson, protocol, advisoryMessage, safetyRules }) {
  const recallRelated =
    lesson.id.includes("recall") || protocol.id.includes("recall");
  const mentionsOffLead = (protocol.steps ?? []).some((step) =>
    /\boff[- ]?lead\b/i.test(step.instruction ?? "")
  );
  const sanitized = sanitizeProtocolForExport(protocol, recallRelated || mentionsOffLead);
  /** @type {string[]} */
  const parts = [];
  if (lesson.summary?.trim()) parts.push(lesson.summary.trim(), "");
  if (lesson.educationOnly && !/^A\.stress/.test(lesson.topic ?? "")) {
    parts.push(
      "If you notice stress signals, pause and make the exercise easier instead of pushing on.",
      ""
    );
  }
  parts.push("## What to try", "");
  for (const step of sanitized.steps ?? []) {
    parts.push(`### Step ${step.stepNumber}`, "", toOwnerVoice(step.instruction), "");
    if (step.easierIfStruggling?.trim()) {
      parts.push(`If this is hard: ${toOwnerVoice(step.easierIfStruggling)}`, "");
    }
  }
  if (advisoryMessage?.trim()) {
    parts.push("## Please note", "", advisoryMessage.trim(), "");
  }
  const pauses = ownerPauseLines(protocol, safetyRules);
  if (pauses.length) {
    parts.push("## When to pause", "");
    for (const line of pauses) parts.push(`- ${line}`);
    parts.push("");
  }
  const referrals = (protocol.referralRequirements ?? []).filter(
    (line) => typeof line === "string" && line.trim()
  );
  if (referrals.length) {
    parts.push("## Get help", "");
    for (const line of referrals) parts.push(`- ${toOwnerVoice(line)}`);
    parts.push("");
  }
  return `${parts.join("\n").trim()}\n`;
}

export function buildGoodDogGuidesExport() {
  const bundle = buildPublishableBundle(false);
  const registry = loadMergedRegistry();
  const config = loadPublishConfig();
  const schemaMeta = loadSchemaMeta();
  const ownerQuestions = loadOwnerQuestions();
  const managementIds = new Set(config.managementLessonIds ?? []);
  const educationIds = new Set(config.educationOnlyLessonIds ?? []);

  /** @type {Array<Record<string, unknown>>} */
  const candidates = [];
  /** @type {Array<{ lessonId: string; reason: string }>} */
  const excluded = [];

  for (const entry of bundle.lessons) {
    const lessonId = entry.lesson.id;
    const isEducation = educationIds.has(lessonId) || entry.lesson.educationOnly === true;
    const isManagement = managementIds.has(lessonId);
    if (!isEducation && !isManagement) continue;

    const full = getLessonBundle(lessonId);
    if (!full) {
      excluded.push({ lessonId, reason: "missing_bundle" });
      continue;
    }
    if (
      !full.sources.length ||
      full.sources.some((source) => !isSourceGoodDogDisplayEligible(source))
    ) {
      excluded.push({ lessonId, reason: "source_not_paraphrase_ok" });
      continue;
    }
    candidates.push({ entry, full });
  }

  const exportedGuideIds = new Set(
    candidates.map((row) => /** @type {string} */ (row.full.lesson.id))
  );

  const guides = candidates.map(({ entry, full }) => {
    const lesson = full.lesson;
    return {
      lessonId: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      advisory: entry.advisory === true,
      advisoryMessage: entry.advisoryMessage ?? null,
      protocolId: full.protocol.id,
      ownerBodyMarkdown: buildOwnerBodyMarkdown({
        lesson,
        protocol: full.protocol,
        advisoryMessage: entry.advisoryMessage,
        safetyRules: registry.safetyRules
      }),
      provenance: buildGuideProvenance(
        full.protocol,
        lesson,
        full.claims,
        full.sources,
        schemaMeta
      ),
      suggestedAskKeywords: suggestedAskKeywords(lesson.id, ownerQuestions, exportedGuideIds)
    };
  });

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    generatedAt: new Date().toISOString(),
    guides,
    excluded
  };
}

export function buildGoodDogReferralsExport() {
  const registry = loadMergedRegistry();
  const schemaMeta = loadSchemaMeta();
  const claimIds = new Set(registry.claims.map((claim) => claim.id));
  const base = buildReferrals(registry);
  /** @type {Record<string, { title: string; body: string; url?: string; rationaleClaimIds: string[] }>} */
  const referrals = {};

  for (const [key, value] of Object.entries(base)) {
    const rationale = (REFERRAL_RATIONALE_CLAIM_IDS[key] ?? []).filter((id) =>
      claimIds.has(id)
    );
    referrals[key] = {
      title: value.title,
      body: value.body,
      ...(value.url ? { url: value.url } : {}),
      rationaleClaimIds: rationale
    };
  }

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    generatedAt: new Date().toISOString(),
    referrals
  };
}

const ESCALATE_QUESTION_PATTERNS = [
  {
    id: "escalate-aversive-methods",
    safetyRuleIds: ["safe-001-no-aversive-routine", "safe-008-abtc-aversive-ban"],
    guideLessonIds: [],
    keywords: ["shock collar", "choke chain", "prong", "alpha roll", "hit my dog"],
    pattern:
      "\\b(shock collar|choke chain|prong|alpha roll|hit(ting)?\\s+(my\\s+|your\\s+)?dog)\\b",
    flags: "i"
  },
  {
    id: "escalate-off-lead-recall",
    safetyRuleIds: ["safe-002-recall-management"],
    guideLessonIds: [],
    keywords: ["off lead", "off-lead", "won't come back", "does not come when called"],
    pattern: "\\b(off[- ]?lead|won'?t come|does not come|not coming back)\\b",
    flags: "i"
  },
  {
    id: "escalate-punish-return",
    safetyRuleIds: ["safe-003-no-punish-return"],
    guideLessonIds: [],
    keywords: ["punish for coming back", "told off for coming", "scold recall"],
    pattern: "\\b(punish|scold|shout|told off|tell off).{0,40}\\b(come|coming|recall|came back)\\b",
    flags: "i"
  },
  {
    id: "escalate-clinical-scope",
    safetyRuleIds: ["safe-004-scope-referral"],
    guideLessonIds: [
      "lesson-reactive-management",
      "lesson-fireworks-management",
      "lesson-rescue-settling",
      "lesson-adolescent-regression"
    ],
    keywords: ["aggression", "bite", "severe fear", "panic", "sudden behaviour change", "pain"],
    pattern:
      "\\b(aggress\\w*|bites?|biting|severe fear|panic|self[- ]?injur\\w*|sudden(ly)?\\s+(changed|change|worse)|in pain)\\b",
    flags: "i"
  },
  {
    id: "escalate-punish-warning",
    safetyRuleIds: ["safe-005-growl-not-punish", "safe-007-no-punish-growling"],
    guideLessonIds: [
      "lesson-read-your-dog-stress",
      "lesson-reactive-management",
      "lesson-vet-handling-prep"
    ],
    keywords: ["growl", "punish growl", "snarl", "warning signal"],
    pattern: "\\b(growl\\w*|snarl\\w*|warning signal)\\b",
    flags: "i"
  },
  {
    id: "escalate-child-supervision",
    safetyRuleIds: ["safe-006-child-supervision"],
    guideLessonIds: ["lesson-read-your-dog-stress"],
    keywords: ["child", "baby", "toddler", "alone with the dog"],
    pattern: "\\b(child|children|baby|toddler|kid)s?\\b",
    flags: "i"
  },
  {
    id: "escalate-guarding-chase",
    safetyRuleIds: ["safe-007-no-confrontational-guarding"],
    guideLessonIds: ["lesson-steal-chase"],
    keywords: ["resource guarding", "guards food", "chase stolen", "pry from mouth"],
    pattern:
      "\\b(resource guarding|guards?\\s+(food|toys?|items?)|chase\\w*.{0,24}(stolen|item)|pry|out of (his|her|their) mouth)\\b",
    flags: "i"
  }
];

/**
 * @param {ReturnType<typeof buildGoodDogGuidesExport>} [guidesExport]
 */
export function buildGoodDogAskPatternsExport(guidesExport) {
  const guides = guidesExport ?? buildGoodDogGuidesExport();
  const registry = loadMergedRegistry();
  const schemaMeta = loadSchemaMeta();
  const ownerQuestions = loadOwnerQuestions();
  const ruleIds = new Set(registry.safetyRules.map((rule) => rule.id));
  const exportedGuideIds = new Set(guides.guides.map((guide) => guide.lessonId));

  const escalateQuestionPatterns = ESCALATE_QUESTION_PATTERNS.map((pattern) => ({
    ...pattern,
    safetyRuleIds: pattern.safetyRuleIds.filter((id) => ruleIds.has(id)),
    guideLessonIds: pattern.guideLessonIds.filter((id) => exportedGuideIds.has(id))
  })).filter((pattern) => pattern.safetyRuleIds.length > 0);

  const ownerQuestionTaxonomy = ownerQuestions.map((category) => {
    const questions = (category.questions ?? []).map((question) => {
      const link = questionCrosswalk(question, category, exportedGuideIds);
      return {
        id: question.id,
        text: question.text,
        subthemes: question.subthemes ?? [],
        sourceLocator: question.sourceLocator ?? null,
        ...link
      };
    });
    const guideIds = [...new Set(questions.map((q) => q.guideLessonId).filter(Boolean))];
    const helpIds = [...new Set(questions.map((q) => q.goodDogHelpId).filter(Boolean))];
    /** @type {{ guideLessonId: string } | { goodDogHelpId: string }} */
    const categoryLink =
      guideIds.length === 1 && helpIds.length === 0
        ? { guideLessonId: guideIds[0] }
        : helpIds.length === 1 && guideIds.length === 0
          ? { goodDogHelpId: helpIds[0] }
          : {
              goodDogHelpId:
                CATEGORY_HELP[category.id] ?? `help-${category.id.replace(/^oq-/, "")}`
            };
    return {
      id: category.id,
      label: category.label,
      ...categoryLink,
      questions
    };
  });

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    generatedAt: new Date().toISOString(),
    violatesNoAversivePatterns: NO_AVERSIVE_PATTERN_SOURCES.map((source) => ({
      source,
      flags: "i"
    })),
    escalateQuestionPatterns,
    ownerQuestionTaxonomy
  };
}


/**
 * Ordered owner path with coverage notes. Only publishable lessons appear in `lessons`;
 * researched-but-gated lessons are listed in `heldLessonIds`.
 *
 * @param {ReturnType<typeof buildGoodDogGuidesExport>} [guidesExport]
 */
export function buildGoodDogCrashCourseExport(guidesExport = buildGoodDogGuidesExport()) {
  const course = loadCrashCourse();
  const registry = loadMergedRegistry();
  const schemaMeta = loadSchemaMeta();
  const bundle = buildPublishableBundle(false);
  const publishable = new Map(bundle.lessons.map((entry) => [entry.lesson.id, entry.lesson]));
  const guideIds = new Set(guidesExport.guides.map((guide) => guide.lessonId));
  const registryLessons = new Map(registry.lessons.map((lesson) => [lesson.id, lesson]));

  /** @param {string[]} ids */
  const resolveLessons = (ids) => {
    const lessons = [];
    const heldLessonIds = [];
    for (const lessonId of ids) {
      const lesson = publishable.get(lessonId);
      if (lesson) {
        lessons.push({
          lessonId,
          title: lesson.title,
          kind: guideIds.has(lessonId) ? "guide" : "skill"
        });
      } else if (registryLessons.has(lessonId)) {
        heldLessonIds.push(lessonId);
      }
    }
    return { lessons, heldLessonIds };
  };

  const claimCountByTopic = new Map();
  for (const claim of registry.claims) {
    claimCountByTopic.set(claim.topic, (claimCountByTopic.get(claim.topic) ?? 0) + 1);
  }

  const stages = [...course.stages]
    .sort((a, b) => a.order - b.order)
    .map((stage) => {
      const { lessons, heldLessonIds } = resolveLessons(stage.lessonIds ?? []);
      return {
        id: stage.id,
        part: stage.part,
        order: stage.order,
        title: stage.title,
        aim: stage.aim,
        lessons,
        heldLessonIds,
        claimIds: stage.claimIds ?? [],
        coverage: stage.coverage,
        gaps: stage.gaps ?? []
      };
    });

  const practicalExercises = course.practicalExercises.map((row) => ({
    imdtExercise: row.imdtExercise,
    status: row.status,
    ...resolveLessons(row.lessonIds ?? []),
    nearestLessonIds: row.nearestLessonIds ?? [],
    claimIds: row.claimIds ?? []
  }));

  const theoryAreas = course.theoryAreas.map((area) => {
    const claimCount = area.claimTopics.reduce(
      (sum, topic) => sum + (claimCountByTopic.get(topic) ?? 0),
      0
    );
    return {
      area: area.area,
      marks: area.marks,
      claimTopics: area.claimTopics,
      claimCount,
      evidenceStatus: claimCount > 0 ? "evidence" : "gap"
    };
  });

  const path = [];
  for (const stage of stages) {
    for (const lesson of stage.lessons) {
      if (!path.includes(lesson.lessonId)) path.push(lesson.lessonId);
    }
  }

  const tally = (rows, key) =>
    rows.reduce((acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] ?? 0) + 1 }), {});

  return {
    schemaVersion: schemaMeta.exportSchemaVersion ?? "1.0.0",
    generatedAt: new Date().toISOString(),
    courseId: course.courseId,
    title: course.title,
    summary: course.summary,
    alignment: course.alignment,
    parts: course.parts,
    stages,
    path,
    practicalExercises,
    theoryAreas,
    summaryCounts: {
      stages: stages.length,
      pathLessons: path.length,
      stageCoverage: tally(stages, "coverage"),
      practicalExerciseStatus: tally(practicalExercises, "status")
    }
  };
}
