import type { ValidationResult } from "../types/ValidationResult";

function expandISIN(isin: string): string {
  return isin
    .toUpperCase()
    .split("")
    .map((char) => {
      if (/^[0-9]$/.test(char)) {
        return char;
      }
      const code = char.charCodeAt(0);
      if (code < 65 || code > 90) {
        return "";
      }
      return String(code - 55);
    })
    .join("");
}

function luhnChecksum(value: string): boolean {
  let sum = 0;
  let shouldDouble = true;
  for (let i = value.length - 1; i >= 0; i -= 1) {
    let digit = Number(value[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Validates an ISIN using ISO 6166 format and checksum.
 */
export function validateISIN(isin: string): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(isin.toUpperCase())) {
    errors.push({
      code: "ISIN_INVALID_FORMAT",
      message: "ISIN must be 12 characters and follow ISO 6166 format.",
      field: "identifier",
      value: isin
    });
    return { valid: false, errors, warnings };
  }

  const expanded = expandISIN(isin);
  if (!expanded || !luhnChecksum(expanded)) {
    errors.push({
      code: "ISIN_INVALID_CHECKSUM",
      message: "ISIN checksum is invalid.",
      field: "identifier",
      value: isin
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
