import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0B0B0B",
          900: "#111111", // Brand Charcoal black
          800: "#161616",
          700: "#191919", // Brand Deep charcoal
          600: "#222222",
          500: "#2D2D2D",
          400: "#3D3D3D",
        },
        brand: {
          orange: "#F28C45", // Brand Burnt orange
          "orange-hover": "#E27B32",
          "orange-dark": "#944818",
          ivory: "#F5F0E9", // Brand Warm ivory
          beige: "#E0C58F", // Brand Soft beige
          grey: "#A6A6A6", // Brand Muted grey
        },
        border: {
          subtle: "rgba(245, 240, 233, 0.08)",
          charcoal: "#262626",
          medium: "#333333",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
      boxShadow: {
        "subtle-card": "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        "orange-glow": "0 0 24px -4px rgba(242, 140, 69, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
