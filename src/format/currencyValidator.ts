import type { ValidationResult } from "../types/ValidationResult";

const ACTIVE_ISO_4217_CODES = new Set<string>([
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "AUD",
  "CAD",
  "NZD",
  "SEK",
  "NOK",
  "DKK",
  "CNY",
  "HKD",
  "SGD",
  "INR",
  "BRL",
  "MXN",
  "ZAR",
  "TRY",
  "PLN",
  "CZK",
  "HUF",
  "RON",
  "KRW",
  "TWD",
  "THB",
  "IDR",
  "MYR",
  "PHP",
  "AED",
  "SAR"
]);

/**
 * Validates that a currency code is a known active ISO 4217 code.
 */
export function validateCurrency(currency: string): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];
  const normalized = currency.toUpperCase();

  if (!/^[A-Z]{3}$/.test(normalized)) {
    errors.push({
      code: "CURRENCY_INVALID_FORMAT",
      message: "Currency must be a 3-letter ISO 4217 code.",
      field: "currency",
      value: currency
    });
  } else if (!ACTIVE_ISO_4217_CODES.has(normalized)) {
    errors.push({
      code: "CURRENCY_UNSUPPORTED",
      message: `Currency ${normalized} is not in the active ISO 4217 allowlist.`,
      field: "currency",
      value: currency
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
