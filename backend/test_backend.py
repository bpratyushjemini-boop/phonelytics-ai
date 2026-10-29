"""
Automated Unit Tests for Phonelytics ML Backend (Task A & Task B)
"""
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["resale_model_loaded"] is True
    assert data["new_phone_model_loaded"] is True

def test_model_info_endpoint():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "task_a_new_phone" in data
    assert "task_b_resale" in data
    assert data["task_a_new_phone"]["r2_score"] > 0.90
    assert data["task_b_resale"]["r2_score"] > 0.90
    assert "feature_importances" in data["task_b_resale"]

def test_catalogue_endpoint():
    response = client.get("/catalogue")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    assert "brand" in items[0]
    assert "model" in items[0]

def test_task_b_resale_prediction():
    payload = {
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "ram_gb": 8,
        "storage_gb": 256,
        "age_months": 12,
        "condition": "Like New",
        "battery_health": 93.0,
        "warranty_months": 0,
        "has_box_bill": True,
        "original_price": 134900
    }
    response = client.post("/predict/resale", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["valuation_task"] == "used_smartphone_resale"
    assert data["brand"] == "Apple"
    assert data["model"] == "iPhone 15 Pro"
    assert data["estimated_second_hand_price"] > 0
    assert data["estimated_second_hand_price"] < 134900
    assert data["estimated_tradein_quote"] < data["estimated_second_hand_price"]
    assert data["second_hand_range"]["low"] <= data["second_hand_range"]["high"]
    assert len(data["factors"]) >= 3
    assert "amazon_india_search" in data["external_links"]
    assert "cashify_sell_search" in data["external_links"]

def test_task_a_new_phone_prediction():
    payload = {
        "brand": "Samsung",
        "model": "Galaxy S24",
        "processor_tier": "Flagship",
        "ram_gb": 8,
        "storage_gb": 256,
        "battery_mah": 4000,
        "is_5g": True
    }
    response = client.post("/predict/new-phone", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["valuation_task"] == "new_smartphone_retail_price"
    assert data["brand"] == "Samsung"
    assert data["estimated_retail_price"] > 40000
    assert data["indicative_range"]["low"] <= data["indicative_range"]["high"]
    assert len(data["factors"]) >= 2

def test_extrapolation_warning():
    # Out of typical distribution inputs (e.g. 70 months old, 220,000 INR price)
    payload = {
        "brand": "Apple",
        "model": "iPhone 11 Pro",
        "ram_gb": 4,
        "storage_gb": 64,
        "age_months": 70,
        "condition": "Poor",
        "battery_health": 65.0,
        "original_price": 220000
    }
    response = client.post("/predict/resale", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["extrapolation_warning"] is not None

def test_battery_penalty_influence():
    base_payload = {
        "brand": "Samsung",
        "model": "Galaxy S23",
        "ram_gb": 8,
        "storage_gb": 256,
        "age_months": 15,
        "condition": "Excellent",
        "original_price": 64999
    }
    
    resp_healthy = client.post("/predict/resale", json={**base_payload, "battery_health": 97.0})
    resp_degraded = client.post("/predict/resale", json={**base_payload, "battery_health": 72.0})
    
    assert resp_healthy.status_code == 200
    assert resp_degraded.status_code == 200
    assert resp_healthy.json()["estimated_second_hand_price"] > resp_degraded.json()["estimated_second_hand_price"]

def test_warranty_and_box_bonus():
    base_payload = {
        "brand": "OnePlus",
        "model": "OnePlus 12",
        "ram_gb": 12,
        "storage_gb": 256,
        "age_months": 6,
        "condition": "Like New",
        "battery_health": 99.0,
        "original_price": 64999
    }

    resp_full_kit = client.post("/predict/resale", json={**base_payload, "warranty_months": 6, "has_box_bill": True})
    resp_no_kit = client.post("/predict/resale", json={**base_payload, "warranty_months": 0, "has_box_bill": False})

    assert resp_full_kit.status_code == 200
    assert resp_no_kit.status_code == 200
    assert resp_full_kit.json()["estimated_second_hand_price"] >= resp_no_kit.json()["estimated_second_hand_price"]
