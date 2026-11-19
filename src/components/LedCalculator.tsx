"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Locale, Text } from "@/content/site";
import { href, t } from "@/lib/i18n";

// three.js loads only when someone opens the 3D view.
const LedScene3D = dynamic(() => import("@/components/three/LedScene3D"), {
  ssr: false,
  loading: () => <div className="grid aspect-[16/10] place-items-center text-sm text-steel">…</div>,
});

type View = "2d" | "3d" | "plan";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/*
  LED wall calculator.
  Geometry only: cabinet count, real size, resolution, viewing distance. Weight, power and
  brightness depend on the exact product, so they are not shown until product data is added
  to CABINETS (one place to update when the datasheets arrive).
*/

type Env = "indoor" | "outdoor";
type Cabinet = { id: string; w: number; h: number; env: Env[] };

const CABINETS: Cabinet[] = [
  { id: "500x500", w: 500, h: 500, env: ["indoor", "outdoor"] },
  { id: "500x1000", w: 500, h: 1000, env: ["indoor", "outdoor"] },
  { id: "640x480", w: 640, h: 480, env: ["indoor"] },
  { id: "960x960", w: 960, h: 960, env: ["outdoor"] },
];

const PITCHES: Record<Env, number[]> = {
  indoor: [1.2, 1.5, 1.9, 2.5, 2.9, 3.9],
  outdoor: [3.9, 4.8, 6.6, 8, 10],
};

const PERSON_M = 1.75;

const L = {
  env: { mn: "Байршил", en: "Location" },
  indoor: { mn: "Дотор", en: "Indoor" },
  outdoor: { mn: "Гадна", en: "Outdoor" },
  size: { mn: "Хүссэн хэмжээ", en: "Target size" },
  width: { mn: "Өргөн, м", en: "Width, m" },
  height: { mn: "Өндөр, м", en: "Height, m" },
  cabinet: { mn: "Кабинетын хэмжээ, мм", en: "Cabinet size, mm" },
  pitch: { mn: "Пикселийн алхам (pitch), мм", en: "Pixel pitch, mm" },
  pitchHint: {
    mn: "Бага тоо = илүү нарийн дүрс, ойроос харахад тохиромжтой.",
    en: "Smaller = sharper image, suited to closer viewing.",
  },
  nearest: { mn: "Хамгийн ойрын үзэгч, м (заавал биш)", en: "Closest viewer, m (optional)" },
  nearestHint: {
    mn: "Оруулбал тохирох pitch-үүдийг тэмдэглэнэ.",
    en: "We'll mark the pitches that suit this distance.",
  },
  fits: { mn: "тохирно", en: "suits" },
  image: { mn: "Өөрийн зургаар харах", en: "Preview your own image" },
  imageReset: { mn: "Үндсэн зураг", en: "Default image" },
  result: { mn: "Таны дэлгэц", en: "Your screen" },
  cabinets: { mn: "Кабинет", en: "Cabinets" },
  realSize: { mn: "Бодит хэмжээ", en: "Actual size" },
  area: { mn: "Талбай", en: "Area" },
  resolution: { mn: "Нягтрал", en: "Resolution" },
  totalPx: { mn: "Нийт пиксел", en: "Total pixels" },
  ratio: { mn: "Харьцаа", en: "Aspect ratio" },
  viewing: { mn: "Харах зай", en: "Viewing distance" },
  viewingVal: { mn: "{a} м-ээс, хамгийн тохиромжтой {b}–{c} м", en: "from {a} m, best at {b}–{c} m" },
  hd: { mn: "Full HD (1920×1080) дүрсийг бүтэн харуулна", en: "Shows Full HD (1920×1080) at native resolution" },
  belowHd: { mn: "Full HD-ээс бага нягтралтай — дүрсийг багасгаж харуулна", en: "Below Full HD — video is scaled down to fit" },
  uhd: { mn: "4K (3840×2160) дүрсийг бүтэн харуулна", en: "Shows 4K (3840×2160) at native resolution" },
  person: { mn: "1.75 м өндөр хүн", en: "1.75 m person" },
  note: {
    mn: "Тооцоо нь ойролцоо. Жин, эрчим хүч, гэрэлтэлт сонгосон бүтээгдэхүүнээс хамаарах тул манай инженер үнийн саналд нарийвчилж тусгана.",
    en: "Estimates only. Weight, power and brightness depend on the exact product; our engineer will specify them in the quotation.",
  },
  send: { mn: "Энэ тохиргоогоор үнийн санал авах", en: "Get a quote for this setup" },
  sendHint: {
    mn: "Тохиргоо тань хүсэлтийн маягтад автоматаар бичигдэнэ.",
    en: "Your setup is copied into the request form.",
  },
  m: { mn: "м", en: "m" },
  m2: { mn: "м²", en: "m²" },
  views: { mn: "Харагдац", en: "View" },
  v2d: { mn: "2D", en: "2D" },
  v3d: { mn: "3D", en: "3D" },
  vPlan: { mn: "План", en: "Plan" },
  eye: { mn: "Үзэгчийн нүдээр харах", en: "View from the audience" },
  overview: { mn: "Ерөнхий харагдац", en: "Overview" },
  drag: { mn: "Чирж эргүүлнэ, хуруугаараа эсвэл хулганаар томруулна.", en: "Drag to rotate, pinch or scroll to zoom." },
  no3d: { mn: "Энэ төхөөрөмж 3D дэмжихгүй байна.", en: "3D isn't supported on this device." },
  tooClose: { mn: "Хэт ойр", en: "Too close" },
  okZone: { mn: "Харж болно", en: "Fine" },
  best: { mn: "Хамгийн тохиромжтой", en: "Best" },
  screen: { mn: "Дэлгэц", en: "Screen" },
  viewer: { mn: "Таны үзэгч", en: "Your viewer" },
  planNote: { mn: "Дээрээс харсан байдал. Ногоон бүс бол үзэгчдийг суулгахад хамгийн тохиромжтой зай.", en: "Seen from above. The green band is the best distance to seat the audience." },
  pcs: { mn: "ш", en: "pcs" },
} satisfies Record<string, Text>;

function fmt(n: number, d = 2) {
  return Number(n.toFixed(d)).toString();
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
function ratioLabel(w: number, h: number) {
  const r = w / h;
  const known: [number, string][] = [
    [16 / 9, "16:9"],
    [4 / 3, "4:3"],
    [1, "1:1"],
    [21 / 9, "21:9"],
    [32 / 9, "32:9"],
    [9 / 16, "9:16"],
    [2, "2:1"],
  ];
  for (const [v, s] of known) if (Math.abs(r - v) / v < 0.02) return s;
  const g = gcd(w, h);
  const a = w / g,
    b = h / g;
  return a <= 40 && b <= 40 ? `${a}:${b}` : `${fmt(r, 2)}:1`;
}

export default function LedCalculator({ lang }: { lang: Locale }) {
  const [env, setEnv] = useState<Env>("indoor");
  const [wIn, setWIn] = useState("4");
  const [hIn, setHIn] = useState("2.5");
  const [cabId, setCabId] = useState("500x500");
  const [pitch, setPitch] = useState(2.5);
  const [nearIn, setNearIn] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [view, setView] = useState<View>("2d");
  const [eyeMode, setEyeMode] = useState(0);
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(hasWebGL()), []);

  const cabinets = CABINETS.filter((c) => c.env.includes(env));
  const pitches = PITCHES[env];

  // Keep choices valid when the location changes.
  useEffect(() => {
    if (!cabinets.some((c) => c.id === cabId)) setCabId(cabinets[0].id);
    if (!pitches.includes(pitch)) setPitch(env === "indoor" ? 2.5 : 6.6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env]);

  useEffect(() => () => {
    if (img) URL.revokeObjectURL(img);
  }, [img]);

  const cab = cabinets.find((c) => c.id === cabId) ?? cabinets[0];
  const W = Math.max(0.3, Math.min(60, parseFloat(wIn.replace(",", ".")) || 0));
  const H = Math.max(0.3, Math.min(30, parseFloat(hIn.replace(",", ".")) || 0));
  const near = parseFloat(nearIn.replace(",", "."));

  const r = useMemo(() => {
    const cols = Math.max(1, Math.round((W * 1000) / cab.w));
    const rows = Math.max(1, Math.round((H * 1000) / cab.h));
    const pxW = Math.round(cab.w / pitch);
    const pxH = Math.round(cab.h / pitch);
    const resW = cols * pxW;
    const resH = rows * pxH;
    const realW = (cols * cab.w) / 1000;
    const realH = (rows * cab.h) / 1000;
    return { cols, rows, count: cols * rows, resW, resH, realW, realH, area: realW * realH };
  }, [W, H, cab, pitch]);

  const vMin = pitch; // rule of thumb: ~1 m per mm of pitch
  const coverage =
    r.resW >= 3840 && r.resH >= 2160 ? L.uhd : r.resW >= 1920 && r.resH >= 1080 ? L.hd : L.belowHd;

  const summary =
    (lang === "mn" ? "LED дэлгэц: " : "LED screen: ") +
    `${t(env === "indoor" ? L.indoor : L.outdoor, lang)}, ` +
    `${fmt(r.realW)}×${fmt(r.realH)} ${t(L.m, lang)} (${fmt(r.area)} ${t(L.m2, lang)}), ` +
    `pitch ${pitch} mm, ${lang === "mn" ? "кабинет" : "cabinet"} ${cab.w}×${cab.h} mm × ${r.count} ${t(L.pcs, lang)} (${r.cols}×${r.rows}), ` +
    `${r.resW}×${r.resH} px.`;
  const quoteHref =
    href(lang, ["contact"]) +
    `?interest=displays-led-projection&request=${encodeURIComponent(summary)}`;

  // Drawing: fit wall + person into a fixed viewBox, in metres.
  const sceneW = r.realW + PERSON_M * 0.9 + 0.3;
  const sceneH = Math.max(r.realH + 0.4, PERSON_M + 0.2);
  const ground = sceneH;
  const wallTop = ground - r.realH - 0.25;
  const wallX = PERSON_M * 0.9;
  const dot = Math.max(0.0004, pitch / 1000);
  const drawDots = r.realW / dot < 900; // keep the dot texture readable, not a grey haze

  const seg = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-[5px] transition-colors ${
      active ? "bg-white text-ink shadow-[0_1px_2px_rgba(23,33,44,0.18)]" : "text-steel hover:text-ink"
    }`;
  const field =
    "mt-1.5 block w-full rounded-md border border-line bg-white px-3 py-2.5 text-base tabular-nums focus:border-brand focus:outline-none";

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-12">
      {/* Controls */}
      <form className="space-y-7 lg:sticky lg:top-24 lg:self-start" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend className="text-sm font-semibold">{t(L.env, lang)}</legend>
          <div className="mt-2 inline-flex rounded-md bg-line/60 p-1" role="radiogroup">
            {(["indoor", "outdoor"] as Env[]).map((e) => (
              <button key={e} type="button" role="radio" aria-checked={env === e} className={seg(env === e)} onClick={() => setEnv(e)}>
                {t(e === "indoor" ? L.indoor : L.outdoor, lang)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">{t(L.size, lang)}</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className="text-sm text-steel">
              {t(L.width, lang)}
              <input className={field} inputMode="decimal" value={wIn} onChange={(e) => setWIn(e.target.value)} />
            </label>
            <label className="text-sm text-steel">
              {t(L.height, lang)}
              <input className={field} inputMode="decimal" value={hIn} onChange={(e) => setHIn(e.target.value)} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">{t(L.cabinet, lang)}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {cabinets.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cab.id === c.id}
                onClick={() => setCabId(c.id)}
                className={`rounded-md border px-3 py-2 text-sm tabular-nums ${
                  cab.id === c.id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-ink"
                }`}
              >
                {c.w}×{c.h}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold">{t(L.pitch, lang)}</legend>
          <p className="mt-1 text-sm text-steel">{t(L.pitchHint, lang)}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {pitches.map((p) => {
              const ok = near > 0 && p <= near;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pitch === p}
                  onClick={() => setPitch(p)}
                  className={`relative rounded-md border px-3 py-2 text-sm tabular-nums ${
                    pitch === p ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-ink"
                  }`}
                >
                  P{p}
                  {ok && (
                    <span
                      className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-paper ${pitch === p ? "bg-white" : "bg-emerald-600"}`}
                      title={t(L.fits, lang)}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <label className="mt-4 block text-sm text-steel">
            {t(L.nearest, lang)}
            <input className={field} inputMode="decimal" value={nearIn} onChange={(e) => setNearIn(e.target.value)} placeholder="3" />
          </label>
          <p className="mt-1.5 text-sm text-steel">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-600 align-middle" aria-hidden="true" />
            {t(L.nearestHint, lang)}
          </p>
        </fieldset>
      </form>

      {/* Result */}
      <section aria-live="polite" className="min-w-0">
        <h2 className="sr-only">{t(L.result, lang)}</h2>
        <figure className="overflow-hidden rounded-lg border border-line bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2">
            <div className="inline-flex rounded-md bg-line/60 p-1" role="tablist" aria-label={t(L.views, lang)}>
              {([["2d", L.v2d], ["3d", L.v3d], ["plan", L.vPlan]] as [View, Text][]).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  disabled={v === "3d" && !webgl}
                  title={v === "3d" && !webgl ? t(L.no3d, lang) : undefined}
                  onClick={() => setView(v)}
                  className={seg(view === v) + " disabled:opacity-40"}
                >
                  {t(label, lang)}
                </button>
              ))}
            </div>
            {view === "3d" && (
              <div className="flex gap-2">
                <button type="button" onClick={() => setEyeMode((n) => n + 1)} className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-medium hover:border-ink">
                  {t(L.eye, lang)}
                </button>
              </div>
            )}
          </div>
          {view === "2d" && (
          <svg
            viewBox={`0 0 ${sceneW} ${sceneH}`}
            className="block h-auto w-full bg-[linear-gradient(#f9fafb,#eef1f4)]"
            role="img"
            aria-label={`${fmt(r.realW)} × ${fmt(r.realH)} ${t(L.m, lang)}, ${t(L.person, lang)}`}
          >
            <defs>
              <pattern id="ledDots" width={dot} height={dot} patternUnits="userSpaceOnUse">
                <circle cx={dot / 2} cy={dot / 2} r={dot * 0.32} fill="#000" fillOpacity="0.28" />
              </pattern>
              <clipPath id="wallClip">
                <rect x={wallX} y={wallTop} width={r.realW} height={r.realH} />
              </clipPath>
            </defs>

            {/* floor */}
            <line x1="0" x2={sceneW} y1={ground} y2={ground} stroke="#c3cbd4" strokeWidth={sceneH * 0.004} />

            {/* screen content */}
            <g clipPath="url(#wallClip)">
              {img ? (
                <image href={img} x={wallX} y={wallTop} width={r.realW} height={r.realH} preserveAspectRatio="xMidYMid slice" />
              ) : (
                ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"].map((c, i) => (
                  <rect key={c} x={wallX + (i * r.realW) / 7} y={wallTop} width={r.realW / 7 + 0.001} height={r.realH} fill={c} />
                ))
              )}
              {drawDots && <rect x={wallX} y={wallTop} width={r.realW} height={r.realH} fill="url(#ledDots)" />}
              {/* cabinet seams */}
              {Array.from({ length: r.cols - 1 }, (_, i) => (
                <line
                  key={`c${i}`}
                  x1={wallX + ((i + 1) * cab.w) / 1000}
                  x2={wallX + ((i + 1) * cab.w) / 1000}
                  y1={wallTop}
                  y2={wallTop + r.realH}
                  stroke="#17212c"
                  strokeOpacity="0.55"
                  strokeWidth={sceneH * 0.0025}
                />
              ))}
              {Array.from({ length: r.rows - 1 }, (_, i) => (
                <line
                  key={`r${i}`}
                  y1={wallTop + ((i + 1) * cab.h) / 1000}
                  y2={wallTop + ((i + 1) * cab.h) / 1000}
                  x1={wallX}
                  x2={wallX + r.realW}
                  stroke="#17212c"
                  strokeOpacity="0.55"
                  strokeWidth={sceneH * 0.0025}
                />
              ))}
            </g>
            <rect x={wallX} y={wallTop} width={r.realW} height={r.realH} fill="none" stroke="#17212c" strokeWidth={sceneH * 0.006} />
            {/* stand legs to the floor */}
            <line x1={wallX + r.realW * 0.2} x2={wallX + r.realW * 0.2} y1={wallTop + r.realH} y2={ground} stroke="#17212c" strokeWidth={sceneH * 0.006} />
            <line x1={wallX + r.realW * 0.8} x2={wallX + r.realW * 0.8} y1={wallTop + r.realH} y2={ground} stroke="#17212c" strokeWidth={sceneH * 0.006} />

            {/* 1.75 m person for scale */}
            <g fill="#5a6776" transform={`translate(${PERSON_M * 0.38} ${ground - PERSON_M})`}>
              <circle cx="0" cy={PERSON_M * 0.07} r={PERSON_M * 0.065} />
              <path
                d={`M ${-PERSON_M * 0.11} ${PERSON_M * 0.16} h ${PERSON_M * 0.22} l ${PERSON_M * 0.03} ${PERSON_M * 0.38} h ${-PERSON_M * 0.06} l ${-PERSON_M * 0.02} ${PERSON_M * 0.46} h ${-PERSON_M * 0.07} l ${-PERSON_M * 0.01} ${-PERSON_M * 0.3} l ${-PERSON_M * 0.01} ${PERSON_M * 0.3} h ${-PERSON_M * 0.07} l ${-PERSON_M * 0.02} ${-PERSON_M * 0.46} h ${-PERSON_M * 0.06} z`}
              />
            </g>
          </svg>
          )}
          {view === "3d" && (
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <LedScene3D
                realW={r.realW}
                realH={r.realH}
                cols={r.cols}
                rows={r.rows}
                bottom={0.25}
                image={img}
                eyeDistance={near > 0 ? near : vMin * 2}
                eyeMode={eyeMode}
                zoneMin={vMin}
                zoneBest={[vMin * 2, vMin * 3]}
                labels={{ tooClose: t(L.tooClose, lang), best: t(L.best, lang), person: t(L.person, lang) }}
              />
              <p className="pointer-events-none absolute bottom-2 left-3 rounded-sm bg-white/80 px-1.5 py-0.5 text-xs text-steel">{t(L.drag, lang)}</p>
            </div>
          )}
          {view === "plan" && <LedPlan lang={lang} realW={r.realW} vMin={vMin} near={near > 0 ? near : 0} />}
          <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-steel">
            <span className="flex flex-wrap gap-x-4">
              <span className="font-medium text-ink">
                {fmt(r.realW)} × {fmt(r.realH)} {t(L.m, lang)}
              </span>
              <span>{t(L.person, lang)}</span>
            </span>
            <span className="flex items-center gap-3">
              <label className="cursor-pointer font-medium text-brand hover:underline">
                {t(L.image, lang)}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setImg(URL.createObjectURL(f));
                  }}
                />
              </label>
              {img && (
                <button type="button" className="text-steel hover:text-ink" onClick={() => setImg(null)}>
                  {t(L.imageReset, lang)}
                </button>
              )}
            </span>
          </figcaption>
        </figure>

        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {[
            [L.resolution, `${r.resW} × ${r.resH}`],
            [L.cabinets, `${r.count} ${t(L.pcs, lang)} (${r.cols} × ${r.rows})`],
            [L.realSize, `${fmt(r.realW)} × ${fmt(r.realH)} ${t(L.m, lang)}`],
            [L.area, `${fmt(r.area)} ${t(L.m2, lang)}`],
            [L.ratio, ratioLabel(r.cols * cab.w, r.rows * cab.h)],
            [L.totalPx, (r.resW * r.resH).toLocaleString(lang === "mn" ? "mn-MN" : "en-US")],
          ].map(([k, v]) => (
            <div key={t(k as Text, lang)} className="bg-white px-4 py-4">
              <dt className="text-sm text-steel">{t(k as Text, lang)}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{v as string}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 rounded-lg border border-line bg-white px-4 py-4">
          <p className="text-sm text-steel">{t(L.viewing, lang)}</p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {t(L.viewingVal, lang)
              .replace("{a}", fmt(vMin, 1))
              .replace("{b}", fmt(vMin * 2, 1))
              .replace("{c}", fmt(vMin * 3, 1))}
          </p>
          <p className="mt-2 text-sm text-ink">{t(coverage, lang)}</p>
        </div>

        <p className="mt-4 text-sm text-steel measure">{t(L.note, lang)}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link href={quoteHref} className="inline-block rounded-md bg-brand px-6 py-3 text-center font-semibold text-white hover:brightness-110 sm:whitespace-nowrap">
            {t(L.send, lang)}
          </Link>
          <span className="text-sm text-steel">{t(L.sendHint, lang)}</span>
        </div>
      </section>
    </div>
  );
}

/* Top-down plan: the screen on the left, distance running to the right, the viewer if given. */
function LedPlan({ lang, realW, vMin, near }: { lang: Locale; realW: number; vMin: number; near: number }) {
  const depth = Math.max(vMin * 3 + 1, near + 1, 4);
  const W = 720;
  const left = 70;
  const s = Math.min((W - left - 30) / depth, 240 / realW); // px per metre, same on both axes
  const top = 36;
  const H = Math.round(realW * s + top + 46);
  const step = depth > 24 ? 5 : depth > 12 ? 2 : 1;
  const ticks = Array.from({ length: Math.floor(depth / step) + 1 }, (_, i) => i * step);
  const band = (from: number, to: number, fill: string, label: Text) => (
    <g>
      <rect x={left + from * s} y={top} width={(to - from) * s} height={realW * s} fill={fill} />
      <text x={left + from * s + 6} y={top + 16} fontSize="12" fill="#17212c">
        {t(label, lang)}
      </text>
      <text x={left + from * s + 6} y={top + 31} fontSize="11" fill="#5a6776">
        {fmt(from, 1)}–{fmt(to, 1)} {t(L.m, lang)}
      </text>
    </g>
  );
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full bg-white" role="img" aria-label={t(L.planNote, lang)}>
        {band(0, vMin, "rgba(225,29,72,0.14)", L.tooClose)}
        {band(vMin, vMin * 2, "rgba(234,179,8,0.14)", L.okZone)}
        {band(vMin * 2, vMin * 3, "rgba(5,150,105,0.2)", L.best)}
        {/* screen */}
        <rect x={left - 8} y={top} width="8" height={realW * s} fill="#17212c" />
        <text x={left - 14} y={top + (realW * s) / 2} fontSize="12" textAnchor="end" fill="#17212c">
          {t(L.screen, lang)}
        </text>
        <text x={left - 14} y={top + (realW * s) / 2 + 15} fontSize="11" textAnchor="end" fill="#5a6776">
          {fmt(realW)} {t(L.m, lang)}
        </text>
        {/* distance scale */}
        {ticks.map((i) => (
          <g key={i}>
            <line x1={left + i * s} x2={left + i * s} y1={top + realW * s + 4} y2={top + realW * s + 10} stroke="#9aa5b1" />
            <text x={left + i * s} y={top + realW * s + 24} fontSize="11" textAnchor="middle" fill="#5a6776">
              {i} {t(L.m, lang)}
            </text>
          </g>
        ))}
        {near > 0 && (
          <g>
            <line x1={left + near * s} x2={left + near * s} y1={top} y2={top + realW * s} stroke="#0077b6" strokeDasharray="4 4" />
            <circle cx={left + near * s} cy={top + (realW * s) / 2} r="7" fill="#0077b6" />
            <text x={left + near * s} y={top - 10} fontSize="12" textAnchor="middle" fill="#0077b6">
              {t(L.viewer, lang)} {fmt(near, 1)} {t(L.m, lang)}
            </text>
          </g>
        )}
      </svg>
      <p className="px-4 pb-3 text-sm text-steel">{t(L.planNote, lang)}</p>
    </div>
  );
}
