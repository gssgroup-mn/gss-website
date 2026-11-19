"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale, Text } from "@/content/site";
import { t } from "@/lib/i18n";
import { categories, placeholder, type CategoryId, type Dims } from "@/content/stageCatalog";
import {
  CABLE_COLORS,
  LIMITS,
  cables,
  clampToHall,
  decode,
  encode,
  fixDims,
  initialState,
  resolved,
  syncItems,
  type CableType,
  type Kind,
  type State,
} from "@/components/studio/model";
import StagePlan from "@/components/studio/StagePlan";
import PendingNote from "@/components/PendingNote";

const StageScene3D = dynamic(() => import("@/components/three/StageScene3D"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-steel">…</div>,
});

type Step = 1 | 2 | 3 | 4;
type View = "3d" | "plan";

const L = {
  steps: [
    { mn: "Заал ба тайз", en: "Hall and stage" },
    { mn: "Төхөөрөмж", en: "Equipment" },
    { mn: "Холболт", en: "Connections" },
    { mn: "Жагсаалт", en: "Summary" },
  ] as Text[],
  v3d: { mn: "3D", en: "3D" },
  vPlan: { mn: "План", en: "Plan" },
  cablesOn: { mn: "Кабель харуулах", en: "Show cables" },
  addOutlet: { mn: "Розетка нэмэх", en: "Add power outlet" },
  addGen: { mn: "Генератор нэмэх", en: "Add generator" },
  hint3d: { mn: "Төхөөрөмжийг чирж зөөнө. Хоосон газар чирвэл эргэнэ.", en: "Drag a device to move it. Drag empty space to rotate." },
  hintPlan: { mn: "Төхөөрөмжийг чирж хүссэн газраа байрлуулна.", en: "Drag devices to where you want them." },
  remove: { mn: "Устгах", en: "Remove" },
  resetPos: { mn: "Анхны байрлалд нь буцаах", en: "Back to default position" },
  back: { mn: "Буцах", en: "Back" },
  next: { mn: "Дараах", en: "Next" },
  // step 1
  hall: { mn: "Заал", en: "Hall" },
  stage: { mn: "Тайз", en: "Stage" },
  screen: { mn: "LED дэлгэц", en: "LED screen" },
  people: { mn: "Үзэгчид ба тайз", en: "Audience and stage" },
  hallW: { mn: "Өргөн", en: "Width" },
  hallD: { mn: "Урт", en: "Length" },
  hallH: { mn: "Таазны өндөр", en: "Ceiling height" },
  stageW: { mn: "Өргөн", en: "Width" },
  stageD: { mn: "Гүн", en: "Depth" },
  stageH: { mn: "Өндөр", en: "Height" },
  ledOn: { mn: "Тайзны ард LED дэлгэцтэй", en: "LED screen behind the stage" },
  ledW: { mn: "Өргөн", en: "Width" },
  ledH: { mn: "Өндөр", en: "Height" },
  audience: { mn: "Үзэгчдийн тоо", en: "Audience" },
  channels: { mn: "Микрофон, хөгжмийн зэмсгийн суваг", en: "Mic and instrument channels" },
  wireless: { mn: "Утасгүй микрофон", en: "Wireless microphones" },
  m: { mn: "м", en: "m" },
  pcs: { mn: "ш", en: "pcs" },
  ppl: { mn: "хүн", en: "people" },
  // step 2
  suggested: { mn: "Санал болгож буй", en: "Suggested" },
  qty: { mn: "Тоо", en: "Qty" },
  sugQty: { mn: "Санал: {n}", en: "Suggested: {n}" },
  useSug: { mn: "Саналыг ашиглах", en: "Use suggestion" },
  none: { mn: "Энэ заалд шаардлагагүй", en: "Not needed for this hall" },
  example: { mn: "Бараанууд одоогоор жишээ. Бодит загвар, зургийг Борлуулалт өгнө.", en: "Products are examples for now. Sales will supply real models and photos." },
  // step 3
  cableTypes: {
    speaker: { mn: "Чанга яригчийн дохио", en: "Speaker signal" },
    network: { mn: "Сүлжээ (дижитал снейк)", en: "Network (digital snake)" },
    video: { mn: "Видео (LED)", en: "Video (LED)" },
    power: { mn: "Цахилгаан", en: "Power" },
  } as Record<CableType, Text>,
  connLead: {
    mn: "Микшер (FOH), тайзны хайрцаг, розетка эсвэл генераторыг чирж байрлуулахад кабель, урт нь шууд шинэчлэгдэнэ. Төхөөрөмж бүр хамгийн ойрын цахилгааны эх үүсвэрт холбогдоно.",
    en: "Drag the mixer (FOH), stage box, outlets or generator and the cables and lengths update. Each device connects to its nearest power source.",
  },
  runs: { mn: "{n} кабель, нийт ~{m} м", en: "{n} runs, ~{m} m total" },
  lenNote: { mn: "Урт нь шалаар явах замаар, 10% нөөцтэй, ойролцоо тооцоо.", en: "Lengths follow the floor with 10% spare — estimates." },
  // step 4
  summary: { mn: "Таны тайзны жагсаалт", en: "Your stage list" },
  item: { mn: "Төхөөрөмж", en: "Item" },
  cablesH: { mn: "Кабель", en: "Cables" },
  dimsH: { mn: "Хэмжээ", en: "Dimensions" },
  copy: { mn: "Холбоос хуулах", en: "Copy link" },
  copied: { mn: "Хуулагдлаа", en: "Copied" },
  print: { mn: "Хэвлэх / PDF", en: "Print / PDF" },
  shareNote: { mn: "Холбоосоор нээхэд таны тайз яг ийм байдлаар нээгдэнэ.", en: "The link opens your stage exactly as it is." },
  reset: { mn: "Шинээр эхлэх", en: "Start over" },
} as const;

const KIND_NAME: Record<Kind, Text> = {
  main: { mn: "Үндсэн чанга яригч", en: "Main loudspeaker" },
  sub: { mn: "Суб", en: "Subwoofer" },
  monitor: { mn: "Тайзны монитор", en: "Stage monitor" },
  delay: { mn: "Delay чанга яригч", en: "Delay loudspeaker" },
  foh: { mn: "Микшерийн байр (FOH)", en: "Mixing position (FOH)" },
  stagebox: { mn: "Тайзны хайрцаг", en: "Stage box" },
  outlet: { mn: "Розетка", en: "Power outlet" },
  generator: { mn: "Генератор", en: "Generator" },
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function StageStudio({ lang }: { lang: Locale }) {
  const [s, setS] = useState<State>(initialState);
  const [step, setStep] = useState<Step>(1);
  const [view, setView] = useState<View>("3d");
  const [webgl, setWebgl] = useState(true);
  const [showCables, setShowCables] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Restore a shared plan from the link, and check 3D support.
  useEffect(() => {
    const ok = hasWebGL();
    setWebgl(ok);
    if (!ok) setView("plan");
    const m = window.location.hash.match(/plan=([\w-]+)/);
    if (m) {
      const restored = decode(m[1]);
      if (restored) {
        setS(restored);
        setStep(4);
        setShowCables(true);
      }
    }
  }, []);

  // Keep the link in the address bar up to date.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        history.replaceState(null, "", `#plan=${encode(s)}`);
      } catch {}
    }, 400);
    return () => window.clearTimeout(id);
  }, [s]);

  useEffect(() => {
    if (step >= 3) setShowCables(true);
  }, [step]);

  const setDims = (patch: Partial<Dims>) =>
    setS((prev) => {
      const next = { ...prev, dims: fixDims({ ...prev.dims, ...patch }) };
      return { ...next, items: syncItems(next) };
    });

  const setPick = (cat: CategoryId, patch: { product?: string; qty?: number | null }) =>
    setS((prev) => {
      const cur = resolved(prev)[cat];
      const old = prev.picks[cat];
      const pick = { product: patch.product ?? old?.product ?? cur.product, qty: patch.qty === undefined ? old?.qty ?? null : patch.qty };
      const next = { ...prev, picks: { ...prev.picks, [cat]: pick } };
      return { ...next, items: syncItems(next) };
    });

  const onMove = useCallback((id: string, x: number, z: number) => {
    setS((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? clampToHall({ ...it, x, z, moved: true }, prev.dims) : it)),
    }));
  }, []);

  const addPower = (kind: "outlet" | "generator") =>
    setS((prev) => {
      const next = { ...prev, items: [...prev.items, { id: `${kind}${Date.now() % 1e6}`, kind, x: 0, z: 0 }] };
      return { ...next, items: syncItems(next) };
    });

  const removeItem = (id: string) =>
    setS((prev) => {
      const next = { ...prev, items: prev.items.filter((i) => i.id !== id) };
      return { ...next, items: syncItems(next) };
    });

  const resetItem = (id: string) =>
    setS((prev) => {
      const next = { ...prev, items: prev.items.map((i) => (i.id === id ? { ...i, moved: false } : i)) };
      return { ...next, items: syncItems(next) };
    });

  const r = useMemo(() => resolved(s), [s]);
  const cableList = useMemo(() => cables(s), [s]);
  const cableTotals = useMemo(() => {
    const out = {} as Record<CableType, { n: number; m: number }>;
    (["speaker", "network", "video", "power"] as CableType[]).forEach((k) => (out[k] = { n: 0, m: 0 }));
    cableList.forEach((c) => {
      out[c.type].n++;
      out[c.type].m += c.length;
    });
    return out;
  }, [cableList]);
  const selItem = s.items.find((i) => i.id === sel) ?? null;
  const productName = (cat: CategoryId) => {
    const c = categories.find((x) => x.id === cat)!;
    return t(c.products.find((p) => p.id === r[cat].product)?.name ?? c.products[0].name, lang);
  };
  const d = s.dims;

  const segBtn = (on: boolean) =>
    `px-3.5 py-1.5 text-sm font-medium rounded-[5px] transition-colors disabled:opacity-40 ${on ? "bg-white text-ink shadow-[0_1px_2px_rgba(23,33,44,0.18)]" : "text-steel hover:text-ink"}`;

  return (
    <div className="border-y border-line bg-white">
      <style>{`@media print{body *{visibility:hidden}#studio-print,#studio-print *{visibility:visible}#studio-print{position:absolute;inset:0 auto auto 0;width:100%;padding:24px}}`}</style>

      {/* steps */}
      <nav aria-label="Steps" className="border-b border-line">
        <ol className="container-site flex gap-1 overflow-x-auto py-2">
          {L.steps.map((label, i) => {
            const n = (i + 1) as Step;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setStep(n)}
                  aria-current={step === n ? "step" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${step === n ? "bg-paper text-ink" : "text-steel hover:text-ink"}`}
                >
                  <span className={`grid h-6 w-6 place-items-center rounded-full text-xs tabular-nums ${step === n ? "bg-brand text-white" : step > n ? "bg-ink text-white" : "bg-line text-steel"}`}>{n}</span>
                  {t(label, lang)}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid lg:h-[calc(100vh-9rem)] lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_24rem]">
        {/* stage view */}
        <div className="relative flex min-h-[420px] flex-col bg-paper lg:min-h-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-line bg-white px-3 py-2">
            <div className="inline-flex rounded-md bg-line/60 p-1" role="tablist">
              {([["3d", L.v3d], ["plan", L.vPlan]] as [View, Text][]).map(([v, label]) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} disabled={v === "3d" && !webgl} onClick={() => setView(v)} className={segBtn(view === v)}>
                  {t(label, lang)}
                </button>
              ))}
            </div>
            <label className="ml-1 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showCables} onChange={(e) => setShowCables(e.target.checked)} className="h-4 w-4 accent-[#0077b6]" />
              {t(L.cablesOn, lang)}
            </label>
            <span className="ml-auto flex gap-2">
              <button type="button" onClick={() => addPower("outlet")} className="rounded-md border border-line bg-white px-3 py-1.5 text-sm hover:border-ink">
                <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#ea580c] align-middle" aria-hidden="true" />
                {t(L.addOutlet, lang)}
              </button>
              <button type="button" onClick={() => addPower("generator")} className="rounded-md border border-line bg-white px-3 py-1.5 text-sm hover:border-ink">
                {t(L.addGen, lang)}
              </button>
            </span>
          </div>
          <div className="relative min-h-[360px] flex-1">
            {view === "3d" ? (
              <StageScene3D state={s} showCables={showCables} selected={sel} onSelect={setSel} onMove={onMove} />
            ) : (
              <div className="absolute inset-0 p-3">
                <StagePlan state={s} showCables={showCables} selected={sel} onSelect={setSel} onMove={onMove} stageLabel={t(L.stage, lang)} screenLabel="LED" />
              </div>
            )}
            <p className="pointer-events-none absolute left-3 top-3 rounded-sm bg-white/85 px-2 py-1 text-xs text-steel">{t(view === "3d" ? L.hint3d : L.hintPlan, lang)}</p>
            {showCables && (
              <ul className="pointer-events-none absolute bottom-3 left-3 space-y-1 rounded-md bg-white/90 px-3 py-2 text-xs">
                {(Object.keys(CABLE_COLORS) as CableType[]).map((k) => (
                  <li key={k} className="flex items-center gap-2">
                    <span className="inline-block h-0.5 w-5" style={{ background: CABLE_COLORS[k] }} aria-hidden="true" />
                    {t(L.cableTypes[k], lang)}
                  </li>
                ))}
              </ul>
            )}
            {selItem && (
              <div className="absolute bottom-3 right-3 max-w-[16rem] rounded-md border border-line bg-white px-3 py-2.5 text-sm shadow-[0_2px_8px_rgba(23,33,44,0.12)]">
                <p className="font-semibold">{t(KIND_NAME[selItem.kind], lang)}</p>
                <p className="text-xs text-steel tabular-nums">
                  x {selItem.x.toFixed(1)} {t(L.m, lang)}, {lang === "mn" ? "тайзны ар хананаас" : "from the back wall"} {selItem.z.toFixed(1)} {t(L.m, lang)}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {selItem.moved && (
                    <button type="button" className="text-brand hover:underline" onClick={() => resetItem(selItem.id)}>
                      {t(L.resetPos, lang)}
                    </button>
                  )}
                  {(selItem.kind === "outlet" || selItem.kind === "generator") && (
                    <button
                      type="button"
                      className="text-tally-dark hover:underline"
                      onClick={() => {
                        removeItem(selItem.id);
                        setSel(null);
                      }}
                    >
                      {t(L.remove, lang)}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* sidebar */}
        <aside className="flex min-h-0 flex-col border-t border-line lg:border-l lg:border-t-0">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {step === 1 && (
              <div className="space-y-7">
                <Group title={t(L.hall, lang)}>
                  <Num lang={lang} label={L.hallW} unit={L.m} k="hallW" d={d} set={setDims} />
                  <Num lang={lang} label={L.hallD} unit={L.m} k="hallD" d={d} set={setDims} />
                  <Num lang={lang} label={L.hallH} unit={L.m} k="hallH" d={d} set={setDims} />
                </Group>
                <Group title={t(L.stage, lang)}>
                  <Num lang={lang} label={L.stageW} unit={L.m} k="stageW" d={d} set={setDims} />
                  <Num lang={lang} label={L.stageD} unit={L.m} k="stageD" d={d} set={setDims} />
                  <Num lang={lang} label={L.stageH} unit={L.m} k="stageH" d={d} set={setDims} />
                </Group>
                <Group title={t(L.screen, lang)}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={d.led} onChange={(e) => setDims({ led: e.target.checked })} className="h-4 w-4 accent-[#0077b6]" />
                    {t(L.ledOn, lang)}
                  </label>
                  {d.led && (
                    <>
                      <Num lang={lang} label={L.ledW} unit={L.m} k="ledW" d={d} set={setDims} />
                      <Num lang={lang} label={L.ledH} unit={L.m} k="ledH" d={d} set={setDims} />
                    </>
                  )}
                </Group>
                <Group title={t(L.people, lang)}>
                  <Num lang={lang} label={L.audience} unit={L.ppl} k="audience" d={d} set={setDims} />
                  <Num lang={lang} label={L.channels} unit={L.pcs} k="channels" d={d} set={setDims} />
                  <Num lang={lang} label={L.wireless} unit={L.pcs} k="wireless" d={d} set={setDims} />
                </Group>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {placeholder && <PendingNote text={L.example} lang={lang} />}
                {categories.map((c) => {
                  const cur = r[c.id];
                  const changed = cur.product !== cur.suggested.product || cur.qty !== cur.suggested.qty;
                  return (
                    <section key={c.id}>
                      <h3 className="font-semibold">{t(c.name, lang)}</h3>
                      <p className="text-sm text-steel">{t(c.why, lang)}</p>
                      {cur.suggested.qty === 0 && cur.qty === 0 ? (
                        <p className="mt-2 text-sm text-steel">{t(L.none, lang)}</p>
                      ) : (
                        <>
                          <ul className="mt-2 space-y-1.5" role="radiogroup" aria-label={t(c.name, lang)}>
                            {c.products.map((p) => {
                              const on = cur.product === p.id;
                              const sug = cur.suggested.product === p.id;
                              return (
                                <li key={p.id}>
                                  <button
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    onClick={() => setPick(c.id, { product: p.id })}
                                    className={`flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left ${on ? "border-brand bg-brand/5" : "border-line hover:border-ink"}`}
                                  >
                                    <span className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${on ? "border-brand" : "border-line"}`}>
                                      {on && <span className="h-2 w-2 rounded-full bg-brand" />}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-sm font-medium">{t(p.name, lang)}</span>
                                      {t(p.note, lang) && <span className="block text-xs text-steel">{t(p.note, lang)}</span>}
                                    </span>
                                    {sug && <span className="shrink-0 rounded-sm bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">{t(L.suggested, lang)}</span>}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                          {c.id !== "main" && (
                            <div className="mt-2 flex items-center gap-3 text-sm">
                              <span className="text-steel">{t(L.qty, lang)}</span>
                              <Stepper value={cur.qty} min={c.id === "mixer" || c.id === "stagebox" ? 1 : 0} max={c.id === "wireless" ? 24 : 12} onChange={(v) => setPick(c.id, { qty: v })} />
                              <span className="text-xs text-steel">{t(L.sugQty, lang).replace("{n}", String(cur.suggested.qty))}</span>
                            </div>
                          )}
                          {changed && (
                            <button type="button" className="mt-1.5 text-sm text-brand hover:underline" onClick={() => setPick(c.id, { product: cur.suggested.product, qty: null })}>
                              {t(L.useSug, lang)}
                            </button>
                          )}
                        </>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <p className="text-sm text-steel">{t(L.connLead, lang)}</p>
                <ul className="divide-y divide-line border-y border-line">
                  {(Object.keys(CABLE_COLORS) as CableType[]).map((k) => (
                    <li key={k} className="flex items-center gap-3 py-3">
                      <span className="inline-block h-1 w-6 shrink-0 rounded-full" style={{ background: CABLE_COLORS[k] }} aria-hidden="true" />
                      <span className="flex-1 text-sm font-medium">{t(L.cableTypes[k], lang)}</span>
                      <span className="text-sm tabular-nums text-steel">
                        {t(L.runs, lang).replace("{n}", String(cableTotals[k].n)).replace("{m}", String(cableTotals[k].m))}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-steel">{t(L.lenNote, lang)}</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => addPower("outlet")} className="rounded-md border border-line px-3 py-2 text-sm hover:border-ink">
                    {t(L.addOutlet, lang)}
                  </button>
                  <button type="button" onClick={() => addPower("generator")} className="rounded-md border border-line px-3 py-2 text-sm hover:border-ink">
                    {t(L.addGen, lang)}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div id="studio-print">
                  <h3 className="text-lg font-bold">{t(L.summary, lang)}</h3>
                  <h4 className="mt-4 text-sm font-semibold text-steel">{t(L.dimsH, lang)}</h4>
                  <ul className="mt-1 text-sm">
                    <li>
                      {t(L.hall, lang)}: {d.hallW} × {d.hallD} × {d.hallH} {t(L.m, lang)}
                    </li>
                    <li>
                      {t(L.stage, lang)}: {d.stageW} × {d.stageD}, {t(L.stageH, lang).toLowerCase()} {d.stageH} {t(L.m, lang)}
                    </li>
                    {d.led && (
                      <li>
                        {t(L.screen, lang)}: {d.ledW} × {d.ledH} {t(L.m, lang)}
                      </li>
                    )}
                    <li>
                      {t(L.audience, lang)}: {d.audience} {t(L.ppl, lang)}
                    </li>
                  </ul>
                  <h4 className="mt-4 text-sm font-semibold text-steel">{t(L.item, lang)}</h4>
                  <table className="mt-1 w-full text-sm">
                    <tbody>
                      {categories
                        .filter((c) => r[c.id].qty > 0)
                        .map((c) => (
                          <tr key={c.id} className="border-b border-line">
                            <td className="py-1.5 pr-2">{productName(c.id)}</td>
                            <td className="py-1.5 text-right tabular-nums">
                              {c.id === "main" ? `2 ${lang === "mn" ? "тал" : "sides"}` : `${r[c.id].qty} ${t(L.pcs, lang)}`}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <h4 className="mt-4 text-sm font-semibold text-steel">{t(L.cablesH, lang)}</h4>
                  <table className="mt-1 w-full text-sm">
                    <tbody>
                      {(Object.keys(CABLE_COLORS) as CableType[])
                        .filter((k) => cableTotals[k].n > 0)
                        .map((k) => (
                          <tr key={k} className="border-b border-line">
                            <td className="py-1.5 pr-2">{t(L.cableTypes[k], lang)}</td>
                            <td className="py-1.5 text-right tabular-nums">
                              {cableTotals[k].n} {t(L.pcs, lang)}, ~{cableTotals[k].m} {t(L.m, lang)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-xs text-steel">{t(L.lenNote, lang)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(`${location.origin}${location.pathname}#plan=${encode(s)}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch {}
                    }}
                  >
                    {copied ? t(L.copied, lang) : t(L.copy, lang)}
                  </button>
                  <button type="button" className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold hover:border-ink" onClick={() => window.print()}>
                    {t(L.print, lang)}
                  </button>
                </div>
                <p className="text-xs text-steel">{t(L.shareNote, lang)}</p>
                <button
                  type="button"
                  className="text-sm text-steel underline hover:text-ink"
                  onClick={() => {
                    setS(initialState());
                    setSel(null);
                    setStep(1);
                  }}
                >
                  {t(L.reset, lang)}
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-line px-5 py-3">
            <button type="button" disabled={step === 1} onClick={() => setStep((n) => (n - 1) as Step)} className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold hover:border-ink disabled:opacity-40">
              {t(L.back, lang)}
            </button>
            {step < 4 && (
              <button type="button" onClick={() => setStep((n) => (n + 1) as Step)} className="flex-1 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">
                {t(L.next, lang)}: {t(L.steps[step], lang)}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Num({ lang, label, unit, k, d, set }: { lang: Locale; label: Text; unit: Text; k: keyof typeof LIMITS; d: Dims; set: (p: Partial<Dims>) => void }) {
  const [lo, hi, step] = LIMITS[k];
  const [text, setText] = useState(String(d[k]));
  useEffect(() => setText(String(d[k])), [d, k]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`n-${k}`} className="text-sm text-steel">
          {t(label, lang)}
        </label>
        <span className="flex items-center gap-1.5">
          <input
            id={`n-${k}`}
            inputMode="decimal"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => set({ [k]: parseFloat(text.replace(",", ".")) } as Partial<Dims>)}
            onKeyDown={(e) => {
              if (e.key === "Enter") set({ [k]: parseFloat(text.replace(",", ".")) } as Partial<Dims>);
            }}
            className="w-20 rounded-md border border-line px-2 py-1 text-right text-sm tabular-nums focus:border-brand focus:outline-none"
          />
          <span className="w-8 text-sm text-steel">{t(unit, lang)}</span>
        </span>
      </div>
      <input
        type="range"
        min={lo}
        max={hi}
        step={step}
        value={d[k]}
        onChange={(e) => set({ [k]: parseFloat(e.target.value) } as Partial<Dims>)}
        className="mt-1.5 w-full accent-[#0077b6]"
        aria-label={t(label, lang)}
      />
    </div>
  );
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line">
      <button type="button" className="px-2.5 py-1 text-lg leading-none disabled:opacity-30" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label="−">
        −
      </button>
      <span className="w-8 text-center tabular-nums">{value}</span>
      <button type="button" className="px-2.5 py-1 text-lg leading-none disabled:opacity-30" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="+">
        +
      </button>
    </span>
  );
}
