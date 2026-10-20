// Single source of truth for the sitemap (from "GSS Website – Initial Structure").
// Every page is generated from this tree, so adding a page = adding a node here.

export const locales = ["mn", "en"] as const;
export type Locale = (typeof locales)[number];
export type Text = Record<Locale, string>;

export type PageNode = {
  slug: string;
  title: Text;
  summary: Text;
  children?: PageNode[];
  /** Shown in the main navigation bar */
  inNav?: boolean;
  /** Pending content owner, shown on staging so reviewers know what is missing */
  contentOwner?: Text;
};

export const company = {
  name: "Globalsmart Solution LLC",
  short: "GSS",
  founded: 2015,
  store: "https://globalstore.mn",
  group: "https://globalgroup.mn",
};

const tbd: Text = { mn: "Бусад — тодорхойлогдоно", en: "Others — to be defined" };

export const pages: PageNode[] = [
  {
    slug: "solutions",
    inNav: true,
    title: { mn: "Шийдлүүд", en: "Solutions" },
    summary: {
      mn: "Өргөн нэвтрүүлэг, амьд дуу, студи, хурлын танхим болон дэлгэцийн системийн бүрэн шийдэл.",
      en: "Complete systems for broadcast, live sound, studios, meeting rooms and displays.",
    },
    children: [
      {
        slug: "proav",
        title: { mn: "ProAV", en: "ProAV" },
        summary: {
          mn: "Мэргэжлийн дуу, дүрс, өргөн нэвтрүүлгийн систем.",
          en: "Professional audio, video and broadcast systems.",
        },
        children: [
          {
            slug: "broadcast-video-production",
            title: { mn: "Өргөн нэвтрүүлэг ба видео продакшн", en: "Broadcast & Video Production" },
            summary: {
              mn: "Телевиз, стрим, продакшн студийн камер, свитчер, дохио дамжуулалт.",
              en: "Cameras, switchers and signal flow for TV, streaming and production studios.",
            },
          },
          {
            slug: "live-audio",
            title: { mn: "Амьд дуу", en: "Live Audio" },
            summary: {
              mn: "Тайз, концерт, арга хэмжээний дуу өсгөх систем ба утасгүй микрофон.",
              en: "Sound reinforcement and wireless microphones for stages, concerts and events.",
            },
          },
          {
            slug: "audio-studio",
            title: { mn: "Дууны студи", en: "Audio Studio" },
            summary: {
              mn: "Бичлэг, подкаст, пост-продакшны студийн тоног төхөөрөмж.",
              en: "Recording, podcast and post-production studio equipment.",
            },
          },
          { slug: "proav-others", title: tbd, summary: tbd },
        ],
      },
      {
        slug: "corporate",
        title: { mn: "Байгууллагад", en: "Corporate" },
        summary: {
          mn: "Хурлын танхим, дэлгэц, зарлалын системийг байгууллагын хэрэгцээнд.",
          en: "Meeting rooms, displays and public address for organisations.",
        },
        children: [
          {
            slug: "conference-rooms",
            title: { mn: "Хурлын танхим", en: "Conference Rooms" },
            summary: {
              mn: "Видео хурал, хурлын микрофон, танхимын удирдлагын систем.",
              en: "Video conferencing, conference microphones and room control.",
            },
          },
          {
            slug: "displays-led-projection",
            title: {
              mn: "Арилжааны дэлгэц, LED, видео хана, проектор",
              en: "Commercial Displays, LED, Video Walls & Projection",
            },
            summary: {
              mn: "Танхим, лобби, удирдлагын төвд зориулсан том дэлгэцийн шийдэл.",
              en: "Large-format display solutions for halls, lobbies and control rooms.",
            },
          },
          {
            slug: "pa-systems",
            title: { mn: "Зарлалын (PA) систем", en: "PA Systems" },
            summary: {
              mn: "Барилга, сургууль, худалдааны төвийн зарлал ба арын хөгжмийн систем.",
              en: "Public address and background music for buildings, schools and malls.",
            },
          },
          { slug: "corporate-others", title: tbd, summary: tbd },
        ],
      },
      {
        slug: "consumer",
        title: { mn: "Хэрэглэгчдэд", en: "Consumer" },
        summary: {
          mn: "Sennheiser чихэвч ба AMBEO дуу.",
          en: "Sennheiser headphones and AMBEO sound.",
        },
        children: [
          {
            slug: "sennheiser-headphones",
            title: { mn: "Sennheiser чихэвч", en: "Sennheiser Headphones" },
            summary: {
              mn: "Гэр, аялал, ажилд зориулсан Sennheiser чихэвчүүд.",
              en: "Sennheiser headphones for home, travel and work.",
            },
          },
          {
            slug: "ambeo",
            title: { mn: "AMBEO", en: "AMBEO" },
            summary: {
              mn: "Sennheiser AMBEO орон зайн дуу.",
              en: "Sennheiser AMBEO immersive sound.",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "partners",
    inNav: true,
    title: { mn: "Түншүүд", en: "Partners" },
    summary: {
      mn: "Бидний албан ёсоор төлөөлдөг брэндүүд.",
      en: "The brands we officially represent.",
    },
    contentOwner: { mn: "Брэндийн лого, жагсаалт — Борлуулалт/Маркетинг", en: "Brand logos and list — Sales/Marketing" },
  },
  {
    slug: "projects",
    inNav: true,
    title: { mn: "Төслүүд", en: "Projects" },
    summary: {
      mn: "Бидний суурилуулсан систем, хэрэгжүүлсэн төслүүд.",
      en: "Systems we have designed and installed.",
    },
    contentOwner: { mn: "8 төслийн тайлбар, зураг — Борлуулалт/Маркетинг", en: "8 case studies with photos — Sales/Marketing" },
  },
  {
    slug: "about",
    inNav: true,
    title: { mn: "Бидний тухай", en: "About Us" },
    summary: {
      mn: "2015 оноос хойш мэргэжлийн дуу, дүрсийн системийг нийлүүлж, суурилуулж байна.",
      en: "Supplying and installing professional audio-visual systems since 2015.",
    },
    children: [
      {
        slug: "showroom",
        title: { mn: "Шоурүм", en: "Showroom" },
        summary: {
          mn: "Төхөөрөмжийг биечлэн туршиж үзэх боломжтой үзэсгэлэнгийн танхим.",
          en: "See and try the equipment in person.",
        },
      },
    ],
  },
  {
    slug: "news",
    inNav: true,
    title: { mn: "Мэдээ", en: "News" },
    summary: { mn: "Шинэ бүтээгдэхүүн, төсөл, арга хэмжээ.", en: "New products, projects and events." },
  },
  {
    slug: "contact",
    title: { mn: "Холбоо барих", en: "Contact" },
    summary: {
      mn: "Хэрэгцээгээ бичээд үлдээгээрэй. Манай борлуулалтын инженер ажлын 1 өдрийн дотор холбогдоно.",
      en: "Tell us what you need. A sales engineer will contact you within one working day.",
    },
  },
  {
    slug: "support",
    title: { mn: "Тусламж", en: "Support" },
    summary: {
      mn: "Засвар үйлчилгээ, инженерийн зөвлөгөө, демо болон хамтын ажиллагааны хүсэлт.",
      en: "Service, engineering advice, demos and cooperation requests.",
    },
    children: [
      {
        slug: "ticket",
        title: { mn: "Засварын хүсэлт", en: "Create a Ticket" },
        summary: { mn: "Төхөөрөмжийн засвар, баталгааны хүсэлт илгээх.", en: "Request repair or warranty service." },
      },
      {
        slug: "service-engineer",
        title: { mn: "Инженертэй холбогдох", en: "Contact a Service Engineer" },
        summary: { mn: "Суурилуулалт, тохиргооны талаар инженерээс зөвлөгөө авах.", en: "Get advice on installation and setup." },
      },
      {
        slug: "request-demo",
        title: { mn: "Демо захиалах", en: "Request a Demo" },
        summary: { mn: "Шоурүм эсвэл таны байранд үзүүлэн туршилт хийлгэх.", en: "Book a demo in our showroom or at your site." },
      },
      {
        slug: "cooperation",
        title: { mn: "Хамтран ажиллах", en: "Request Cooperation" },
        summary: { mn: "Түнш, гэрээт гүйцэтгэгч, дистрибьютороор хамтрах санал.", en: "Partner, contractor or distribution proposals." },
      },
    ],
  },
];

export type Flat = { node: PageNode; path: string[]; parents: PageNode[] };

export function flatten(nodes = pages, path: string[] = [], parents: PageNode[] = []): Flat[] {
  return nodes.flatMap((n) => {
    const p = [...path, n.slug];
    return [{ node: n, path: p, parents }, ...flatten(n.children ?? [], p, [...parents, n])];
  });
}

export function findByPath(path: string[]): Flat | undefined {
  return flatten().find((f) => f.path.join("/") === path.join("/"));
}

export const ui = {
  quote: { mn: "Үнийн санал авах", en: "Request a quote" },
  store: { mn: "Онлайн дэлгүүр", en: "Online store" },
  support: { mn: "Тусламж", en: "Support" },
  home: { mn: "Нүүр", en: "Home" },
  draft: {
    mn: "Туршилтын хувилбар — агуулга бэлтгэгдэж байна",
    en: "Staging preview — content in progress",
  },
  pending: { mn: "Хүлээгдэж буй агуулга", en: "Content pending" },
  explore: { mn: "Дэлгэрэнгүй", en: "Learn more" },
  menu: { mn: "Цэс", en: "Menu" },
  close: { mn: "Хаах", en: "Close" },
  language: { mn: "English", en: "Монгол" },
} satisfies Record<string, Text>;
