# Good Dog integration

## Purpose

[DogResearch](https://github.com/GeneralKnowledge/DogResearch) is the canonical, CI-verified content source for the [Good Dog](https://github.com/GeneralKnowledge/Good-Dog) dog-training domain. Good Dog keeps the coaching engine, planner, and UI; this repo owns research provenance, safety rules, and export artifacts.

## Artifacts

| File | Contents |
|------|----------|
| `dist/good-dog-domain.json` | Exercises (`ex-*` or `ex-kb-*`), held exports, drafts, management/education modules |
| `dist/good-dog-safety.json` | Safety rules, assessment metrics, aversive text patterns, off-lead promotion gate |

Schema version: `exportSchemaVersion` in [kb/meta/schema-version.json](../kb/meta/schema-version.json), embedded in each export.

## Crosswalk

Pilot skill lessons map to Good Dog exercise ids via [kb/meta/good-dog-exercise-crosswalk.json](../kb/meta/good-dog-exercise-crosswalk.json). QA fails if a pilot skill lesson lacks a crosswalk row or traceability.

## P1-1 loose lead (`proto-loose-lead-dt` / `ex-lead-loose`)

- KB protocol follows Dogs Trust stop-start (forward motion when slack) — tagged `stop_until_slack_then_forward_motion`.
- Crosswalk sets `goodDogExportStatus: hold_until_method_review` so **Good Dog must not blind-sync** over `ex-lead-loose` during the P1-1 rewrite.
- Draft alternative: `proto-loose-lead-force-free-draft` → `ex-kb-loose-lead-check-in-draft` in `draftExercises[]` (reward check-ins, not production sync).

## Consumption (summary)

See README **Consuming from Good Dog**. Prefer CI artifacts or vendored JSON; no Convex or env vars required for static imports.

## Legal

Exports for Good Dog require sources at `displayEligibility: paraphrase_ok`. Do not treat content as legally cleared for in-app display until legal sign-off (see [gap-analysis.md](gap-analysis.md)).
