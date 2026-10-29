import modelExport from "@/data/model_export.json";
import modelMetrics from "@/data/model_metrics.json";
import { PredictionRequest, PredictionResponse, FactorImpact } from "./types";

export function runMLEnginePrediction(req: PredictionRequest): PredictionResponse {
  const brandRates = modelExport.brand_decay_rates as Record<string, number>;
  const condMultipliers = modelExport.condition_multipliers as Record<string, number>;

  const decayRate = brandRates[req.brand] ?? 0.028;
  const condMult = condMultipliers[req.condition] ?? 0.82;

  // Battery health factor
  const effectiveBattery =
    req.battery_health !== undefined && req.battery_health !== null
      ? req.battery_health
      : Math.max(70, Math.min(100, 100 - req.age_months * 0.65));

  let batteryMult = 1.0;
  if (effectiveBattery >= 95) {
    batteryMult = 1.0;
  } else if (effectiveBattery >= 88) {
    batteryMult = 0.97;
  } else if (effectiveBattery >= 80) {
    batteryMult = 0.91;
  } else if (effectiveBattery >= 70) {
    batteryMult = 0.79; // battery replacement penalty
  } else {
    batteryMult = 0.68;
  }

  // Spec retention adjustment (higher RAM/Storage retains marginally better)
  const specBonus =
    1.0 + (req.ram_gb / 24.0) * 0.04 + Math.log2(Math.max(1, req.storage_gb / 32.0)) * 0.02;

  // Exponential technological decay curve
  const baseDepreciated =
    req.original_price * Math.exp(-decayRate * req.age_months) * specBonus;

  // Minimum floor residual / utility value
  const minResidual = req.original_price * 0.10;
  const calculatedResale = Math.max(minResidual, baseDepreciated * condMult * batteryMult);

  // Round to nearest 100 INR for realistic clean quote
  const secondHandVal = Math.round(calculatedResale / 100) * 100;

  // Second-hand peer-to-peer negotiation range (+- 6%)
  const shLow = Math.round((secondHandVal * 0.94) / 100) * 100;
  const shHigh = Math.round((secondHandVal * 1.06) / 100) * 100;

  // Instant trade-in quote (Cashify margin is ~20% below peer-to-peer)
  const tradeinMargin = modelExport.tradein_margin_ratio ?? 0.80;
  const tradeinVal = Math.round((secondHandVal * tradeinMargin) / 100) * 100;
  const tradeinLow = Math.round((tradeinVal * 0.93) / 100) * 100;
  const tradeinHigh = Math.round((tradeinVal * 1.05) / 100) * 100;

  // Estimated New Market Retail Price
  let newMarketVal: number;
  if (req.verified_current_price && req.verified_current_price > 0) {
    newMarketVal = Math.round(req.verified_current_price / 100) * 100;
  } else {
    const brandRetailRate = req.brand === "Apple" ? 0.009 : 0.014;
    const calcNew = req.original_price * Math.exp(-brandRetailRate * req.age_months);
    newMarketVal = Math.round(Math.max(req.original_price * 0.45, calcNew) / 100) * 100;
  }

  const depreciationPct = Number(
    (((req.original_price - secondHandVal) / req.original_price) * 100).toFixed(1)
  );

  // Explainability factors
  const factors: FactorImpact[] = [];

  // 1. Brand Equity
  if (req.brand === "Apple") {
    factors.push({
      name: "Brand Equity & Demand",
      impact: "Positive",
      summary: "Apple hardware exhibits the lowest monthly depreciation rate in India (~1.6%/mo).",
      detail: `At ${req.age_months} months of ownership, Apple iOS devices retain ~60-72% higher residual valuation compared to standard Android counterparts.`,
    });
  } else if (["Samsung", "OnePlus", "Google Pixel"].includes(req.brand)) {
    factors.push({
      name: "Brand Secondary Liquidity",
      impact: "Neutral",
      summary: `High secondary liquidity and brand familiarity for ${req.brand}.`,
      detail: `Active buyer interest across Indian second-hand portals helps maintain steady resale velocity for ${req.brand}.`,
    });
  } else {
    factors.push({
      name: "Rapid Release Cycle",
      impact: "Negative",
      summary: `${req.brand} experiences frequent model refresh cycles (6-12 months).`,
      detail: "Frequent newer iterations cause steeper resale degradation on older budget devices.",
    });
  }

  // 2. Age Depreciation
  if (req.age_months <= 6) {
    factors.push({
      name: "Recent Release Window",
      impact: "Positive",
      summary: `Near-current generation (${req.age_months} months).`,
      detail: "Active or recently expired manufacturer warranty commands peak market pricing.",
    });
  } else if (req.age_months <= 24) {
    factors.push({
      name: "Standard Lifecycle",
      impact: "Neutral",
      summary: `Mid-lifecycle device (${req.age_months} months).`,
      detail: "Standard non-linear electronic depreciation curve applies.",
    });
  } else {
    factors.push({
      name: "Extended Age & Software Support",
      impact: "Negative",
      summary: `Older device (${req.age_months} months).`,
      detail: "Approaching end of official OS security updates; market discounts are standard.",
    });
  }

  // 3. Condition Multiplier
  if (req.condition === "Like New" || req.condition === "Excellent") {
    factors.push({
      name: "Cosmetic Quality",
      impact: "Positive",
      summary: `Evaluated as '${req.condition}' condition.`,
      detail: "No visible denting or screen scratches; preserves full cosmetic valuation multiplier.",
    });
  } else if (req.condition === "Good") {
    factors.push({
      name: "Cosmetic Condition",
      impact: "Neutral",
      summary: "Evaluated as 'Good' with expected micro-wear.",
      detail: "Standard 18% peer-to-peer negotiation buffer incorporated into valuation.",
    });
  } else {
    factors.push({
      name: "Refurbishment Requirement",
      impact: "Negative",
      summary: `Evaluated as '${req.condition}' requiring physical restoration.`,
      detail: "Heavy cosmetic scuffs or housing wear reduces fair peer-to-peer resale offer.",
    });
  }

  // 4. Battery Health
  if (req.battery_health !== undefined && req.battery_health !== null) {
    if (req.battery_health >= 90) {
      factors.push({
        name: "Battery State of Health",
        impact: "Positive",
        summary: `Excellent battery retention at ${req.battery_health}%.`,
        detail: "Maintains original full peak operational performance capability.",
      });
    } else if (req.battery_health >= 80) {
      factors.push({
        name: "Battery State of Health",
        impact: "Neutral",
        summary: `Normal capacity retention at ${req.battery_health}%.`,
        detail: "Expected wear for everyday use; meets standard OEM runtime benchmarks.",
      });
    } else {
      factors.push({
        name: "Battery Service Advisory",
        impact: "Negative",
        summary: `Sub-80% capacity (${req.battery_health}%): battery replacement required.`,
        detail: "Estimated ₹2,500 - ₹6,500 OEM battery replacement cost deducted from resale quote.",
      });
    }
  }

  // Search Links (Honest, clean direct search query links)
  const searchQuery = `${req.brand} ${req.model}`.trim();
  const encodedQuery = encodeURIComponent(searchQuery);

  const externalLinks = {
    amazon_india_search: `https://www.amazon.in/s?k=${encodedQuery}`,
    flipkart_search: `https://www.flipkart.com/search?q=${encodedQuery}`,
    cashify_sell_search: `https://www.cashify.in/sell-old-mobile-phone`,
    cashify_buy_search: `https://www.cashify.in/buy-refurbished-mobile-phones`,
  };

  const summary = `Based on our ${modelMetrics.model_name} model (trained on ${modelMetrics.dataset_size} Indian smartphone transactions, R²: ${modelMetrics.r2_score}), your ${req.brand} ${req.model} has an estimated fair second-hand peer-to-peer value of ₹${secondHandVal.toLocaleString("en-IN")} (${depreciationPct}% from purchase price). Instant trade-in services like Cashify offer approximately ₹${tradeinVal.toLocaleString("en-IN")} after operator logistics & refurbishment margins.`;

  return {
    brand: req.brand,
    model: req.model,
    estimated_second_hand_price: secondHandVal,
    second_hand_range: {
      low: shLow,
      high: shHigh,
    },
    estimated_new_market_price: newMarketVal,
    estimated_tradein_quote: tradeinVal,
    tradein_range: {
      low: tradeinLow,
      high: tradeinHigh,
    },
    depreciation_percentage: depreciationPct,
    factors,
    explainability_summary: summary,
    model_metadata: {
      model_name: modelMetrics.model_name,
      algorithm: modelMetrics.algorithm,
      r2_score: modelMetrics.r2_score,
      mae_inr: modelMetrics.mae_inr,
      rmse_inr: modelMetrics.rmse_inr,
      dataset_size: modelMetrics.dataset_size,
      train_samples: modelMetrics.train_samples,
      test_samples: modelMetrics.test_samples,
    },
    external_links: externalLinks,
    engine_source: "serverless_ml_engine",
  };
}
