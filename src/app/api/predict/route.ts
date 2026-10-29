import { NextRequest, NextResponse } from "next/server";
import { runMLEnginePrediction } from "@/lib/ml-engine";
import { PredictionRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.brand || !body.model || !body.condition || !body.original_price) {
      return NextResponse.json(
        { error: "Missing required fields: brand, model, condition, and original_price are mandatory." },
        { status: 400 }
      );
    }

    const originalPrice = Number(body.original_price);
    if (isNaN(originalPrice) || originalPrice <= 0) {
      return NextResponse.json(
        { error: "Original purchase price must be a positive number in INR." },
        { status: 400 }
      );
    }

    const ageMonths = Number(body.age_months ?? 0);
    const ramGb = Number(body.ram_gb ?? 8);
    const storageGb = Number(body.storage_gb ?? 128);

    const validConditions = ["Like New", "Excellent", "Good", "Fair", "Poor"];
    if (!validConditions.includes(body.condition)) {
      return NextResponse.json(
        { error: `Invalid condition. Must be one of: ${validConditions.join(", ")}` },
        { status: 400 }
      );
    }

    const predictionReq: PredictionRequest = {
      brand: String(body.brand),
      model: String(body.model),
      ram_gb: ramGb,
      storage_gb: storageGb,
      age_months: ageMonths,
      condition: body.condition,
      battery_health: body.battery_health !== undefined && body.battery_health !== null ? Number(body.battery_health) : null,
      original_price: originalPrice,
      verified_current_price: body.verified_current_price ? Number(body.verified_current_price) : null,
    };

    // Check if external Python FastAPI backend is reachable
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:8008";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);

      const pythonRes = await fetch(`${pythonBackendUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(predictionReq),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (pythonRes.ok) {
        const pythonData = await pythonRes.json();
        return NextResponse.json({
          ...pythonData,
          engine_source: "python_fastapi",
        });
      }
    } catch {
      // Python backend not running locally or in this environment; proceed to native serverless ML engine
    }

    // Execute native ML regression engine
    const result = runMLEnginePrediction(predictionReq);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error during prediction calculation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
