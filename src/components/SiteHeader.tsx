"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company, pages, ui, type Locale } from "@/content/site";
import { href, otherLocale, t } from "@/lib/i18n";

export default function SiteHeader({ lang }: { lang: Locale }) {
  const pathname = usePathname() || `/${lang}/`;
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLLIElement>(null);

  const switchHref = pathname.replace(/^\/(mn|en)(?=\/|$)/, `/${otherLocale(lang)}`);
  const nav = pages.filter((p) => p.inNav);
  const solutions = pages.find((p) => p.slug === "solutions");

  useEffect(() => {
    setOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSolutionsOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) setSolutionsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const isActive = (slug: string) => pathname.startsWith(`/${lang}/${slug}`);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="signal-bars h-1" aria-hidden="true" />
      <div className="container-site flex h-16 items-center gap-6">
        <Link href={href(lang)} className="flex items-baseline gap-2 shrink-0" aria-label={`${company.short} — ${t(ui.home, lang)}`}>
          <span className="font-display text-2xl font-[650] tracking-tight">GSS</span>
          <span className="hidden sm:inline text-xs text-steel">Globalsmart Solution</span>
        </Link>

        <nav className="hidden xl:block flex-1" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((p) =>
              p.slug === "solutions" && solutions ? (
                <li key={p.slug} className="relative" ref={solutionsRef}>
                  <button
                    type="button"
                    className={`whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-tally ${isActive(p.slug) ? "text-tally" : ""}`}
                    aria-expanded={solutionsOpen}
                    aria-controls="solutions-menu"
                    onClick={() => setSolutionsOpen((v) => !v)}
                  >
                    {t(p.title, lang)}
                    <span aria-hidden="true" className="ml-1 inline-block text-steel">▾</span>
                  </button>
                  {solutionsOpen && (
                    <div
                      id="solutions-menu"
                      className="absolute left-0 top-full mt-2 w-[44rem] rounded-md border border-line bg-white p-6 shadow-[0_12px_32px_-12px_rgba(23,33,44,0.25)]"
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {solutions.children?.map((group) => (
                          <div key={group.slug}>
                            <Link
                              href={href(lang, ["solutions", group.slug])}
                              className="font-display text-base font-semibold hover:text-tally"
                            >
                              {t(group.title, lang)}
                            </Link>
                            <ul className="mt-3 space-y-2 border-l border-line pl-3">
                              {group.children?.map((c) => (
                                <li key={c.slug}>
                                  <Link
                                    href={href(lang, ["solutions", group.slug, c.slug])}
                                    className="text-sm text-steel hover:text-ink"
                                  >
                                    {t(c.title, lang)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={p.slug}>
                  <Link
                    href={href(lang, [p.slug])}
                    className={`whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-tally ${isActive(p.slug) ? "text-tally" : ""}`}
                    aria-current={isActive(p.slug) ? "page" : undefined}
                  >
                    {t(p.title, lang)}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="ml-auto hidden xl:flex items-center gap-4 whitespace-nowrap text-sm">
          <a href={company.store} className="text-steel hover:text-ink" target="_blank" rel="noopener">
            {t(ui.store, lang)}
          </a>
          <Link href={href(lang, ["support"])} className="text-steel hover:text-ink">
            {t(ui.support, lang)}
          </Link>
          <Link href={switchHref} className="text-steel hover:text-ink" hrefLang={otherLocale(lang)}>
            {t(ui.language, lang)}
          </Link>
          <Link
            href={href(lang, ["contact"])}
            className="rounded-sm bg-tally px-4 py-2 font-medium text-white hover:bg-tally-dark"
          >
            {t(ui.quote, lang)}
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto xl:hidden rounded-sm border border-line px-3 py-2 text-sm"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t(ui.close, lang) : t(ui.menu, lang)}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="xl:hidden border-t border-line bg-white">
          <nav className="container-site py-4" aria-label="Mobile">
            <ul className="space-y-1">
              {nav.map((p) => (
                <li key={p.slug}>
                  <Link href={href(lang, [p.slug])} className="block py-2 font-display text-lg">
                    {t(p.title, lang)}
                  </Link>
                  {p.slug === "solutions" && (
                    <ul className="mb-2 ml-3 border-l border-line pl-3">
                      {p.children?.map((g) => (
                        <li key={g.slug}>
                          <Link href={href(lang, ["solutions", g.slug])} className="block py-1.5 text-steel">
                            {t(g.title, lang)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4 text-sm">
              <a href={company.store} target="_blank" rel="noopener" className="text-steel">
                {t(ui.store, lang)}
              </a>
              <Link href={href(lang, ["support"])} className="text-steel">
                {t(ui.support, lang)}
              </Link>
              <Link href={switchHref} className="text-steel" hrefLang={otherLocale(lang)}>
                {t(ui.language, lang)}
              </Link>
              <Link href={href(lang, ["contact"])} className="w-full rounded-sm bg-tally px-4 py-3 text-center font-medium text-white">
                {t(ui.quote, lang)}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
