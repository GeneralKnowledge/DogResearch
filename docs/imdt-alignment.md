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
| Mat target | partial | `lesson-settle-mat` (settle, not targeting) |
| Nose to hand touch | claims only | `claim-dt-target-002-touch-steps` |
| Muzzle training | researched, held | `lesson-muzzle-training` (needs human review) |
| Emergency stop, Send around, Middle, Chin rest, Twist/spin, Retrieve | gap | nearest lessons noted in the JSON |

## Coverage against the Q&A knowledge areas (marks out of 50)

Operant conditioning (16) and classical conditioning (16) carry most marks. The registry now has definitions from NPSA plus Dogs Trust marker and reward claims, but no owner lesson. This is the biggest content gap if the aim is depth on theory.

## Guardrails

- IMDT sources are `paraphrase_ok_pending_legal`, so they cannot feed owner lessons or guides. `review-017` tracks legal confirmation before any public claim that the path "follows" IMDT.
- `lesson-muzzle-training` is `requires_human_review` and not exported (`review-016`).
- QA fails if a pilot lesson is missing from every stage, or a stage references an unknown lesson or claim.

## Suggested next steps (not done)

1. Owner explainer lesson on rewards and associations (operant and classical), from Dogs Trust positive-reinforcement pages.
2. Hand-touch lesson (claims already in registry).
3. Human review of the muzzle protocol, then add to the pilot list.
4. Plan-and-measure lesson tied to `assessment-metrics.json`.
