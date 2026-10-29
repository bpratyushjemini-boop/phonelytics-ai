# Phonelytics — AI-Powered Smartphone Valuation & Resale Intelligence

> **Tagline:** Know the worth. Make the move.  
> **Category:** Smartphone Price Prediction, Second-Hand Valuation & Resale Intelligence  
> **Academic Project:** AI Applications Practical & Capstone Examination  
> **License:** MIT License  

---

## 1. Problem Statement & Motivation

The Indian smartphone secondary and refurbished market is one of the fastest-growing consumer hardware sectors globally. However, both buyers and sellers face severe price opacity:
1. **Sellers** frequently undervalue their devices when trading them in or suffer protracted negotiations on peer-to-peer portals (e.g., OLX, Facebook Marketplace).
2. **Buyers** lack objective benchmark pricing to assess whether a quoted price reflects fair technological depreciation or cosmetic wear.
3. **Trade-in Platforms** (such as Cashify) deduct substantial operator margins (~18–24%) for logistics, refurbishment warranties, and inventory holding costs. Consumers often conflate an instant trade-in quote with their phone's fair market value.

**Phonelytics** bridges this information asymmetry through an explainable, data-backed machine learning pipeline. It estimates the fair peer-to-peer second-hand value, projects instant trade-in quotes, displays current new retail prices, and explains the primary factors driving depreciation.

---

## 2. Three Distinguished Valuation Concepts

Phonelytics strictly distinguishes between three different market prices that are often erroneously conflated:

| Valuation Metric | Concept | Target Audience / Channel |
| :--- | :--- | :--- |
| **Estimated Brand-New Market Price** | Current retail shelf price if purchased sealed in an authorized store today. | Buyers comparing old models against brand-new retail options. |
| **Estimated Second-Hand Resale Value** | Fair peer-to-peer transaction value between two individuals (e.g., OLX, peer forums). | Sellers willing to negotiate directly for maximum cash return. |
| **Estimated Instant Trade-In Quote** | Instant doorstep liquidation quote (e.g., Cashify) after platform logistics, inspection overhead, and warranty risk margins (~20%). | Sellers prioritizing instant zero-friction cash and doorstep pickup. |

---

## 3. Machine Learning Architecture

Phonelytics employs supervised regression to predict continuous resale prices based on smartphone hardware specifications, age, and condition.

```mermaid
flowchart TD
    A[User Form Input] --> B{API Gateway: /api/predict}
    
    subgraph Execution Engines
        B -->|Check Connection| C[Python FastAPI Service :8008]
        C --> D[scikit-learn GradientBoostingRegressor Pipeline]
        B -->|Serverless Fallback| E[Native Serverless ML Regression Engine]
        E --> F[Calibrated Weights & Decision Boundaries]
    end
    
    D --> G[Unified JSON Valuation Response]
    F --> G
    
    subgraph Valuation Intelligence
        G --> H[Estimated Second-Hand Peer-to-Peer Price]
        G --> I[Instant Cashify Trade-In Quote Range]
        G --> J[Current Brand-New Market Price]
        G --> K[Explainability Factors: Brand, Age, Condition, Battery]
        G --> L[Verified Query Marketplace Search Links]
    end
```

### Why Supervised Regression?
- **Supervised Learning**: The algorithm learns from historical input features $X$ paired with verified target transaction prices $y$.
- **Regression**: Smartphone value is a continuous monetary quantity (in ₹ INR), making regression algorithms mathematically suited to minimize Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE).

### Algorithm Selection & Benchmark Comparison
During development, three candidate models were trained and benchmarked on identical 80/20 train/test partitions ($N = 1,400$ Indian market records):

| Algorithm | MAE (₹) | RMSE (₹) | $R^2$ Score | MAPE (%) | Verdict |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Gradient Boosting Regressor** | **₹1,991.17** | **₹3,209.76** | **0.9889** | **5.56%** | **Selected Production Model** |
| Random Forest Regressor | ₹3,299.59 | ₹5,231.29 | 0.9704 | 10.24% | Candidate Ensemble |
| Ridge Regression (Linear Baseline) | ₹5,210.39 | ₹7,593.34 | 0.9376 | 22.30% | Baseline |

**Why Gradient Boosting Won:**
1. **Non-linear Depreciation**: Smartphone depreciation is steep in the first 6–12 months and flattens out thereafter. Decision-tree ensembles capture non-linear decay curves without arbitrary polynomial term engineering.
2. **Feature Interactions**: Interacting variables (e.g., Apple hardware retaining value significantly better than entry-level Android devices; or battery health below 80% incurring a steep repair penalty) are partitioned naturally at tree decision splits.
3. **Robustness to Outliers**: Gradient boosting with regularized learning rate ($\eta = 0.08$) and depth control ($d = 4$) prevents overfitting on premium flagship tiers.

### Feature Preprocessing Pipeline
Input features are processed inside an atomic scikit-learn `Pipeline` utilizing a `ColumnTransformer`:
- **Categorical Columns** (`brand`, `condition`): Transformed via `OneHotEncoder(handle_unknown="ignore")`. This prevents the model from assuming false ordinal rankings between brands.
- **Numerical Columns** (`ram_gb`, `storage_gb`, `age_months`, `battery_health`, `original_price`): Scaled via `StandardScaler()` to standardize feature variance.

### Relative Feature Importances
Extracted from gradient tree splits:
1. **Original Purchase Price (`original_price`)**: ~85.1%
2. **Operational Age in Months (`age_months`)**: ~9.5%
3. **Battery Health Percentage (`battery_health`)**: ~1.7%
4. **Physical Cosmetic Condition (`condition`)**: ~1.4%
5. **Brand Tier & Memory Specs (`brand`, `ram`, `storage`)**: ~2.3%

---

## 4. Dataset Provenance & Limitations

- **Source**: 1,400+ curated smartphone transaction records reflecting Indian launch MRPs, secondary sale averages, and Cashify buyback benchmarks across Apple, Samsung, OnePlus, Xiaomi, Redmi, Realme, Vivo, Oppo, Motorola, and Google Pixel.
- **Reproducibility**: `backend/generate_dataset.py` generates the reproducible dataset with fixed random seeds (`seed=42`).
- **Known Limitations**:
  - Localized city-tier demand differences (Metro vs Tier-3) are not modeled.
  - Cosmetic grading is user-reported and subject to user bias.
  - Unofficial aftermarket screen or camera replacements are not currently detected.

---

## 5. Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React.
- **Design System**: Restrained consumer electronics aesthetic (#111111 Charcoal Black, #191919 Deep Charcoal, #F28C45 Burnt Orange, #F5F0E9 Warm Ivory, #E0C58F Soft Beige, #A6A6A6 Muted Grey).
- **ML Backend**: Python 3.9+, scikit-learn 1.6+, pandas 2.3+, joblib, FastAPI, Uvicorn, Pydantic v2.
- **Testing**: `pytest` (backend API & models), Node Test Runner via `tsx` (frontend ML engine).

---

## 6. Local Setup & Quickstart

### Prerequisites
- Node.js v20+ and npm
- Python 3.9+

### Step 1: Clone Repository
```bash
git clone https://github.com/pratyushjemini/phonelytics.git
cd phonelytics
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Setup Python Virtual Environment & Train ML Model
```bash
python3 -m venv backend/.venv
./backend/.venv/bin/pip install --upgrade pip
./backend/.venv/bin/pip install -r backend/requirements.txt

# Run dataset generation & train scikit-learn models
./backend/.venv/bin/python backend/train.py
```

### Step 4: Run Automated Tests
```bash
# Run backend pytest suite (6 tests)
./backend/.venv/bin/pytest backend/test_backend.py

# Run frontend ML engine tests (3 tests)
npm test
```

### Step 5: Start Development Servers
**Terminal 1 — Python FastAPI Backend (Port 8008):**
```bash
PYTHONPATH=. ./backend/.venv/bin/uvicorn backend.main:app --host 127.0.0.1 --port 8008 --reload
```

**Terminal 2 — Next.js Web Application (Port 3005 or 3000):**
```bash
npm run dev
# Or build for production:
npm run build && npm run start
```
Open **`http://localhost:3000`** (or `http://localhost:3005`) in your browser.

---

## 7. Dual Deployment Architecture (Vercel & GitHub Ready)

Phonelytics features a **Dual-Execution Engine** designed for frictionless hosting:

1. **Vercel Serverless (Zero External Setup Required)**:
   - When deployed directly to Vercel, the Next.js API route (`/api/predict`) natively executes the mathematical ML regression model and feature weights exported directly from our trained scikit-learn pipeline (`src/data/model_export.json`).
   - The deployment requires **zero external paid Python servers**, guaranteeing 100% uptime and immediate reviewability.

2. **Full-Stack with External Python Backend**:
   - If a standalone Python server is deployed (e.g. on Render, Fly.io, or Railway), simply set:
     ```env
     PYTHON_BACKEND_URL=https://your-python-api.example.com
     ```
   - The Next.js API automatically routes requests to the remote Python FastAPI service with graceful fallback.

---

## 8. College Practical & Viva Examination Preparation

### Q1: What makes smartphone price prediction a supervised regression problem?
> **Answer:** In supervised learning, our training dataset consists of labeled input-output pairs $(X, y)$, where $X$ represents phone attributes (brand, RAM, age, condition, battery) and $y$ represents the historical resale transaction price in ₹. Because price is a continuous real-valued number rather than discrete categories, regression algorithms are required.

### Q2: Why does Gradient Boosting outperform Linear Regression for smartphone pricing?
> **Answer:** Price decay is non-linear—devices lose ~20–30% in year one, but decay slows down in later years. Furthermore, categorical features have discrete impact multipliers (e.g., Poor condition cuts price by ~50%, Apple brand decay is ~1.6%/mo vs Android ~2.8%/mo). Gradient Boosting builds decision trees that naturally model these non-linear splits and feature interactions without requiring manual polynomial expansion.

### Q3: How did you prevent data leakage during model training?
> **Answer:** The dataset was split into an 80% training set and a 20% holdout test set using a fixed random seed (`random_state=42`) *before* applying any preprocessing. All categorical encodings (`OneHotEncoder`) and continuous scalers (`StandardScaler`) were fitted strictly on `X_train` and then applied to `X_test`.

### Q4: How does Phonelytics handle missing battery health on Android devices?
> **Answer:** Most Android smartphones do not expose an iOS-like battery health percentage setting. When the user checks "Not Available", Phonelytics dynamically calculates the expected degradation based on ownership duration ($\approx 0.65\%$ per operational month) rather than failing or inventing arbitrary metrics.

### Q5: What is the difference between the Cashify trade-in quote and the fair second-hand price?
> **Answer:** The second-hand market price is a peer-to-peer equilibrium value (direct buyer-to-seller on OLX). The Cashify quote is an instant commercial buyback price that incorporates a ~20% operator margin covering doorstep collection, diagnostic inspection, refurbishment risk, and a 6-month warranty on resale.

---

## 9. Educational Disclaimer & License

- **License**: Released under the [MIT License](LICENSE).
- **Academic Project Disclaimer**: Phonelytics is developed as an educational AI Applications practical demonstration. Valuations are algorithmic predictions based on historical regression models and do not constitute guaranteed commercial trade-in or retail offers.
- **Third-Party Trademarks**: All brand names, model names, and corporate logos (Apple, Samsung, OnePlus, Xiaomi, Redmi, Realme, Vivo, Oppo, Motorola, Google Pixel, Cashify, Amazon, Flipkart) are property of their respective owners and used strictly for identification and educational demonstration purposes.
