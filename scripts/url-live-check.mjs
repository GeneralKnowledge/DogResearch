#!/usr/bin/env node
/**
 * Optional HEAD/GET check for source URLs in the merged registry.
 * Usage: npm run url-check
 */
import { loadMergedRegistry } from "./load-registry.mjs";

/** Hosts or URL substrings that may return 403/404 in CI but are known-good for humans. */
const ALLOWLIST = [
  "abtc.org.uk",
  "bluecross.org.uk",
  "rspca.org.uk/adviceandwelfare/pets/dogs/training/fireworks",
  "apbc.org.uk",
  "doi.org"
];

const { sources } = loadMergedRegistry();
const errors = [];
const warnings = [];
const skipped = [];

function isAllowlisted(url) {
  return ALLOWLIST.some((frag) => url.includes(frag));
}

for (const source of sources) {
  const url = source.canonicalUrl;
  if (!url || !url.startsWith("http")) {
    warnings.push(`${source.id}: missing or non-http canonicalUrl`);
    continue;
  }
  if (isAllowlisted(url)) {
    skipped.push(`${source.id}: allowlisted (${url})`);
    continue;
  }
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "GoodDog-KB-url-check/1.0" }
    });
    if (response.status === 405 || response.status === 403 || response.status === 404) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "GoodDog-KB-url-check/1.0" }
      });
    }
    if (response.status >= 400) {
      errors.push(`${source.id}: HTTP ${response.status} for ${url}`);
    }
  } catch (cause) {
    warnings.push(`${source.id}: fetch failed (${cause instanceof Error ? cause.message : cause})`);
  }
}

console.log("URL live-check");
console.log("==============");
console.log(`Checked: ${sources.length} sources (${skipped.length} allowlisted skip)`);
console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
for (const e of errors) console.log(`  ERROR: ${e}`);
for (const w of warnings) console.log(`  WARN: ${w}`);

if (errors.length > 0) process.exit(1);
process.exit(0);
