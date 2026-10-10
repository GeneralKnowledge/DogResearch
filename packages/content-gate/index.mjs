import {
  loadMergedRegistry,
  getLessonBundle,
  loadPublishConfig,
  loadOwnerQuestions
} from "@gooddog/kb-core";

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
 * @param {import('@gooddog/kb-core/types').Lesson} lesson
 * @param {ReturnType<typeof loadPublishConfig>} config
 */
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

    const { lesson, protocol } = bundle;

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

    lessons.push({
      ...bundle,
      advisory: config.advisoryLessonIds?.includes(lessonId) ?? false
    });
  }

  const modules = groupByModule(lessons.map((l) => l.lesson));

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
    modules,
    lessons: lessons.map((entry) => ({
      lesson: entry.lesson,
      protocol: sanitizeProtocol(entry.protocol),
      claims: entry.claims.map((c) => ({
        id: c.id,
        statement: c.statement,
        confidence: c.confidence,
        sourceId: c.supportingSourceId ?? c.studyId
      })),
      sources: entry.sources.map((s) => ({
        id: s.id,
        title: s.title,
        url: s.canonicalUrl,
        publisher: s.publisher
      })),
      advisory: entry.advisory
    })),
    ownerQuestions: loadOwnerQuestions(),
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

/** @param {import('@gooddog/kb-core/types').Protocol} protocol */
function sanitizeProtocol(protocol) {
  return {
    id: protocol.id,
    title: protocol.title,
    intendedOutcome: protocol.intendedOutcome,
    steps: protocol.steps,
    reviewStatus: protocol.reviewStatus,
    referralRequirements: protocol.referralRequirements ?? [],
    safetyPrecautions: protocol.safetyPrecautions ?? []
  };
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
