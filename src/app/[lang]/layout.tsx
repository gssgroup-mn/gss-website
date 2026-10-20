import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { locales, ui, type Locale } from "@/content/site";
import { basePath, isLocale, t } from "@/lib/i18n";

const isStaging = process.env.NEXT_PUBLIC_STAGING === "1";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const mn = lang === "mn";
  return {
    title: { default: "GSS — Globalsmart Solution", template: "%s | GSS" },
    description: mn
      ? "Мэргэжлийн дуу, дүрс, өргөн нэвтрүүлэг, хурлын танхимын системийг нийлүүлж, суурилуулдаг."
      : "Supplier and integrator of professional audio, video, broadcast and meeting-room systems.",
    icons: { icon: `${basePath}/favicon.svg` },
    robots: isStaging ? { index: false, follow: false } : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;

  return (
    <html lang={l}>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2">
          {l === "mn" ? "Агуулга руу шилжих" : "Skip to content"}
        </a>
        {isStaging && (
          <div className="bg-ink-2 text-white/80 text-xs">
            <div className="container-site py-1.5">{t(ui.draft, l)}</div>
          </div>
        )}
        <SiteHeader lang={l} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter lang={l} />
      </body>
    </html>
  );
}
