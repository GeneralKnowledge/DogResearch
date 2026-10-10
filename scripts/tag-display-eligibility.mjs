#!/usr/bin/env node
/**
 * Ensure displayEligibility on all registry sources (core + batches).
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = join(root, "kb/registry");

function resolveEligibility(source) {
  const id = source.id ?? "";
  const pub = (source.publisher ?? "").toLowerCase();
  const type = source.sourceType ?? "";
  if (source.displayEligibility === "research_only") return "research_only";
  if (id.startsWith("study-") || type.includes("peer_reviewed") || type.includes("primary_research")) {
    return "research_only";
  }
  if (
    pub.includes("dogs trust") ||
    pub.includes("rspca") ||
    pub.includes("pdsa") ||
    pub.includes("blue cross") ||
    pub.includes("gov.uk") ||
    pub.includes("legislation") ||
    pub.includes("uk government") ||
    source.licence === "open_government_licence" ||
    source.licence === "legislation_open"
  ) {
    return "paraphrase_ok";
  }
  if (pub.includes("bva") || pub.includes("british veterinary")) {
    return "paraphrase_ok";
  }
  return "paraphrase_ok_pending_legal";
}

function applyTag(source) {
  source.displayEligibility = resolveEligibility(source);
  return source;
}

const sourcesPath = join(registry, "sources.json");
const sourcesDoc = JSON.parse(readFileSync(sourcesPath, "utf8"));
for (const s of sourcesDoc.sources) applyTag(s);
writeFileSync(sourcesPath, JSON.stringify(sourcesDoc, null, 2) + "\n");

const batchDir = join(registry, "batches");
for (const file of readdirSync(batchDir).filter((f) => f.endsWith(".json"))) {
  const path = join(batchDir, file);
  const batch = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(batch.sources)) continue;
  for (const s of batch.sources) applyTag(s);
  writeFileSync(path, JSON.stringify(batch, null, 2) + "\n");
}

console.log("Applied displayEligibility on core and batch sources.");
