import type { ValidationResult } from "../types/ValidationResult";

export interface TimePoint {
  timestamp: string;
}

export interface GapDetectorInput {
  points: TimePoint[];
  expectedIntervalSeconds: number;
}

/**
 * Detects missing intervals in a timestamped time series.
 */
export function detectGaps(input: GapDetectorInput): ValidationResult {
  const { points, expectedIntervalSeconds } = input;
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (expectedIntervalSeconds <= 0 || !Number.isFinite(expectedIntervalSeconds)) {
    errors.push({
      code: "INTERVAL_INVALID",
      message: "Expected interval must be a positive finite number.",
      field: "expectedIntervalSeconds",
      value: expectedIntervalSeconds
    });
    return { valid: false, errors, warnings };
  }

  for (let i = 1; i < points.length; i += 1) {
    const current = new Date(points[i].timestamp).getTime();
    const previous = new Date(points[i - 1].timestamp).getTime();
    if (Number.isNaN(current) || Number.isNaN(previous)) {
      errors.push({
        code: "TIMESTAMP_INVALID",
        message: "All timestamps must be valid ISO 8601 datetimes.",
        field: "timestamp",
        value: points[i].timestamp
      });
      continue;
    }

    const deltaSeconds = (current - previous) / 1000;
    if (deltaSeconds > expectedIntervalSeconds) {
      errors.push({
        code: "DATA_GAP",
        message: `Gap detected: ${deltaSeconds}s between consecutive points.`,
        field: "timestamp",
        value: {
          previous: points[i - 1].timestamp,
          current: points[i].timestamp
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
