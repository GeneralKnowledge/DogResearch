# Gap analysis (updated after owner-path pass + batch 010)

## Coverage by taxonomy category

| Category | Status | Priority next |
|----------|--------|----------------|
| A Behaviour & communication | Stress lesson + behaviours partial | Displacement depth, PDSA walk stress |
| B Learning theory | Marker + CC registered | APBC/FABC sheets |
| C Training mechanics | DDD skeleton (review-013 open) | Charity stay/generalisation pages |
| D Foundation behaviours | Sit/down/stay/recall/emergency/leave | Dedicated hand-target & RSPCA handling URLs |
| E Puppy/adolescent | Socialisation + adolescent lesson | Blue Cross puppy (403) |
| F Enrichment | Steal/enrichment claims | More protocols |
| G Behaviour problems | Reactive, steal, fireworks, and alone-time prevention exported (advisory) | Clinical noise and separation plans stay referral-only |
| H Health & boundaries | BVA abnormal behaviour | RCVS pain-behaviour page |
| I Assessment | Metrics anchored to claims; safe-002 export sanitization | Field validation of tiers |
| J Special populations | Rescue settling lesson (batch 009) | Multi-dog household |
| K Ethics/regulation | GOV/DDA; ABTC role synthesis | ABTC role PDFs (review-011) |

## Registry hygiene (addressed)

- Central **review-queue.json** only; duplicate batch reviewItems removed; QA fails on duplicate IDs.
- **displayEligibility** applied to all sources; pilot charities → `paraphrase_ok`.
- Recall/reactive/fireworks protocols → `reviewed_pilot_export` (no new allowlist entries for those).

## Product (addressed)

- **21** exported lessons including stay, emergency recall, reactive, fireworks, rescue, adolescent, and alone-time prevention.
- Advisory messages per lesson; CPD claim paths in export; homework share URLs on `/pro`.
- Convex **metricProgress** schema (optional sync).

## Owner path (batch 010)

- `proto-alone-prevention-dt` promoted to `reviewed_pilot_export` as prevention only. Step 3 and the lesson advisory keep clinical separation anxiety on the referral path (`review-006` resolved).
- Owner questions for published lessons link through to the player; “find a trainer” links to `/referrals`.
- Catalog search indexes lessons, so titles such as “stay” open the player.
- KindTrail shows step progress on learning paths, and `?homework=1` is visible in the lesson player.

## Remaining gaps

- Legal sign-off to promote pending_legal sources (ABTC/APBC/IMDT).
- review-010 puppy and review-013 DDD still open.
- Hand-target and cooperative vet handling still lack dedicated charity URLs (batch 009 placeholders).
- Multi-dog household (taxonomy J) has no protocol yet.
- Trainer auth (Phase 2 full) not implemented.
- Strict url-check allowlist maintenance.
- Outdoor reward choice (`oq-train-001`) has no matching lesson.
