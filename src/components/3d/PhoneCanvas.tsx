"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { InteractivePhone } from "./InteractivePhone";
import { Sparkles, Eye, RotateCw, ShieldCheck, Activity } from "lucide-react";

interface PhoneCanvasProps {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
  accentColor?: string;
}

// Fallback high-fidelity CSS 3D phone representation when WebGL is unavailable or loading
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
    <div className="phone-viewport relative w-[310px] sm:w-[340px] h-[520px] sm:h-[560px] flex items-center justify-center">
      <div className="absolute inset-0 bg-brand-orange/10 blur-2xl rounded-full scale-90 pointer-events-none" />
      <div className="phone-3d-model animate-phone-float relative w-[260px] sm:w-[280px] h-[500px] sm:h-[530px] rounded-[48px] p-3 bg-gradient-to-b from-[#2B2B2B] via-[#1E1E1E] to-[#141414] shadow-2xl border-2 border-brand-orange/40">
        <div className="w-full h-full rounded-[40px] bg-charcoal-950 border border-charcoal-600/80 p-3.5 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex items-center justify-between px-2 pt-1">
            <span className="text-[10px] font-semibold text-brand-grey tracking-wider">9:41</span>
            <div className="w-20 h-4 bg-charcoal-900 rounded-full border border-charcoal-700/80 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-charcoal-950" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange/60" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2 bg-brand-grey rounded-[1px]" />
              <div className="w-1.5 h-2 bg-brand-orange rounded-[1px]" />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none rounded-[40px]" />

          <div className="relative z-10 space-y-3.5 my-auto px-1">
            <div className="flex items-center justify-between pb-2 border-b border-charcoal-600">
              <div>
                <div className="text-[11px] font-semibold text-brand-beige uppercase tracking-wider">Market Analysis</div>
                <div className="text-sm font-bold text-brand-ivory">{deviceModel}</div>
              </div>
              <div className="px-2 py-0.5 rounded bg-charcoal-700 text-[10px] font-medium text-brand-grey border border-charcoal-600">
                256 GB
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-charcoal-800/90 border border-charcoal-600 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-grey">Fair Peer-to-Peer</span>
                <span className="text-[10px] font-medium text-brand-beige">Est. Resale</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-brand-orange">{priceText}</div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-charcoal-700/80 text-brand-grey">
                <span>Original: ₹1,34,900</span>
                <span className="text-brand-beige font-semibold">-33.7%</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-charcoal-900 border border-charcoal-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-beige" />
                <span className="text-brand-ivory text-[11px]">Cashify Trade-in</span>
              </div>
              <span className="font-semibold text-brand-ivory text-[12px]">{tradeinText}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-charcoal-800 border border-charcoal-700">
                <div className="text-brand-grey">Condition</div>
                <div className="font-semibold text-brand-ivory mt-0.5">Like New (1.0x)</div>
              </div>
              <div className="p-2 rounded bg-charcoal-800 border border-charcoal-700">
                <div className="text-brand-grey">Battery Health</div>
                <div className="font-semibold text-brand-ivory mt-0.5">93% (Healthy)</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-24 h-1 bg-charcoal-500 rounded-full mx-auto mb-1" />
        </div>
      </div>
    </div>
  );
}

// Procedural contact shadow disc rendered in 3D scene
function StudioShadowPlane() {
  return (
    <mesh position={[0, -3.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[2.5, 32]} />
      <meshBasicMaterial
        color="#000000"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
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

  // If WebGL is verified as unsupported, render the CSS fallback directly
  if (webGLSupported === false) {
    return <PhoneFallback deviceModel={deviceModel} priceText={priceText} tradeinText={tradeinText} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] sm:max-w-[380px] h-[520px] sm:h-[580px] flex flex-col items-center justify-center select-none"
      onPointerDown={() => setHasInteracted(true)}
    >
      {/* Burnt-Orange Ambient Glow Behind 3D Phone */}
      <div className="absolute inset-0 bg-brand-orange/10 blur-[100px] rounded-full scale-90 pointer-events-none" />

      {/* R3F 3D Canvas */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <Suspense fallback={<PhoneFallback deviceModel={deviceModel} priceText={priceText} tradeinText={tradeinText} />}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8.8], fov: 42 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* 1. Cinematic Studio Lighting */}
            {/* Ambient fill */}
            <ambientLight intensity={1.1} color="#1c1c1c" />

            {/* Studio Key Light (Top-Right Warm Ivory) */}
            <directionalLight
              position={[4, 6, 5]}
              intensity={2.8}
              color="#FAF7F2"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0001}
            />

            {/* Studio Fill Light (Left Slate/Charcoal) */}
            <directionalLight
              position={[-5, -2, 3]}
              intensity={1.0}
              color="#2a303a"
            />

            {/* Signature Burnt-Orange Rim Light (Rear-Left Edge Glint) */}
            <directionalLight
              position={[-4, 2.5, -4]}
              intensity={5.2}
              color="#F28C45"
            />

            {/* Secondary Warm Edge Accent (Bottom-Right Muted Gold) */}
            <pointLight
              position={[3.5, -2.5, -2.5]}
              intensity={2.2}
              color="#E0C58F"
              distance={10}
            />

            {/* Top Down Hair Light */}
            <spotLight
              position={[0, 8, 0]}
              intensity={1.5}
              angle={0.6}
              penumbra={0.8}
              color="#F5F0E9"
            />

            {/* Realistic Contact Shadow Disc */}
            <StudioShadowPlane />

            {/* 2. Interactive Realistic Smartphone Mesh */}
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

      {/* 3. PeachWeb-style Interactive Mode Switcher Bar */}
      <div className="absolute top-2 right-2 sm:right-4 z-20 flex items-center gap-1.5 p-1 rounded-lg bg-charcoal-800/90 border border-charcoal-600/80 backdrop-blur-md text-[11px] font-medium text-brand-grey shadow-lg">
        <button
          type="button"
          onClick={() => {
            setViewMode("hero");
            setHasInteracted(true);
          }}
          className={`px-2.5 py-1 rounded transition-colors ${
            viewMode === "hero"
              ? "bg-brand-orange text-charcoal-950 font-semibold"
              : "hover:text-brand-ivory hover:bg-charcoal-700/60"
          }`}
          title="Hero Isometric View"
        >
          Hero
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode("front");
            setHasInteracted(true);
          }}
          className={`px-2.5 py-1 rounded transition-colors ${
            viewMode === "front"
              ? "bg-brand-orange text-charcoal-950 font-semibold"
              : "hover:text-brand-ivory hover:bg-charcoal-700/60"
          }`}
          title="Front Display View"
        >
          Display
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode("back");
            setHasInteracted(true);
          }}
          className={`px-2.5 py-1 rounded transition-colors ${
            viewMode === "back"
              ? "bg-brand-orange text-charcoal-950 font-semibold"
              : "hover:text-brand-ivory hover:bg-charcoal-700/60"
          }`}
          title="Rear Optics & Chassis"
        >
          Optics
        </button>
      </div>

      {/* 4. Natural Interaction Cue Banner (fades out after first interaction) */}
      {!hasInteracted && (
        <div className="absolute bottom-16 z-20 pointer-events-none transition-opacity duration-500 animate-pulse">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal-900/95 border border-brand-orange/40 text-[11px] text-brand-beige backdrop-blur-md shadow-xl">
            <RotateCw className="w-3 h-3 text-brand-orange animate-spin" style={{ animationDuration: "8s" }} />
            <span>Drag to rotate • Move cursor for parallax</span>
          </div>
        </div>
      )}

      {/* 5. Editorial Badge in Bottom-Left */}
      <div className="absolute -bottom-4 -left-3 sm:-left-6 p-3 rounded-xl bg-charcoal-800/95 border border-charcoal-500/80 shadow-2xl backdrop-blur-md flex items-center gap-3 z-20 pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center">
          <Activity className="w-4 h-4 text-brand-orange" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-semibold text-brand-ivory flex items-center gap-1.5">
            <span>Interactive 3D Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
          </div>
          <div className="text-[10px] text-brand-grey">Physically based studio rendering</div>
        </div>
      </div>
    </div>
  );
}
