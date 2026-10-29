# Phonelytics — Reference Repository Research & Architectural Synthesis

This document records the architectural, machine learning, and product lessons learned from inspecting the four reference repositories identified in the Phonelytics project specification, alongside our independent engineering choices.

---

## 1. Reference Repositories Inspected

### A. Indian Smartphone Price Analysis
- **Repository:** [`Ikdoumi-Ilian/india-smartphone-price-prediction`](https://github.com/Ikdoumi-Ilian/india-smartphone-price-prediction)
- **Primary Focus:** Exploratory data analysis, missing value strategies, and specification-driven price modeling using Indian market data.
- **Key Architectural Lessons:**
  1. *Avoiding Selection Bias:* Dropping rows with missing values would eliminate expensive phones (e.g., 42 of 46 iPhones lacked explicit fast-charging wattage in raw data). Imputing conditional medians prevents biasing the model toward entry-level phones.
  2. *Categorical Grouping:* Rare brands with fewer than 5 observations are grouped into an `"Other"` category to prevent high-cardinality overfitting.
  3. *Outlier Removal:* Luxury phones (e.g., Vertu, Porsche Design) whose prices reflect jewelry materials rather than silicon hardware must be filtered out.
  4. *Dataset Age Transparency:* The dataset's newest models are from ~2023 (iPhone 15, Galaxy S23). It cannot be represented as 2025/2026 real-time market data.

### B. Used Smartphone Resale Prediction
- **Repository:** [`Prabhkirat-Singh-Marwah/used-phone-price-predictor`](https://github.com/Prabhkirat-Singh-Marwah/used-phone-price-predictor)
- **Primary Focus:** Estimating used smartphone resale value from wear, age, and condition metrics.
- **Key Architectural Lessons:**
  1. *Resale-Specific Features:* Unlike new-phone pricing, resale valuation requires distinct inputs: `age_months`, `original_price`, `battery_health_pct`, `screen_condition`, `body_condition`, `warranty_months_left`, and `has_box_bill`.
  2. *Non-linear Decay & Battery Penalty:* Battery health acts as a non-linear threshold penalty (a steep drop below 80% due to OEM battery replacement costs). Brand retention varies widely (Apple retains ~68-75% after year one, while budget brands retain ~40-48%).
  3. *Honest Synthetic Data Disclosure:* Synthetic datasets cannot establish real-world resale accuracy. Phonelytics must explicitly label simulated or calibrated models as demonstration/calibrated models and avoid fabricating "real transaction proof."
  4. *Extrapolation Warnings:* Tree-based models extrapolate poorly outside their training bounds (e.g., unseen brands or absurd memory specs). An explicit extrapolation advisory is necessary.

### C. Model-to-Web-App Integration
- **Repository:** [`CHIRAGKUMAR1718/mobile-price-predictor`](https://github.com/CHIRAGKUMAR1718/mobile-price-predictor)
- **Primary Focus:** Scikit-learn preprocessing pipeline, model serialization, and clean web form integration.
- **Key Architectural Lessons:**
  1. *Unified Atomic Pipeline:* Bundling `OneHotEncoder`, `StandardScaler`, and the regressor into an atomic `sklearn.pipeline.Pipeline` prevents data leakage and ensures seamless inference during deployment.
  2. *Catalogue-Backed Dropdowns:* Connecting form fields to an empirical catalogue prevents invalid user inputs and guarantees model compatibility.
  3. *Robust Input Validation:* Strict type checking and range boundaries on the API layer prevent runtime crashes.

### D. New-Phone Marketplace Data and Regression
- **Repository:** [`bipinwaghmare/smartphone-price-prediction-streamlit-flipkart-data`](https://github.com/bipinwaghmare/smartphone-price-prediction-streamlit-flipkart-data)
- **Primary Focus:** E-commerce listing features (Flipkart) and Gradient Boosting regression.
- **Key Architectural Lessons:**
  1. *Specification Depth for New Retail:* New-phone pricing correlates heavily with `RAM_in_GB`, `ROM_in_GB`, `Battery_capacity_in_mAh`, `is_5G`, `Processor_brand`, and `Display_type`.
  2. *Gradient Boosting Superiority:* Gradient Boosting effectively handles non-linear price tiers across budget, mid-range, and flagship segments.
  3. *Market Listing Boundaries:* Direct search queries to Indian marketplaces (Amazon India, Flipkart) must be distinguished from static model estimates.

---

## 2. Independent Engineering Synthesis in Phonelytics

Based on these research lessons, Phonelytics implements a superior, bifurcated system:

1. **Two Distinct Valuation Tasks:**
   - **Task A (New-Phone Retail Valuation):** Evaluates estimated brand-new retail price based on hardware specs (RAM, Storage, Battery mAh, Processor Tier, 5G support, Brand).
   - **Task B (Used-Phone Resale Valuation):** Evaluates secondary peer-to-peer resale equity and instant Cashify trade-in quotes based on original purchase price, ownership duration (months), cosmetic condition, battery health %, and warranty status.
2. **Honest Data Provenance:**
   - Datasets are clearly documented in `docs/DATASET_PROVENANCE.md` with explicit collection dates, limitations, and synthetic calibration notices.
3. **Dual-Execution Engine:**
   - Standalone Python FastAPI backend (`/predict/resale` and `/predict/new-phone`) paired with a Next.js Serverless ML engine that runs the exported pipeline weights with zero downtime on Vercel.
4. **Out-of-Distribution & Extrapolation Warnings:**
   - For unrecognized models, unseen brands, or out-of-range specifications, Phonelytics issues clear extrapolation warnings rather than manufacturing false precision.
5. **No Hallucinated Live Data:**
   - External marketplace links (Amazon India, Flipkart, Cashify) are clearly identified as query-driven search entry points rather than real-time API quotes.
