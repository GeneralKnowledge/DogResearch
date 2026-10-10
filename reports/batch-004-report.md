# Batch 004 report — Good Dog knowledge base

**Date:** 2026-10-10  
**Branch:** `cursor/good-dog-kb-foundation-1277`

## Focus

Lead reactivity management and referral paths, puppy socialisation (Dogs Trust), RSPCA leave training (drop gap documented), post-2020 evidence synthesis (2024 scoping + counterconditioning systematic review), optional URL live-check script.

## Sources

| Category | Added |
|----------|------:|
| Dogs Trust (reactive dog, puppy socialisation, Puppy 101 hub) | 3 |
| RSPCA (leave training) | 1 |
| Research (Verbeek 2024 scoping review; 2024 CC systematic review) | 2 |

**Deferred / blocked:** Blue Cross puppy pages (403), ABTC role-standard PDFs (404/Cloudflare — `review-011`).

**Drop training note:** No RSPCA public `drop` URL found; KB records gap claim `claim-kb-gap-rspca-no-drop-page` and pairs RSPCA leave with existing Dogs Trust leave/fair-trade protocols.

## Extractions (batch 004)

| Entity | Added |
|--------|------:|
| Claims | 16 |
| Protocols | 3 |
| Studies | 2 |
| Lessons | 3 |
| Behaviours | 2 |
| Methods (core registry) | 2 |

## Merged totals (after batch 004)

- **43** sources · **80** claims · **14** protocols · **6** studies · **137** catalog entries
- QA: **0 errors, 0 warnings**

## Human review queue (new)

- **review-009:** reactive walk management protocol (referral copy)
- **review-010:** puppy socialisation (vet-specific vaccination timing)
- **review-011:** ABTC role standard PDF ingestion

## Resolved / updated

- **review-004:** partially resolved (`safe-005` + Dogs Trust no-scold on walks)
- **review-005:** partially resolved (2024 reviews added)

## Tooling

- `npm run url-check` — optional HEAD check over merged `canonicalUrl` values (expect some charity/CDN false positives).

## Gaps remaining (batch 005+)

- Blue Cross puppy socialisation (when fetchable)
- ABTC role standard PDFs and practitioner category claims
- APBC/FABC owner handouts (growl, reactivity) — bot protection
- Dedicated mouth **drop** charity page if RSPCA/DT publish one
- CI wiring for `url-check` (non-blocking recommended)

## Next batch recommendation

Noise phobia / fireworks desensitisation (RSPCA/Dogs Trust), resource guarding management sheets, and deeper APBC ingestion when accessible.
