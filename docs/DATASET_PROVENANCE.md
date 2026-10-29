# Phonelytics — Dataset Provenance, Methodology & Limitations

This document provides transparent documentation of the datasets, feature definitions, generation methodologies, and known limitations used in Phonelytics.

---

## 1. Overview of Two Distinct Valuation Tasks

To maintain scientific integrity and prevent conflating new-product retail pricing with secondary depreciation, Phonelytics operates on two conceptually separated datasets:

1. **Task A Dataset (`backend/data/new_phones_dataset.csv`):**
   - **Target Variable:** `retail_price_inr` (brand-new retail shelf price in Indian Rupees).
   - **Core Features:** `brand`, `model`, `processor_tier`, `ram_gb`, `storage_gb`, `battery_mah`, `is_5g`.
   - **Purpose:** Predicts expected Indian retail launch/shelf price based purely on silicon hardware and tier specifications.

2. **Task B Dataset (`backend/data/smartphones_dataset.csv`):**
   - **Target Variable:** `second_hand_price` (fair peer-to-peer second-hand transaction price) & `resale_tradein_quote` (instant Cashify buyback estimate).
   - **Core Features:** `brand`, `model`, `ram_gb`, `storage_gb`, `age_months`, `condition`, `battery_health`, `warranty_months`, `has_box_bill`, `original_price`.
   - **Purpose:** Models non-linear electronic depreciation, cosmetic degradation, battery threshold penalties, and secondary market liquidity.

---

## 2. Dataset Provenance & Benchmark Sources

### Source Benchmarks
- **Retail Hardware Benchmarks:** Sourced from official Indian MRP launches (2020–2025) across Apple India, Samsung India, OnePlus, Xiaomi, Redmi, Realme, Vivo, Oppo, Motorola, and Google Pixel.
- **Secondary Market Calibrations:** Calibrated against Indian secondary marketplace transaction indices, Cashify buyback quote brackets, and OLX India peer transactions.
- **Sample Sizes:**
  - Task A: 1,600 observations across 11 brand tiers and 4 processor categories.
  - Task B: 1,600 observations across operational age intervals (1 to 60 months) and 5 physical condition grades.

### Permitted Use & Licensing
- The benchmark data is curated and calibrated solely for non-commercial educational demonstration within an academic AI Applications college practical.
- No copyrighted trade-secret algorithms or proprietary scraped tables were illegally extracted.

---

## 3. Preprocessing, Noise Modeling & Synthetic Calibration

As established in Reference Repository B (*`used-phone-price-predictor`*), empirical used-phone transaction data in India is fragmented across unindexed peer portals. Phonelytics utilizes calibrated domain models with deliberate statistical noise injection:

1. **Non-Linear Brand Depreciation:**
   - Apple devices decay at $\approx 1.6\%$ per month.
   - Samsung flagships decay at $\approx 2.4\%$ per month.
   - Budget Android tiers decay at $\approx 2.8\% - 3.0\%$ per month.
2. **Battery Threshold Penalty:**
   - Devices with battery health $\ge 95\%$ retain $100\%$ operational multiplier.
   - Devices dropping below $80\%$ ("Service Recommended" threshold) suffer a steep $\approx 21\%$ penalty reflecting OEM battery replacement costs (₹2,500 – ₹7,000 depending on model).
3. **Cosmetic Condition Multipliers:**
   - *Like New:* $1.00\times$
   - *Excellent:* $0.92\times$
   - *Good:* $0.82\times$
   - *Fair:* $0.68\times$
   - *Poor:* $0.50\times$
4. **Log-Normal Market Noise:**
   - Real-world peer transactions exhibit buyer negotiation variance ($\sigma \approx 0.035$).
5. **Warranty & Invoice Premiums:**
   - Active remaining warranty adds $+0.5\%$ per valid month.
   - Inclusion of original retail invoice bill and box adds $+3\%$ peer buyer confidence premium.

---

## 4. Evaluation Strategy & Leakage Prevention

- **Train/Test Holdout Split:** 80% train ($N=1,280$), 20% holdout test ($N=320$) using fixed random seed (`seed=42`).
- **Zero Leakage:** Continuous scaling (`StandardScaler`) and categorical dummy mapping (`OneHotEncoder`) are fitted strictly on `X_train` and then applied to `X_test`.
- **Metrics Tracked:**
  - Mean Absolute Error (MAE in ₹)
  - Root Mean Squared Error (RMSE in ₹)
  - Coefficient of Determination ($R^2$)
  - Median Absolute Percentage Error (MdAPE in %)

---

## 5. Explicit Limitations & Extrapolation Boundaries

1. **Demonstration & Calibration Notice:** Secondary resale data incorporates synthetic noise calibration based on empirical Cashify/OLX benchmarks. It does not represent audited legal trade-in guarantees.
2. **Temporal Window:** Datasets model devices up to 2025 releases. Newly announced devices (e.g. unannounced 2026/2027 models) will cause the model to flag an **Extrapolation Warning**.
3. **Regional & City Tier Invariance:** The model evaluates national Indian averages; localized metro premiums (e.g., Bengaluru vs Tier-3 towns) are not disaggregated.
4. **Cosmetic Self-Reporting:** Physical condition relies on user self-evaluation, which may carry subjective bias.
