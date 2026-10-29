import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phonelytics — AI-Powered Smartphone Price Prediction & Resale Intelligence",
  description:
    "Know the worth. Make the move. Predict smartphone prices, compare buying options, and discover resale potential in India with explainable machine learning.",
  keywords: [
    "smartphone price prediction",
    "resale value calculator",
    "cashify trade-in comparison",
    "second hand phone price India",
    "machine learning valuation",
    "phonelytics",
  ],
  authors: [{ name: "Phonelytics Team" }],
  openGraph: {
    title: "Phonelytics — AI-Powered Smartphone Valuation",
    description: "Know the worth. Make the move. Accurate, explainable smartphone pricing intelligence.",
    url: "https://phonelytics.vercel.app",
    siteName: "Phonelytics",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-charcoal-900 text-brand-ivory antialiased selection:bg-brand-orange selection:text-charcoal-950">
        {children}
      </body>
    </html>
  );
}
