/**
 * Two-Stage Hybrid Market Valuation Engine (No AI Buzzwords)
 *
 * Implements deterministic statistical benchmarking:
 * - Stage 1 (Cold-Start / Low-Volume, < 5 completed sales):
 *   Uses DeviceCatalog baseline MSRP, annual depreciation matrix, and condition multipliers.
 * - Stage 2 (Liquid Market, >= 5 completed sales):
 *   Computes empirical P25/P75 quartiles from local historical sales.
 */

export type ValuationTier = 'GREAT_DEAL' | 'FAIR_PRICE' | 'OVERPRICED' | 'PENDING';

export type ItemCondition = 'NEW' | 'USED_LIKE_NEW' | 'USED_GOOD' | 'USED_FAIR' | 'FOR_PARTS';

export const CONDITION_MULTIPLIERS: Record<ItemCondition, number> = {
  NEW: 0.95,
  USED_LIKE_NEW: 0.85,
  USED_GOOD: 0.70,
  USED_FAIR: 0.50,
  FOR_PARTS: 0.20,
};

export const ANNUAL_DEPRECIATION_RATES: Record<string, number> = {
  MOBILES: 0.20, // 20% annual depreciation
  ELECTRONICS_CAMERAS: 0.12, // 12% annual depreciation for lenses/cameras
  ELECTRONICS_LAPTOPS: 0.20, // 20% annual depreciation
  DEFAULT: 0.18,
};

export interface Stage1Input {
  launchMsrp: number;
  condition: ItemCondition;
  ageInYears?: number;
  category?: string;
}

export interface ValuationResult {
  tier: ValuationTier;
  marketMin: number;
  marketMax: number;
  valuationMode: 'CATALOG_COLD_START' | 'EMPIRICAL_QUARTILES';
  sampleCount: number;
}

/**
 * Stage 1: Cold-Start / Catalog Benchmark
 * Base Benchmark = launchMsrp * (1 - deprRate)^age * Condition Multiplier
 * Fair Range = [0.92 * Base, 1.08 * Base]
 */
export function calculateColdStartValuation(
  listingPrice: number,
  input: Stage1Input
): ValuationResult {
  const deprRate = ANNUAL_DEPRECIATION_RATES[input.category ?? 'MOBILES'] ?? ANNUAL_DEPRECIATION_RATES.DEFAULT;
  const age = Math.max(0, input.ageInYears ?? 1);
  const conditionMult = CONDITION_MULTIPLIERS[input.condition] ?? 0.70;

  const baseBenchmark = input.launchMsrp * Math.pow(1 - deprRate, age) * conditionMult;
  const marketMin = Math.round(baseBenchmark * 0.92);
  const marketMax = Math.round(baseBenchmark * 1.08);

  let tier: ValuationTier = 'FAIR_PRICE';
  if (listingPrice < marketMin) {
    tier = 'GREAT_DEAL';
  } else if (listingPrice > marketMax) {
    tier = 'OVERPRICED';
  }

  return {
    tier,
    marketMin,
    marketMax,
    valuationMode: 'CATALOG_COLD_START',
    sampleCount: 0,
  };
}

/**
 * Stage 2: Empirical Market Quartile Engine (>= 5 completed sales)
 * Computes P25 and P75 percentiles.
 */
export function calculateEmpiricalValuation(
  listingPrice: number,
  historicalSalePrices: number[]
): ValuationResult {
  if (historicalSalePrices.length < 5) {
    throw new Error('Empirical valuation requires at least 5 completed sale records.');
  }

  const sorted = [...historicalSalePrices].sort((a, b) => a - b);
  const n = sorted.length;

  const p25Index = Math.floor(n * 0.25);
  const p75Index = Math.floor(n * 0.75);

  const marketMin = sorted[p25Index];
  const marketMax = sorted[p75Index];

  let tier: ValuationTier = 'FAIR_PRICE';
  if (listingPrice < marketMin) {
    tier = 'GREAT_DEAL';
  } else if (listingPrice > marketMax) {
    tier = 'OVERPRICED';
  }

  return {
    tier,
    marketMin,
    marketMax,
    valuationMode: 'EMPIRICAL_QUARTILES',
    sampleCount: n,
  };
}
