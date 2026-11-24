"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/content/site";
import { categoryLabel, projectImage, projects, type SolutionKey } from "@/content/profile";
import { basePath } from "@/lib/i18n";

const L = {
  all: { mn: "Бүгд", en: "All" },
  year: { mn: "Он", en: "Year" },
  anyYear: { mn: "Бүх он", en: "All years" },
  count: { mn: "төсөл", en: "projects" },
  none: { mn: "Энэ шүүлтүүрт төсөл алга. Өөр ангилал эсвэл он сонгоно уу.", en: "No projects match. Pick another category or year." },
  customerPending: { mn: "Захиалагч тодорхойлогдоно", en: "Customer to be confirmed" },
};

const order: SolutionKey[] = ["broadcast", "audio", "display", "lighting", "conference"];

export default function ProjectsBrowser({ lang }: { lang: Locale }) {
  const [cat, setCat] = useState<SolutionKey | "all">("all");
  const [year, setYear] = useState<number | "all">("all");

  // Solution pages link here with #<category> to open the matching filter.
  useEffect(() => {
    const h = window.location.hash.slice(1) as SolutionKey;
    if (order.includes(h)) setCat(h);
  }, []);

  const years = useMemo(() => [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a), []);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);
  const shown = projects
    .filter((p) => (cat === "all" || p.category === cat) && (year === "all" || p.year === year))
    .sort((a, b) => b.year - a.year || a.id - b.id);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={chip(cat === "all")} aria-pressed={cat === "all"} onClick={() => setCat("all")}>
          {L.all[lang]} ({projects.length})
        </button>
        {order
          .filter((k) => counts[k])
          .map((k) => (
            <button key={k} type="button" className={chip(cat === k)} aria-pressed={cat === k} onClick={() => setCat(k)}>
              {categoryLabel[k]} ({counts[k]})
            </button>
          ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-steel">
          {L.year[lang]}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-ink"
          >
            <option value="all">{L.anyYear[lang]}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-steel" aria-live="polite">
        {shown.length} {L.count[lang]}
      </p>

      {shown.length === 0 ? (
        <p className="mt-6 rounded-lg border border-line bg-white p-8 text-steel">{L.none[lang]}</p>
      ) : (
        <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" lang="en">
          {shown.map((p) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-lg border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={basePath + projectImage(p.id)}
                alt={`${p.name} — ${p.customer ?? ""}`}
                width={644}
                height={348}
                loading="lazy"
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm text-steel">
                  {p.year}, {p.place}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink">{p.customer ?? L.customerPending[lang]}</h3>
                <p className="mt-1 text-steel">{p.name}</p>
                <p className="mt-auto pt-4 text-sm text-ink/70">{p.brands.join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
