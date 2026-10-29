"""
Automated Unit Tests for Phonelytics ML Backend
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
    assert "model_loaded" in data

def test_model_info_endpoint():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "r2_score" in data
    assert data["r2_score"] > 0.90
    assert "mae_inr" in data
    assert "feature_importances" in data

def test_catalogue_endpoint():
    response = client.get("/catalogue")
    assert response.status_code == 200
    items = response.json()
    assert len(items) > 0
    assert "brand" in items[0]
    assert "model" in items[0]

def test_valid_prediction():
    payload = {
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "ram_gb": 8,
        "storage_gb": 256,
        "age_months": 12,
        "condition": "Like New",
        "battery_health": 92.0,
        "original_price": 134900
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["brand"] == "Apple"
    assert data["model"] == "iPhone 15 Pro"
    assert data["estimated_second_hand_price"] > 0
    assert data["estimated_second_hand_price"] < 134900
    assert data["estimated_tradein_quote"] < data["estimated_second_hand_price"]
    assert "second_hand_range" in data
    assert data["second_hand_range"]["low"] <= data["second_hand_range"]["high"]
    assert len(data["factors"]) >= 3
    assert "amazon_india_search" in data["external_links"]
    assert "cashify_sell_search" in data["external_links"]

def test_invalid_condition_rejection():
    payload = {
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "ram_gb": 8,
        "storage_gb": 256,
        "age_months": 12,
        "condition": "SuperMintCondition", # Invalid
        "battery_health": 90.0,
        "original_price": 100000
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 400

def test_battery_penalty_influence():
    base_payload = {
        "brand": "Samsung",
        "model": "Galaxy S24 Ultra",
        "ram_gb": 12,
        "storage_gb": 256,
        "age_months": 10,
        "condition": "Excellent",
        "original_price": 129999
    }
    
    # Healthy battery (98%)
    resp_healthy = client.post("/predict", json={**base_payload, "battery_health": 98.0})
    # Degraded battery (72% - service needed)
    resp_degraded = client.post("/predict", json={**base_payload, "battery_health": 72.0})
    
    assert resp_healthy.status_code == 200
    assert resp_degraded.status_code == 200
    
    val_healthy = resp_healthy.json()["estimated_second_hand_price"]
    val_degraded = resp_degraded.json()["estimated_second_hand_price"]
    
    assert val_healthy > val_degraded
