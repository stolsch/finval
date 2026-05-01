import type { AssetClass } from "../types/AssetClass";
import type { ValidationResult } from "../types/ValidationResult";

export interface StalenessDetectorInput {
  timestamp: string;
  assetClass: AssetClass;
  now?: Date;
  maxAgeSeconds?: number;
}

const DEFAULT_MAX_AGE_SECONDS: Partial<Record<AssetClass, number>> = {
  equity: 60,
  fx: 30,
  crypto: 10,
  commodity: 300
};

/**
 * Checks if a datapoint timestamp is stale for the given asset class.
 */
export function detectStaleness(input: StalenessDetectorInput): ValidationResult {
  const { timestamp, assetClass, now = new Date(), maxAgeSeconds } = input;
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const timestampDate = new Date(timestamp);
  if (Number.isNaN(timestampDate.getTime())) {
    errors.push({
      code: "TIMESTAMP_INVALID",
      message: "Timestamp must be a valid ISO 8601 datetime.",
      field: "timestamp",
      value: timestamp
    });
    return { valid: false, errors, warnings };
  }

  const effectiveMaxAge = maxAgeSeconds ?? DEFAULT_MAX_AGE_SECONDS[assetClass];
  if (effectiveMaxAge === undefined) {
    return { valid: true, errors, warnings };
  }

  const ageSeconds = (now.getTime() - timestampDate.getTime()) / 1000;
  if (ageSeconds > effectiveMaxAge) {
    errors.push({
      code: "DATA_STALE",
      message: `Data age ${Math.floor(ageSeconds)}s exceeds max age ${effectiveMaxAge}s.`,
      field: "timestamp",
      value: timestamp
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
