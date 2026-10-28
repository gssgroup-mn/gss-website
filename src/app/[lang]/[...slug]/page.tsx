import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryForm from "@/components/InquiryForm";
import { findByPath, flatten, locales, ui, type Locale, type Text } from "@/content/site";
import { href, t } from "@/lib/i18n";

const isStaging = process.env.NEXT_PUBLIC_STAGING === "1";

export function generateStaticParams() {
  return locales.flatMap((lang) => flatten().map((f) => ({ lang, slug: f.path })));
}

type Props = { params: Promise<{ lang: Locale; slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const f = findByPath(slug);
  if (!f) return {};
  return { title: t(f.node.title, lang), description: t(f.node.summary, lang) };
}

const solutionContent: Text = {
  mn: "Шийдлийн тайлбар, бүтээгдэхүүний жагсаалт — Борлуулалт/Маркетинг",
  en: "Solution text and product list — Sales/Marketing",
};

const formPages = new Set(["contact"]);

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const found = findByPath(slug);
  if (!found) notFound();
  const { node, parents, path } = found;
  const children = node.children ?? [];
  const isSolutionLeaf = path[0] === "solutions" && children.length === 0;
  const owner = node.contentOwner ?? (isSolutionLeaf ? solutionContent : undefined);
  const showForm = formPages.has(node.slug);

  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-site py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-steel">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href={href(lang)} className="hover:text-ink">
                  {t(ui.home, lang)}
                </Link>
              </li>
              {parents.map((p, i) => (
                <li key={p.slug} className="before:mr-2 before:content-['/']">
                  <Link href={href(lang, path.slice(0, i + 1))} className="hover:text-ink">
                    {t(p.title, lang)}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="mt-4 text-3xl md:text-4xl font-[620] measure">{t(node.title, lang)}</h1>
          <p className="mt-4 text-lg text-steel measure">{t(node.summary, lang)}</p>
          {isStaging && owner && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-sm border border-line bg-paper px-3 py-1.5 text-sm text-steel">
              <span className="h-2 w-2 rounded-full bg-tally" aria-hidden="true" />
              {t(ui.pending, lang)}: {t(owner, lang)}
            </p>
          )}
        </div>
      </section>

      {children.length > 0 && (
        <section className="container-site py-12">
          <ul className="divide-y divide-line border-y border-line">
            {children.map((c) => (
              <li key={c.slug}>
                <Link
                  href={href(lang, [...path, c.slug])}
                  className="group grid gap-2 py-6 md:grid-cols-12 md:items-baseline"
                >
                  <span className="font-display text-xl font-semibold md:col-span-5 group-hover:text-tally">
                    {t(c.title, lang)}
                  </span>
                  <span className="text-steel md:col-span-6">{t(c.summary, lang)}</span>
                  <span className="hidden md:block md:col-span-1 text-right text-steel group-hover:text-tally" aria-hidden="true">
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showForm ? (
        <section className="container-site py-12">
          <div className="max-w-3xl rounded-md border border-line bg-white p-6 md:p-10">
            <InquiryForm lang={lang} />
          </div>
        </section>
      ) : (
        <section className="container-site py-12">
          <div className="flex flex-col gap-4 rounded-md bg-ink px-6 py-8 text-white md:flex-row md:items-center md:justify-between md:px-10">
            <p className="font-display text-xl measure">
              {lang === "mn"
                ? "Танд тохирох системийг манай инженер сонгож өгнө."
                : "Our engineers will help you choose the right system."}
            </p>
            <Link href={href(lang, ["contact"])} className="shrink-0 rounded-sm bg-tally px-5 py-3 font-medium hover:bg-tally-dark">
              {t(ui.quote, lang)}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
