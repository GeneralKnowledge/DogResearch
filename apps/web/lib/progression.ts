const METRIC_STORAGE_KEY = "kindtrail-metrics-v1";

export type MetricProgress = Record<string, boolean>;

export function loadMetricProgress(): MetricProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(METRIC_STORAGE_KEY) ?? "{}") as MetricProgress;
  } catch {
    return {};
  }
}

export function saveMetricProgress(id: string, done: boolean) {
  const all = loadMetricProgress();
  if (done) all[id] = true;
  else delete all[id];
  localStorage.setItem(METRIC_STORAGE_KEY, JSON.stringify(all));
}

export function isMetricDone(id: string): boolean {
  return loadMetricProgress()[id] === true;
}

export function isOffLeadUnlocked(): boolean {
  const p = loadMetricProgress();
  return p["metric-recall-long-line-5m"] === true && p["metric-recall-long-line-10m"] === true;
}
