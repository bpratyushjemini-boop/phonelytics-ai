"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPhoneScreenTexture } from "./PhoneDisplayTexture";

interface InteractivePhoneProps {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
  accentColor?: string;
  viewMode?: "hero" | "front" | "back";
}

export function InteractivePhone({
  deviceModel = "iPhone 15 Pro",
  priceText = "₹89,400",
  tradeinText = "₹71,500",
  accentColor = "#F28C45",
  viewMode = "hero",
}: InteractivePhoneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const manualRotRef = useRef({ x: 0, y: 0 });
  const entranceProgressRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Track window scroll for coordinated camera & phone transition into valuation section
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.85;
      const progress = Math.min(1.4, Math.max(0, scrollY / heroHeight));
      scrollRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pointer movement tracking
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = (e.clientX - dragStartRef.current.x) * 0.007;
        const deltaY = (e.clientY - dragStartRef.current.y) * 0.007;
        manualRotRef.current.y = dragStartRef.current.rotY + deltaX;
        manualRotRef.current.x = Math.max(-0.7, Math.min(0.7, dragStartRef.current.rotX + deltaY));
      } else {
        pointerRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        rotX: manualRotRef.current.x,
        rotY: manualRotRef.current.y,
      };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  // 1. High-DPI Screen Canvas Texture
  const screenTexture = useMemo(() => {
    return createPhoneScreenTexture(deviceModel, priceText, tradeinText);
  }, [deviceModel, priceText, tradeinText]);

  // 2. Chassis Dimensions (Realistic Flagship: 2.16 x 4.68 x 0.21)
  const phoneWidth = 2.16;
  const phoneHeight = 4.68;
  const cornerRadius = 0.36;

  // Extruded Chassis Geometry with Chamfered Bevel
  const chassisGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = -phoneWidth / 2;
    const y = -phoneHeight / 2;

    shape.moveTo(x + cornerRadius, y);
    shape.lineTo(x + phoneWidth - cornerRadius, y);
    shape.quadraticCurveTo(x + phoneWidth, y, x + phoneWidth, y + cornerRadius);
    shape.lineTo(x + phoneWidth, y + phoneHeight - cornerRadius);
    shape.quadraticCurveTo(x + phoneWidth, y + phoneHeight, x + phoneWidth - cornerRadius, y + phoneHeight);
    shape.lineTo(x + cornerRadius, y + phoneHeight);
    shape.quadraticCurveTo(x, y + phoneHeight, x, y + phoneHeight - cornerRadius);
    shape.lineTo(x, y + cornerRadius);
    shape.quadraticCurveTo(x, y, x + cornerRadius, y);

    const extrudeSettings = {
      depth: 0.20,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, [phoneWidth, phoneHeight, cornerRadius]);

  // 3. Display Screen Geometry (Thin Bezels: 2.06 x 4.58)
  const screenGeometry = useMemo(() => {
    const sWidth = 2.06;
    const sHeight = 4.58;
    const sRadius = 0.32;

    const shape = new THREE.Shape();
    const x = -sWidth / 2;
    const y = -sHeight / 2;

    shape.moveTo(x + sRadius, y);
    shape.lineTo(x + sWidth - sRadius, y);
    shape.quadraticCurveTo(x + sWidth, y, x + sWidth, y + sRadius);
    shape.lineTo(x + sWidth, y + sHeight - sRadius);
    shape.quadraticCurveTo(x + sWidth, y + sHeight, x + sWidth - sRadius, y + sHeight);
    shape.lineTo(x + sRadius, y + sHeight);
    shape.quadraticCurveTo(x, y + sHeight, x, y + sHeight - sRadius);
    shape.lineTo(x, y + sRadius);
    shape.quadraticCurveTo(x, y, x + sRadius, y);

    return new THREE.ShapeGeometry(shape, 32);
  }, []);

  // 4. Rear Camera Plateau Geometry
  const plateauGeometry = useMemo(() => {
    const pWidth = 1.05;
    const pHeight = 1.10;
    const pRadius = 0.22;

    const shape = new THREE.Shape();
    const x = -pWidth / 2;
    const y = -pHeight / 2;

    shape.moveTo(x + pRadius, y);
    shape.lineTo(x + pWidth - pRadius, y);
    shape.quadraticCurveTo(x + pWidth, y, x + pWidth, y + pRadius);
    shape.lineTo(x + pWidth, y + pHeight - pRadius);
    shape.quadraticCurveTo(x + pWidth, y + pHeight, x + pWidth - pRadius, y + pHeight);
    shape.lineTo(x + pRadius, y + pHeight);
    shape.quadraticCurveTo(x, y + pHeight, x, y + pHeight - pRadius);
    shape.lineTo(x, y + pRadius);
    shape.quadraticCurveTo(x, y, x + pRadius, y);

    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.018,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Frame animation loop with damped lerping & camera transitions
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Entrance animation progress easing
    if (entranceProgressRef.current < 1) {
      entranceProgressRef.current = THREE.MathUtils.damp(entranceProgressRef.current, 1, 4, delta);
    }

    if (reducedMotion) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0.1, -0.2, 0);
      return;
    }

    // Pointer smoothing
    pointerRef.current.x = THREE.MathUtils.damp(pointerRef.current.x, pointerRef.current.targetX, 5, delta);
    pointerRef.current.y = THREE.MathUtils.damp(pointerRef.current.y, pointerRef.current.targetY, 5, delta);

    // Manual rotation decay when user releases pointer
    if (!isDraggingRef.current) {
      manualRotRef.current.x = THREE.MathUtils.damp(manualRotRef.current.x, 0, 3.5, delta);
      manualRotRef.current.y = THREE.MathUtils.damp(manualRotRef.current.y, 0, 3.5, delta);
    }

    const scroll = scrollRef.current;
    const t = state.clock.getElapsedTime();

    // Mode-specific target choreography
    let targetRotY = -0.32;
    let targetRotX = 0.12;
    let targetRotZ = 0;
    let targetPosX = 0.05;
    let targetPosY = 0;
    let targetPosZ = 0;

    if (viewMode === "front") {
      // Front view: Direct face-on orientation, brought closer to camera for maximum readability
      targetRotY = 0;
      targetRotX = 0;
      targetRotZ = 0;
      targetPosX = 0;
      targetPosY = 0;
      targetPosZ = 0.35;
    } else if (viewMode === "back") {
      // Back view: Smooth 180° rotation revealing rear frosted glass and camera optics
      targetRotY = Math.PI - 0.22;
      targetRotX = 0.08;
      targetRotZ = -0.04;
      targetPosX = -0.05;
      targetPosY = 0;
      targetPosZ = 0.25;
    } else {
      // Hero view: Dynamic 3/4 isometric angle with scroll-linked camera/phone storytelling
      targetRotY = -0.32 + scroll * 0.75;
      targetRotX = 0.12 - scroll * 0.18;
      targetRotZ = 0.02 - scroll * 0.06;
      targetPosX = 0.05 - scroll * 0.2;
      targetPosY = -scroll * 0.55;
      targetPosZ = -scroll * 0.65;
    }

    // Gentle physical breathing floating micro-motion
    const floatY = Math.sin(t * 1.4) * 0.035;
    const floatRotZ = Math.cos(t * 1.0) * 0.012;

    // Apply pointer parallax & manual rotation
    const finalRotY = targetRotY + pointerRef.current.x * 0.28 + manualRotRef.current.y;
    const finalRotX = targetRotX - pointerRef.current.y * 0.20 + manualRotRef.current.x;
    const finalRotZ = targetRotZ + floatRotZ - pointerRef.current.x * 0.05;

    // Smooth entrance interpolation
    const entranceOffset = (1 - entranceProgressRef.current) * 0.8;
    const finalPosY = targetPosY + floatY - entranceOffset;
    const finalPosZ = targetPosZ;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, finalRotY, 6, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, finalRotX, 6, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, finalRotZ, 6, delta);

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 6, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, finalPosY, 6, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, finalPosZ, 6, delta);
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 1. Main Metallic Titanium Band Chassis */}
      <mesh geometry={chassisGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#2A2A2E"
          metalness={0.96}
          roughness={0.16}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* 2. Thin Dark Ceramic Screen Bezel Border */}
      <mesh position={[0, 0, 0.136]}>
        <planeGeometry args={[2.10, 4.62]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* 3. Front OLED Display Screen with Ultra-Crisp Valuation Texture */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.138]}>
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      {/* 4. Front Glass Specular Sheen Layer (Subtle surface reflection, zero transmission block) */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.140]}>
        <meshStandardMaterial
          transparent
          opacity={0.07}
          roughness={0.05}
          metalness={0.85}
          color="#FFFFFF"
          envMapIntensity={2.5}
        />
      </mesh>

      {/* 5. Rear Frosted Matte Glass Backplate */}
      <mesh geometry={screenGeometry} position={[0, 0, -0.138]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial
          color="#161619"
          roughness={0.42}
          metalness={0.22}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Rear Subtle Phonelytics Emblem Ring */}
      <mesh position={[0, 0, -0.140]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[0.22, 0.25, 32]} />
        <meshStandardMaterial color="#2E2E34" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 6. Rear Triple Camera Plateau (Top-Left of Rear) */}
      <group position={[-0.48, 1.48, -0.16]} rotation={[0, Math.PI, 0]}>
        {/* Rounded Beveled Plateau */}
        <mesh geometry={plateauGeometry}>
          <meshStandardMaterial
            color="#222226"
            metalness={0.92}
            roughness={0.22}
            envMapIntensity={1.8}
          />
        </mesh>

        {/* Camera Lens 1: Top Left */}
        <group position={[-0.26, 0.28, 0.045]}>
          {/* Polished Titanium Outer Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.045, 32]} />
            <meshStandardMaterial color="#3C3C44" metalness={0.98} roughness={0.12} />
          </mesh>
          {/* Inner Sapphire Glass */}
          <mesh position={[0, 0, 0.025]}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color="#06090F" />
          </mesh>
          {/* Anti-reflective Optical Coating Specular Glint */}
          <mesh position={[0.035, 0.035, 0.027]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="rgba(242, 140, 69, 0.65)" />
          </mesh>
          <mesh position={[-0.035, -0.035, 0.027]}>
            <circleGeometry args={[0.025, 16]} />
            <meshBasicMaterial color="rgba(224, 197, 143, 0.45)" />
          </mesh>
        </group>

        {/* Camera Lens 2: Bottom Left */}
        <group position={[-0.26, -0.28, 0.045]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.045, 32]} />
            <meshStandardMaterial color="#3C3C44" metalness={0.98} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color="#06090F" />
          </mesh>
          <mesh position={[0.035, 0.035, 0.027]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="rgba(242, 140, 69, 0.65)" />
          </mesh>
          <mesh position={[-0.035, -0.035, 0.027]}>
            <circleGeometry args={[0.025, 16]} />
            <meshBasicMaterial color="rgba(224, 197, 143, 0.45)" />
          </mesh>
        </group>

        {/* Camera Lens 3: Right Center */}
        <group position={[0.26, 0.0, 0.045]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.045, 32]} />
            <meshStandardMaterial color="#3C3C44" metalness={0.98} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <circleGeometry args={[0.15, 32]} />
            <meshBasicMaterial color="#06090F" />
          </mesh>
          <mesh position={[0.035, 0.035, 0.027]}>
            <circleGeometry args={[0.045, 16]} />
            <meshBasicMaterial color="rgba(242, 140, 69, 0.65)" />
          </mesh>
          <mesh position={[-0.035, -0.035, 0.027]}>
            <circleGeometry args={[0.025, 16]} />
            <meshBasicMaterial color="rgba(224, 197, 143, 0.45)" />
          </mesh>
        </group>

        {/* Dual-Tone LED True-Tone Flash */}
        <mesh position={[0.26, 0.35, 0.035]}>
          <circleGeometry args={[0.07, 24]} />
          <meshBasicMaterial color="#FAF7F2" />
        </mesh>
        <mesh position={[0.26, 0.35, 0.036]}>
          <ringGeometry args={[0.07, 0.085, 24]} />
          <meshStandardMaterial color="#4A4A52" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Dark LiDAR Scanner Sensor */}
        <mesh position={[0.26, -0.35, 0.035]}>
          <circleGeometry args={[0.055, 24]} />
          <meshBasicMaterial color="#050508" />
        </mesh>

        {/* Microphone Pinhole */}
        <mesh position={[0.36, -0.15, 0.035]}>
          <circleGeometry args={[0.015, 12]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* 7. Hardware Side Controls */}
      {/* Right: Power / Lock Button */}
      <mesh position={[1.11, 0.75, 0]}>
        <boxGeometry args={[0.028, 0.58, 0.065]} />
        <meshStandardMaterial color="#36363C" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Left: Burnt Orange Action Button */}
      <mesh position={[-1.11, 1.40, 0]}>
        <boxGeometry args={[0.028, 0.26, 0.065]} />
        <meshStandardMaterial color={accentColor} metalness={0.88} roughness={0.22} />
      </mesh>

      {/* Left: Volume Up Button */}
      <mesh position={[-1.11, 0.95, 0]}>
        <boxGeometry args={[0.028, 0.42, 0.065]} />
        <meshStandardMaterial color="#36363C" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Left: Volume Down Button */}
      <mesh position={[-1.11, 0.42, 0]}>
        <boxGeometry args={[0.028, 0.42, 0.065]} />
        <meshStandardMaterial color="#36363C" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Top: Ear Speaker Slit */}
      <mesh position={[0, 2.31, 0.136]}>
        <boxGeometry args={[0.42, 0.025, 0.015]} />
        <meshBasicMaterial color="#0A0A0C" />
      </mesh>

      {/* Bottom: USB-C Port Cutout */}
      <mesh position={[0, -2.35, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.05]} />
        <meshBasicMaterial color="#08080A" />
      </mesh>

      {/* Bottom: Dual Speaker Grilles */}
      {[-0.6, -0.45, -0.3, 0.3, 0.45, 0.6].map((posX, idx) => (
        <mesh key={idx} position={[posX, -2.35, 0]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
      ))}
    </group>
  );
}
