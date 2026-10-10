/** Optional Convex sync — wired when NEXT_PUBLIC_CONVEX_URL is set in a future iteration. */
export function convexEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}

export function getAnonymousUserId(): string {
  if (typeof window === "undefined") return "server";
  const key = "kindtrail-anon-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
