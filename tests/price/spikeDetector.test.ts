import { describe, expect, it } from "vitest";
import { detectSpike } from "../../src/price/spikeDetector";

describe("detectSpike", () => {
  it("passes when all movements are under threshold", () => {
    const result = detectSpike({ prices: [100, 101, 99, 100], threshold: 0.2 });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("flags spike movements above threshold", () => {
    const result = detectSpike({ prices: [100, 101, 99, 145, 100], threshold: 0.2 });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_SPIKE");
    expect(result.errors[0]?.index).toBe(3);
    expect(result.errors[0]?.previousValue).toBe(99);
  });

  it("handles empty and single-point arrays", () => {
    expect(detectSpike({ prices: [] }).valid).toBe(true);
    expect(detectSpike({ prices: [100] }).valid).toBe(true);
  });

  it("flags invalid thresholds", () => {
    const result = detectSpike({ prices: [100, 101], threshold: -1 });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("SPIKE_THRESHOLD_INVALID");
  });

  it("flags non-finite values in series", () => {
    const result = detectSpike({ prices: [100, Number.NaN] });
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.code).toBe("PRICE_NOT_FINITE");
  });
});
