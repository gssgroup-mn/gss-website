import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import { company, pages, ui, type Locale, type Text } from "@/content/site";
import { href, t } from "@/lib/i18n";

const isStaging = process.env.NEXT_PUBLIC_STAGING === "1";

const copy = {
  h1: {
    mn: "Дуу, дүрсний системийг төлөвлөлтөөс засвар үйлчилгээ хүртэл",
    en: "Audio-visual systems, from design to after-sales service",
  },
  lead: {
    mn: "Өргөн нэвтрүүлгийн студи, тайз, хурлын танхим, том дэлгэцийн системийг бид сонгож, нийлүүлж, суурилуулдаг.",
    en: "We specify, supply and install systems for broadcast studios, stages, meeting rooms and large displays.",
  },
  seeSolutions: { mn: "Шийдлүүдийг үзэх", en: "See solutions" },
  featured: { mn: "Онцлох систем", en: "Featured systems" },
  aboutH: { mn: "GSS гэж хэн бэ", en: "Who we are" },
  about: {
    mn: `${company.founded} онд байгуулагдсан Globalsmart Solution нь Global Group-ийн мэргэжлийн дуу, дүрсийн чиглэлийн компани. Бид төхөөрөмж нийлүүлэхээс гадна системийн зураг төсөл, суурилуулалт, сургалт, засвар үйлчилгээг хариуцдаг.`,
    en: `Founded in ${company.founded}, Globalsmart Solution is the professional audio-visual company of Global Group. Beyond supplying equipment, we design, install, train and service complete systems.`,
  },
  aboutLink: { mn: "Бидний тухай", en: "About us" },
  showroom: { mn: "Шоурүмд туршиж үзэх", en: "Visit the showroom" },
  projectsH: { mn: "Хэрэгжүүлсэн төслүүд", en: "Recent projects" },
  projectSlot: { mn: "Төслийн зураг, тайлбар", en: "Project photo and story" },
  whyH: { mn: "Яагаад GSS", en: "Why GSS" },
  partnersH: { mn: "Түнш брэндүүд", en: "Partner brands" },
  newsH: { mn: "Сүүлийн мэдээ", en: "Latest news" },
  contactH: { mn: "Хэрэгцээгээ бичээд үлдээгээрэй", en: "Tell us what you need" },
  contactLead: {
    mn: "Манай борлуулалтын инженер ажлын 1 өдрийн дотор холбогдож, танд тохирох шийдэл, үнийн санал гаргана.",
    en: "A sales engineer will contact you within one working day with a recommendation and a quote.",
  },
  all: { mn: "Бүгдийг үзэх", en: "View all" },
} satisfies Record<string, Text>;

// "Why GSS" points describe services that exist in the sitemap (support, showroom, demo).
// Wording to be approved by the CEO.
const why: { h: Text; p: Text }[] = [
  {
    h: { mn: "Нэг хариуцагч", en: "One accountable partner" },
    p: {
      mn: "Зураг төсөл, нийлүүлэлт, суурилуулалт, засвар үйлчилгээг нэг баг хариуцна.",
      en: "Design, supply, installation and service handled by one team.",
    },
  },
  {
    h: { mn: "Худалдан авахаас өмнө туршина", en: "Try before you buy" },
    p: {
      mn: "Шоурүмд эсвэл таны байранд демо хийж, систем ажиллахыг харуулна.",
      en: "Demos in our showroom or at your site show the system working first.",
    },
  },
  {
    h: { mn: "Суурилуулсны дараа ч хамт", en: "Support after installation" },
    p: {
      mn: "Засварын хүсэлт, инженерийн зөвлөгөөг вэбээс шууд илгээнэ.",
      en: "Send service tickets and engineering questions straight from the website.",
    },
  },
];

function Pending({ text, lang }: { text: Text; lang: Locale }) {
  if (!isStaging) return null;
  return (
    <p className="mt-4 inline-flex items-center gap-2 text-sm text-steel">
      <span className="h-2 w-2 rounded-full bg-tally" aria-hidden="true" />
      {t(ui.pending, lang)}: {t(text, lang)}
    </p>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const solutions = pages.find((p) => p.slug === "solutions")!;
  const featured = solutions.children!.flatMap((g) =>
    g.children!.filter((c) => !c.slug.endsWith("-others")).map((c) => ({ group: g, item: c })),
  );

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink text-white">
        <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-7">
            <h1 className="text-4xl font-[640] md:text-5xl">{t(copy.h1, lang)}</h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">{t(copy.lead, lang)}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={href(lang, ["contact"])} className="rounded-sm bg-tally px-6 py-3 font-medium hover:bg-tally-dark">
                {t(ui.quote, lang)}
              </Link>
              <Link href={href(lang, ["solutions"])} className="rounded-sm border border-white/30 px-6 py-3 font-medium hover:border-white">
                {t(copy.seeSolutions, lang)}
              </Link>
            </div>
          </div>
          <nav className="md:col-span-5 md:pl-8 md:border-l md:border-white/15" aria-label={t(solutions.title, lang)}>
            <ul className="divide-y divide-white/15">
              {solutions.children!.map((g) => (
                <li key={g.slug}>
                  <Link href={href(lang, ["solutions", g.slug])} className="group block py-5">
                    <span className="font-display text-2xl font-semibold group-hover:text-tally">{t(g.title, lang)}</span>
                    <span className="mt-1 block text-sm text-white/65">{t(g.summary, lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="signal-bars h-2.5" aria-hidden="true" />
      </section>

      {/* Featured systems: native horizontal scroll with snap, no JS */}
      <section className="py-16" aria-labelledby="featured-h">
        <div className="container-site flex items-end justify-between gap-4">
          <h2 id="featured-h" className="text-2xl md:text-3xl font-[620]">{t(copy.featured, lang)}</h2>
          <Link href={href(lang, ["solutions"])} className="text-sm font-medium hover:text-tally">
            {t(copy.all, lang)}
          </Link>
        </div>
        <div className="container-site mt-8">
          <ul className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4" tabIndex={0} aria-label={t(copy.featured, lang)}>
            {featured.map(({ group, item }) => (
              <li key={item.slug} className="w-72 shrink-0 snap-start">
                <Link
                  href={href(lang, ["solutions", group.slug, item.slug])}
                  className="flex h-full flex-col rounded-md border border-line bg-white hover:border-ink"
                >
                  <div className="aspect-[4/3] rounded-t-md bg-[linear-gradient(135deg,#e6eaee,#d8dee5)]" aria-hidden="true" />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs text-steel">{t(group.title, lang)}</span>
                    <span className="mt-1 font-display text-lg font-semibold">{t(item.title, lang)}</span>
                    <span className="mt-2 text-sm text-steel">{t(item.summary, lang)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Pending lang={lang} text={{ mn: "Систем бүрийн зураг — Маркетинг", en: "Photo for each system — Marketing" }} />
        </div>
      </section>

      {/* About */}
      <section className="border-y border-line bg-white py-16" aria-labelledby="about-h">
        <div className="container-site grid gap-8 md:grid-cols-12">
          <h2 id="about-h" className="text-2xl md:text-3xl font-[620] md:col-span-4">{t(copy.aboutH, lang)}</h2>
          <div className="md:col-span-7">
            <p className="text-lg measure">{t(copy.about, lang)}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium">
              <Link href={href(lang, ["about"])} className="underline underline-offset-4 hover:text-tally">
                {t(copy.aboutLink, lang)}
              </Link>
              <Link href={href(lang, ["about", "showroom"])} className="underline underline-offset-4 hover:text-tally">
                {t(copy.showroom, lang)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16" aria-labelledby="projects-h">
        <div className="container-site">
          <div className="flex items-end justify-between gap-4">
            <h2 id="projects-h" className="text-2xl md:text-3xl font-[620]">{t(copy.projectsH, lang)}</h2>
            <Link href={href(lang, ["projects"])} className="text-sm font-medium hover:text-tally">
              {t(copy.all, lang)}
            </Link>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="rounded-md border border-dashed border-line bg-white">
                <div className="aspect-[16/10] rounded-t-md bg-paper" aria-hidden="true" />
                <p className="p-5 text-sm text-steel">{t(copy.projectSlot, lang)}</p>
              </li>
            ))}
          </ul>
          <Pending lang={lang} text={{ mn: "8 төслийн зураг, тайлбар — Борлуулалт/Маркетинг (10/30)", en: "8 case studies — Sales/Marketing (Oct 30)" }} />
        </div>
      </section>

      {/* Why GSS */}
      <section className="bg-white border-y border-line py-16" aria-labelledby="why-h">
        <div className="container-site">
          <h2 id="why-h" className="text-2xl md:text-3xl font-[620]">{t(copy.whyH, lang)}</h2>
          <ul className="mt-10 grid gap-10 md:grid-cols-3">
            {why.map((w) => (
              <li key={w.h.en} className="border-t-2 border-ink pt-5">
                <h3 className="text-xl font-semibold">{t(w.h, lang)}</h3>
                <p className="mt-2 text-steel">{t(w.p, lang)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners + News */}
      <section className="py-16">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-[620]">{t(copy.partnersH, lang)}</h2>
            <ul className="mt-6 grid grid-cols-3 gap-3" aria-label={t(copy.partnersH, lang)}>
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex aspect-[3/2] items-center justify-center rounded-md border border-line bg-white text-sm text-steel">
                  {i === 0 ? "Sennheiser" : ""}
                </li>
              ))}
            </ul>
            <Pending lang={lang} text={{ mn: "Брэндийн лого — Маркетинг (10/23)", en: "Brand logos — Marketing (Oct 23)" }} />
          </div>
          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-[620]">{t(copy.newsH, lang)}</h2>
              <Link href={href(lang, ["news"])} className="text-sm font-medium hover:text-tally">
                {t(copy.all, lang)}
              </Link>
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {[1, 2, 3].map((n) => (
                <li key={n} className="py-4 text-sm text-steel">
                  {lang === "mn" ? "Мэдээний гарчиг" : "News headline"}
                </li>
              ))}
            </ul>
            <Pending lang={lang} text={{ mn: "Мэдээ — Маркетинг", en: "News — Marketing" }} />
          </div>
        </div>
      </section>

      {/* Contact / inquiry */}
      <section id="inquiry" className="py-8" aria-labelledby="contact-h">
        <div className="container-site grid gap-10 rounded-md border border-line bg-white p-6 md:grid-cols-12 md:p-12">
          <div className="md:col-span-4">
            <h2 id="contact-h" className="text-2xl md:text-3xl font-[620]">{t(copy.contactH, lang)}</h2>
            <p className="mt-4 text-steel">{t(copy.contactLead, lang)}</p>
          </div>
          <div className="md:col-span-8">
            <InquiryForm lang={lang} />
          </div>
        </div>
      </section>
    </>
  );
}
