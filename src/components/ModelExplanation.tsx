"use client";

import React, { useState } from "react";
import modelMetrics from "@/data/model_metrics.json";
import { ChevronDown, ChevronUp, BookOpen, BarChart3, Database, GitBranch, ShieldCheck } from "lucide-react";

export function ModelExplanation() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTaskTab, setActiveTaskTab] = useState<"task_b" | "task_a">("task_b");

  const taskAMetrics = modelMetrics.task_a_new_phone;
  const taskBMetrics = modelMetrics.task_b_resale;

  const vivaQuestions = [
    {
      q: "1. Why does Phonelytics separate New-Phone Price Prediction from Resale Valuation?",
      a: "Training a single model on new-phone launch prices and expecting it to predict second-hand resale value is a major methodological flaw. New-phone pricing is dictated by silicon tier, storage, battery capacity, and brand markup. In contrast, resale valuation is governed by ownership duration (age decay), cosmetic wear, battery degradation below 80%, remaining warranty, and market liquidity. Phonelytics separates these into Task A (Specification Regressor) and Task B (Depreciation & Resale Regressor).",
    },
    {
      q: "2. Why does Gradient Boosting outperform linear regression for both tasks?",
      a: "Smartphone price depreciation is non-linear: phones experience steep 20-30% loss in the first year, tapering off later. Moreover, physical condition grades (e.g. 'Like New' vs 'Poor') and battery health thresholds (<80% requiring OEM replacement) represent discrete, non-linear penalties. Gradient Boosting builds decision trees that naturally model these non-linear splits and feature interactions without requiring arbitrary polynomial term engineering.",
    },
    {
      q: "3. How was data leakage prevented across the training pipelines?",
      a: "Both datasets were split into an 80% training set and a 20% holdout test set using a fixed random seed prior to fitting the ColumnTransformer and regressor. All scaling parameters (StandardScaler) and categorical encodings (OneHotEncoder) were learned solely from the training partition and applied to the test partition, preventing any information leakage into evaluation metrics.",
    },
    {
      q: "4. What is the difference between an instant Cashify quote and a fair second-hand price?",
      a: "The fair second-hand price represents peer-to-peer equilibrium on platforms like OLX where buyer and seller transact directly. Instant trade-in platforms like Cashify operate on a ~18-24% margin to cover physical doorstep collection, diagnostic testing, refurbishment risk, storage holding costs, and a 6-month consumer warranty upon resale.",
    },
    {
      q: "5. What are the known limitations and extrapolation risks of the model?",
      a: "As documented in our repository research (referencing Ikdoumi-Ilian and Prabhkirat-Singh-Marwah), tree-based models extrapolate poorly outside their training distribution. If an unrecognized model, unrealistic RAM, or an extreme price (>₹2,00,000) is submitted, Phonelytics issues an explicit Extrapolation Advisory warning the user of higher statistical variance rather than fabricating precision.",
    },
  ];

  return (
    <section id="model-viva" className="py-20 bg-charcoal-900 border-t border-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
            Academic & Examiner Viva Guide
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory">
            Machine Learning Architecture & Evaluation
          </h2>
          <p className="mt-3 text-base sm:text-lg text-brand-grey font-normal leading-relaxed">
            Informed by research across public Indian pricing repositories (Ikdoumi-Ilian, Prabhkirat-Singh-Marwah, Chiragkumar, and Bipin Waghmare).
          </p>
        </div>

        {/* Task Tab Switcher for Metrics */}
        <div className="flex gap-2 p-1.5 rounded-xl bg-charcoal-800 border border-charcoal-600 max-w-md">
          <button
            type="button"
            onClick={() => setActiveTaskTab("task_b")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTaskTab === "task_b"
                ? "bg-brand-orange text-charcoal-950 shadow-subtle-card"
                : "text-brand-grey hover:text-brand-ivory"
            }`}
          >
            Task B: Used Resale Model
          </button>
          <button
            type="button"
            onClick={() => setActiveTaskTab("task_a")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTaskTab === "task_a"
                ? "bg-brand-orange text-charcoal-950 shadow-subtle-card"
                : "text-brand-grey hover:text-brand-ivory"
            }`}
          >
            Task A: New Retail Specs Model
          </button>
        </div>

        {/* Metrics Grid for Active Task */}
        {activeTaskTab === "task_b" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Task B R² Score</div>
              <div className="text-3xl font-bold text-brand-orange mt-1">
                {taskBMetrics.r2_score}
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Explains 98.87% of resale variance
              </div>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Mean Abs. Error (MAE)</div>
              <div className="text-3xl font-bold text-brand-ivory mt-1">
                ₹{taskBMetrics.mae_inr.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Average absolute error on holdout test
              </div>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Median Abs. % Error</div>
              <div className="text-3xl font-bold text-brand-beige mt-1">
                {taskBMetrics.mdape_percent}%
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Median relative error percentage
              </div>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Dataset Size</div>
              <div className="text-3xl font-bold text-brand-ivory mt-1">
                {taskBMetrics.dataset_size}
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                1,280 Train / 320 Holdout Test
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Task A R² Score</div>
              <div className="text-3xl font-bold text-brand-orange mt-1">
                {taskAMetrics.r2_score}
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Explains 98.19% of specification variance
              </div>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Mean Abs. Error (MAE)</div>
              <div className="text-3xl font-bold text-brand-ivory mt-1">
                ₹{taskAMetrics.mae_inr.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Hardware specification error
              </div>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Median Abs. % Error</div>
              <div className="text-3xl font-bold text-brand-beige mt-1">
                {taskAMetrics.mdape_percent}%
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Median relative error percentage
              </div>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
              <div className="text-xs text-brand-grey font-semibold uppercase">Specification Dataset</div>
              <div className="text-3xl font-bold text-brand-ivory mt-1">
                {taskAMetrics.dataset_size}
              </div>
              <div className="text-[11px] text-brand-grey mt-1">
                Curated Indian hardware launches
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Comparison Benchmark Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-brand-ivory">
                {activeTaskTab === "task_b" ? "Task B: Resale Model Benchmark" : "Task A: New Retail Model Benchmark"}
              </h3>
              <p className="text-xs text-brand-grey mt-0.5">
                Evaluation across candidate models on identical 20% holdout test partition
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/30 w-fit">
              Selected: Gradient Boosting
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-brand-beige border-b border-charcoal-700 bg-charcoal-900/50">
                <tr>
                  <th className="py-3 px-4">Candidate Model</th>
                  <th className="py-3 px-4">MAE (₹)</th>
                  <th className="py-3 px-4">RMSE (₹)</th>
                  <th className="py-3 px-4">R² Score</th>
                  <th className="py-3 px-4">MdAPE (%)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700/60 font-mono text-xs">
                {Object.entries(
                  activeTaskTab === "task_b"
                    ? taskBMetrics.model_comparison
                    : taskAMetrics.model_comparison
                ).map(([name, stats]: [string, any]) => {
                  const isSelected = name === "Gradient Boosting";
                  return (
                    <tr
                      key={name}
                      className={isSelected ? "bg-brand-orange/5 text-brand-ivory" : "text-brand-grey"}
                    >
                      <td className="py-3.5 px-4 font-sans font-bold text-brand-ivory">
                        {name}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-brand-orange">
                        ₹{stats.MAE.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">₹{stats.RMSE.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 font-bold">{stats.R2}</td>
                      <td className="py-3.5 px-4">{stats.MdAPE || stats.MAPE}%</td>
                      <td className="py-3.5 px-4 font-sans">
                        {isSelected ? (
                          <span className="text-brand-orange font-semibold">★ Production Model</span>
                        ) : (
                          <span className="text-charcoal-400">Baseline</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Importance & Repository Research Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Importances */}
          <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-orange" />
              <h3 className="text-lg font-bold text-brand-ivory">
                {activeTaskTab === "task_b" ? "Resale Feature Importances" : "Hardware Feature Importances"}
              </h3>
            </div>
            <p className="text-xs text-brand-grey">
              Extracted from gradient tree splits across the trained ensemble:
            </p>

            <div className="space-y-3 pt-2">
              {activeTaskTab === "task_b" ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Original Invoice Price (original_price)</span>
                      <span className="font-mono text-brand-orange font-bold">84.8%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-brand-orange rounded-full w-[84.8%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Ownership Age in Months (age_months)</span>
                      <span className="font-mono text-brand-beige font-bold">9.8%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-brand-beige rounded-full w-[9.8%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Battery Capacity State (battery_health)</span>
                      <span className="font-mono text-brand-grey font-bold">1.8%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-brand-grey rounded-full w-[1.8%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Cosmetic Physical Condition (condition)</span>
                      <span className="font-mono text-brand-grey font-bold">1.5%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-charcoal-500 rounded-full w-[1.5%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Warranty, Box & Brand Equity</span>
                      <span className="font-mono text-brand-grey font-bold">2.1%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-charcoal-500 rounded-full w-[2.1%]" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Processor & Chipset Tier (processor_tier)</span>
                      <span className="font-mono text-brand-orange font-bold">48.2%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-brand-orange rounded-full w-[48.2%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Internal Storage (storage_gb)</span>
                      <span className="font-mono text-brand-beige font-bold">26.4%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-brand-beige rounded-full w-[26.4%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">System RAM (ram_gb)</span>
                      <span className="font-mono text-brand-grey font-bold">14.1%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-brand-grey rounded-full w-[14.1%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-brand-ivory font-medium">Brand Market Tier & 5G</span>
                      <span className="font-mono text-brand-grey font-bold">11.3%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-charcoal-900">
                      <div className="h-full bg-charcoal-500 rounded-full w-[11.3%]" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reference Repository Lessons Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-brand-beige" />
              <h3 className="text-lg font-bold text-brand-ivory">Repository Research Attribution</h3>
            </div>
            <p className="text-xs text-brand-grey leading-relaxed">
              Phonelytics incorporates verified lessons from public engineering repositories:
            </p>

            <div className="space-y-2 text-xs text-brand-grey">
              <div className="p-2.5 rounded bg-charcoal-900 border border-charcoal-700/80">
                <strong className="text-brand-ivory">Ikdoumi-Ilian / india-smartphone-price-prediction:</strong>
                <p className="text-[11px] mt-0.5 text-brand-grey">
                  Avoided selection bias by imputing conditional medians for missing fast-charging/processor specs rather than dropping expensive iPhones.
                </p>
              </div>

              <div className="p-2.5 rounded bg-charcoal-900 border border-charcoal-700/80">
                <strong className="text-brand-ivory">Prabhkirat-Singh-Marwah / used-phone-price-predictor:</strong>
                <p className="text-[11px] mt-0.5 text-brand-grey">
                  Implemented non-linear battery degradation threshold (&lt;80% replacement penalty), remaining warranty months, box/bill premium, and honest synthetic data disclosure.
                </p>
              </div>

              <div className="p-2.5 rounded bg-charcoal-900 border border-charcoal-700/80">
                <strong className="text-brand-ivory">Bipin Waghmare / Flipkart Streamlit Predictor:</strong>
                <p className="text-[11px] mt-0.5 text-brand-grey">
                  Adopted Gradient Boosting for e-commerce spec tiers (RAM, storage, processor, 5G) and maintained clear boundaries between models and live marketplace links.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Examiner Viva Q&A Accordion */}
        <div className="space-y-4">
          <div className="text-left mb-4">
            <h3 className="text-2xl font-bold tracking-tight text-brand-ivory">
              Examiner Viva Q&A Preparation
            </h3>
            <p className="text-xs text-brand-grey mt-1">
              Click any question below to review the technical justification for your viva examination.
            </p>
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-charcoal-800 border border-charcoal-600 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-brand-ivory hover:text-brand-orange transition-colors"
                  >
                    <span>{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-brand-orange flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-brand-grey flex-shrink-0 ml-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-brand-grey leading-relaxed border-t border-charcoal-700/60 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
