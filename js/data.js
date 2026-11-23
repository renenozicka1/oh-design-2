/* =========================================================
   oh design — content (EN + CS)
   Everything editable lives here: services, prices, projects, team.
   ========================================================= */
window.OH = window.OH || {};

/* the "oh" mark, traced from oh design.ai (viewBox 0 0 954.62 1063.62) */
OH.LOGO = {
  w: 954.62,
  h: 1063.62,
  d: 'M373.71 655.33C317.97 680.08 277.15 718.57 245.78 765.33C221.07 808.24 206.49 854.76 207.03 904.13C207.60 956.41 237.88 996.58 286.46 1014.56C326.70 1029.45 369.04 1032.00 412.89 1031.46C482.93 1030.60 549.04 1014.93 609.79 980.20C697.21 930.22 756.57 834.65 749.36 733.54C740.98 615.83 584.92 609.44 482.92 623.19L461.69 711.27C458.26 725.51 459.94 742.05 461.94 756.18C474.16 797.76 532.49 789.45 576.32 775.40L568.65 810.16L507.71 833.40C478.77 844.43 448.09 850.51 417.53 846.39C375.16 840.69 348.47 806.09 351.44 763.09C353.96 726.64 366.05 692.85 373.71 655.33ZM389.10 601.43L419.55 482.87C425.66 459.13 427.78 435.29 424.72 411.63C418.89 379.17 394.49 356.53 361.18 356.35C301.73 356.02 245.84 397.40 205.98 441.29L150.56 682.81C225.54 640.40 304.78 616.27 389.10 601.43ZM437.93 1063.72L320.20 1063.62C231.96 1058.35 113.29 1037.90 47.77 973.70C17.39 943.93 0.00 899.51 10.02 856.05L178.68 124.42C182.75 106.76 182.82 89.79 175.85 74.25C169.90 61.00 154.22 52.51 140.37 50.81L92.43 44.94L100.44 12.56L297.70 0.00C300.24 0.01 306.58 6.52 305.92 9.39L219.86 382.92C250.52 361.08 276.27 340.44 306.96 322.66C350.75 297.28 400.54 286.56 450.40 295.37C493.48 302.98 523.97 335.52 529.62 379.37C533.68 410.94 529.36 443.67 521.23 475.25L492.23 587.99C597.72 581.68 709.38 582.60 809.53 617.32C870.12 638.32 939.36 681.61 946.82 747.08C954.62 815.61 919.94 874.08 869.75 919.49C773.79 1006.30 607.66 1051.43 479.50 1060.71L437.93 1063.72Z'
};

/* every text is { en, cs } — OH.t() picks the active language */

OH.STUDIO = {
  name: 'OH DESIGN',
  mail: 'ondrej@ohdesign.eu',
  city: { en: 'Prague, Czech Republic', cs: 'Praha, Česká republika' },
  about: {
    en: 'oh design is a small studio in Prague. We design brand identities, websites and motion — and build them too, from the first sketch to the last line of code. You talk directly to the people doing the work.',
    cs: 'oh design je malé studio v Praze. Navrhujeme vizuální identity, weby a motion — a sami je i stavíme, od první skici po poslední řádek kódu. Mluvíte přímo s lidmi, kteří na vaší zakázce pracují.'
  },
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/ohdesign.eu/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/145196213/' }
  ],
  team: [
    { name: 'Ondřej Hladík', role: { en: 'CEO, graphic & web designer, photographer', cs: 'CEO, grafický a webový designér, fotograf' }, photo: 'img/team/ondrej.webp', mail: 'ondrej@ohdesign.eu', tel: '+420 777 071 179' },
    { name: 'René Nožička', role: { en: 'Co-CEO, marketing, motion designer', cs: 'Co-CEO, marketing, motion designér' }, photo: 'img/team/rene.webp', mail: 'rene@ohdesign.eu', tel: '+420 723 823 998' }
  ],
  /* reasons that hold for every service — no invented numbers */
  why: [
    { en: 'You talk directly to the designers. No account managers in between.', cs: 'Mluvíte přímo s designéry. Žádní account manažeři mezi námi.' },
    { en: 'Design and code from one studio — what we draw is what gets built.', cs: 'Design i kód z jednoho studia — co navrhneme, to i postavíme.' },
    { en: 'One visual language across your brand, web and social.', cs: 'Jeden vizuální jazyk napříč značkou, webem i sociálními sítěmi.' },
    { en: 'Based in Prague, working with clients anywhere.', cs: 'Sídlíme v Praze, pracujeme s klienty odkudkoli.' }
  ]
};

/* the landing row (oh design.ai, slide 3), in this order */
OH.CATEGORIES = [
  { slug: 'motion-design', label: { en: 'Motion design', cs: 'Motion design' } },
  { slug: 'onesto-beta', label: { en: 'Onesto beta', cs: 'Onesto beta' } },
  { slug: 'brand-identity', label: { en: 'Brand identity', cs: 'Vizuální identita' } },
  { slug: 'web-design', label: { en: 'web design', cs: 'tvorba webu' } }
];

/* one pitch page per category (#/s/<slug>) */
OH.SERVICES = {
  'brand-identity': {
    head: { en: 'A brand people remember after the first look.', cs: 'Značka, kterou si lidé zapamatují na první pohled.' },
    intro: {
      en: 'Logo, colours, type and everything they live on — cards, print, social, signage. One system, so every place your customers meet you looks like you.',
      cs: 'Logo, barvy, písmo a všechno, na čem budou žít — vizitky, tiskoviny, sociální sítě, cedule. Jeden systém, aby všude, kde vás zákazníci potkají, jste to byli vy.'
    },
    get: [
      { en: 'Logo and monogram', cs: 'Logo a monogram' },
      { en: 'Colour palette and typography', cs: 'Barevná paleta a typografie' },
      { en: 'Business cards, print and stationery', cs: 'Vizitky, tiskoviny a merkantil' },
      { en: 'Templates for social media', cs: 'Šablony pro sociální sítě' },
      { en: 'Photography and brand imagery', cs: 'Fotografie a obrazový styl' },
      { en: 'Brand manual with all the files', cs: 'Manuál značky se všemi soubory' }
    ],
    price: [
      { name: { en: 'Brand identity', cs: 'Vizuální identita' }, value: { en: 'Individual', cs: 'Individuálně' }, note: { en: 'Priced after a short call, to what you actually need.', cs: 'Cenu určíme po krátkém hovoru podle toho, co opravdu potřebujete.' } }
    ],
    faq: [
      { q: { en: 'I don’t know exactly what I want yet. Is that a problem?', cs: 'Ještě přesně nevím, co chci. Vadí to?' }, a: { en: 'Not at all. Finding the direction is the first part of the job — we start with a call and a few visual directions to react to.', cs: 'Vůbec ne. Najít směr je první část práce — začneme hovorem a několika vizuálními směry, ke kterým se můžete vyjádřit.' } },
      { q: { en: 'Can you refresh an existing logo instead of starting over?', cs: 'Umíte upravit stávající logo místo úplně nového?' }, a: { en: 'Yes. If your brand already has value, we keep what works and fix what doesn’t.', cs: 'Ano. Pokud už vaše značka něco znamená, necháme, co funguje, a opravíme, co ne.' } },
      { q: { en: 'Can you also do the website?', cs: 'Uděláte nám i web?' }, a: { en: 'Yes — brand and web from one studio is what we do best.', cs: 'Ano — značka i web z jednoho studia je to, co umíme nejlíp.' } }
    ]
  },
  'web-design': {
    head: { en: 'A website that keeps working while you sleep.', cs: 'Web, který pro vás pracuje, i když spíte.' },
    intro: {
      en: 'We design and code your website ourselves — fast, clear on every phone and built around what your visitors should do next: call, book, buy or write.',
      cs: 'Web navrhneme i naprogramujeme sami — rychlý, přehledný na každém mobilu a postavený kolem toho, co má návštěvník udělat: zavolat, rezervovat, koupit nebo napsat.'
    },
    get: [
      { en: 'Design made for your brand, no templates', cs: 'Design na míru vaší značce, žádné šablony' },
      { en: 'Works on every phone, tablet and screen', cs: 'Funguje na každém mobilu, tabletu i monitoru' },
      { en: 'Contact, booking or order forms', cs: 'Kontaktní, rezervační nebo objednávkové formuláře' },
      { en: 'Search basics and fast loading', cs: 'Základy SEO a rychlé načítání' },
      { en: 'Launch on your domain', cs: 'Spuštění na vaší doméně' },
      { en: 'Edit it yourself later in Onesto', cs: 'Později si ho upravíte sami v Onestu' }
    ],
    price: [
      { name: { en: 'Website design', cs: 'Design webu' }, value: { en: 'from 7 000 CZK', cs: 'od 7 000 Kč' }, note: { en: 'The final price depends on the number of pages and features.', cs: 'Výsledná cena záleží na počtu stránek a funkcí.' } },
      { name: { en: 'Onesto subscription', cs: 'Předplatné Onesto' }, value: { en: 'Individual', cs: 'Individuálně' }, note: { en: 'Edit texts, photos and posts yourself in our app.', cs: 'Texty, fotky a příspěvky si upravujete sami v naší aplikaci.' } }
    ],
    faq: [
      { q: { en: 'How long does a website take?', cs: 'Jak dlouho výroba webu trvá?' }, a: { en: 'It depends on the size — we give you a timeline right after the first call.', cs: 'Záleží na rozsahu — termín vám řekneme hned po prvním hovoru.' } },
      { q: { en: 'Can I change the texts myself later?', cs: 'Můžu si potom sám měnit texty?' }, a: { en: 'Yes. With an Onesto subscription you edit texts, photos and posts yourself, without code.', cs: 'Ano. S předplatným Onesto si texty, fotky i příspěvky měníte sami, bez programování.' } },
      { q: { en: 'Do you handle the domain and hosting?', cs: 'Postaráte se o doménu a hosting?' }, a: { en: 'We help you set them up and launch the site on your own domain.', cs: 'Pomůžeme vám je nastavit a web spustíme na vaší doméně.' } }
    ]
  },
  'motion-design': {
    head: { en: 'Motion that makes people stop scrolling.', cs: 'Pohyb, u kterého lidé přestanou scrollovat.' },
    intro: {
      en: 'Animated logos, reels, short videos and explainers that carry your brand into the feed — made to be watched, not skipped.',
      cs: 'Animovaná loga, reels, krátká videa a vysvětlující animace, které přenesou vaši značku do feedu — aby se na ně lidé dívali, ne je přeskakovali.'
    },
    get: [
      { en: 'Logo animation', cs: 'Animace loga' },
      { en: 'Reels and videos for social media', cs: 'Reels a videa na sociální sítě' },
      { en: 'Explainers for products and services', cs: 'Vysvětlující animace produktů a služeb' },
      { en: 'Kinetic type and visual experiments', cs: 'Animovaná typografie a vizuální experimenty' },
      { en: 'Motion for websites', cs: 'Pohyb a animace pro weby' }
    ],
    price: [
      { name: { en: 'Motion design', cs: 'Motion design' }, value: { en: 'Individual', cs: 'Individuálně' }, note: { en: 'Priced per project after a short call.', cs: 'Cenu určíme podle projektu po krátkém hovoru.' } }
    ],
    faq: [
      { q: { en: 'Which formats do you deliver?', cs: 'V jakých formátech videa dodáte?' }, a: { en: 'Whatever you need — vertical for reels and stories, square, or widescreen for web and presentations.', cs: 'V jakých potřebujete — na výšku pro reels a stories, čtverec nebo na šířku pro web a prezentace.' } },
      { q: { en: 'Can you animate a logo someone else designed?', cs: 'Rozpohybujete i logo, které navrhl někdo jiný?' }, a: { en: 'Yes, send us the files and we’ll take it from there.', cs: 'Ano, pošlete nám podklady a o zbytek se postaráme.' } }
    ]
  },
  'onesto-beta': {
    beta: true,
    head: { en: 'Your website, edited by you.', cs: 'Váš web, upravujete vy.' },
    intro: {
      en: 'Onesto is our own app, now in preparation. Once we build your website, you will be able to change texts, swap photos and publish new posts yourself — no code and no waiting for us.',
      cs: 'Onesto je naše vlastní aplikace, kterou právě připravujeme. Až vám postavíme web, budete si v ní texty, fotky i nové příspěvky měnit a přidávat sami — bez programování a bez čekání na nás.'
    },
    get: [
      { en: 'Edit texts and photos in a few clicks', cs: 'Úprava textů a fotek na pár kliknutí' },
      { en: 'Publish posts, news and events', cs: 'Přidávání příspěvků, novinek a akcí' },
            { en: 'Your design stays as we built it', cs: 'Design zůstane tak, jak jsme ho postavili' },
      { en: 'We’re on hand when you need more', cs: 'Když potřebujete víc, jsme po ruce' }
    ],
    price: [
      { name: { en: 'Onesto subscription', cs: 'Předplatné Onesto' }, value: { en: 'Individual', cs: 'Individuálně' }, note: { en: 'Priced individually for your website.', cs: 'Cenu stanovíme individuálně podle vašeho webu.' } },
      { name: { en: 'Website design', cs: 'Design webu' }, value: { en: 'from 7 000 CZK', cs: 'od 7 000 Kč' }, note: { en: 'Onesto runs on websites we design and build.', cs: 'Onesto běží na webech, které navrhneme a postavíme.' } }
    ],
    faq: [
      { q: { en: 'Can I use Onesto with my current website?', cs: 'Můžu Onesto použít se svým současným webem?' }, a: { en: 'Onesto runs on websites we build. If you already have one, we can rebuild it so you can edit it yourself.', cs: 'Onesto běží na webech, které stavíme my. Pokud už web máte, můžeme ho předělat tak, abyste si ho upravovali sami.' } },
      { q: { en: 'When can I start using it?', cs: 'Kdy ho budu moct používat?' }, a: { en: 'Onesto is in preparation. Leave us a message and we’ll let you know as soon as it’s ready for your website.', cs: 'Onesto právě připravujeme. Napište nám a ozveme se, jakmile bude připravené pro váš web.' } }
    ]
  }
};

/* how working with us goes — shared by every service page */
OH.STEPS = [
  { t: { en: 'Call', cs: 'Hovor' }, d: { en: 'A free 30-minute call. You tell us what you need, we ask the right questions.', cs: 'Nezávazný 30minutový hovor. Řeknete nám, co potřebujete, my se doptáme na to důležité.' } },
  { t: { en: 'Offer', cs: 'Nabídka' }, d: { en: 'A clear scope, price and timeline. No surprises later.', cs: 'Jasný rozsah, cena a termín. Žádná překvapení později.' } },
  { t: { en: 'Design', cs: 'Návrh' }, d: { en: 'We show you directions early and refine the chosen one together with you.', cs: 'Směry vám ukážeme brzy a ten vybraný doladíme společně s vámi.' } },
  { t: { en: 'Launch', cs: 'Předání' }, d: { en: 'Final files, a live website or ready-to-post videos — everything you need to use it.', cs: 'Finální soubory, spuštěný web nebo videa připravená k publikování — vše, co potřebujete.' } }
];

/* interface words */
OH.UI = {
  services: { en: 'Services', cs: 'Služby' },
  about: { en: 'About', cs: 'O nás' },
  talk: { en: 'Let’s talk', cs: 'Napište nám' },
  view: { en: 'View project', cs: 'Zobrazit projekt' },
  selected: { en: 'Selected work', cs: 'Vybrané práce' },
  youGet: { en: 'What you get', cs: 'Co dostanete' },
  how: { en: 'How it works', cs: 'Jak to probíhá' },
  pricing: { en: 'Pricing', cs: 'Ceník' },
  why: { en: 'Why us', cs: 'Proč my' },
  team: { en: 'Who you work with', cs: 'S kým budete pracovat' },
  faq: { en: 'FAQ', cs: 'Časté dotazy' },
  contact: { en: 'Contact', cs: 'Kontakt' },
  contactHead: { en: 'Let’s make something good.', cs: 'Pojďme udělat něco dobrého.' },
  contactNote: { en: 'Tell us a little about your project — we reply personally.', cs: 'Napište nám pár slov o svém projektu — odpovíme osobně.' },
  name: { en: 'Name', cs: 'Jméno' },
  email: { en: 'E-mail', cs: 'E-mail' },
  msg: { en: 'What are you working on?', cs: 'Na čem pracujete?' },
  send: { en: 'Send', cs: 'Odeslat' },
  other: { en: 'Looking for something else?', cs: 'Hledáte něco jiného?' },
  beta: { en: 'In preparation — register your interest', cs: 'Připravujeme — dejte nám vědět, že máte zájem' },
  early: { en: 'I’m interested', cs: 'Mám zájem' },
  bookCall: { en: 'Book a free call', cs: 'Domluvit hovor zdarma' },
  seeWork: { en: 'See the work', cs: 'Ukázky práce' },
  description: { en: 'Description', cs: 'Popis' },
  details: { en: 'Details', cs: 'Detaily' },
  category: { en: 'Category', cs: 'Kategorie' },
  credits: { en: 'Credits', cs: 'Autoři' },
  link: { en: 'Link', cs: 'Odkaz' },
  next: { en: 'Next project', cs: 'Další projekt' },
  similar: { en: 'Want something like this?', cs: 'Chcete něco podobného?' },
  studio: { en: 'Studio', cs: 'Studio' },
  whatWeDo: { en: 'What we do', cs: 'Co děláme' },
  newProjects: { en: 'New projects', cs: 'Nové projekty' },
  phone: { en: 'Phone', cs: 'Telefon' },
  social: { en: 'Social', cs: 'Sítě' },
  based: { en: 'Based in', cs: 'Sídlo' },
  sayHi: { en: 'Say hello', cs: 'Napište nám' },
  haveProject: { en: 'Have a project in mind?', cs: 'Máte projekt?' },
  formSent: { en: 'Your e-mail app is opening…', cs: 'Otevírá se váš e-mailový klient…' },
  from: { en: 'from', cs: 'od' },
  back: { en: 'Back', cs: 'Zpět' }
};

/* cats: which services a project belongs to (edit freely) */
OH.PROJECTS = [
  {
    slug: 'checkpoint',
    title: ['Checkpoint', 'Game'],
    kind: { en: 'Web game', cs: 'Webová hra' },
    cats: ['web-design', 'motion-design'],
    cover: 'img/checkpoint/checkpoint-cover-1200.webp',
    thumb: 'img/checkpoint/checkpoint-cover-720.webp',
    hero: 'img/checkpoint/checkpoint-cover-1800.webp',
    web: 'https://checkpointgame.eu/', webLabel: 'checkpointgame.eu',
    desc: {
      en: [
        'Checkpoint is a browser game built for the album of the same name by Dorian Wave: a retro pixel-art drive that starts in night-time Prague and does not stop until Pattaya, with petrol stations along the way and a leaderboard at the end.',
        'Everything on screen is drawn as pixel art and then pushed through a green-on-black dot raster, so the whole thing reads like a dying CRT — the car, the city blocks, the billboards, the vodka poster in the fridge and the gas-station shield with its galloping horse. Between stages the game cuts to illustrated scenes with voice acting, and the soundtrack is the album itself.',
        'In its first week people played it more than 14 000 times.'
      ],
      cs: [
        'Checkpoint je prohlížečová hra k albu Doriana Wavea se stejným názvem: retro pixel-artová jízda, která začíná v noční Praze a končí až v Pattayi — s benzinkami po cestě a žebříčkem na konci.',
        'Všechno na obrazovce je kreslené v pixel artu a prohnané zeleno-černým bodovým rastrem, takže celá hra působí jako dodýchávající CRT obrazovka — auto, bloky domů, billboardy, plakát s vodkou v lednici i štít benzinky s cválajícím koněm. Mezi úrovněmi hra střihá na ilustrované scény s namluvenými hlasy a soundtrackem je samotné album.',
        'Za první týden ji lidé hráli víc než 14 000krát.'
      ]
    },
    credits: { en: ['Game by Ondřej Hladík and @madebyt8v', 'Made for Dorian Wave and LBCXONLY', 'Music and voice acting by Dorian Wave, mixed by @mixedbydorian'], cs: ['Hra: Ondřej Hladík a @madebyt8v', 'Pro Dorian Wave a LBCXONLY', 'Hudba a hlasy: Dorian Wave, mix @mixedbydorian'] },
    shots: [
      { img: 'img/checkpoint/title.webp', wide: true },
      { img: 'img/checkpoint/drive.webp', wide: true },
      { img: 'img/checkpoint/fridge.webp', wide: true },
      { img: 'img/checkpoint/shield.webp', wide: true },
      { img: 'img/checkpoint/vodka.webp' },
      { img: 'img/checkpoint/preview-anim.webp' }
    ]
  },
  {
    slug: 'mishmash',
    title: ['Mish', 'Mash'],
    kind: { en: 'Identity & website', cs: 'Identita a web' },
    cats: ['brand-identity', 'web-design'],
    cover: 'img/mishmash/mishmash-cover-1200.webp',
    thumb: 'img/mishmash/mishmash-cover-720.webp',
    hero: 'img/mishmash/mishmash-cover-1800.webp',
    web: 'https://mish-mash.cz/', webLabel: 'mish-mash.cz',
    desc: {
      en: [
        'Mish Mash is a six-piece band from Prague that, as their own line puts it, mixes everything together. We made them a visual identity that can take the same liberty — and then designed and built the website that carries it.',
        'The wordmark is drawn as two stacked blocks of soft-cornered letters locked into one solid shape, so it reads as a single object rather than a line of type. Pulling the M and the X out of it gives a square monogram for profile pictures and stickers. Instead of one fixed colour pair, the logo comes as a set: each version splits the lettering diagonally between two colours, so the band can pick whichever pair fits a poster or a release.',
        'The site keeps that logic — concerts, members, releases, photos and a booking form, all on black with the colour coming from the identity.'
      ],
      cs: [
        'Mish Mash je šestičlenná kapela z Prahy, která — jak sami říkají — míchá všechno dohromady. Navrhli jsme jim vizuální identitu, která si dovolí totéž, a pak i web, který ji nese.',
        'Logotyp tvoří dva bloky písmen se zaoblenými rohy spojené do jednoho tvaru, takže působí jako jeden objekt, ne jako řádek textu. Z písmen M a X vznikl čtvercový monogram na profilovky a samolepky. Místo jedné pevné barevné dvojice má logo celou sadu: každá verze dělí písmo diagonálně mezi dvě barvy, takže si kapela vybere tu, která sedí na plakát nebo nové vydání.',
        'Web drží stejnou logiku — koncerty, členové, vydání, fotky a booking formulář, vše na černé a barvy z identity.'
      ]
    },
    credits: { en: ['Visual identity and website by Ondřej Hladík', 'Band photo by Ondřej Hladík'], cs: ['Vizuální identita a web: Ondřej Hladík', 'Foto kapely: Ondřej Hladík'] },
    shots: [
      { img: 'img/mishmash/band.webp', wide: true },
      { img: 'img/mishmash/logo.webp' },
      { img: 'img/mishmash/monogram.webp' },
      { img: 'img/mishmash/colours.webp', wide: true },
      { img: 'img/mishmash/web-hero.webp', wide: true },
      { img: 'img/mishmash/web-photos.webp' },
      { img: 'img/mishmash/web-mobile.webp' }
    ]
  },
  {
    slug: 'live-district',
    title: ['Live', 'District'],
    kind: { en: 'Website', cs: 'Web' },
    cats: ['web-design'],
    cover: 'img/live-district/ld-mockup.webp',
    thumb: 'img/live-district/ld-roster.webp',
    hero: 'img/live-district/ld-mockup.webp',
    web: 'https://livedistrict.cz/', webLabel: 'livedistrict.cz',
    desc: {
      en: [
        'Live District is a booking and management agency for the current Czech rap scene. The website had one job: make a roster of street artists feel as sharp and professional as the music business they are stepping into — without losing any of the edge.',
        'We designed and built the whole thing front to back. A full-bleed hero video sets the tone, a bold Helvetica-driven type system carries the artists\' names, and every act gets its own page — bio, links and video — held together by one consistent black-and-white identity.',
        'Beyond the look, it is a real working site: a live event calendar, the full artist roster, a booking inquiry form, and image loading that adapts to the visitor\'s connection speed. Design and code, shipped as one.'
      ],
      cs: [
        'Live District je bookingová a manažerská agentura současné české rapové scény. Web měl jediný úkol: aby soupiska pouličních umělců působila stejně ostře a profesionálně jako hudební byznys, do kterého vstupují — a přitom neztratila nic ze své syrovosti.',
        'Celý web jsme navrhli i postavili. Tón udává video přes celou obrazovku, jména umělců nese výrazná typografie postavená na Helvetice a každý interpret má vlastní stránku — bio, odkazy a video — spojenou jednotnou černobílou identitou.',
        'Kromě vzhledu je to i opravdu funkční web: kalendář akcí, kompletní soupiska umělců, poptávkový formulář na booking a načítání obrázků, které se přizpůsobí rychlosti připojení. Design i kód v jednom.'
      ]
    },
    credits: { en: ['Website by Ondřej Hladík', 'Logo by Tadeáš Vávra'], cs: ['Web: Ondřej Hladík', 'Logo: Tadeáš Vávra'] },
    shots: [
      { img: 'img/live-district/ld-mockup.webp', wide: true },
      { img: 'img/live-district/ld-roster.webp' },
      { img: 'img/live-district/ld-logo-tile.svg' },
      { video: 'img/live-district/ld-recording.mp4', wide: true },
      { img: 'img/live-district/ld-dorian-page.webp', wide: true }
    ]
  },
  {
    slug: 'masaze',
    title: ['Massage', 'Kostelec'],
    kind: { en: 'Brand identity', cs: 'Vizuální identita' },
    cats: ['brand-identity', 'motion-design'],
    cover: 'img/masaze/massage-hands-1200.webp',
    thumb: 'img/masaze/massage-hands-720.webp',
    hero: 'img/masaze/massage-hands.webp',
    web: 'https://masazekostelec.cz/', webLabel: 'masazekostelec.cz',
    desc: {
      en: [
        'Massage Kostelec is a small massage studio run by Jana Hladíková — a mobile masseuse who brings reconditioning and relaxation massage to wherever you feel most at ease. The brief was to give that calm, personal service a visual identity of its own.',
        'The identity grows from one quiet mark — a sun rising over a soft wave — that carries the studio\'s promise: awakening body and mind through touch. Around it sits a warm, earthy palette of cream, terracotta and olive, with a gentle lowercase wordmark that never raises its voice.',
        'We carried that mood across the whole system — business cards, gift vouchers and print — and shot the photography to match: low, honest light, a single orchid, and the stillness of the treatment room.'
      ],
      cs: [
        'Masáže Kostelec je malé masérské studio Jany Hladíkové — mobilní masérky, která rekondiční a relaxační masáže přiveze tam, kde se cítíte nejlépe. Úkolem bylo dát téhle klidné, osobní službě vlastní vizuální identitu.',
        'Identita vychází z jedné tiché značky — slunce vycházejícího nad měkkou vlnou — která nese slib studia: probudit tělo i mysl dotekem. Kolem ní je teplá zemitá paleta krémové, terakotové a olivové a jemný logotyp v malých písmenech, který nikdy nezvyšuje hlas.',
        'Stejnou náladu jsme přenesli do celého systému — vizitek, dárkových poukazů a tiskovin — a k tomu nafotili fotografie: tlumené, poctivé světlo, jediná orchidej a ticho masérny.'
      ]
    },
    credits: { en: ['Branding by Ondřej Hladík', 'Photos by Ondřej Hladík', 'Motion video by René Nožička'], cs: ['Branding: Ondřej Hladík', 'Fotografie: Ondřej Hladík', 'Motion video: René Nožička'] },
    shots: [
      { img: 'img/masaze/photo-1.webp', wide: true },
      { img: 'img/masaze/brand-1.webp' },
      { img: 'img/masaze/magazine.webp' },
      { img: 'img/masaze/massage-hands.webp', wide: true },
      { video: 'img/masaze/masaze.mp4' },
      { img: 'img/masaze/photo-2.webp' },
      { img: 'img/masaze/logo-mockup.webp', wide: true }
    ]
  },
  {
    slug: 'klauzury',
    title: ['Semester', 'Project'],
    kind: { en: 'Cassette & website', cs: 'Kazeta a web' },
    cats: ['web-design', 'motion-design'],
    cover: 'img/klauzury/klauzury-cover-1200.webp',
    thumb: 'img/klauzury/klauzury-cover-720.webp',
    hero: 'img/klauzury/klauzury-cover-1800.webp',
    web: 'https://ondrejhladik-ctrl.github.io/klauzury-web/', webLabel: 'github.io/klauzury-web',
    desc: {
      en: [
        'Bezedné noci (Bottomless Nights) is a semester project: a cassette that holds a transcript of dreaming and of waking up again, and a website built to play it. The mood comes from sleepless nights and from the lyrics of the band LUK.',
        'The audio is put together from sounds made on synths and guitar plus field recordings. The artwork follows the same arc as the tape — a deep blue side for the dream and the dark, a pale blue one for the release that comes with morning — printed on a J-card that folds out panel by panel.',
        'The site is built around one idea: nothing is shown as a plain photograph. Every image is redrawn live on canvas as a dot raster, so the cassette, the artwork and even the arrows are made of flickering dots. Click the tape and it starts playing, a short cutscene opens the case, sliders bend the sound, and the J-card unfolds when you click it.'
      ],
      cs: [
        'Bezedné noci jsou semestrální projekt: kazeta s přepisem snění a znovuprobouzení a web, na kterém se dá přehrát. Nálada vychází z probdělých nocí a z textů kapely LUK.',
        'Zvuk je složený ze syntezátorů, kytary a terénních nahrávek. Obal sleduje stejný oblouk jako kazeta — sytě modrá strana pro sen a tmu, světle modrá pro úlevu, která přijde s ránem — a je vytištěný na J-kartě, která se rozkládá panel po panelu.',
        'Web stojí na jediné myšlence: nic se neukazuje jako obyčejná fotka. Každý obrázek se živě překresluje na canvasu do bodového rastru, takže kazeta, obal i šipky jsou z blikajících teček. Kliknete na pásku a začne hrát, krátká animace otevře obal, posuvníky ohýbají zvuk a J-karta se po kliknutí rozloží.'
      ]
    },
    credits: { en: ['Cassette, artwork, sound and website by Ondřej Hladík'], cs: ['Kazeta, obal, zvuk a web: Ondřej Hladík'] },
    shots: [
      { video: 'img/klauzury/klauzury-web.mp4' },
      { video: 'img/klauzury/tape.mp4' },
      { img: 'img/klauzury/art-dark.webp', wide: true },
      { img: 'img/klauzury/art-light.webp', wide: true }
    ]
  },
  {
    slug: 'skola',
    title: ['Primary School', 'Mural'],
    kind: { en: 'Illustration', cs: 'Ilustrace' },
    cats: ['brand-identity'],
    cover: 'img/skola/skola-cover-1200.webp',
    thumb: 'img/skola/skola-cover-720.webp',
    hero: 'img/skola/skola-cover-1600.webp',
    web: 'https://newhow.archi/cs/projekty/novy-pavilon-zs-kostelec-u-krizku-kostelec-u-krizku-2020/', webLabel: 'newhow.archi',
    desc: {
      en: [
        'The primary school in Kostelec u Křížků is getting a new pavilion — a dining hall and a gym designed by NEW HOW architekti, tucked behind the old school with a roofline of three gables stepping down into the garden. The architects planned a plain white facade; our job was to give it a story.',
        'We drew the village’s history as a set of line pictograms: Benedictine monks visiting Kalifáč, the laying of the foundation stone of St Martin’s rotunda and the rotunda itself, Josef Ringhoffer’s first copper hammer mill on the Kamenice brook, and horses that traded farm work for sport. One violet, one continuous outline per scene, with a few solid accents — so the whole wall reads as a single drawing wrapping around the windows.',
        'The rearing horse became the mark of the set: a solid version that stands on its own, in the same violet and the acid yellow-green of the presentation.'
      ],
      cs: [
        'Základní škola v Kostelci u Křížků dostává nový pavilon — jídelnu a tělocvičnu od NEW HOW architekti, schovanou za starou školou se střechou ze tří štítů, které se schodovitě sklánějí do zahrady. Architekti počítali s bílou fasádou; naším úkolem bylo dát jí příběh.',
        'Historii obce jsme nakreslili jako sadu liniových piktogramů: benediktinští mniši na Kalifáči, položení základního kamene rotundy sv. Martina i rotunda samotná, první měděný hamr Josefa Ringhoffera na potoce Kamenice a koně, kteří vyměnili práci na poli za sport. Jedna fialová, jedna souvislá linka na scénu a pár plných akcentů — takže celá stěna působí jako jediná kresba obtékající okna.',
        'Vzpínající se kůň se stal znakem celé sady: plná verze, která obstojí i samostatně, ve stejné fialové a kyselé žlutozelené z prezentace.'
      ]
    },
    credits: { en: ['Illustrations by Ondřej Hladík', 'Architecture & visualisation by NEW HOW architekti'], cs: ['Ilustrace: Ondřej Hladík', 'Architektura a vizualizace: NEW HOW architekti'] },
    shots: [
      { img: 'img/skola/skola-elevation.webp', wide: true },
      { img: 'img/skola/skola-horse.webp' },
      { img: 'img/skola/skola-render-1200.webp' },
      { img: 'img/skola/skola-sheet.webp', wide: true }
    ]
  },
  {
    slug: 'molo-lipno',
    title: ['Molo', 'Lipno'],
    kind: { en: 'Photography', cs: 'Fotografie' },
    cats: ['brand-identity'],
    cover: 'img/molo-lipno/molo-5-1200.webp',
    thumb: 'img/molo-lipno/molo-5-720.webp',
    hero: 'img/molo-lipno/molo-5.webp',
    desc: {
      en: [
        'Molo Lipno is a resort on the shore of Lipno lake, where every apartment is built around the same warm palette — oak, bouclé and low, honest light. The brief was simple: photograph the interiors so they feel the way the rooms actually feel when you walk in.',
        'Everything was shot in available light, waiting for the sun to come through the sheer curtains rather than fighting it with flash. Straight-on frames hold the architecture — the kitchen line, the slatted oak wall behind the bed — while tighter shots pick up the details that give the place its character.',
        'The set closes on two frames that step away from the room itself: a wall light read as pure geometry, and one long exposure where the interior dissolves into colour and movement.'
      ],
      cs: [
        'Molo Lipno je resort na břehu Lipna, kde je každý apartmán postavený na stejné teplé paletě — dub, bouclé a tlumené, poctivé světlo. Zadání bylo jednoduché: nafotit interiéry tak, aby působily stejně, jako když do nich opravdu vejdete.',
        'Všechno jsme fotili při dostupném světle — raději jsme čekali, až slunce projde záclonami, než abychom s ním bojovali bleskem. Čelní záběry drží architekturu — linku kuchyně, lamelovou dubovou stěnu za postelí — a detailnější záběry zachycují to, co místu dává charakter.',
        'Sérii uzavírají dva snímky, které od pokoje odstoupí: nástěnné světlo jako čistá geometrie a jedna dlouhá expozice, ve které se interiér rozpustí v barvu a pohyb.'
      ]
    },
    credits: { en: ['Photos by Ondřej Hladík'], cs: ['Fotografie: Ondřej Hladík'] },
    shots: [
      { img: 'img/molo-lipno/molo-1.webp', wide: true },
      { img: 'img/molo-lipno/molo-2.webp' },
      { img: 'img/molo-lipno/molo-5.webp' },
      { img: 'img/molo-lipno/molo-4.webp', wide: true },
      { img: 'img/molo-lipno/molo-3.webp', wide: true }
    ]
  },
  {
    slug: 'objecta',
    title: ['Objecta', 'Visual Art'],
    kind: { en: 'Motion', cs: 'Motion' },
    cats: ['motion-design'],
    cover: 'img/objecta/objecta-cover-1080.webp',
    thumb: 'img/objecta/objecta-cover-720.webp',
    hero: 'img/objecta/objecta-cover-1080.webp',
    web: 'https://youtu.be/GiTxhZwwnjs', webLabel: 'youtube.com',
    desc: {
      en: [
        'Objecta Visual Art is a self-initiated visual experiment that ended up as a short film. One geometric rosette — a star folded out of straight lines — is the only building block; everything else comes from running it through colour, scale and damage.',
        'The frames are built like collages: hard primaries against black, halftone screens borrowed from print, and glitch textures that look like a file opened in the wrong program. Symmetry holds each frame together while its surface falls apart.',
        'These are stills from the piece — the whole thing runs as a video.'
      ],
      cs: [
        'Objecta Visual Art je vlastní vizuální experiment, ze kterého nakonec vznikl krátký film. Jediným stavebním kamenem je geometrická rozeta — hvězda složená z rovných linek; všechno ostatní vzniká tím, že ji proženeme barvou, měřítkem a poškozením.',
        'Záběry jsou stavěné jako koláže: ostré základní barvy na černé, polotónové rastry vypůjčené z tisku a glitchové textury, jako by se soubor otevřel ve špatném programu. Symetrie drží každý záběr pohromadě, zatímco jeho povrch se rozpadá.',
        'Tohle jsou stilly z filmu — celé dílo běží jako video.'
      ]
    },
    credits: { en: ['Visuals & motion by Ondřej Hladík'], cs: ['Vizuál a animace: Ondřej Hladík'] },
    shots: [
      { img: 'img/objecta/objecta-1.webp' },
      { img: 'img/objecta/objecta-2.webp' },
      { img: 'img/objecta/objecta-3.webp' },
      { img: 'img/objecta/objecta-4.webp' },
      { img: 'img/objecta/objecta-5.webp' },
      { img: 'img/objecta/objecta-6.webp' }
    ]
  },
  {
    slug: 'font-design',
    title: ['Typeface'],
    kind: { en: 'Type design', cs: 'Návrh písma' },
    cats: ['brand-identity', 'motion-design'],
    cover: 'img/font-design/font-cover-1200.webp',
    thumb: 'img/font-design/font-cover-720.webp',
    hero: 'img/font-design/font-cover-1800.webp',
    desc: {
      en: [
        'A display typeface of our own, drawn from the ground up — the uppercase A to Z plus numerals, enough to set a headline. Antikva bones with the contrast pushed until the serifs read as blunt slabs rather than fine hairlines, and a few letters left deliberately odd: the spur on the K, the tail that drops straight out of the Q.',
        'Drawing it one letter at a time is where a face is actually decided. Blown up, the G is no longer a letter but a shape sitting between cap height and baseline, and every join and counter has to hold at that size as well as it does in a line of text.',
        'The specimen poster puts that to the test the way the face is meant to be used: one letterform enlarged until it turns into an object, with the whole character set set small inside it. Version 1.A, 2025.'
      ],
      cs: [
        'Vlastní titulkové písmo kreslené od základu — verzálky A až Z a číslice, tak akorát na nadpis. Antikvová kostra s kontrastem dotaženým tak daleko, že patky působí jako tupé desky místo jemných vlasových tahů, a pár písmen záměrně zvláštních: ostruha na K, ocásek padající rovně z Q.',
        'Kreslení po jednom písmenu je místo, kde se písmo opravdu rozhoduje. Ve velkém už G není písmeno, ale tvar mezi výškou verzálek a účařím, a každý spoj i vnitřní prostor musí v té velikosti obstát stejně jako v řádku textu.',
        'Specimen plakát to prověří tak, jak má být písmo použité: jedno písmeno zvětšené, až se z něj stane objekt, a uvnitř drobně vysázená celá znaková sada. Verze 1.A, 2025.'
      ]
    },
    credits: { en: ['Typeface by Ondřej Hladík'], cs: ['Písmo: Ondřej Hladík'] },
    shots: [
      { video: 'img/font-design/specimen-motion.mp4', wide: true },
      { img: 'img/font-design/specimen.webp' },
      { img: 'img/font-design/alphabet.webp' },
      { img: 'img/font-design/g-detail.webp' },
      { img: 'img/font-design/poster.webp' }
    ]
  }
];

/* ---------- language ---------- */
OH.lang = (function () {
  let l = null;
  try { l = localStorage.getItem('oh-lang'); } catch (e) { /* private mode */ }
  if (l !== 'cs' && l !== 'en') l = /^(cs|sk)/i.test(navigator.language || '') ? 'cs' : 'en';
  return l;
})();
OH.t = function (v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'cs' in v)) return v[OH.lang] !== undefined ? v[OH.lang] : v.en;
  return v;
};
