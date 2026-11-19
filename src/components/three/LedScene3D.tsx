"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Grid, Html, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

/*
  3D view of the LED wall in metres. Origin: floor, centre of the screen's front face.
  The screen texture is drawn on a canvas so seams line up exactly with the cabinet grid.
*/

export type LedSceneProps = {
  realW: number;
  realH: number;
  cols: number;
  rows: number;
  bottom: number; // screen bottom edge above the floor
  image: string | null;
  eyeDistance: number; // metres, used by "view from the audience"
  eyeMode: number; // increments each time the viewer asks for the audience view
  zoneMin: number;
  zoneBest: [number, number];
  labels: { tooClose: string; best: string; person: string };
};

const BARS = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];

function useScreenTexture(realW: number, realH: number, cols: number, rows: number, image: string | null) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!image) return setImg(null);
    const el = new Image();
    el.onload = () => setImg(el);
    el.src = image;
  }, [image]);

  return useMemo(() => {
    const W = 1024;
    const H = Math.max(64, Math.round((W * realH) / realW));
    const c = document.createElement("canvas");
    c.width = W;
    c.height = Math.min(H, 2048);
    const g = c.getContext("2d")!;
    if (img) {
      const s = Math.max(c.width / img.width, c.height / img.height);
      g.drawImage(img, (c.width - img.width * s) / 2, (c.height - img.height * s) / 2, img.width * s, img.height * s);
    } else {
      BARS.forEach((col, i) => {
        g.fillStyle = col;
        g.fillRect(Math.floor((i * c.width) / 7), 0, Math.ceil(c.width / 7) + 1, c.height);
      });
    }
    g.strokeStyle = "rgba(23,33,44,0.55)";
    g.lineWidth = Math.max(1, c.width / 700);
    for (let i = 1; i < cols; i++) {
      const x = (i * c.width) / cols;
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, c.height);
      g.stroke();
    }
    for (let i = 1; i < rows; i++) {
      const y = (i * c.height) / rows;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(c.width, y);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [realW, realH, cols, rows, img]);
}

function CameraRig({ realW, realH, bottom, eyeDistance, eyeMode, far }: Pick<LedSceneProps, "realW" | "realH" | "bottom" | "eyeDistance" | "eyeMode"> & { far: number }) {
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null };
  const cy = bottom + realH / 2;

  // Overview whenever the screen size changes.
  useEffect(() => {
    // Far enough back and high enough to see the screen and the viewing zones on the floor.
    const d = Math.max(Math.max(realW, realH * 1.6) * 1.15 + 2, far + 1.5);
    camera.position.set(realW * 0.5 + 1.5, Math.max(2.4, cy + d * 0.35), d);
    if (controls) {
      controls.target.set(0, cy * 0.6, far * 0.35);
      controls.update();
    }
  }, [realW, realH, cy, far, camera, controls]);

  // Audience view: eye height 1.2 m (seated), straight on, at the chosen distance.
  useEffect(() => {
    if (!eyeMode) return;
    camera.position.set(0, 1.2, Math.max(0.5, eyeDistance));
    if (controls) {
      controls.target.set(0, cy, 0);
      controls.update();
    }
  }, [eyeMode, eyeDistance, cy, camera, controls]);
  return null;
}

function Person({ x }: { x: number }) {
  const m = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7b8794", roughness: 0.8 }), []);
  return (
    <group position={[x, 0, 0.6]}>
      <mesh position={[0, 0.45, 0]} material={m}>
        <cylinderGeometry args={[0.11, 0.09, 0.9, 16]} />
      </mesh>
      <mesh position={[0, 1.18, 0]} material={m}>
        <cylinderGeometry args={[0.2, 0.15, 0.62, 16]} />
      </mesh>
      <mesh position={[0, 1.62, 0]} material={m}>
        <sphereGeometry args={[0.12, 20, 20]} />
      </mesh>
    </group>
  );
}

function Zone({ from, to, width, color, label }: { from: number; to: number; width: number; color: string; label: string }) {
  if (to <= from) return null;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, (from + to) / 2]}>
        <planeGeometry args={[width, to - from]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <Html position={[width / 2 + 0.2, 0.01, (from + to) / 2]} center={false} style={{ pointerEvents: "none" }}>
        <span style={{ whiteSpace: "nowrap", font: "500 12px Arimo, sans-serif", color: "#17212c", background: "rgba(255,255,255,0.85)", padding: "2px 6px", borderRadius: 3 }}>
          {label}
        </span>
      </Html>
    </group>
  );
}

export default function LedScene3D(p: LedSceneProps) {
  const tex = useScreenTexture(p.realW, p.realH, p.cols, p.rows, p.image);
  const cy = p.bottom + p.realH / 2;
  const floorSize = Math.max(20, p.realW * 2.5, p.zoneBest[1] * 2.5);
  const zoneW = Math.max(p.realW, 2);

  return (
    <Canvas
      camera={{ fov: 45, near: 0.05, far: 400 }}
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: false }}
      style={{ background: "linear-gradient(#f9fafb,#e9edf1)" }}
    >
      <hemisphereLight args={["#ffffff", "#dfe5ea", 1.6]} />
      <directionalLight position={[4, 8, 6]} intensity={1.4} />

      {/* floor and a 1 m grid for scale */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, floorSize / 2 - 3]}>
        <planeGeometry args={[floorSize, floorSize]} />
        <meshStandardMaterial color="#f7f9fb" roughness={1} />
      </mesh>
      <Grid
        position={[0, 0.002, floorSize / 2 - 3]}
        args={[floorSize, floorSize]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#c3cbd4"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9aa5b1"
        fadeDistance={floorSize}
        infiniteGrid={false}
      />
      {/* back wall */}
      <mesh position={[0, 8, -1.2]}>
        <planeGeometry args={[floorSize * 3, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>

      {/* cabinet body, screen face and stand */}
      <mesh position={[0, cy, -0.06]}>
        <boxGeometry args={[p.realW + 0.04, p.realH + 0.04, 0.12]} />
        <meshStandardMaterial color="#17212c" roughness={0.6} />
      </mesh>
      <mesh position={[0, cy, 0.001]}>
        <planeGeometry args={[p.realW, p.realH]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {p.bottom > 0.01 &&
        [-0.3, 0.3].map((f) => (
          <mesh key={f} position={[p.realW * f, p.bottom / 2, -0.1]}>
            <boxGeometry args={[0.08, p.bottom, 0.4]} />
            <meshStandardMaterial color="#17212c" />
          </mesh>
        ))}

      <Person x={-(p.realW / 2 + 0.7)} />

      {/* viewing zones in front of the screen */}
      <Zone from={0.05} to={p.zoneMin} width={zoneW} color="#e11d48" label={p.labels.tooClose} />
      <Zone from={p.zoneBest[0]} to={p.zoneBest[1]} width={zoneW} color="#059669" label={p.labels.best} />

      <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2 - 0.03} minDistance={0.6} maxDistance={floorSize} />
      <CameraRig realW={p.realW} realH={p.realH} bottom={p.bottom} eyeDistance={p.eyeDistance} eyeMode={p.eyeMode} far={p.zoneBest[1]} />
    </Canvas>
  );
}
