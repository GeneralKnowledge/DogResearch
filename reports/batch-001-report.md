# Batch 001 report — Good Dog knowledge base

**Date:** 2026-10-10  
**Branch:** `cursor/good-dog-kb-foundation-1277`

## Sources

| Status | Count | Notes |
|--------|------:|-------|
| Accepted & extracted | 8 | IMDT, ABTC (partial), Dogs Trust (4), RSPCA (3) |
| Accepted & registered | 2 | Dogs Trust name training; escaping page partial |
| Primary research (abstract) | 1 | Hiby et al. 2004 |
| Rejected | 0 | — |
| Awaiting review | 2 | ABTC aversive list; UK ID law claim |

## Topics touched

- K Ethics (IMDT, ABTC, RSPCA trainer selection)
- B Learning theory (marker, +R)
- C Mechanics (reinforcement scheduling, sessions)
- D Foundations (sit, recall, name prerequisite)
- G Management (unreliable recall)
- Scientific channel (owner survey correlations)

## Extractions

| Entity | Created |
|--------|--------:|
| Claims | 27 |
| Protocols | 3 |
| Lessons (draft) | 3 |
| Safety rules | 5 |
| Disagreements | 2 |
| Owner-question nodes | 4 questions in 2 categories |

## Deduplication

- IMDT ethics URL mirror (`code-of-ethics.html`) recorded as alternate only.

## Conflicts & gaps

- **Disc-001:** Hiby discussion nuance vs IMDT absolute avoidance of +/-P and +/-R as tools.
- **Disc-002:** Owner-reported outcomes vs causal welfare claims.
- Large taxonomy areas empty (enrichment, puppy detail, clinical behaviour) — see `docs/gap-analysis.md`.

## Safety review

- Recall protocol flagged **requires_human_review** before app publish.
- No aversive protocols added; RSPCA/IMDT/ABTC alignment preserved.

## QA

Run: `npm run catalog && npm run qa` — must pass with zero errors.

## Next batch (recommended)

See gap analysis: Blue Cross/PDSA, ABTC leaflet, remaining Dogs Trust foundation guides, newer systematic reviews.
