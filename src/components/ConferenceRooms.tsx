"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Locale, Text } from "@/content/site";
import { href, t } from "@/lib/i18n";
import PendingNote from "@/components/PendingNote";
import { layoutFor, type Layout, type RoomKind } from "@/components/conferenceLayout";

const ConferenceScene3D = dynamic(() => import("@/components/three/ConferenceScene3D"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm text-steel">…</div>,
});

type View = "2d" | "3d" | "plan";

type Room = {
  id: RoomKind;
  people: Text;
  name: Text;
  lead: Text;
  kit: Text[];
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
  v2d: { mn: "2D", en: "2D" },
  v3d: { mn: "3D", en: "3D" },
  vPlan: { mn: "План", en: "Plan" },
  views: { mn: "Харагдац", en: "View" },
  drag: { mn: "Чирж эргүүлнэ, томруулна.", en: "Drag to rotate, scroll or pinch to zoom." },
  wall: { mn: "Дэлгэцтэй хана, урдаас", en: "Display wall, front view" },
  above: { mn: "Дээрээс", en: "From above" },
  room: { mn: "Өрөө", en: "Room" },
  seatsN: { mn: "суудал", en: "seats" },
  m: { mn: "м", en: "m" },
  camera: { mn: "Камер", en: "Camera" },
  pending: {
    mn: "Багц бүрийн тоног төхөөрөмж, брэндийг инженер батлах; өрөөний зураг — Маркетинг",
    en: "Engineer to confirm each package and brands; room photos — Marketing",
  },
} satisfies Record<string, Text>;

export default function ConferenceRooms({ lang }: { lang: Locale }) {
  const [id, setId] = useState<RoomKind>("meeting");
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
        className="mt-8 grid gap-8 rounded-lg border border-line bg-white p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:p-10"
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
        <RoomViews lang={lang} kind={room.id} people={t(room.people, lang)} />
      </div>
      <PendingNote text={c.pending} lang={lang} />
    </section>
  );
}

function RoomViews({ lang, kind, people }: { lang: Locale; kind: RoomKind; people: string }) {
  const [view, setView] = useState<View>("3d");
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    try {
      const cv = document.createElement("canvas");
      const ok = !!(cv.getContext("webgl2") || cv.getContext("webgl"));
      setWebgl(ok);
      if (!ok) setView("plan");
    } catch {
      setWebgl(false);
      setView("plan");
    }
  }, []);
  const L = layoutFor(kind);
  const seg = (active: boolean) =>
    `px-4 py-1.5 text-sm font-medium rounded-[5px] transition-colors disabled:opacity-40 ${
      active ? "bg-white text-ink shadow-[0_1px_2px_rgba(23,33,44,0.18)]" : "text-steel hover:text-ink"
    }`;
  return (
    <figure className="min-w-0 self-start overflow-hidden rounded-lg border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper px-3 py-2">
        <div className="inline-flex rounded-md bg-line/60 p-1" role="tablist" aria-label={t(c.views, lang)}>
          {([["2d", c.v2d], ["3d", c.v3d], ["plan", c.vPlan]] as [View, Text][]).map(([v, label]) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} disabled={v === "3d" && !webgl} onClick={() => setView(v)} className={seg(view === v)}>
              {t(label, lang)}
            </button>
          ))}
        </div>
        <span className="text-sm text-steel tabular-nums">
          {L.roomW} × {L.roomD} {t(c.m, lang)}
        </span>
      </div>
      {view === "3d" && (
        <div className="relative aspect-[4/3] w-full bg-paper">
          <ConferenceScene3D layout={L} />
          <p className="pointer-events-none absolute bottom-2 left-3 rounded-sm bg-white/80 px-1.5 py-0.5 text-xs text-steel">{t(c.drag, lang)}</p>
        </div>
      )}
      {view === "2d" && <FrontWall L={L} lang={lang} />}
      {view === "plan" && <PlanView L={L} lang={lang} />}
      <figcaption className="border-t border-line px-4 py-2.5 text-sm text-steel">
        {t(view === "2d" ? c.wall : view === "plan" ? c.above : c.plan, lang)}, {people}, {L.seats.length} {t(c.seatsN, lang)}
      </figcaption>
    </figure>
  );
}

/* Display wall seen from the room: screens, camera and the display height from the floor. */
function FrontWall({ L, lang }: { L: Layout; lang: Locale }) {
  const H = 3;
  const W = 640;
  const s = Math.min((W - 80) / L.roomW, 300 / H);
  const VH = H * s + 50;
  const x0 = (W - L.roomW * s) / 2;
  const y = (m: number) => 24 + (H - m) * s; // metres above floor -> svg y
  const topM = L.displayBottom + Math.max(...L.displays.map((d) => d.h));
  return (
    <svg viewBox={`0 0 ${W} ${VH}`} className="block h-auto w-full bg-white" role="img" aria-label={t(c.wall, lang)}>
      <rect x={x0} y={y(H)} width={L.roomW * s} height={H * s} fill="#f4f6f8" stroke="#d8dee5" />
      <line x1={x0 - 10} x2={x0 + L.roomW * s + 10} y1={y(0)} y2={y(0)} stroke="#9aa5b1" strokeWidth="2" />
      {L.displays.map((d, i) => {
        const dx = x0 + (L.roomW / 2 + d.x - d.w / 2) * s;
        return (
          <g key={i}>
            <rect x={dx} y={y(L.displayBottom + d.h)} width={d.w * s} height={d.h * s} fill="#17212c" rx="2" />
            <rect x={dx + 3} y={y(L.displayBottom + d.h) + 3} width={d.w * s - 6} height={d.h * s - 6} fill="#2b3b4d" />
          </g>
        );
      })}
      <rect x={W / 2 - 14} y={y(L.displayBottom - 0.06)} width="28" height="7" rx="2" fill="#0077b6" />
      <text x={W / 2 + 22} y={y(L.displayBottom - 0.06) + 7} fontSize="11" fill="#0077b6">
        {t(c.camera, lang)}
      </text>
      <text x={W / 2} y={y(topM) - 8} fontSize="12" textAnchor="middle" fill="#17212c">
        {L.displayLabel}
        {L.desk ? ` ${t(c.m, lang)}` : ""}
      </text>
      {/* display height from the floor */}
      <line x1={x0 + L.roomW * s - 24} x2={x0 + L.roomW * s - 24} y1={y(0)} y2={y(L.displayBottom)} stroke="#5a6776" strokeDasharray="3 3" />
      <text x={x0 + L.roomW * s - 30} y={(y(0) + y(L.displayBottom)) / 2 + 4} fontSize="11" textAnchor="end" fill="#5a6776">
        {L.displayBottom} {t(c.m, lang)}
      </text>
      {/* a seated person, eyes at about 1.2 m, for scale */}
      <g fill="#9aa5b1">
        <circle cx={x0 + 0.5 * s} cy={y(1.2)} r={0.11 * s} />
        <rect x={x0 + 0.3 * s} y={y(1.07)} width={0.4 * s} height={0.6 * s} rx={0.08 * s} />
        <rect x={x0 + 0.26 * s} y={y(0.47)} width={0.48 * s} height={0.06 * s} />
        <rect x={x0 + 0.48 * s} y={y(0.41)} width={0.04 * s} height={0.41 * s} />
        <rect x={x0 + 0.3 * s} y={y(0.02)} width={0.4 * s} height={0.02 * s} />
      </g>
    </svg>
  );
}

/* From above, to scale, display wall at the top. */
function PlanView({ L, lang }: { L: Layout; lang: Locale }) {
  const W = 640;
  const s = Math.min((W - 80) / L.roomW, 380 / L.roomD);
  const H = L.roomD * s + 60;
  const x0 = (W - L.roomW * s) / 2;
  const y0 = 30;
  const X = (m: number) => x0 + (m + L.roomW / 2) * s;
  const Z = (m: number) => y0 + m * s;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full bg-white" role="img" aria-label={t(c.above, lang)}>
      <rect x={x0} y={y0} width={L.roomW * s} height={L.roomD * s} fill="#f4f6f8" stroke="#9aa5b1" strokeWidth="2" />
      {L.displays.map((d, i) => (
        <rect key={i} x={X(d.x - d.w / 2)} y={y0 + 2} width={d.w * s} height={Math.max(4, 0.08 * s)} fill="#0077b6" />
      ))}
      <circle cx={X(0)} cy={y0 + Math.max(10, 0.2 * s)} r="3.5" fill="#17212c" />
      {L.table && <rect x={X(L.table.x - L.table.w / 2)} y={Z(L.table.z - L.table.d / 2)} width={L.table.w * s} height={L.table.d * s} rx="6" fill="#d8c8ae" />}
      {L.desk && <rect x={X(L.desk.x - L.desk.w / 2)} y={Z(L.desk.z - L.desk.d / 2)} width={L.desk.w * s} height={L.desk.d * s} rx="3" fill="#d8c8ae" />}
      {L.seats.map((p, i) => (
        <circle key={i} cx={X(p.x)} cy={Z(p.z)} r={Math.max(4, 0.22 * s)} fill="#ffffff" stroke="#5a6776" strokeWidth="1.5" />
      ))}
      <text x={W / 2} y={H - 12} fontSize="12" textAnchor="middle" fill="#5a6776">
        {t(c.room, lang)} {L.roomW} × {L.roomD} {t(c.m, lang)}
      </text>
    </svg>
  );
}
