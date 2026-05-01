import type { ValidationResult } from "../types/ValidationResult";

export interface OutlierDetectorInput {
  values: number[];
  zThreshold?: number;
}

function mean(values: number[]): number {
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  const avg = mean(values);
  const variance = values.reduce((acc, value) => acc + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Flags outliers in a numeric series using z-score thresholding.
 */
export function detectOutliers(input: OutlierDetectorInput): ValidationResult {
  const { values, zThreshold = 3 } = input;
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (values.length === 0) {
    return { valid: true, errors, warnings };
  }

  const sd = standardDeviation(values);
  if (sd === 0) {
    return { valid: true, errors, warnings };
  }

  const avg = mean(values);
  values.forEach((value, index) => {
    const zScore = (value - avg) / sd;
    if (Math.abs(zScore) > zThreshold) {
      errors.push({
        code: "VALUE_OUTLIER",
        message: `Value at index ${index} exceeds z-score threshold (${zScore.toFixed(2)}).`,
        field: "values",
        value
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
