export interface PredictionRequest {
  brand: string;
  model: string;
  ram_gb: number;
  storage_gb: number;
  age_months: number;
  condition: "Like New" | "Excellent" | "Good" | "Fair" | "Poor";
  battery_health?: number | null;
  original_price: number;
  verified_current_price?: number | null;
}

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
  rmse_inr: number;
  dataset_size?: number;
  train_samples?: number;
  test_samples?: number;
}

export interface PredictionResponse {
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
  model_metadata: ModelMetadata;
  external_links: {
    amazon_india_search: string;
    flipkart_search: string;
    cashify_sell_search: string;
    cashify_buy_search: string;
  };
  engine_source: "python_fastapi" | "serverless_ml_engine";
}

export interface SmartphoneCatalogItem {
  brand: string;
  model: string;
  ram_gb: number;
  storage_gb: number;
  original_price: number;
}
