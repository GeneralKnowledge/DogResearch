const STORAGE_KEY = "kindtrail-progress-v1";

export type StepProgress = Record<string, boolean>;

export function loadProgress(): StepProgress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as StepProgress;
  } catch {
    return {};
  }
}

export function saveStep(lessonId: string, stepNumber: number, done: boolean) {
  const key = `${lessonId}:step:${stepNumber}`;
  const all = loadProgress();
  if (done) all[key] = true;
  else delete all[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function isStepDone(lessonId: string, stepNumber: number): boolean {
  return loadProgress()[`${lessonId}:step:${stepNumber}`] === true;
}

export function countDoneSteps(lessonId: string, stepCount: number): number {
  const all = loadProgress();
  let done = 0;
  for (let step = 1; step <= stepCount; step += 1) {
    if (all[`${lessonId}:step:${step}`] === true) done += 1;
  }
  return done;
}
