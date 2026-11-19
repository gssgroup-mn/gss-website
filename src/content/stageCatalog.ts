import type { Text } from "@/content/site";

/*
  Stage planner product list.
  PLACEHOLDER: generic product types until Sales supplies the real models, specs and photos.
  To switch to real products, replace the `products` arrays (keep the ids or update `suggest`).
  `placeholder: true` shows a staging-only "example" marker next to the list.
*/
export const placeholder = true;

export type CategoryId = "main" | "sub" | "monitor" | "delay" | "mixer" | "stagebox" | "wireless" | "led";

export type Product = { id: string; name: Text; note: Text };
export type Category = { id: CategoryId; name: Text; why: Text; products: Product[] };

export const categories: Category[] = [
  {
    id: "main",
    name: { mn: "Үндсэн чанга яригч", en: "Main loudspeakers" },
    why: { mn: "Заалны уртаар сонгоно.", en: "Chosen by hall depth." },
    products: [
      { id: "ps12", name: { mn: "Чанга яригч 12\", тавиур дээр", en: "12\" loudspeaker on stand" }, note: { mn: "~15 м хүртэл", en: "up to ~15 m" } },
      { id: "la6", name: { mn: "Line array, тал бүрд 6 хайрцаг", en: "Line array, 6 boxes per side" }, note: { mn: "~25 м хүртэл", en: "up to ~25 m" } },
      { id: "la10", name: { mn: "Line array, тал бүрд 10 хайрцаг", en: "Line array, 10 boxes per side" }, note: { mn: "~45 м хүртэл", en: "up to ~45 m" } },
    ],
  },
  {
    id: "sub",
    name: { mn: "Суб (нам давтамж)", en: "Subwoofers" },
    why: { mn: "Үзэгчдийн тоогоор сонгоно.", en: "Chosen by audience size." },
    products: [
      { id: "s15", name: { mn: "Суб 15\"", en: "15\" subwoofer" }, note: { mn: "~150 хүн хүртэл", en: "up to ~150 people" } },
      { id: "s18", name: { mn: "Суб 18\"", en: "18\" subwoofer" }, note: { mn: "~600 хүн хүртэл", en: "up to ~600 people" } },
      { id: "s218", name: { mn: "Суб 2×18\"", en: "Dual 18\" subwoofer" }, note: { mn: "600-аас дээш", en: "600+ people" } },
    ],
  },
  {
    id: "monitor",
    name: { mn: "Тайзны монитор", en: "Stage monitors" },
    why: { mn: "Тайзны өргөнөөр тоолно.", en: "Counted from stage width." },
    products: [
      { id: "m10", name: { mn: "Монитор 10\"", en: "10\" wedge monitor" }, note: { mn: "Жижиг тайз", en: "Small stages" } },
      { id: "m12", name: { mn: "Монитор 12\"", en: "12\" wedge monitor" }, note: { mn: "Ихэнх тайзнд", en: "Most stages" } },
      { id: "m15", name: { mn: "Монитор 15\"", en: "15\" wedge monitor" }, note: { mn: "Чанга хөгжим", en: "Loud bands" } },
    ],
  },
  {
    id: "delay",
    name: { mn: "Delay чанга яригч", en: "Delay loudspeakers" },
    why: { mn: "Заал 30 м-ээс урт бол арын эгнээнд нэмнэ.", en: "Added for the rear rows in halls over 30 m." },
    products: [
      { id: "d8", name: { mn: "Delay чанга яригч 8\"", en: "8\" delay loudspeaker" }, note: { mn: "Арын эгнээ", en: "Rear rows" } },
      { id: "d12", name: { mn: "Delay чанга яригч 12\"", en: "12\" delay loudspeaker" }, note: { mn: "Том заал", en: "Large halls" } },
    ],
  },
  {
    id: "mixer",
    name: { mn: "Микшер", en: "Mixing console" },
    why: { mn: "Тайзны сувгийн тоогоор сонгоно.", en: "Chosen by stage channel count." },
    products: [
      { id: "x16", name: { mn: "Дижитал микшер, 16 суваг", en: "Digital mixer, 16 channels" }, note: { mn: "", en: "" } },
      { id: "x32", name: { mn: "Дижитал микшер, 32 суваг", en: "Digital mixer, 32 channels" }, note: { mn: "", en: "" } },
      { id: "x48", name: { mn: "Дижитал микшер, 48 суваг", en: "Digital mixer, 48 channels" }, note: { mn: "", en: "" } },
    ],
  },
  {
    id: "stagebox",
    name: { mn: "Тайзны хайрцаг (stage box)", en: "Stage box" },
    why: { mn: "Тайзнаас микшер рүү нэг сүлжээний кабелиар холбоно.", en: "Links stage to mixer over one network cable." },
    products: [
      { id: "sb16", name: { mn: "Stage box, 16 оролт", en: "Stage box, 16 inputs" }, note: { mn: "", en: "" } },
      { id: "sb32", name: { mn: "Stage box, 32 оролт", en: "Stage box, 32 inputs" }, note: { mn: "", en: "" } },
    ],
  },
  {
    id: "wireless",
    name: { mn: "Утасгүй микрофон", en: "Wireless microphones" },
    why: { mn: "Таны оруулсан тоогоор.", en: "The number you entered." },
    products: [
      { id: "w-hand", name: { mn: "Утасгүй микрофон, гарын", en: "Wireless handheld mic" }, note: { mn: "", en: "" } },
      { id: "w-head", name: { mn: "Утасгүй микрофон, толгойн", en: "Wireless headset mic" }, note: { mn: "", en: "" } },
    ],
  },
  {
    id: "led",
    name: { mn: "LED дэлгэц", en: "LED screen" },
    why: { mn: "Эхний эгнээний зайгаар пикселийн алхмыг сонгоно.", en: "Pixel pitch chosen from the front-row distance." },
    products: [
      { id: "p19", name: { mn: "LED дэлгэц P1.9, дотор", en: "LED screen P1.9, indoor" }, note: { mn: "≥2 м-ээс", en: "from 2 m" } },
      { id: "p25", name: { mn: "LED дэлгэц P2.5, дотор", en: "LED screen P2.5, indoor" }, note: { mn: "≥2.5 м-ээс", en: "from 2.5 m" } },
      { id: "p39", name: { mn: "LED дэлгэц P3.9, дотор/гадна", en: "LED screen P3.9, indoor/outdoor" }, note: { mn: "≥4 м-ээс", en: "from 4 m" } },
    ],
  },
];

export type Dims = {
  hallW: number;
  hallD: number;
  hallH: number;
  stageW: number;
  stageD: number;
  stageH: number;
  led: boolean;
  ledW: number;
  ledH: number;
  audience: number;
  channels: number;
  wireless: number;
};

/** Suggested product and quantity per category for the given room. */
export function suggest(d: Dims): Record<CategoryId, { product: string; qty: number }> {
  const listen = d.hallD - d.stageD; // stage edge to back wall
  const front = 2; // first row distance from stage edge
  const ledDist = d.stageD + front;
  return {
    main: { product: listen <= 15 ? "ps12" : listen <= 25 ? "la6" : "la10", qty: 2 },
    sub: {
      product: d.audience <= 150 ? "s15" : d.audience <= 600 ? "s18" : "s218",
      qty: d.audience > 1000 ? 6 : d.audience > 600 ? 4 : 2,
    },
    monitor: { product: "m12", qty: Math.min(8, Math.max(2, Math.round(d.stageW / 2.5))) },
    delay: { product: listen > 45 ? "d12" : "d8", qty: listen > 45 ? 4 : listen > 30 ? 2 : 0 },
    mixer: { product: d.channels <= 16 ? "x16" : d.channels <= 32 ? "x32" : "x48", qty: 1 },
    stagebox: { product: d.channels <= 16 ? "sb16" : "sb32", qty: d.channels <= 32 ? 1 : 2 },
    wireless: { product: "w-hand", qty: d.wireless },
    led: { product: ledDist >= 4 ? "p39" : ledDist >= 2.5 ? "p25" : "p19", qty: d.led ? 1 : 0 },
  };
}
