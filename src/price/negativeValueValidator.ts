import type { AssetClass } from "../types/AssetClass";
import type { ValidationResult } from "../types/ValidationResult";

export interface NegativeValueValidationInput {
  assetClass: AssetClass;
  price?: number;
  bid?: number;
  ask?: number;
  volume?: number;
}

/**
 * Validates that key market fields are non-negative and semantically valid.
 */
export function validateNoNegativeValues(input: NegativeValueValidationInput): ValidationResult {
  const { assetClass, price, bid, ask, volume } = input;
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const valuesToCheck: Array<{ field: "price" | "bid" | "ask" | "volume"; value: number | undefined }> = [
    { field: "price", value: price },
    { field: "bid", value: bid },
    { field: "ask", value: ask },
    { field: "volume", value: volume }
  ];

  for (const { field, value } of valuesToCheck) {
    if (value === undefined) {
      continue;
    }

    if (!Number.isFinite(value)) {
      errors.push({
        code: `${field.toUpperCase()}_NOT_FINITE`,
        message: `${field} must be a finite number.`,
        field,
        value
      });
      continue;
    }

    if (value < 0) {
      errors.push({
        code: `${field.toUpperCase()}_NEGATIVE`,
        message: `${field} cannot be negative.`,
        field,
        value
      });
    }
  }

  if (volume !== undefined && Number.isFinite(volume) && assetClass === "equity" && !Number.isInteger(volume)) {
    errors.push({
      code: "VOLUME_NOT_INTEGER",
      message: "Volume must be an integer for equity instruments.",
      field: "volume",
      value: volume
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
