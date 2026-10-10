# Gap analysis (updated after gap-closure pass + batch 009)

## Coverage by taxonomy category

| Category | Status | Priority next |
|----------|--------|----------------|
| A Behaviour & communication | Stress lesson + behaviours partial | Displacement depth, PDSA walk stress |
| B Learning theory | Marker + CC registered | APBC/FABC sheets |
| C Training mechanics | DDD skeleton (review-013 open) | Charity stay/generalisation pages |
| D Foundation behaviours | Sit/down/stay/recall/emergency/leave | Dedicated hand-target & RSPCA handling URLs |
| E Puppy/adolescent | Socialisation + adolescent lesson | Blue Cross puppy (403) |
| F Enrichment | Steal/enrichment claims | More protocols |
| G Behaviour problems | Reactive + steal/fireworks exported (advisory) | Clinical noise plans referral-only |
| H Health & boundaries | BVA abnormal behaviour | RCVS pain-behaviour page |
| I Assessment | Metrics anchored to claims; safe-002 export sanitization | Field validation of tiers |
| J Special populations | Rescue settling lesson (batch 009) | Multi-dog household |
| K Ethics/regulation | GOV/DDA; ABTC role synthesis | ABTC role PDFs (review-011) |

## Registry hygiene (addressed)

- Central **review-queue.json** only; duplicate batch reviewItems removed; QA fails on duplicate IDs.
- **displayEligibility** applied to all sources; pilot charities → `paraphrase_ok`.
- Recall/reactive/fireworks protocols → `reviewed_pilot_export` (no new allowlist entries for those).

## Product (addressed)

- **20** exported lessons including stay, emergency recall, reactive, fireworks, rescue, adolescent.
- Advisory messages per lesson; CPD claim paths in export; homework share URLs on `/pro`.
- Convex **metricProgress** schema (optional sync).

## Remaining gaps

- Legal sign-off to promote pending_legal sources (ABTC/APBC/IMDT).
- review-006 alone protocol, review-010 puppy, review-013 DDD still open.
- Trainer auth (Phase 2 full) not implemented.
- Strict url-check allowlist maintenance.
