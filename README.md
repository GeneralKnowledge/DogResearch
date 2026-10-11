# Good Dog — canine training knowledge base

Structured research library and **CI export source** for the **[Good Dog](https://github.com/GeneralKnowledge/Good-Dog)** app: UK-focused, owner-first, reward-based training aligned with **IMDT** ethics and **ABTC**-compatible professional standards.

This repo holds the **research knowledge base**, export pipelines, and an optional **KindTrail** preview web app (`apps/web`).

## Quick start

```bash
npm install
npm run catalog   # rebuild kb/index/catalog.json and evidence-index.json
npm run qa        # integrity checks (provenance, IDs, Good Dog crosswalk)
npm run export:good-dog   # dist/good-dog-domain.json, safety, guides, referrals, ask-patterns
npm run build:kb  # CI: qa → catalog → export:good-dog → tests
npm run export    # KindTrail publishable.json (optional preview)
npm run dev:web   # Next.js preview UI (port 3000)
```

## Consuming from Good Dog

Good Dog is the **production app**. Sync content from this repo without a second owner product.

### 1. CI artifacts (recommended)

On every successful `main` / `cursor/**` push, the **kb-export** workflow uploads:

- `dist/good-dog-domain.json` — skill exercises (`steps_only` plus optional `glossaryTermIds`, `topicGroup`, `purposeOneLine`)
- `dist/good-dog-safety.json` — safety rules, assessment metrics with `goodDogInferenceHints`, recall gate
- `dist/good-dog-guides.json` — management and education guides (owner markdown, provenance, Ask keywords)
- `dist/good-dog-referrals.json` — same referral cards as the KindTrail preview (`title`, `body`, `url`) plus `rationaleClaimIds`
- `dist/good-dog-ask-patterns.json` — aversive patterns, escalate-question patterns, owner-question crosswalk
- `dist/good-dog-crash-course.json` — ordered owner path (10 stages) with coverage notes and gaps; see `docs/imdt-alignment.md`

Download the `good-dog-kb-dist` artifact from GitHub Actions. The workflow uploads every file above. Each file includes `schemaVersion` (`exportSchemaVersion` in `kb/meta/schema-version.json`, currently 1.1.0) and `generatedAt`.

### 2. Git submodule or copy

```bash
git submodule add https://github.com/GeneralKnowledge/DogResearch.git vendor/dog-research
cd vendor/dog-research && npm ci && npm run build:kb
```

Copy or import JSON into Good Dog, e.g.:

`src/lib/domains/dog-training/content/kb-import/good-dog-domain.json`

```typescript
import domain from "./kb-import/good-dog-domain.json";
```

No API keys or Convex env vars are required for static JSON imports.

### 3. Sync policy

- Use `exercises[]` for mappable skill content with full `provenance`.
- Respect `held[]` — do **not** overwrite `ex-lead-loose` until `goodDogExportStatus` is lifted (see [docs/good-dog-integration.md](docs/good-dog-integration.md)).
- Treat `draftExercises[]` separately from core `ExerciseContent`.
- **Guides** (`good-dog-guides.json`) are the consumer for `managementModules` and `educationOnly` lessons. Render `ownerBodyMarkdown` in Good Dog Learn; do not rebuild those lessons in KindTrail.
- **Referrals** (`good-dog-referrals.json`) are the consumer for help CTAs. `vetFirst` has no URL.
- **Ask** (`good-dog-ask-patterns.json`) links owner questions to a `guideLessonId` or a `goodDogHelpId`. Escalate patterns point at `safe-*` rules and, where relevant, a guide.
- When `contentCompleteness` is `steps_only`, merge `glossaryTermIds`, `topicGroup`, and `purposeOneLine` only into empty Good Dog fields. An empty `glossaryTermIds` array means “no KB suggestion” and must not clear glossary terms already on the exercise.
- `assessmentMetrics[].goodDogInferenceHints` lists `exerciseIds` and `learningObjectiveIds` that count toward that metric, including held and draft crosswalk ids that share the objective.
- Refresh [packages/content-gate/tests/fixtures/good-dog-exercise-ids.json](packages/content-gate/tests/fixtures/good-dog-exercise-ids.json) when Good Dog adds exercises: `node scripts/vendor-good-dog-exercise-ids.mjs`.

### Legal display

Content is **not** legally cleared for in-app display until registry sources are tagged `displayEligibility: paraphrase_ok`. Good Dog domain export enforces that stricter gate. Pending legal review is documented in [docs/gap-analysis.md](docs/gap-analysis.md).

## Layout

- [`docs/architecture.md`](docs/architecture.md) — entity model and provenance rules
- [`docs/product-scope.md`](docs/product-scope.md) — Good Dog vs KindTrail roles
- [`docs/learning-curriculum.md`](docs/learning-curriculum.md) — ten-week Foundation course (UK Lite timetable)
- [`kb/meta/uk-lite-course.json`](kb/meta/uk-lite-course.json) — source of truth for that course
- [`docs/imdt-alignment.md`](docs/imdt-alignment.md) — crash-course coverage vs public IMDT outlines
- [`docs/good-dog-integration.md`](docs/good-dog-integration.md) — crosswalk, P1-1 loose lead, artifacts
- [`kb/meta/good-dog-exercise-crosswalk.json`](kb/meta/good-dog-exercise-crosswalk.json) — Good Dog `ex-*` mapping
- [`kb/taxonomy/topic-taxonomy.json`](kb/taxonomy/topic-taxonomy.json) — categories A–K
- [`kb/registry/`](kb/registry/) — sources, claims, protocols, lessons, safety rules
- [`packages/kb-core`](packages/kb-core) — registry loader
- [`packages/content-gate`](packages/content-gate) — publish gate + Good Dog export

## Research principles (summary)

- Humane, force-free, evidence-informed; separate science, professional guidance, and owner anecdotes.
- No fabricated citations; short excerpts/paraphrases only.
- Disagreement preserved (`kb/registry/disagreements.json`).
- High-risk protocols require human review before in-app use.

## KindTrail preview (optional)

- [`apps/web`](apps/web) — optional research preview of pilot lessons
- CI builds KindTrail only on `main` or PRs labeled `kindtrail-preview`
