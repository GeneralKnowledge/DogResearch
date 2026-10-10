# Gap analysis (updated after batch 008)

## Coverage by taxonomy category

| Category | Status after batch 008 | Priority next sources |
|----------|------------------------|------------------------|
| A Behaviour & communication | Stress lesson + BC cross-ref; DDD skeleton | Displacement behaviours depth |
| B Learning theory | Marker + CC method registered | APBC/FABC learning theory sheets |
| C Training mechanics | DDD skeleton (review-013) | Charity explicit stay/generalisation pages |
| D Foundation behaviours | Sit/down/recall/leave + mouthing/jump | Hand target; drop page if RSPCA publishes |
| E Puppy/adolescent | DT socialisation + Puppy 101 | Blue Cross puppy (403); adolescent fear |
| F Enrichment | PDSA + DT steal enrichment angle | More RSPCA/DT enrichment protocols |
| G Behaviour problems | Reactive management; steal/chase; fireworks registered | Clinical noise phobia plans (referral only) |
| H Health & boundaries | BVA abnormal behaviour; vet-first reactivity | RCVS pain-behaviour page if URL stable |
| I Assessment | **assessment-metrics.json** + synthesis claims | Human validation of tier thresholds in field |
| J Special populations | None | Rescue; multi-dog |
| K Ethics/regulation | GOV/DDA summaries; ABTC role synthesis | ABTC role PDFs (`review-011`) |

## Source registry gaps

- **Blue Cross puppy**: HTTP 403 in agent/CI — deferred.
- **ABTC role standards PDFs**: Cloudflare; provisional role claim on src-abtc-owners.
- **RSPCA drop**: documented gap claim.
- **APBC handouts**: hub registered; individual PDFs not fully extracted.

## Quality / QA gaps

- `npm run url-check` wired in CI (non-blocking) with host allowlist.
- `displayEligibility` on core sources + batch sources; export gate enforces paraphrase_ok tags.
- Licence fields still mostly `unknown_web_content` — legal sign-off pending for `paraphrase_ok`.

## Recommended batch 009+

1. Adolescent fear / teenage regression (E).
2. Rescue / rehomed dogs (J).
3. Cooperative handling / vet prep (D).
4. Community evidence (K) — defer until foundational layers stable.
