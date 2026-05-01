import { describe, expect, it } from "vitest";
import { validatePriceRange } from "../../src/price/rangeValidator";

describe("validatePriceRange", () => {
  it("returns valid for in-range equity price", () => {
    const result = validatePriceRange({ price: 150, assetClass: "equity" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns PRICE_NEGATIVE for negative prices", () => {
    const result = validatePriceRange({ price: -5, assetClass: "equity" });
    expect(result.valid).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain("PRICE_NEGATIVE");
  });

  it("applies custom range overrides", () => {
    const valid = validatePriceRange({ price: 150, assetClass: "equity", min: 0.01, max: 100_000 });
    const invalid = validatePriceRange({ price: 150_001, assetClass: "equity", min: 0.01, max: 100_000 });
    expect(valid.valid).toBe(true);
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.map((error) => error.code)).toContain("PRICE_ABOVE_MAX");
  });

  it("flags below-min and above-max boundary violations", () => {
    const below = validatePriceRange({ price: 0.00001, assetClass: "fx" });
    const above = validatePriceRange({ price: 1001, assetClass: "fx" });
    expect(below.errors.map((error) => error.code)).toContain("PRICE_BELOW_MIN");
    expect(above.errors.map((error) => error.code)).toContain("PRICE_ABOVE_MAX");
  });

  it("flags non-finite prices", () => {
    const result = validatePriceRange({ price: Number.NaN, assetClass: "crypto" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_NOT_FINITE");
  });
});
