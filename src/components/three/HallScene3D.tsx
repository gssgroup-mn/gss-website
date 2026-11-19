"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { HALL, audienceCells, floorAt, levelColor } from "@/components/hallLayout";

/* Example hall: stage, two hung line arrays, raked seating coloured by the illustrative level. */

function Rig() {
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null };
  useEffect(() => {
    camera.position.set(HALL.width * 0.75, 17, HALL.depth + 6);
    if (controls) {
      controls.target.set(0, 3, HALL.depth * 0.45);
      controls.update();
    }
  }, [camera, controls]);
  return null;
}

function Audience() {
  // One instanced mesh for all seat cells keeps this light on phones.
  const cells = useMemo(() => audienceCells(1), []);
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.92, 0.12, 0.92);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
    const m = new THREE.InstancedMesh(geo, mat, cells.length);
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    cells.forEach((c, i) => {
      o.position.set(c.x, floorAt(c.z) + 0.06, c.z);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      col.setStyle(levelColor(c.db));
      col.convertSRGBToLinear();
      m.setColorAt(i, col);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    return m;
  }, [cells]);
  return <primitive object={mesh} />;
}

function Rake() {
  // Seating floor: flat section then the rise, as one extruded side profile.
  const geo = useMemo(() => {
    const { z0, z1, x0, x1 } = HALL.audience;
    const shape = new THREE.Shape();
    shape.moveTo(z0 - 1, 0);
    shape.lineTo(HALL.rakeStart, 0);
    shape.lineTo(z1, floorAt(z1));
    shape.lineTo(z1, 0);
    shape.lineTo(z0 - 1, 0);
    const g = new THREE.ExtrudeGeometry(shape, { depth: x1 - x0 + 2, bevelEnabled: false });
    g.rotateY(-Math.PI / 2);
    g.translate(x1 + 1, 0, 0);
    return g;
  }, []);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#c3cbd4" roughness={1} />
    </mesh>
  );
}

function LineArray({ x, z, top, boxes }: (typeof HALL.arrays)[number]) {
  // Boxes curve progressively downward, as a real hang is splayed towards the rear seats then the front.
  let y = top;
  let angle = 0;
  const parts: React.ReactNode[] = [];
  for (let i = 0; i < boxes; i++) {
    angle += i < 3 ? 2 : 5;
    parts.push(
      <mesh key={i} position={[x, y - 0.18, z]} rotation={[(-angle * Math.PI) / 180, 0, 0]}>
        <boxGeometry args={[1.1, 0.34, 0.55]} />
        <meshStandardMaterial color="#17212c" roughness={0.5} />
      </mesh>,
    );
    y -= 0.36;
  }
  return (
    <group>
      <mesh position={[x, top + 1.5, z]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 6]} />
        <meshStandardMaterial color="#5a6776" />
      </mesh>
      {parts}
    </group>
  );
}

export default function HallScene3D() {
  const { width, depth, height, stage } = HALL;
  return (
    <Canvas camera={{ fov: 45, near: 0.1, far: 400 }} dpr={[1, 2]} style={{ background: "linear-gradient(#f9fafb,#e9edf1)" }}>
      <hemisphereLight args={["#ffffff", "#dfe5ea", 1.5]} />
      <directionalLight position={[10, 25, 30]} intensity={1.2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, depth / 2]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#e3e8ed" roughness={1} />
      </mesh>
      {/* stage back wall and one side wall; the rest is left open to look in */}
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[-width / 2, height / 2, depth / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#eef1f4" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, stage.height / 2, stage.depth / 2]}>
        <boxGeometry args={[stage.width, stage.height, stage.depth]} />
        <meshStandardMaterial color="#5a6776" roughness={0.8} />
      </mesh>

      <Rake />
      <Audience />
      {HALL.arrays.map((a) => (
        <LineArray key={a.x} {...a} />
      ))}

      <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2 - 0.05} minDistance={4} maxDistance={110} />
      <Rig />
    </Canvas>
  );
}
