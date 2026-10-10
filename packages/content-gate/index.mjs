import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  loadMergedRegistry,
  getLessonBundle,
  loadPublishConfig,
  loadOwnerQuestions,
  loadAssessmentMetrics,
  getRepoRoot
} from "@gooddog/kb-core";

const OFF_LEAD_RE = /\boff[- ]?lead\b/gi;

/**
 * @param {import('@gooddog/kb-core/types').Protocol} protocol
 * @param {ReturnType<typeof loadPublishConfig>} config
 */
export function isProtocolPublishable(protocol, config) {
  if (config.allowProtocolsDespiteReview?.includes(protocol.id)) {
    return true;
  }
  if (
    config.excludeProtocolReviewStatus?.includes(protocol.reviewStatus ?? "")
  ) {
    return false;
  }
  return true;
}

/**
 * @param {import('@gooddog/kb-core/types').Source} source
 * @param {ReturnType<typeof loadPublishConfig>} config
 */
export function isSourceDisplayEligible(source, config) {
  const allowed = config.requireDisplayEligibility;
  if (!allowed?.length) return true;
  const tag = source.displayEligibility ?? "paraphrase_ok_pending_legal";
  if (tag === "research_only") return false;
  return allowed.includes(tag);
}

/**
 * @param {Record<string, boolean>} metricProgress
 */
export function isOffLeadUnlocked(metricProgress) {
  return (
    metricProgress["metric-recall-long-line-5m"] === true &&
    metricProgress["metric-recall-long-line-10m"] === true
  );
}

/** Enforces safe-002: no off-lead promotion until tier-2 recall metrics met. */
export function blocksOffLeadPromotion(metricProgress) {
  return !isOffLeadUnlocked(metricProgress);
}

/**
 * @param {import('@gooddog/kb-core/types').Protocol} protocol
 * @param {boolean} applySafe002
 */
export function sanitizeProtocolForExport(protocol, applySafe002 = true) {
  const steps = (protocol.steps ?? []).map((step) => {
    let instruction = step.instruction;
    let progressCriteria = step.progressCriteria;
    if (applySafe002) {
      instruction = instruction.replace(
        OFF_LEAD_RE,
        "off-lead (only after tier-2 long-line recall—see progression tiers)"
      );
      if (progressCriteria) {
        progressCriteria = progressCriteria.replace(
          OFF_LEAD_RE,
          "long-line recall criteria met first"
        );
      }
    }
    return { ...step, instruction, progressCriteria };
  });

  let safetyPrecautions = [...(protocol.safetyPrecautions ?? [])];
  if (applySafe002) {
    safetyPrecautions = safetyPrecautions.map((p) =>
      typeof p === "string"
        ? p.replace(
            OFF_LEAD_RE,
            "off-lead only after tier-2 long-line recall metrics"
          )
        : p
    );
  }

  return {
    id: protocol.id,
    title: protocol.title,
    intendedOutcome: protocol.intendedOutcome,
    steps,
    reviewStatus: protocol.reviewStatus,
    referralRequirements: protocol.referralRequirements ?? [],
    safetyPrecautions,
    safe002Sanitized: applySafe002
  };
}

/**
 * @param {string} lessonId
 * @param {ReturnType<typeof loadPublishConfig>} config
 */
function getAdvisoryForLesson(lessonId, config) {
  const messages = config.advisoryMessages ?? {};
  const message = messages[lessonId];
  const flagged = config.advisoryLessonIds?.includes(lessonId) ?? false;
  if (!message && !flagged) {
    return { advisory: false, advisoryMessage: null };
  }
  return {
    advisory: true,
    advisoryMessage:
      message ??
      "This lesson includes health or behaviour topics—follow professional guidance when unsure."
  };
}

export function isLessonInPilot(lesson, config) {
  if (config.excludedLessonIds?.includes(lesson.id)) {
    return false;
  }
  if (config.pilotLessonIds?.includes(lesson.id)) {
    return true;
  }
  return lesson.publishedToApp === true;
}

/**
 * @param {boolean} [previewMode]
 */
export function buildPublishableBundle(previewMode = false) {
  const registry = loadMergedRegistry();
  const config = loadPublishConfig();
  const ethicsClaimIds = new Set(
    registry.safetyRules.flatMap((r) => r.rationaleClaimIds ?? [])
  );

  const lessons = [];
  const skipped = [];

  for (const lessonId of config.pilotLessonIds ?? []) {
    if (config.excludedLessonIds?.includes(lessonId)) {
      skipped.push({ lessonId, reason: "excluded_by_config" });
      continue;
    }

    const bundle = getLessonBundle(lessonId);
    if (!bundle) {
      skipped.push({ lessonId, reason: "missing_bundle" });
      continue;
    }

    const { lesson, protocol, sources: bundleSources } = bundle;

    if (lesson.traceabilityStatus !== "complete" && !previewMode) {
      skipped.push({ lessonId, reason: "traceability_incomplete" });
      continue;
    }

    if (!previewMode && !isProtocolPublishable(protocol, config)) {
      skipped.push({
        lessonId,
        reason: "protocol_requires_human_review",
        protocolId: protocol.id
      });
      continue;
    }

    if (!previewMode && !isLessonInPilot(lesson, config)) {
      skipped.push({ lessonId, reason: "not_in_pilot" });
      continue;
    }

    if (
      !previewMode &&
      bundleSources.some((s) => !isSourceDisplayEligible(s, config))
    ) {
      skipped.push({ lessonId, reason: "source_display_not_eligible" });
      continue;
    }

    const advisoryMeta = getAdvisoryForLesson(lessonId, config);
    lessons.push({
      ...bundle,
      ...advisoryMeta
    });
  }

  const modules = groupByModule(lessons.map((l) => l.lesson));
  const assessmentMetrics = loadAssessmentMetrics();
  const catalogSearch = loadCatalogSearchIndex();
  const ownerQuestions = loadOwnerQuestions();
  const professionalRoleClaims = registry.claims
    .filter((c) =>
      ["claim-abtc-roles-001-boundaries", "claim-rspca-003-abtc-trainer", "claim-bva-001-pain-behaviour"].includes(
        c.id
      )
    )
    .map((c) => ({
      id: c.id,
      statement: c.statement,
      topic: c.topic
    }));

  const cpdPaths = buildCpdPaths(registry);

  return {
    generatedAt: new Date().toISOString(),
    productName: config.productName,
    previewMode,
    ethics: {
      disclaimer:
        "KindTrail is an independent UK training guidance product. It is not affiliated with or endorsed by the Institute of Modern Dog Trainers (IMDT Ltd). Content is paraphrased from registered sources in our research knowledge base.",
      safetyRules: registry.safetyRules.map((r) => ({
        id: r.id,
        title: r.title,
        rule: r.rule,
        referralText: r.referralText,
        severity: r.severity
      })),
      supportingClaims: registry.claims
        .filter((c) => ethicsClaimIds.has(c.id))
        .map((c) => ({
          id: c.id,
          statement: c.statement,
          sourceId: c.supportingSourceId ?? c.studyId
        }))
    },
    referrals: buildReferrals(registry),
    professionalRoles: professionalRoleClaims,
    assessmentMetrics,
    catalogSearch,
    cpdPaths,
    modules,
    lessons: lessons.map((entry) => {
      const recallRelated =
        entry.lesson.id.includes("recall") ||
        entry.protocol.id.includes("recall");
      const applySafe002 = recallRelated;
      return {
        lesson: {
          id: entry.lesson.id,
          title: entry.lesson.title,
          summary: entry.lesson.summary,
          topic: entry.lesson.topic,
          goodDogModule: entry.lesson.goodDogModule,
          educationOnly: entry.lesson.educationOnly === true
        },
        protocol: sanitizeProtocolForExport(entry.protocol, applySafe002),
        claims: entry.claims.map((c) => ({
          id: c.id,
          statement: c.statement,
          confidence: c.confidence,
          sourceId: c.supportingSourceId ?? c.studyId
        })),
        sources: entry.sources
          .filter((s) => isSourceDisplayEligible(s, config))
          .map((s) => ({
            id: s.id,
            title: s.title,
            url: s.canonicalUrl,
            publisher: s.publisher,
            displayEligibility: s.displayEligibility ?? "paraphrase_ok_pending_legal"
          })),
        advisory: entry.advisory,
        advisoryMessage: entry.advisoryMessage
      };
    }),
    ownerQuestions,
    skipped
  };
}

/** @param {import('@gooddog/kb-core/types').Lesson[]} lessonList */
function groupByModule(lessonList) {
  /** @type {Record<string, { id: string; title: string; lessonIds: string[] }>} */
  const map = {
    foundation_skills: {
      id: "foundation_skills",
      title: "Foundation skills",
      lessonIds: []
    },
    life_skills: { id: "life_skills", title: "Life skills", lessonIds: [] },
    puppy: { id: "puppy", title: "Puppy", lessonIds: [] },
    behaviour_support: {
      id: "behaviour_support",
      title: "Behaviour support",
      lessonIds: []
    }
  };

  for (const lesson of lessonList) {
    const mod = map[lesson.goodDogModule];
    if (mod) mod.lessonIds.push(lesson.id);
  }

  return Object.values(map).filter((m) => m.lessonIds.length > 0);
}

/** @param {import('@gooddog/kb-core/types').MergedRegistry} registry */
function buildReferrals(registry) {
  const abtcClaim = registry.claims.find((c) => c.id === "claim-rspca-003-abtc-trainer");
  const vetClaim = registry.claims.find((c) => c.id === "claim-dt-reactive-002-vet-check-first");
  return {
    abtcRegister: {
      title: "Find an ABTC-registered trainer",
      body: abtcClaim?.statement ?? "Look for ABTC-registered training instructors for ethical, welfare-focused help.",
      url: "https://abtc.org.uk/owners/"
    },
    vetFirst: {
      title: "See your vet first",
      body:
        vetClaim?.statement ??
        "Medical issues can affect behaviour. Ask your vet to rule out pain or illness before behaviour training."
    },
    dogsTrustBehaviourLine: {
      title: "Dogs Trust Behaviour Support Line",
      body: "Free telephone advice for UK dog owners struggling with behaviour.",
      url: "https://www.dogstrust.org.uk/dog-advice/understanding-your-dog/finding-behaviour-and-training-support"
    }
  };
}

function buildCpdPaths(registry) {
  try {
    const raw = JSON.parse(
      readFileSync(join(getRepoRoot(), "kb/index/evidence-index.json"), "utf8")
    );
    const paths = [];
    for (const [topic, bucket] of Object.entries(raw.byTopic ?? {})) {
      const claimIds = [
        ...(bucket.professional ?? []),
        ...(bucket.scientific ?? [])
      ].slice(0, 8);
      if (!claimIds.length) continue;
      paths.push({
        topic,
        claimIds,
        claims: claimIds
          .map((id) => registry.claims.find((c) => c.id === id))
          .filter(Boolean)
          .map((c) => ({ id: c.id, statement: c.statement }))
      });
    }
    return paths.sort((a, b) => b.claims.length - a.claims.length).slice(0, 12);
  } catch {
    return [];
  }
}

function loadCatalogSearchIndex() {
  const entries = [];
  try {
    const raw = JSON.parse(
      readFileSync(join(getRepoRoot(), "kb/index/catalog.json"), "utf8")
    );
    for (const e of raw.searchableEntries ?? []) {
      entries.push({
        id: e.id,
        kind: e.kind,
        title: e.title,
        topics: e.topics ?? [],
        module: e.goodDogModule ?? null
      });
    }
  } catch {
    /* catalog optional at export time */
  }

  for (const cat of loadOwnerQuestions()) {
    for (const q of cat.questions ?? []) {
      entries.push({
        id: q.id,
        kind: "owner_question",
        title: q.text,
        topics: [cat.id],
        module: null
      });
    }
  }

  return entries;
}

/** @param {string} text */
export function violatesNoAversiveRule(text) {
  const blocked = [
    /\bshock collar\b/i,
    /\bchoke chain\b/i,
    /\bprong\b/i,
    /\balpha roll\b/i,
    /\bhit(ting)?\s+(your\s+)?dog\b/i
  ];
  return blocked.some((re) => re.test(text));
}
