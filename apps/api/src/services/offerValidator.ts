/**
 * Split-Option & Bundle Bidding Validator
 *
 * Supports transparent offers against:
 * 1. The full bundle base price (purchaseOptionId is null)
 * 2. Individual split options (e.g. "Lens Only" or "Body Only") via purchaseOptionId
 *
 * Dynamically scales the 50% anti-lowball threshold to the chosen option price.
 */

export interface ValidateOfferInput {
  amount: number;
  listingBasePrice: number;
  purchaseOptionPrice?: number | null;
}

export interface OfferValidationResult {
  isValid: boolean;
  targetPrice: number;
  minimumAcceptableOffer: number;
  errorMessage?: string;
}

export function validateOfferThreshold(input: ValidateOfferInput): OfferValidationResult {
  // If bidding on a specific split option (e.g. Lens @ 29,000), use its price as target.
  // Otherwise, use the listing base price (e.g. Bundle @ 1,15,000).
  const targetPrice = input.purchaseOptionPrice != null && input.purchaseOptionPrice > 0
    ? input.purchaseOptionPrice
    : input.listingBasePrice;

  const minimumAcceptableOffer = Math.floor(targetPrice * 0.5);

  if (input.amount < minimumAcceptableOffer) {
    return {
      isValid: false,
      targetPrice,
      minimumAcceptableOffer,
      errorMessage: `Offer must be at least ₹${minimumAcceptableOffer.toLocaleString('en-IN')} (50% of the target price ₹${targetPrice.toLocaleString('en-IN')}).`,
    };
  }

  return {
    isValid: true,
    targetPrice,
    minimumAcceptableOffer,
  };
}
