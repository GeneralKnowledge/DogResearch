import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Phase 2: trainer CPD surface — reading list from generated catalog. */
export default function ProPage() {
  const catalogPath = join(process.cwd(), "../../kb/index/catalog.json");
  let topics: Array<{ topic: string; count: number }> = [];
  try {
    const catalog = JSON.parse(readFileSync(catalogPath, "utf8")) as {
      searchableEntries: Array<{ kind: string; topics?: string[] }>;
    };
    const counts = new Map<string, number>();
    for (const e of catalog.searchableEntries) {
      if (e.kind !== "claim") continue;
      for (const t of e.topics ?? []) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    topics = [...counts.entries()]
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  } catch {
    topics = [];
  }

  return (
    <>
      <h1>For trainers &amp; professionals</h1>
      <p className="muted">Phase 2 — CPD reading list and client homework (pilot).</p>

      <section className="card">
        <h2>Assign homework (pilot)</h2>
        <p>
          Share KindTrail lesson links with clients so they follow the same traceable protocols
          you use in class. Full trainer accounts and assignment tracking are on the roadmap.
        </p>
        <Link href="/learn" className="btn">
          Browse publishable lessons
        </Link>
      </section>

      <section className="card">
        <h2>CPD reading by topic</h2>
        <p className="muted">Claim counts from the knowledge base catalog (research layer).</p>
        {topics.length === 0 ? (
          <p>Run <code>npm run catalog</code> at repo root to generate the index.</p>
        ) : (
          <ul>
            {topics.map((t) => (
              <li key={t.topic}>
                <code>{t.topic}</code> — {t.count} claims
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Qualification pathway</h2>
        <p className="muted">
          A full trainer college (exams, membership) is phase 3 and requires new curriculum
          batches in the KB. KindTrail does not issue IMDT-equivalent certificates.
        </p>
      </section>
    </>
  );
}
