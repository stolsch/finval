import type { AssetClass } from "../types/AssetClass";
import type { ValidationResult } from "../types/ValidationResult";

interface PriceRange {
  min: number;
  max: number;
}

export interface PriceRangeValidationInput {
  price: number;
  assetClass: AssetClass;
  min?: number;
  max?: number;
}

const DEFAULT_RANGES: Record<AssetClass, PriceRange> = {
  equity: { min: 0.001, max: 1_000_000 },
  fx: { min: 0.0001, max: 1_000 },
  commodity: { min: 0.01, max: 100_000 },
  crypto: { min: 0.000001, max: 10_000_000 },
  fixed_income: { min: 0, max: 200 }
};

/**
 * Validates that a price falls within an allowed range for its asset class.
 */
export function validatePriceRange(input: PriceRangeValidationInput): ValidationResult {
  const { price, assetClass, min, max } = input;
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

  if (price < 0) {
    errors.push({
      code: "PRICE_NEGATIVE",
      message: "Price cannot be negative.",
      field: "price",
      value: price
    });
  }

  const defaultRange = DEFAULT_RANGES[assetClass];
  const effectiveMin = min ?? defaultRange.min;
  const effectiveMax = max ?? defaultRange.max;

  if (effectiveMin > effectiveMax) {
    errors.push({
      code: "PRICE_RANGE_CONFIG_INVALID",
      message: "Invalid range configuration: min cannot exceed max.",
      field: "price",
      value: { min: effectiveMin, max: effectiveMax }
    });
    return { valid: false, errors, warnings };
  }

  if (price < effectiveMin) {
    errors.push({
      code: "PRICE_BELOW_MIN",
      message: `Price ${price} is below minimum ${effectiveMin} for ${assetClass}.`,
      field: "price",
      value: price
    });
  }

  if (price > effectiveMax) {
    errors.push({
      code: "PRICE_ABOVE_MAX",
      message: `Price ${price} is above maximum ${effectiveMax} for ${assetClass}.`,
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
