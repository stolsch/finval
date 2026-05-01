import type { AssetClass } from "../types/AssetClass";
import type { ValidationResult } from "../types/ValidationResult";

export interface PrecisionValidationInput {
  price: number;
  assetClass: AssetClass;
  maxDecimals?: number;
}

const DECIMAL_LIMITS: Partial<Record<AssetClass, number>> = {
  equity: 4,
  fx: 6,
  crypto: 8
};

function countDecimals(value: number): number {
  if (!Number.isFinite(value)) {
    return Number.POSITIVE_INFINITY;
  }

  const normalized = value.toString().toLowerCase();
  if (!normalized.includes("e")) {
    const decimals = normalized.split(".")[1];
    return decimals ? decimals.length : 0;
  }

  const [base, exponentPart] = normalized.split("e");
  const exponent = Number(exponentPart);
  const baseDecimals = (base.split(".")[1] ?? "").length;
  if (exponent >= 0) {
    return Math.max(0, baseDecimals - exponent);
  }
  return baseDecimals + Math.abs(exponent);
}

/**
 * Validates that a price uses an allowed number of decimal places.
 */
export function validatePrecision(input: PrecisionValidationInput): ValidationResult {
  const { price, assetClass, maxDecimals } = input;
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (!Number.isFinite(price)) {
    errors.push({
      code: "PRICE_NOT_FINITE",
      message: "Price must be a finite number.",
      field: "price",
      value: price
    });
    return { valid: false, errors, warnings };
  }

  const limit = maxDecimals ?? DECIMAL_LIMITS[assetClass];
  if (limit === undefined) {
    return { valid: true, errors, warnings };
  }

  const decimals = countDecimals(price);
  if (decimals > limit) {
    errors.push({
      code: "PRICE_PRECISION_EXCEEDED",
      message: `Price precision ${decimals} exceeds ${limit} decimals for ${assetClass}.`,
      field: "price",
      value: price
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
