export type ValuationTaskType = "used_smartphone_resale" | "new_smartphone_retail_price";

export interface ResalePredictionRequest {
  valuation_task?: "used_smartphone_resale";
  brand: string;
  model: string;
  ram_gb: number;
  storage_gb: number;
  age_months: number;
  condition: "Like New" | "Excellent" | "Good" | "Fair" | "Poor";
  battery_health?: number | null;
  warranty_months?: number;
  has_box_bill?: boolean;
  original_price: number;
  verified_current_price?: number | null;
}

export interface NewPhonePredictionRequest {
  valuation_task: "new_smartphone_retail_price";
  brand: string;
  model?: string;
  processor_tier: "Flagship" | "Upper-Midrange" | "Midrange" | "Budget";
  ram_gb: number;
  storage_gb: number;
  battery_mah?: number;
  is_5g?: boolean;
}

export type PredictionRequest = ResalePredictionRequest | NewPhonePredictionRequest;

export interface FactorImpact {
  name: string;
  impact: "Positive" | "Neutral" | "Negative";
  summary: string;
  detail: string;
}

export interface ModelMetadata {
  model_name: string;
  algorithm: string;
  r2_score: number;
  mae_inr: number;
  rmse_inr?: number;
  mdape_percent?: number;
  dataset_size?: number;
  train_samples?: number;
  test_samples?: number;
}

export interface ResalePredictionResponse {
  valuation_task: "used_smartphone_resale";
  brand: string;
  model: string;
  estimated_second_hand_price: number;
  second_hand_range: {
    low: number;
    high: number;
  };
  estimated_new_market_price: number;
  estimated_tradein_quote: number;
  tradein_range: {
    low: number;
    high: number;
  };
  depreciation_percentage: number;
  factors: FactorImpact[];
  explainability_summary: string;
  extrapolation_warning?: string | null;
  model_metadata: ModelMetadata;
  external_links: {
    amazon_india_search: string;
    flipkart_search: string;
    cashify_sell_search: string;
    cashify_buy_search: string;
  };
  engine_source: "python_fastapi" | "serverless_ml_engine";
}

export interface NewPhonePredictionResponse {
  valuation_task: "new_smartphone_retail_price";
  brand: string;
  model: string;
  estimated_retail_price: number;
  indicative_range: {
    low: number;
    high: number;
  };
  specs_summary: {
    processor_tier: string;
    ram_gb: number;
    storage_gb: number;
    battery_mah?: number;
    is_5g?: boolean;
  };
  factors: FactorImpact[];
  explainability_summary: string;
  extrapolation_warning?: string | null;
  model_metadata: ModelMetadata;
  external_links: {
    amazon_india_search: string;
    flipkart_search: string;
    cashify_buy_search: string;
  };
  engine_source: "python_fastapi" | "serverless_ml_engine";
}

export type PredictionResponse = ResalePredictionResponse | NewPhonePredictionResponse;

export interface SmartphoneCatalogItem {
  brand: string;
  model: string;
  ram_gb: number;
  storage_gb: number;
  original_price: number;
  processor_tier?: string;
  battery_mah?: number;
  is_5g?: number;
}
