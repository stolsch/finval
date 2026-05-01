import type { ValidationResult } from "../types/ValidationResult";

interface SpikeErrorDetails {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
  index: number;
  previousValue: number;
}

export interface SpikeDetectionInput {
  prices: number[];
  threshold?: number;
}

export interface SpikeDetectionResult extends ValidationResult {
  errors: SpikeErrorDetails[];
}

/**
 * Detects single-period price spikes across a time series.
 */
export function detectSpike(input: SpikeDetectionInput): SpikeDetectionResult {
  const { prices, threshold = 0.2 } = input;
  const errors: SpikeErrorDetails[] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (!Array.isArray(prices)) {
    errors.push({
      code: "PRICE_SERIES_INVALID",
      message: "Price series must be an array.",
      field: "prices",
      value: prices,
      index: -1,
      previousValue: Number.NaN
    });
    return { valid: false, errors, warnings };
  }

  if (prices.length < 2) {
    return { valid: true, errors, warnings };
  }

  if (!Number.isFinite(threshold) || threshold < 0) {
    errors.push({
      code: "SPIKE_THRESHOLD_INVALID",
      message: "Threshold must be a non-negative finite number.",
      field: "threshold",
      value: threshold,
      index: -1,
      previousValue: Number.NaN
    });
    return { valid: false, errors, warnings };
  }

  for (let i = 1; i < prices.length; i += 1) {
    const current = prices[i];
    const previous = prices[i - 1];

    if (!Number.isFinite(current) || !Number.isFinite(previous)) {
      errors.push({
        code: "PRICE_NOT_FINITE",
        message: "All prices in the series must be finite numbers.",
        field: "prices",
        value: current,
        index: i,
        previousValue: previous
      });
      continue;
    }

    if (previous === 0) {
      if (current !== 0) {
        errors.push({
          code: "PRICE_SPIKE",
          message: "Price moved from zero to non-zero in one period.",
          field: "prices",
          value: current,
          index: i,
          previousValue: previous
        });
      }
      continue;
    }

    const movement = Math.abs((current - previous) / previous);
    if (movement > threshold) {
      errors.push({
        code: "PRICE_SPIKE",
        message: `Price moved ${(movement * 100).toFixed(2)}% between periods, exceeding ${(threshold * 100).toFixed(2)}%.`,
        field: "prices",
        value: current,
        index: i,
        previousValue: previous
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
