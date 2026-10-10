import { getPublishable } from "@/lib/publishable";
import { CatalogSearch } from "@/components/CatalogSearch";
import { LessonLinks } from "@/components/LessonLinks";
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
          <LessonLinks
            lessons={mod.lessonIds.flatMap((id) => {
              const lesson = data.lessons.find((l) => l.lesson.id === id);
              if (!lesson) return [];
              return [
                {
                  id,
                  title: lesson.lesson.title,
                  advisory: lesson.advisory,
                  stepCount: lesson.protocol.steps?.length ?? 0,
                  variant: "list" as const
                }
              ];
            })}
          />
        </section>
      ))}
    </>
  );
}
