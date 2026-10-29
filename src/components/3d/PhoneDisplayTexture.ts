import * as THREE from "three";

/**
 * Creates a high-DPI, ultra-crisp 1080x2340 canvas texture for the 3D smartphone OLED display.
 * Designed with high contrast, legible typography, and dense, realistic valuation UI
 * matching the Phonelytics palette (#111111, #191919, #F28C45, #F5F0E9, #E0C58F).
 */
export function createPhoneScreenTexture(
  deviceModel: string = "iPhone 15 Pro",
  priceText: string = "₹89,400",
  tradeinText: string = "₹71,500"
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    const canvas = {} as HTMLCanvasElement;
    return new THREE.CanvasTexture(canvas);
  }

  const width = 1080;
  const height = 2340;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep OLED Canvas Background (#0C0C0D)
  ctx.fillStyle = "#0C0C0D";
  ctx.fillRect(0, 0, width, height);

  // Subtle studio ambient gradient from top-center
  const ambientGrad = ctx.createRadialGradient(
    width / 2,
    380,
    80,
    width / 2,
    700,
    1000
  );
  ambientGrad.addColorStop(0, "rgba(242, 140, 69, 0.16)");
  ambientGrad.addColorStop(0.5, "rgba(224, 197, 143, 0.04)");
  ambientGrad.addColorStop(1, "rgba(12, 12, 13, 0)");
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Status Bar (Top)
  // Time
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 52px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("09:41", 90, 108);

  // Dynamic Island Cutout (Bezel Punch-hole)
  ctx.fillStyle = "#000000";
  roundRect(ctx, width / 2 - 160, 52, 320, 84, 42);
  ctx.fill();
  ctx.strokeStyle = "#1A1A1A";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dynamic Island front camera sensor dot & orange indicator
  ctx.fillStyle = "#08101E";
  ctx.beginPath();
  ctx.arc(width / 2 + 100, 94, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#F28C45";
  ctx.beginPath();
  ctx.arc(width / 2 - 100, 94, 7, 0, Math.PI * 2);
  ctx.fill();

  // Status Icons (5G + Signal Bars + Battery)
  // 5G
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 40px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("5G", width - 340, 106);

  // 4 Signal Bars
  const barX = width - 260;
  for (let i = 0; i < 4; i++) {
    const barH = 14 + i * 8;
    ctx.fillStyle = "#F5F0E9";
    roundRect(ctx, barX + i * 14, 108 - barH, 9, barH, 3);
    ctx.fill();
  }

  // Battery Icon with percentage
  const batX = width - 180;
  ctx.strokeStyle = "#F5F0E9";
  ctx.lineWidth = 4;
  roundRect(ctx, batX, 74, 82, 42, 10);
  ctx.stroke();

  // Battery nub
  ctx.fillStyle = "#F5F0E9";
  roundRect(ctx, batX + 84, 86, 6, 18, 3);
  ctx.fill();

  // Battery charge fill in burnt orange (#F28C45)
  ctx.fillStyle = "#F28C45";
  roundRect(ctx, batX + 6, 80, 56, 30, 6);
  ctx.fill();

  // 3. Phonelytics Brand Badge
  const contentY = 220;
  ctx.fillStyle = "rgba(242, 140, 69, 0.12)";
  roundRect(ctx, 80, contentY, 440, 64, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pulsing dot
  ctx.fillStyle = "#F28C45";
  ctx.beginPath();
  ctx.arc(114, contentY + 32, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#E0C58F";
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("PHONELYTICS VALUATION", 140, contentY + 42);

  // 4. Device Title & Spec Subtitle
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 84px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(deviceModel, 80, contentY + 160);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 42px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("256 GB Storage • A17 Pro • Titanium Blue", 80, contentY + 225);

  // Thin separator
  ctx.strokeStyle = "#222226";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, contentY + 270);
  ctx.lineTo(width - 80, contentY + 270);
  ctx.stroke();

  // 5. Main Fair Resale Valuation Card (Hero Card)
  const card1Y = contentY + 310;
  const cardW = width - 160;

  // Outer glowing card background
  ctx.fillStyle = "#141416";
  roundRect(ctx, 80, card1Y, cardW, 460, 40);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.6)";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Subtitle inside card
  ctx.fillStyle = "#A6A6A6";
  ctx.font = "600 36px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("FAIR PEER-TO-PEER RESALE VALUE", 125, card1Y + 70);

  // Top-right confidence badge
  ctx.fillStyle = "rgba(224, 197, 143, 0.15)";
  roundRect(ctx, width - 360, card1Y + 35, 230, 48, 24);
  ctx.fill();
  ctx.strokeStyle = "#E0C58F";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#E0C58F";
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("R² 0.988 SCORE", width - 340, card1Y + 68);

  // Primary Big Price Number in Burnt Orange
  ctx.fillStyle = "#F28C45";
  ctx.font = "900 132px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(priceText, 125, card1Y + 215);

  // Card Inner Divider
  ctx.strokeStyle = "#25252A";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(125, card1Y + 270);
  ctx.lineTo(width - 125, card1Y + 270);
  ctx.stroke();

  // Market Range & Depreciation Stats
  ctx.fillStyle = "#E0C58F";
  ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Range: ₹84,200 – ₹94,500", 125, card1Y + 340);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 34px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Original Retail: ₹1,34,900", 125, card1Y + 400);

  ctx.fillStyle = "#E0C58F";
  ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("-33.7% Residual Equity", width - 530, card1Y + 400);

  // 6. Instant Cashify Buyback Trade-In Card
  const card2Y = card1Y + 500;
  ctx.fillStyle = "#161619";
  roundRect(ctx, 80, card2Y, cardW, 280, 36);
  ctx.fill();
  ctx.strokeStyle = "#2A2A30";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Trade-in header with icon
  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 46px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Instant Buyback Quote", 125, card2Y + 85);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 34px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Cashify Verified Partner Price", 125, card2Y + 140);

  // Big Trade-in Price
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 78px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(tradeinText, width - 420, card2Y + 115);

  // Instant UPI badge
  ctx.fillStyle = "rgba(242, 140, 69, 0.15)";
  roundRect(ctx, 125, card2Y + 185, 340, 52, 26);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("✓ Instant Doorstep UPI", 150, card2Y + 222);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Zero inspection deduction guarantee", 500, card2Y + 222);

  // 7. 4-Tile Diagnostic Matrix (2x2 Grid)
  const gridY = card2Y + 320;
  const tileW = (cardW - 30) / 2;
  const tileH = 210;

  // Tile 1: Battery Health
  ctx.fillStyle = "#141417";
  roundRect(ctx, 80, gridY, tileW, tileH, 28);
  ctx.fill();
  ctx.strokeStyle = "#26262B";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("BATTERY HEALTH", 115, gridY + 65);

  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("93%", 115, gridY + 135);

  ctx.fillStyle = "#E0C58F";
  ctx.font = "600 30px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Peak Capacity (Healthy)", 245, gridY + 130);

  // Progress Bar for Battery
  ctx.fillStyle = "#222226";
  roundRect(ctx, 115, gridY + 160, tileW - 70, 16, 8);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  roundRect(ctx, 115, gridY + 160, (tileW - 70) * 0.93, 16, 8);
  ctx.fill();

  // Tile 2: Cosmetic Condition
  const tile2X = 80 + tileW + 30;
  ctx.fillStyle = "#141417";
  roundRect(ctx, tile2X, gridY, tileW, tileH, 28);
  ctx.fill();
  ctx.strokeStyle = "#26262B";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("COSMETIC GRADE", tile2X + 35, gridY + 65);

  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Like New", tile2X + 35, gridY + 135);

  ctx.fillStyle = "#E0C58F";
  ctx.font = "600 30px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("1.0x Multiplier (Zero Scratches)", tile2X + 35, gridY + 175);

  // Tile 3: Warranty Status
  const row2Y = gridY + tileH + 24;
  ctx.fillStyle = "#141417";
  roundRect(ctx, 80, row2Y, tileW, tileH, 28);
  ctx.fill();
  ctx.strokeStyle = "#26262B";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("WARRANTY STATUS", 115, row2Y + 65);

  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Active", 115, row2Y + 135);

  ctx.fillStyle = "#E0C58F";
  ctx.font = "600 30px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("2 Mos + Box & Bill (+₹1,800)", 115, row2Y + 175);

  // Tile 4: Market Velocity
  ctx.fillStyle = "#141417";
  roundRect(ctx, tile2X, row2Y, tileW, tileH, 28);
  ctx.fill();
  ctx.strokeStyle = "#26262B";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("LIQUIDITY SPEED", tile2X + 35, row2Y + 65);

  ctx.fillStyle = "#FAF7F2";
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("High Demand", tile2X + 35, row2Y + 135);

  ctx.fillStyle = "#F28C45";
  ctx.font = "600 30px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Avg. 9 Days to Sell on OLX", tile2X + 35, row2Y + 175);

  // 8. Bottom Intelligence Footer Card
  const footY = row2Y + tileH + 26;
  ctx.fillStyle = "#121215";
  roundRect(ctx, 80, footY, cardW, 140, 28);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#F28C45";
  ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("● Real-time Indian Secondary Market ML Regressor", 125, footY + 58);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 30px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Trained on 1,600+ verified Delhi-NCR, Mumbai & Bengaluru sales data", 125, footY + 105);

  // 9. Home Indicator Bar (Bottom)
  ctx.fillStyle = "#55555C";
  roundRect(ctx, width / 2 - 170, height - 60, 340, 14, 7);
  ctx.fill();

  // Create texture with Linear filtering & maximum anisotropy
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
