# IMDT-aligned owner crash course

Source of truth: `kb/meta/crash-course.json`. Export: `dist/good-dog-crash-course.json`.

## What this is

A short, ordered path for owners (10 stages in 3 parts) whose structure follows the **public** outlines IMDT publishes for its trainer pathway: a 2-day theory course, a 4-day practical course, and a membership assessment. It is a coverage checklist plus an ordering, not a copy of IMDT teaching. Lesson wording stays paraphrased from UK welfare-charity sources.

KindTrail is independent and not affiliated with IMDT. The export carries that disclaimer, and owner-facing stage titles do not name IMDT.

The ten-week timetable is [`kb/meta/uk-lite-course.json`](../kb/meta/uk-lite-course.json), written up in [`learning-curriculum.md`](learning-curriculum.md). This file stays the coverage checklist. The timetable is an owner course taught across weeks. It is not the IMDT courses and not a qualification.

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
| Retrieve | partial | `lesson-drop-it-swap` and `lesson-play-retrieve` (hold and bring-back). Blue Cross does not describe a release into the hand, so this stays partial. |
| Mat target | partial | `lesson-settle-mat` is a calm settle on a blanket, scheduled as an optional week 4 lesson. It is not a send to a mat. |
| Chin rest | research only | no UK charity step page; the batch 014 indexes do not list it |
| Emergency stop | research only | PDSA's road-safety stop has no body position or distance steps. Nearest lesson is `lesson-stay-basics`. Not shown as its own lesson. |
| Middle | research only | no UK charity step page; the batch 014 indexes do not list it |
| Send around | gap | no step page; the batch 014 indexes do not list it |
| Muzzle training | researched, held | `lesson-muzzle-training` (needs human review, review-016) |

`research_only` means the source is registered and fetched but cannot feed owner text (single non-UK or commercial source). QA fails if a `research_only` exercise lists a lesson, or if a protocol cites a `research_only` source.

## Coverage against the Q&A knowledge areas (marks out of 50)

Operant conditioning (16) and classical conditioning (16) carry most marks. `lesson-how-dogs-learn` now covers rewards, timing, markers and raising difficulty in plain words. Habituation, counter-conditioning and the formal terms stay in the evidence layer, so stage 1 is still marked partial.

## Stage notes after batch 013

- Stage 9 (kind methods, equipment and the law): `lesson-equipment-and-law` covers harness basics and a neutral advisory. Shock-collar status is time-sensitive and held as a documented gap (review-020): the 2023 regulations on legislation.gov.uk are an unmade draft, Wales has banned them since 2010, and a Defra written answer of 27 May 2026 says a consultation is coming.
- Stage 10 (plan and measure): `lesson-plan-and-measure` covers short sessions, a simple diary and a schedule. Session-length advice differs between sources (`disc-007-session-length`, review-023).

## Stage notes after batch 014

- Outdoor rewards: `lesson-outdoor-rewards` uses the existing Dogs Trust claim about raising treat value when a busier place makes responding hard. It is in week 1 and again, optionally, in the recall weeks.
- Retrieve stays partial. `lesson-play-retrieve` teaches hold and return from the Blue Cross play page. A release into the hand is not in those steps.
- Two-dog households: `lesson-multi-dog-household` is a week 9 branch. Guarding stays a referral, not a taking-items protocol.
- Mat settle is now an optional week 4 lesson. The mat-target row stays partial because settle is not a send to a mat.
- Emergency stop stays `research_only`. The PDSA road-safety page was read and was too thin to teach from.
- `disc-006` now includes the RSPCA stay order (duration, then one step of distance). The distance-first skeleton and `review-013` are unchanged.
- `disc-007` now includes Dogs Trust 5 to 10 minutes and PDSA clicker ranges. The course still does not pick one number.
- Shock collars: the May 2026 written-answer page timed out again. A 21 January 2026 Commons debate was read. The equipment lesson wording was not changed (`review-020`).

## ## Guardrails

- IMDT sources are `paraphrase_ok_pending_legal`, so they cannot feed owner lessons or guides. `review-017` tracks legal confirmation before any public claim that the path "follows" IMDT.
- `lesson-muzzle-training` is `requires_human_review` and not exported (`review-016`).
- QA fails if a pilot lesson is missing from every stage, or a stage references an unknown lesson or claim.
- QA also fails if the UK Lite timetable cites an unknown lesson, schedules a research-only, held, or gap exercise, or leaves a pilot lesson out of every week, branch, and not-in-course entry.

## Suggested next steps

1. Human review of the muzzle protocol, then add it to the pilot list (review-016).
2. Human wording review of the batch 013 low-risk protocols (review-018).
3. Re-check the UK shock-collar position before the equipment lesson is relied on (review-020).
4. Find UK charity or professional-body sources for chin rest, emergency stop, middle, send around and full retrieve (review-022).
5. Legal confirmation for IMDT sources before any public claim that the path follows IMDT (review-017).
