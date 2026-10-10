import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuleLessons, getPublishable } from "@/lib/publishable";

export default async function ModulePage({
  params
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const data = getPublishable();
  const mod = data.modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const lessons = getModuleLessons(moduleId);

  return (
    <>
      <p>
        <Link href="/learn">← All modules</Link>
      </p>
      <h1>{mod.title}</h1>
      <div className="grid-modules">
        {lessons.map((entry) => (
          <article key={entry.lesson.id} className="card">
            <h2>{entry.lesson.title}</h2>
            <p className="muted">{entry.lesson.summary}</p>
            {entry.advisory ? (
              <p>
                <span className="pill pill-warn">Follow your vet&apos;s advice</span>
              </p>
            ) : null}
            <Link href={`/learn/lesson/${entry.lesson.id}`} className="btn">
              Open lesson
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
