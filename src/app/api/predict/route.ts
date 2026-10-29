import { NextRequest, NextResponse } from "next/server";
import { runMLEnginePrediction, runResalePrediction, runNewPhonePrediction } from "@/lib/ml-engine";
import { ResalePredictionRequest, NewPhonePredictionRequest, PredictionRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = body.valuation_task || "used_smartphone_resale";

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8008";

    // -------------------------------------------------------------------------
    // Task A: New Phone Retail Price Estimation (Specifications)
    // -------------------------------------------------------------------------
    if (task === "new_smartphone_retail_price") {
      if (!body.brand || !body.ram_gb || !body.storage_gb) {
        return NextResponse.json(
          { error: "Missing required specifications: brand, ram_gb, and storage_gb are mandatory for retail prediction." },
          { status: 400 }
        );
      }

      const newPhoneReq: NewPhonePredictionRequest = {
        valuation_task: "new_smartphone_retail_price",
        brand: String(body.brand),
        model: body.model ? String(body.model) : "Custom Specification Device",
        processor_tier: body.processor_tier || "Midrange",
        ram_gb: Number(body.ram_gb),
        storage_gb: Number(body.storage_gb),
        battery_mah: body.battery_mah ? Number(body.battery_mah) : 5000,
        is_5g: body.is_5g !== undefined ? Boolean(body.is_5g) : true,
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1800);
        const pythonRes = await fetch(`${pythonBackendUrl}/predict/new-phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPhoneReq),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (pythonRes.ok) {
          const data = await pythonRes.json();
          return NextResponse.json({ ...data, engine_source: "python_fastapi" });
        }
      } catch {
        // Fallback to serverless ML engine
      }

      const nativeResult = runNewPhonePrediction(newPhoneReq);
      return NextResponse.json(nativeResult);
    }

    // -------------------------------------------------------------------------
    // Task B: Used Smartphone Resale Valuation (Age, Condition, Battery, Wear)
    // -------------------------------------------------------------------------
    if (!body.brand || !body.model || !body.condition || !body.original_price) {
      return NextResponse.json(
        { error: "Missing required fields: brand, model, condition, and original_price are mandatory for resale valuation." },
        { status: 400 }
      );
    }

    const originalPrice = Number(body.original_price);
    if (isNaN(originalPrice) || originalPrice <= 0) {
      return NextResponse.json(
        { error: "Original purchase price must be a positive number in INR (₹)." },
        { status: 400 }
      );
    }

    const validConditions = ["Like New", "Excellent", "Good", "Fair", "Poor"];
    if (!validConditions.includes(body.condition)) {
      return NextResponse.json(
        { error: `Invalid condition grade. Must be one of: ${validConditions.join(", ")}` },
        { status: 400 }
      );
    }

    const resaleReq: ResalePredictionRequest = {
      valuation_task: "used_smartphone_resale",
      brand: String(body.brand),
      model: String(body.model),
      ram_gb: Number(body.ram_gb ?? 8),
      storage_gb: Number(body.storage_gb ?? 128),
      age_months: Number(body.age_months ?? 12),
      condition: body.condition,
      battery_health: body.battery_health !== undefined && body.battery_health !== null ? Number(body.battery_health) : null,
      warranty_months: body.warranty_months ? Number(body.warranty_months) : 0,
      has_box_bill: body.has_box_bill !== undefined ? Boolean(body.has_box_bill) : true,
      original_price: originalPrice,
      verified_current_price: body.verified_current_price ? Number(body.verified_current_price) : null,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const pythonRes = await fetch(`${pythonBackendUrl}/predict/resale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resaleReq),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (pythonRes.ok) {
        const data = await pythonRes.json();
        return NextResponse.json({ ...data, engine_source: "python_fastapi" });
      }
    } catch {
      // Fallback to serverless ML engine
    }

    const nativeResult = runResalePrediction(resaleReq);
    return NextResponse.json(nativeResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during prediction calculation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
