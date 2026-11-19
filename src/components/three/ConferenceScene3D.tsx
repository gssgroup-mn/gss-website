"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Layout } from "@/components/conferenceLayout";

/* 3D meeting room built from the shared layout. The display wall is at z = 0; the room extends towards +z. */

const WALL_H = 3;

function useCallTexture() {
  // A video call on screen: four participant tiles, so the display reads as "in use".
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 288;
    const g = c.getContext("2d")!;
    g.fillStyle = "#1b2633";
    g.fillRect(0, 0, 512, 288);
    const tiles = ["#3b5068", "#4a6078", "#435a72", "#506a84"];
    tiles.forEach((col, i) => {
      const x = 8 + (i % 2) * 252;
      const y = 8 + Math.floor(i / 2) * 140;
      g.fillStyle = col;
      g.fillRect(x, y, 244, 132);
      g.fillStyle = "#8fa3b8";
      g.beginPath();
      g.arc(x + 122, y + 56, 22, 0, Math.PI * 2);
      g.fill();
      g.fillRect(x + 92, y + 84, 60, 40);
    });
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Rig({ L }: { L: Layout }) {
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null };
  useEffect(() => {
    // From the back corner, slightly raised, looking at the display wall.
    camera.position.set(L.roomW * 0.42, Math.max(2.4, L.roomD * 0.38), L.roomD + Math.max(1.5, L.roomD * 0.35));
    if (controls) {
      controls.target.set(0, 1, L.roomD * 0.4);
      controls.update();
    }
  }, [L, camera, controls]);
  return null;
}

function Chair({ x, z, rot }: { x: number; z: number; rot: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.46, 0.06, 0.46]} />
        <meshStandardMaterial color="#5a6776" />
      </mesh>
      {/* backrest on the side away from what the chair faces */}
      <mesh position={[0, 0.75, 0.22]}>
        <boxGeometry args={[0.46, 0.55, 0.05]} />
        <meshStandardMaterial color="#5a6776" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
        <meshStandardMaterial color="#17212c" />
      </mesh>
    </group>
  );
}

export default function ConferenceScene3D({ layout: L }: { layout: Layout }) {
  const call = useCallTexture();
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1 }), []);
  const sideMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#eef1f4", roughness: 1, side: THREE.DoubleSide }), []);

  return (
    <Canvas camera={{ fov: 45, near: 0.05, far: 200 }} dpr={[1, 2]} style={{ background: "linear-gradient(#f9fafb,#e9edf1)" }}>
      <hemisphereLight args={["#ffffff", "#dfe5ea", 1.6]} />
      <directionalLight position={[3, 6, L.roomD]} intensity={1.2} />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, L.roomD / 2]}>
        <planeGeometry args={[L.roomW, L.roomD]} />
        <meshStandardMaterial color="#d9dee4" roughness={1} />
      </mesh>
      {/* display wall and one side wall; the other sides stay open so the room can be seen into */}
      <mesh position={[0, WALL_H / 2, 0]} material={wallMat}>
        <planeGeometry args={[L.roomW, WALL_H]} />
      </mesh>
      <mesh position={[-L.roomW / 2, WALL_H / 2, L.roomD / 2]} rotation={[0, Math.PI / 2, 0]} material={sideMat}>
        <planeGeometry args={[L.roomD, WALL_H]} />
      </mesh>

      {/* displays with a call on screen, and the camera under the centre */}
      {L.displays.map((d, i) => (
        <group key={i} position={[d.x, L.displayBottom + d.h / 2, 0.04]}>
          <mesh>
            <boxGeometry args={[d.w + 0.03, d.h + 0.03, 0.06]} />
            <meshStandardMaterial color="#17212c" />
          </mesh>
          <mesh position={[0, 0, 0.031]}>
            <planeGeometry args={[d.w, d.h]} />
            <meshBasicMaterial map={call} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, L.displayBottom - 0.12, 0.08]}>
        <boxGeometry args={[L.desk ? 0.3 : 0.6, 0.08, 0.1]} />
        <meshStandardMaterial color="#17212c" />
      </mesh>

      {L.table && (
        <group position={[L.table.x, 0, L.table.z]}>
          <mesh position={[0, 0.74, 0]}>
            <boxGeometry args={[L.table.w, 0.05, L.table.d]} />
            <meshStandardMaterial color="#c9b79c" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <boxGeometry args={[L.table.w * 0.5, 0.72, L.table.d * 0.85]} />
            <meshStandardMaterial color="#9aa5b1" />
          </mesh>
        </group>
      )}
      {L.desk && (
        <mesh position={[L.desk.x, 0.4, L.desk.z]}>
          <boxGeometry args={[L.desk.w, 0.8, L.desk.d]} />
          <meshStandardMaterial color="#c9b79c" roughness={0.7} />
        </mesh>
      )}
      {L.seats.map((s, i) => (
        <Chair key={i} x={s.x} z={s.z} rot={s.rot} />
      ))}

      <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2 - 0.05} minDistance={1} maxDistance={L.roomD * 3} />
      <Rig L={L} />
    </Canvas>
  );
}
