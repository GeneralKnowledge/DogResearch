# Gap analysis (updated after batch 004)

## Coverage by taxonomy category

| Category | Status after batch 004 | Priority next sources |
|----------|------------------------|------------------------|
| A Behaviour & communication | DT reactive stress recovery; BC stress (batch 002) | Full body language taxonomy; displacement behaviours |
| B Learning theory | Marker + CC method registered | APBC/FABC learning theory sheets |
| C Training mechanics | DDD partial; loose lead (batch 002) | Systematic DDD progression sources |
| D Foundation behaviours | Sit/down/stay/recall/leave; RSPCA leave added | Mouth **drop** page if published; hand target |
| E Puppy/adolescent | DT socialisation + Puppy 101 hub | Blue Cross puppy (blocked 403); adolescent fear |
| F Enrichment | PDSA claims (batch 002) | More RSPCA/DT enrichment protocols |
| G Behaviour problems | Reactive **management** + referral (DT) | Clinical CC/desensitisation plans (APBC); noise phobia |
| H Health & boundaries | Vet-first for reactivity; CFSG (batch 003) | BVA/RCVS pain-behaviour |
| I Assessment | None | Define Good Dog metrics with human review |
| J Special populations | None | Rescue-specific charities; multi-dog management |
| K Ethics/regulation | ABTC aversives; 2024 HDB scoping review | ABTC role standard PDFs (`review-011`) |

## Source registry gaps

- **Blue Cross puppy**: HTTP 403 in agent/CI environment — deferred.
- **ABTC role standards PDFs**: not ingested (Cloudflare/404); practitioner role claims pending.
- **Peer-reviewed corpus**: Hiby 2004, Vieira de Castro 2020, Blackwell 2021, Guilherme-Fernandes 2017, **Verbeek 2024 scoping**, **2024 CC systematic review**.
- **RSPCA drop**: no dedicated page; documented in KB audit claim.

## Evidence gaps (research)

- Causal welfare outcomes of reward-only vs mixed methods in pet dogs (modern RCTs beyond training schools).
- Generalisation protocols with measurable criteria across environments.
- UK owner adherence barriers (qualitative research).
- Pooled meta-analysis of aversive vs reward methods (still absent; scoping reviews only).

## Quality / QA gaps

- `npm run url-check` added but not yet in CI (recommended as non-blocking).
- Licence fields mostly `unknown_web_content` — legal review for app display.
- APBC/FABC handouts still needed for growl/suppression ethics (`review-004` partial).

## Recommended batch 005

1. Fireworks/noise desensitisation (charity guidance).
2. Resource guarding management + referral.
3. ABTC role standards when PDFs accessible.
4. Optional: wire `url-check` in CI with allowlist for known flaky hosts.
