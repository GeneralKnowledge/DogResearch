# Batch 011 — research refinement (stress, handling, hand target)

**Date:** 2026-10-10

## Focus

Replace placeholder or mismatched content with primary-source claims, without removing any existing entity.

## Deliverables

| Entity | Added |
|--------|------:|
| Sources | 3 (Dogs Trust target training, how to handle, happy vet visits) |
| Claims | 13 (target x2, handling x3, vet x3, Blue Cross stress x3, PDSA stress x2) |
| Protocols | 2 (recognise stress signals; handling and vet prep) |
| Lessons | 1 (lesson-vet-handling-prep, education only) |
| Disagreements | disc-006 (DDD order vs charity duration-first order) |
| Owner-question categories | 2 (stress/body language; handling/vet) |
| Review items | review-014 (resolved), review-015 (partially resolved) |

## Refinements to existing entries (in place, nothing removed)

- `lesson-read-your-dog-stress` was derived from the DDD protocol although it teaches stress signals. It now derives from `proto-recognise-stress-signals` and cites the new Blue Cross and PDSA claims.
- `claim-dt-ddd-001-order-charity` gains a limitation pointing to disc-006.
- `safe-005` gains two more rationale claims.
- review-013 raised to medium priority with the contradiction noted.

## Export fixes

- `toOwnerVoice` no longer produces "a your dog" or "the your dog".
- `safe-005` is rendered as a full owner sentence in guides.
- Good Dog guides export now has 8 entries.

## Not verified / open

- Content is paraphrased from charity pages and has not been reviewed by a qualified behaviourist.
- Hand-target lesson not added (would change the exercise crosswalk); claims only.
- Older-dog and medical-adjacent content not added.
