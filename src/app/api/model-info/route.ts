import { NextResponse } from "next/server";
import modelMetrics from "@/data/model_metrics.json";

export async function GET() {
  return NextResponse.json(modelMetrics);
}
