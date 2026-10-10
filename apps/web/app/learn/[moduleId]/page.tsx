import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonLinks } from "@/components/LessonLinks";
import { getModuleLessons, getPublishable } from "@/lib/publishable";

export default async function ModulePage({
  params
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getPublishable().modules.find((m) => m.id === moduleId);
  if (!mod) notFound();

  const lessons = getModuleLessons(moduleId);

  return (
    <>
      <p>
        <Link href="/learn">← All modules</Link>
      </p>
      <h1>{mod.title}</h1>
      <LessonLinks
        lessons={lessons.map((entry) => ({
          id: entry.lesson.id,
          title: entry.lesson.title,
          summary: entry.lesson.summary,
          advisory: entry.advisory,
          stepCount: entry.protocol.steps?.length ?? 0,
          variant: "card" as const
        }))}
      />
    </>
  );
}
