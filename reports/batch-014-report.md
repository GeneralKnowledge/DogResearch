# Batch 014 report: UK charity gap fill

## Scope

Additive. Earlier batches were not rewritten except `disc-006` and `disc-007`, which were updated in place, and review items 020, 022 and 023, which were updated in place. Search snippets were not used as sources.

## Added

- `kb/registry/batches/batch-014.json`: 8 sources, 11 claims, 3 behaviours, 3 protocols, 3 lessons and relationships.
- `cache/sources/batch-014-manifest.json`.
- Lessons: `lesson-outdoor-rewards` (education), `lesson-play-retrieve` (skill, `ex-kb-play-retrieve`), `lesson-multi-dog-household` (management, week 9 branch).
- `lesson-settle-mat` is now an optional week 4 lesson. It was already in the registry.
- Review item `review-024`.

## What the pages supported

| Gap | Fetched page | Result |
|-----|--------------|--------|
| Outdoor rewards | Existing Dogs Trust positive-reinforcement claim | New education lesson. `oq-train-001` points at it. Taught in week 1 and again, optionally, in weeks 6 and 7. |
| Play retrieve | Blue Cross, How to play with your dog | Hold, pickup, bring back, then throw only after the toy has stopped. No release into the hand, so retrieve stays partial. |
| Tidy-up | Dogs Trust tidy-up | Registered as a get-it, drop and box chain. Not used to fill the missing give. |
| Two dogs | Dogs Trust introducing a dog, and resource guarding between dogs | One management lesson. Separate spaces, separate meals and chews, stop if there is a lunge or a snap. Not a taking-items protocol. |
| Mat settle versus mat target | Existing settle lesson; Dogs Trust target page is already the hand touch | Settle is scheduled as optional week 4. Mat target stays partial. |
| Emergency stop | PDSA road safety | Curb sit and wait is a real sequence. The emergency "stop" section has no body position, marker or distance steps, so no lesson was added. Nearest lesson is `lesson-stay-basics`. |
| Duration before distance | RSPCA stay (existing source, re-read) | New claim beside `disc-006`. The distance-first skeleton and `review-013` were left as they are. |
| Chin rest, middle, send around | Dogs Trust, Blue Cross, PDSA and RSPCA indexes | None of those indexes list the exercises. They stay excluded. |
| Session length | Dogs Trust top 10, PDSA clicker, RSPCA national index | Ranges disagree further. `disc-007` keeps all of them. The course rule stays short sessions that end on a success. |
| Shock collars | 21 January 2026 Commons Hansard | The minister said the Government will consult on a ban because of possible harm. The May 2026 written-answer page timed out again. The equipment lesson wording was not changed. |

## Not extracted

The PDSA clicker page says a lie down can be combined with gentle pressure on the back. That sentence was not made into a claim and is not taught.

## Known limits

- Retrieve is still partial (`review-022`).
- Emergency stop is still `research_only`.
- New protocols are `auto_accepted_low_risk` without human wording review (`review-024`).
- Shock-collar status in England is still not a ban in force (`review-020`).
- Muzzle training stays held (`review-016`). The loose-lead export hold stays. IMDT sources stay pending legal confirmation (`review-017`).
