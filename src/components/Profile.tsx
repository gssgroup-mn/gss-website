import Link from "next/link";
import type { Locale, Text } from "@/content/site";
import {
  activities,
  approach,
  contact,
  eventImage,
  events,
  mission,
  projectImage,
  projects,
  solutionText,
  vision,
  type SolutionKey,
} from "@/content/profile";
import { basePath, href } from "@/lib/i18n";
import PendingNote from "@/components/PendingNote";
import HistoryCarousel from "@/components/HistoryCarousel";

const translation: Text = {
  mn: "Монгол орчуулга — ахлах борлуулалтын менежер илгээнэ",
  en: "Mongolian translation — from the senior sales manager",
};

/** English profile text is the source; Mongolian pages flag that the translation is still coming. */
export function TranslationNote({ lang }: { lang: Locale }) {
  return lang === "mn" ? <PendingNote text={translation} lang={lang} /> : null;
}

const L = {
  includes: { mn: "Шийдэлд багтах зүйлс", en: "Our solution includes" },
  brands: { mn: "Брэндүүд", en: "Brands" },
  projects: { mn: "Энэ чиглэлийн төслүүд", en: "Projects in this field" },
  allProjects: { mn: "Бүх төслийг харах", en: "See all projects" },
  vision: { mn: "Алсын хараа", en: "Vision" },
  mission: { mn: "Эрхэм зорилго", en: "Mission" },
  whatWeDo: { mn: "Бидний үйл ажиллагаа", en: "What we do" },
  approach: { mn: "Бидний ажлын арга барил", en: "Our approach" },
  approachLead: {
    mn: "Санаанаас эхлээд ашиглалт хүртэл төслийг хэрхэн амжилттай хэрэгжүүлдэг вэ.",
    en: "How we deliver successful projects from concept to completion.",
  },
  contact: { mn: "Холбоо барих", en: "Contact" },
};

function Brands({ list, lang }: { list: string[]; lang: Locale }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-steel">{L.brands[lang]}</h3>
      <ul className="mt-3 flex flex-wrap gap-2" lang="en">
        {list.map((b) => (
          <li key={b} className="rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectCard({ id }: { id: number }) {
  const p = projects.find((x) => x.id === id)!;
  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-line bg-white" lang="en">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={basePath + projectImage(p.id)}
        alt={`${p.name} — ${p.customer ?? ""}`}
        width={644}
        height={348}
        loading="lazy"
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="p-5">
        <p className="text-sm text-steel">
          {p.year}, {p.place}
        </p>
        <p className="mt-1 font-bold text-ink">{p.customer ?? "Customer to be confirmed"}</p>
        <p className="mt-1 text-sm text-steel">{p.name}</p>
      </div>
    </li>
  );
}

/** Profile text, brands and related projects for a solution page. */
export function SolutionProfile({ k, lang }: { k: SolutionKey; lang: Locale }) {
  const s = solutionText[k];
  const related = projects.filter((p) => p.category === k).sort((a, b) => b.year - a.year);
  return (
    <section className="container-site py-12 md:py-14">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="space-y-4 md:col-span-7" lang="en">
          {s.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="measure text-ink/85">
              {p}
            </p>
          ))}
          <TranslationNote lang={lang} />
        </div>
        <aside className="space-y-8 md:col-span-5">
          {s.includes && (
            <div>
              <h3 className="text-sm font-semibold text-steel">{L.includes[lang]}</h3>
              <ul className="mt-3 space-y-2" lang="en">
                {s.includes.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Brands list={s.brands} lang={lang} />
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-2xl font-bold">{L.projects[lang]}</h2>
            <Link href={`${href(lang, ["projects"])}#${k}`} className="font-semibold text-brand hover:underline">
              {L.allProjects[lang]} ({related.length})
            </Link>
          </div>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} id={p.id} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function AboutProfile({ lang }: { lang: Locale }) {
  return (
    <>
      <section className="container-site py-12 md:py-16">
        <TranslationNote lang={lang} />
        <div className="mt-6 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7" lang="en">
            <h2 className="text-sm font-semibold text-steel">{L.vision[lang]}</h2>
            <p className="mt-2 text-2xl font-bold leading-snug text-ink">{vision}</p>
            <h2 className="mt-10 text-sm font-semibold text-steel">{L.mission[lang]}</h2>
            <p className="mt-2 measure text-ink/85">{mission}</p>
          </div>
          <div className="md:col-span-5">
            <h2 className="text-sm font-semibold text-steel">{L.whatWeDo[lang]}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line" lang="en">
              {activities.map((a) => (
                <li key={a} className="py-3 font-medium">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-site py-12 md:py-16">
          <h2 className="text-2xl font-bold">{L.approach[lang]}</h2>
          <p className="mt-2 text-steel">{L.approachLead[lang]}</p>
          <ol className="mt-8 grid gap-6 md:grid-cols-4" lang="en">
            {approach.map((a, i) => (
              <li key={a.title} className="border-t-2 border-brand pt-4">
                <span className="text-sm font-semibold text-brand">{i + 1}</span>
                <h3 className="mt-1 text-lg font-bold">{a.title}</h3>
                <p className="mt-2 text-sm text-ink/80">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <HistoryCarousel lang={lang} />
    </>
  );
}

export function EventsList({ lang }: { lang: Locale }) {
  const list = [...events].sort((a, b) => b.year - a.year || b.id - a.id);
  return (
    <section className="container-site py-12">
      <TranslationNote lang={lang} />
      <ul className="mt-6 space-y-12" lang="en">
        {list.map((e) => (
          <li key={e.id}>
            <p className="text-sm font-semibold text-brand">{e.year}</p>
            <h2 className="mt-1 text-xl font-bold">{e.title}</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {([1, 2, 3] as const).map((n) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={n}
                  src={basePath + eventImage(e.id, n)}
                  alt={`${e.title} ${e.year}, photo ${n}`}
                  width={868}
                  height={372}
                  loading="lazy"
                  className="aspect-[7/3] w-full rounded-md object-cover"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ContactDetails({ lang, dark = false }: { lang: Locale; dark?: boolean }) {
  const muted = dark ? "text-white/60" : "text-steel";
  const strong = dark ? "text-white" : "text-ink";
  const lbl: Record<string, Text> = {
    Sales: { mn: "Борлуулалт", en: "Sales" },
    Office: { mn: "Оффис", en: "Office" },
  };
  return (
    <dl className="space-y-4 text-sm">
      {contact.phones.map((p) => (
        <div key={p.tel}>
          <dt className={muted}>{lbl[p.label][lang]}</dt>
          <dd>
            <a href={`tel:${p.tel}`} className={`font-semibold ${strong} hover:underline`}>
              {p.text}
            </a>
          </dd>
        </div>
      ))}
      <div>
        <dt className={muted}>Email</dt>
        <dd>
          <a href={`mailto:${contact.email}`} className={`font-semibold ${strong} hover:underline`}>
            {contact.email}
          </a>
        </dd>
      </div>
      <div>
        <dt className={muted}>{lang === "mn" ? "Хаяг" : "Address"}</dt>
        <dd className={strong}>{lang === "mn" ? contact.addressMn : contact.address}</dd>
      </div>
    </dl>
  );
}

