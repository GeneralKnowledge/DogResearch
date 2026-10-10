import Link from "next/link";
import { getPublishable } from "@/lib/publishable";

function homeworkUrl(lessonId: string): string {
  return `/learn/lesson/${lessonId}?homework=1`;
}

/** Phase 2: trainer CPD surface — claim-level paths from export bundle. */
export default function ProPage() {
  const publishable = getPublishable();
  const assignableLessons = publishable.lessons.map((l) => l.lesson);
  const cpdPaths = publishable.cpdPaths ?? [];

  return (
    <>
      <h1>For trainers &amp; professionals</h1>
      <p className="muted">Assign homework links, browse CPD claim paths, and share lesson URLs.</p>

      <section className="card">
        <h2>Assign homework (pilot)</h2>
        <p>
          Share links with the <code>?homework=1</code> query so clients know this is assigned practice.
          Progress stays on their device unless Convex is configured.
        </p>
        <ul>
          {assignableLessons.map((lesson) => (
            <li key={lesson.id}>
              <Link href={homeworkUrl(lesson.id)}>{lesson.title}</Link>
              <span className="muted">
                {" "}
                — <code>{homeworkUrl(lesson.id)}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>CPD reading paths (evidence index)</h2>
        <p className="muted">Ordered claim statements grouped by taxonomy topic.</p>
        {cpdPaths.length === 0 ? (
          <p>Run export after catalog build to populate CPD paths.</p>
        ) : (
          cpdPaths.map((path) => (
            <div key={path.topic} style={{ marginBottom: "1.25rem" }}>
              <h3>
                <code>{path.topic}</code>
              </h3>
              <ol>
                {path.claims.map((c) => (
                  <li key={c.id}>
                    {c.statement}{" "}
                    <span className="muted">
                      (<code>{c.id}</code>)
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))
        )}
      </section>

      <section className="card">
        <h2>Qualification pathway</h2>
        <p className="muted">
          A full trainer college (exams, membership) is phase 3. KindTrail does not issue IMDT-equivalent
          certificates.
        </p>
      </section>
    </>
  );
}
