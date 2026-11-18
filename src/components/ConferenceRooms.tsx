"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale, Text } from "@/content/site";
import { href, t } from "@/lib/i18n";
import PendingNote from "@/components/PendingNote";

type Room = {
  id: string;
  people: Text;
  name: Text;
  lead: Text;
  kit: Text[];
  plan: { seats: number; layout: "table" | "boardroom" | "hall" };
};

const rooms: Room[] = [
  {
    id: "huddle",
    people: { mn: "4–6 хүн", en: "4–6 people" },
    name: { mn: "Жижиг уулзалтын өрөө", en: "Huddle room" },
    lead: {
      mn: "Зөөврийн компьютераа залгаад шууд видео хурал эхлүүлэх энгийн шийдэл.",
      en: "Plug in a laptop and start a video call. Nothing to set up.",
    },
    kit: [
      { mn: "55–65 инчийн дэлгэц", en: "55–65 inch display" },
      { mn: "Камер, микрофон, чанга яригч нэг дор байрлах видео бар", en: "All-in-one video bar: camera, microphones, speaker" },
      { mn: "Утасгүй дэлгэц хуваалцах төхөөрөмж", en: "Wireless screen sharing" },
    ],
    plan: { seats: 6, layout: "table" },
  },
  {
    id: "meeting",
    people: { mn: "8–14 хүн", en: "8–14 people" },
    name: { mn: "Хурлын өрөө", en: "Meeting room" },
    lead: {
      mn: "Ширээний аль ч талд сууж байгаа хүний дуу, дүрс алсын оролцогчдод тод хүрнэ.",
      en: "Everyone around the table is seen and heard clearly by remote participants.",
    },
    kit: [
      { mn: "75–86 инчийн дэлгэц эсвэл интерактив самбар", en: "75–86 inch display or interactive board" },
      { mn: "Ярьж буй хүнийг дагадаг PTZ камер", en: "PTZ camera that follows the speaker" },
      { mn: "Таазны эсвэл ширээний микрофон", en: "Ceiling or table microphones" },
      { mn: "Цуурай, шуугианыг арилгах дууны процессор", en: "Audio processor for echo and noise control" },
      { mn: "Утастай болон утасгүй дэлгэц хуваалцах", en: "Wired and wireless screen sharing" },
    ],
    plan: { seats: 12, layout: "boardroom" },
  },
  {
    id: "large",
    people: { mn: "16–40 хүн", en: "16–40 people" },
    name: { mn: "Том хурлын танхим", en: "Large conference room" },
    lead: {
      mn: "Суудал бүрт микрофонтой, том дэлгэцтэй, нэг товчоор удирддаг танхим.",
      en: "A microphone at every seat, a large screen, and one-touch control.",
    },
    kit: [
      { mn: "Хоёр дэлгэц, проектор эсвэл LED дэлгэц", en: "Dual displays, projector or LED screen" },
      { mn: "2 ба түүнээс дээш PTZ камер", en: "Two or more PTZ cameras" },
      { mn: "Суудал бүрийн хурлын микрофон (дуу хүсэх товчтой)", en: "Delegate microphone at each seat, with request-to-speak" },
      { mn: "Дууны процессор, таазны чанга яригч", en: "Audio processor and ceiling loudspeakers" },
      { mn: "Хүрэлтээр удирдах самбар", en: "Touch control panel" },
    ],
    plan: { seats: 24, layout: "boardroom" },
  },
  {
    id: "hall",
    people: { mn: "40-өөс дээш", en: "40 and more" },
    name: { mn: "Хурлын их танхим", en: "Assembly hall" },
    lead: {
      mn: "Чуулган, хуралдаан, олон улсын арга хэмжээнд зориулсан бүрэн систем.",
      en: "A complete system for assemblies, sessions and international events.",
    },
    kit: [
      { mn: "Хурлын дуут систем, санал хураалтын боломжтой", en: "Conference system with optional voting" },
      { mn: "Синхрон орчуулгын систем", en: "Simultaneous interpretation system" },
      { mn: "LED дэлгэц эсвэл том проектор", en: "LED wall or large-venue projector" },
      { mn: "Бичлэг, шууд дамжуулалт", en: "Recording and live streaming" },
      { mn: "Танхимын дуу өсгөх систем", en: "Hall sound reinforcement" },
    ],
    plan: { seats: 48, layout: "hall" },
  },
];

const c = {
  pick: { mn: "Хэдэн хүний өрөө вэ?", en: "How many people?" },
  inside: { mn: "Багцад юу ордог вэ", en: "What's included" },
  note: {
    mn: "Брэнд, загварыг өрөөний хэмжээ, хэрэглээ, төсөвт тань тааруулж инженер санал болгоно.",
    en: "Our engineer recommends brands and models to fit your room, use and budget.",
  },
  ask: { mn: "Энэ өрөөнд үнийн санал авах", en: "Get a quote for this room" },
  req: { mn: "Хурлын өрөөний шийдэл хүсэж байна: {name} ({people}). Өрөөний хэмжээ: …", en: "Meeting room solution: {name} ({people}). Room size: …" },
  plan: { mn: "Өрөөний зохион байгуулалт", en: "Room layout" },
  pending: {
    mn: "Багц бүрийн тоног төхөөрөмж, брэндийг инженер батлах; өрөөний зураг — Маркетинг",
    en: "Engineer to confirm each package and brands; room photos — Marketing",
  },
} satisfies Record<string, Text>;

export default function ConferenceRooms({ lang }: { lang: Locale }) {
  const [id, setId] = useState("meeting");
  const room = rooms.find((r) => r.id === id)!;
  const reqText = t(c.req, lang).replace("{name}", t(room.name, lang)).replace("{people}", t(room.people, lang));

  return (
    <section className="container-site py-14 md:py-16">
      <h2 className="text-2xl font-bold md:text-3xl">{t(c.pick, lang)}</h2>
      <div role="tablist" aria-label={t(c.pick, lang)} className="mt-6 grid grid-cols-2 gap-2 sm:inline-grid sm:grid-cols-4">
        {rooms.map((r) => (
          <button
            key={r.id}
            role="tab"
            id={`tab-${r.id}`}
            aria-selected={r.id === id}
            aria-controls="room-panel"
            onClick={() => setId(r.id)}
            className={`rounded-md border px-4 py-3 text-left transition-colors ${
              r.id === id ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-ink"
            }`}
          >
            <span className="block text-lg font-semibold tabular-nums">{t(r.people, lang)}</span>
            <span className={`block text-sm ${r.id === id ? "text-white/80" : "text-steel"}`}>{t(r.name, lang)}</span>
          </button>
        ))}
      </div>

      <div
        id="room-panel"
        role="tabpanel"
        aria-labelledby={`tab-${room.id}`}
        className="mt-8 grid gap-8 rounded-lg border border-line bg-white p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-10"
      >
        <div>
          <h3 className="text-2xl font-bold">{t(room.name, lang)}</h3>
          <p className="mt-2 text-steel">{t(room.lead, lang)}</p>
          <h4 className="mt-8 text-sm font-semibold text-steel">{t(c.inside, lang)}</h4>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {room.kit.map((k) => (
              <li key={k.en} className="py-2.5">
                {t(k, lang)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-steel">{t(c.note, lang)}</p>
          <Link
            href={href(lang, ["contact"]) + `?interest=conference-rooms&request=${encodeURIComponent(reqText)}`}
            className="mt-6 inline-block rounded-md bg-brand px-6 py-3 font-semibold text-white hover:brightness-110"
          >
            {t(c.ask, lang)}
          </Link>
        </div>
        <figure className="self-center">
          <RoomPlan {...room.plan} />
          <figcaption className="mt-2 text-center text-sm text-steel">
            {t(c.plan, lang)}, {t(room.people, lang)}
          </figcaption>
        </figure>
      </div>
      <PendingNote text={c.pending} lang={lang} />
    </section>
  );
}

/* Top-down sketch. The display wall is always at the top so the plans compare at a glance. */
function RoomPlan({ seats, layout }: Room["plan"]) {
  const W = 320,
    H = 220;
  const seat = (x: number, y: number, k: string) => <circle key={k} cx={x} cy={y} r="6" fill="#ffffff" stroke="#5a6776" strokeWidth="1.5" />;
  const items: React.ReactNode[] = [];

  if (layout === "hall") {
    const cols = 12,
      rowsN = Math.ceil(seats / cols);
    for (let r = 0; r < rowsN; r++)
      for (let i = 0; i < cols; i++) {
        const x = 52 + i * 19.6 + (i >= 6 ? 8 : 0);
        items.push(seat(x, 92 + r * 26, `${r}-${i}`));
      }
    items.unshift(<rect key="desk" x="100" y="48" width="120" height="16" rx="3" fill="#d8dee5" />);
  } else {
    const perSide = layout === "table" ? 2 : Math.floor((seats - 2) / 2);
    const tw = layout === "table" ? 90 : Math.min(230, perSide * 22 + 20);
    const th = layout === "table" ? 54 : 58;
    const tx = (W - tw) / 2,
      ty = 92;
    items.push(<rect key="t" x={tx} y={ty} width={tw} height={th} rx={layout === "table" ? 12 : 6} fill="#d8dee5" />);
    for (let i = 0; i < perSide; i++) {
      const x = tx + ((i + 0.5) * tw) / perSide;
      items.push(seat(x, ty - 12, `a${i}`), seat(x, ty + th + 12, `b${i}`));
    }
    items.push(seat(tx + tw + 13, ty + th / 2, "end"));
    if (layout === "table") items.push(seat(tx - 13, ty + th / 2, "end2"));
    else items.push(seat(tx - 13, ty + th / 2, "end2"));
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden="true">
      <rect x="1" y="1" width={W - 2} height={H - 2} rx="10" fill="#f4f6f8" stroke="#d8dee5" />
      {/* display wall */}
      <rect x={W / 2 - (layout === "hall" ? 90 : layout === "table" ? 40 : 60)} y="12" width={layout === "hall" ? 180 : layout === "table" ? 80 : 120} height="8" rx="2" fill="#0077b6" />
      {/* camera */}
      <circle cx={W / 2} cy="28" r="3.5" fill="#17212c" />
      {items}
    </svg>
  );
}
