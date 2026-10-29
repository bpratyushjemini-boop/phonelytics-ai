"use client";

import React from "react";
import {
  PredictionResponse,
  PredictionRequest,
  ResalePredictionResponse,
  NewPhonePredictionResponse,
} from "@/lib/types";
import {
  ArrowUpRight,
  RotateCcw,
  Edit3,
  ShieldCheck,
  ShoppingBag,
  Info,
  AlertTriangle,
  Cpu,
  Sliders,
} from "lucide-react";

interface ResultsDashboardProps {
  result: PredictionResponse;
  requestData: PredictionRequest;
  onEdit: () => void;
  onReset: () => void;
}

export function ResultsDashboard({
  result,
  requestData,
  onEdit,
  onReset,
}: ResultsDashboardProps) {
  const isResale = result.valuation_task === "used_smartphone_resale";
  const resaleResult = isResale ? (result as ResalePredictionResponse) : null;
  const newPhoneResult = !isResale ? (result as NewPhonePredictionResponse) : null;

  const scrollToLinks = () => {
    const el = document.getElementById("market-links");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="results-dashboard" className="py-16 bg-charcoal-900 border-t border-charcoal-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Extrapolation Warning Alert (if applicable) */}
        {result.extrapolation_warning && (
          <div className="p-4 rounded-xl bg-charcoal-800 border border-brand-orange/60 flex items-start gap-3 text-xs text-brand-orange shadow-subtle-card">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-orange" />
            <div>
              <strong className="font-bold uppercase tracking-wider block">Model Extrapolation Advisory</strong>
              <span>{result.extrapolation_warning} Specifications lie near or outside standard training distributions. The valuation represents an approximate extrapolation rather than a dense empirical cluster.</span>
            </div>
          </div>
        )}

        {/* Device Header Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-600">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
                {isResale ? "Task B Valuation Intelligence" : "Task A Technical Specification Valuation"}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 border border-charcoal-600 text-brand-grey">
                {isResale ? "Used Hardware Depreciation" : "Brand-New Retail Model"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory mt-1">
              {result.brand} {result.model}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-brand-grey">
              {"ram_gb" in requestData && (
                <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                  {requestData.ram_gb} GB RAM • {requestData.storage_gb >= 1024 ? "1 TB" : `${requestData.storage_gb} GB`} Storage
                </span>
              )}
              {isResale && "age_months" in requestData && (
                <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                  {requestData.age_months} Months Old
                </span>
              )}
              {isResale && "condition" in requestData && (
                <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                  Condition: {requestData.condition}
                </span>
              )}
              {!isResale && newPhoneResult && (
                <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                  Chipset: {newPhoneResult.specs_summary.processor_tier}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-charcoal-800 border border-charcoal-600 text-xs font-medium text-brand-ivory hover:bg-charcoal-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Details
            </button>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-charcoal-800 border border-charcoal-600 text-xs font-medium text-brand-ivory hover:bg-charcoal-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New Valuation
            </button>
          </div>
        </div>

        {/* =============================================================
            VALUATION CARDS: Resale (Task B) vs New Phone (Task A)
           ============================================================= */}
        {isResale && resaleResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Estimated Second-Hand Resale Value (Peer-to-Peer) */}
            <div className="p-6 rounded-2xl glass-card border-2 border-brand-orange/70 shadow-subtle-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Second-Hand Resale
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange font-semibold">
                  Peer-to-Peer
                </span>
              </div>

              <div>
                <div className="text-xs text-brand-grey">Fair Peer-to-Peer Valuation</div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory mt-0.5">
                  ₹{resaleResult.estimated_second_hand_price.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
                <div className="flex justify-between text-xs text-brand-grey">
                  <span>Negotiation Range</span>
                  <span className="font-mono text-brand-ivory font-semibold">
                    ₹{resaleResult.second_hand_range.low.toLocaleString("en-IN")} – ₹{resaleResult.second_hand_range.high.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                  <span>Depreciation from new</span>
                  <span className="font-mono text-brand-beige font-semibold">
                    -{resaleResult.depreciation_percentage}%
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-brand-grey leading-relaxed">
                Fair direct transaction value if selling directly to an individual buyer on secondary marketplaces (e.g., OLX, peer exchanges).
              </p>
            </div>

            {/* Card 2: Estimated Instant Trade-In Quote (e.g. Cashify) */}
            <div className="p-6 rounded-2xl glass-card border border-charcoal-600/50 shadow-subtle-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-beige">
                  Instant Trade-In
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-charcoal-700 text-brand-grey font-semibold">
                  e.g. Cashify
                </span>
              </div>

              <div>
                <div className="text-xs text-brand-grey">Instant Buyback Estimate</div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-beige mt-0.5">
                  ₹{resaleResult.estimated_tradein_quote.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
                <div className="flex justify-between text-xs text-brand-grey">
                  <span>Indicative Quote Range</span>
                  <span className="font-mono text-brand-ivory font-semibold">
                    ₹{resaleResult.tradein_range.low.toLocaleString("en-IN")} – ₹{resaleResult.tradein_range.high.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                  <span>Platform Margin Deduction</span>
                  <span className="font-mono text-brand-grey">~20% (Logistics/Refurb)</span>
                </div>
              </div>

              <p className="text-[11px] text-brand-grey leading-relaxed">
                Doorstep liquidation quote. Deducts operator margin for diagnostic testing, pickup overhead, refurbishment risk, and consumer warranty.
              </p>
            </div>

            {/* Card 3: Brand-New Market Price */}
            <div className="p-6 rounded-2xl glass-card border border-charcoal-600/50 shadow-subtle-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
                  New Retail Shelf Value
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-charcoal-700 text-brand-grey font-semibold">
                  Store Retail
                </span>
              </div>

              <div>
                <div className="text-xs text-brand-grey">Current Brand-New Market Price</div>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory mt-0.5">
                  ₹{resaleResult.estimated_new_market_price.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
                <div className="flex justify-between text-xs text-brand-grey">
                  <span>Original Invoice Paid</span>
                  <span className="font-mono text-brand-ivory font-semibold">
                    {"original_price" in requestData ? `₹${requestData.original_price.toLocaleString("en-IN")}` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                  <span>Retail Price Adjustment</span>
                  <span className="font-mono text-brand-grey">
                    {"original_price" in requestData
                      ? `-(${(((requestData.original_price - resaleResult.estimated_new_market_price) / requestData.original_price) * 100).toFixed(1)}%)`
                      : "N/A"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-brand-grey leading-relaxed">
                Current store price if purchased brand-new today in sealed condition from authorized retailers.
              </p>
            </div>
          </div>
        ) : newPhoneResult ? (
          /* Task A Card: New Phone Retail Prediction */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-card border-2 border-brand-orange/70 shadow-subtle-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Estimated Brand-New Retail Price
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange font-semibold">
                  Specification Model
                </span>
              </div>

              <div>
                <div className="text-xs text-brand-grey">Estimated Launch / Retail Price in India</div>
                <div className="text-4xl font-bold tracking-tight text-brand-ivory mt-0.5">
                  ₹{newPhoneResult.estimated_retail_price.toLocaleString("en-IN")}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
                <div className="flex justify-between text-xs text-brand-grey">
                  <span>Indicative Market Range</span>
                  <span className="font-mono text-brand-ivory font-semibold">
                    ₹{newPhoneResult.indicative_range.low.toLocaleString("en-IN")} – ₹{newPhoneResult.indicative_range.high.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                  <span>Silicon Category</span>
                  <span className="font-mono text-brand-beige font-semibold">
                    {newPhoneResult.specs_summary.processor_tier}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-brand-grey leading-relaxed">
                Calculated by our Gradient Boosting specification regressor based on Indian market hardware launches.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card border border-charcoal-600/50 shadow-subtle-card space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-beige">
                  Hardware Specification Matrix
                </span>
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                    <div className="text-brand-grey">Memory</div>
                    <div className="font-bold text-brand-ivory mt-0.5">{newPhoneResult.specs_summary.ram_gb} GB RAM</div>
                  </div>
                  <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                    <div className="text-brand-grey">Storage</div>
                    <div className="font-bold text-brand-ivory mt-0.5">
                      {newPhoneResult.specs_summary.storage_gb >= 1024 ? "1 TB" : `${newPhoneResult.specs_summary.storage_gb} GB`}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                    <div className="text-brand-grey">Battery Capacity</div>
                    <div className="font-bold text-brand-ivory mt-0.5">{newPhoneResult.specs_summary.battery_mah} mAh</div>
                  </div>
                  <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                    <div className="text-brand-grey">Network</div>
                    <div className="font-bold text-brand-ivory mt-0.5">{newPhoneResult.specs_summary.is_5g ? "5G Cellular" : "4G LTE"}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={scrollToLinks}
                className="w-full py-2.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 border border-charcoal-600 text-xs font-semibold text-brand-beige uppercase tracking-wider transition-colors"
              >
                Compare Marketplace Listings →
              </button>
            </div>
          </div>
        ) : null}

        {/* Explainability Section: "Why this estimate?" */}
        <div className="p-6 sm:p-8 rounded-2xl glass-card border border-charcoal-600/50 space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
              Model Factor Explainability
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-brand-ivory mt-1">
              Why this estimate?
            </h3>
            <p className="mt-2 text-sm text-brand-grey leading-relaxed">
              {result.explainability_summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {result.factors.map((factor, idx) => {
              const isPos = factor.impact === "Positive";
              const isNeg = factor.impact === "Negative";
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-ivory">{factor.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isPos
                          ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/30"
                          : isNeg
                          ? "bg-charcoal-700 text-brand-grey border border-charcoal-600"
                          : "bg-charcoal-800 text-brand-beige border border-charcoal-700"
                      }`}
                    >
                      {factor.impact} Impact
                    </span>
                  </div>
                  <div className="text-xs text-brand-beige font-medium">{factor.summary}</div>
                  <p className="text-[11px] text-brand-grey leading-relaxed">{factor.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* External Market Comparison Links Section */}
        <div id="market-links" className="p-6 sm:p-8 rounded-2xl glass-card border border-charcoal-600/50 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-orange" />
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
                Verified Search Links
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-brand-ivory mt-1">
              Compare Buying & Resale Marketplaces
            </h3>
            <p className="mt-1 text-xs text-brand-grey">
              Direct search query links generated for: <strong className="text-brand-ivory">{result.brand} {result.model}</strong>.
            </p>
          </div>

          {/* Honest Data Disclosure */}
          <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700 text-xs text-brand-grey flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-beige flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-brand-ivory">Honest Data Disclosure: </strong>
              The links below construct direct search queries on official Indian shopping and trade-in websites. Phonelytics does not invent live private API quotes or fabricate temporary promotional discounts.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={result.external_links.amazon_india_search}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-600 hover:border-brand-orange/60 transition-colors group flex items-start justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-brand-beige uppercase">New / Renewed</div>
                <div className="text-base font-bold text-brand-ivory mt-0.5 group-hover:text-brand-orange transition-colors">
                  Amazon India
                </div>
                <p className="text-xs text-brand-grey mt-1">
                  View retail listings, verified buyer reviews, and Prime availability.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
            </a>

            <a
              href={result.external_links.flipkart_search}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-600 hover:border-brand-orange/60 transition-colors group flex items-start justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-brand-beige uppercase">New / Offers</div>
                <div className="text-base font-bold text-brand-ivory mt-0.5 group-hover:text-brand-orange transition-colors">
                  Flipkart India
                </div>
                <p className="text-xs text-brand-grey mt-1">
                  Inspect retail prices, exchange bonus schemes, and bank discount deals.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
            </a>

            {isResale && (
              <a
                href={result.external_links.cashify_sell_search}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-600 hover:border-brand-orange/60 transition-colors group flex items-start justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-brand-orange uppercase">Instant Buyback</div>
                  <div className="text-base font-bold text-brand-ivory mt-0.5 group-hover:text-brand-orange transition-colors">
                    Sell on Cashify
                  </div>
                  <p className="text-xs text-brand-grey mt-1">
                    Book doorstep pickup, on-spot hardware evaluation, and instant UPI payout.
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
              </a>
            )}

            <a
              href={result.external_links.cashify_buy_search}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-600 hover:border-brand-orange/60 transition-colors group flex items-start justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-brand-beige uppercase">Refurbished Market</div>
                <div className="text-base font-bold text-brand-ivory mt-0.5 group-hover:text-brand-orange transition-colors">
                  Buy Refurbished on Cashify
                </div>
                <p className="text-xs text-brand-grey mt-1">
                  Explore certified pre-owned smartphones with 32-point inspection and warranty.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
            </a>
          </div>
        </div>

        {/* Engine Source Badge */}
        <div className="flex items-center justify-between text-xs text-brand-grey pt-2 px-2">
          <span>
            Valuation Engine:{" "}
            <span className="font-mono text-brand-ivory">
              {result.engine_source === "python_fastapi"
                ? "Python FastAPI (Scikit-Learn GradientBoostingRegressor)"
                : "Serverless ML Regression Engine (Exported Pipeline Calibration)"}
            </span>
          </span>
          <span className="font-mono text-brand-beige">R² = {result.model_metadata.r2_score}</span>
        </div>
      </div>
    </section>
  );
}
