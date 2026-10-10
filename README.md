# Good Dog — canine training knowledge base

Structured research library and **CI export source** for the **[Good Dog](https://github.com/GeneralKnowledge/Good-Dog)** app: UK-focused, owner-first, reward-based training aligned with **IMDT** ethics and **ABTC**-compatible professional standards.

This repo holds the **research knowledge base**, export pipelines, and an optional **KindTrail** preview web app (`apps/web`).

## Quick start

```bash
npm install
npm run catalog   # rebuild kb/index/catalog.json and evidence-index.json
npm run qa        # integrity checks (provenance, IDs, Good Dog crosswalk)
npm run export:good-dog   # dist/good-dog-domain.json + good-dog-safety.json
npm run build:kb  # CI: qa → catalog → export:good-dog → tests
npm run export    # KindTrail publishable.json (optional preview)
npm run dev:web   # Next.js preview UI (port 3000)
```

## Consuming from Good Dog

Good Dog is the **production app**. Sync content from this repo without a second owner product.

### 1. CI artifacts (recommended)

On every successful `main` / `cursor/**` push, the **kb-export** workflow uploads:

- `dist/good-dog-domain.json`
- `dist/good-dog-safety.json`

Download the `good-dog-kb-dist` artifact from GitHub Actions. Each file includes `schemaVersion` / `exportSchemaVersion` and `generatedAt`.

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
- Treat `draftExercises[]` and `managementModules[]` / `educationOnly[]` separately from core `ExerciseContent`.
- Refresh [packages/content-gate/tests/fixtures/good-dog-exercise-ids.json](packages/content-gate/tests/fixtures/good-dog-exercise-ids.json) when Good Dog adds exercises: `node scripts/vendor-good-dog-exercise-ids.mjs`.

### Legal display

Content is **not** legally cleared for in-app display until registry sources are tagged `displayEligibility: paraphrase_ok`. Good Dog domain export enforces that stricter gate. Pending legal review is documented in [docs/gap-analysis.md](docs/gap-analysis.md).

## Layout

- [`docs/architecture.md`](docs/architecture.md) — entity model and provenance rules
- [`docs/product-scope.md`](docs/product-scope.md) — Good Dog vs KindTrail roles
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
