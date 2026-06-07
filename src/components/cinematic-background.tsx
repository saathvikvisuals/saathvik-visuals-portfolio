"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";
import { modes } from "@/data/portfolio";
import { useExperienceStore } from "@/store/experience-store";

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.THREE.Clock")) return;
    originalWarn(...args);
  };
}

export function CinematicBackground() {
  const mode = useExperienceStore((state) => state.mode);
  const accent = modes[mode].accent;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-35">
      <Canvas camera={{ position: [0, 0, 7], fov: 48 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <ParticleField color={accent} />
      </Canvas>
    </div>
  );
}

function ParticleField({ color }: { color: string }) {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 12;
      values[i * 3 + 1] = (Math.random() - 0.5) * 7;
      values[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return values;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.025;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={0.022} sizeAttenuation depthWrite={false} opacity={0.24} />
    </Points>
  );
}
