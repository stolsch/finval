import { getCompletenessScore } from "./completenessScore";
import { getConsistencyScore } from "./consistencyScore";
import { getTimelinessScore } from "./timelinessScore";
import type { FinancialDataPoint } from "../types/FinancialDataPoint";
import type { QualityScore } from "../types/QualityScore";

export interface QualityEngineInput {
  dataPoint: FinancialDataPoint;
  ageSeconds: number;
  maxAgeSeconds: number;
  totalChecks: number;
  failedChecks: number;
}

/**
 * Aggregates quality dimensions into a confidence score.
 */
export function evaluateQuality(input: QualityEngineInput): QualityScore {
  const completeness = getCompletenessScore(input.dataPoint);
  const timeliness = getTimelinessScore(input.ageSeconds, input.maxAgeSeconds);
  const consistency = getConsistencyScore(input.totalChecks, input.failedChecks);
  const confidence = (completeness + timeliness + consistency) / 3;

  return {
    completeness,
    timeliness,
    consistency,
    confidence
  };
}
