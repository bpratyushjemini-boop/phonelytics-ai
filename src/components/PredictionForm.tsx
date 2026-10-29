"use client";

import React, { useState, useId } from "react";
import { PredictionRequest, PredictionResponse, SmartphoneCatalogItem } from "@/lib/types";
import catalogueData from "@/data/catalogue.json";
import { Sparkles, AlertCircle, Loader2, CheckCircle2, HelpCircle } from "lucide-react";

interface PredictionFormProps {
  onPredictionSuccess: (result: PredictionResponse, requestData: PredictionRequest) => void;
  initialValues?: PredictionRequest | null;
}

const BRANDS = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Redmi",
  "Realme",
  "Vivo",
  "Oppo",
  "Motorola",
  "Google Pixel",
  "Other",
];

const RAM_OPTIONS = [2, 3, 4, 6, 8, 12, 16, 24];
const STORAGE_OPTIONS = [32, 64, 128, 256, 512, 1024];

const CONDITIONS = [
  {
    grade: "Like New",
    multiplier: "1.0x",
    description: "Flawless screen and housing, no scratches, feels fresh out of the box.",
  },
  {
    grade: "Excellent",
    multiplier: "0.92x",
    description: "Extremely minor micro-wear, zero screen blemishes or noticeable dents.",
  },
  {
    grade: "Good",
    multiplier: "0.82x",
    description: "Normal everyday scuffs on back/frame, screen fully intact with zero cracks.",
  },
  {
    grade: "Fair",
    multiplier: "0.68x",
    description: "Noticeable dents, deeper scratches, or casing wear; fully functional.",
  },
  {
    grade: "Poor",
    multiplier: "0.50x",
    description: "Heavy cosmetic wear, cracked glass or camera lens, body chipping.",
  },
] as const;

export function PredictionForm({ onPredictionSuccess, initialValues }: PredictionFormProps) {
  const brandSelectId = useId();
  const modelInputId = useId();
  const originalPriceId = useId();
  const verifiedPriceId = useId();
  const batteryHealthId = useId();

  // Form State
  const [brand, setBrand] = useState<string>(initialValues?.brand || "Apple");
  const [model, setModel] = useState<string>(initialValues?.model || "iPhone 15 Pro");
  const [ramGb, setRamGb] = useState<number>(initialValues?.ram_gb || 8);
  const [storageGb, setStorageGb] = useState<number>(initialValues?.storage_gb || 256);
  
  // Age Mode (Months vs Years)
  const [ageUnit, setAgeUnit] = useState<"months" | "years">("months");
  const [ageValue, setAgeValue] = useState<number>(initialValues?.age_months || 12);
  
  // Condition
  const [condition, setCondition] = useState<"Like New" | "Excellent" | "Good" | "Fair" | "Poor">(
    initialValues?.condition || "Excellent"
  );
  
  // Battery Health
  const [hasBatteryHealth, setHasBatteryHealth] = useState<boolean>(
    initialValues?.battery_health !== undefined && initialValues?.battery_health !== null
  );
  const [batteryHealth, setBatteryHealth] = useState<string>(
    initialValues?.battery_health ? String(initialValues.battery_health) : "92"
  );
  
  // Pricing
  const [originalPrice, setOriginalPrice] = useState<string>(
    initialValues?.original_price ? String(initialValues.original_price) : "134900"
  );
  const [showVerifiedPrice, setShowVerifiedPrice] = useState<boolean>(
    Boolean(initialValues?.verified_current_price)
  );
  const [verifiedPrice, setVerifiedPrice] = useState<string>(
    initialValues?.verified_current_price ? String(initialValues.verified_current_price) : ""
  );

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocusedModel, setIsFocusedModel] = useState(false);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Model suggestions logic
  const handleModelChange = (value: string) => {
    setModel(value);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    const matching = (catalogueData as SmartphoneCatalogItem[])
      .filter(
        (item) =>
          item.brand.toLowerCase() === brand.toLowerCase() &&
          item.model.toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => item.model);
    setSuggestions(Array.from(new Set(matching)).slice(0, 5));
  };

  const selectSuggestion = (selectedModel: string) => {
    setModel(selectedModel);
    setSuggestions([]);
    // Auto-fill typical specs from catalogue if available
    const item = (catalogueData as SmartphoneCatalogItem[]).find(
      (c) => c.brand.toLowerCase() === brand.toLowerCase() && c.model === selectedModel
    );
    if (item) {
      setRamGb(item.ram_gb);
      setStorageGb(item.storage_gb);
      setOriginalPrice(String(item.original_price));
    }
  };

  // Quick Preset Helper
  const applyPreset = (preset: {
    brand: string;
    model: string;
    ram_gb: number;
    storage_gb: number;
    age_months: number;
    condition: "Like New" | "Excellent" | "Good" | "Fair" | "Poor";
    battery_health: number;
    original_price: number;
  }) => {
    setBrand(preset.brand);
    setModel(preset.model);
    setRamGb(preset.ram_gb);
    setStorageGb(preset.storage_gb);
    setAgeUnit("months");
    setAgeValue(preset.age_months);
    setCondition(preset.condition);
    setHasBatteryHealth(true);
    setBatteryHealth(String(preset.battery_health));
    setOriginalPrice(String(preset.original_price));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form Validations
    if (!model.trim()) {
      setFormError("Please enter a valid smartphone model name.");
      return;
    }

    const parsedPrice = parseFloat(originalPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Please enter a valid original purchase price in ₹ (INR).");
      return;
    }

    const calculatedMonths = ageUnit === "years" ? Math.round(ageValue * 12) : ageValue;
    if (calculatedMonths < 0 || calculatedMonths > 120) {
      setFormError("Device age must be between 0 and 120 months (10 years).");
      return;
    }

    let parsedBattery: number | null = null;
    if (hasBatteryHealth) {
      parsedBattery = parseFloat(batteryHealth);
      if (isNaN(parsedBattery) || parsedBattery < 40 || parsedBattery > 100) {
        setFormError("Battery health percentage must be between 40% and 100%.");
        return;
      }
    }

    const requestPayload: PredictionRequest = {
      brand,
      model: model.trim(),
      ram_gb: ramGb,
      storage_gb: storageGb,
      age_months: calculatedMonths,
      condition,
      battery_health: parsedBattery,
      original_price: parsedPrice,
      verified_current_price: showVerifiedPrice && verifiedPrice ? parseFloat(verifiedPrice) : null,
    };

    setLoading(true);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error status ${response.status}`);
      }

      const result: PredictionResponse = await response.json();
      onPredictionSuccess(result, requestPayload);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred during prediction.";
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="predict-section" className="py-16 bg-charcoal-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
            Interactive AI Valuation Model
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory">
            Smartphone Valuation Calculator
          </h2>
          <p className="mt-2 text-base text-brand-grey font-normal">
            Enter device specifications to calculate second-hand market value, instant trade-in quotes, and feature explainability.
          </p>
        </div>

        {/* Quick Test Presets */}
        <div className="mb-8 p-4 rounded-xl bg-charcoal-800 border border-charcoal-600 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-grey flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            Quick Test Presets (1-Click Fill)
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  brand: "Apple",
                  model: "iPhone 15 Pro",
                  ram_gb: 8,
                  storage_gb: 256,
                  age_months: 12,
                  condition: "Like New",
                  battery_health: 93,
                  original_price: 134900,
                })
              }
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-ivory border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              iPhone 15 Pro (1 Yr • Like New)
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  brand: "Samsung",
                  model: "Galaxy S24 Ultra",
                  ram_gb: 12,
                  storage_gb: 256,
                  age_months: 8,
                  condition: "Excellent",
                  battery_health: 97,
                  original_price: 129999,
                })
              }
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-ivory border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              Galaxy S24 Ultra (8 Mos • Excellent)
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  brand: "OnePlus",
                  model: "OnePlus 12",
                  ram_gb: 12,
                  storage_gb: 256,
                  age_months: 10,
                  condition: "Good",
                  battery_health: 94,
                  original_price: 64999,
                })
              }
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-ivory border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              OnePlus 12 (10 Mos • Good)
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset({
                  brand: "Redmi",
                  model: "Redmi Note 13 Pro+ 5G",
                  ram_gb: 8,
                  storage_gb: 256,
                  age_months: 14,
                  condition: "Fair",
                  battery_health: 86,
                  original_price: 29999,
                })
              }
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-ivory border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              Redmi Note 13 Pro+ (14 Mos • Fair)
            </button>
          </div>
        </div>

        {/* Prediction Form Container */}
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-charcoal-800 border border-charcoal-600 shadow-subtle-card space-y-8"
        >
          {formError && (
            <div className="p-4 rounded-lg bg-charcoal-900 border border-brand-orange/50 flex items-start gap-3 text-sm text-brand-orange">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Validation Error</div>
                <div>{formError}</div>
              </div>
            </div>
          )}

          {/* Row 1: Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor={brandSelectId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
                Smartphone Brand
              </label>
              <select
                id={brandSelectId}
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setSuggestions([]);
                }}
                className="w-full px-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-charcoal-900 text-brand-ivory">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label htmlFor={modelInputId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
                Model Name
              </label>
              <input
                id={modelInputId}
                type="text"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                onFocus={() => setIsFocusedModel(true)}
                onBlur={() => setTimeout(() => setIsFocusedModel(false), 200)}
                placeholder="e.g. iPhone 15 Pro, Galaxy S24"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors"
                required
              />

              {/* Suggestions dropdown */}
              {isFocusedModel && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-charcoal-900 border border-charcoal-600 rounded-lg shadow-2xl overflow-hidden">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => selectSuggestion(sug)}
                      className="w-full text-left px-4 py-2.5 text-xs text-brand-ivory hover:bg-charcoal-700 border-b border-charcoal-700/50 last:border-0 flex items-center justify-between"
                    >
                      <span>{sug}</span>
                      <span className="text-[10px] text-brand-beige">Auto-fill specs</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: RAM Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
              System RAM (Memory)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {RAM_OPTIONS.map((r) => {
                const isSelected = ramGb === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRamGb(r)}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-brand-orange text-charcoal-950 border-brand-orange shadow-subtle-card"
                        : "bg-charcoal-900 text-brand-grey border-charcoal-600 hover:text-brand-ivory hover:border-charcoal-500"
                    }`}
                  >
                    {r} GB
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Internal Storage Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
              Internal Storage Capacity
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STORAGE_OPTIONS.map((s) => {
                const isSelected = storageGb === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStorageGb(s)}
                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-brand-orange text-charcoal-950 border-brand-orange shadow-subtle-card"
                        : "bg-charcoal-900 text-brand-grey border-charcoal-600 hover:text-brand-ivory hover:border-charcoal-500"
                    }`}
                  >
                    {s >= 1024 ? "1 TB" : `${s} GB`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Device Age & Unit Toggle */}
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-600 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige">
                  Phone Age / Ownership Duration
                </label>
                <span className="text-xs text-brand-grey">
                  Non-linear technological depreciation curve applies over operational months.
                </span>
              </div>
              <div className="inline-flex rounded-lg bg-charcoal-800 p-1 border border-charcoal-600">
                <button
                  type="button"
                  onClick={() => {
                    if (ageUnit === "years") {
                      setAgeValue(Math.round(ageValue * 12));
                      setAgeUnit("months");
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    ageUnit === "months"
                      ? "bg-brand-orange text-charcoal-950"
                      : "text-brand-grey hover:text-brand-ivory"
                  }`}
                >
                  Months
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ageUnit === "months") {
                      setAgeValue(Math.max(1, Math.round(ageValue / 12)));
                      setAgeUnit("years");
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    ageUnit === "years"
                      ? "bg-brand-orange text-charcoal-950"
                      : "text-brand-grey hover:text-brand-ivory"
                  }`}
                >
                  Years
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max={ageUnit === "years" ? 8 : 72}
                value={ageValue}
                onChange={(e) => setAgeValue(parseInt(e.target.value) || 0)}
                className="w-full accent-[#F28C45] bg-charcoal-700 h-2 rounded-lg cursor-pointer"
              />
              <span className="min-w-[80px] text-right text-sm font-mono font-bold text-brand-orange">
                {ageValue} {ageUnit}
              </span>
            </div>
          </div>

          {/* Row 5: Physical Condition */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-3">
              Physical Cosmetic & Operational Condition
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {CONDITIONS.map((c) => {
                const isSelected = condition === c.grade;
                return (
                  <button
                    key={c.grade}
                    type="button"
                    onClick={() => setCondition(c.grade)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "bg-charcoal-700 border-brand-orange ring-1 ring-brand-orange"
                        : "bg-charcoal-900 border-charcoal-600 hover:border-charcoal-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-ivory">{c.grade}</span>
                        <span className="text-[10px] font-mono text-brand-beige">{c.multiplier}</span>
                      </div>
                      <p className="text-[11px] text-brand-grey mt-1 line-clamp-3 leading-snug">
                        {c.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 6: Battery Health */}
          <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-600 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor={batteryHealthId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige">
                  Battery Health Percentage
                </label>
                <span className="text-xs text-brand-grey">
                  Capacity below 80% triggers an OEM service warning and replacement deduction.
                </span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-brand-grey hover:text-brand-ivory">
                <input
                  type="checkbox"
                  checked={!hasBatteryHealth}
                  onChange={(e) => setHasBatteryHealth(!e.target.checked)}
                  className="rounded bg-charcoal-800 border-charcoal-600 text-brand-orange focus:ring-brand-orange accent-[#F28C45]"
                />
                Not Available / Android N/A
              </label>
            </div>

            {hasBatteryHealth ? (
              <div className="flex items-center gap-4">
                <input
                  id={batteryHealthId}
                  type="range"
                  min="50"
                  max="100"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  className="w-full accent-[#F28C45] bg-charcoal-700 h-2 rounded-lg cursor-pointer"
                />
                <span className="min-w-[60px] text-right text-sm font-mono font-bold text-brand-orange">
                  {batteryHealth}%
                </span>
              </div>
            ) : (
              <div className="text-xs text-brand-grey italic py-1">
                Model will calculate average expected battery retention based on {ageValue} {ageUnit} of use.
              </div>
            )}
          </div>

          {/* Row 7: Original Purchase Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div>
              <label htmlFor={originalPriceId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
                Original Purchase Price in India (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey font-semibold">
                  ₹
                </span>
                <input
                  id={originalPriceId}
                  type="number"
                  min="1000"
                  max="400000"
                  step="100"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 134900"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors"
                  required
                />
              </div>
              <span className="text-[11px] text-brand-grey mt-1 block">
                Invoice amount or launch retail price paid when bought.
              </span>
            </div>

            {/* Optional Verified Current Price Toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={verifiedPriceId} className="block text-xs font-semibold uppercase tracking-wider text-brand-grey">
                  Current Brand-New Market Price (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowVerifiedPrice(!showVerifiedPrice)}
                  className="text-xs text-brand-beige hover:underline"
                >
                  {showVerifiedPrice ? "Hide" : "+ Specify"}
                </button>
              </div>

              {showVerifiedPrice ? (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-grey font-semibold">
                    ₹
                  </span>
                  <input
                    id={verifiedPriceId}
                    type="number"
                    min="1000"
                    step="100"
                    value={verifiedPrice}
                    onChange={(e) => setVerifiedPrice(e.target.value)}
                    placeholder="e.g. 119900"
                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors"
                  />
                  <span className="text-[11px] text-brand-grey mt-1 block">
                    Use if you know the exact verified current new-retail price on Amazon/Flipkart.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-charcoal-900/50 border border-charcoal-700/60 text-xs text-brand-grey">
                  Current brand-new market price will be estimated by our retail regression model.
                </div>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-brand-orange text-charcoal-950 font-bold uppercase tracking-wider text-sm hover:bg-brand-orange-hover transition-colors shadow-subtle-card disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-charcoal-900"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running Machine Learning Model...
                </>
              ) : (
                <>
                  Predict Phone Value
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
