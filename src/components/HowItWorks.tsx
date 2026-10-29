import React from "react";
import { Sliders, Cpu, LineChart } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Input Specifications",
      description:
        "Provide your smartphone brand, model name, RAM, internal storage, operational age, physical condition grade, and optional battery health percentage.",
      icon: Sliders,
    },
    {
      number: "02",
      title: "Machine Learning Evaluation",
      description:
        "Our trained Gradient Boosting regression model processes hardware attributes, applying non-linear technological depreciation curves calibrated on 1,400+ Indian market transactions.",
      icon: Cpu,
    },
    {
      number: "03",
      title: "Actionable Market Intelligence",
      description:
        "Understand your smartphone's fair second-hand peer-to-peer resale value, instant trade-in quote (such as Cashify), and explore direct shopping and resale search links.",
      icon: LineChart,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-charcoal-900 border-t border-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
            Structured Valuation Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory">
            How Phonelytics Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-brand-grey font-normal leading-relaxed">
            A three-step machine-learning pipeline designed to replace guesswork with data-backed smartphone valuation.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-8 rounded-xl glass-card hover:border-brand-orange/30 transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-charcoal-800 border border-charcoal-500/80 flex items-center justify-center text-brand-orange">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-mono font-bold text-charcoal-500/80">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-brand-ivory pt-2">
                  {step.title}
                </h3>

                <p className="text-sm text-brand-grey leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
