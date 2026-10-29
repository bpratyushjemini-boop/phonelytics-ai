"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createPhoneScreenTexture } from "./PhoneDisplayTexture";

interface InteractivePhoneProps {
  deviceModel?: string;
  priceText?: string;
  tradeinText?: string;
  accentColor?: string;
  viewMode?: "hero" | "front" | "back";
}

// Realistic phone dimensions (in Three.js units)
// Width:Height ratio ≈ 1:2.17 (like a real modern phone)
const PHONE_W = 1.5;
const PHONE_H = 3.25;
const PHONE_DEPTH = 0.12;
const CORNER_R = 0.18;
const BEZEL = 0.06; // visible bezel width

function createRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/**
 * Create a ShapeGeometry with NORMALIZED UVs (0..1).
 *
 * THREE.ShapeGeometry uses raw shape-vertex coordinates as UVs,
 * which for a centered shape produces negative and >1 values.
 * This causes the canvas texture to clamp to edge pixels,
 * producing the black rectangle artifacts seen on the deployed site.
 */
function createScreenGeometry(w: number, h: number, r: number): THREE.ShapeGeometry {
  const shape = createRoundedRectShape(w, h, r);
  const geom = new THREE.ShapeGeometry(shape, 24);

  // Fix UVs: normalize from shape-space to 0..1
  const uvAttr = geom.getAttribute("uv") as THREE.BufferAttribute;
  const uvArray = uvAttr.array as Float32Array;
  for (let i = 0; i < uvArray.length; i += 2) {
    // Shape goes from -w/2..w/2 in X and -h/2..h/2 in Y
    uvArray[i] = (uvArray[i] + w / 2) / w;       // u: 0..1
    uvArray[i + 1] = (uvArray[i + 1] + h / 2) / h; // v: 0..1
  }
  uvAttr.needsUpdate = true;
  geom.computeVertexNormals();

  return geom;
}

export function InteractivePhone({
  deviceModel = "iPhone 15 Pro",
  priceText = "₹89,400",
  tradeinText = "₹71,500",
  accentColor = "#F28C45",
  viewMode = "hero",
}: InteractivePhoneProps) {
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
  const manualRotRef = useRef({ x: 0, y: 0 });
  const entranceRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Pointer tracking & 3D drag interaction
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dom = gl.domElement;

    const onDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        rotX: manualRotRef.current.x,
        rotY: manualRotRef.current.y,
      };
    };

    const onMove = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        const dx = (e.clientX - dragStartRef.current.x) * 0.006;
        const dy = (e.clientY - dragStartRef.current.y) * 0.006;
        manualRotRef.current.y = dragStartRef.current.rotY + dx;
        manualRotRef.current.x = Math.max(-0.6, Math.min(0.6, dragStartRef.current.rotX + dy));
      } else {
        pointerRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };

    const onUp = () => {
      isDraggingRef.current = false;
    };

    dom.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      dom.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  // Screen Texture with lifecycle disposal
  const screenTexture = useMemo(
    () => createPhoneScreenTexture(deviceModel, priceText, tradeinText),
    [deviceModel, priceText, tradeinText]
  );

  useEffect(() => {
    return () => {
      screenTexture.dispose();
    };
  }, [screenTexture]);

  // Chassis (extruded rounded rect)
  const chassisGeometry = useMemo(() => {
    const shape = createRoundedRectShape(PHONE_W, PHONE_H, CORNER_R);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: PHONE_DEPTH,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    geom.center();
    return geom;
  }, []);

  // Screen surface with FIXED UV mapping
  const screenW = PHONE_W - BEZEL * 2;
  const screenH = PHONE_H - BEZEL * 2;
  const screenGeometry = useMemo(
    () => createScreenGeometry(screenW, screenH, CORNER_R - 0.04),
    [screenW, screenH]
  );

  // Bezel backing geometry (same rounded rect, no UV needed)
  const bezelGeometry = useMemo(() => {
    const shape = createRoundedRectShape(PHONE_W - 0.015, PHONE_H - 0.015, CORNER_R - 0.01);
    const geom = new THREE.ShapeGeometry(shape, 24);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Camera plateau
  const plateauGeometry = useMemo(() => {
    const shape = createRoundedRectShape(0.68, 0.72, 0.14);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
    geom.center();
    return geom;
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Entrance easing
    if (entranceRef.current < 1) {
      entranceRef.current = THREE.MathUtils.damp(entranceRef.current, 1, 3.5, delta);
    }

    if (reducedMotion) {
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0.08, -0.18, 0);
      return;
    }

    // Pointer smoothing
    pointerRef.current.x = THREE.MathUtils.damp(pointerRef.current.x, pointerRef.current.targetX, 4, delta);
    pointerRef.current.y = THREE.MathUtils.damp(pointerRef.current.y, pointerRef.current.targetY, 4, delta);

    // Manual rotation decay
    if (!isDraggingRef.current) {
      manualRotRef.current.x = THREE.MathUtils.damp(manualRotRef.current.x, 0, 3, delta);
      manualRotRef.current.y = THREE.MathUtils.damp(manualRotRef.current.y, 0, 3, delta);
    }

    const t = state.clock.getElapsedTime();

    // View-mode targets
    let tRotY = -0.28, tRotX = 0.10, tRotZ = 0.02;
    let tPosX = 0, tPosY = 0, tPosZ = 0;

    if (viewMode === "front") {
      tRotY = 0; tRotX = 0; tRotZ = 0;
      tPosZ = 0.3;
    } else if (viewMode === "back") {
      tRotY = Math.PI - 0.18;
      tRotX = 0.06; tRotZ = -0.03;
      tPosZ = 0.2;
    }

    // Gentle float
    const floatY = Math.sin(t * 1.3) * 0.025;
    const floatZ = Math.cos(t * 0.9) * 0.008;

    // Apply parallax + manual rotation
    const fRotY = tRotY + pointerRef.current.x * 0.22 + manualRotRef.current.y;
    const fRotX = tRotX - pointerRef.current.y * 0.15 + manualRotRef.current.x;
    const fRotZ = tRotZ + floatZ - pointerRef.current.x * 0.04;

    // Entrance offset
    const entOff = (1 - entranceRef.current) * 1.2;
    const fPosY = tPosY + floatY - entOff;

    // Entrance scale
    const scale = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      entranceRef.current < 0.95 ? 0.85 + entranceRef.current * 0.15 : 1,
      5, delta
    );
    groupRef.current.scale.setScalar(scale);

    // Smoothly interpolate all transforms
    const lerpSpeed = 5;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, fRotY, lerpSpeed, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, fRotX, lerpSpeed, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, fRotZ, lerpSpeed, delta);

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, tPosX, lerpSpeed, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, fPosY, lerpSpeed, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, tPosZ, lerpSpeed, delta);
  });

  // Front face z offset — account for half depth + bevel
  const halfDepth = PHONE_DEPTH / 2 + 0.02;

  return (
    <group ref={groupRef} dispose={null}>
      {/* 1. Titanium Frame / Chassis */}
      <mesh geometry={chassisGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#303034"
          metalness={0.95}
          roughness={0.18}
          envMapIntensity={2.2}
        />
      </mesh>

      {/* 2. Dark Bezel Ring (rounded rect, sits just proud of chassis) */}
      <mesh geometry={bezelGeometry} position={[0, 0, halfDepth + 0.001]}>
        <meshBasicMaterial
          color="#050507"
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>

      {/* 3. OLED Screen with Valuation Texture — normalized UVs & hardware polygonOffset */}
      <mesh geometry={screenGeometry} position={[0, 0, halfDepth + 0.003]}>
        <meshBasicMaterial
          map={screenTexture}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* 4. Subtle Glass Reflection Layer — protective cover over full front glass */}
      <mesh geometry={bezelGeometry} position={[0, 0, halfDepth + 0.005]}>
        <meshPhysicalMaterial
          transparent
          opacity={0.06}
          roughness={0.06}
          metalness={0.06}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          color="#FFFFFF"
          envMapIntensity={1.0}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Rear Frosted Glass */}
      <mesh geometry={bezelGeometry} position={[0, 0, -halfDepth - 0.001]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial
          color="#1C1C20"
          roughness={0.42}
          metalness={0.25}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* 6. Rear Camera Module */}
      <group position={[-0.32, 1.0, -halfDepth - 0.016]} rotation={[0, Math.PI, 0]}>
        {/* Plateau */}
        <mesh geometry={plateauGeometry}>
          <meshStandardMaterial
            color="#252528"
            metalness={0.9}
            roughness={0.22}
            envMapIntensity={1.6}
          />
        </mesh>

        {/* Three camera lenses */}
        {[
          [-0.17, 0.18],
          [-0.17, -0.18],
          [0.17, 0.0],
        ].map(([lx, ly], i) => (
          <group key={i} position={[lx, ly, 0.03]}>
            {/* Outer ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.03, 24]} />
              <meshStandardMaterial color="#3A3A42" metalness={0.97} roughness={0.12} />
            </mesh>
            {/* Dark glass */}
            <mesh position={[0, 0, 0.017]}>
              <circleGeometry args={[0.095, 24]} />
              <meshBasicMaterial color="#070A10" />
            </mesh>
            {/* Orange coating glint */}
            <mesh position={[0.025, 0.025, 0.018]}>
              <circleGeometry args={[0.028, 12]} />
              <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
            </mesh>
          </group>
        ))}

        {/* Flash */}
        <mesh position={[0.17, 0.26, 0.025]}>
          <circleGeometry args={[0.045, 18]} />
          <meshBasicMaterial color="#FAF7F2" />
        </mesh>

        {/* LiDAR */}
        <mesh position={[0.17, -0.26, 0.025]}>
          <circleGeometry args={[0.035, 18]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
      </group>

      {/* 7. Rear Phonelytics emblem */}
      <mesh position={[0, -0.3, -halfDepth - 0.002]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[0.14, 0.17, 24]} />
        <meshStandardMaterial color="#2E2E34" metalness={0.88} roughness={0.2} />
      </mesh>

      {/* 8. Side Buttons */}
      {/* Power (right) */}
      <mesh position={[PHONE_W / 2 + 0.012, 0.5, 0]}>
        <boxGeometry args={[0.018, 0.38, 0.045]} />
        <meshStandardMaterial color="#3A3A40" metalness={0.94} roughness={0.15} />
      </mesh>

      {/* Action Button (left, orange) */}
      <mesh position={[-PHONE_W / 2 - 0.012, 1.0, 0]}>
        <boxGeometry args={[0.018, 0.18, 0.045]} />
        <meshStandardMaterial color={accentColor} metalness={0.86} roughness={0.22} />
      </mesh>

      {/* Volume Up */}
      <mesh position={[-PHONE_W / 2 - 0.012, 0.65, 0]}>
        <boxGeometry args={[0.018, 0.28, 0.045]} />
        <meshStandardMaterial color="#3A3A40" metalness={0.94} roughness={0.15} />
      </mesh>

      {/* Volume Down */}
      <mesh position={[-PHONE_W / 2 - 0.012, 0.28, 0]}>
        <boxGeometry args={[0.018, 0.28, 0.045]} />
        <meshStandardMaterial color="#3A3A40" metalness={0.94} roughness={0.15} />
      </mesh>

      {/* Speaker slit */}
      <mesh position={[0, PHONE_H / 2 - 0.045, halfDepth + 0.007]}>
        <boxGeometry args={[0.28, 0.015, 0.008]} />
        <meshBasicMaterial color="#0A0A0C" />
      </mesh>

      {/* USB-C */}
      <mesh position={[0, -PHONE_H / 2 - 0.005, 0]}>
        <boxGeometry args={[0.22, 0.012, 0.035]} />
        <meshBasicMaterial color="#08080A" />
      </mesh>

      {/* Speaker grilles */}
      {[-0.4, -0.28, -0.16, 0.16, 0.28, 0.4].map((px, i) => (
        <mesh key={i} position={[px, -PHONE_H / 2 - 0.005, 0]}>
          <sphereGeometry args={[0.013, 6, 6]} />
          <meshBasicMaterial color="#050508" />
        </mesh>
      ))}
    </group>
  );
}
