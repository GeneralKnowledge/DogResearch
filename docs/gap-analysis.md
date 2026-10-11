# Gap analysis (updated after owner-path pass + batch 010)

## Coverage by taxonomy category

| Category | Status | Priority next |
|----------|--------|----------------|
| A Behaviour & communication | Stress lesson rebuilt on Blue Cross + PDSA (batch 011) | Displacement depth, PDSA walk stress |
| B Learning theory | Marker + CC registered | APBC/FABC sheets |
| C Training mechanics | DDD skeleton (review-013 open) | Charity stay/generalisation pages |
| D Foundation behaviours | Sit/down/stay/recall/emergency/leave | RSPCA handling URL (Dogs Trust target + handling ingested in batch 011) |
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
- Hand-target and cooperative vet handling were covered later: Dogs Trust target and handling pages in batch 011, hand touch lesson in batch 013. An RSPCA handling URL is still missing.
- Multi-dog households now have a management lesson (`lesson-multi-dog-household`, batch 014). It is not a taking-items protocol.
- Trainer auth (Phase 2 full) not implemented.
- Strict url-check allowlist maintenance.
- Outdoor reward choice (`oq-train-001`) now points at `lesson-outdoor-rewards` (batch 014).

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

## Batch 014 notes

- Gap fill from pages fetched and read in full. Search snippets were not used.
- Added: outdoor reward choice (`lesson-outdoor-rewards`, from the existing Dogs Trust claim), play retrieve (`lesson-play-retrieve`, hold and return only), and a two-dog management lesson (`lesson-multi-dog-household`) as a week 9 branch.
- `lesson-settle-mat` is now an optional week 4 lesson. The crash-course mat-target row stays partial because that lesson is a settle on a blanket, not a send to a mat.
- Not filled: chin rest, middle and send around are still absent from the Dogs Trust, Blue Cross, PDSA and RSPCA indexes that were fetched. Emergency stop stays `research_only`; the PDSA road-safety stop has no body position or distance steps, and the nearest lesson is the stay.
- Retrieve stays partial. Blue Cross describes hold and bring-back, and a throw only after the toy has stopped. It does not describe a release into the hand.
- `disc-006` now cites the RSPCA stay page (duration, then one step). `review-013` and the distance-first skeleton are unchanged.
- `disc-007` now includes Dogs Trust (5 to 10 minutes) and PDSA clicker training (about 10 to 15 minutes, about 2 minutes to charge a click). The course rule stays short sessions that end on a success. The PDSA lie-down line about pressure on the back was not extracted.
- The 27 May 2026 shock-collar written answer timed out again. A 21 January 2026 Commons debate was read. The equipment lesson wording was not changed (`review-020`). New review item 024 covers wording of the batch 014 protocols.
- Muzzle training stays held (`review-016`). The loose-lead export hold stays. IMDT sources stay `paraphrase_ok_pending_legal` (`review-017`).
