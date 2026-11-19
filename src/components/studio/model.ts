import { categories, suggest, type CategoryId, type Dims } from "@/content/stageCatalog";

/*
  Stage planner model, in metres.
  x: across the hall (0 = centre), z: from the back wall behind the stage (0) towards the audience, y: up.
  The stage occupies x ∈ [-stageW/2, stageW/2], z ∈ [0, stageD], top at stageH.
*/

export type Kind = "main" | "sub" | "monitor" | "delay" | "foh" | "stagebox" | "outlet" | "generator";
export type Item = { id: string; kind: Kind; x: number; z: number; moved?: boolean };
export type Pick = { product: string; qty: number | null }; // qty null = follow the suggestion
export type State = { dims: Dims; picks: Partial<Record<CategoryId, Pick>>; items: Item[] };

export const DEFAULT_DIMS: Dims = {
  hallW: 24,
  hallD: 32,
  hallH: 12,
  stageW: 14,
  stageD: 8,
  stageH: 1.2,
  led: true,
  ledW: 8,
  ledH: 4.5,
  audience: 600,
  channels: 24,
  wireless: 4,
};

export const LIMITS: Record<keyof Omit<Dims, "led">, [number, number, number]> = {
  hallW: [8, 80, 0.5],
  hallD: [8, 120, 0.5],
  hallH: [3, 30, 0.5],
  stageW: [3, 40, 0.5],
  stageD: [2, 20, 0.5],
  stageH: [0, 2.5, 0.1],
  ledW: [1, 30, 0.5],
  ledH: [1, 15, 0.5],
  audience: [10, 5000, 10],
  channels: [4, 64, 4],
  wireless: [0, 24, 1],
};

/** Keep dimensions physically consistent (stage fits the hall, LED fits the stage). */
export function fixDims(d: Dims): Dims {
  const c = (v: number, [lo, hi]: [number, number, number]) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));
  const o = { ...d };
  (Object.keys(LIMITS) as (keyof typeof LIMITS)[]).forEach((k) => (o[k] = c(o[k], LIMITS[k])));
  o.stageW = Math.min(o.stageW, o.hallW - 1);
  o.stageD = Math.min(o.stageD, o.hallD - 4);
  o.ledW = Math.min(o.ledW, o.stageW);
  o.ledH = Math.min(o.ledH, Math.max(1, o.hallH - o.stageH - 0.8));
  return o;
}

/** The product and quantity in use for each category: the visitor's choice, else the suggestion. */
export function resolved(s: State) {
  const sug = suggest(s.dims);
  const out = {} as Record<CategoryId, { product: string; qty: number; suggested: { product: string; qty: number } }>;
  for (const c of categories) {
    const p = s.picks[c.id];
    out[c.id] = {
      product: p?.product ?? sug[c.id].product,
      qty: p?.qty ?? sug[c.id].qty,
      suggested: sug[c.id],
    };
  }
  return out;
}

export function isLineArray(product: string) {
  return product.startsWith("la");
}

/* ---------- default positions ---------- */

function spread(n: number, width: number) {
  if (n <= 1) return [0];
  return Array.from({ length: n }, (_, i) => -width / 2 + (i * width) / (n - 1));
}

function defaults(kind: Kind, n: number, d: Dims): { x: number; z: number }[] {
  const listen = d.hallD - d.stageD;
  switch (kind) {
    case "main": {
      const x = Math.min(d.stageW / 2 + 0.8, d.hallW / 2 - 0.6);
      return [{ x: -x, z: d.stageD - 0.4 }, { x, z: d.stageD - 0.4 }];
    }
    case "sub":
      return spread(n, Math.max(0, d.stageW - 2)).map((x) => ({ x, z: d.stageD + 0.6 }));
    case "monitor":
      return spread(n, Math.max(0, d.stageW - 3)).map((x) => ({ x, z: d.stageD - 0.7 }));
    case "delay": {
      const xs = d.hallW / 2 - 0.8;
      const zs = n > 2 ? [d.stageD + listen * 0.45, d.stageD + listen * 0.72] : [d.stageD + listen * 0.55];
      return zs.flatMap((z) => [{ x: -xs, z }, { x: xs, z }]).slice(0, n);
    }
    case "foh":
      return [{ x: 0, z: Math.min(d.hallD - 2, d.stageD + listen * 0.66) }];
    case "stagebox":
      return [{ x: d.stageW / 2 - 1, z: 1 }];
    case "outlet": // along the left wall, every 4 m
      return Array.from({ length: Math.max(1, n) }, (_, i) => ({ x: -d.hallW / 2 + 0.15, z: Math.min(d.hallD - 1, Math.max(1, d.stageD * 0.5) + i * 4) }));
    case "generator": // back corner on the right
      return Array.from({ length: Math.max(1, n) }, (_, i) => ({ x: d.hallW / 2 - 1.2, z: 1.2 + i * 2.5 }));
  }
}

export function clampToHall(it: Item, d: Dims): Item {
  const m = it.kind === "outlet" ? 0.15 : 0.5;
  return {
    ...it,
    x: Math.min(d.hallW / 2 - m, Math.max(-d.hallW / 2 + m, it.x)),
    z: Math.min(d.hallD - m, Math.max(m, it.z)),
  };
}

/**
 * Rebuild the placed items for the current room and quantities.
 * Items the visitor dragged keep their position (clamped into the hall); the rest follow the defaults.
 */
export function syncItems(s: State): Item[] {
  const r = resolved(s);
  const want: Record<Kind, number> = {
    main: 2,
    sub: r.sub.qty,
    monitor: r.monitor.qty,
    delay: r.delay.qty,
    foh: 1,
    stagebox: r.stagebox.qty > 0 ? 1 : 0,
    // At least one power source: an outlet unless the visitor placed a generator instead.
    outlet: Math.max(s.items.some((i) => i.kind === "generator") ? 0 : 1, s.items.filter((i) => i.kind === "outlet").length),
    generator: s.items.filter((i) => i.kind === "generator").length,
  };
  const out: Item[] = [];
  (Object.keys(want) as Kind[]).forEach((kind) => {
    const have = s.items.filter((i) => i.kind === kind);
    const pos = defaults(kind, want[kind], s.dims);
    for (let i = 0; i < want[kind]; i++) {
      const prev = have[i];
      const base = prev?.moved ? prev : { id: prev?.id ?? `${kind}${i}`, kind, ...(pos[i] ?? pos[pos.length - 1]) };
      out.push(clampToHall({ ...base, id: prev?.id ?? `${kind}${i}`, kind, moved: prev?.moved }, s.dims));
    }
  });
  return out;
}

export function initialState(): State {
  const s: State = { dims: DEFAULT_DIMS, picks: {}, items: [] };
  return { ...s, items: syncItems(s) };
}

/* ---------- seats ---------- */

export function seats(d: Dims, foh: { x: number; z: number } | undefined) {
  const out: { x: number; z: number }[] = [];
  const z0 = d.stageD + 2;
  const rowD = 0.9;
  const seatW = 0.55;
  const aisle = 1.2;
  const half = d.hallW / 2 - 1;
  for (let z = z0 + rowD / 2; z < d.hallD - 1 && out.length < d.audience; z += rowD) {
    for (let x = -half + seatW / 2; x <= half - seatW / 2 && out.length < d.audience; x += seatW) {
      if (Math.abs(x) < aisle / 2) continue;
      if (foh && Math.abs(x - foh.x) < 1.8 && Math.abs(z - foh.z) < 1.4) continue;
      out.push({ x, z });
    }
  }
  return out;
}

/* ---------- cables ---------- */

export type CableType = "speaker" | "network" | "video" | "power";
export type Cable = { type: CableType; from: Item | { x: number; z: number; id: string }; to: Item | { x: number; z: number; id: string }; length: number };

export const CABLE_COLORS: Record<CableType, string> = {
  speaker: "#7c3aed",
  network: "#059669",
  video: "#0077b6",
  power: "#ea580c",
};

/** Height (m) where a device connects, used for vertical cable runs. */
function heightOf(kind: Kind | "led", d: Dims, mainLA: boolean) {
  switch (kind) {
    case "main":
      return mainLA ? d.hallH * 0.65 : 2;
    case "monitor":
    case "stagebox":
      return d.stageH;
    case "led":
      return d.stageH + 0.6;
    default:
      return 0;
  }
}

/** Floor route: along x then along z, plus vertical runs and 10% slack; rounded up to whole metres. */
function routeLength(a: { x: number; z: number }, ha: number, b: { x: number; z: number }, hb: number) {
  const run = Math.abs(a.x - b.x) + Math.abs(a.z - b.z) + ha + hb;
  return Math.ceil(run * 1.1 + 1);
}

export function cables(s: State): Cable[] {
  const d = s.dims;
  const r = resolved(s);
  const la = isLineArray(r.main.product);
  const find = (k: Kind) => s.items.filter((i) => i.kind === k);
  const foh = find("foh")[0];
  const box = find("stagebox")[0];
  const led = d.led ? { id: "led", x: 0, z: 0.3 } : null;
  const powers = [...find("outlet"), ...find("generator")];
  const out: Cable[] = [];

  const audioHub = box ?? foh;
  if (foh && box) out.push({ type: "network", from: foh, to: box, length: routeLength(foh, 0, box, d.stageH) });
  for (const it of s.items) {
    if (["main", "sub", "monitor", "delay"].includes(it.kind) && audioHub) {
      out.push({ type: "speaker", from: audioHub, to: it, length: routeLength(audioHub, heightOf(audioHub.kind, d, la), it, heightOf(it.kind, d, la)) });
    }
  }
  if (led && foh) out.push({ type: "video", from: foh, to: led, length: routeLength(foh, 0, led, heightOf("led", d, la)) });

  const powered: (Item | { id: string; x: number; z: number; kind: "led" })[] = [
    ...s.items.filter((i) => ["main", "sub", "monitor", "delay", "foh", "stagebox"].includes(i.kind)),
    ...(led ? [{ ...led, kind: "led" as const }] : []),
  ];
  if (powers.length) {
    for (const p of powered) {
      const src = powers.reduce((a, b) => (Math.abs(a.x - p.x) + Math.abs(a.z - p.z) <= Math.abs(b.x - p.x) + Math.abs(b.z - p.z) ? a : b));
      out.push({ type: "power", from: src, to: p as Item, length: routeLength(src, 0, p, heightOf(p.kind as Kind | "led", d, la)) });
    }
  }
  return out;
}

/* ---------- share link (URL hash) ---------- */

type Packed = { d: Dims; p: State["picks"]; m: [string, Kind, number, number][]; e: [Kind, number][] };

export function encode(s: State): string {
  const packed: Packed = {
    d: s.dims,
    p: s.picks,
    m: s.items.filter((i) => i.moved).map((i) => [i.id, i.kind, Math.round(i.x * 10) / 10, Math.round(i.z * 10) / 10]),
    e: (["outlet", "generator"] as Kind[]).map((k) => [k, s.items.filter((i) => i.kind === k).length]),
  };
  const json = JSON.stringify(packed);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decode(hash: string): State | null {
  try {
    const b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    const p = JSON.parse(decodeURIComponent(escape(atob(b64)))) as Packed;
    const dims = fixDims({ ...DEFAULT_DIMS, ...p.d });
    const items: Item[] = [];
    for (const [k, n] of p.e ?? []) for (let i = 0; i < n; i++) items.push({ id: `${k}${i}`, kind: k, x: 0, z: 0 });
    for (const [id, kind, x, z] of p.m ?? []) {
      const at = items.findIndex((i) => i.id === id);
      const it = { id, kind, x, z, moved: true };
      if (at >= 0) items[at] = it;
      else items.push(it);
    }
    // Non-moved extras get default positions from syncItems.
    const s: State = { dims, picks: p.p ?? {}, items: items.map((i) => (i.moved ? i : { ...i, moved: false })) };
    return { ...s, items: syncItems(s) };
  } catch {
    return null;
  }
}
