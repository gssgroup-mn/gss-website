import type { Locale, Text } from "@/content/site";
import { ui } from "@/content/site";
import { t } from "@/lib/i18n";

const isStaging = process.env.NEXT_PUBLIC_STAGING === "1";

/** Staging-only marker for content a reviewer still has to supply or confirm. Renders nothing in production. */
export default function PendingNote({ text, lang, dark = false }: { text: Text; lang: Locale; dark?: boolean }) {
  if (!isStaging) return null;
  return (
    <p
      className={`mt-6 inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-sm ${
        dark ? "border-white/20 bg-white/5 text-white/75" : "border-line bg-paper text-steel"
      }`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-tally" aria-hidden="true" />
      {t(ui.pending, lang)}: {t(text, lang)}
    </p>
  );
}
