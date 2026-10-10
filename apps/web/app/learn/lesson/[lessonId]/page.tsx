import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonById, getPublishable } from "@/lib/publishable";
import { LessonPlayer } from "@/components/LessonPlayer";

export default async function LessonPage({
  params
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const entry = getLessonById(lessonId);
  if (!entry) notFound();

  const mod = getPublishable().modules.find((m) =>
    m.lessonIds.includes(lessonId)
  );

  return (
    <>
      <p>
        <Link href={mod ? `/learn/${mod.id}` : "/learn"}>← Back to module</Link>
      </p>
      <h1>{entry.lesson.title}</h1>
      <p className="muted">{entry.lesson.summary}</p>
      <LessonPlayer entry={entry} />
    </>
  );
}
