# Good Dog integration

## Purpose

[DogResearch](https://github.com/GeneralKnowledge/DogResearch) is the canonical, CI-verified content source for the [Good Dog](https://github.com/GeneralKnowledge/Good-Dog) dog-training domain. Good Dog keeps the coaching engine, planner, and UI; this repo owns research provenance, safety rules, and export artifacts.

## Artifacts

| File | Contents |
|------|----------|
| `dist/good-dog-domain.json` | Exercises (`ex-*` or `ex-kb-*`), held exports, drafts. `steps_only` rows include optional `glossaryTermIds`, `topicGroup`, and `purposeOneLine` for merge without replacing rich Good Dog copy. `managementModules` / `educationOnly` remain for traceability. |
| `dist/good-dog-safety.json` | Safety rules, assessment metrics with `goodDogInferenceHints` (`exerciseIds`, `learningObjectiveIds`), aversive text patterns, off-lead promotion gate |
| `dist/good-dog-guides.json` | Management and education lessons whose sources are `paraphrase_ok`: `ownerBodyMarkdown` from protocol steps, provenance, `suggestedAskKeywords` |
| `dist/good-dog-referrals.json` | KindTrail `publishable.referrals` shape (`title`, `body`, `url`) plus `rationaleClaimIds` |
| `dist/good-dog-pathways.json` | Goal pathways from [kb/meta/goal-pathways.json](../kb/meta/goal-pathways.json): one owner goal as ordered stages, each with exercises, lessons, an everyday idea and a gate (`metricIds` plus `ownerCheck`, the gate as a plain question with `{dog}` for the name). Read by the native Good Dog app ([ixOS](https://github.com/GeneralKnowledge/ixOS) `examples/good-dog-core/content/pathways.json` takes the `pathways` array) |
| `dist/good-dog-ask-patterns.json` | `violatesNoAversivePatterns`, `escalateQuestionPatterns` (regex/keywords → `safe-*` ids and guide lesson ids), owner-question taxonomy crosswalk (`goodDogHelpId` or `guideLessonId`) |

Schema version: `exportSchemaVersion` in [kb/meta/schema-version.json](../kb/meta/schema-version.json) (1.1.0), embedded in each export.

CI job `kb-export` uploads these files as the `good-dog-kb-dist` artifact.

## Crosswalk

Pilot skill lessons map to Good Dog exercise ids via [kb/meta/good-dog-exercise-crosswalk.json](../kb/meta/good-dog-exercise-crosswalk.json). QA fails if a pilot skill lesson lacks a crosswalk row or traceability.

## P1-1 loose lead (`proto-loose-lead-dt` / `ex-lead-loose`)

- KB protocol follows Dogs Trust stop-start (forward motion when slack) — tagged `stop_until_slack_then_forward_motion`.
- Crosswalk sets `goodDogExportStatus: hold_until_method_review` so **Good Dog must not blind-sync** over `ex-lead-loose` during the P1-1 rewrite.
- Draft alternative: `proto-loose-lead-force-free-draft` → `ex-kb-loose-lead-check-in-draft` in `draftExercises[]` (reward check-ins, not production sync).

## Goal pathways

[kb/meta/goal-pathways.json](../kb/meta/goal-pathways.json) is the source of truth. Each pathway is the UK Lite course shape (`gate`, `opensAfter`, `ifGateFails`) scoped to one goal, and the format matches ixOS `docs/good-dog-demo.md`, "Pathway format". The app never passes a gate on a count of sessions: it needs good results on different days and then asks the owner the gate's `ownerCheck`. A welfare concern holds a stage.

QA (`npm run qa`) and `npm run test:good-dog-pathways` check every exercise id against the vendored Good Dog list, and every lesson, metric, safety rule, behaviour and owner-question id against the registry. ixOS runs the same exercise and life-stage checks again in Rust.

**Stage lessons** (Reuben, 2026-11-14: lesson plans live inside each goal stage). A stage's `lessons` are short steps in order, unlocked one by one in the app: `learn` (a few sentences of teaching, with the `claimIds` they rest on), `practise` (one of the stage's exercises, with an `aim`), `everyday` (one real-life try), and `check` (a multiple-choice question with `options`, `correctIndex`, an `explanation` and its `claimIds`). `{dog}` stands for the dog's name. QA checks the kinds, the claims, that a practise lesson uses one of the stage's exercises, and that every stage with lessons teaches, practises and checks. Recall is written in full as the sample; the other pathways follow once its shape is agreed.

Gaps: settling and greeting visitors have no assessment metrics yet, so their gates are prose and the owner's answer only. The loose-lead stage uses `ex-lead-loose`, which is on `hold_until_method_review`; the pathway text follows the current stop-start protocol and should be revisited with that review. `safetyRuleIds` are carried but the app does not enforce them until each rule has a machine-readable condition.

## Consumption (summary)

See README **Consuming from Good Dog**. Prefer CI artifacts or vendored JSON; no Convex or env vars required for static imports.

## Legal

Exports for Good Dog require sources at `displayEligibility: paraphrase_ok`. Do not treat content as legally cleared for in-app display until legal sign-off (see [gap-analysis.md](gap-analysis.md)).
