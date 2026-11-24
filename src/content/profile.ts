// Company content from the "GSS profile 2026" deck (English original).
// The Mongolian translation comes from the senior sales manager; until then the
// Mongolian pages show this English text with a staging-only note.

export type SolutionKey = "broadcast" | "audio" | "display" | "lighting" | "conference";

export const contact = {
  phones: [
    { label: "Sales", tel: "+97675115577", text: "+976 7511-5577" },
    { label: "Office", tel: "+97675115151", text: "+976 7511-5151" },
  ],
  email: "sales@gssgroup.mn",
  addressMn: "Улаанбаатар 16052, Баянгол дүүрэг, Энхтайвны өргөн чөлөө, UB Platinum, 5 давхар",
  address: "5th floor, UB Platinum building, Peace Avenue, Bayangol district, Ulaanbaatar 16052, Mongolia",
};

export const vision =
  "We strive to promote healthy lifestyles, technological innovation, and cultural creativity while contributing to the sustainable development of society.";

export const mission =
  "Globalsmart Solution LLC specializes in supplying, installing, and integrating comprehensive solutions for television and broadcasting equipment, film and content production systems, professional audio and video systems, interpretation systems, and public address (PA) systems. We bring leading global brands and technologies to the Mongolian market, delivering high-quality audiovisual solutions, system integration, and installation services.";

export const activities = [
  "Television and broadcasting equipment and solutions",
  "Film and content production equipment and solutions",
  "Professional audio equipment and solutions",
  "Video equipment and solutions",
  "Interpretation and multilingual conference systems",
  "Public address (PA) systems",
];

/** The four directions of the Global Negdel group; GSS belongs to the cultural & creative one. */
export const groupDirections = [
  { title: "Healthy lifestyle", body: "Batteries, air conditioning, health tech products", gss: false },
  {
    title: "Technology innovation",
    body: "Integrated and radio communications, networks, IT infrastructure, surveillance and security, workforce management",
    gss: false,
  },
  {
    title: "Cultural & creative industry",
    body: "Broadcast, film production, professional audio, display systems, conference and collaboration, professional lighting",
    gss: true,
  },
  {
    title: "Sustainable development goals",
    body: "Smart infrastructure, energy-efficient technologies, digital transformation, sustainable growth",
    gss: false,
  },
];

export const approach = [
  {
    title: "Understanding our clients",
    body: "Understanding our clients' objectives and challenges is the foundation of every successful project. We identify requirements clearly to deliver solutions that meet operational and business needs.",
  },
  {
    title: "Design & engineering",
    body: "Using professional audio, video and lighting simulation tools, we design reliable, efficient and tailored solutions that ensure optimal system performance.",
  },
  {
    title: "Installation & commissioning",
    body: "Our team ensures proper installation, integration and testing of all systems, delivering stable operation and minimising risks throughout production and daily use.",
  },
  {
    title: "After-sales support",
    body: "We provide ongoing technical support and maintenance to maximise system performance and protect our clients' investment, building long-term partnerships based on trust and reliability.",
  },
];

export type Milestone = {
  year: string;
  title: string;
  items: string[];
  /** "group" = Global Telecom / Global Negdel before GSS; "gss" = GSS from 2015 */
  era: "group" | "gss";
};

/** Company history, one card per year (from the profile deck). */
export const history: Milestone[] = [
  { year: "1991", era: "group", title: "The beginning", items: ["One of the first IT companies established in Mongolia."] },
  {
    year: "1993",
    era: "group",
    title: "First PBX",
    items: [
      "Imported the first PBX from Panasonic.",
      "Intercom system station: designed and manufactured the first PBX in Mongolia, installed in 21 aimags and 3 cities.",
    ],
  },
  { year: "2001", era: "group", title: "Panasonic", items: ["Established to distribute Panasonic consumer products to the Mongolian market."] },
  { year: "2007", era: "group", title: "Service center", items: ["Established and opened the first Panasonic service center in Mongolia."] },
  { year: "2008", era: "group", title: "Home appliances", items: ["Started to distribute home appliances officially."] },
  {
    year: "2012–2013",
    era: "group",
    title: "TV & broadcasting business",
    items: [
      "Started the broadcast and professional audio-video business.",
      "Transformed the MNB studio and TV master control system into HD.",
    ],
  },
  { year: "2014", era: "group", title: "MNB OB van", items: ["Solution, integration and installation of Mongolia's first fibre-optic camera OB van."] },
  {
    year: "2015",
    era: "gss",
    title: "GSS is founded",
    items: [
      "Global Telecom LLC established GSS to broaden its business scope.",
      "Nomads of the Steppes — The Silk Road: sponsored the Chinese–Mongolian exhibition for the 10th anniversary of archaeological research with Panasonic visual products.",
    ],
  },
  {
    year: "2015–2016",
    era: "gss",
    title: "Content production",
    items: ["Entered the content production business as an official distributor of ARRI, the leading brand of motion picture cameras and lighting."],
  },
  {
    year: "2018",
    era: "gss",
    title: "MNB World & Sennheiser",
    items: [
      "Solution, integration and installation of the audio and video system for MNB's new studio.",
      "Became the official exclusive distributor of Sennheiser.",
    ],
  },
  { year: "2020", era: "gss", title: "Mackie", items: ["Became the official exclusive distributor of Mackie."] },
  { year: "2021", era: "gss", title: "Global Negdel", items: ["Global Negdel was established, bringing together GT, GE, GSS and GTE."] },
  { year: "2022", era: "gss", title: "Music Tribe & Universal Audio", items: ["Became an official authorised distributor of Music Tribe and Universal Audio, leading brands in the audio industry."] },
  { year: "2024", era: "gss", title: "Consumer hearing", items: ["Became an official distributor of Sennheiser–Sonova Consumer Hearing."] },
  { year: "2025", era: "gss", title: "10th anniversary", items: ["GSS celebrated its 10th anniversary."] },
];

export type SolutionText = { title: string; paragraphs: string[]; includes?: string[]; brands: string[] };

export const solutionText: Record<SolutionKey, SolutionText> = {
  broadcast: {
    title: "Broadcast and film",
    paragraphs: [
      "As an authorised distributor of world-renowned manufacturers from Japan, Germany, the United States and other leading markets, we supply professional broadcast, film and studio equipment to the Mongolian market. Our expertise extends beyond product supply, offering end-to-end solutions that support every stage of content production and broadcasting.",
      "We work closely with our clients to understand their operational requirements and objectives, enabling us to design and implement tailored systems that deliver optimal performance and reliability. Our services include system design, equipment integration, technical consultation, installation support and after-sales service.",
      "With extensive experience collaborating with television broadcasters, production studios, film companies and media organisations across Mongolia, we have established ourselves as a trusted partner in delivering innovative and future-ready broadcast and film technology solutions.",
    ],
    brands: ["ARRI", "Ross Video", "Panasonic", "Blackmagic Design", "Fujinon", "AJA", "Teradek"],
  },
  audio: {
    title: "Professional audio",
    paragraphs: [
      "We deliver comprehensive professional audio solutions designed to meet the demanding requirements of live entertainment, broadcasting, content production and professional recording environments. Partnering with globally recognised manufacturers, including Sennheiser, we bring industry-leading technologies and world-class audio systems to the Mongolian market.",
      "Our solutions support a wide range of applications, including live performance venues, concert stages, broadcast studios, film and video production, recording facilities, houses of worship, educational institutions and corporate media environments.",
      "From intimate venues to large-scale productions, our solutions are engineered to deliver exceptional audio quality, reliability and operational efficiency. Backed by experienced engineers and industry expertise, we provide end-to-end consultation, system design, implementation and after-sales support to ensure the success of every project.",
    ],
    brands: ["Sennheiser", "Neumann", "Turbosound", "Tannoy", "Midas", "Williams AV", "Lab.gruppen"],
  },
  display: {
    title: "Indoor/outdoor LED, projection, video wall",
    paragraphs: [
      "We provide advanced visual display solutions that enable organisations to deliver impactful and immersive visual experiences. Our professional-grade technologies are engineered for reliability, performance and exceptional image quality across a wide range of applications.",
      "Our solutions serve diverse sectors including broadcasting, live events, corporate environments, education, government institutions, retail, hospitality, command and control centres, and public venues.",
    ],
    brands: ["Panasonic", "Dataton", "Absen", "ITC", "DDW"],
  },
  lighting: {
    title: "Stage and studio lighting",
    paragraphs: [
      "We provide professional lighting solutions for live events, broadcast productions, film productions, television studios, theatres, performance venues and corporate environments.",
      "From concert stages and theatrical productions to television studios and film sets, we provide complete turnkey lighting solutions that combine cutting-edge technology, operational reliability and creative flexibility.",
    ],
    brands: ["Claypaky", "Aputure", "ITC"],
  },
  conference: {
    title: "Conference room and PA",
    paragraphs: [
      "We provide integrated conference room and public address (PA) solutions designed to enhance communication, collaboration and information delivery across corporate, government, educational, hospitality and public-sector environments.",
      "Our solutions are tailored to the specific requirements of each project, ensuring exceptional speech intelligibility, seamless collaboration, intuitive operation and long-term reliability.",
    ],
    includes: [
      "Conference and discussion systems",
      "Video conferencing systems",
      "PTZ and conference cameras",
      "Public address (PA) and voice evacuation systems",
      "Interpretation and language distribution systems",
      "System design, integration, installation and technical support",
    ],
    brands: ["Extron", "Taiden", "TOA", "ITC", "AVer"],
  },
};

/** Site page path → which profile solution text it shows. */
export const solutionPages: Record<string, SolutionKey> = {
  "solutions/proav/broadcast-video-production": "broadcast",
  "solutions/proav/live-audio": "audio",
  "solutions/proav/audio-studio": "audio",
  "solutions/proav/stage-studio-lighting": "lighting",
  "solutions/corporate/displays-led-projection": "display",
  "solutions/corporate/conference-rooms": "conference",
  "solutions/corporate/pa-systems": "conference",
};

export const categoryLabel: Record<SolutionKey, string> = {
  broadcast: "Broadcast & film",
  audio: "Professional audio",
  display: "LED & display",
  lighting: "Lighting",
  conference: "Conference & PA",
};

export type Project = {
  id: number;
  name: string;
  customer?: string;
  year: number;
  place: string;
  brands: string[];
  category: SolutionKey;
};

const UB = "Ulaanbaatar";

export const projects: Project[] = [
  { id: 1, name: "Supply and installation of master control room equipment", customer: "Mongolian National Broadcaster", year: 2013, place: UB, brands: ["Panasonic", "Ross Video"], category: "broadcast" },
  { id: 2, name: "Supply and installation of newsroom equipment", customer: "Mongolian National Broadcaster", year: 2013, place: UB, brands: ["Panasonic", "Ross Video"], category: "broadcast" },
  { id: 3, name: "HD outside broadcasting van", customer: "Mongolian National Broadcaster", year: 2014, place: UB, brands: ["Panasonic"], category: "broadcast" },
  { id: 4, name: "Supply and installation of master control room equipment", customer: "SBN TV", year: 2014, place: UB, brands: ["Ross Video"], category: "broadcast" },
  { id: 5, name: "Supply and installation of professional displays", customer: "Education TV", year: 2015, place: UB, brands: ["Panasonic"], category: "display" },
  { id: 6, name: "Supply of a professional broadcast camera system", customer: "Mongol HD TV", year: 2015, place: UB, brands: ["Panasonic"], category: "broadcast" },
  { id: 7, name: "Supply and installation of a public address system", customer: "National University of Mongolia", year: 2016, place: UB, brands: ["Inter-M"], category: "conference" },
  { id: 8, name: "Supply and installation of a public address system", customer: "New Airport", year: 2016, place: UB, brands: ["Inter-M"], category: "conference" },
  { id: 9, name: "Supply and installation of a lighting system", customer: "Mongolian National Broadcaster", year: 2017, place: UB, brands: ["Canara Lighting"], category: "lighting" },
  { id: 10, name: "Supply and installation of a video wall", customer: "Mongolian National University", year: 2020, place: UB, brands: ["DDW"], category: "display" },
  { id: 11, name: "Supply and installation of LED", customer: "Government Palace", year: 2020, place: UB, brands: ["DDW"], category: "display" },
  { id: 12, name: "Broadcast system solution", customer: "Central TV", year: 2021, place: UB, brands: ["Ross Video", "Panasonic", "Blackmagic Design", "Clear-Com", "Sennheiser", "Canare", "Crestron"], category: "broadcast" },
  { id: 13, name: "Broadcast camera and audio system", customer: "Central TV", year: 2022, place: UB, brands: ["Panasonic", "Turbosound", "Sound Devices", "Sennheiser"], category: "broadcast" },
  { id: 14, name: "Studio camera system", customer: "Bloomberg TV Mongolia", year: 2022, place: UB, brands: ["Fujinon", "Panasonic"], category: "broadcast" },
  { id: 15, name: "Audio and visual systems for the digital exhibition on floors 3–8", customer: "Chinggis Khaan National Museum", year: 2022, place: UB, brands: ["Panasonic", "Watchout", "Holosonic"], category: "display" },
  { id: 16, name: "Studio camera setup and audio system", customer: "Ulaanbaatar Broadcasting System", year: 2022, place: UB, brands: ["Blackmagic Design", "Midas", "Sennheiser"], category: "broadcast" },
  { id: 17, name: "Supply and installation of broadcast television equipment", customer: "Tenger TV", year: 2022, place: UB, brands: ["Blackmagic Design", "Panasonic", "Midas", "Sennheiser"], category: "broadcast" },
  { id: 18, name: "Event hall AV system", customer: "Dostyk Restaurant", year: 2022, place: "Bayan-Ölgii", brands: ["Turbosound", "Midas", "Sennheiser", "ITC"], category: "audio" },
  { id: 19, name: "Supply and installation of a broadcast system", customer: "Premier Sports Network", year: 2023, place: UB, brands: ["Ross Video", "AJA", "Blackmagic Design", "Panasonic", "Canare"], category: "broadcast" },
  { id: 20, name: "Supply of a broadcast camera system", customer: "TM Television", year: 2024, place: UB, brands: ["Blackmagic Design", "Fujinon", "X-Pert", "YoloLiv"], category: "broadcast" },
  { id: 21, name: "Hyper-converged broadcast system", year: 2024, place: UB, brands: ["Ross Video", "Panasonic", "Blackmagic Design", "Midas"], category: "broadcast" },
  { id: 22, name: "Audio conference system", customer: "World Bank", year: 2025, place: UB, brands: ["Taiden"], category: "conference" },
  { id: 23, name: "Indoor and outdoor LED system", customer: "Eco Car", year: 2025, place: UB, brands: ["ITC"], category: "display" },
  { id: 24, name: "Video system", customer: "Supreme Court of Mongolia", year: 2025, place: UB, brands: ["Blackmagic Design"], category: "broadcast" },
  { id: 25, name: "E-sport broadcast system", customer: "ESN Television", year: 2025, place: UB, brands: ["Blackmagic Design", "Sennheiser", "Clear-Com"], category: "broadcast" },
];

export const events = [
  { id: 1, title: "Experience the ARRI", year: 2022 },
  { id: 2, title: "Ross Broadcast System video event", year: 2022 },
  { id: 3, title: "GSS Pro Audio", year: 2022 },
  { id: 4, title: "Sennheiser & Neumann technical seminar", year: 2023 },
  { id: 5, title: "GSS Audio Event", year: 2024 },
  { id: 6, title: "Culture and Arts Expo", year: 2024 },
  { id: 7, title: "Sennheiser technical seminar", year: 2024 },
  { id: 8, title: "Playtime", year: 2025 },
];

export const projectImage = (id: number) => `/profile/project-${String(id).padStart(2, "0")}.jpg`;
export const eventImage = (id: number, n: 1 | 2 | 3) => `/profile/event-${id}-${n}.jpg`;
