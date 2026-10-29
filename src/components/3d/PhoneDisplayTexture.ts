import * as THREE from "three";

/**
 * Creates a high-DPI canvas texture for the 3D smartphone display screen
 * showing active Phonelytics valuation intelligence.
 */
export function createPhoneScreenTexture(
  deviceModel: string = "iPhone 15 Pro",
  priceText: string = "₹89,400",
  tradeinText: string = "₹71,500"
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    // Return empty texture on server
    const canvas = {} as HTMLCanvasElement;
    return new THREE.CanvasTexture(canvas);
  }

  const width = 1024;
  const height = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - Deep charcoal black with subtle brand orange top glow
  ctx.fillStyle = "#0D0D0D";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2,
    300,
    50,
    width / 2,
    500,
    800
  );
  gradient.addColorStop(0, "rgba(242, 140, 69, 0.12)");
  gradient.addColorStop(1, "rgba(13, 13, 13, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Dynamic Island
  ctx.fillStyle = "#050505";
  roundRect(ctx, width / 2 - 140, 48, 280, 72, 36);
  ctx.fill();
  ctx.strokeStyle = "#1F1F1F";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Camera lens reflection inside island
  ctx.fillStyle = "#0c1524";
  ctx.beginPath();
  ctx.arc(width / 2 + 80, 84, 14, 0, Math.PI * 2);
  ctx.fill();

  // Status Bar
  ctx.fillStyle = "#A6A6A6";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("9:41", 100, 96);

  // 5G & Battery icon on top right
  ctx.font = "600 36px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("5G", width - 240, 96);

  // Battery pill
  ctx.strokeStyle = "#A6A6A6";
  ctx.lineWidth = 4;
  roundRect(ctx, width - 160, 64, 76, 40, 8);
  ctx.stroke();
  ctx.fillStyle = "#F28C45";
  roundRect(ctx, width - 156, 70, 52, 28, 4);
  ctx.fill();

  // Screen Content Container
  // Header tag
  ctx.fillStyle = "#E0C58F";
  ctx.font = "600 34px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("AI VALUATION INTELLIGENCE", 80, 260);

  // Device Title
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 68px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(deviceModel, 80, 345);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 38px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("256 GB • Like New Condition", 80, 410);

  // Divider line
  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 460);
  ctx.lineTo(width - 80, 460);
  ctx.stroke();

  // Primary Valuation Box
  ctx.fillStyle = "#161616";
  roundRect(ctx, 80, 510, width - 160, 420, 36);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.4)";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "500 36px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Estimated Fair Peer Resale", 120, 580);

  ctx.fillStyle = "#F28C45";
  ctx.font = "bold 110px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(priceText, 120, 710);

  ctx.fillStyle = "#E0C58F";
  ctx.font = "600 36px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Indicative Range: ₹84,000 – ₹94,800", 120, 785);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Depreciation from original invoice: -33.7%", 120, 845);

  // Instant Trade-In Card (Cashify)
  ctx.fillStyle = "#161616";
  roundRect(ctx, 80, 970, width - 160, 240, 32);
  ctx.fill();
  ctx.strokeStyle = "#2D2D2D";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Instant Buyback (Cashify)", 120, 1050);

  ctx.fillStyle = "#E0C58F";
  ctx.font = "bold 58px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(tradeinText, 120, 1140);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Doorstep pickup • Instant UPI", width - 480, 1140);

  // Specs 2x2 Grid
  const cardW = (width - 160 - 30) / 2;
  const cardH = 180;

  // Battery Box
  ctx.fillStyle = "#141414";
  roundRect(ctx, 80, 1250, cardW, cardH, 24);
  ctx.fill();
  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Battery Health", 110, 1310);
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 46px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("93% (Healthy)", 110, 1380);

  // Condition Box
  ctx.fillStyle = "#141414";
  roundRect(ctx, 80 + cardW + 30, 1250, cardW, cardH, 24);
  ctx.fill();
  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Physical Grade", 110 + cardW + 30, 1310);
  ctx.fillStyle = "#F5F0E9";
  ctx.font = "bold 46px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Like New (1.0x)", 110 + cardW + 30, 1380);

  // Bottom Model Notice
  ctx.fillStyle = "#161616";
  roundRect(ctx, 80, 1470, width - 160, 170, 24);
  ctx.fill();
  ctx.strokeStyle = "#262626";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#F28C45";
  ctx.font = "600 32px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("● Gradient Boosting Regression Active", 120, 1535);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = "400 28px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("R² = 0.9887 • Calibrated across 1,600+ market transactions", 120, 1585);

  // Home Indicator Bar
  ctx.fillStyle = "#666666";
  roundRect(ctx, width / 2 - 160, height - 70, 320, 14, 7);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
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
