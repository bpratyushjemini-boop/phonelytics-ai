"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPhoneScreenTexture } from "./PhoneDisplayTexture";

interface InteractivePhoneProps {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
  accentColor?: string; // e.g. #F28C45
  viewMode?: "hero" | "front" | "back";
  onInspectChange?: (mode: "hero" | "front" | "back") => void;
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

  // Track window scroll for PeachWeb-style coordinated choreography
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.9;
      const progress = Math.min(1.5, Math.max(0, scrollY / heroHeight));
      scrollRef.current = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track pointer movements
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const deltaX = (e.clientX - dragStartRef.current.x) * 0.008;
        const deltaY = (e.clientY - dragStartRef.current.y) * 0.008;
        manualRotRef.current.y = dragStartRef.current.rotY + deltaX;
        manualRotRef.current.x = Math.max(-0.8, Math.min(0.8, dragStartRef.current.rotX + deltaY));
      } else {
        // Normalized device coordinates (-1 to 1)
        pointerRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // If clicking near center canvas, enable manual rotation
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

  // Screen Canvas Texture
  const screenTexture = useMemo(() => {
    return createPhoneScreenTexture(deviceModel, priceText, tradeinText);
  }, [deviceModel, priceText, tradeinText]);

  // Procedural Chassis Geometry (Rounded Extruded Box)
  const chassisGeometry = useMemo(() => {
    const width = 2.75;
    const height = 5.75;
    const radius = 0.42;

    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    const extrudeSettings = {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Screen Face Geometry
  const screenGeometry = useMemo(() => {
    const width = 2.62;
    const height = 5.56;
    const radius = 0.36;

    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return new THREE.ShapeGeometry(shape, 32);
  }, []);

  // Frame animation loop with damped lerping
  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    // Smooth pointer damping
    pointerRef.current.x = THREE.MathUtils.damp(
      pointerRef.current.x,
      pointerRef.current.targetX,
      6,
      delta
    );
    pointerRef.current.y = THREE.MathUtils.damp(
      pointerRef.current.y,
      pointerRef.current.targetY,
      6,
      delta
    );

    // If user is not dragging, decay manual rotation slowly back towards equilibrium
    if (!isDraggingRef.current) {
      manualRotRef.current.x = THREE.MathUtils.damp(manualRotRef.current.x, 0, 3, delta);
      manualRotRef.current.y = THREE.MathUtils.damp(manualRotRef.current.y, 0, 3, delta);
    }

    const scroll = scrollRef.current; // 0 to 1.5+
    const t = state.clock.getElapsedTime();

    // Base PeachWeb Hero equilibrium angles
    let baseRotY = -0.32;
    let baseRotX = 0.14;
    let basePosY = 0;
    let basePosZ = 0;

    if (viewMode === "front") {
      baseRotY = 0;
      baseRotX = 0;
    } else if (viewMode === "back") {
      baseRotY = Math.PI - 0.2;
      baseRotX = 0.05;
    } else {
      // Coordinated scroll animation:
      // As user scrolls, the phone pitches, rotates from front to side-isometric view, and glides
      baseRotY = -0.32 + scroll * 0.95;
      baseRotX = 0.14 - scroll * 0.22;
      basePosY = -scroll * 0.65;
      basePosZ = -scroll * 0.8;
    }

    // Subtle gentle breathing micro-animation
    const floatY = Math.sin(t * 1.2) * 0.05;
    const floatRotZ = Math.cos(t * 0.8) * 0.015;

    // Target rotation including mouse parallax and manual drag
    const targetY =
      baseRotY + pointerRef.current.x * 0.35 + manualRotRef.current.y;
    const targetX =
      baseRotX - pointerRef.current.y * 0.25 + manualRotRef.current.x;
    const targetZ = floatRotZ - pointerRef.current.x * 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY,
      7,
      delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetX,
      7,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetZ,
      7,
      delta
    );

    // Target position
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      basePosY + floatY,
      6,
      delta
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      basePosZ,
      6,
      delta
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* 1. Main Metallic Titanium Chassis Frame */}
      <mesh geometry={chassisGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#222222"
          metalness={0.92}
          roughness={0.22}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 2. Front Screen Panel with Active Valuation Canvas Texture */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.185]}>
        <meshBasicMaterial map={screenTexture} toneMapped={false} />
      </mesh>

      {/* Front Glass Clearcoat Reflection Layer */}
      <mesh geometry={screenGeometry} position={[0, 0, 0.187]}>
        <meshPhysicalMaterial
          transparent
          opacity={0.12}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          ior={1.5}
          clearcoat={1.0}
        />
      </mesh>

      {/* 3. Rear Frosted Matte Glass Backplate */}
      <mesh geometry={screenGeometry} position={[0, 0, -0.185]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial
          color="#161616"
          roughness={0.32}
          metalness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* 4. Rear Camera Island (Plateau on top-left of rear) */}
      <group position={[-0.6, 1.85, -0.22]} rotation={[0, Math.PI, 0]}>
        {/* Rounded Plateau Box */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1.25, 0.08]} />
          <meshStandardMaterial color="#202020" metalness={0.88} roughness={0.24} />
        </mesh>

        {/* Camera Lens 1 (Top Left) */}
        <group position={[-0.32, 0.32, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
            <meshStandardMaterial color="#303030" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <circleGeometry args={[0.18, 32]} />
            <meshBasicMaterial color="#080e1a" />
          </mesh>
          <mesh position={[0.04, 0.04, 0.038]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="rgba(242, 140, 69, 0.6)" />
          </mesh>
        </group>

        {/* Camera Lens 2 (Bottom Left) */}
        <group position={[-0.32, -0.32, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
            <meshStandardMaterial color="#303030" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <circleGeometry args={[0.18, 32]} />
            <meshBasicMaterial color="#080e1a" />
          </mesh>
          <mesh position={[0.04, 0.04, 0.038]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="rgba(242, 140, 69, 0.6)" />
          </mesh>
        </group>

        {/* Camera Lens 3 (Right Middle) */}
        <group position={[0.32, 0.0, 0.05]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 32]} />
            <meshStandardMaterial color="#303030" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <circleGeometry args={[0.18, 32]} />
            <meshBasicMaterial color="#080e1a" />
          </mesh>
          <mesh position={[0.04, 0.04, 0.038]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="rgba(242, 140, 69, 0.6)" />
          </mesh>
        </group>

        {/* Dual-Tone LED Flash Ring */}
        <mesh position={[0.32, 0.42, 0.04]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#F5F0E9" />
        </mesh>

        {/* LiDAR Sensor Dot */}
        <mesh position={[0.32, -0.42, 0.04]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
      </group>

      {/* 5. Physical Hardware Buttons */}
      {/* Power Button (Right Side) */}
      <mesh position={[1.42, 0.8, 0]}>
        <boxGeometry args={[0.03, 0.65, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Volume Up (Left Side) */}
      <mesh position={[-1.42, 1.1, 0]}>
        <boxGeometry args={[0.03, 0.48, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Volume Down (Left Side) */}
      <mesh position={[-1.42, 0.5, 0]}>
        <boxGeometry args={[0.03, 0.48, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Action Button (Left Side Upper) */}
      <mesh position={[-1.42, 1.6, 0]}>
        <boxGeometry args={[0.03, 0.28, 0.08]} />
        <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 6. Subtle Burnt-Orange Edge Chamfer Highlight Mesh */}
      <mesh position={[0, 0, 0.184]}>
        <ringGeometry args={[1.32, 1.34, 4]} />
        <meshBasicMaterial color="#F28C45" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
