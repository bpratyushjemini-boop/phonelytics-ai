"use client";

import React, { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-charcoal-600/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
            <div className="w-8 h-8 rounded-lg bg-charcoal-700 border border-brand-orange/40 flex items-center justify-center shadow-subtle-card">
              <div className="w-3.5 h-3.5 rounded-sm bg-brand-orange" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-ivory">
              Phone<span className="text-brand-orange">lytics</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-grey">
            <button
              onClick={() => scrollTo("hero")}
              className="hover:text-brand-ivory transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="hover:text-brand-ivory transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo("predict-section")}
              className="hover:text-brand-ivory transition-colors"
            >
              Predict
            </button>
            <button
              onClick={() => scrollTo("model-viva")}
              className="hover:text-brand-ivory transition-colors"
            >
              ML Model & Viva
            </button>
            <button
              onClick={() => scrollTo("about")}
              className="hover:text-brand-ivory transition-colors"
            >
              About
            </button>
          </div>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollTo("predict-section")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-brand-orange text-charcoal-950 hover:bg-brand-orange-hover transition-colors shadow-subtle-card focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-charcoal-900"
            >
              Check Now
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-grey hover:text-brand-ivory hover:bg-charcoal-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal-800 border-b border-charcoal-600 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => scrollTo("hero")}
            className="block w-full text-left py-2 text-base font-medium text-brand-ivory hover:text-brand-orange"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="block w-full text-left py-2 text-base font-medium text-brand-grey hover:text-brand-ivory"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("predict-section")}
            className="block w-full text-left py-2 text-base font-medium text-brand-grey hover:text-brand-ivory"
          >
            Predict
          </button>
          <button
            onClick={() => scrollTo("model-viva")}
            className="block w-full text-left py-2 text-base font-medium text-brand-grey hover:text-brand-ivory"
          >
            ML Model & Viva
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="block w-full text-left py-2 text-base font-medium text-brand-grey hover:text-brand-ivory"
          >
            About
          </button>
          <div className="pt-2">
            <button
              onClick={() => scrollTo("predict-section")}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-md text-sm font-semibold uppercase tracking-wider bg-brand-orange text-charcoal-950 hover:bg-brand-orange-hover transition-colors"
            >
              Check Now
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
