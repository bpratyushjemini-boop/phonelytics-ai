import { test } from "node:test";
import assert from "node:assert/strict";
import { runMLEnginePrediction } from "../src/lib/ml-engine";
import { PredictionRequest } from "../src/lib/types";

test("ML Engine calculates realistic resale prediction for iPhone 15 Pro", () => {
  const req: PredictionRequest = {
    brand: "Apple",
    model: "iPhone 15 Pro",
    ram_gb: 8,
    storage_gb: 256,
    age_months: 12,
    condition: "Like New",
    battery_health: 93.0,
    original_price: 134900,
  };

  const res = runMLEnginePrediction(req);

  assert.equal(res.brand, "Apple");
  assert.equal(res.model, "iPhone 15 Pro");
  assert.ok(res.estimated_second_hand_price > 80000);
  assert.ok(res.estimated_second_hand_price < 134900);
  // Cashify trade-in quote is lower than peer-to-peer
  assert.ok(res.estimated_tradein_quote < res.estimated_second_hand_price);
  assert.ok(res.second_hand_range.low <= res.second_hand_range.high);
  assert.ok(res.tradein_range.low <= res.tradein_range.high);
  assert.ok(res.factors.length >= 3);
  assert.ok(res.external_links.amazon_india_search.includes("amazon.in"));
  assert.ok(res.external_links.cashify_sell_search.includes("cashify.in"));
});

test("ML Engine reflects steep penalty for degraded battery health", () => {
  const baseReq: PredictionRequest = {
    brand: "Samsung",
    model: "Galaxy S23",
    ram_gb: 8,
    storage_gb: 256,
    age_months: 18,
    condition: "Good",
    original_price: 64999,
  };

  const resGoodBatt = runMLEnginePrediction({ ...baseReq, battery_health: 95.0 });
  const resBadBatt = runMLEnginePrediction({ ...baseReq, battery_health: 72.0 });

  assert.ok(resGoodBatt.estimated_second_hand_price > resBadBatt.estimated_second_hand_price);
  const badBattFactor = resBadBatt.factors.find((f) => f.name.includes("Battery"));
  assert.ok(badBattFactor);
  assert.equal(badBattFactor.impact, "Negative");
});

test("ML Engine reflects condition multiplier", () => {
  const baseReq: PredictionRequest = {
    brand: "OnePlus",
    model: "OnePlus 12",
    ram_gb: 12,
    storage_gb: 256,
    age_months: 8,
    condition: "Like New",
    battery_health: 98.0,
    original_price: 64999,
  };

  const resLikeNew = runMLEnginePrediction({ ...baseReq, condition: "Like New" });
  const resPoor = runMLEnginePrediction({ ...baseReq, condition: "Poor" });

  assert.ok(resLikeNew.estimated_second_hand_price > resPoor.estimated_second_hand_price);
  assert.ok(resLikeNew.depreciation_percentage < resPoor.depreciation_percentage);
});
