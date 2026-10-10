"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getPublishable } from "@/lib/publishable";

export function CatalogSearch() {
  const data = getPublishable();
  const [query, setQuery] = useState("");

  const publishedIds = useMemo(
    () => new Set(data.lessons.map((l) => l.lesson.id)),
    [data.lessons]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return (data.catalogSearch ?? [])
      .filter((e) => {
        const hay = `${e.title} ${e.id} ${(e.topics ?? []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 12);
  }, [query, data.catalogSearch]);

  return (
    <section className="card">
      <h2>Search lessons &amp; knowledge base</h2>
      <p className="muted">Search the exported catalog; published lessons link straight to the player.</p>
      <input
        type="search"
        placeholder="e.g. recall, loose lead, fireworks"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.75rem" }}
        aria-label="Search catalog"
      />
      {results.length > 0 ? (
        <ul>
          {results.map((e) => {
            const isLesson = e.kind === "lesson" && publishedIds.has(e.id);
            return (
              <li key={`${e.kind}-${e.id}`}>
                <span className="pill">{e.kind}</span>{" "}
                {isLesson ? (
                  <Link href={`/learn/lesson/${e.id}`}>{e.title}</Link>
                ) : (
                  <span>{e.title}</span>
                )}
              </li>
            );
          })}
        </ul>
      ) : query.length >= 2 ? (
        <p className="muted">No matches in the exported index.</p>
      ) : null}
    </section>
  );
}
