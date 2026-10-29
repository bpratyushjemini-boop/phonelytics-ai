"use client";

import React, { useState } from "react";
import modelMetrics from "@/data/model_metrics.json";
import { ChevronDown, ChevronUp, Cpu, Award, BookOpen, BarChart3, Database } from "lucide-react";

export function ModelExplanation() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: "1. Why is smartphone price prediction framed as a supervised regression task?",
      a: "Supervised learning utilizes labeled datasets where historical features (brand, RAM, age, condition, original price) map to continuous numeric targets (market value in ₹). Since resale price is a continuous quantity rather than discrete classes, regression algorithms (like Gradient Boosting) are mathematically suited to optimize squared or absolute error.",
    },
    {
      q: "2. Why does Gradient Boosting outperform linear regression for this problem?",
      a: "Smartphone price depreciation is inherently non-linear: a device loses the most value in its first 12 months, followed by an asymptotic flattening. Furthermore, condition grades (e.g. 'Like New' vs 'Poor') act as non-linear step-function penalties, and brand retention varies sharply between Apple (1.6%/mo) and budget Android (2.8%/mo). Tree-based ensembles naturally capture these non-linearities and cross-feature interactions without requiring complex polynomial transformations.",
    },
    {
      q: "3. How are categorical variables preprocessed in the pipeline?",
      a: "Categorical attributes ('brand' and 'condition') are transformed using scikit-learn's OneHotEncoder(handle_unknown='ignore'). This encodes each brand and condition into orthogonal binary columns, preventing the regression model from mistakenly inferring false ordinal relationships (e.g., Apple > Samsung > Xiaomi numerically). Numerical features (RAM, storage, age, battery, original price) are normalized using StandardScaler.",
    },
    {
      q: "4. How was data leakage prevented during model validation?",
      a: "The dataset was strictly split into an 80% training set (1,120 samples) and a 20% holdout test set (280 samples) using a fixed random seed prior to fitting the ColumnTransformer and regressor. All scaling parameters and one-hot encodings were learned solely from the training partition and applied to the test partition, ensuring unbiased validation metrics.",
    },
    {
      q: "5. What are the key limitations of this valuation model?",
      a: "First, actual second-hand pricing is subject to localized demand spikes, city-tier differences (Metro vs Tier-3), and festive promotional discounts (e.g., Diwali or Big Billion Days). Second, physical cosmetic condition in production requires subjective self-reporting unless verified by computer-vision screen scanning. Third, carrier locks and unoriginal replacement parts are not currently modeled.",
    },
  ];

  return (
    <section id="model-viva" className="py-20 bg-charcoal-900 border-t border-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-brand-orange" />
            Academic & Viva Documentation
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory">
            Machine Learning Architecture & Viva Guide
          </h2>
          <p className="mt-3 text-base sm:text-lg text-brand-grey font-normal leading-relaxed">
            A transparent breakdown of dataset provenance, feature preprocessing, ensemble training, evaluation metrics, and core viva concepts.
          </p>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
            <div className="text-xs text-brand-grey font-semibold uppercase">R² Determination</div>
            <div className="text-3xl font-bold text-brand-orange mt-1">
              {modelMetrics.r2_score}
            </div>
            <div className="text-[11px] text-brand-grey mt-1">
              Explains 98.89% of price variance
            </div>
          </div>

          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
            <div className="text-xs text-brand-grey font-semibold uppercase">Mean Abs. Error (MAE)</div>
            <div className="text-3xl font-bold text-brand-ivory mt-1">
              ₹{modelMetrics.mae_inr.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-brand-grey mt-1">
              Average absolute error per prediction
            </div>
          </div>

          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
            <div className="text-xs text-brand-grey font-semibold uppercase">Root Mean Sq. Error</div>
            <div className="text-3xl font-bold text-brand-ivory mt-1">
              ₹{modelMetrics.rmse_inr.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-brand-grey mt-1">
              Penalizes rare larger deviations
            </div>
          </div>

          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-600">
            <div className="text-xs text-brand-grey font-semibold uppercase">Dataset Size</div>
            <div className="text-3xl font-bold text-brand-beige mt-1">
              {modelMetrics.dataset_size}
            </div>
            <div className="text-[11px] text-brand-grey mt-1">
              1,120 Train / 280 Holdout Test
            </div>
          </div>
        </div>

        {/* Model Comparison Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-brand-ivory">
                Algorithm Evaluation & Selection
              </h3>
              <p className="text-xs text-brand-grey mt-0.5">
                Benchmark evaluation on identical 20% holdout validation partition
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
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
                  <th className="py-3 px-4">MAPE (%)</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700/60 font-mono text-xs">
                {Object.entries(modelMetrics.model_comparison).map(([name, stats]: [string, any]) => {
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
                      <td className="py-3.5 px-4">{stats.MAPE}%</td>
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

        {/* Feature Importance & Preprocessing Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Importances */}
          <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-orange" />
              <h3 className="text-lg font-bold text-brand-ivory">Feature Relative Importance</h3>
            </div>
            <p className="text-xs text-brand-grey">
              Extracted from Gini impurity / gradient splitting weights of the ensemble regressor:
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-ivory font-medium">Original Invoice Price (original_price)</span>
                  <span className="font-mono text-brand-orange font-bold">85.1%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-900">
                  <div className="h-full bg-brand-orange rounded-full w-[85.1%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-ivory font-medium">Operational Age in Months (age_months)</span>
                  <span className="font-mono text-brand-beige font-bold">9.5%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-900">
                  <div className="h-full bg-brand-beige rounded-full w-[9.5%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-ivory font-medium">Battery Capacity State (battery_health)</span>
                  <span className="font-mono text-brand-grey font-bold">1.7%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-900">
                  <div className="h-full bg-brand-grey rounded-full w-[1.7%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-ivory font-medium">Cosmetic Physical Condition (condition)</span>
                  <span className="font-mono text-brand-grey font-bold">1.4%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-900">
                  <div className="h-full bg-charcoal-500 rounded-full w-[1.4%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-ivory font-medium">Brand Tier & Memory Specs (brand, ram, storage)</span>
                  <span className="font-mono text-brand-grey font-bold">2.3%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-900">
                  <div className="h-full bg-charcoal-500 rounded-full w-[2.3%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Provenance & Preprocessing */}
          <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-beige" />
              <h3 className="text-lg font-bold text-brand-ivory">Dataset Provenance & Specs</h3>
            </div>
            <p className="text-xs text-brand-grey leading-relaxed">
              Trained on 1,400+ curated smartphone transaction observations spanning Apple India, Samsung, OnePlus, Xiaomi, Redmi, Realme, Vivo, Oppo, Motorola, and Google Pixel.
            </p>

            <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-700/80 space-y-2 text-xs text-brand-grey">
              <div>
                <strong className="text-brand-ivory">Preprocessing Pipeline:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1 text-brand-grey">
                  <li><code className="text-brand-beige">OneHotEncoder</code> on brand and condition to prevent false ordinal bias.</li>
                  <li><code className="text-brand-beige">StandardScaler</code> on RAM, storage, age, battery, and original price.</li>
                  <li>Reproducible fixed seed (random_state=42) across train/test splits.</li>
                </ul>
              </div>
              <div className="pt-2 border-t border-charcoal-800">
                <strong className="text-brand-ivory">Deployment Strategy:</strong> Next.js frontend with dual Python FastAPI backend + zero-downtime serverless ML inference.
              </div>
            </div>
          </div>
        </div>

        {/* Viva Q&A Accordion */}
        <div className="space-y-4">
          <div className="text-left mb-4">
            <h3 className="text-2xl font-bold tracking-tight text-brand-ivory">
              Examiner Viva Q&A Preparation
            </h3>
            <p className="text-xs text-brand-grey mt-1">
              Click any question below to view the technical justification for your viva examination.
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
