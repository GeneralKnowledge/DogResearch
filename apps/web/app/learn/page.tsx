import Link from "next/link";
import { getPublishable } from "@/lib/publishable";
import { CatalogSearch } from "@/components/CatalogSearch";
import { ProgressionTiers } from "@/components/ProgressionTiers";

export default function LearnIndexPage() {
  const data = getPublishable();

  return (
    <>
      <h1>Learning paths</h1>
      <p className="muted">Choose a module to work through at your dog&apos;s pace.</p>
      <CatalogSearch />
      <ProgressionTiers />
      {data.modules.map((mod) => (
        <section key={mod.id} className="card">
          <h2>{mod.title}</h2>
          <ul>
            {mod.lessonIds.map((id) => {
              const lesson = data.lessons.find((l) => l.lesson.id === id);
              if (!lesson) return null;
              return (
                <li key={id}>
                  <Link href={`/learn/lesson/${id}`}>{lesson.lesson.title}</Link>
                  {lesson.advisory ? (
                    <>
                      {" "}
                      <span className="pill pill-warn">Advisory</span>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
