# Product scope

## Roles

| Component | Role |
|-----------|------|
| **[Good Dog](https://github.com/GeneralKnowledge/Good-Dog)** | Production owner-facing coaching app. Consumes CI-built artifacts under `dist/good-dog-*.json` (or vendored copies). Implements planner, progression, and UI. |
| **DogResearch (this repo)** | Canonical **research knowledge base**, provenance, human review, and **CI-verified export** for Good Dog. Batches and QA live here. |
| **KindTrail `apps/web`** | Optional **research preview** of pilot lessons (ethics, referrals, CPD). Not required for Good Dog content sync. |

## Provenance contract

Good Dog integrations must preserve the chain documented in [`architecture.md`](architecture.md):

`lesson` → `protocol` / `claim` → `source` or `study`

Each exported exercise includes a `provenance` block from the domain export (`protocolId`, `claimIds`, `sourceIds`, `reviewStatus`, `lastVerified`).

## Legal display

- Registry sources use `displayEligibility` (see [`gap-analysis.md`](gap-analysis.md)).
- **Good Dog domain export** only includes lessons whose sources are `paraphrase_ok` (legally cleared for paraphrase in-app).
- **KindTrail preview** may use `paraphrase_ok_pending_legal` per [`kb/meta/publish-config.json`](../kb/meta/publish-config.json).
- Do **not** claim content is legally cleared for app display until sources are tagged `paraphrase_ok`. Pending legal review is tracked in gap analysis.

## Out of scope (this repo)

- Good Dog planner / welfare-aware routing implementation
- Merging Good Dog and KindTrail into one Next.js app
- Convex-backed progress as a Good Dog content dependency
