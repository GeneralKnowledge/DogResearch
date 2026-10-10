"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { countDoneSteps } from "@/lib/progress";

export type LessonLinkItem = {
  id: string;
  title: string;
  summary?: string;
  advisory?: boolean;
  stepCount: number;
  variant: "list" | "card";
};

function subscribe(onStoreChange: () => void) {
  window.addEventListener("focus", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("focus", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function progressLabel(done: number, total: number): string {
  if (total <= 0) return "";
  if (done <= 0) return "Not started";
  if (done >= total) return "Practised";
  return `${done} of ${total} steps`;
}

function readSnapshot(lessons: LessonLinkItem[]): string {
  return lessons.map((lesson) => `${lesson.id}:${countDoneSteps(lesson.id, lesson.stepCount)}`).join("|");
}

export function LessonLinks({ lessons }: { lessons: LessonLinkItem[] }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => readSnapshot(lessons),
    () => ""
  );

  const doneById = new Map(
    snapshot
      .split("|")
      .filter(Boolean)
      .map((part) => {
        const splitAt = part.lastIndexOf(":");
        return [part.slice(0, splitAt), Number(part.slice(splitAt + 1))] as const;
      })
  );

  if (lessons[0]?.variant === "list") {
    return (
      <ul>
        {lessons.map((lesson) => {
          const label = progressLabel(doneById.get(lesson.id) ?? 0, lesson.stepCount);
          return (
            <li key={lesson.id}>
              <Link href={`/learn/lesson/${lesson.id}`}>{lesson.title}</Link>
              {label ? <span className="muted"> — {label}</span> : null}
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
    );
  }

  return (
    <div className="grid-modules">
      {lessons.map((lesson) => {
        const label = progressLabel(doneById.get(lesson.id) ?? 0, lesson.stepCount);
        return (
          <article key={lesson.id} className="card">
            <h2>{lesson.title}</h2>
            {lesson.summary ? <p className="muted">{lesson.summary}</p> : null}
            {label ? <p className="muted">{label}</p> : null}
            {lesson.advisory ? (
              <p>
                <span className="pill pill-warn">Follow your vet&apos;s advice</span>
              </p>
            ) : null}
            <Link href={`/learn/lesson/${lesson.id}`} className="btn">
              Open lesson
            </Link>
          </article>
        );
      })}
    </div>
  );
}
