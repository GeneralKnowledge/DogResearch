# Good Dog — canine training knowledge base

Structured research library for **Good Dog**, a UK-focused, owner-first, reward-based dog training app aligned with **IMDT** ethics and **ABTC**-compatible professional standards.

This repo is the **research agent output**: sources, atomic claims, protocols, safety rules, disagreements, and traceable lesson stubs—not scraped website copies.

## Quick start

```bash
npm run catalog   # rebuild kb/index/catalog.json and evidence-index.json
npm run qa        # integrity checks (provenance, IDs, protocol structure)
```

## Layout

- [`docs/architecture.md`](docs/architecture.md) — entity model and provenance rules
- [`kb/taxonomy/topic-taxonomy.json`](kb/taxonomy/topic-taxonomy.json) — categories A–K
- [`kb/registry/`](kb/registry/) — sources, claims, protocols, lessons, safety rules, review queue
- [`kb/index/catalog.json`](kb/index/catalog.json) — searchable aggregate (generated)
- [`reports/batch-001-report.md`](reports/batch-001-report.md) — latest batch summary
- [`docs/gap-analysis.md`](docs/gap-analysis.md) — coverage gaps and next priorities

## Research principles (summary)

- Humane, force-free, evidence-informed; separate science, professional guidance, and owner anecdotes.
- No fabricated citations; short excerpts/paraphrases only.
- Disagreement preserved (`kb/registry/disagreements.json`).
- High-risk protocols require human review before in-app use.

## Batch status

**Batch 001** — architecture, IMDT/ABTC/Dogs Trust/RSPCA core, Hiby et al. (2004).

**Batch 002** — leave, loose lead, alone-time prevention, PDSA/Blue Cross, ABTC aversives, Vieira de Castro (2020).

**Batch 003** — down/settle/name/stay/recall refinements, GOV.UK + CDO 1992, CFSG, Guilherme-Fernandes (2017) review, Blackwell (2021) judgement bias.

Incremental batches live in `kb/registry/batches/` and merge at QA time. Latest report: `reports/batch-003-report.md`.
