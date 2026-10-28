"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { company, pages, ui, type Locale } from "@/content/site";
import { href, otherLocale, t } from "@/lib/i18n";
import Logo from "@/components/Logo";

export default function SiteHeader({ lang }: { lang: Locale }) {
  const pathname = usePathname() || `/${lang}/`;
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLLIElement>(null);

  const switchHref = pathname.replace(/^\/(mn|en)(?=\/|$)/, `/${otherLocale(lang)}`);
  const NAV_ORDER = ["solutions", "projects", "about", "partners"];
  const nav = NAV_ORDER.map((slug) => pages.find((p) => p.slug === slug && p.inNav)).filter((p): p is NonNullable<typeof p> => Boolean(p));
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
      <div className="mx-auto flex h-[72px] w-full max-w-[90rem] items-center gap-6 px-4 lg:px-6">
        <Link href={href(lang)} className="flex items-center shrink-0" aria-label={`${company.short} — ${t(ui.home, lang)}`}>
          <Logo className="h-10 w-auto text-brand" />
        </Link>

        <nav className="ml-auto hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((p) =>
              p.slug === "solutions" && solutions ? (
                <li key={p.slug} className="relative" ref={solutionsRef}>
                  <button
                    type="button"
                    className={`whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-brand ${isActive(p.slug) ? "text-brand" : ""}`}
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
                      className="absolute left-0 top-full mt-2 w-60 rounded-md border border-line bg-white py-2 shadow-[0_12px_32px_-12px_rgba(23,33,44,0.25)]"
                    >
                      <ul>
                        {solutions.children?.map((group) => (
                          <li key={group.slug}>
                            <Link
                              href={href(lang, ["solutions", group.slug])}
                              className="block px-4 py-2.5 text-sm hover:bg-paper hover:text-brand"
                            >
                              {t(group.title, lang)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={p.slug}>
                  <Link
                    href={href(lang, [p.slug])}
                    className={`whitespace-nowrap px-3 py-2 text-sm font-medium hover:text-brand ${isActive(p.slug) ? "text-brand" : ""}`}
                    aria-current={isActive(p.slug) ? "page" : undefined}
                  >
                    {t(p.title, lang)}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden lg:flex items-center gap-4 whitespace-nowrap border-l border-line pl-5 text-sm">
          <Link href={switchHref} className="text-steel hover:text-ink" hrefLang={otherLocale(lang)}>
            {t(ui.language, lang)}
          </Link>
          <a
            href={company.store}
            target="_blank"
            rel="noopener"
            title={t(ui.store, lang)}
            aria-label={t(ui.store, lang)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink hover:border-brand hover:text-brand"
          >
            <StoreIcon className="h-5 w-5" />
          </a>
          <Link
            href={href(lang, ["contact"])}
            className="rounded-md bg-brand px-4 py-2 font-medium text-white hover:brightness-110"
          >
            {t(ui.quote, lang)}
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto lg:hidden rounded-sm border border-line px-3 py-2 text-sm"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t(ui.close, lang) : t(ui.menu, lang)}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-line bg-white">
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
              <Link href={switchHref} className="text-steel" hrefLang={otherLocale(lang)}>
                {t(ui.language, lang)}
              </Link>
              <a href={company.store} target="_blank" rel="noopener" className="flex items-center gap-2 text-ink">
                <StoreIcon className="h-5 w-5" /> {t(ui.store, lang)}
              </a>
              <Link href={href(lang, ["contact"])} className="w-full rounded-md bg-brand px-4 py-3 text-center font-medium text-white">
                {t(ui.quote, lang)}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" />
      <circle cx="10" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}
