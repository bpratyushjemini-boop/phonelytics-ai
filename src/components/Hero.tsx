"use client";

import React from "react";
import { ArrowDown, Sparkles, ShieldCheck, Activity } from "lucide-react";

export function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-orange/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-700 border border-charcoal-500/60 text-xs font-semibold tracking-wider uppercase text-brand-beige">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              AI-Powered Smartphone Intelligence
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-ivory leading-[1.08]">
              Know the worth.
              <br />
              <span className="text-brand-orange">Make the move.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-brand-grey max-w-xl font-normal leading-relaxed">
              Predict smartphone prices, compare buying options, and discover resale potential — all in one place.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollTo("predict-section")}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold tracking-wide uppercase bg-brand-orange text-charcoal-950 hover:bg-brand-orange-hover transition-all duration-200 shadow-subtle-card focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-charcoal-900"
              >
                Check Now
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo("how-it-works")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium tracking-wide bg-charcoal-800 text-brand-ivory border border-charcoal-500 hover:border-brand-orange/40 hover:bg-charcoal-700 transition-colors"
              >
                How It Works
              </button>
            </div>

            {/* Highlights Bar */}
            <div className="pt-8 border-t border-charcoal-600/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="text-2xl font-bold text-brand-ivory">0.988</div>
                <div className="text-xs text-brand-grey mt-0.5">Model R² Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-orange">₹1,991</div>
                <div className="text-xs text-brand-grey mt-0.5">Mean Abs. Error</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-ivory">1,400+</div>
                <div className="text-xs text-brand-grey mt-0.5">Indian Market Data</div>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated 3D Smartphone Product Composition */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="phone-viewport relative w-[310px] sm:w-[340px] h-[520px] sm:h-[560px] flex items-center justify-center">
              {/* Outer burnt-orange rim highlight glow */}
              <div className="absolute inset-0 bg-brand-orange/10 blur-2xl rounded-full scale-90 pointer-events-none" />

              {/* 3D Smartphone Container */}
              <div className="phone-3d-model animate-phone-float relative w-[260px] sm:w-[280px] h-[500px] sm:h-[530px] rounded-[48px] p-3 bg-gradient-to-b from-[#2B2B2B] via-[#1E1E1E] to-[#141414] shadow-2xl border-2 border-brand-orange/40">
                {/* Metallic Edge Trim */}
                <div className="w-full h-full rounded-[40px] bg-charcoal-950 border border-charcoal-600/80 p-3.5 relative overflow-hidden flex flex-col justify-between">
                  {/* Top Bezel / Dynamic Island */}
                  <div className="relative z-10 flex items-center justify-between px-2 pt-1">
                    <span className="text-[10px] font-semibold text-brand-grey tracking-wider">9:41</span>
                    {/* Punch-hole / Dynamic Island */}
                    <div className="w-20 h-4 bg-charcoal-900 rounded-full border border-charcoal-700/80 flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-charcoal-950" />
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
                    </div>
                    {/* Status icons */}
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2 bg-brand-grey rounded-[1px]" />
                      <div className="w-1.5 h-2 bg-brand-orange rounded-[1px]" />
                    </div>
                  </div>

                  {/* Glass Reflection effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none rounded-[40px]" />

                  {/* Screen Content: Live Interactive Valuation Preview */}
                  <div className="relative z-10 space-y-3.5 my-auto px-1">
                    {/* Device Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-charcoal-600">
                      <div>
                        <div className="text-[11px] font-semibold text-brand-beige uppercase tracking-wider">Market Analysis</div>
                        <div className="text-sm font-bold text-brand-ivory">iPhone 15 Pro</div>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-charcoal-700 text-[10px] font-medium text-brand-grey border border-charcoal-600">
                        256 GB
                      </div>
                    </div>

                    {/* Valuation Card */}
                    <div className="p-3.5 rounded-xl bg-charcoal-800/90 border border-charcoal-600 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-brand-grey">Fair Peer-to-Peer</span>
                        <span className="text-[10px] font-medium text-brand-beige">Est. Resale</span>
                      </div>
                      <div className="text-2xl font-bold tracking-tight text-brand-orange">
                        ₹89,400
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-charcoal-700/80 text-brand-grey">
                        <span>Original: ₹1,34,900</span>
                        <span className="text-brand-beige font-semibold">-33.7%</span>
                      </div>
                    </div>

                    {/* Trade-in Quote Preview */}
                    <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-beige" />
                        <span className="text-brand-ivory text-[11px]">Cashify Trade-in</span>
                      </div>
                      <span className="font-semibold text-brand-ivory text-[12px]">₹71,500</span>
                    </div>

                    {/* Intelligence Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded bg-charcoal-800 border border-charcoal-700">
                        <div className="text-brand-grey">Condition</div>
                        <div className="font-semibold text-brand-ivory mt-0.5">Like New (1.0x)</div>
                      </div>
                      <div className="p-2 rounded bg-charcoal-800 border border-charcoal-700">
                        <div className="text-brand-grey">Battery Health</div>
                        <div className="font-semibold text-brand-ivory mt-0.5">93% (Healthy)</div>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="relative z-10 w-24 h-1 bg-charcoal-500 rounded-full mx-auto mb-1" />
                </div>
              </div>

              {/* Floating Real-time badge beside phone */}
              <div className="absolute -bottom-4 -left-4 sm:-left-6 p-3 rounded-xl bg-charcoal-800/95 border border-charcoal-500/80 shadow-2xl backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-brand-orange" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-brand-ivory">Explainable Valuation</div>
                  <div className="text-[10px] text-brand-grey">Real regression, zero hardcoded quotes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
