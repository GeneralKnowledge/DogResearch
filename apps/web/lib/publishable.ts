import raw from "../content/publishable.json";

export type PublishableLesson = (typeof raw.lessons)[number];
export type PublishableData = typeof raw;

export function getPublishable(): PublishableData {
  return raw as PublishableData;
}

export function getLessonById(id: string): PublishableLesson | undefined {
  return getPublishable().lessons.find((l) => l.lesson.id === id);
}

export function getModuleLessons(moduleId: string): PublishableLesson[] {
  const data = getPublishable();
  const mod = data.modules.find((m) => m.id === moduleId);
  if (!mod) return [];
  return mod.lessonIds
    .map((lid) => data.lessons.find((l) => l.lesson.id === lid))
    .filter((l): l is PublishableLesson => Boolean(l));
}
