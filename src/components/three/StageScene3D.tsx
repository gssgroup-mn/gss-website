"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CABLE_COLORS, cables, isLineArray, resolved, seats, type Item, type State } from "@/components/studio/model";

/* 3D stage planner. Devices are dragged across the floor; the camera orbits otherwise. */

type Props = {
  state: State;
  showCables: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, z: number) => void;
};

type Controls = { enabled: boolean; target: THREE.Vector3; update: () => void };

function onStage(it: { x: number; z: number }, s: State) {
  return Math.abs(it.x) <= s.dims.stageW / 2 && it.z <= s.dims.stageD;
}

/** Window-level drag: ray from the pointer onto the floor plane. Works even when the pointer passes over other objects. */
function DragPlane({ dragId, onMove, onEnd }: { dragId: React.MutableRefObject<string | null>; onMove: Props["onMove"]; onEnd: () => void }) {
  const { camera, gl, controls } = useThree() as unknown as { camera: THREE.Camera; gl: THREE.WebGLRenderer; controls: Controls | null };
  useEffect(() => {
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const move = (e: PointerEvent) => {
      if (!dragId.current) return;
      const r = gl.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      if (ray.ray.intersectPlane(plane, hit)) onMove(dragId.current, hit.x, hit.z);
    };
    const up = () => {
      if (!dragId.current) return;
      dragId.current = null;
      if (controls) controls.enabled = true;
      onEnd();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [camera, gl, controls, dragId, onMove, onEnd]);
  return null;
}

function Rig({ s }: { s: State }) {
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: Controls | null };
  const { hallW, hallD, stageD } = s.dims;
  useEffect(() => {
    camera.position.set(hallW * 0.6, Math.max(8, hallD * 0.45), hallD + Math.max(4, hallD * 0.25));
    if (controls) {
      controls.target.set(0, 2, stageD + (hallD - stageD) * 0.3);
      controls.update();
    }
    // Re-frame only when the hall itself changes size.
  }, [hallW, hallD, stageD, camera, controls]);
  return null;
}

function useBars() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 448;
    c.height = 252;
    const g = c.getContext("2d")!;
    ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"].forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(i * 64, 0, 64, 252);
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

function Seats({ s }: { s: State }) {
  const foh = s.items.find((i) => i.kind === "foh");
  const list = useMemo(() => seats(s.dims, foh), [s.dims, foh]);
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.46, 0.45, 0.46), new THREE.MeshStandardMaterial({ color: "#aab4bf", roughness: 0.9 }), Math.max(1, list.length));
    const o = new THREE.Object3D();
    list.forEach((p, i) => {
      o.position.set(p.x, 0.225, p.z);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.count = list.length;
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [list]);
  return <primitive object={mesh} />;
}

const dark = "#17212c";

function Device({ it, s, la, boxes, selected, onDown }: { it: Item; s: State; la: boolean; boxes: number; selected: boolean; onDown: (e: { stopPropagation: () => void }) => void }) {
  const y0 = onStage(it, s) ? s.dims.stageH : 0;
  const H = s.dims.hallH;
  let body: React.ReactNode = null;
  switch (it.kind) {
    case "main":
      body = la ? (
        <group>
          <mesh position={[0, (H * 0.8 + H) / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, H * 0.2, 6]} />
            <meshStandardMaterial color="#5a6776" />
          </mesh>
          {Array.from({ length: boxes }, (_, i) => (
            <mesh key={i} position={[0, H * 0.8 - 0.2 - i * 0.37, 0.02 * i]} rotation={[-((i < 3 ? 1.5 : 4) * (i + 1) * Math.PI) / 180, 0, 0]}>
              <boxGeometry args={[1.1, 0.34, 0.55]} />
              <meshStandardMaterial color={dark} />
            </mesh>
          ))}
        </group>
      ) : (
        <group position={[0, y0, 0]}>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.7, 8]} />
            <meshStandardMaterial color="#5a6776" />
          </mesh>
          <mesh position={[0, 2.05, 0]}>
            <boxGeometry args={[0.42, 0.7, 0.4]} />
            <meshStandardMaterial color={dark} />
          </mesh>
        </group>
      );
      break;
    case "sub":
      body = (
        <mesh position={[0, y0 + 0.3, 0]}>
          <boxGeometry args={[0.65, 0.6, 0.75]} />
          <meshStandardMaterial color="#3f4c5a" />
        </mesh>
      );
      break;
    case "monitor":
      body = (
        <mesh position={[0, y0 + 0.2, 0]} rotation={[0.45, 0, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.45]} />
          <meshStandardMaterial color="#5a6776" />
        </mesh>
      );
      break;
    case "delay":
      body = (
        <group position={[0, y0, 0]}>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 2.8, 8]} />
            <meshStandardMaterial color="#5a6776" />
          </mesh>
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.35, 0.55, 0.35]} />
            <meshStandardMaterial color={dark} />
          </mesh>
        </group>
      );
      break;
    case "foh":
      body = (
        <group position={[0, y0, 0]}>
          <mesh position={[0, 0.37, 0]}>
            <boxGeometry args={[2, 0.74, 0.9]} />
            <meshStandardMaterial color="#c9b79c" />
          </mesh>
          <mesh position={[0, 0.8, 0]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[1.1, 0.1, 0.6]} />
            <meshStandardMaterial color="#0077b6" />
          </mesh>
        </group>
      );
      break;
    case "stagebox":
      body = (
        <mesh position={[0, y0 + 0.2, 0]}>
          <boxGeometry args={[0.5, 0.4, 0.4]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
      );
      break;
    case "outlet":
      body = (
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.18, 0.25, 0.18]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
      );
      break;
    case "generator":
      body = (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.4, 1, 0.9]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
      );
      break;
  }
  return (
    <group position={[it.x, 0, it.z]} onPointerDown={onDown}>
      {body}
      {/* generous invisible grab handle on the floor */}
      <mesh position={[0, y0 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 24]} />
        <meshBasicMaterial color="#0077b6" transparent opacity={selected ? 0.35 : 0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function deviceHeight(it: { kind: string; x: number; z: number }, s: State, la: boolean) {
  const y0 = onStage(it, s) ? s.dims.stageH : 0;
  if (it.kind === "main") return la ? s.dims.hallH * 0.8 - 0.2 : y0 + 2;
  if (it.kind === "delay") return y0 + 3;
  if (it.kind === "led") return s.dims.stageH + 0.6;
  if (it.kind === "outlet") return 0.4;
  return y0 + 0.1;
}

function Cables({ s, la }: { s: State; la: boolean }) {
  const list = useMemo(() => cables(s), [s]);
  const off: Record<string, number> = { speaker: -0.12, network: 0, video: 0.12, power: 0.24 };
  return (
    <group>
      {list.map((c, i) => {
        const o = off[c.type];
        const a = { x: c.from.x + o, z: c.from.z + o };
        const b = { x: c.to.x + o, z: c.to.z + o };
        const ha = deviceHeight({ kind: (c.from as Item).kind ?? "led", ...c.from }, s, la);
        const hb = deviceHeight({ kind: (c.to as Item).kind ?? "led", ...c.to }, s, la);
        const fy = (p: { x: number; z: number }) => (onStage(p, s) ? s.dims.stageH : 0) + 0.04;
        const pts: [number, number, number][] = [
          [a.x, ha, a.z],
          [a.x, fy(a), a.z],
          [b.x, fy({ x: b.x, z: a.z }), a.z],
          [b.x, fy(b), b.z],
          [b.x, hb, b.z],
        ];
        return <Line key={i} points={pts} color={CABLE_COLORS[c.type]} lineWidth={2} dashed={c.type === "power"} dashSize={0.4} gapSize={0.25} />;
      })}
    </group>
  );
}

export default function StageScene3D({ state: s, showCables, selected, onSelect, onMove }: Props) {
  const d = s.dims;
  const bars = useBars();
  const r = resolved(s);
  const la = isLineArray(r.main.product);
  const boxes = r.main.product === "la10" ? 10 : 6;
  const dragId = useRef<string | null>(null);
  const orbit = useRef<{ enabled: boolean } | null>(null);

  return (
    <Canvas camera={{ fov: 45, near: 0.1, far: 600 }} dpr={[1, 2]} style={{ background: "linear-gradient(#f9fafb,#e9edf1)", touchAction: "none" }} onPointerMissed={() => onSelect(null)}>
      <hemisphereLight args={["#ffffff", "#dfe5ea", 1.6]} />
      <directionalLight position={[10, 25, d.hallD]} intensity={1.1} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, d.hallD / 2]}>
        <planeGeometry args={[d.hallW, d.hallD]} />
        <meshStandardMaterial color="#e3e8ed" roughness={1} />
      </mesh>
      <mesh position={[0, d.hallH / 2, 0]}>
        <planeGeometry args={[d.hallW, d.hallH]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[-d.hallW / 2, d.hallH / 2, d.hallD / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d.hallD, d.hallH]} />
        <meshStandardMaterial color="#eef1f4" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {d.stageH > 0 ? (
        <mesh position={[0, d.stageH / 2, d.stageD / 2]}>
          <boxGeometry args={[d.stageW, d.stageH, d.stageD]} />
          <meshStandardMaterial color="#5a6776" roughness={0.8} />
        </mesh>
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, d.stageD / 2]}>
          <planeGeometry args={[d.stageW, d.stageD]} />
          <meshStandardMaterial color="#5a6776" />
        </mesh>
      )}

      {d.led && (
        <group position={[0, d.stageH + 0.6 + d.ledH / 2, 0.3]}>
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[d.ledW + 0.06, d.ledH + 0.06, 0.1]} />
            <meshStandardMaterial color={dark} />
          </mesh>
          <mesh>
            <planeGeometry args={[d.ledW, d.ledH]} />
            <meshBasicMaterial map={bars} toneMapped={false} />
          </mesh>
        </group>
      )}

      <Seats s={s} />
      {showCables && <Cables s={s} la={la} />}

      {s.items.map((it) => (
        <Device
          key={it.id}
          it={it}
          s={s}
          la={la}
          boxes={boxes}
          selected={selected === it.id}
          onDown={(e) => {
            e.stopPropagation();
            dragId.current = it.id;
            if (orbit.current) orbit.current.enabled = false; // OrbitControls ignores moves while disabled
            onSelect(it.id);
          }}
        />
      ))}

      <OrbitControls ref={orbit as never} makeDefault enableDamping maxPolarAngle={Math.PI / 2 - 0.05} minDistance={3} maxDistance={Math.max(60, d.hallD * 3)} />
      <DragPlane dragId={dragId} onMove={onMove} onEnd={() => undefined} />
      <Rig s={s} />
    </Canvas>
  );
}
