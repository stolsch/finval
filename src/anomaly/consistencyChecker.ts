import type { ValidationResult } from "../types/ValidationResult";

export interface ConsistencyInput {
  bid?: number;
  ask?: number;
}

/**
 * Performs cross-field consistency checks for instrument quote data.
 */
export function checkConsistency(input: ConsistencyInput): ValidationResult {
  const { bid, ask } = input;
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (bid !== undefined && ask !== undefined && bid > ask) {
    errors.push({
      code: "BID_ABOVE_ASK",
      message: "Bid cannot exceed ask.",
      field: "bid",
      value: { bid, ask }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
