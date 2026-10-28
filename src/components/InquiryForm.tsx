"use client";

import { useState } from "react";
import { pages, type Locale } from "@/content/site";
import { t } from "@/lib/i18n";

// Fields map 1:1 to the ERP "Inquiries" list so a web request becomes an Inquiry
// with Source = "Вэбсайт". The endpoint is configured per environment.
const endpoint = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT || "";

const L = {
  org: { mn: "Байгууллага эсвэл таны нэр", en: "Organisation or your name" },
  contact: { mn: "Холбогдох хүн", en: "Contact person" },
  phone: { mn: "Утас", en: "Phone" },
  email: { mn: "Имэйл", en: "Email" },
  type: { mn: "Хүсэлтийн төрөл", en: "Request type" },
  types: [
    { v: "quote", mn: "Үнийн санал", en: "Quotation" },
    { v: "service", mn: "Засвар үйлчилгээ", en: "Repair / service" },
    { v: "demo", mn: "Демо захиалах", en: "Demo" },
    { v: "cooperation", mn: "Хамтын ажиллагаа", en: "Cooperation" },
  ],
  interest: { mn: "Сонирхож буй шийдэл", en: "Solution of interest" },
  notSure: { mn: "Мэдэхгүй байна, зөвлөгөө авъя", en: "Not sure yet, I need advice" },
  request: { mn: "Юу хэрэгтэй байна вэ?", en: "What do you need?" },
  requestHint: {
    mn: "Жишээ: 40 хүний хурлын танхимд видео хурлын систем, 12-р сард суурилуулна.",
    en: "Example: video conferencing for a 40-seat meeting room, installed in December.",
  },
  needed: { mn: "Хэзээ хэрэгтэй вэ? (заавал биш)", en: "When do you need it? (optional)" },
  send: { mn: "Хүсэлт илгээх", en: "Send request" },
  sending: { mn: "Илгээж байна…", en: "Sending…" },
  sent: {
    mn: "Хүсэлт хүлээн авлаа. Манай инженер ажлын 1 өдрийн дотор холбогдоно.",
    en: "Request received. An engineer will contact you within one working day.",
  },
  failed: {
    mn: "Хүсэлт илгээгдсэнгүй. Сүлжээгээ шалгаад дахин оролдоно уу, эсвэл утсаар холбогдоно уу.",
    en: "The request was not sent. Check your connection and try again, or call us.",
  },
  staging: {
    mn: "Туршилтын хувилбар: маягт ERP-тэй холбогдоогүй тул хүсэлт илгээгдээгүй.",
    en: "Staging preview: the form is not yet connected to the ERP, so nothing was sent.",
  },
  required: { mn: "заавал", en: "required" },
} as const;

type Status = "idle" | "sending" | "sent" | "failed" | "staging";

export default function InquiryForm({ lang, compact = false }: { lang: Locale; compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const groups = pages.find((p) => p.slug === "solutions")?.children ?? [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (!endpoint) {
      setStatus("staging");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "Вэбсайт", lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      e.currentTarget.reset();
    } catch {
      setStatus("failed");
    }
  }

  const field = "mt-1 block w-full rounded-sm border border-line bg-white px-3 py-2.5 text-base placeholder:text-steel/70 focus:border-ink focus:outline-none";
  const label = "block text-sm font-medium";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <label className={label}>
          {t(L.org, lang)} <span className="text-steel font-normal">({t(L.required, lang)})</span>
          <input name="customerName" required autoComplete="organization" className={field} />
        </label>
        <label className={label}>
          {t(L.contact, lang)}
          <input name="contactName" autoComplete="name" className={field} />
        </label>
        <label className={label}>
          {t(L.phone, lang)} <span className="text-steel font-normal">({t(L.required, lang)})</span>
          <input name="contactPhone" type="tel" required inputMode="tel" pattern="[0-9+\-\s]{8,}" autoComplete="tel" className={field} />
        </label>
        <label className={label}>
          {t(L.email, lang)}
          <input name="contactEmail" type="email" autoComplete="email" className={field} />
        </label>
      </div>
      <label className={label}>
        {t(L.type, lang)}
        <select name="requestType" className={field} defaultValue="quote">
          {L.types.map((o) => (
            <option key={o.v} value={o.v}>
              {o[lang]}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        {t(L.interest, lang)}
        <select name="interest" className={field} defaultValue="">
          <option value="">{t(L.notSure, lang)}</option>
          {groups.map((g) => (
            <optgroup key={g.slug} label={t(g.title, lang)}>
              {g.children
                ?.filter((c) => !c.slug.endsWith("-others"))
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {t(c.title, lang)}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
      <label className={label}>
        {t(L.request, lang)} <span className="text-steel font-normal">({t(L.required, lang)})</span>
        <textarea name="request" required rows={4} placeholder={t(L.requestHint, lang)} className={field} />
      </label>
      <label className={`${label} max-w-xs`}>
        {t(L.needed, lang)}
        <input name="neededBy" type="date" className={field} />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-brand px-6 py-3 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {status === "sending" ? t(L.sending, lang) : t(L.send, lang)}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "sent" && t(L.sent, lang)}
          {status === "failed" && <span className="text-tally-dark">{t(L.failed, lang)}</span>}
          {status === "staging" && <span className="text-steel">{t(L.staging, lang)}</span>}
        </p>
      </div>
    </form>
  );
}
