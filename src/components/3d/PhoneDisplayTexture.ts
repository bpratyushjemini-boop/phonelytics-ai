import * as THREE from "three";

/**
 * Creates a crisp canvas texture for the 3D smartphone OLED display.
 * Optimized for readability at the actual render size in the Three.js scene.
 * Uses large, bold typography and high-contrast elements.
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

  const width = 540;
  const height = 1170;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep OLED background
  ctx.fillStyle = "#0A0A0C";
  ctx.fillRect(0, 0, width, height);

  // Subtle warm ambient glow from top
  const ambientGrad = ctx.createRadialGradient(
    width / 2, 200, 40,
    width / 2, 400, 400
  );
  ambientGrad.addColorStop(0, "rgba(242, 140, 69, 0.10)");
  ambientGrad.addColorStop(0.6, "rgba(224, 197, 143, 0.03)");
  ambientGrad.addColorStop(1, "rgba(10, 10, 12, 0)");
  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);

  const font = (weight: string, size: number) =>
    `${weight} ${size}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  // ── Status Bar ──
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 26);
  ctx.fillText("09:41", 40, 58);

  // Dynamic Island
  ctx.fillStyle = "#000000";
  roundRect(ctx, width / 2 - 68, 24, 136, 38, 19);
  ctx.fill();

  // Signal + Battery
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 22);
  ctx.textAlign = "right";
  ctx.fillText("5G  ▐▐▐▐", width - 40, 56);
  ctx.textAlign = "left";

  // ── Brand Badge ──
  const badgeY = 100;
  ctx.fillStyle = "rgba(242, 140, 69, 0.12)";
  roundRect(ctx, 36, badgeY, 220, 32, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.45)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#F28C45";
  ctx.beginPath();
  ctx.arc(54, badgeY + 16, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 13);
  ctx.fillText("PHONELYTICS VALUATION", 66, badgeY + 21);

  // ── Device Name ──
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 40);
  ctx.fillText(deviceModel, 36, badgeY + 80);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("500", 18);
  ctx.fillText("256 GB • A17 Pro • Titanium", 36, badgeY + 110);

  // Separator
  ctx.strokeStyle = "#222226";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(36, badgeY + 130);
  ctx.lineTo(width - 36, badgeY + 130);
  ctx.stroke();

  // ── Main Valuation Card ──
  const cardY = badgeY + 152;
  const cardW = width - 72;

  ctx.fillStyle = "#131316";
  roundRect(ctx, 36, cardY, cardW, 260, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(242, 140, 69, 0.55)";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Card title
  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("600", 15);
  ctx.fillText("FAIR PEER RESALE VALUE", 58, cardY + 36);

  // Confidence badge
  ctx.fillStyle = "rgba(224, 197, 143, 0.15)";
  roundRect(ctx, width - 168, cardY + 16, 110, 28, 14);
  ctx.fill();
  ctx.strokeStyle = "#E0C58F";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 12);
  ctx.fillText("R² 0.988", width - 152, cardY + 36);

  // Big Price
  ctx.fillStyle = "#F28C45";
  ctx.font = font("900", 62);
  ctx.fillText(priceText, 58, cardY + 115);

  // Divider
  ctx.strokeStyle = "#25252A";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(58, cardY + 140);
  ctx.lineTo(width - 58, cardY + 140);
  ctx.stroke();

  // Range
  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 17);
  ctx.fillText("₹84,200 – ₹94,500", 58, cardY + 175);

  // Original Price + Depreciation
  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("500", 15);
  ctx.fillText("Original: ₹1,34,900", 58, cardY + 210);

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("bold", 15);
  ctx.textAlign = "right";
  ctx.fillText("-33.7%", width - 58, cardY + 210);
  ctx.textAlign = "left";

  // Depreciation bar
  ctx.fillStyle = "#1A1A1E";
  roundRect(ctx, 58, cardY + 225, cardW - 44, 10, 5);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  roundRect(ctx, 58, cardY + 225, (cardW - 44) * 0.663, 10, 5);
  ctx.fill();

  // ── Instant Buyback Card ──
  const card2Y = cardY + 282;
  ctx.fillStyle = "#141417";
  roundRect(ctx, 36, card2Y, cardW, 140, 18);
  ctx.fill();
  ctx.strokeStyle = "#2A2A30";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#FAF7F2";
  ctx.font = font("bold", 20);
  ctx.fillText("Instant Buyback", 58, card2Y + 38);

  ctx.fillStyle = "#A6A6A6";
  ctx.font = font("400", 14);
  ctx.fillText("Cashify Verified Partner", 58, card2Y + 62);

  // Trade-in price
  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 36);
  ctx.textAlign = "right";
  ctx.fillText(tradeinText, width - 58, card2Y + 52);
  ctx.textAlign = "left";

  // Instant badge
  ctx.fillStyle = "rgba(242, 140, 69, 0.14)";
  roundRect(ctx, 58, card2Y + 85, 180, 28, 14);
  ctx.fill();
  ctx.fillStyle = "#F28C45";
  ctx.font = font("bold", 13);
  ctx.fillText("✓ Instant UPI Payout", 72, card2Y + 105);

  // ── Quick Stats Row ──
  const statsY = card2Y + 160;
  const statW = (cardW - 16) / 2;

  // Stat 1: Battery
  ctx.fillStyle = "#131316";
  roundRect(ctx, 36, statsY, statW, 100, 14);
  ctx.fill();
  ctx.strokeStyle = "#222228";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#777";
  ctx.font = font("600", 12);
  ctx.fillText("BATTERY", 54, statsY + 30);

  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 28);
  ctx.fillText("93%", 54, statsY + 65);

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("500", 12);
  ctx.fillText("Healthy", 54, statsY + 85);

  // Stat 2: Condition
  const stat2X = 36 + statW + 16;
  ctx.fillStyle = "#131316";
  roundRect(ctx, stat2X, statsY, statW, 100, 14);
  ctx.fill();
  ctx.strokeStyle = "#222228";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.fillStyle = "#777";
  ctx.font = font("600", 12);
  ctx.fillText("CONDITION", stat2X + 18, statsY + 30);

  ctx.fillStyle = "#F5F0E9";
  ctx.font = font("bold", 24);
  ctx.fillText("Like New", stat2X + 18, statsY + 65);

  ctx.fillStyle = "#E0C58F";
  ctx.font = font("500", 12);
  ctx.fillText("1.0x Multiplier", stat2X + 18, statsY + 85);

  // ── Footer ──
  const footY = statsY + 120;
  ctx.fillStyle = "rgba(242, 140, 69, 0.08)";
  roundRect(ctx, 36, footY, cardW, 52, 14);
  ctx.fill();

  ctx.fillStyle = "#F28C45";
  ctx.font = font("bold", 13);
  ctx.fillText("● Real-time Indian Market ML", 58, footY + 32);

  // Home indicator
  ctx.fillStyle = "#555";
  roundRect(ctx, width / 2 - 60, height - 30, 120, 6, 3);
  ctx.fill();

  // Create texture
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
