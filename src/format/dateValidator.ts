import type { ValidationResult } from "../types/ValidationResult";

/**
 * Validates that a timestamp is ISO 8601 and timezone-aware.
 */
export function validateDate(timestamp: string): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/.test(timestamp);
  const parsed = new Date(timestamp);

  if (Number.isNaN(parsed.getTime()) || !hasTimezone) {
    errors.push({
      code: "DATE_INVALID",
      message: "Timestamp must be a valid ISO 8601 string with timezone.",
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
