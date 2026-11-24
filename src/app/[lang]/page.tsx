import Link from "next/link";
import { pages, ui, type Locale, type Text } from "@/content/site";
import { href, t } from "@/lib/i18n";
import { contact, projects } from "@/content/profile";
import { ProjectCard } from "@/components/Profile";

// Minimalist home page: one idea per section, so a first-time visitor understands at a glance
// what GSS does and how to get in touch.
const copy = {
  h1: {
    mn: "Мэргэжлийн дуу, дүрсний систем — төлөвлөлтөөс засвар хүртэл",
    en: "Professional audio-visual systems — from design to service",
  },
  lead: {
    mn: "Студи, тайз, хурлын танхим, дэлгэцийн системийг бид сонгож, нийлүүлж, суурилуулдаг.",
    en: "We specify, supply and install systems for studios, stages, meeting rooms and displays.",
  },
  solutionsH: { mn: "Шийдлүүд", en: "Solutions" },
  more: { mn: "Дэлгэрэнгүй", en: "Learn more" },
  brandsH: { mn: "Хамтран ажилладаг брэндүүд", en: "Brands we work with" },
  contactH: { mn: "Төслөө ярилцъя", en: "Let's talk about your project" },
  contactLead: {
    mn: "Хэрэгцээгээ хэлээрэй — манай инженер ажлын 1 өдөрт холбогдоно.",
    en: "Tell us what you need — an engineer will contact you within one working day.",
  },
  projectsH: { mn: "Сүүлийн төслүүд", en: "Recent projects" },
  projectsLead: {
    mn: "2013 оноос хойш телевиз, музей, их сургууль, төрийн байгууллагад систем суурилуулсан.",
    en: "Since 2013 we have installed systems for broadcasters, museums, universities and government.",
  },
  allProjects: { mn: "Бүх төсөл", en: "All projects" },
  phoneL: { mn: "Утас", en: "Phone" },
  addressL: { mn: "Хаяг", en: "Address" },
  address: {
    mn: "Баянгол дүүрэг, Энхтайвны өргөн чөлөө, UB Platinum, 5 давхар, Улаанбаатар",
    en: "5th floor, UB Platinum, Peace Avenue, Bayangol district, Ulaanbaatar",
  },
} satisfies Record<string, Text>;

// Text wordmarks until the brand logo files arrive from Marketing.
const brands = ["Sennheiser", "Blackmagic Design", "Ross Video", "Panasonic", "ARRI", "TOA", "Taiden", "Mackie"];

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const solutions = pages.find((p) => p.slug === "solutions")!;

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-white">
        <div className="container-site py-20 md:py-28">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink md:text-5xl">{t(copy.h1, lang)}</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">{t(copy.lead, lang)}</p>
          <Link
            href={href(lang, ["contact"])}
            className="mt-10 inline-block rounded-md bg-brand px-7 py-3.5 font-semibold text-white hover:brightness-110"
          >
            {t(ui.quote, lang)}
          </Link>
        </div>
      </section>

      {/* 2. Solutions */}
      <section className="border-t border-line bg-paper">
        <div className="container-site py-16 md:py-20">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{t(copy.solutionsH, lang)}</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {solutions.children!.map((g) => (
              <li key={g.slug}>
                <Link
                  href={href(lang, ["solutions", g.slug])}
                  className="group flex h-full flex-col rounded-lg border border-line bg-white p-7 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(23,33,44,0.35)]"
                >
                  <span className="h-1 w-10 rounded-full bg-brand" aria-hidden="true" />
                  <span className="mt-5 text-xl font-bold text-ink group-hover:text-brand">{t(g.title, lang)}</span>
                  <span className="mt-2 flex-1 text-steel">{t(g.summary, lang)}</span>
                  <span className="mt-6 text-sm font-semibold text-brand">{t(copy.more, lang)} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Recent projects */}
      <section className="border-t border-line bg-white">
        <div className="container-site py-16 md:py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold text-ink md:text-3xl">{t(copy.projectsH, lang)}</h2>
            <Link href={href(lang, ["projects"])} className="font-semibold text-brand hover:underline">
              {t(copy.allProjects, lang)} ({projects.length})
            </Link>
          </div>
          <p className="mt-3 max-w-2xl text-steel">{t(copy.projectsLead, lang)}</p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[25, 22, 15].map((id) => (
              <ProjectCard key={id} id={id} />
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Brands */}
      <section className="border-t border-line bg-white">
        <div className="container-site py-14">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-steel">{t(copy.brandsH, lang)}</h2>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.map((b) => (
              <li key={b} className="text-xl font-bold text-ink/45">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Contact */}
      <section className="border-t border-line bg-paper">
        <div className="container-site grid gap-10 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="text-2xl font-bold text-ink md:text-3xl">{t(copy.contactH, lang)}</h2>
            <p className="mt-4 max-w-md text-steel">{t(copy.contactLead, lang)}</p>
            <Link
              href={href(lang, ["contact"])}
              className="mt-8 inline-block rounded-md bg-brand px-7 py-3.5 font-semibold text-white hover:brightness-110"
            >
              {t(ui.quote, lang)}
            </Link>
          </div>
          <dl className="space-y-6 md:pt-2">
            <div>
              <dt className="text-sm text-steel">{t(copy.phoneL, lang)}</dt>
              {contact.phones.map((p) => (
                <dd key={p.tel} className="mt-1 text-lg font-semibold text-ink">
                  <a href={`tel:${p.tel}`} className="hover:text-brand">
                    {p.text}
                  </a>
                </dd>
              ))}
            </div>
            <div>
              <dt className="text-sm text-steel">Email</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                <a href={`mailto:${contact.email}`} className="hover:text-brand">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-steel">{t(copy.addressL, lang)}</dt>
              <dd className="mt-1 text-lg text-ink">{t(copy.address, lang)}</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
