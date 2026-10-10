# Batch 005 report — noise, guarding management, mouthing/jumping

**Date:** 2026-10-10  
**Branch:** `cursor/good-dog-kb-foundation-1277`

## Focus

Taxonomy G (noise, resource guarding/chasing, jumping/mouthing) and F enrichment links. Management-only framing for steal/chase; fireworks lesson registered but not pilot-exported pending legal pass.

## Sources (live check)

| Source | Status |
|--------|--------|
| Dogs Trust fireworks seasonal | 200 |
| Dogs Trust mouthing/nipping | 200 |
| Dogs Trust stop stealing | 200 |
| Dogs Trust jumping up | 200 |

RSPCA dedicated fireworks/noise URLs returned 404 in automated fetch.

## Extractions

| Entity | Added |
|--------|------:|
| Claims | ~15 |
| Protocols | 4 (incl. mouthing redirect, steal/chase management) |
| Lessons | 4 (3 pilot-ready; fireworks deferred) |
| Safety rules | safe-007-no-confrontational-guarding |

## Product

- KindTrail `behaviour_support` lessons: steal/chase, jumping, mouthing (export after publish-config update).
- Reactive lesson remains excluded (`review-009`).

## QA

Run `npm run qa && npm run catalog && npm run export` after merge.
