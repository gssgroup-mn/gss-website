"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Locale, Text } from "@/content/site";
import { t } from "@/lib/i18n";
import { HALL, audienceCells, floorAt, levelAt, levelColor } from "@/components/hallLayout";

const HallScene3D = dynamic(() => import("@/components/three/HallScene3D"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-steel">…</div>,
});

type View = "2d" | "3d" | "plan";

const c = {
  views: { mn: "Харагдац", en: "View" },
  v2d: { mn: "2D", en: "2D" },
  v3d: { mn: "3D", en: "3D" },
  vPlan: { mn: "План", en: "Plan" },
  section: { mn: "Хажуугийн огтлол", en: "Side section" },
  above: { mn: "Дээрээс", en: "From above" },
  hall3d: { mn: "Заал, 3D", en: "Hall in 3D" },
  hall: { mn: "Жишээ заал {w} × {d} м, line array 2", en: "Example hall {w} × {d} m, two line arrays" },
  drag: { mn: "Чирж эргүүлнэ, томруулна.", en: "Drag to rotate, scroll or pinch to zoom." },
  loud: { mn: "Чанга", en: "Louder" },
  quiet: { mn: "Сул", en: "Quieter" },
  stage: { mn: "Тайз", en: "Stage" },
  disclaimer: {
    mn: "Өнгө нь чанга яригчаас холдох тусам дуу хэрхэн суларч байгааг харуулсан жишээ. Бодит тооцоог танай заалны хэмжээ, материалаар EASE Focus-оор хийнэ.",
    en: "Colours illustrate how sound weakens with distance from the speakers. A real study uses your hall's dimensions and materials in EASE Focus.",
  },
} satisfies Record<string, Text>;

export default function HallViews({ lang }: { lang: Locale }) {
  const [view, setView] = useState<View>("3d");
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    try {
      const cv = document.createElement("canvas");
      const ok = !!(cv.getContext("webgl2") || cv.getContext("webgl"));
      setWebgl(ok);
      if (!ok) setView("2d");
    } catch {
      setWebgl(false);
      setView("2d");
    }
  }, []);
  const seg = (active: boolean) =>
    `px-4 py-1.5 text-sm font-medium rounded-[5px] transition-colors disabled:opacity-40 ${
      active ? "bg-white text-ink shadow-[0_1px_2px_rgba(23,33,44,0.18)]" : "text-steel hover:text-ink"
    }`;

  return (
    <figure className="overflow-hidden rounded-lg border border-white/10 bg-white text-ink">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-3 py-2">
        <div className="inline-flex rounded-md bg-line/60 p-1" role="tablist" aria-label={t(c.views, lang)}>
          {([["2d", c.v2d], ["3d", c.v3d], ["plan", c.vPlan]] as [View, Text][]).map(([v, label]) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} disabled={v === "3d" && !webgl} onClick={() => setView(v)} className={seg(view === v)}>
              {t(label, lang)}
            </button>
          ))}
        </div>
        <Legend lang={lang} />
      </div>
      {view === "3d" && (
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
          <HallScene3D />
          <p className="pointer-events-none absolute bottom-2 left-3 rounded-sm bg-white/80 px-1.5 py-0.5 text-xs text-steel">{t(c.drag, lang)}</p>
        </div>
      )}
      {view === "2d" && <Section lang={lang} />}
      {view === "plan" && <Plan lang={lang} />}
      <figcaption className="border-t border-line px-4 py-3 text-sm text-steel">
        <span className="font-medium text-ink">
          {t(view === "2d" ? c.section : view === "plan" ? c.above : c.hall3d, lang)}.{" "}
        </span>
        {t(c.hall, lang).replace("{w}", String(HALL.width)).replace("{d}", String(HALL.depth))}. {t(c.disclaimer, lang)}
      </figcaption>
    </figure>
  );
}

function Legend({ lang }: { lang: Locale }) {
  const stops = [3, 0, -3, -6, -9, -12];
  return (
    <span className="flex items-center gap-2 text-xs text-steel">
      {t(c.loud, lang)}
      <span className="flex h-2.5 w-28 overflow-hidden rounded-full" aria-hidden="true">
        {stops.map((d) => (
          <span key={d} className="flex-1" style={{ background: levelColor(d) }} />
        ))}
      </span>
      {t(c.quiet, lang)}
    </span>
  );
}

/* Side section through one array: stage, the hang, rays to the seating, seat colours along the rake. */
function Section({ lang }: { lang: Locale }) {
  const W = 760;
  const s = (W - 40) / HALL.depth;
  const H = HALL.height * s + 30;
  const X = (z: number) => 20 + z * s;
  const Y = (y: number) => H - 14 - y * s;
  const a = HALL.arrays[1];
  const samples = useMemo(() => {
    const out: { z: number; db: number }[] = [];
    for (let z = HALL.audience.z0; z < HALL.audience.z1; z += 0.5) out.push({ z, db: levelAt(a.x, z) });
    return out;
  }, [a.x]);
  const boxes = Array.from({ length: a.boxes }, (_, i) => i);
  let angle = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full bg-white" role="img" aria-label={t(c.section, lang)}>
      {/* rays from the hang to the front, middle and back of the seating */}
      {[HALL.audience.z0 + 1, (HALL.audience.z0 + HALL.audience.z1) / 2, HALL.audience.z1 - 1].map((z) => (
        <line key={z} x1={X(a.z)} y1={Y(a.top - 1.4)} x2={X(z)} y2={Y(floorAt(z) + HALL.earHeight)} stroke="#0077b6" strokeOpacity="0.35" strokeDasharray="5 4" />
      ))}
      {/* floor, stage, rake */}
      <line x1={X(0)} x2={X(HALL.depth)} y1={Y(0)} y2={Y(0)} stroke="#9aa5b1" />
      <rect x={X(0)} y={Y(HALL.stage.height)} width={HALL.stage.depth * s} height={HALL.stage.height * s} fill="#5a6776" />
      <text x={X(HALL.stage.depth / 2)} y={Y(HALL.stage.height) - 6} fontSize="12" textAnchor="middle" fill="#5a6776">
        {t(c.stage, lang)}
      </text>
      <path
        d={`M ${X(HALL.audience.z0)} ${Y(0)} L ${X(HALL.rakeStart)} ${Y(0)} L ${X(HALL.audience.z1)} ${Y(floorAt(HALL.audience.z1))} L ${X(HALL.audience.z1)} ${Y(0)} Z`}
        fill="#e3e8ed"
      />
      {samples.map((p) => (
        <rect key={p.z} x={X(p.z)} y={Y(floorAt(p.z)) - 6} width={0.5 * s + 0.5} height="6" fill={levelColor(p.db)} />
      ))}
      {/* the hang */}
      <line x1={X(a.z)} x2={X(a.z)} y1={Y(HALL.height)} y2={Y(a.top)} stroke="#5a6776" />
      {boxes.map((i) => {
        angle += i < 3 ? 2 : 5;
        const y = a.top - i * 0.36 - 0.18;
        return (
          <rect key={i} x={X(a.z) - 0.28 * s} y={Y(y) - 0.17 * s} width={0.55 * s} height={0.34 * s} fill="#17212c" transform={`rotate(${angle} ${X(a.z)} ${Y(y)})`} />
        );
      })}
    </svg>
  );
}

/* Plan: stage at the top, arrays marked, seating coloured by level. */
function Plan({ lang }: { lang: Locale }) {
  const cells = useMemo(() => audienceCells(1), []);
  const W = 560;
  const s = (W - 40) / HALL.width;
  const H = HALL.depth * s + 30;
  const X = (x: number) => W / 2 + x * s;
  const Z = (z: number) => 15 + z * s;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-xl bg-white" role="img" aria-label={t(c.above, lang)}>
      <rect x={X(-HALL.width / 2)} y={Z(0)} width={HALL.width * s} height={HALL.depth * s} fill="#f4f6f8" stroke="#9aa5b1" />
      <rect x={X(-HALL.stage.width / 2)} y={Z(0)} width={HALL.stage.width * s} height={HALL.stage.depth * s} fill="#5a6776" />
      <text x={X(0)} y={Z(HALL.stage.depth / 2) + 4} fontSize="13" textAnchor="middle" fill="#ffffff">
        {t(c.stage, lang)}
      </text>
      {cells.map((p) => (
        <rect key={`${p.x}-${p.z}`} x={X(p.x - 0.46)} y={Z(p.z - 0.46)} width={0.92 * s} height={0.92 * s} rx="1.5" fill={levelColor(p.db)} />
      ))}
      {HALL.arrays.map((a) => (
        <g key={a.x}>
          <rect x={X(a.x - 0.55)} y={Z(a.z - 0.3)} width={1.1 * s} height={0.6 * s} fill="#17212c" />
          <circle cx={X(a.x)} cy={Z(a.z)} r={1.2 * s} fill="none" stroke="#17212c" strokeOpacity="0.25" />
        </g>
      ))}
    </svg>
  );
}
