#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { loadMergedRegistry } from "./load-registry.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexDir = join(root, "kb/index");

mkdirSync(indexDir, { recursive: true });

const { sources, claims, protocols } = loadMergedRegistry();
const taxonomy = JSON.parse(
  readFileSync(join(root, "kb/taxonomy/topic-taxonomy.json"), "utf8")
);

const catalog = {
  generatedAt: new Date().toISOString().slice(0, 10),
  searchableEntries: [
    ...sources.map((s) => ({
      id: s.id,
      kind: "source",
      title: s.title,
      url: s.canonicalUrl,
      topics: s.topics,
      extractionStatus: s.extractionStatus,
      publisher: s.publisher
    })),
    ...claims.map((c) => ({
      id: c.id,
      kind: "claim",
      title: c.statement.slice(0, 120) + (c.statement.length > 120 ? "…" : ""),
      topics: [c.topic, ...(c.subtopics ?? [])],
      confidence: c.confidence,
      sourceId: c.supportingSourceId ?? c.studyId
    })),
    ...protocols.map((p) => ({
      id: p.id,
      kind: "protocol",
      title: p.title,
      reviewStatus: p.reviewStatus,
      behaviourIds: p.targetBehaviourIds
    }))
  ]
};

const evidenceIndex = {};
for (const c of claims) {
  const key = c.topic;
  if (!evidenceIndex[key]) evidenceIndex[key] = { scientific: [], professional: [], disputes: [] };
  const bucket =
    c.evidenceChannel === "scientific_research"
      ? "scientific"
      : c.evidenceChannel === "professional_standards"
        ? "professional"
        : "professional";
  evidenceIndex[key][bucket].push(c.id);
}

writeFileSync(join(indexDir, "catalog.json"), JSON.stringify(catalog, null, 2));
writeFileSync(
  join(indexDir, "evidence-index.json"),
  JSON.stringify({ taxonomyId: taxonomy.id, byTopic: evidenceIndex }, null, 2)
);
console.log(`Wrote ${catalog.searchableEntries.length} catalog entries`);
