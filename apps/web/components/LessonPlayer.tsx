"use client";

import { useMemo, useState } from "react";
import type { PublishableLesson } from "@/lib/publishable";
import { isStepDone, saveStep } from "@/lib/progress";
import { isOffLeadUnlocked } from "@/lib/progression";

type Tab = "steps" | "evidence";

export function LessonPlayer({ entry }: { entry: PublishableLesson }) {
  const [tab, setTab] = useState<Tab>("steps");
  const [tick, setTick] = useState(0);
  const { lesson, protocol, claims, sources, advisory, advisoryMessage } = entry;
  const educationOnly = (lesson as { educationOnly?: boolean }).educationOnly === true;
  const showOffLeadGate =
    lesson.id === "lesson-recall-basics" || protocol.id === "proto-recall-three-step-dt";

  const steps = useMemo(() => protocol.steps ?? [], [protocol.steps]);

  function toggleStep(stepNumber: number) {
    const done = isStepDone(lesson.id, stepNumber);
    saveStep(lesson.id, stepNumber, !done);
    setTick((t) => t + 1);
  }

  void tick;

  return (
    <div>
      {advisory ? (
        <p className="card" style={{ background: "#fff8f0", borderColor: "#e8c9a8" }}>
          <strong>Advisory:</strong>{" "}
          {advisoryMessage ??
            "This lesson includes health or behaviour topics—follow professional guidance when unsure."}
        </p>
      ) : null}

      <div className="tabs">
        <button
          type="button"
          className={tab === "steps" ? "active" : ""}
          onClick={() => setTab("steps")}
        >
          Steps
        </button>
        <button
          type="button"
          className={tab === "evidence" ? "active" : ""}
          onClick={() => setTab("evidence")}
        >
          Why we recommend this
        </button>
      </div>

      {tab === "steps" ? (
        <>
          {educationOnly ? (
            <p className="card" style={{ background: "#f0f7ff", borderColor: "#c5d9f0" }}>
              <strong>Education only:</strong> no step checklist—use this to observe stress and know
              when to pause or refer.
            </p>
          ) : null}
          {showOffLeadGate && !isOffLeadUnlocked() ? (
            <p className="card" style={{ background: "#fff8f0", borderColor: "#e8c9a8" }}>
              <strong>Long line first:</strong> KindTrail blocks promoting off-lead freedom in public
              until you mark tier-1 and tier-2 recall metrics on the{" "}
              <a href="/learn">Learn</a> page (safe-002).
            </p>
          ) : null}
          <p className="muted">{protocol.intendedOutcome}</p>
          <ol className="step-list">
            {steps.map((step) => {
              const done = isStepDone(lesson.id, step.stepNumber);
              return (
                <li key={step.stepNumber} className={done ? "done" : ""}>
                  <p>
                    <strong>Step {step.stepNumber}.</strong> {step.instruction}
                  </p>
                  {step.progressCriteria ? (
                    <p className="muted">Progress: {step.progressCriteria}</p>
                  ) : null}
                  <button type="button" className="btn btn-secondary" onClick={() => toggleStep(step.stepNumber)}>
                    {done ? "Mark not done" : "Mark done"}
                  </button>
                </li>
              );
            })}
          </ol>
          {(protocol.referralRequirements?.length ?? 0) > 0 ? (
            <div className="card provenance">
              <h3>When to get extra help</h3>
              <ul>
                {protocol.referralRequirements!.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : (
        <div className="provenance card">
          <h3>Supporting claims</h3>
          <ul>
            {claims.map((c) => (
              <li key={c.id}>
                {c.statement}{" "}
                <span className="muted">({c.confidence ?? "guidance"})</span>
              </li>
            ))}
          </ul>
          <h3>Sources</h3>
          <ul>
            {sources.map((s) => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                {s.publisher ? <span className="muted"> — {s.publisher}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
