"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PredictionForm } from "@/components/PredictionForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { ModelExplanation } from "@/components/ModelExplanation";
import { AboutContact } from "@/components/AboutContact";
import { Footer } from "@/components/Footer";
import { PredictionRequest, PredictionResponse } from "@/lib/types";

export default function Home() {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<PredictionRequest | null>(null);

  const handlePredictionSuccess = (result: PredictionResponse, requestData: PredictionRequest) => {
    setPredictionResult(result);
    setSubmittedRequest(requestData);
    // Smooth scroll to results dashboard
    setTimeout(() => {
      const el = document.getElementById("results-dashboard");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleEdit = () => {
    const el = document.getElementById("predict-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setSubmittedRequest(null);
    const el = document.getElementById("predict-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-charcoal-900 text-brand-ivory flex flex-col justify-between">
      <div>
        <Navbar />
        <Hero />
        <HowItWorks />
        <PredictionForm
          onPredictionSuccess={handlePredictionSuccess}
          initialValues={submittedRequest}
        />
        {predictionResult && submittedRequest && (
          <ResultsDashboard
            result={predictionResult}
            requestData={submittedRequest}
            onEdit={handleEdit}
            onReset={handleReset}
          />
        )}
        <ModelExplanation />
        <AboutContact />
      </div>
      <Footer />
    </main>
  );
}
