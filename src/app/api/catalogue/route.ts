import { NextResponse } from "next/server";
import catalogueData from "@/data/catalogue.json";

export async function GET() {
  return NextResponse.json(catalogueData);
}
