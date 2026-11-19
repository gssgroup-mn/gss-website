import Link from "next/link";
import type { Locale, Text } from "@/content/site";
import { href, t } from "@/lib/i18n";
import PendingNote from "@/components/PendingNote";
import HallViews from "@/components/HallViews";

const venues: { title: Text; body: Text }[] = [
  {
    title: { mn: "Концертын заал, театр", en: "Concert halls and theatres" },
    body: {
      mn: "Эхний эгнээнээс хамгийн арын суудал хүртэл жигд, тод дуу. Хөгжим ч, яриа ч ойлгомжтой.",
      en: "Even, clear sound from the front row to the back seat, for music and speech alike.",
    },
  },
  {
    title: { mn: "Спорт заал, олон зориулалтын танхим", en: "Sports and multi-purpose halls" },
    body: {
      mn: "Цуурай ихтэй том орон зайд үзэгчдэд яриа ойлгомжтой хүрэх чиглэлтэй чанга яригч.",
      en: "Directional loudspeakers that keep speech intelligible in large, reverberant spaces.",
    },
  },
  {
    title: { mn: "Гадна тайз, арга хэмжээ", en: "Outdoor stages and events" },
    body: {
      mn: "Хурдан угсарч задлах, тээвэрлэхэд хялбар, олон мянган үзэгчид хүрэх систем.",
      en: "Systems that set up and pack down quickly and reach audiences in the thousands.",
    },
  },
  {
    title: { mn: "Сургууль, байгууллагын их танхим", en: "School and corporate auditoriums" },
    body: {
      mn: "Илтгэл, ёслол, тоглолтод тохирох, ажилтан өөрөө удирдаж чадах энгийн систем.",
      en: "Simple systems staff can run themselves, for talks, ceremonies and performances.",
    },
  },
];

const chain: { title: Text; body: Text }[] = [
  {
    title: { mn: "Микрофон", en: "Microphones" },
    body: { mn: "Утастай болон утасгүй, дуучин, илтгэгч, хөгжмийн зэмсэгт", en: "Wired and wireless, for voice and instruments" },
  },
  {
    title: { mn: "Микшер", en: "Mixing console" },
    body: { mn: "Бүх эх үүсвэрийг нэгтгэж, түвшин, өнгийг тохируулна", en: "Combines every source and sets level and tone" },
  },
  {
    title: { mn: "Дууны процессор", en: "Processor (DSP)" },
    body: { mn: "Заалны онцлогт тааруулж, хоолой, гажилтаас хамгаална", en: "Tunes the system to the room and protects it" },
  },
  {
    title: { mn: "Өсгөгч", en: "Amplifiers" },
    body: { mn: "Чанга яригч бүрт тохирсон хүч", en: "The right power for each loudspeaker" },
  },
  {
    title: { mn: "Чанга яригч", en: "Loudspeakers" },
    body: { mn: "Үндсэн line array, суб, тайзны монитор", en: "Main line array, subwoofers and stage monitors" },
  },
];

const steps: { title: Text; body: Text }[] = [
  {
    title: { mn: "Газар үзэж, хэмжинэ", en: "Site survey" },
    body: {
      mn: "Заалны хэмжээ, суудлын байрлал, цуурай, тайзны хэрэгцээг тодорхойлно.",
      en: "We measure the room, seating, reverberation and stage needs.",
    },
  },
  {
    title: { mn: "Дуу хүргэлтийг загварчилна", en: "Coverage simulation" },
    body: {
      mn: "Чанга яригчийн тоо, байрлал, өлгөх өнцгийг суурилуулахаас өмнө программаар тооцоолж, суудал бүрт хүрэх дууг шалгана.",
      en: "Before installation we simulate loudspeaker count, position and angles, and check the sound at every seat.",
    },
  },
  {
    title: { mn: "Нийлүүлж, суурилуулна", en: "Supply and installation" },
    body: {
      mn: "Тоног төхөөрөмжийг угсарч, заалны онцлогт тааруулан тохируулна.",
      en: "We install the system and tune it to the room.",
    },
  },
  {
    title: { mn: "Сургаж, засвар үйлчилгээ хийнэ", en: "Training and service" },
    body: {
      mn: "Танай дуу операторыг сургаж, баталгаат болон баталгааны дараах үйлчилгээ үзүүлнэ.",
      en: "We train your sound operators and provide warranty and ongoing service.",
    },
  },
];

const c = {
  venuesH: { mn: "Хаана ашигладаг вэ", en: "Where it's used" },
  chainH: { mn: "Дуу хэрхэн үзэгчдэд хүрдэг вэ", en: "How sound reaches the audience" },
  chainLead: {
    mn: "Амьд дууны систем таван үндсэн хэсгээс бүрдэнэ. Бид бүх хэсгийг нэг нийлүүлэгчээс, хоорондоо тохирсон байдлаар сонгож өгнө.",
    en: "A live sound system has five main parts. We specify all of them together so they work as one.",
  },
  stepsH: { mn: "Төсөл хэрхэн явагддаг вэ", en: "How a project runs" },
  easeH: { mn: "Суурилуулахаас өмнө дуу хүргэлтийг харах", en: "See the coverage before installation" },
  easeBody: {
    mn: "AFMG-ийн EASE Focus программ нь line array болон бусад чанга яригчийн дуу заалны аль хэсэгт ямар хүчтэй хүрэхийг 3D-ээр тооцоолдог. Үүний тусламжтайгаар хэт олон эсвэл хэт цөөн чанга яригч авахаас сэргийлж, «дуугүй» суудал үлдээхгүй.",
    en: "AFMG EASE Focus calculates in 3D how loud each part of a room will be for line arrays and other loudspeakers. It prevents buying too many or too few speakers and leaves no seat without sound.",
  },
  easeAsk: { mn: "Заалныхаа тооцоог хүсэх", en: "Request a coverage study" },
  easeAskReq: {
    mn: "Заалны дуу хүргэлтийн тооцоо хүсэж байна. Заалны хэмжээ (урт × өргөн × өндөр): … Суудлын тоо: … Хэрэглээ (концерт, илтгэл, спорт): …",
    en: "I'd like a coverage study for our hall. Size (length × width × height): … Seats: … Use (concerts, talks, sport): …",
  },
  easeDl: { mn: "EASE Focus-ийг AFMG-ээс үнэгүй татах", en: "Download EASE Focus free from AFMG" },
  easeDlNote: {
    mn: "Windows-д зориулсан, байгууллагын хэрэглэгчдэд үнэгүй.",
    en: "Windows software, free for professional users.",
  },
  easePending: {
    mn: "Батлах: манай инженер EASE Focus-оор тооцоо хийж өгөх эсэх",
    en: "To confirm: whether our engineers provide EASE Focus studies",
  },
  projectsPending: {
    mn: "Хийсэн төслүүд, брэндүүд — Борлуулалт/Маркетинг",
    en: "Completed projects and brands — Sales/Marketing",
  },
} satisfies Record<string, Text>;

export default function LiveAudioSolution({ lang }: { lang: Locale }) {
  return (
    <>
      <section className="container-site py-14 md:py-16">
        <h2 className="text-2xl font-bold md:text-3xl">{t(c.venuesH, lang)}</h2>
        <ul className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {venues.map((v) => (
            <li key={v.title.en} className="border-l-2 border-brand pl-5">
              <h3 className="text-lg font-semibold">{t(v.title, lang)}</h3>
              <p className="mt-1.5 text-steel">{t(v.body, lang)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Signal chain: a real sequence, drawn as one line through five stations */}
      <section className="border-y border-line bg-white">
        <div className="container-site py-14 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">{t(c.chainH, lang)}</h2>
          <p className="mt-3 text-steel measure">{t(c.chainLead, lang)}</p>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-5 md:gap-4">
            <span aria-hidden="true" className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-line md:left-3 md:right-[20%] md:top-[11px] md:bottom-auto md:h-0.5 md:w-auto" />
            {chain.map((s, i) => (
              <li key={s.title.en} className="relative pl-10 md:pl-0 md:pt-10">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full border-2 ${
                    i === chain.length - 1 ? "border-brand bg-brand" : "border-brand bg-white"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${i === chain.length - 1 ? "bg-white" : "bg-brand"}`} />
                </span>
                <h3 className="font-semibold">{t(s.title, lang)}</h3>
                <p className="mt-1 text-sm text-steel">{t(s.body, lang)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-site py-14 md:py-16">
        <h2 className="text-2xl font-bold md:text-3xl">{t(c.stepsH, lang)}</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title.en} className="flex gap-4">
              <span className="text-3xl font-bold leading-none text-brand tabular-nums" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{t(s.title, lang)}</h3>
                <p className="mt-1 text-sm text-steel">{t(s.body, lang)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* EASE Focus */}
      <section id="ease-focus" className="bg-ink text-white">
        <div className="container-site py-14 md:py-16">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t(c.easeH, lang)}</h2>
            <p className="mt-4 text-white/80 measure">{t(c.easeBody, lang)}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={href(lang, ["contact"]) + `?interest=live-audio&request=${encodeURIComponent(t(c.easeAskReq, lang))}`}
                className="rounded-md bg-brand px-6 py-3 font-semibold text-white hover:brightness-110"
              >
                {t(c.easeAsk, lang)}
              </Link>
              <a
                href="https://www.afmg.eu/en/ease-focus"
                target="_blank"
                rel="noopener"
                className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                {t(c.easeDl, lang)}
              </a>
            </div>
            <p className="mt-3 text-sm text-white/60">{t(c.easeDlNote, lang)}</p>
            <PendingNote dark text={c.easePending} lang={lang} />
          </div>
          <div className="mt-10">
            <HallViews lang={lang} />
          </div>
        </div>
      </section>

      <div className="container-site pt-10">
        <PendingNote text={c.projectsPending} lang={lang} />
      </div>
    </>
  );
}
