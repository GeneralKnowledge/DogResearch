#!/usr/bin/env node
/**
 * Optional HEAD/GET check for source URLs in the merged registry.
 * Usage: npm run url-check
 */
import { loadMergedRegistry } from "./load-registry.mjs";

const { sources } = loadMergedRegistry();
const errors = [];
const warnings = [];

for (const source of sources) {
  const url = source.canonicalUrl;
  if (!url || !url.startsWith("http")) {
    warnings.push(`${source.id}: missing or non-http canonicalUrl`);
    continue;
  }
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "GoodDog-KB-url-check/1.0" }
    });
    if (response.status >= 400) {
      errors.push(`${source.id}: HTTP ${response.status} for ${url}`);
    }
  } catch (cause) {
    warnings.push(`${source.id}: fetch failed (${cause instanceof Error ? cause.message : cause})`);
  }
}

console.log("URL live-check");
console.log("==============");
console.log(`Checked: ${sources.length} sources`);
console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
for (const e of errors) console.log(`  ERROR: ${e}`);
for (const w of warnings) console.log(`  WARN: ${w}`);

if (errors.length > 0) process.exit(1);
