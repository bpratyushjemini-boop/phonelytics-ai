import { test } from "node:test";
import assert from "node:assert/strict";
import { runResalePrediction, runNewPhonePrediction, runMLEnginePrediction } from "../src/lib/ml-engine";
import { ResalePredictionRequest, NewPhonePredictionRequest } from "../src/lib/types";

test("Task B: ML Engine calculates realistic resale prediction for iPhone 15 Pro", () => {
  const req: ResalePredictionRequest = {
    valuation_task: "used_smartphone_resale",
    brand: "Apple",
    model: "iPhone 15 Pro",
    ram_gb: 8,
    storage_gb: 256,
    age_months: 12,
    condition: "Like New",
    battery_health: 93.0,
    warranty_months: 0,
    has_box_bill: true,
    original_price: 134900,
  };

  const res = runResalePrediction(req);

  assert.equal(res.valuation_task, "used_smartphone_resale");
  assert.equal(res.brand, "Apple");
  assert.equal(res.model, "iPhone 15 Pro");
  assert.ok(res.estimated_second_hand_price > 80000);
  assert.ok(res.estimated_second_hand_price < 134900);
  assert.ok(res.estimated_tradein_quote < res.estimated_second_hand_price);
  assert.ok(res.second_hand_range.low <= res.second_hand_range.high);
  assert.ok(res.tradein_range.low <= res.tradein_range.high);
  assert.ok(res.factors.length >= 3);
  assert.ok(res.external_links.amazon_india_search.includes("amazon.in"));
  assert.ok(res.external_links.cashify_sell_search.includes("cashify.in"));
});

test("Task A: ML Engine predicts new smartphone retail price from hardware specs", () => {
  const req: NewPhonePredictionRequest = {
    valuation_task: "new_smartphone_retail_price",
    brand: "Samsung",
    model: "Galaxy S24",
    processor_tier: "Flagship",
    ram_gb: 8,
    storage_gb: 256,
    battery_mah: 4000,
    is_5g: true,
  };

  const res = runNewPhonePrediction(req);

  assert.equal(res.valuation_task, "new_smartphone_retail_price");
  assert.equal(res.brand, "Samsung");
  assert.ok(res.estimated_retail_price > 45000);
  assert.ok(res.indicative_range.low <= res.indicative_range.high);
  assert.ok(res.factors.length >= 2);
  assert.equal(res.engine_source, "serverless_ml_engine");
});

test("Task B: Battery health degradation inflicts steep replacement penalty", () => {
  const baseReq: ResalePredictionRequest = {
    brand: "Samsung",
    model: "Galaxy S23",
    ram_gb: 8,
    storage_gb: 256,
    age_months: 18,
    condition: "Good",
    original_price: 64999,
  };

  const resGoodBatt = runResalePrediction({ ...baseReq, battery_health: 95.0 });
  const resBadBatt = runResalePrediction({ ...baseReq, battery_health: 72.0 });

  assert.ok(resGoodBatt.estimated_second_hand_price > resBadBatt.estimated_second_hand_price);
  const badBattFactor = resBadBatt.factors.find((f) => f.name.includes("Battery"));
  assert.ok(badBattFactor);
  assert.equal(badBattFactor.impact, "Negative");
});

test("Task B: Active warranty and original box/bill command a resale premium", () => {
  const baseReq: ResalePredictionRequest = {
    brand: "OnePlus",
    model: "OnePlus 12",
    ram_gb: 12,
    storage_gb: 256,
    age_months: 6,
    condition: "Like New",
    battery_health: 99.0,
    original_price: 64999,
  };

  const resWithWarranty = runResalePrediction({ ...baseReq, warranty_months: 6, has_box_bill: true });
  const resNoWarranty = runResalePrediction({ ...baseReq, warranty_months: 0, has_box_bill: false });

  assert.ok(resWithWarranty.estimated_second_hand_price > resNoWarranty.estimated_second_hand_price);
});

test("Task B: Extrapolation warning triggers on out-of-distribution inputs", () => {
  const outOfDistReq: ResalePredictionRequest = {
    brand: "Apple",
    model: "iPhone 11",
    ram_gb: 4,
    storage_gb: 64,
    age_months: 70, // > 60 months
    condition: "Poor",
    original_price: 240000, // > 200,000 INR
  };

  const res = runResalePrediction(outOfDistReq);
  assert.ok(res.extrapolation_warning !== null);
  assert.ok(res.extrapolation_warning.includes("outside typical training bounds"));
});
