"use client";

import { useState } from "react";
import { getPublishable } from "@/lib/publishable";
import { isMetricDone, saveMetricProgress } from "@/lib/progression";

export function ProgressionTiers() {
  const { assessmentMetrics } = getPublishable();
  const [, tick] = useState(0);

  if (!assessmentMetrics?.length) return null;

  const tiers = assessmentMetrics.filter((m) => m.tier < 99);

  return (
    <section className="card">
      <h2>Progression tiers (pilot)</h2>
      <p className="muted">
        Mark when you meet each observable criterion on a long line or in a secure area. Off-lead
        freedom in public stays blocked until tier-2 recall is checked (safe-002).
      </p>
      <ul className="step-list">
        {tiers.map((m) => {
          const done = isMetricDone(m.id);
          return (
            <li key={m.id} className={done ? "done" : ""}>
              <p>
                <strong>Tier {m.tier}:</strong> {m.title}
              </p>
              <p className="muted">{m.observableCriteria}</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  saveMetricProgress(m.id, !done);
                  tick((t) => t + 1);
                }}
              >
                {done ? "Mark not met" : "Mark met"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
