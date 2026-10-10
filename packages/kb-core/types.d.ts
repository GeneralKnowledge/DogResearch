export interface Source {
  id: string;
  canonicalUrl: string;
  title: string;
  publisher?: string;
  topics?: string[];
  displayEligibility?: string;
}

export interface AssessmentMetric {
  id: string;
  title: string;
  behaviourId?: string;
  tier: number;
  observableCriteria: string;
  progressionGate?: string | null;
  goodDogModule?: string;
}

export interface Claim {
  id: string;
  statement: string;
  topic: string;
  supportingSourceId?: string;
  studyId?: string;
  confidence?: string;
  evidenceChannel?: string;
  goodDogRecommendationEligible?: boolean;
}

export interface ProtocolStep {
  stepNumber: number;
  instruction: string;
  rewardTiming?: string;
  progressCriteria?: string;
  easierIfStruggling?: string;
  failureModes?: string[];
}

export interface Protocol {
  id: string;
  title: string;
  intendedOutcome?: string;
  steps: ProtocolStep[];
  reviewStatus?: string;
  reviewReason?: string;
  supportingSourceIds?: string[];
  supportingClaimIds?: string[];
  referralRequirements?: string[];
  safetyPrecautions?: string[];
  lastReviewed?: string;
  goodDogExerciseId?: string;
  goodDogExportStatus?: string;
  methodTags?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  derivedFromProtocolId: string;
  supportingClaimIds?: string[];
  topic: string;
  goodDogModule: string;
  traceabilityStatus: string;
  publishedToApp: boolean;
  educationOnly?: boolean;
  lastReviewed?: string;
  goodDogExerciseId?: string;
  newExercise?: boolean;
}

export interface SafetyRule {
  id: string;
  title: string;
  rule: string;
  rationaleClaimIds?: string[];
  referralText?: string | null;
  severity?: string;
}

export interface MergedRegistry {
  sources: Source[];
  claims: Claim[];
  protocols: Protocol[];
  lessons: Lesson[];
  safetyRules: SafetyRule[];
  studies: unknown[];
  behaviours: unknown[];
  relationships: unknown[];
  disagreements: unknown[];
  reviewItems: unknown[];
}

export interface LessonBundle {
  lesson: Lesson;
  protocol: Protocol;
  claims: Claim[];
  sources: Source[];
}

export interface OwnerQuestionCategory {
  id: string;
  label: string;
  questions: Array<{
    id: string;
    text: string;
    subthemes?: string[];
    sourceLocator?: string;
  }>;
}
