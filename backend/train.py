"""
Phonelytics Machine Learning Training Pipeline
==============================================
Trains two distinct, rigorously evaluated regression models:
1. Task A Model: New Smartphone Retail Price Predictor (from hardware specifications)
2. Task B Model: Used Smartphone Resale Valuation Regressor (from age, condition, battery, warranty, & price)

Evaluation Metrics:
- Mean Absolute Error (MAE in INR)
- Root Mean Squared Error (RMSE in INR)
- Coefficient of Determination (R²)
- Median Absolute Percentage Error (MdAPE)
"""

import json
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

def calculate_mdape(y_true, y_pred):
    """Calculates Median Absolute Percentage Error."""
    return float(np.median(np.abs((y_true - y_pred) / y_true)) * 100)

def train_all_models():
    # Ensure datasets exist
    new_csv = "backend/data/new_phones_dataset.csv"
    resale_csv = "backend/data/smartphones_dataset.csv"

    if not os.path.exists(new_csv) or not os.path.exists(resale_csv):
        from generate_dataset import generate_datasets
        generate_datasets()

    df_new = pd.read_csv(new_csv)
    df_resale = pd.read_csv(resale_csv)
    print(f"Loaded Task A (New phones): {len(df_new)} rows")
    print(f"Loaded Task B (Used phones): {len(df_resale)} rows")

    os.makedirs("backend/model", exist_ok=True)
    os.makedirs("src/data", exist_ok=True)

    metrics_output = {
        "task_a_new_phone": {},
        "task_b_resale": {},
        "training_date": "2026-10-29",
        "random_state": 42
    }

    # =========================================================================
    # Task A: New Phone Retail Price Prediction (Technical Specifications)
    # =========================================================================
    print("\n--- Training Task A: New Smartphone Retail Price Model ---")
    cat_features_new = ["brand", "processor_tier"]
    num_features_new = ["ram_gb", "storage_gb", "battery_mah", "is_5g"]

    X_new = df_new[cat_features_new + num_features_new]
    y_new = df_new["retail_price_inr"]

    X_train_new, X_test_new, y_train_new, y_test_new = train_test_split(
        X_new, y_new, test_size=0.20, random_state=42
    )

    preprocessor_new = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_features_new),
            ("num", StandardScaler(), num_features_new)
        ]
    )

    models_new = {
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=120, max_depth=4, learning_rate=0.08, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42),
        "Ridge Baseline": Ridge(alpha=1.0)
    }

    best_r2_new = -float("inf")
    best_pipe_new = None
    best_name_new = None
    comparison_new = {}

    for name, reg in models_new.items():
        pipe = Pipeline([("prep", preprocessor_new), ("reg", reg)])
        pipe.fit(X_train_new, y_train_new)
        preds = pipe.predict(X_test_new)

        mae = float(mean_absolute_error(y_test_new, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test_new, preds)))
        r2 = float(r2_score(y_test_new, preds))
        mdape = calculate_mdape(y_test_new, preds)

        comparison_new[name] = {
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4),
            "MdAPE": round(mdape, 2)
        }
        print(f"[Task A - {name}] MAE: ₹{mae:.2f} | RMSE: ₹{rmse:.2f} | R²: {r2:.4f} | MdAPE: {mdape:.2f}%")

        if r2 > best_r2_new:
            best_r2_new = r2
            best_pipe_new = pipe
            best_name_new = name

    # Feature importances for Task A
    feat_imp_new = {}
    reg_new = best_pipe_new.named_steps["reg"]
    if hasattr(reg_new, "feature_importances_"):
        ohe_new = best_pipe_new.named_steps["prep"].named_transformers_["cat"]
        cat_names_new = list(ohe_new.get_feature_names_out(cat_features_new))
        all_cols_new = cat_names_new + num_features_new
        for col, imp in zip(all_cols_new, reg_new.feature_importances_):
            feat_imp_new[col] = round(float(imp), 4)
        feat_imp_new = dict(sorted(feat_imp_new.items(), key=lambda x: x[1], reverse=True))

    joblib.dump(best_pipe_new, "backend/model/new_phone_model.joblib")
    metrics_output["task_a_new_phone"] = {
        "model_name": best_name_new,
        "algorithm": str(reg_new.__class__.__name__),
        "dataset_size": len(df_new),
        "train_samples": len(X_train_new),
        "test_samples": len(X_test_new),
        "r2_score": comparison_new[best_name_new]["R2"],
        "mae_inr": comparison_new[best_name_new]["MAE"],
        "rmse_inr": comparison_new[best_name_new]["RMSE"],
        "mdape_percent": comparison_new[best_name_new]["MdAPE"],
        "model_comparison": comparison_new,
        "feature_importances": feat_imp_new
    }

    # =========================================================================
    # Task B: Second-Hand Resale Valuation (Age, Condition, Battery, Warranty)
    # =========================================================================
    print("\n--- Training Task B: Used Smartphone Resale Valuation Model ---")
    cat_features_resale = ["brand", "condition"]
    num_features_resale = ["ram_gb", "storage_gb", "age_months", "battery_health", "warranty_months", "has_box_bill", "original_price"]

    X_resale = df_resale[cat_features_resale + num_features_resale]
    y_resale = df_resale["second_hand_price"]

    X_train_resale, X_test_resale, y_train_resale, y_test_resale = train_test_split(
        X_resale, y_resale, test_size=0.20, random_state=42
    )

    preprocessor_resale = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_features_resale),
            ("num", StandardScaler(), num_features_resale)
        ]
    )

    models_resale = {
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=140, max_depth=4, learning_rate=0.08, random_state=42),
        "Random Forest": RandomForestRegressor(n_estimators=120, max_depth=8, random_state=42),
        "Ridge Baseline": Ridge(alpha=1.0)
    }

    best_r2_resale = -float("inf")
    best_pipe_resale = None
    best_name_resale = None
    comparison_resale = {}

    for name, reg in models_resale.items():
        pipe = Pipeline([("prep", preprocessor_resale), ("reg", reg)])
        pipe.fit(X_train_resale, y_train_resale)
        preds = pipe.predict(X_test_resale)

        mae = float(mean_absolute_error(y_test_resale, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test_resale, preds)))
        r2 = float(r2_score(y_test_resale, preds))
        mdape = calculate_mdape(y_test_resale, preds)

        comparison_resale[name] = {
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 4),
            "MdAPE": round(mdape, 2)
        }
        print(f"[Task B - {name}] MAE: ₹{mae:.2f} | RMSE: ₹{rmse:.2f} | R²: {r2:.4f} | MdAPE: {mdape:.2f}%")

        if r2 > best_r2_resale:
            best_r2_resale = r2
            best_pipe_resale = pipe
            best_name_resale = name

    # Feature importances for Task B
    feat_imp_resale = {}
    reg_resale = best_pipe_resale.named_steps["reg"]
    if hasattr(reg_resale, "feature_importances_"):
        ohe_resale = best_pipe_resale.named_steps["prep"].named_transformers_["cat"]
        cat_names_resale = list(ohe_resale.get_feature_names_out(cat_features_resale))
        all_cols_resale = cat_names_resale + num_features_resale
        for col, imp in zip(all_cols_resale, reg_resale.feature_importances_):
            feat_imp_resale[col] = round(float(imp), 4)
        feat_imp_resale = dict(sorted(feat_imp_resale.items(), key=lambda x: x[1], reverse=True))

    joblib.dump(best_pipe_resale, "backend/model/phonelytics_model.joblib")
    metrics_output["task_b_resale"] = {
        "model_name": best_name_resale,
        "algorithm": str(reg_resale.__class__.__name__),
        "dataset_size": len(df_resale),
        "train_samples": len(X_train_resale),
        "test_samples": len(X_test_resale),
        "r2_score": comparison_resale[best_name_resale]["R2"],
        "mae_inr": comparison_resale[best_name_resale]["MAE"],
        "rmse_inr": comparison_resale[best_name_resale]["RMSE"],
        "mdape_percent": comparison_resale[best_name_resale]["MdAPE"],
        "model_comparison": comparison_resale,
        "feature_importances": feat_imp_resale
    }

    # Combined summary for backwards compatibility
    metrics_output["model_name"] = best_name_resale
    metrics_output["algorithm"] = str(reg_resale.__class__.__name__)
    metrics_output["dataset_size"] = len(df_resale)
    metrics_output["train_samples"] = len(X_train_resale)
    metrics_output["test_samples"] = len(X_test_resale)
    metrics_output["r2_score"] = comparison_resale[best_name_resale]["R2"]
    metrics_output["mae_inr"] = comparison_resale[best_name_resale]["MAE"]
    metrics_output["rmse_inr"] = comparison_resale[best_name_resale]["RMSE"]
    metrics_output["mape_percent"] = comparison_resale[best_name_resale]["MdAPE"]
    metrics_output["model_comparison"] = comparison_resale
    metrics_output["feature_importances"] = feat_imp_resale

    # Save metrics JSON
    with open("backend/model/model_metrics.json", "w") as f:
        json.dump(metrics_output, f, indent=2)
    with open("src/data/model_metrics.json", "w") as f:
        json.dump(metrics_output, f, indent=2)

    # Save portable weights & logic for Next.js Serverless ML engine
    model_export = {
        "task_a_new_phone": {
            "algorithm": best_name_new,
            "r2_score": comparison_new[best_name_new]["R2"],
            "mae": comparison_new[best_name_new]["MAE"],
            "feature_importances": feat_imp_new,
            "processor_premiums": {
                "Flagship": 1.45,
                "Upper-Midrange": 1.15,
                "Midrange": 1.00,
                "Budget": 0.70
            }
        },
        "task_b_resale": {
            "algorithm": best_name_resale,
            "r2_score": comparison_resale[best_name_resale]["R2"],
            "mae": comparison_resale[best_name_resale]["MAE"],
            "feature_importances": feat_imp_resale,
            "brand_decay_rates": {
                "Apple": 0.016,
                "Samsung": 0.024,
                "OnePlus": 0.023,
                "Google Pixel": 0.025,
                "Xiaomi": 0.027,
                "Redmi": 0.028,
                "Realme": 0.029,
                "Vivo": 0.026,
                "Oppo": 0.027,
                "Motorola": 0.028,
                "Other": 0.030,
            },
            "condition_multipliers": {
                "Like New": 1.00,
                "Excellent": 0.92,
                "Good": 0.82,
                "Fair": 0.68,
                "Poor": 0.50,
            },
            "tradein_margin_ratio": 0.80
        },
        "catalogue_bounds": {
            "max_ram_gb": 24,
            "min_ram_gb": 2,
            "max_storage_gb": 1024,
            "min_storage_gb": 32,
            "max_age_months": 72,
            "max_original_price": 250000
        }
    }

    with open("backend/model/model_export.json", "w") as f:
        json.dump(model_export, f, indent=2)
    with open("src/data/model_export.json", "w") as f:
        json.dump(model_export, f, indent=2)

    # Export distinct catalogue with specs
    catalogue = (
        df_new[["brand", "model", "ram_gb", "storage_gb", "battery_mah", "processor_tier", "is_5g", "retail_price_inr"]]
        .drop_duplicates(subset=["brand", "model"])
        .rename(columns={"retail_price_inr": "original_price"})
        .sort_values(by=["brand", "model"])
        .to_dict(orient="records")
    )

    with open("backend/model/catalogue.json", "w") as f:
        json.dump(catalogue, f, indent=2)
    with open("src/data/catalogue.json", "w") as f:
        json.dump(catalogue, f, indent=2)

    print("\nSuccessfully trained both models and exported all artifacts to backend/model/ and src/data/.")

if __name__ == "__main__":
    train_all_models()
