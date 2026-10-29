"use client";

import React, { useState, useId } from "react";
import {
  PredictionRequest,
  PredictionResponse,
  ResalePredictionRequest,
  NewPhonePredictionRequest,
  SmartphoneCatalogItem,
} from "@/lib/types";
import catalogueData from "@/data/catalogue.json";
import {
  Sparkles,
  AlertCircle,
  Loader2,
  Sliders,
  Cpu,
  ShieldCheck,
  PackageCheck,
  Info,
} from "lucide-react";

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
    description: "Flawless screen and housing, zero scratches, pristine condition.",
  },
  {
    grade: "Excellent",
    multiplier: "0.92x",
    description: "Minor micro-wear, zero screen blemishes or noticeable dents.",
  },
  {
    grade: "Good",
    multiplier: "0.82x",
    description: "Normal everyday scuffs on back/frame, screen fully intact with zero cracks.",
  },
  {
    grade: "Fair",
    multiplier: "0.68x",
    description: "Noticeable dents, deeper scratches, or frame chipping; fully operational.",
  },
  {
    grade: "Poor",
    multiplier: "0.50x",
    description: "Heavy cosmetic degradation, cracked glass, or required casing refurbishment.",
  },
] as const;

export function PredictionForm({ onPredictionSuccess, initialValues }: PredictionFormProps) {
  const brandSelectId = useId();
  const modelInputId = useId();
  const originalPriceId = useId();
  const verifiedPriceId = useId();
  const batteryHealthId = useId();
  const procTierId = useId();
  const batteryMahId = useId();

  // Mode Selection: Resale (Task B) vs New Phone Specs (Task A)
  const [valuationMode, setValuationMode] = useState<"resale" | "new_phone">("resale");

  // Shared State
  const [brand, setBrand] = useState<string>(initialValues?.brand || "Apple");
  const [model, setModel] = useState<string>(initialValues?.model || "iPhone 15 Pro");
  const [ramGb, setRamGb] = useState<number>(initialValues?.ram_gb || 8);
  const [storageGb, setStorageGb] = useState<number>(initialValues?.storage_gb || 256);

  // Resale Mode State (Task B)
  const [ageUnit, setAgeUnit] = useState<"months" | "years">("months");
  const [ageValue, setAgeValue] = useState<number>(
    "age_months" in (initialValues || {}) ? (initialValues as ResalePredictionRequest).age_months : 12
  );
  const [condition, setCondition] = useState<"Like New" | "Excellent" | "Good" | "Fair" | "Poor">(
    "condition" in (initialValues || {})
      ? (initialValues as ResalePredictionRequest).condition
      : "Excellent"
  );
  const [hasBatteryHealth, setHasBatteryHealth] = useState<boolean>(
    "battery_health" in (initialValues || {})
      ? (initialValues as ResalePredictionRequest).battery_health !== null &&
        (initialValues as ResalePredictionRequest).battery_health !== undefined
      : true
  );
  const [batteryHealth, setBatteryHealth] = useState<string>(
    "battery_health" in (initialValues || {}) && (initialValues as ResalePredictionRequest).battery_health
      ? String((initialValues as ResalePredictionRequest).battery_health)
      : "92"
  );
  const [warrantyMonths, setWarrantyMonths] = useState<number>(
    "warranty_months" in (initialValues || {})
      ? (initialValues as ResalePredictionRequest).warranty_months || 0
      : 0
  );
  const [hasBoxBill, setHasBoxBill] = useState<boolean>(
    "has_box_bill" in (initialValues || {})
      ? (initialValues as ResalePredictionRequest).has_box_bill ?? true
      : true
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    "original_price" in (initialValues || {})
      ? String((initialValues as ResalePredictionRequest).original_price)
      : "134900"
  );
  const [showVerifiedPrice, setShowVerifiedPrice] = useState<boolean>(false);
  const [verifiedPrice, setVerifiedPrice] = useState<string>("");

  // New Phone Mode State (Task A)
  const [processorTier, setProcessorTier] = useState<"Flagship" | "Upper-Midrange" | "Midrange" | "Budget">("Flagship");
  const [batteryMah, setBatteryMah] = useState<number>(5000);
  const [is5G, setIs5G] = useState<boolean>(true);

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocusedModel, setIsFocusedModel] = useState(false);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
    const item = (catalogueData as SmartphoneCatalogItem[]).find(
      (c) => c.brand.toLowerCase() === brand.toLowerCase() && c.model === selectedModel
    );
    if (item) {
      setRamGb(item.ram_gb);
      setStorageGb(item.storage_gb);
      setOriginalPrice(String(item.original_price));
      if (item.battery_mah) setBatteryMah(item.battery_mah);
      if (item.processor_tier) {
        setProcessorTier(item.processor_tier as "Flagship" | "Upper-Midrange" | "Midrange" | "Budget");
      }
    }
  };

  const applyPreset = (preset: {
    brand: string;
    model: string;
    ram_gb: number;
    storage_gb: number;
    age_months: number;
    condition: "Like New" | "Excellent" | "Good" | "Fair" | "Poor";
    battery_health: number;
    original_price: number;
    warranty_months?: number;
    has_box_bill?: boolean;
    processor_tier?: "Flagship" | "Upper-Midrange" | "Midrange" | "Budget";
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
    setWarrantyMonths(preset.warranty_months ?? 0);
    setHasBoxBill(preset.has_box_bill ?? true);
    if (preset.processor_tier) setProcessorTier(preset.processor_tier);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    setLoading(true);

    try {
      let requestPayload: PredictionRequest;

      if (valuationMode === "new_phone") {
        requestPayload = {
          valuation_task: "new_smartphone_retail_price",
          brand,
          model: model.trim() || "Custom Device",
          processor_tier: processorTier,
          ram_gb: ramGb,
          storage_gb: storageGb,
          battery_mah: batteryMah,
          is_5g: is5G,
        };
      } else {
        if (!model.trim()) {
          throw new Error("Please enter a valid smartphone model name.");
        }
        const parsedPrice = parseFloat(originalPrice);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          throw new Error("Please enter a valid original purchase price in ₹ (INR).");
        }
        const calculatedMonths = ageUnit === "years" ? Math.round(ageValue * 12) : ageValue;

        let parsedBattery: number | null = null;
        if (hasBatteryHealth) {
          parsedBattery = parseFloat(batteryHealth);
          if (isNaN(parsedBattery) || parsedBattery < 40 || parsedBattery > 100) {
            throw new Error("Battery health percentage must be between 40% and 100%.");
          }
        }

        requestPayload = {
          valuation_task: "used_smartphone_resale",
          brand,
          model: model.trim(),
          ram_gb: ramGb,
          storage_gb: storageGb,
          age_months: calculatedMonths,
          condition,
          battery_health: parsedBattery,
          warranty_months: warrantyMonths,
          has_box_bill: hasBoxBill,
          original_price: parsedPrice,
          verified_current_price: showVerifiedPrice && verifiedPrice ? parseFloat(verifiedPrice) : null,
        };
      }

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
            Multi-Task AI Valuation Intelligence
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory">
            Smartphone Valuation Calculator
          </h2>
          <p className="mt-2 text-base text-brand-grey font-normal">
            Choose your valuation goal below. We separate new-retail price prediction from used-device resale estimation to ensure scientific integrity.
          </p>
        </div>

        {/* Task Mode Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 p-1.5 rounded-xl bg-charcoal-800 border border-charcoal-600 gap-1.5">
          <button
            type="button"
            onClick={() => setValuationMode("resale")}
            className={`py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              valuationMode === "resale"
                ? "bg-brand-orange text-charcoal-950 shadow-subtle-card"
                : "text-brand-grey hover:text-brand-ivory hover:bg-charcoal-700/60"
            }`}
          >
            <Sliders className="w-4 h-4" />
            Task B: Used Resale Valuation
          </button>
          <button
            type="button"
            onClick={() => setValuationMode("new_phone")}
            className={`py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              valuationMode === "new_phone"
                ? "bg-brand-orange text-charcoal-950 shadow-subtle-card"
                : "text-brand-grey hover:text-brand-ivory hover:bg-charcoal-700/60"
            }`}
          >
            <Cpu className="w-4 h-4" />
            Task A: New Device Retail Price (Specs)
          </button>
        </div>

        {/* Quick Test Presets */}
        <div className="p-4 rounded-xl bg-charcoal-800 border border-charcoal-600 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-grey flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            Quick Benchmark Presets (1-Click Fill)
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setValuationMode("resale");
                applyPreset({
                  brand: "Apple",
                  model: "iPhone 15 Pro",
                  ram_gb: 8,
                  storage_gb: 256,
                  age_months: 12,
                  condition: "Like New",
                  battery_health: 93,
                  original_price: 134900,
                  warranty_months: 0,
                  has_box_bill: true,
                });
              }}
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-ivory border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              iPhone 15 Pro (1 Yr • Like New)
            </button>
            <button
              type="button"
              onClick={() => {
                setValuationMode("resale");
                applyPreset({
                  brand: "Samsung",
                  model: "Galaxy S24 Ultra",
                  ram_gb: 12,
                  storage_gb: 256,
                  age_months: 8,
                  condition: "Excellent",
                  battery_health: 97,
                  original_price: 129999,
                  warranty_months: 4,
                  has_box_bill: true,
                });
              }}
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-ivory border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              Galaxy S24 Ultra (8 Mos • Warranty)
            </button>
            <button
              type="button"
              onClick={() => {
                setValuationMode("new_phone");
                setBrand("OnePlus");
                setModel("OnePlus 12");
                setProcessorTier("Flagship");
                setRamGb(12);
                setStorageGb(256);
                setBatteryMah(5400);
                setIs5G(true);
              }}
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-beige border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              Task A: Flagship 5G Specs (12GB/256GB)
            </button>
            <button
              type="button"
              onClick={() => {
                setValuationMode("new_phone");
                setBrand("Redmi");
                setModel("Redmi Note 13 5G");
                setProcessorTier("Budget");
                setRamGb(6);
                setStorageGb(128);
                setBatteryMah(5000);
                setIs5G(true);
              }}
              className="px-3 py-1.5 rounded bg-charcoal-700 hover:bg-charcoal-600 text-xs font-medium text-brand-beige border border-charcoal-600 hover:border-brand-orange/40 transition-colors"
            >
              Task A: Budget 5G Tier (6GB/128GB)
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
                <div className="font-semibold">Input Validation Notice</div>
                <div>{formError}</div>
              </div>
            </div>
          )}

          {/* Row 1: Brand & Model Selection */}
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
                Model Name / Description
              </label>
              <input
                id={modelInputId}
                type="text"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                onFocus={() => setIsFocusedModel(true)}
                onBlur={() => setTimeout(() => setIsFocusedModel(false), 200)}
                placeholder="e.g. Galaxy S24 Ultra, iPhone 15 Pro"
                className="w-full px-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-colors"
                required={valuationMode === "resale"}
              />

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
                      <span className="text-[10px] text-brand-beige">Auto-fill catalogue specs</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Specific Mode Fields */}
          {valuationMode === "new_phone" ? (
            /* =======================================================
               Task A Fields: Hardware Specifications for New Retail
               ======================================================= */
            <div className="space-y-6 pt-2 border-t border-charcoal-700/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor={procTierId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
                    Processor & Chipset Tier
                  </label>
                  <select
                    id={procTierId}
                    value={processorTier}
                    onChange={(e) =>
                      setProcessorTier(e.target.value as "Flagship" | "Upper-Midrange" | "Midrange" | "Budget")
                    }
                    className="w-full px-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange transition-colors"
                  >
                    <option value="Flagship">Flagship (Snapdragon 8 Gen 3 / Apple A17-A18 / Dimensity 9300)</option>
                    <option value="Upper-Midrange">Upper-Midrange (Snapdragon 8s Gen 3 / 7+ Gen 3 / Dimensity 8300)</option>
                    <option value="Midrange">Midrange (Snapdragon 7s / 6 Gen 1 / Dimensity 7200)</option>
                    <option value="Budget">Budget Tier (Snapdragon 4 Gen 2 / Helio G99 / Unisoc)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor={batteryMahId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
                    Battery Capacity (mAh)
                  </label>
                  <input
                    id={batteryMahId}
                    type="number"
                    min="2500"
                    max="8000"
                    step="100"
                    value={batteryMah}
                    onChange={(e) => setBatteryMah(parseInt(e.target.value) || 5000)}
                    className="w-full px-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-2">
                  5G Cellular Connectivity
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIs5G(true)}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${
                      is5G
                        ? "bg-brand-orange text-charcoal-950 border-brand-orange"
                        : "bg-charcoal-900 text-brand-grey border-charcoal-600"
                    }`}
                  >
                    5G Enabled
                  </button>
                  <button
                    type="button"
                    onClick={() => setIs5G(false)}
                    className={`py-2 px-4 rounded-lg text-xs font-semibold border transition-all ${
                      !is5G
                        ? "bg-brand-orange text-charcoal-950 border-brand-orange"
                        : "bg-charcoal-900 text-brand-grey border-charcoal-600"
                    }`}
                  >
                    4G LTE Only
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =======================================================
               Task B Fields: Resale, Age, Condition, Battery & Warranty
               ======================================================= */
            <div className="space-y-6 pt-2 border-t border-charcoal-700/60">
              {/* Age in Months / Years */}
              <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-600 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige">
                      Operational Ownership Duration
                    </label>
                    <span className="text-xs text-brand-grey">
                      Non-linear depreciation curve calibrated across Indian secondary markets.
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

              {/* Physical Condition Grade */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige mb-3">
                  Physical Cosmetic & Functional Condition
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

              {/* Battery Health */}
              <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-600 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor={batteryHealthId} className="block text-xs font-semibold uppercase tracking-wider text-brand-beige">
                      Battery Health Percentage
                    </label>
                    <span className="text-xs text-brand-grey">
                      Threshold &lt;80% incurs a service penalty reflecting OEM battery replacement cost.
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-brand-grey hover:text-brand-ivory">
                    <input
                      type="checkbox"
                      checked={!hasBatteryHealth}
                      onChange={(e) => setHasBatteryHealth(!e.target.checked)}
                      className="rounded bg-charcoal-800 border-charcoal-600 text-brand-orange focus:ring-brand-orange accent-[#F28C45]"
                    />
                    Not Available (Android Default)
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
                    Model will impute typical expected capacity based on ownership age.
                  </div>
                )}
              </div>

              {/* Warranty & Documentation (Inspired by Reference B) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-orange" />
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-beige">
                      Remaining Warranty
                    </label>
                  </div>
                  <select
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-charcoal-800 border border-charcoal-600 text-brand-ivory text-xs focus:ring-1 focus:ring-brand-orange"
                  >
                    <option value="0">Expired / No Active Warranty</option>
                    <option value="3">3 Months Remaining</option>
                    <option value="6">6 Months Remaining</option>
                    <option value="9">9 Months Remaining</option>
                    <option value="12">Full 1 Year Active Warranty</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-600 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-brand-beige" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
                        Box & Invoice Bill
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-grey">
                      Possession of original retail invoice bill and packaging.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasBoxBill}
                    onChange={(e) => setHasBoxBill(e.target.checked)}
                    className="w-5 h-5 rounded bg-charcoal-800 border-charcoal-600 text-brand-orange focus:ring-brand-orange accent-[#F28C45]"
                  />
                </div>
              </div>

              {/* Original Purchase Price */}
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
                      className="w-full pl-8 pr-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={verifiedPriceId} className="block text-xs font-semibold uppercase tracking-wider text-brand-grey">
                      Verified Current Retail Price (Optional)
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
                        className="w-full pl-8 pr-4 py-3 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-charcoal-900/50 border border-charcoal-700/60 text-xs text-brand-grey">
                      Brand-new retail benchmark will be computed by our Task A model.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shared Memory Specs: RAM & Storage */}
          <div className="space-y-4 pt-2 border-t border-charcoal-700/60">
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
                          : "bg-charcoal-900 text-brand-grey border-charcoal-600 hover:text-brand-ivory"
                      }`}
                    >
                      {r} GB
                    </button>
                  );
                })}
              </div>
            </div>

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
                          : "bg-charcoal-900 text-brand-grey border-charcoal-600 hover:text-brand-ivory"
                      }`}
                    >
                      {s >= 1024 ? "1 TB" : `${s} GB`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-brand-orange text-charcoal-950 font-bold uppercase tracking-wider text-sm hover:bg-brand-orange-hover transition-colors shadow-subtle-card disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-charcoal-900"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running {valuationMode === "resale" ? "Resale Valuation" : "Retail Estimation"} Model...
                </>
              ) : (
                <>
                  {valuationMode === "resale" ? "Predict Resale Value (Task B)" : "Predict New Retail Price (Task A)"}
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
