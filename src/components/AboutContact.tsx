"use client";

import React, { useState } from "react";
import { Info, Code2, Layers, Mail, CheckCircle2, GitBranch } from "lucide-react";

export function AboutContact() {
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMsg) return;
    setSubmitted(true);
  };

  return (
    <section id="about" className="py-20 bg-charcoal-900 border-t border-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* About Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
              About Phonelytics
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ivory leading-tight">
              AI-driven valuation for modern mobile hardware.
            </h2>
            <p className="text-base text-brand-grey font-normal leading-relaxed">
              Phonelytics is an AI-powered smartphone valuation project designed to estimate device prices and help users explore buying and resale options. It combines machine learning with a simple, transparent user experience.
            </p>
            <p className="text-sm text-brand-grey font-normal leading-relaxed">
              Developed as an AI Applications college practical and capstone project, Phonelytics addresses the common problem of subjective valuation when buying or trading in pre-owned smartphones in India.
            </p>
          </div>

          {/* System Architecture Specs */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl glass-card border border-charcoal-600/50 space-y-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-orange" />
              <h3 className="text-lg font-bold text-brand-ivory">System Technical Stack</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 space-y-1.5">
                <div className="font-semibold text-brand-beige uppercase tracking-wider">Frontend</div>
                <div className="text-brand-ivory font-medium">Next.js 15 App Router</div>
                <div className="text-brand-grey">React 19, TypeScript, Tailwind CSS, Lucide icons</div>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 space-y-1.5">
                <div className="font-semibold text-brand-orange uppercase tracking-wider">ML Pipeline</div>
                <div className="text-brand-ivory font-medium">Python & Scikit-Learn</div>
                <div className="text-brand-grey">Gradient Boosting, OneHotEncoder, StandardScaler</div>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 space-y-1.5">
                <div className="font-semibold text-brand-beige uppercase tracking-wider">Backend API</div>
                <div className="text-brand-ivory font-medium">FastAPI & Uvicorn</div>
                <div className="text-brand-grey">Pydantic v2 validation, CORS middleware, Joblib</div>
              </div>

              <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-700 space-y-1.5">
                <div className="font-semibold text-brand-orange uppercase tracking-wider">Deployment</div>
                <div className="text-brand-ivory font-medium">Vercel & Python Server</div>
                <div className="text-brand-grey">Dual-execution engine (zero-downtime serverless)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / Academic Project Inquiry Section */}
        <div className="p-6 sm:p-10 rounded-2xl glass-card border border-charcoal-600/50 max-w-3xl mx-auto space-y-6">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-beige">
                Academic Project Contact
              </span>
            </div>
            <h3 className="text-2xl font-bold text-brand-ivory">
              Project Inquiries & Viva Information
            </h3>
            <p className="text-xs sm:text-sm text-brand-grey">
              This is an academic research demonstration. For review questions, dataset inquiries, or college viva evaluation, submit a message below or check the GitHub repository.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-charcoal-900 border border-brand-orange/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-brand-orange mx-auto" />
              <div className="text-base font-bold text-brand-ivory">Message Recorded</div>
              <p className="text-xs text-brand-grey">
                Thank you, {inquiryName}. Your academic evaluation inquiry has been stored locally.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs text-brand-beige underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-grey uppercase tracking-wider mb-1.5">
                    Your Name / Examiner ID
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Professor Sharma"
                    className="w-full px-4 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-grey uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="e.g. evaluator@college.edu"
                    className="w-full px-4 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-grey uppercase tracking-wider mb-1.5">
                  Inquiry / Viva Evaluation Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  placeholder="Enter any feedback or academic inquiry here..."
                  className="w-full px-4 py-2.5 rounded-lg bg-charcoal-900 border border-charcoal-600 text-brand-ivory text-xs focus:outline-none focus:ring-1 focus:ring-brand-orange"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-charcoal-700 hover:bg-charcoal-600 border border-charcoal-500 text-brand-ivory text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Submit Project Note
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
