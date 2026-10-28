import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import { company, locales, pages, ui, type Locale, type Text } from "@/content/site";
import { href, t } from "@/lib/i18n";

// Design option B: light, audio-led. The signature is the solutions shown as
// mixing-console channel strips; everything else stays quiet.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const blue = "#1e4fd8";

const copy = {
  h1: {
    mn: "Студи, тайз, хурлын танхимд зориулсан дуу ба дүрсний систем",
    en: "Sound and picture systems for studios, stages and meeting rooms",
  },
  lead: {
    mn: "Бид хэрэгцээг тань сонсож, тохирох тоног төхөөрөмжийг сонгон нийлүүлж, суурилуулаад, дараа нь ч засвар үйлчилгээ үзүүлдэг.",
    en: "We listen to what you need, specify and supply the right equipment, install it, and keep it running afterwards.",
  },
  channels: { mn: "Шийдлийн чиглэл", en: "Solution areas" },
  featured: { mn: "Онцлох систем", en: "Featured systems" },
  photo: { mn: "Фото", en: "Photo" },
  aboutH: { mn: `${company.founded} оноос хойш`, en: `Since ${company.founded}` },
  about: {
    mn: "Globalsmart Solution нь Global Group-ийн мэргэжлийн дуу, дүрсийн компани. Төхөөрөмж нийлүүлэхээс гадна зураг төсөл, суурилуулалт, сургалт, засвар үйлчилгээг хариуцдаг.",
    en: "Globalsmart Solution is Global Group's professional audio-visual company. Beyond supply, we handle design, installation, training and service.",
  },
  showroomH: { mn: "Шоурүмд сонсож, харж туршина", en: "Hear and see it in our showroom" },
  showroom: {
    mn: "Худалдан авахаасаа өмнө систем хэрхэн ажиллахыг биечлэн туршаад үзээрэй.",
    en: "Try how a system performs in person before you buy.",
  },
  demo: { mn: "Демо захиалах", en: "Book a demo" },
  projectsH: { mn: "Хэрэгжүүлсэн төслүүд", en: "Projects" },
  whyH: { mn: "Яагаад GSS", en: "Why GSS" },
  partnersH: { mn: "Түнш брэндүүд", en: "Partner brands" },
  newsH: { mn: "Мэдээ", en: "News" },
  contactH: { mn: "Ямар систем хэрэгтэй байна вэ?", en: "What system do you need?" },
  contactLead: {
    mn: "Хэрэгцээгээ бичээд үлдээгээрэй. Борлуулалтын инженер ажлын 1 өдрийн дотор холбогдоно.",
    en: "Leave a short description. A sales engineer will reply within one working day.",
  },
  all: { mn: "Бүгдийг үзэх", en: "View all" },
} satisfies Record<string, Text>;

const why: { h: Text; p: Text }[] = [
  {
    h: { mn: "Нэг баг, эхнээс нь дуустал", en: "One team, start to finish" },
    p: { mn: "Зураг төсөл, нийлүүлэлт, суурилуулалт, засварыг нэг баг хариуцна.", en: "Design, supply, installation and service by one team." },
  },
  {
    h: { mn: "Худалдан авахаас өмнө туршина", en: "Try before you buy" },
    p: { mn: "Шоурүм эсвэл таны байранд демо хийнэ.", en: "Demos in our showroom or at your site." },
  },
  {
    h: { mn: "Суурилуулсны дараа ч хамт", en: "Support after installation" },
    p: { mn: "Засварын хүсэлт, зөвлөгөөг вэбээс шууд илгээнэ.", en: "Service tickets and advice straight from the website." },
  },
];

// Deterministic waveform path (no randomness, so every build renders identically).
function waveform(width: number, height: number, points = 180) {
  const mid = height / 2;
  let d = `M0 ${mid}`;
  for (let i = 1; i <= points; i++) {
    const x = (i / points) * width;
    const env = Math.sin((i / points) * Math.PI);
    const y = mid + Math.sin(i * 0.9) * Math.cos(i * 0.23) * env * (height * 0.42);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

// A channel strip: label at the bottom like a console scribble strip, fader position as decoration.
function Fader({ level }: { level: number }) {
  return (
    <div className="relative mx-auto h-40 w-10" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded bg-[#dce3ec]" />
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="absolute left-0 h-px w-2 bg-[#b9c4d2]" style={{ top: `${i * 12.5}%` }} />
      ))}
      <div
        className="absolute left-1/2 h-7 w-9 -translate-x-1/2 rounded-sm border border-[#14202b]/20 bg-white shadow-[0_2px_0_#14202b22]"
        style={{ top: `calc(${100 - level}% - 14px)` }}
      >
        <div className="mx-auto mt-3 h-px w-6 bg-[#1e4fd8]" />
      </div>
    </div>
  );
}

export default async function HomeB({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const solutions = pages.find((p) => p.slug === "solutions")!;
  const featured = solutions.children!.flatMap((g) =>
    g.children!.filter((c) => !c.slug.endsWith("-others")).map((c) => ({ group: g, item: c })),
  );
  const levels = [78, 62, 45];

  return (
    <div className="theme-b bg-white">
      {/* Hero */}
      <section className="border-b border-[#dce3ec]">
        <div className="container-site pt-16 pb-10 md:pt-24">
          <h1 className="max-w-4xl text-4xl font-[340] leading-[1.08] md:text-[3.6rem]">{t(copy.h1, lang)}</h1>
          <p className="mt-6 max-w-2xl text-lg text-steel">{t(copy.lead, lang)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={href(lang, ["contact"])} className="rounded-full px-6 py-3 font-medium text-white" style={{ background: blue }}>
              {t(ui.quote, lang)}
            </Link>
            <Link href={href(lang, ["contact"])} className="rounded-full border border-[#14202b]/20 px-6 py-3 font-medium hover:border-[#14202b]">
              {t(copy.demo, lang)}
            </Link>
          </div>
        </div>
        <svg viewBox="0 0 1200 120" className="block h-24 w-full md:h-32" preserveAspectRatio="none" aria-hidden="true">
          <path d={waveform(1200, 120)} fill="none" stroke={blue} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </section>

      {/* Solutions as channel strips */}
      <section className="bg-[#eef3fa] py-16" aria-labelledby="ch-h">
        <div className="container-site">
          <h2 id="ch-h" className="text-2xl font-[480] md:text-3xl">{t(copy.channels, lang)}</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {solutions.children!.map((g, i) => (
              <li key={g.slug}>
                <Link
                  href={href(lang, ["solutions", g.slug])}
                  className="group flex h-full flex-col rounded-lg border border-[#dce3ec] bg-white p-6 hover:border-[#1e4fd8]"
                >
                  <Fader level={levels[i] ?? 50} />
                  <div className="mt-6 border-t border-[#dce3ec] pt-4">
                    <span className="font-display text-xl font-semibold group-hover:text-[#1e4fd8]">{t(g.title, lang)}</span>
                    <p className="mt-1 text-sm text-steel">{t(g.summary, lang)}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                      {g.children!
                        .filter((c) => !c.slug.endsWith("-others"))
                        .map((c) => (
                          <li key={c.slug} className="text-[#14202b]/80">{t(c.title, lang)}</li>
                        ))}
                    </ul>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured systems: grid */}
      <section className="py-16" aria-labelledby="ft-h">
        <div className="container-site">
          <div className="flex items-end justify-between">
            <h2 id="ft-h" className="text-2xl font-[480] md:text-3xl">{t(copy.featured, lang)}</h2>
            <Link href={href(lang, ["solutions"])} className="text-sm font-medium" style={{ color: blue }}>
              {t(copy.all, lang)}
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {featured.map(({ group, item }) => (
              <li key={item.slug}>
                <Link href={href(lang, ["solutions", group.slug, item.slug])} className="group block">
                  <div className="flex aspect-square items-end rounded-lg bg-[#eef3fa] p-3 text-xs text-steel">{t(copy.photo, lang)}</div>
                  <p className="mt-3 text-xs text-steel">{t(group.title, lang)}</p>
                  <p className="font-display font-semibold group-hover:text-[#1e4fd8]">{t(item.title, lang)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* About + showroom */}
      <section className="border-y border-[#dce3ec]">
        <div className="container-site grid md:grid-cols-2">
          <div className="py-14 md:pr-12">
            <h2 className="text-2xl font-[480] md:text-3xl">{t(copy.aboutH, lang)}</h2>
            <p className="mt-4 text-lg text-steel measure">{t(copy.about, lang)}</p>
            <Link href={href(lang, ["about"])} className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
              {t({ mn: "Бидний тухай", en: "About us" }, lang)}
            </Link>
          </div>
          <div className="border-t border-[#dce3ec] py-14 md:border-l md:border-t-0 md:pl-12">
            <h2 className="text-2xl font-[480] md:text-3xl">{t(copy.showroomH, lang)}</h2>
            <p className="mt-4 text-lg text-steel measure">{t(copy.showroom, lang)}</p>
            <Link href={href(lang, ["contact"])} className="mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-medium text-white" style={{ background: blue }}>
              {t(copy.demo, lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* Projects: one large, two small */}
      <section className="py-16" aria-labelledby="pj-h">
        <div className="container-site">
          <div className="flex items-end justify-between">
            <h2 id="pj-h" className="text-2xl font-[480] md:text-3xl">{t(copy.projectsH, lang)}</h2>
            <Link href={href(lang, ["projects"])} className="text-sm font-medium" style={{ color: blue }}>
              {t(copy.all, lang)}
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <div className="flex min-h-64 items-end rounded-lg bg-[#eef3fa] p-5 text-sm text-steel md:col-span-2 md:row-span-2">
              {t({ mn: "Онцлох төслийн фото, тайлбар", en: "Featured project photo and story" }, lang)}
            </div>
            <div className="flex min-h-32 items-end rounded-lg bg-[#eef3fa] p-5 text-sm text-steel">{t({ mn: "Төсөл", en: "Project" }, lang)}</div>
            <div className="flex min-h-32 items-end rounded-lg bg-[#eef3fa] p-5 text-sm text-steel">{t({ mn: "Төсөл", en: "Project" }, lang)}</div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-[#14202b] py-16 text-white">
        <div className="container-site grid gap-10 md:grid-cols-4">
          <h2 className="text-2xl font-[480] md:text-3xl">{t(copy.whyH, lang)}</h2>
          {why.map((w) => (
            <div key={w.h.en}>
              <h3 className="text-lg font-semibold">{t(w.h, lang)}</h3>
              <p className="mt-2 text-white/70">{t(w.p, lang)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners strip + news */}
      <section className="py-16">
        <div className="container-site">
          <h2 className="text-2xl font-[480]">{t(copy.partnersH, lang)}</h2>
          <ul className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[#dce3ec] bg-[#dce3ec] md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex h-20 items-center justify-center bg-white text-sm text-steel">{i === 0 ? "Sennheiser" : "Logo"}</li>
            ))}
          </ul>
          <div className="mt-14 flex items-end justify-between">
            <h2 className="text-2xl font-[480]">{t(copy.newsH, lang)}</h2>
            <Link href={href(lang, ["news"])} className="text-sm font-medium" style={{ color: blue }}>
              {t(copy.all, lang)}
            </Link>
          </div>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="border-t border-[#14202b] pt-4">
                <p className="text-xs text-steel">2026.10</p>
                <p className="mt-1 font-display font-semibold">{t({ mn: "Мэдээний гарчиг", en: "News headline" }, lang)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#eef3fa] py-16" id="inquiry">
        <div className="container-site grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="text-2xl font-[480] md:text-3xl">{t(copy.contactH, lang)}</h2>
            <p className="mt-4 text-steel">{t(copy.contactLead, lang)}</p>
          </div>
          <div className="rounded-lg bg-white p-6 md:col-span-8 md:p-10">
            <InquiryForm lang={lang} />
          </div>
        </div>
      </section>
    </div>
  );
}
