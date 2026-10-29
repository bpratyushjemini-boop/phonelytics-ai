import * as THREE from "three";

/**
 * Creates a crisp canvas texture for the 3D smartphone OLED display.
 * Renders at 2× resolution and uses large, bold typography for
 * readability when mapped onto the Three.js scene geometry.
 *
 * The texture canvas must produce clean, high-contrast content
 * that looks good even when viewed at a slight angle in the 3D hero.
 */
export function createPhoneScreenTexture(
  deviceModel: string = "iPhone 15 Pro",
  priceText: string = "₹89,400",
  tradeinText: string = "₹71,500"
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    // SSR guard — return a minimal texture that won't render
    const canvas = {} as HTMLCanvasElement;
    return new THREE.CanvasTexture(canvas);
  }

  // Higher resolution for crisp text on retina displays
  const width = 600;
  const height = 1300;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // ── OLED background ──
  ctx.fillStyle = "#0A0A0C";
  ctx.fillRect(0, 0, width, height);

  // Subtle warm ambient glow from top
  const ambientGrad = ctx.createRadialGradient(
    width / 2, 200, 40,
    width / 2, 450, 420
  );
  ambientGrad.addColorStop(0, "rgba(242, 140, 69, 0.08)");
  ambientGrad.addColorStop(0.6, "rgba(224, 197, 143, 0.025)");
  ambientGrad.addColorStop(1, "rgba(10, 10, 12, 0)");
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  const font = (weight: string, size: number) =>
    `${weight} ${size}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  // ── Status Bar ──
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 28);
  ctx.textAlign = "left";
  ctx.fillText("09:41", 44, 62);

  // Dynamic Island
  ctx.fillStyle = "#000000";
  roundRect(ctx, width / 2 - 72, 26, 144, 40, 20);
  ctx.fill();

  // Signal + Battery
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 24);
  ctx.textAlign = "right";
  ctx.fillText("5G  ▐▐▐▐", width - 44, 60);
  ctx.textAlign = "left";

  // ── Brand Badge ──
  const badgeY = 110;
  ctx.fillStyle = "rgba(242, 140, 69, 0.12)";
  roundRect(ctx, 40, badgeY, 240, 36, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.45)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#F28C45";
  ctx.beginPath();
  ctx.arc(60, badgeY + 18, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 14);
  ctx.fillText("PHONELYTICS VALUATION", 74, badgeY + 24);

  // ── Device Name ──
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 44);
  ctx.fillText(deviceModel, 40, badgeY + 88);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("500", 20);
  ctx.fillText("256 GB • A17 Pro • Titanium", 40, badgeY + 120);

  // Separator
  ctx.strokeStyle = "#222226";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(40, badgeY + 142);
  ctx.lineTo(width - 40, badgeY + 142);
  ctx.stroke();

  // ── Main Valuation Card ──
  const cardY = badgeY + 166;
  const cardW = width - 80;

  ctx.fillStyle = "#131316";
  roundRect(ctx, 40, cardY, cardW, 280, 22);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.50)";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Card title
  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("600", 16);
  ctx.fillText("FAIR PEER RESALE VALUE", 64, cardY + 40);

  // Confidence badge
  ctx.fillStyle = "rgba(224, 197, 143, 0.15)";
  roundRect(ctx, width - 188, cardY + 18, 120, 30, 15);
  ctx.fill();
  ctx.strokeStyle = "#E0C58F";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 13);
  ctx.fillText("R² 0.988", width - 172, cardY + 39);

  // Big Price — bold, warm orange, large
  ctx.fillStyle = "#F28C45";
  ctx.font = font("900", 68);
  ctx.fillText(priceText, 64, cardY + 126);

  // Divider
  ctx.strokeStyle = "#25252A";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(64, cardY + 152);
  ctx.lineTo(width - 64, cardY + 152);
  ctx.stroke();

  // Range
  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 19);
  ctx.fillText("₹84,200 – ₹94,500", 64, cardY + 190);

  // Original Price + Depreciation
  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("500", 16);
  ctx.fillText("Original: ₹1,34,900", 64, cardY + 228);

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 16);
  ctx.textAlign = "right";
  ctx.fillText("-33.7%", width - 64, cardY + 228);
  ctx.textAlign = "left";

  // Depreciation bar
  ctx.fillStyle = "#1A1A1E";
  roundRect(ctx, 64, cardY + 246, cardW - 48, 12, 6);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  roundRect(ctx, 64, cardY + 246, (cardW - 48) * 0.663, 12, 6);
  ctx.fill();

  // ── Instant Buyback Card ──
  const card2Y = cardY + 300;
  ctx.fillStyle = "#141417";
  roundRect(ctx, 40, card2Y, cardW, 150, 20);
  ctx.fill();
  ctx.strokeStyle = "#2A2A30";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#FAF7F2";
  ctx.font = font("bold", 22);
  ctx.fillText("Instant Buyback", 64, card2Y + 42);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("400", 15);
  ctx.fillText("Cashify Verified Partner", 64, card2Y + 68);

  // Trade-in price
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 40);
  ctx.textAlign = "right";
  ctx.fillText(tradeinText, width - 64, card2Y + 56);
  ctx.textAlign = "left";

  // Instant badge
  ctx.fillStyle = "rgba(242, 140, 69, 0.14)";
  roundRect(ctx, 64, card2Y + 92, 200, 30, 15);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  ctx.font = font("bold", 14);
  ctx.fillText("✓ Instant UPI Payout", 80, card2Y + 113);

  // ── Quick Stats Row ──
  const statsY = card2Y + 172;
  const statW = (cardW - 20) / 2;

  // Stat 1: Battery
  ctx.fillStyle = "#131316";
  roundRect(ctx, 40, statsY, statW, 110, 16);
  ctx.fill();
  ctx.strokeStyle = "#222228";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#777";
  ctx.font = font("600", 13);
  ctx.fillText("BATTERY", 60, statsY + 32);

  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 32);
  ctx.fillText("93%", 60, statsY + 72);

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("500", 13);
  ctx.fillText("Healthy", 60, statsY + 94);

  // Stat 2: Condition
  const stat2X = 40 + statW + 20;
  ctx.fillStyle = "#131316";
  roundRect(ctx, stat2X, statsY, statW, 110, 16);
  ctx.fill();
  ctx.strokeStyle = "#222228";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#777";
  ctx.font = font("600", 13);
  ctx.fillText("CONDITION", stat2X + 20, statsY + 32);

  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 28);
  ctx.fillText("Like New", stat2X + 20, statsY + 72);

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("500", 13);
  ctx.fillText("1.0x Multiplier", stat2X + 20, statsY + 94);

  // ── Market Intelligence Row ──
  const marketY = statsY + 130;
  ctx.fillStyle = "#131316";
  roundRect(ctx, 40, marketY, cardW, 140, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(224, 197, 143, 0.25)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 13);
  ctx.fillText("AI ENGINE INTELLIGENCE", 64, marketY + 34);

  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 20);
  ctx.fillText("Dual-Task ML Ensemble", 64, marketY + 68);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("400", 14);
  ctx.fillText("Trained on 1,400+ Cashify & OLX transactions", 64, marketY + 96);

  // Velocity badge inside card
  ctx.fillStyle = "rgba(242, 140, 69, 0.12)";
  roundRect(ctx, 64, marketY + 106, 170, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  ctx.font = font("bold", 11);
  ctx.fillText("⚡ 7-Day Resale Velocity", 76, marketY + 121);

  // ── Footer ──
  const footY = marketY + 160;
  ctx.fillStyle = "rgba(242, 140, 69, 0.08)";
  roundRect(ctx, 40, footY, cardW, 52, 16);
  ctx.fill();

  ctx.fillStyle = "#F28C45";
  ctx.font = font("bold", 14);
  ctx.fillText("● Real-time Indian Secondary Market ML", 64, footY + 33);

  // Home indicator
  ctx.fillStyle = "#555";
  roundRect(ctx, width / 2 - 64, height - 36, 128, 6, 3);
  ctx.fill();

  // Create texture with correct settings
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
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
