import { describe, expect, it } from "vitest";
import { validatePrecision } from "../../src/price/precisionValidator";

describe("validatePrecision", () => {
  it("passes valid equity precision", () => {
    expect(validatePrecision({ price: 12.1234, assetClass: "equity" }).valid).toBe(true);
  });

  it("fails when precision exceeds asset class limit", () => {
    const result = validatePrecision({ price: 12.12345, assetClass: "equity" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_PRECISION_EXCEEDED");
  });

  it("uses custom maxDecimals override", () => {
    const result = validatePrecision({ price: 12.123, assetClass: "equity", maxDecimals: 2 });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_PRECISION_EXCEEDED");
  });

  it("supports asset class variations", () => {
    expect(validatePrecision({ price: 1.123456, assetClass: "fx" }).valid).toBe(true);
    expect(validatePrecision({ price: 1.1234567, assetClass: "fx" }).valid).toBe(false);
    expect(validatePrecision({ price: 0.12345678, assetClass: "crypto" }).valid).toBe(true);
  });

  it("fails for non-finite values", () => {
    const result = validatePrecision({ price: Number.POSITIVE_INFINITY, assetClass: "fx" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_NOT_FINITE");
  });
});
