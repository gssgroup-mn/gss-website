"use client";

import { useMemo, useRef, useState } from "react";
import { CABLE_COLORS, cables, seats, type Item, type Kind, type State } from "@/components/studio/model";

/* Top-down plan in metres (the SVG viewBox is in metres). Devices can be dragged; cables are drawn as floor routes. */

export const KIND_STYLE: Record<Kind, { fill: string; label: string }> = {
  main: { fill: "#17212c", label: "" },
  sub: { fill: "#3f4c5a", label: "S" },
  monitor: { fill: "#5a6776", label: "M" },
  delay: { fill: "#17212c", label: "D" },
  foh: { fill: "#0077b6", label: "FOH" },
  stagebox: { fill: "#059669", label: "SB" },
  outlet: { fill: "#ea580c", label: "" },
  generator: { fill: "#ea580c", label: "G" },
};

export default function StagePlan({
  state,
  showCables,
  selected,
  onSelect,
  onMove,
  stageLabel,
  screenLabel,
}: {
  state: State;
  showCables: boolean;
  selected: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, z: number) => void;
  stageLabel: string;
  screenLabel: string;
}) {
  const d = state.dims;
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const foh = state.items.find((i) => i.kind === "foh");
  const seatList = useMemo(() => seats(d, foh), [d, foh]);
  const seatPath = useMemo(() => seatList.map((p) => `M${(p.x - 0.22).toFixed(2)} ${(p.z - 0.3).toFixed(2)}h0.44v0.5h-0.44z`).join(""), [seatList]);
  const cableList = useMemo(() => (showCables ? cables(state) : []), [state, showCables]);
  const u = Math.max(0.9, d.hallW / 55); // device size, grows a little in very large halls

  const toWorld = (e: React.PointerEvent) => {
    const el = svg.current!;
    const pt = el.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(el.getScreenCTM()!.inverse());
    return { x: p.x, z: p.y };
  };

  const offset: Record<string, number> = { speaker: -0.12, network: 0, video: 0.12, power: 0.24 };

  return (
    <svg
      ref={svg}
      viewBox={`${-d.hallW / 2 - 1.5} -1.5 ${d.hallW + 3} ${d.hallD + 3}`}
      className="block h-full w-full touch-none select-none"
      onPointerMove={(e) => {
        if (!drag) return;
        const p = toWorld(e);
        onMove(drag, p.x, p.z);
      }}
      onPointerUp={() => setDrag(null)}
      onPointerLeave={() => setDrag(null)}
      onPointerDown={(e) => {
        if (e.target === svg.current) onSelect(null);
      }}
    >
      {/* hall */}
      <rect x={-d.hallW / 2} y={0} width={d.hallW} height={d.hallD} fill="#f4f6f8" stroke="#9aa5b1" strokeWidth="0.12" />
      {/* metre ticks along the side, every 5 m */}
      {Array.from({ length: Math.floor(d.hallD / 5) + 1 }, (_, i) => i * 5).map((z) => (
        <g key={z}>
          <line x1={-d.hallW / 2 - 0.5} x2={-d.hallW / 2} y1={z} y2={z} stroke="#9aa5b1" strokeWidth="0.08" />
          <text x={-d.hallW / 2 - 0.7} y={z + 0.25} fontSize="0.7" textAnchor="end" fill="#5a6776">
            {z}
          </text>
        </g>
      ))}
      {/* stage and screen */}
      <rect x={-d.stageW / 2} y={0} width={d.stageW} height={d.stageD} fill="#d8dee5" stroke="#5a6776" strokeWidth="0.1" />
      <text x={0} y={d.stageD / 2 + 0.3} fontSize={Math.min(1.2, d.stageD / 4)} textAnchor="middle" fill="#5a6776">
        {stageLabel} {d.stageW} × {d.stageD}
      </text>
      {d.led && (
        <g>
          <rect x={-d.ledW / 2} y={0.15} width={d.ledW} height={0.3} fill="#0077b6" />
          <text x={0} y={1.25} fontSize="0.6" textAnchor="middle" fill="#0077b6">
            {screenLabel} {d.ledW} × {d.ledH}
          </text>
        </g>
      )}
      {/* audience */}
      <path d={seatPath} fill="#c3cbd4" />

      {/* cables under the devices */}
      {cableList.map((c, i) => {
        const o = offset[c.type];
        const a = { x: c.from.x + o, z: c.from.z + o };
        const b = { x: c.to.x + o, z: c.to.z + o };
        return (
          <path
            key={i}
            d={`M${a.x} ${a.z}L${b.x} ${a.z}L${b.x} ${b.z}`}
            fill="none"
            stroke={CABLE_COLORS[c.type]}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeDasharray={c.type === "power" ? "5 4" : undefined}
            opacity="0.85"
          />
        );
      })}

      {/* devices */}
      {state.items.map((it) => (
        <Device key={it.id} it={it} u={u} selected={selected === it.id} onDown={(e) => {
          e.stopPropagation();
          (e.target as Element).setPointerCapture?.(e.pointerId);
          onSelect(it.id);
          setDrag(it.id);
        }} />
      ))}
    </svg>
  );
}

function Device({ it, u, selected, onDown }: { it: Item; u: number; selected: boolean; onDown: (e: React.PointerEvent) => void }) {
  const st = KIND_STYLE[it.kind];
  const ring = selected ? <circle cx={it.x} cy={it.z} r={u * 1.05} fill="none" stroke="#0077b6" strokeWidth="2" vectorEffect="non-scaling-stroke" /> : null;
  const common = { onPointerDown: onDown, style: { cursor: "grab" } as const };
  let shape: React.ReactNode;
  if (it.kind === "outlet") {
    shape = <circle cx={it.x} cy={it.z} r={u * 0.45} fill={st.fill} stroke="#fff" strokeWidth="0.08" />;
  } else if (it.kind === "monitor") {
    shape = <path d={`M${it.x - u * 0.5} ${it.z + u * 0.35}L${it.x + u * 0.5} ${it.z + u * 0.35}L${it.x + u * 0.35} ${it.z - u * 0.35}L${it.x - u * 0.35} ${it.z - u * 0.35}Z`} fill={st.fill} />;
  } else if (it.kind === "main") {
    shape = <rect x={it.x - u * 0.6} y={it.z - u * 0.35} width={u * 1.2} height={u * 0.7} rx="0.08" fill={st.fill} />;
  } else {
    const w = it.kind === "foh" ? u * 1.8 : u * 0.8;
    shape = <rect x={it.x - w / 2} y={it.z - u * 0.4} width={w} height={u * 0.8} rx="0.08" fill={st.fill} />;
  }
  return (
    <g {...common} role="button" aria-label={it.kind}>
      {/* larger invisible hit area for fingers */}
      <circle cx={it.x} cy={it.z} r={u * 0.9} fill="transparent" />
      {shape}
      {st.label && (
        <text x={it.x} y={it.z + u * 0.2} fontSize={u * 0.5} textAnchor="middle" fill="#fff" pointerEvents="none" fontWeight="600">
          {st.label}
        </text>
      )}
      {ring}
    </g>
  );
}
