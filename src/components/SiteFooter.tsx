import Link from "next/link";
import { company, pages, ui, type Locale } from "@/content/site";
import { href, t } from "@/lib/i18n";
import Logo from "@/components/Logo";

const L = {
  tagline: {
    mn: "Мэргэжлийн дуу, дүрс, өргөн нэвтрүүлгийн системийн нийлүүлэгч ба интегратор.",
    en: "Supplier and integrator of professional audio, video and broadcast systems.",
  },
  contact: { mn: "Холбоо барих", en: "Contact" },
  pendingContact: {
    mn: "Хаяг, утас, сошиал хаягийг баталгаажуулж байна.",
    en: "Address, phone and social links are being confirmed.",
  },
  group: { mn: "Global Group-ийн компани", en: "A Global Group company" },
};

export default function SiteFooter({ lang }: { lang: Locale }) {
  const solutions = pages.find((p) => p.slug === "solutions");
  const company_ = pages.filter((p) => ["partners", "projects", "about", "news"].includes(p.slug));

  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="signal-bars h-1" aria-hidden="true" />
      <div className="container-site grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo className="h-12 w-auto text-white" />
          <p className="mt-3 max-w-xs text-sm">{t(L.tagline, lang)}</p>
          <p className="mt-6 text-sm">
            <a href={company.group} className="underline decoration-white/30 underline-offset-4 hover:text-white" target="_blank" rel="noopener">
              {t(L.group, lang)}
            </a>
          </p>
        </div>

        <nav className="md:col-span-3" aria-label={t(solutions!.title, lang)}>
          <p className="font-display text-sm font-semibold text-white">{t(solutions!.title, lang)}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {solutions!.children!.map((g) => (
              <li key={g.slug}>
                <Link href={href(lang, ["solutions", g.slug])} className="hover:text-white">
                  {t(g.title, lang)}
                </Link>
              </li>
            ))}
            <li>
              <a href={company.store} target="_blank" rel="noopener" className="hover:text-white">
                {t(ui.store, lang)}
              </a>
            </li>
          </ul>
        </nav>

        <nav className="md:col-span-2" aria-label="Company">
          <p className="font-display text-sm font-semibold text-white">{company.short}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {company_.map((p) => (
              <li key={p.slug}>
                <Link href={href(lang, [p.slug])} className="hover:text-white">
                  {t(p.title, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="font-display text-sm font-semibold text-white">{t(L.contact, lang)}</p>
          <p className="mt-2 text-sm text-white/60">{t(L.pendingContact, lang)}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site py-5 text-xs text-white/50">
          © {new Date().getFullYear()} {company.name}
        </div>
      </div>
    </footer>
  );
}
