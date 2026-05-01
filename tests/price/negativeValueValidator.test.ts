import { describe, expect, it } from "vitest";
import { validateNoNegativeValues } from "../../src/price/negativeValueValidator";

describe("validateNoNegativeValues", () => {
  it("passes valid values", () => {
    const result = validateNoNegativeValues({
      assetClass: "equity",
      price: 100,
      bid: 99.5,
      ask: 100.5,
      volume: 10_000
    });
    expect(result.valid).toBe(true);
  });

  it("fails negative fields with specific error codes", () => {
    const result = validateNoNegativeValues({
      assetClass: "crypto",
      price: -1,
      bid: -2,
      ask: -3,
      volume: -4
    });
    const codes = result.errors.map((error) => error.code);
    expect(codes).toContain("PRICE_NEGATIVE");
    expect(codes).toContain("BID_NEGATIVE");
    expect(codes).toContain("ASK_NEGATIVE");
    expect(codes).toContain("VOLUME_NEGATIVE");
  });

  it("requires integer volume for equity", () => {
    const result = validateNoNegativeValues({
      assetClass: "equity",
      price: 10,
      volume: 12.3
    });
    expect(result.valid).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain("VOLUME_NOT_INTEGER");
  });

  it("allows fractional volume for non-equity", () => {
    const result = validateNoNegativeValues({
      assetClass: "crypto",
      price: 10,
      volume: 12.3
    });
    expect(result.valid).toBe(true);
  });

  it("fails on non-finite numeric values", () => {
    const result = validateNoNegativeValues({
      assetClass: "equity",
      price: Number.NaN
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_NOT_FINITE");
  });
});
