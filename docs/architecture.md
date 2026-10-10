# Good Dog knowledge base architecture

This repository holds a **structured, auditable research library** for the Good Dog app. It is not a website scraper dump: content is decomposed into **sources**, **atomic claims**, **protocols**, **safety rules**, and explicit **relationships**, with provenance preserved end-to-end.

## Design principles

- Aligns with **IMDT** force-free, science-based ethics; ABTC and UK welfare charity guidance are primary professional inputs.
- **Scientific**, **professional**, **practical**, and **owner-reported** channels stay separate in metadata (`evidenceChannel`).
- Copyright-respecting: store metadata and **short permitted excerpts or paraphrases**, not full articles.
- **Disagreement** is recorded rather than flattened into false consensus.

## Directory layout

| Path | Purpose |
|------|---------|
| `kb/taxonomy/topic-taxonomy.json` | Hierarchical subject taxonomy (A–K) |
| `kb/registry/*.json` | Core entity stores (batch 001 baseline) |
| `kb/registry/batches/batch-NNN.json` | Incremental extractions merged at QA/catalog time |
| `kb/registry/relationships.json` | Typed edges between entity IDs |
| `kb/index/catalog.json` | Search-oriented aggregate (generated) |
| `kb/index/evidence-index.json` | Claims grouped by topic and evidence type |
| `cache/sources/` | Fetch cache metadata per batch (not full HTML) |
| `scripts/qa-check.mjs` | Automated QA gates |
| `reports/` | Batch completion reports |

## Entity IDs

Stable prefixes:

- `src-` sources
- `study-` peer-reviewed / systematic works
- `claim-` atomic claims
- `proto-` training protocols
- `beh-` target behaviours
- `meth-` training methods
- `lesson-` app lessons (derived, traceable)
- `safe-` safety / referral rules
- `disc-` disagreement register entries
- `oq-` owner question taxonomy nodes
- `review-` human review queue items

## Provenance chain

User-facing recommendations in Good Dog should resolve:

`lesson` → `protocol` / `claim` → `source` or `study`

Relationships live in `kb/registry/relationships.json` and are mirrored on entities where useful (`supportingSourceIds`, etc.).

## Batches

Research runs in **resumable batches**. Each batch:

1. Discovers and registers sources (dedupe mirrors).
2. Extracts claims and protocols only for new/changed sources.
3. Runs `npm run qa`.
4. Appends `reports/batch-NNN-report.md`.

## Human review

High-risk topics (aggression, severe fear, clinical signs) require `reviewStatus: "requires_human_review"` before app publication.
