"use client";

import React from "react";
import { Github, ArrowUp, ShieldAlert } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal-950 border-t border-charcoal-600/80 pt-16 pb-12 text-xs text-brand-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-charcoal-800 border border-brand-orange/40 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-brand-orange" />
              </div>
              <span className="text-lg font-bold tracking-tight text-brand-ivory">
                Phone<span className="text-brand-orange">lytics</span>
              </span>
            </div>
            <p className="text-brand-beige font-medium">Know the worth. Make the move.</p>
            <p className="max-w-sm text-brand-grey leading-relaxed">
              AI-powered smartphone price prediction and resale intelligence designed for the Indian secondary market.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-ivory">
              Application
            </div>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => scrollTo("hero")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("how-it-works")}
                  className="hover:text-brand-orange transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("predict-section")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Valuation Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("model-viva")}
                  className="hover:text-brand-orange transition-colors"
                >
                  ML Model & Viva Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("about")}
                  className="hover:text-brand-orange transition-colors"
                >
                  About & Tech Stack
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Open Source & Code */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-ivory">
              Open Source
            </div>
            <div className="space-y-2">
              <a
                href="https://github.com/pratyushjemini/phonelytics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-600 text-brand-ivory hover:border-brand-orange/40 hover:text-brand-orange transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
              <div className="text-[11px] text-brand-grey">
                Licensed under the <span className="text-brand-beige font-semibold">MIT License</span>.
                Clean, reproducible Python & Next.js codebase.
              </div>
            </div>
          </div>
        </div>

        {/* Academic & Trademark Disclaimer */}
        <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-2 text-[11px] leading-relaxed text-brand-grey">
          <div className="flex items-center gap-1.5 font-semibold text-brand-ivory">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-orange" />
            Educational Use & Third-Party Trademark Disclaimer
          </div>
          <p>
            Phonelytics is an academic AI Applications project. Valuations are algorithmic estimates computed by our regression pipeline and do not constitute guaranteed commercial trade-in or retail offers.
          </p>
          <p>
            All third-party brand names, trademarks, and logos (including Apple, Samsung, OnePlus, Xiaomi, Redmi, Realme, Vivo, Oppo, Motorola, Google Pixel, Cashify, Amazon, and Flipkart) are the property of their respective owners and are used strictly for nominative identification and educational demonstration purposes. Phonelytics is not affiliated with, endorsed by, or sponsored by any of these entities.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-charcoal-700/60 text-[11px]">
          <div>
            © {new Date().getFullYear()} Phonelytics. AI Applications Practical Project.
          </div>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-brand-grey hover:text-brand-orange transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
