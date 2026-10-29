"use client";

import React from "react";
import { PredictionResponse, PredictionRequest } from "@/lib/types";
import {
  ArrowUpRight,
  TrendingDown,
  RotateCcw,
  Edit3,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ShoppingBag,
  Info,
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
  const scrollToLinks = () => {
    const el = document.getElementById("market-links");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Bar chart percentage heights relative to original price
  const origPrice = requestData.original_price;
  const newMarketPct = Math.min(100, Math.round((result.estimated_new_market_price / origPrice) * 100));
  const secondHandPct = Math.min(100, Math.round((result.estimated_second_hand_price / origPrice) * 100));
  const tradeinPct = Math.min(100, Math.round((result.estimated_tradein_quote / origPrice) * 100));

  return (
    <section id="results-dashboard" className="py-16 bg-charcoal-900 border-t border-charcoal-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header / Device Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-charcoal-600">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
              Valuation Intelligence Report
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory mt-1">
              {result.brand} {result.model}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-brand-grey">
              <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                {requestData.ram_gb} GB RAM • {requestData.storage_gb} GB Storage
              </span>
              <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                {requestData.age_months} Months Old
              </span>
              <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                Condition: {requestData.condition}
              </span>
              {requestData.battery_health && (
                <span className="px-2.5 py-1 rounded bg-charcoal-800 border border-charcoal-600 font-medium">
                  Battery: {requestData.battery_health}%
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
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

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Estimated Second-Hand Value (Fair Peer-to-Peer) */}
          <div className="p-6 rounded-2xl bg-charcoal-800 border-2 border-brand-orange/60 shadow-subtle-card space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Second-Hand Market
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange font-semibold">
                Peer-to-Peer
              </span>
            </div>

            <div>
              <div className="text-xs text-brand-grey">Estimated Fair Value</div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory mt-0.5">
                ₹{result.estimated_second_hand_price.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
              <div className="flex justify-between text-xs text-brand-grey">
                <span>Indicative Range</span>
                <span className="font-mono text-brand-ivory font-semibold">
                  ₹{result.second_hand_range.low.toLocaleString("en-IN")} – ₹{result.second_hand_range.high.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                <span>Depreciation from new</span>
                <span className="font-mono text-brand-beige font-semibold">
                  -{result.depreciation_percentage}%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-brand-grey leading-relaxed">
              Fair direct transaction value if selling to an individual buyer (e.g., OLX, peer forums).
            </p>
          </div>

          {/* Card 2: Estimated Instant Trade-in Quote (Cashify) */}
          <div className="p-6 rounded-2xl bg-charcoal-800 border border-charcoal-600 shadow-subtle-card space-y-4">
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
                ₹{result.estimated_tradein_quote.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
              <div className="flex justify-between text-xs text-brand-grey">
                <span>Estimated Quote Range</span>
                <span className="font-mono text-brand-ivory font-semibold">
                  ₹{result.tradein_range.low.toLocaleString("en-IN")} – ₹{result.tradein_range.high.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                <span>Platform Margin Buffer</span>
                <span className="font-mono text-brand-grey">~20% (Logistics/Refurb)</span>
              </div>
            </div>

            <p className="text-[11px] text-brand-grey leading-relaxed">
              Instant doorstep liquidation. Reflects commercial buyback margin, warranty, and platform refurbishment overhead.
            </p>
          </div>

          {/* Card 3: Estimated New Market Buying Price */}
          <div className="p-6 rounded-2xl bg-charcoal-800 border border-charcoal-600 shadow-subtle-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
                New Retail Value
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-charcoal-700 text-brand-grey font-semibold">
                Store Retail
              </span>
            </div>

            <div>
              <div className="text-xs text-brand-grey">Current Brand-New Market Price</div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory mt-0.5">
                ₹{result.estimated_new_market_price.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-1">
              <div className="flex justify-between text-xs text-brand-grey">
                <span>Original Invoice Paid</span>
                <span className="font-mono text-brand-ivory font-semibold">
                  ₹{requestData.original_price.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-xs text-brand-grey pt-1 border-t border-charcoal-800">
                <span>Retail Price Drop</span>
                <span className="font-mono text-brand-grey">
                  -{(
                    ((requestData.original_price - result.estimated_new_market_price) /
                      requestData.original_price) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            <p className="text-[11px] text-brand-grey leading-relaxed">
              Current market price if purchased brand-new today in sealed condition from authorized retailers.
            </p>
          </div>
        </div>

        {/* Note on Real-World Inspection */}
        <div className="p-4 rounded-xl bg-charcoal-800 border border-charcoal-600/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
          <div className="text-xs text-brand-grey leading-relaxed">
            <strong className="text-brand-ivory font-semibold">Important Market Reality Note: </strong>
            These values are statistical estimations derived from our trained regression model. Final actual offers on Cashify or peer-to-peer exchanges depend on in-person hardware testing, screen touch calibration, biometric function, original invoice availability, and box accessories.
          </div>
        </div>

        {/* Visual Valuation Comparison Chart */}
        <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-ivory">Valuation Breakdown & Spread</h3>
              <p className="text-xs text-brand-grey mt-0.5">
                Relative equity distribution compared to original purchase price (₹{origPrice.toLocaleString("en-IN")})
              </p>
            </div>
            <button
              onClick={scrollToLinks}
              className="text-xs font-semibold text-brand-orange hover:underline hidden sm:block"
            >
              Compare Market Listings →
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {/* 1. Original Price (100%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-grey">Original Purchase Price</span>
                <span className="font-mono text-brand-ivory font-semibold">
                  ₹{origPrice.toLocaleString("en-IN")} (100%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-charcoal-900 overflow-hidden">
                <div className="h-full bg-charcoal-500 rounded-full w-full" />
              </div>
            </div>

            {/* 2. Current New Retail Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-grey">Current Brand-New Market Price</span>
                <span className="font-mono text-brand-ivory font-semibold">
                  ₹{result.estimated_new_market_price.toLocaleString("en-IN")} ({newMarketPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-charcoal-900 overflow-hidden">
                <div
                  className="h-full bg-brand-ivory/70 rounded-full transition-all duration-700"
                  style={{ width: `${newMarketPct}%` }}
                />
              </div>
            </div>

            {/* 3. Second-Hand Peer-to-Peer Price */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-orange font-semibold">
                  Fair Second-Hand Resale Value (Peer-to-Peer)
                </span>
                <span className="font-mono text-brand-orange font-bold">
                  ₹{result.estimated_second_hand_price.toLocaleString("en-IN")} ({secondHandPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-charcoal-900 overflow-hidden">
                <div
                  className="h-full bg-brand-orange rounded-full transition-all duration-700"
                  style={{ width: `${secondHandPct}%` }}
                />
              </div>
            </div>

            {/* 4. Instant Trade-in Quote */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-brand-beige">Instant Trade-In Quote (Cashify Estimate)</span>
                <span className="font-mono text-brand-beige font-semibold">
                  ₹{result.estimated_tradein_quote.toLocaleString("en-IN")} ({tradeinPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-charcoal-900 overflow-hidden">
                <div
                  className="h-full bg-brand-beige/80 rounded-full transition-all duration-700"
                  style={{ width: `${tradeinPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Explainability: "Why this estimate?" */}
        <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
              Model Explainability
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
        <div id="market-links" className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-6">
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
              Direct search query links generated for your selected model: <strong className="text-brand-ivory">{result.brand} {result.model}</strong>.
            </p>
          </div>

          {/* Data integrity badge */}
          <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700 text-xs text-brand-grey">
            <span className="font-semibold text-brand-ivory">Honest Data Disclosure: </span>
            The cards below provide verified direct search query links to official Indian shopping and trade-in portals. Phonelytics does not invent live retail discounts or pretend to scrape unauthorized private APIs.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amazon India */}
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
                  Search new listings, customer reviews, and prime delivery options.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
            </a>

            {/* Flipkart */}
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
                  Check retail listings, exchange bonuses, and festive sales.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
            </a>

            {/* Cashify Sell */}
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
                  Doorstep pickup, on-spot evaluation, and instant UPI bank payment.
                </p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-brand-grey group-hover:text-brand-orange transition-colors flex-shrink-0 ml-2" />
            </a>

            {/* Cashify Buy Refurbished */}
            <a
              href={result.external_links.cashify_buy_search}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-charcoal-900 border border-charcoal-600 hover:border-brand-orange/60 transition-colors group flex items-start justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-brand-beige uppercase">Refurbished Buying</div>
                <div className="text-base font-bold text-brand-ivory mt-0.5 group-hover:text-brand-orange transition-colors">
                  Buy Refurbished on Cashify
                </div>
                <p className="text-xs text-brand-grey mt-1">
                  Browse certified pre-owned devices with warranty and 32-point inspection.
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
