"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { InteractivePhone } from "./InteractivePhone";
import { RotateCw, ShieldCheck } from "lucide-react";

interface PhoneCanvasProps {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
  accentColor?: string;
}

// High-fidelity CSS fallback for when WebGL is unavailable
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
    <div className="relative w-full max-w-[300px] h-[480px] flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-brand-orange/6 blur-3xl rounded-full scale-90 pointer-events-none" />

      {/* CSS Phone Frame */}
      <div className="relative w-[220px] h-[440px] rounded-[36px] p-2 bg-gradient-to-b from-[#323236] via-[#242428] to-[#18181A] shadow-2xl border border-brand-orange/20">
        <div className="w-full h-full rounded-[28px] bg-[#0C0C0D] border border-charcoal-700/60 p-3 relative overflow-hidden flex flex-col justify-between">
          {/* Status Bar */}
          <div className="relative z-10 flex items-center justify-between px-1 pt-0.5">
            <span className="text-[10px] font-bold text-brand-ivory">09:41</span>
            <div className="w-16 h-3.5 bg-black rounded-full border border-charcoal-800 flex items-center justify-center gap-1">
              <div className="w-1 h-1 rounded-full bg-charcoal-900" />
              <div className="w-1 h-1 rounded-full bg-brand-orange/70" />
            </div>
            <div className="flex items-center gap-1 text-[9px] font-semibold text-brand-ivory">
              <span>5G</span>
              <div className="w-3 h-1.5 border border-brand-ivory rounded-sm flex items-center p-0.5">
                <div className="w-1.5 h-0.5 bg-brand-orange rounded-[0.5px]" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative z-10 space-y-2.5 my-auto px-0.5">
            <div className="flex items-center justify-between pb-1 border-b border-charcoal-800">
              <div>
                <div className="text-[9px] font-bold text-brand-beige uppercase tracking-wider">AI Valuation</div>
                <div className="text-xs font-bold text-brand-ivory">{deviceModel}</div>
              </div>
              <div className="px-1.5 py-0.5 rounded bg-charcoal-800 text-[9px] font-medium text-brand-grey border border-charcoal-700">
                256 GB
              </div>
            </div>

            {/* Valuation */}
            <div className="p-3 rounded-xl bg-charcoal-900/90 border border-brand-orange/35 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-brand-grey">Estimated Resale</span>
                <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-brand-beige/10 text-brand-beige border border-brand-beige/25">
                  R² 0.988
                </span>
              </div>
              <div className="text-xl font-extrabold tracking-tight text-brand-orange">{priceText}</div>
              <div className="flex items-center justify-between text-[9px] pt-0.5 border-t border-charcoal-800 text-brand-grey">
                <span>Original: ₹1,34,900</span>
                <span className="text-brand-beige font-semibold">-33.7%</span>
              </div>
            </div>

            {/* Trade-in */}
            <div className="p-2 rounded-lg bg-charcoal-900/60 border border-charcoal-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-brand-beige" />
                <span className="text-brand-ivory text-[10px]">Cashify</span>
              </div>
              <span className="font-bold text-brand-ivory text-[11px]">{tradeinText}</span>
            </div>
          </div>

          {/* Home indicator */}
          <div className="relative z-10 w-20 h-0.5 bg-charcoal-600 rounded-full mx-auto mb-0.5" />
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

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      setWebGLSupported(!!gl);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  if (webGLSupported === false) {
    return <PhoneFallback deviceModel={deviceModel} priceText={priceText} tradeinText={tradeinText} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[380px] sm:max-w-[440px] h-[480px] sm:h-[540px] flex flex-col items-center justify-center select-none"
      onPointerDown={() => setHasInteracted(true)}
    >
      {/* Ambient halo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-orange/8 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[60px] bg-brand-orange/5 blur-[50px] rounded-full" />
      </div>

      {/* Three.js Canvas */}
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <Suspense fallback={<PhoneFallback deviceModel={deviceModel} priceText={priceText} tradeinText={tradeinText} />}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 6], fov: 35 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Studio Environment */}
            <Environment resolution={256}>
              <group rotation={[-Math.PI / 3, 0, 1]}>
                {/* Large key softbox overhead */}
                <Lightformer form="rect" intensity={3.0} position={[0, 5, -6]} scale={[14, 14, 1]} color="#FAF7F2" />
                {/* Orange rim strip from left */}
                <Lightformer form="ring" intensity={2.5} position={[-6, 2, -1]} scale={[12, 3, 1]} color="#F28C45" />
                {/* Gold accent from right */}
                <Lightformer form="rect" intensity={1.5} position={[7, 1, 0]} scale={[12, 4, 1]} color="#E0C58F" />
              </group>
            </Environment>

            {/* Ambient fill - warm, not black */}
            <ambientLight intensity={0.4} color="#F5F0E9" />

            {/* Key light: top-right warm ivory */}
            <directionalLight
              position={[3, 5, 4]}
              intensity={2.5}
              color="#FAF7F2"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0001}
            />

            {/* Fill light: soft left */}
            <directionalLight
              position={[-4, -1, 3]}
              intensity={0.8}
              color="#C8C4BE"
            />

            {/* Signature burnt-orange rim (back-left) */}
            <directionalLight
              position={[-3.5, 2, -4]}
              intensity={4.0}
              color="#F28C45"
            />

            {/* Muted gold edge accent */}
            <pointLight
              position={[3, -2, -2.5]}
              intensity={2.0}
              color="#E0C58F"
              distance={10}
            />

            {/* Floor contact shadow */}
            <ContactShadows
              position={[0, -1.85, 0]}
              opacity={0.5}
              scale={6}
              blur={2.2}
              far={3}
              color="#000000"
            />

            {/* The Phone */}
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

      {/* View Switcher */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 p-1 rounded-lg bg-charcoal-900/90 border border-charcoal-700/80 backdrop-blur-md text-[10px] font-medium text-brand-grey shadow-xl">
        {(["hero", "front", "back"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => { setViewMode(mode); setHasInteracted(true); }}
            className={`px-2.5 py-1 rounded transition-all duration-150 cursor-pointer capitalize ${
              viewMode === mode
                ? "bg-brand-orange text-charcoal-950 font-bold shadow-sm"
                : "hover:text-brand-ivory hover:bg-charcoal-800"
            }`}
            title={`${mode} view`}
          >
            {mode === "hero" ? "Hero" : mode === "front" ? "Display" : "Optics"}
          </button>
        ))}
      </div>

      {/* Drag hint */}
      {!hasInteracted && (
        <div className="absolute bottom-4 z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal-900/90 border border-charcoal-700 text-[10px] text-brand-beige backdrop-blur-md shadow-lg">
            <RotateCw className="w-3 h-3 text-brand-orange animate-spin" style={{ animationDuration: "8s" }} />
            <span>Drag to rotate</span>
          </div>
        </div>
      )}
    </div>
  );
}
