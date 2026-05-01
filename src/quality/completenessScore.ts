import type { FinancialDataPoint } from "../types/FinancialDataPoint";

/**
 * Computes completeness score from required/optional datapoint fields.
 */
export function getCompletenessScore(dataPoint: FinancialDataPoint): number {
  const fields: Array<keyof FinancialDataPoint> = [
    "identifier",
    "assetClass",
    "price",
    "currency",
    "timestamp",
    "bid",
    "ask",
    "volume",
    "source"
  ];
  const present = fields.filter((field) => dataPoint[field] !== undefined && dataPoint[field] !== "").length;
  return present / fields.length;
}
