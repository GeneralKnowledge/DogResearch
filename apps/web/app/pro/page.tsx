import Link from "next/link";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getPublishable } from "@/lib/publishable";

type EvidenceIndex = {
  byTopic: Record<
    string,
    { scientific: string[]; professional: string[]; disputes: string[] }
  >;
};

/** Phase 2: trainer CPD surface — reading list from generated catalog. */
export default function ProPage() {
  const publishable = getPublishable();
  const catalogPath = join(process.cwd(), "../../kb/index/catalog.json");
  const evidencePath = join(process.cwd(), "../../kb/index/evidence-index.json");

  let topics: Array<{ topic: string; count: number }> = [];
  let evidencePaths: Array<{ topic: string; claimCount: number }> = [];

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

  try {
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as EvidenceIndex;
    evidencePaths = Object.entries(evidence.byTopic ?? {})
      .map(([topic, bucket]) => ({
        topic,
        claimCount:
          (bucket.professional?.length ?? 0) +
          (bucket.scientific?.length ?? 0) +
          (bucket.disputes?.length ?? 0)
      }))
      .filter((t) => t.claimCount > 0)
      .sort((a, b) => b.claimCount - a.claimCount)
      .slice(0, 10);
  } catch {
    evidencePaths = [];
  }

  const assignableLessons = publishable.lessons.map((l) => l.lesson);

  return (
    <>
      <h1>For trainers &amp; professionals</h1>
      <p className="muted">Phase 2 — assign homework links and browse CPD topics from the KB index.</p>

      <section className="card">
        <h2>Assign homework (pilot)</h2>
        <p>
          Copy a lesson link for clients—they follow the same traceable protocols you use in class.
          Full trainer accounts and assignment tracking are on the roadmap.
        </p>
        <ul>
          {assignableLessons.map((lesson) => (
            <li key={lesson.id}>
              <Link href={`/learn/lesson/${lesson.id}`}>{lesson.title}</Link>
              <span className="muted">
                {" "}
                — <code>/learn/lesson/{lesson.id}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>CPD reading by topic (catalog)</h2>
        <p className="muted">Claim counts from the knowledge base catalog (research layer).</p>
        {topics.length === 0 ? (
          <p>
            Run <code>npm run catalog</code> at repo root to generate the index.
          </p>
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
        <h2>CPD paths (evidence index)</h2>
        <p className="muted">Curated claim IDs grouped by taxonomy topic in evidence-index.json.</p>
        {evidencePaths.length === 0 ? (
          <p>Evidence index not found—run catalog build.</p>
        ) : (
          <ul>
            {evidencePaths.map((t) => (
              <li key={t.topic}>
                <code>{t.topic}</code> — {t.claimCount} indexed claims
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Qualification pathway</h2>
        <p className="muted">
          A full trainer college (exams, membership) is phase 3 and requires new curriculum batches
          in the KB. KindTrail does not issue IMDT-equivalent certificates.
        </p>
      </section>
    </>
  );
}
