import Link from "next/link";
import { getPublishable } from "@/lib/publishable";

export default function FaqPage() {
  const data = getPublishable();
  const published = new Set(data.lessons.map((entry) => entry.lesson.id));

  return (
    <>
      <h1>Common questions</h1>
      <p className="muted">
        From our owner-question taxonomy (discovery themes, not medical advice). Questions with a
        lesson open that practice directly.
      </p>
      {data.ownerQuestions.map((cat) => (
        <section key={cat.id} className="card">
          <h2>{cat.label}</h2>
          <ul>
            {cat.questions.map((q) => {
              const relatedLessonId =
                "relatedLessonId" in q && typeof q.relatedLessonId === "string"
                  ? q.relatedLessonId
                  : undefined;
              const relatedPath =
                "relatedPath" in q && typeof q.relatedPath === "string" ? q.relatedPath : undefined;
              const lessonHref =
                relatedLessonId && published.has(relatedLessonId)
                  ? `/learn/lesson/${relatedLessonId}`
                  : null;
              const pathHref = relatedPath?.startsWith("/") ? relatedPath : null;
              const href = lessonHref ?? pathHref;
              const lesson = lessonHref
                ? data.lessons.find((entry) => entry.lesson.id === relatedLessonId)
                : undefined;
              return (
                <li key={q.id}>
                  <strong>{q.text}</strong>
                  {q.subthemes?.length ? (
                    <ul className="muted">
                      {q.subthemes.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  ) : null}
                  {href ? (
                    <p>
                      <Link href={href}>
                        {lesson ? `Open “${lesson.lesson.title}”` : "See where to get help"}
                      </Link>
                    </p>
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
