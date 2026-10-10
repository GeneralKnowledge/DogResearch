# Gap analysis (updated after gap-closure pass + batch 009)

## Coverage by taxonomy category

| Category | Status | Priority next |
|----------|--------|----------------|
| A Behaviour & communication | Stress lesson rebuilt on Blue Cross + PDSA (batch 011) | Displacement depth, PDSA walk stress |
| B Learning theory | Marker + CC registered | APBC/FABC sheets |
| C Training mechanics | DDD skeleton (review-013 open) | Charity stay/generalisation pages |
| D Foundation behaviours | Sit/down/stay/recall/emergency/leave | RSPCA handling URL (Dogs Trust target + handling ingested in batch 011) |
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

## Batch 011 notes

- disc-006: the synthesised DDD order (distance first) conflicts with Dogs Trust stay and target pages (duration first). review-013 stays open.
- Vet/handling education lesson added; hand-target claims added without a new exercise.

## Batch 012 notes

- IMDT-aligned crash course map added (`kb/meta/crash-course.json`, `docs/imdt-alignment.md`): 10 stages, 12 assessed exercises, 6 Q&A areas.
- Biggest remaining gaps vs IMDT outline: owner lesson on operant/classical conditioning, hand touch, emergency stop, chin rest, retrieve, plan-and-measure.
- Muzzle training researched (Dogs Trust, Blue Cross, PDSA) but gated for human review.

## Batch 013 notes

- Gap research against the crash course. Every source was fetched and read before use; search summaries were not trusted (one summary claimed shock-collar regulations were law; the fetched page shows an unmade draft).
- Filled: how dogs learn, hand touch, drop it and swap, spin, equipment and the law, plan and measure. Six new owner lessons, three of them education only. Guides export grows from 8 to 11.
- Not filled: chin rest, emergency stop and middle are `research_only` (single non-UK or commercial source). Send around has no source. Retrieve is partial. Muzzle stays held (review-016).
- New `research_only` display eligibility is honoured by `tag-display-eligibility.mjs` and enforced by QA.
- Battersea drop-it page is corroboration only (`paraphrase_ok_pending_legal`, review-019).
- The RSPCA prong-collar page contains dated legal wording that was not used as a claim (review-021).
- New review items 018 to 023.
