"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/site";
import { history } from "@/content/profile";

const L = {
  title: { mn: "Бидний түүх", en: "Our history" },
  lead: {
    mn: "1991 онд Монголын анхны IT компаниудын нэг болж эхэлсэн замаас GSS-ийн 10 жил хүртэл.",
    en: "From one of Mongolia's first IT companies in 1991 to ten years of GSS.",
  },
  group: { mn: "Группийн түүх", en: "The group" },
  gss: { mn: "GSS, 2015 оноос", en: "GSS, since 2015" },
  prev: { mn: "Өмнөх он", en: "Previous year" },
  next: { mn: "Дараагийн он", en: "Next year" },
};

const N = history.length;
const GAP = 24;
/** Page scroll per card in the desktop scroll-driven mode, as a share of the viewport height. */
const STEP_VH = 0.2;

/**
 * Horizontal history carousel. On wide screens with motion allowed, scrolling the page
 * swipes the cards sideways (the section pins while it plays). On phones, or when the
 * visitor prefers reduced motion, it is an ordinary swipeable row with snap points.
 */
export default function HistoryCarousel({ lang }: { lang: Locale }) {
  const outer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [pos, setPos] = useState(0); // fractional card index
  const [size, setSize] = useState({ col: 300, view: 0 });

  const active = Math.min(N - 1, Math.max(0, Math.round(pos)));

  // Decide the mode and measure, after mount and on resize.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      setPinned(mq.matches);
      const first = track.current?.querySelector("li");
      setSize({ col: first?.getBoundingClientRect().width ?? 300, view: outer.current?.clientWidth ?? window.innerWidth });
    };
    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Desktop: page scroll drives the position.
  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = outer.current!.getBoundingClientRect();
        const range = r.height - window.innerHeight;
        const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
        setPos(p * (N - 1));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pinned]);

  // Phones / reduced motion: the row's own horizontal scroll drives the position.
  const onRowScroll = useCallback(() => {
    if (pinned || !viewport.current) return;
    setPos(viewport.current.scrollLeft / (size.col + GAP));
  }, [pinned, size.col]);

  const goTo = (i: number) => {
    const target = Math.min(N - 1, Math.max(0, i));
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? "smooth" : "auto";
    if (pinned && outer.current) {
      const r = outer.current.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      window.scrollTo({ top: window.scrollY + r.top + (range * target) / (N - 1), behavior: smooth });
    } else {
      viewport.current?.scrollTo({ left: target * (size.col + GAP), behavior: smooth });
    }
  };

  const side = Math.max(0, (size.view - size.col) / 2);
  const shift = side - pos * (size.col + GAP);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={L.title[lang]}
      className="border-y border-line bg-[#e9f3fa]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goTo(active + 1);
        if (e.key === "ArrowLeft") goTo(active - 1);
      }}
    >
      <div
        ref={outer}
        style={pinned ? { height: `calc(100vh + ${(N - 1) * STEP_VH * 100}vh)` } : undefined}
      >
        <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16" : "py-14"}>
          <div className="container-site text-center">
            <h2 className="text-4xl font-bold uppercase tracking-tight text-ink md:text-5xl">{L.title[lang]}</h2>
            <p className="mx-auto mt-3 max-w-xl text-steel">{L.lead[lang]}</p>
            <p className="mt-4 flex items-center justify-center gap-6 text-sm text-steel">
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-6 bg-steel/60" aria-hidden="true" />
                {L.group[lang]}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-6 bg-brand" aria-hidden="true" />
                {L.gss[lang]}
              </span>
            </p>
          </div>

          <div
            ref={viewport}
            onScroll={onRowScroll}
            className={`mt-10 ${pinned ? "overflow-hidden" : "snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"}`}
            style={pinned ? undefined : { paddingInline: side, scrollPaddingInline: side }}
          >
            <ol
              ref={track}
              lang="en"
              className="flex w-max"
              style={{
                gap: GAP,
                transform: pinned ? `translate3d(${shift}px,0,0)` : undefined,
                transition: pinned ? "transform 120ms linear" : undefined,
              }}
            >
              {history.map((m, i) => {
                const on = i === active;
                const dist = Math.min(1, Math.abs(i - pos));
                return (
                  <li
                    key={m.year}
                    aria-current={on ? "step" : undefined}
                    className="relative w-[78vw] shrink-0 snap-center sm:w-[300px]"
                  >
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      className={`block w-full text-center text-lg transition-colors ${on ? "font-bold text-ink" : "text-steel"}`}
                    >
                      {m.year}
                    </button>
                    {/* the rail: a dashed line per column, blue from GSS's founding on */}
                    <div className="relative mt-3 h-4">
                      <span
                        className={`absolute top-1/2 h-0 border-t-2 border-dashed ${m.era === "gss" ? "border-brand/60" : "border-steel/35"}`}
                        style={{ left: i === 0 ? "50%" : -GAP / 2, right: i === N - 1 ? "50%" : -GAP / 2 }}
                        aria-hidden="true"
                      />
                      <span
                        className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 transition-all duration-300 ${
                          on ? "scale-110 border-white bg-ink shadow-[0_0_0_2px_var(--color-ink)]" : "border-white bg-steel/40"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className={`mt-4 rounded-2xl p-1.5 transition-all duration-500 ${
                        on ? "bg-ink text-white shadow-[0_18px_40px_-20px_rgba(23,33,44,0.7)]" : "bg-white/60 text-ink"
                      }`}
                      style={{ opacity: 1 - dist * 0.45, transform: `scale(${1 - dist * 0.06})` }}
                    >
                      <h3 className="px-4 py-3.5 text-center text-lg font-bold">{m.title}</h3>
                      <ul
                        className={`divide-y divide-dashed rounded-xl px-4 text-center text-sm ${
                          on ? "divide-ink/20 bg-white text-ink" : "divide-steel/25 bg-white/50 text-ink/70"
                        }`}
                      >
                        {m.items.map((it) => (
                          <li key={it.slice(0, 20)} className="py-3">
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="container-site mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label={L.prev[lang]}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 bg-white text-ink transition hover:border-ink disabled:opacity-35"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="min-w-20 text-center text-sm tabular-nums text-steel" aria-live="polite">
              {active + 1} / {N}
            </span>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === N - 1}
              aria-label={L.next[lang]}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 bg-white text-ink transition hover:border-ink disabled:opacity-35"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
