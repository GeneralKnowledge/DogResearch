# Batch 002 report — Good Dog knowledge base

**Date:** 2026-10-10  
**Branch:** `cursor/good-dog-kb-foundation-1277`

## Infrastructure

- Added `kb/registry/batches/batch-002.json` for incremental, resumable extractions.
- `scripts/load-registry.mjs` merges core registry + batch files for QA and catalog builds.

## Sources

| Status | Count (batch 002) |
|--------|------------------:|
| New charity / standards sources | 14 |
| Rejected | 0 |

Publishers added: Dogs Trust (6 pages), RSPCA (children), PDSA (2), Blue Cross (2), ABTC (PDFs), PLOS ONE (Vieira de Castro 2020).

## Topics covered

- **D:** leave it, stay mechanics, loose-lead walking
- **G/H:** separation prevention vs anxiety management, vet-first referral, child–dog safety
- **F:** enrichment and rest balance (PDSA)
- **A:** stress signs, warning signals (Blue Cross)
- **K:** ABTC aversive equipment/methods list; experimental welfare evidence (2020)

## Extractions (batch 002 only)

| Entity | Added |
|--------|------:|
| Claims | 21 |
| Protocols | 3 (leave it, loose lead, alone-time prevention) |
| Studies | 1 |
| Behaviours | 3 |
| Lessons | 2 |
| Safety rules | 3 |
| Disagreements | 1 |

## Cumulative totals (merged)

Run `npm run qa` after merge — expect ~25 sources, ~48 claims, ~6 protocols, 2 studies.

## Safety / review

- `proto-alone-prevention-dt` flagged **requires_human_review** (must not substitute for clinical separation plans).
- Growling / warning-signal rules now backed by Blue Cross claims (`safe-005`, `safe-007`).
- ABTC aversive list captured as filter rules (`safe-008`).

## Conflicts & gaps

- **disc-003:** Mixed-method schools vs reward-only on some welfare metrics.
- Still thin: puppy socialisation detail, lead reactivity, body language depth, UK law verification, Blue Cross/PDSA protocol-level extractions.

## Next batch (003)

1. Dogs Trust: down, emergency recall, settle, focus (full claim pass on registered URLs).
2. RSPCA down/stay/recall PDF guides.
3. Systematic review search (post-2020) for training methods meta-analysis.
4. CFSG / official microchipping ID law sources for `claim-dt-recall-005-uk-id-law`.
