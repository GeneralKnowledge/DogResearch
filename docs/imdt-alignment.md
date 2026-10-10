# IMDT-aligned owner crash course

Source of truth: `kb/meta/crash-course.json`. Export: `dist/good-dog-crash-course.json`.

## What this is

A short, ordered path for owners (10 stages in 3 parts) whose structure follows the **public** outlines IMDT publishes for its trainer pathway: a 2-day theory course, a 4-day practical course, and a membership assessment. It is a coverage checklist plus an ordering, not a copy of IMDT teaching. Lesson wording stays paraphrased from UK welfare-charity sources.

KindTrail is independent and not affiliated with IMDT. The export carries that disclaimer, and owner-facing stage titles do not name IMDT.

## How the parts map

| Part | Stages | IMDT analogue |
|------|--------|---------------|
| Understand your dog | How dogs learn; Read your dog; Puppies and growing up | Theory course topics |
| Practise the skills | Core skills; Coming back and walking nicely; Everyday manners; Handling, vet visits and muzzles | Practical course and the assessed exercises |
| Real life and knowing your limits | When things are hard; Kind methods, equipment and the law; Plan and measure | Consultation, behaviour modification, ethics |

## Coverage against IMDT's assessed practical exercises (v26.1)

| IMDT exercise | Status | Where |
|---------------|--------|-------|
| Down | covered | `lesson-down-basics` |
| Recall | covered | `lesson-recall-basics` |
| Loose lead walking | covered | `lesson-loose-lead` |
| Nose to hand touch | covered | `lesson-hand-touch` |
| Twist/spin | covered | `lesson-spin-trick` |
| Retrieve | partial | `lesson-drop-it-swap` (the drop and swap part only) |
| Mat target | partial | `lesson-settle-mat` (settle, not targeting) |
| Chin rest | research only | one US organisation source; not shown as a lesson |
| Emergency stop | research only | one non-UK source; not shown as a lesson |
| Middle | research only | one commercial source; not shown as a lesson |
| Send around | gap | no usable source found |
| Muzzle training | researched, held | `lesson-muzzle-training` (needs human review, review-016) |

`research_only` means the source is registered and fetched but cannot feed owner text (single non-UK or commercial source). QA fails if a `research_only` exercise lists a lesson, or if a protocol cites a `research_only` source.

## Coverage against the Q&A knowledge areas (marks out of 50)

Operant conditioning (16) and classical conditioning (16) carry most marks. `lesson-how-dogs-learn` now covers rewards, timing, markers and raising difficulty in plain words. Habituation, counter-conditioning and the formal terms stay in the evidence layer, so stage 1 is still marked partial.

## Stage notes after batch 013

- Stage 9 (kind methods, equipment and the law): `lesson-equipment-and-law` covers harness basics and a neutral advisory. Shock-collar status is time-sensitive and held as a documented gap (review-020): the 2023 regulations on legislation.gov.uk are an unmade draft, Wales has banned them since 2010, and a Defra written answer of 27 May 2026 says a consultation is coming.
- Stage 10 (plan and measure): `lesson-plan-and-measure` covers short sessions, a simple diary and a schedule. Session-length advice differs between sources (`disc-007-session-length`, review-023).

## ## Guardrails

- IMDT sources are `paraphrase_ok_pending_legal`, so they cannot feed owner lessons or guides. `review-017` tracks legal confirmation before any public claim that the path "follows" IMDT.
- `lesson-muzzle-training` is `requires_human_review` and not exported (`review-016`).
- QA fails if a pilot lesson is missing from every stage, or a stage references an unknown lesson or claim.

## Suggested next steps

1. Human review of the muzzle protocol, then add it to the pilot list (review-016).
2. Human wording review of the batch 013 low-risk protocols (review-018).
3. Re-check the UK shock-collar position before the equipment lesson is relied on (review-020).
4. Find UK charity or professional-body sources for chin rest, emergency stop, middle, send around and full retrieve (review-022).
5. Legal confirmation for IMDT sources before any public claim that the path follows IMDT (review-017).
