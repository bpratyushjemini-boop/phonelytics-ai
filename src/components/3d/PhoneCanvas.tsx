"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import { InteractivePhone } from "./InteractivePhone";
import { RotateCw, ShieldCheck } from "lucide-react";

interface PhoneCanvasProps {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
  accentColor?: string;
}

// Fallback high-fidelity CSS 3D phone representation when WebGL is unavailable or during SSR
export function PhoneFallback({
  deviceModel = "iPhone 15 Pro",
  priceText = "₹89,400",
  tradeinText = "₹71,500",
}: {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
}) {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[390px] h-[520px] sm:h-[560px] flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-brand-orange/8 blur-3xl rounded-full scale-90 pointer-events-none" />

      {/* Modern Slim Phone Chassis */}
      <div className="relative w-[250px] sm:w-[270px] h-[490px] sm:h-[520px] rounded-[42px] p-2.5 bg-gradient-to-b from-[#323236] via-[#242428] to-[#18181A] shadow-2xl border-2 border-brand-orange/30">
        <div className="w-full h-full rounded-[34px] bg-[#0C0C0D] border border-charcoal-700/80 p-3.5 relative overflow-hidden flex flex-col justify-between">
          {/* Status Bar */}
          <div className="relative z-10 flex items-center justify-between px-2 pt-0.5">
            <span className="text-[11px] font-bold text-brand-ivory tracking-wider">09:41</span>
            <div className="w-20 h-4 bg-black rounded-full border border-charcoal-800 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/70" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-brand-ivory">
              <span>5G</span>
              <div className="w-3.5 h-2 border border-brand-ivory rounded-sm flex items-center p-0.5">
                <div className="w-2 h-1 bg-brand-orange rounded-[0.5px]" />
              </div>
            </div>
          </div>

          {/* Screen Content: Live Valuation Preview */}
          <div className="relative z-10 space-y-3 my-auto px-1">
            <div className="flex items-center justify-between pb-1.5 border-b border-charcoal-800">
              <div>
                <div className="text-[10px] font-bold text-brand-beige uppercase tracking-wider">AI Valuation</div>
                <div className="text-sm font-bold text-brand-ivory">{deviceModel}</div>
              </div>
              <div className="px-2 py-0.5 rounded bg-charcoal-800 text-[10px] font-medium text-brand-grey border border-charcoal-700">
                256 GB
              </div>
            </div>

            {/* Valuation Card */}
            <div className="p-3.5 rounded-xl bg-charcoal-900/90 border border-brand-orange/40 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-brand-grey">Estimated Peer Resale</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-brand-beige/10 text-brand-beige border border-brand-beige/30">
                  R² 0.988
                </span>
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-brand-orange">{priceText}</div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-charcoal-800 text-brand-grey">
                <span>Original: ₹1,34,900</span>
                <span className="text-brand-beige font-semibold">-33.7%</span>
              </div>
            </div>

            {/* Instant Trade-in Quote */}
            <div className="p-2.5 rounded-lg bg-charcoal-900/70 border border-charcoal-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-beige" />
                <span className="text-brand-ivory text-[11px]">Cashify Buyback</span>
              </div>
              <span className="font-bold text-brand-ivory text-[12px]">{tradeinText}</span>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-charcoal-900 border border-charcoal-800">
                <div className="text-brand-grey">Battery Health</div>
                <div className="font-semibold text-brand-ivory mt-0.5">93% (Healthy)</div>
              </div>
              <div className="p-2 rounded bg-charcoal-900 border border-charcoal-800">
                <div className="text-brand-grey">Condition</div>
                <div className="font-semibold text-brand-ivory mt-0.5">Like New (1.0x)</div>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="relative z-10 w-24 h-1 bg-charcoal-600 rounded-full mx-auto mb-1" />
        </div>
      </div>
    </div>
  );
}

export default function PhoneCanvas({
  deviceModel = "iPhone 15 Pro",
  priceText = "₹89,400",
  tradeinText = "₹71,500",
  accentColor = "#F28C45",
}: PhoneCanvasProps) {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<"hero" | "front" | "back">("hero");
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setWebGLSupported(!!gl);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Gracefully fallback to high-fidelity CSS component if WebGL is unavailable
  if (webGLSupported === false) {
    return <PhoneFallback deviceModel={deviceModel} priceText={priceText} tradeinText={tradeinText} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[360px] sm:max-w-[420px] h-[520px] sm:h-[580px] flex flex-col items-center justify-center select-none"
      onPointerDown={() => setHasInteracted(true)}
    >
      {/* Subtle Studio Ambient Background Halo (#F28C45 / #E0C58F) */}
      <div className="absolute inset-0 bg-brand-orange/8 blur-[110px] rounded-full scale-90 pointer-events-none" />

      {/* Three.js / React Three Fiber Canvas */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <Suspense fallback={<PhoneFallback deviceModel={deviceModel} priceText={priceText} tradeinText={tradeinText} />}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 7.6], fov: 40 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* 1. Offline Cinematic Studio Environment with Metallic Lightformers */}
            <Environment resolution={256}>
              <group rotation={[-Math.PI / 3, 0, 1]}>
                <Lightformer form="rect" intensity={3.0} position={[0, 4, -8]} scale={[12, 12, 1]} color="#FAF7F2" />
                <Lightformer form="ring" intensity={2.2} position={[-5, 2, -1]} scale={[16, 3, 1]} color="#F28C45" />
                <Lightformer form="rect" intensity={1.8} position={[8, 1, 0]} scale={[16, 4, 1]} color="#E0C58F" />
              </group>
            </Environment>

            {/* 2. Studio Lighting */}
            <ambientLight intensity={1.2} color="#18181A" />

            {/* Key Light: Top-Right Warm Ivory */}
            <directionalLight
              position={[4.5, 6.0, 5.0]}
              intensity={3.2}
              color="#FAF7F2"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0001}
            />

            {/* Fill Light: Left Slate Charcoal */}
            <directionalLight
              position={[-5.0, -1.5, 3.5]}
              intensity={1.2}
              color="#2A2E38"
            />

            {/* Signature Burnt-Orange Rim Light (Rear-Left Edge Glint) */}
            <directionalLight
              position={[-4.0, 2.5, -4.5]}
              intensity={6.0}
              color="#F28C45"
            />

            {/* Secondary Warm Edge Accent (Bottom-Right Muted Gold) */}
            <pointLight
              position={[3.5, -2.5, -3.0]}
              intensity={2.8}
              color="#E0C58F"
              distance={12}
            />

            {/* Realistic Floor Contact Shadow */}
            <ContactShadows
              position={[0, -2.55, 0]}
              opacity={0.65}
              scale={8.5}
              blur={2.4}
              far={3.5}
              color="#000000"
            />

            {/* 3. Realistic Flagship Interactive Smartphone */}
            <InteractivePhone
              deviceModel={deviceModel}
              priceText={priceText}
              tradeinText={tradeinText}
              accentColor={accentColor}
              viewMode={viewMode}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* 4. PeachWeb-style View Switcher Tabs (Hero / Display / Optics) */}
      <div className="absolute top-2 right-2 sm:right-3 z-20 flex items-center gap-1 p-1 rounded-lg bg-charcoal-900/90 border border-charcoal-700/80 backdrop-blur-md text-[11px] font-medium text-brand-grey shadow-xl">
        <button
          type="button"
          onClick={() => {
            setViewMode("hero");
            setHasInteracted(true);
          }}
          className={`px-3 py-1 rounded transition-all duration-150 cursor-pointer ${
            viewMode === "hero"
              ? "bg-brand-orange text-charcoal-950 font-bold shadow-sm"
              : "hover:text-brand-ivory hover:bg-charcoal-800"
          }`}
          title="Hero 3/4 Isometric Perspective"
        >
          Hero
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode("front");
            setHasInteracted(true);
          }}
          className={`px-3 py-1 rounded transition-all duration-150 cursor-pointer ${
            viewMode === "front"
              ? "bg-brand-orange text-charcoal-950 font-bold shadow-sm"
              : "hover:text-brand-ivory hover:bg-charcoal-800"
          }`}
          title="Front Valuation Display"
        >
          Display
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode("back");
            setHasInteracted(true);
          }}
          className={`px-3 py-1 rounded transition-all duration-150 cursor-pointer ${
            viewMode === "back"
              ? "bg-brand-orange text-charcoal-950 font-bold shadow-sm"
              : "hover:text-brand-ivory hover:bg-charcoal-800"
          }`}
          title="Rear Camera Optics & Titanium Band"
        >
          Optics
        </button>
      </div>

      {/* 5. Natural Drag Hint (Fades out immediately once user interacts) */}
      {!hasInteracted && (
        <div className="absolute bottom-6 z-20 pointer-events-none transition-opacity duration-300">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-900/90 border border-charcoal-700 text-[11px] text-brand-beige backdrop-blur-md shadow-lg">
            <RotateCw className="w-3 h-3 text-brand-orange animate-spin" style={{ animationDuration: "9s" }} />
            <span>Drag to rotate • Move cursor for parallax</span>
          </div>
        </div>
      )}
    </div>
  );
}
