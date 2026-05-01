import type { AssetClass } from "./AssetClass";

export interface FinancialDataPoint {
  identifier: string;
  assetClass: AssetClass;
  price: number;
  currency: string;
  timestamp: string;
  bid?: number;
  ask?: number;
  volume?: number;
  source?: string;
}
