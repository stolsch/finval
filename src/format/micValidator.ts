import type { ValidationResult } from "../types/ValidationResult";

/**
 * Validates basic MIC code structure (ISO 10383 style).
 */
export function validateMIC(mic: string): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];
  const normalized = mic.toUpperCase();

  if (!/^[A-Z0-9]{4}$/.test(normalized)) {
    errors.push({
      code: "MIC_INVALID",
      message: "MIC must be a 4-character alphanumeric code.",
      field: "mic",
      value: mic
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
