# Convex (optional sync)

KindTrail stores lesson step progress in the browser by default. To enable multi-device sync:

1. Run `npx convex dev` (use `CONVEX_AGENT_MODE=anonymous` for cloud agents).
2. Set `NEXT_PUBLIC_CONVEX_URL` in `apps/web/.env.local`.
3. The web app will sync progress via `lessonProgress` when configured.

Functions: `progress.listForUser`, `progress.setStep` (anonymous user id from client localStorage).
