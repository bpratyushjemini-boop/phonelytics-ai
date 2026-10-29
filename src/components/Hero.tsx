"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { PhoneFallback } from "./3d/PhoneCanvas";

const PhoneCanvas = dynamic(() => import("./3d/PhoneCanvas"), {
  ssr: false,
  loading: () => (
    <PhoneFallback
      deviceModel="iPhone 15 Pro"
      priceText="₹89,400"
      tradeinText="₹71,500"
    />
  ),
});

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle text-xs font-semibold tracking-wider uppercase text-brand-beige">
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
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md text-sm font-semibold tracking-wide uppercase bg-brand-orange text-charcoal-950 hover:bg-brand-orange-hover transition-all duration-200 shadow-subtle-card focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-charcoal-900 cursor-pointer"
              >
                Check Now
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo("how-it-works")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md text-sm font-medium tracking-wide bg-charcoal-800 text-brand-ivory border border-charcoal-500 hover:border-brand-orange/40 hover:bg-charcoal-700 transition-colors cursor-pointer"
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

          {/* Right Column: Interactive 3D Smartphone Product Scene */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <PhoneCanvas
              deviceModel="iPhone 15 Pro"
              priceText="₹89,400"
              tradeinText="₹71,500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

