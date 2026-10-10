#!/usr/bin/env node
/**
 * Strict URL check: only skips hosts listed in cache/sources/url-allowlist.json
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadMergedRegistry } from "./load-registry.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const allowPath = join(root, "cache/sources/url-allowlist.json");
const allowlist = existsSync(allowPath)
  ? JSON.parse(readFileSync(allowPath, "utf8")).hosts ?? []
  : [];

const { sources } = loadMergedRegistry();
const errors = [];

function allowlisted(url) {
  return allowlist.some((h) => url.includes(h));
}

for (const source of sources) {
  const url = source.canonicalUrl;
  if (!url?.startsWith("http")) continue;
  if (allowlisted(url)) continue;
  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": "GoodDog-KB-url-check-strict/1.0" }
    });
    if ([403, 404, 405].includes(response.status)) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "GoodDog-KB-url-check-strict/1.0" }
      });
    }
    if (response.status >= 400) {
      errors.push(`${source.id}: HTTP ${response.status} ${url}`);
    }
  } catch (cause) {
    errors.push(`${source.id}: ${cause instanceof Error ? cause.message : cause}`);
  }
}

console.log(`Strict URL check: ${errors.length} errors`);
for (const e of errors) console.log(`  ERROR: ${e}`);
if (errors.length > 0) process.exit(1);
