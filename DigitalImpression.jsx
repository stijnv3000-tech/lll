import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Check,
  MapPin,
  Mail,
  Phone,
  Search,
  Clock,
  Target,
  Layout,
  MousePointerClick,
  ShoppingCart,
  Sparkles,
  MessageSquare,
  PenTool,
  Hammer,
  Rocket,
  ShieldCheck,
  MapPinned,
  Zap,
  UserCheck,
  Quote,
  Star,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Brand system                                                       */
/*  The artifact Tailwind build has no compiler, so exact brand hexes  */
/*  are kept as JS constants and applied via inline styles. Tailwind   */
/*  utilities are used only for layout & spacing.                      */
/* ------------------------------------------------------------------ */
const BRAND = {
  navy: "#0E1C3A",
  navyDeep: "#0A1530",
  navyLine: "#1C2E54",
  gold: "#C9A24A",
  goldSoft: "#D8BB6A",
  beige: "#F1EBDF",
  beigeLine: "#E2D8C5",
  cream: "#FBF8F2",
  white: "#FFFFFF",
  ink: "#0E1C3A",
};

const SERIF = "'Cormorant Garamond', 'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* ------------------------------------------------------------------ */
/*  Small hook: reveal-on-scroll using IntersectionObserver            */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return { ref, shown };
}

/* Wrapper that fades/slides children into view */
function Reveal({ children, delay = 0, as: Tag = "div", className = "", style = {} }) {
  const { ref, shown } = useReveal();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable bits                                                      */
/* ------------------------------------------------------------------ */
function Eyebrow({ children, light = false }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className="block h-px w-8"
        style={{ backgroundColor: BRAND.gold }}
        aria-hidden="true"
      />
      <span
        className="text-xs font-semibold uppercase"
        style={{
          letterSpacing: "0.22em",
          color: light ? "rgba(241,235,223,0.72)" : "#9A8246",
          fontFamily: SANS,
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* Headline that renders an emphasized phrase as gold italic serif */
function Headline({ pre, emphasis, post, light = false, className = "", id }) {
  return (
    <h2
      id={id}
      className={`font-normal leading-[1.06] ${className}`}
      style={{
        fontFamily: SERIF,
        color: light ? BRAND.cream : BRAND.navy,
        fontSize: "clamp(2rem, 4.2vw, 3.25rem)",
        letterSpacing: "-0.01em",
      }}
    >
      {pre}
      {emphasis && (
        <span style={{ color: BRAND.gold, fontStyle: "italic" }}>
          {pre ? " " : ""}
          {emphasis}
        </span>
      )}
      {post}
    </h2>
  );
}

function GoldButton({ children, onClick, href, className = "", icon = true }) {
  const inner = (
    <span className="inline-flex items-center justify-center gap-2">
      {children}
      {icon && <ArrowRight size={18} strokeWidth={2.2} />}
    </span>
  );
  const sharedStyle = {
    backgroundColor: BRAND.gold,
    color: BRAND.navy,
    fontFamily: SANS,
    boxShadow: "0 10px 30px -12px rgba(201,162,74,0.65)",
  };
  const cls =
    `group inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold ` +
    `transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 ${className}`;
  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls} style={sharedStyle}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={sharedStyle}>
      {inner}
    </button>
  );
}

function OutlineButton({ children, href, onClick, light = true, className = "" }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        fontFamily: SANS,
        color: light ? BRAND.cream : BRAND.navy,
        border: `1px solid ${light ? "rgba(241,235,223,0.40)" : "rgba(14,28,58,0.25)"}`,
        backgroundColor: "transparent",
      }}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const NAV = [
  { label: "Home", href: "#home" },
  { label: "Diensten", href: "#diensten" },
  { label: "Werk", href: "#werk" },
  { label: "Prijzen", href: "#prijzen" },
  { label: "Over Ons", href: "#over-ons" },
];

const STATS = [
  {
    icon: Search,
    stat: "75%",
    body:
      "beoordeelt de geloofwaardigheid van een bedrijf op basis van de website, nog vóór ze één woord lezen.",
  },
  {
    icon: Clock,
    stat: "3 sec",
    body:
      "Meer tijd heeft u niet. Een trage of verouderde website stuurt klanten rechtstreeks naar uw concurrenten.",
  },
  {
    icon: Target,
    stat: "1 kans",
    body:
      "U krijgt maar één kans op een goede eerste indruk. Laat die niet liggen.",
  },
];

const SERVICES = [
  {
    icon: Layout,
    title: "Bedrijfswebsites",
    body:
      "Strakke, professionele websites die vertrouwen wekken en leads genereren.",
  },
  {
    icon: MousePointerClick,
    title: "Landingpagina's",
    body:
      "Enkelvoudige pagina's ontworpen voor één doel: conversies. Perfect voor campagnes en productlanceringen.",
  },
  {
    icon: ShoppingCart,
    title: "Webshops",
    body:
      "Verkoop online met een webshop gebouwd om te converteren — mooie productpagina's en naadloos afrekenen.",
  },
  {
    icon: Sparkles,
    title: "Redesigns",
    body:
      "Transformeer uw bestaande website in iets waar u trots op bent. Zelfde inhoud, compleet nieuwe indruk.",
  },
];

/* Portfolio — themed placeholder visuals (no external image hotlinking) */
const PORTFOLIO = [
  {
    name: "Simonta",
    client: "Simonta",
    desc: "Groothandel in verse wortelen, B2B, levering in heel Europa.",
    tag: "B2B Groothandel",
    url: "simonta.eu",
    palette: {
      bg: "linear-gradient(135deg,#234017 0%,#3c6420 45%,#E8881E 100%)",
      accent: "#F2A93B",
      glyph: "🥕",
    },
  },
  {
    name: "Mergelgrotten Zichen",
    client: "Mergelgrotten Zichen",
    desc: "Toeristische grottenrondleidingen, sfeervol & historisch.",
    tag: "Toerisme & Cultuur",
    url: "mergelgrottenzichen.be",
    palette: {
      bg: "linear-gradient(135deg,#2a1d10 0%,#6b4a22 55%,#ca9a4a 100%)",
      accent: "#E7C27A",
      glyph: "🕯️",
    },
  },
  {
    name: "Tuinwerken Stas",
    client: "Tuinwerken Stas",
    desc: "Tuinaanleg & onderhoud, elegant en groen.",
    tag: "Tuin & Landschap",
    url: "tuinwerkenstas.be",
    palette: {
      bg: "linear-gradient(135deg,#0c2417 0%,#16412a 50%,#2f7d4f 100%)",
      accent: "#5BBE83",
      glyph: "🌿",
    },
  },
  {
    name: "Fadim Official",
    client: "Fadim Official",
    desc: "Artiest/zanger met agenda, fanshop & boekingen.",
    tag: "Artiest & Events",
    url: "fadimofficial.be",
    palette: {
      bg: "linear-gradient(135deg,#0b1733 0%,#1d3a72 55%,#5b8fd6 100%)",
      accent: "#9FC2F0",
      glyph: "♪",
    },
  },
];

const PROCESS = [
  {
    icon: MessageSquare,
    title: "Vertel ons over uw project",
    note: "Duurt 3 minuten",
  },
  { icon: PenTool, title: "Offerte & ontwerp", note: "Gratis & binnen 24u" },
  { icon: Hammer, title: "Wij bouwen uw website", note: "10–14 dagen" },
  { icon: Rocket, title: "U gaat live", note: "Doorlopende support" },
];

const WHY = [
  {
    icon: MapPinned,
    title: "Gevestigd in België",
    body:
      "Een lokaal team dat de Belgische markt en ondernemer begrijpt — geen anonieme buitenlandse leverancier.",
  },
  {
    icon: Zap,
    title: "Snelle oplevering",
    body: "Uw website live in 10–14 dagen, zonder eindeloze wachttijden.",
  },
  {
    icon: UserCheck,
    title: "Persoonlijke aanpak",
    body:
      "Eén vast contactpersoon, van eerste gesprek tot lancering en daarna.",
  },
];

const PLAN_FEATURES = [
  "Tot 5 pagina's",
  "Mobiel-responsief design",
  "Contactformulier",
  "Basis SEO",
  "Online binnen 10–14 dagen",
  "Gratis homepagina-ontwerp",
];

const PRICING = [
  {
    name: "Starter",
    price: "vanaf €999",
    sub: "Voor wie professioneel online wil starten.",
    cta: "Offerte aanvragen",
    featured: false,
  },
  {
    name: "Groei",
    price: "vanaf €1.799",
    sub: "Voor bedrijven die willen groeien online.",
    cta: "Offerte aanvragen",
    featured: true,
    badge: "Meest gekozen",
  },
  {
    name: "Op Maat",
    price: "Let's talk",
    sub: "Voor uw uniek project.",
    cta: "Neem contact op",
    featured: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
function Header({ onCta }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wordmark = (
    <a
      href="#home"
      className="inline-flex items-baseline"
      style={{ fontFamily: SERIF, letterSpacing: "0.01em" }}
      onClick={() => setOpen(false)}
    >
      <span className="text-2xl font-semibold" style={{ color: BRAND.cream }}>
        Digital
      </span>
      <span className="text-2xl font-semibold italic ml-1.5" style={{ color: BRAND.gold }}>
        Impression
      </span>
    </a>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* slim top bar */}
      <div
        className="hidden md:block"
        style={{ backgroundColor: BRAND.navyDeep, borderBottom: `1px solid ${BRAND.navyLine}` }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="flex items-center justify-end gap-7 py-2 text-xs"
            style={{ color: "rgba(241,235,223,0.66)", fontFamily: SANS }}
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} style={{ color: BRAND.gold }} /> [Adres]
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail size={13} style={{ color: BRAND.gold }} /> [E-mailadres]
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone size={13} style={{ color: BRAND.gold }} /> [Telefoonnummer]
            </span>
          </div>
        </div>
      </div>

      {/* main nav */}
      <div
        style={{
          backgroundColor: scrolled ? "rgba(10,21,48,0.92)" : "rgba(14,28,58,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${scrolled ? BRAND.navyLine : "transparent"}`,
          transition: "background-color 0.4s ease, border-color 0.4s ease",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {wordmark}

            <nav className="hidden lg:flex items-center gap-9" aria-label="Hoofdnavigatie">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: "rgba(241,235,223,0.82)", fontFamily: SANS }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,235,223,0.82)")}
                >
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:block">
              <GoldButton href="#contact" onClick={onCta} icon={false} className="px-6 py-2.5">
                Ontvang Offerte
              </GoldButton>
            </div>

            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ color: BRAND.cream, border: `1px solid ${BRAND.navyLine}` }}
              aria-label={open ? "Menu sluiten" : "Menu openen"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        {open && (
          <div
            className="lg:hidden border-t"
            style={{ backgroundColor: BRAND.navyDeep, borderColor: BRAND.navyLine }}
          >
            <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col gap-1">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="py-3 text-base font-medium border-b"
                  style={{
                    color: BRAND.cream,
                    fontFamily: SANS,
                    borderColor: "rgba(28,46,84,0.6)",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-3 text-xs" style={{ color: "rgba(241,235,223,0.6)", fontFamily: SANS }}>
                <span className="inline-flex items-center gap-2">
                  <MapPin size={13} style={{ color: BRAND.gold }} /> [Adres]
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail size={13} style={{ color: BRAND.gold }} /> [E-mailadres]
                </span>
                <span className="inline-flex items-center gap-2">
                  <Phone size={13} style={{ color: BRAND.gold }} /> [Telefoonnummer]
                </span>
              </div>
              <div className="pt-4">
                <GoldButton href="#contact" onClick={() => setOpen(false)} className="w-full">
                  Ontvang Offerte
                </GoldButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ backgroundColor: BRAND.navy }}
    >
      {/* subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,162,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,74,0.06) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, #000 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, #000 35%, transparent 100%)",
        }}
      />
      {/* soft gold glow */}
      <div
        className="absolute -top-32 right-[-10%] w-[44rem] h-[44rem] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(201,162,74,0.16) 0%, transparent 62%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="pt-36 md:pt-44 pb-24 md:pb-32 max-w-4xl">
          <Reveal>
            <Eyebrow light>Belgisch Webdesignbureau</Eyebrow>
          </Reveal>

          <Reveal delay={60}>
            <h1
              className="font-normal leading-[1.04]"
              style={{
                fontFamily: SERIF,
                color: BRAND.cream,
                fontSize: "clamp(2.6rem, 6vw, 4.75rem)",
                letterSpacing: "-0.015em",
              }}
            >
              Uw Bedrijf Verdient Een Website Die Even{" "}
              <span style={{ color: BRAND.gold, fontStyle: "italic" }}>
                Hard Werkt Als U
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p
              className="mt-7 max-w-2xl text-base md:text-lg leading-relaxed"
              style={{ color: "rgba(241,235,223,0.78)", fontFamily: SANS }}
            >
              Wij bouwen professionele websites voor Belgische ondernemers — snel,
              mooi en gebouwd om klanten aan te trekken. Ontvang binnen 24u een
              offerte op maat én een gratis homepagina-ontwerp.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <GoldButton href="#contact">Ontvang Offerte &amp; Gratis Ontwerp</GoldButton>
              <OutlineButton href="#werk">Bekijk Ons Werk</OutlineButton>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3" style={{ fontFamily: SANS }}>
              {[
                "Website live in 2 weken",
                "Gratis homepagina-ontwerp",
                "Vast contactpersoon",
              ].map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-2 text-sm"
                  style={{ color: "rgba(241,235,223,0.78)" }}
                >
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                    style={{ backgroundColor: "rgba(201,162,74,0.16)" }}
                  >
                    <Check size={13} strokeWidth={3} style={{ color: BRAND.gold }} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: First impressions stats (beige)                          */
/* ------------------------------------------------------------------ */
function Impressions() {
  return (
    <section style={{ backgroundColor: BRAND.beige }} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Eerste Indrukken</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <Headline
            pre="Eerste Indrukken Gebeuren Online, Nog Voor U De Telefoon"
            emphasis="Opneemt"
            className="max-w-3xl"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.stat} delay={i * 90}>
                <div
                  className="h-full rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: BRAND.cream,
                    border: `1px solid ${BRAND.beigeLine}`,
                    boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset, 0 18px 40px -28px rgba(14,28,58,0.30)",
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: "rgba(201,162,74,0.14)" }}
                  >
                    <Icon size={22} style={{ color: BRAND.gold }} strokeWidth={1.8} />
                  </span>
                  <div
                    className="mt-6 leading-none"
                    style={{ fontFamily: SERIF, color: BRAND.navy, fontSize: "clamp(2.4rem,4vw,3rem)" }}
                  >
                    {s.stat}
                  </div>
                  <p
                    className="mt-4 text-[15px] leading-relaxed"
                    style={{ color: "rgba(14,28,58,0.72)", fontFamily: SANS }}
                  >
                    {s.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Services (navy)                                           */
/* ------------------------------------------------------------------ */
function Services() {
  return (
    <section id="diensten" style={{ backgroundColor: BRAND.navy }} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="md:flex md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow light>Onze Diensten</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <Headline pre="Wat Wij" emphasis="Bouwen" light />
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p
              className="mt-6 md:mt-0 md:text-right text-sm"
              style={{ color: "rgba(241,235,223,0.66)", fontFamily: SANS }}
            >
              Nog niet zeker wat u nodig heeft?
              <br />
              <a href="#contact" className="font-semibold underline underline-offset-4" style={{ color: BRAND.gold }}>
                We zoeken het samen uit
              </a>
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 2) * 90}>
                <div
                  className="group h-full rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.025)",
                    border: `1px solid ${BRAND.navyLine}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,162,74,0.5)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = BRAND.navyLine)}
                >
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: "rgba(201,162,74,0.12)", border: "1px solid rgba(201,162,74,0.25)" }}
                  >
                    <Icon size={22} style={{ color: BRAND.gold }} strokeWidth={1.8} />
                  </span>
                  <h3
                    className="mt-6 text-2xl"
                    style={{ fontFamily: SERIF, color: BRAND.cream }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mt-3 text-[15px] leading-relaxed"
                    style={{ color: "rgba(241,235,223,0.66)", fontFamily: SANS }}
                  >
                    {s.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Portfolio (beige)                                        */
/* ------------------------------------------------------------------ */
function PortfolioCard({ p, delay }) {
  return (
    <Reveal delay={delay}>
      <article
        className="group h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
        style={{
          backgroundColor: BRAND.cream,
          border: `1px solid ${BRAND.beigeLine}`,
          boxShadow: "0 18px 44px -30px rgba(14,28,58,0.40)",
        }}
      >
        {/* styled placeholder image block — ready to swap a real screenshot */}
        <div
          className="relative aspect-[16/10] overflow-hidden"
          style={{ background: p.palette.bg }}
          role="img"
          aria-label={`Voorbeeldweergave van het project ${p.name}`}
        >
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              opacity: 0.5,
            }}
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42), transparent 55%)" }}
          />
          <span
            className="absolute top-4 left-4 text-3xl select-none"
            aria-hidden="true"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}
          >
            {p.palette.glyph}
          </span>
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
            <span
              className="text-xl md:text-2xl font-medium"
              style={{ fontFamily: SERIF, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              {p.name}
            </span>
            <span
              className="shrink-0 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full"
              style={{
                letterSpacing: "0.12em",
                color: BRAND.navy,
                backgroundColor: p.palette.accent,
                fontFamily: SANS,
              }}
            >
              {p.tag}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold" style={{ color: BRAND.navy, fontFamily: SANS }}>
            {p.client}
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(14,28,58,0.66)", fontFamily: SANS }}>
            {p.desc}
          </p>
          <a
            href={`https://${p.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
            style={{ color: "#9A8246", fontFamily: SANS }}
          >
            Bekijk live <ArrowRight size={15} strokeWidth={2.4} />
          </a>
        </div>
      </article>
    </Reveal>
  );
}

function Portfolio() {
  return (
    <section id="werk" style={{ backgroundColor: BRAND.beige }} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <Eyebrow>Portfolio</Eyebrow>
        </Reveal>
        <div className="md:flex md:items-end md:justify-between gap-8">
          <Reveal delay={60}>
            <Headline pre="Ons" emphasis="Werk" />
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 md:mt-0 max-w-md text-sm md:text-right" style={{ color: "rgba(14,28,58,0.62)", fontFamily: SANS }}>
              Een greep uit de websites die we bouwden voor Belgische en Europese
              ondernemers — van groothandel tot toerisme.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PORTFOLIO.map((p, i) => (
            <PortfolioCard key={p.name} p={p} delay={(i % 4) * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Process (navy) + no-obligation band                      */
/* ------------------------------------------------------------------ */
function Process() {
  return (
    <section style={{ backgroundColor: BRAND.navy }} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <Eyebrow light>Werkwijze</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <Headline
            pre="Van Aanvraag Tot Live Website In Minder Dan"
            emphasis="2 Weken"
            light
            className="max-w-3xl"
          />
        </Reveal>

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 90}>
                <div className="relative">
                  {/* connector line */}
                  {i < PROCESS.length - 1 && (
                    <span
                      className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] right-[-2rem] h-px"
                      aria-hidden="true"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(201,162,74,0.5), rgba(201,162,74,0.05))",
                      }}
                    />
                  )}
                  <div className="flex items-center gap-4 lg:block">
                    <span
                      className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full shrink-0"
                      style={{
                        backgroundColor: BRAND.navyDeep,
                        border: `1px solid rgba(201,162,74,0.45)`,
                      }}
                    >
                      <Icon size={22} style={{ color: BRAND.gold }} strokeWidth={1.8} />
                    </span>
                    <span
                      className="lg:mt-5 block text-xs font-semibold uppercase"
                      style={{ letterSpacing: "0.18em", color: "rgba(201,162,74,0.85)", fontFamily: SANS }}
                    >
                      Stap {i + 1}
                    </span>
                  </div>
                  <h3
                    className="mt-3 text-xl"
                    style={{ fontFamily: SERIF, color: BRAND.cream }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="mt-1.5 text-sm"
                    style={{ color: "rgba(241,235,223,0.6)", fontFamily: SANS }}
                  >
                    {p.note}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* no-obligation callout band */}
        <Reveal delay={120}>
          <div
            className="mt-20 rounded-2xl px-8 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-start md:items-center gap-6"
            style={{
              background: "linear-gradient(120deg, rgba(201,162,74,0.10), rgba(201,162,74,0.02))",
              border: "1px solid rgba(201,162,74,0.30)",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full shrink-0"
              style={{ backgroundColor: BRAND.gold }}
            >
              <ShieldCheck size={24} style={{ color: BRAND.navy }} />
            </span>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "rgba(241,235,223,0.9)", fontFamily: SANS }}
            >
              <span className="font-semibold" style={{ color: BRAND.cream }}>
                Geen verplichting, geen voorschot.
              </span>{" "}
              Uw gratis homepage-ontwerp kost niets en verbindt u tot niets. Wij
              verdienen uw vertrouwen vóórdat we om iets vragen.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Why us + testimonial (navy)                              */
/* ------------------------------------------------------------------ */
function WhyUs() {
  return (
    <section id="over-ons" style={{ backgroundColor: BRAND.navyDeep }} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow light>Waarom Kiezen Voor Digital Impression</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <Headline pre="Belgische Ondernemers Kiezen Voor" emphasis="Ons" light className="!leading-[1.1]" />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {WHY.map((w, i) => {
            const Icon = w.icon;
            const featured = i === 1;
            return (
              <Reveal key={w.title} delay={i * 90}>
                <div
                  className="h-full rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: featured ? "rgba(201,162,74,0.07)" : "rgba(255,255,255,0.025)",
                    border: `1px solid ${featured ? "rgba(201,162,74,0.4)" : BRAND.navyLine}`,
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: "rgba(201,162,74,0.12)", border: "1px solid rgba(201,162,74,0.25)" }}
                  >
                    <Icon size={22} style={{ color: BRAND.gold }} strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-6 text-2xl" style={{ fontFamily: SERIF, color: BRAND.cream }}>
                    {w.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(241,235,223,0.66)", fontFamily: SANS }}>
                    {w.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* testimonial */}
        <Reveal delay={120}>
          <figure
            className="mt-12 mx-auto max-w-3xl rounded-2xl p-8 md:p-12 text-center relative"
            style={{
              backgroundColor: BRAND.navy,
              border: `1px solid ${BRAND.navyLine}`,
              borderLeft: `3px solid ${BRAND.gold}`,
            }}
          >
            <Quote
              size={40}
              className="mx-auto"
              style={{ color: "rgba(201,162,74,0.4)" }}
              aria-hidden="true"
            />
            <blockquote
              className="mt-4 text-xl md:text-2xl leading-relaxed"
              style={{ fontFamily: SERIF, color: BRAND.cream, fontStyle: "italic" }}
            >
              "Een slechte website is geen gemiste kans — het is een gesloten deur.
              Wij zorgen ervoor dat de uwe altijd openstaat."
            </blockquote>
            <figcaption className="mt-7 flex items-center justify-center gap-3">
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-full text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgba(201,162,74,0.85), rgba(201,162,74,0.45))",
                  color: BRAND.navy,
                  fontFamily: SANS,
                }}
                aria-hidden="true"
              >
                [N]
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold" style={{ color: BRAND.cream, fontFamily: SANS }}>
                  [Naam]
                </span>
                <span className="block text-xs" style={{ color: "rgba(241,235,223,0.6)", fontFamily: SANS }}>
                  [Functie]
                </span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Pricing (beige)                                          */
/* ------------------------------------------------------------------ */
function Pricing() {
  return (
    <section id="prijzen" style={{ backgroundColor: BRAND.beige }} className="py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Prijzen</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <Headline pre="Eenvoudige, Transparante" emphasis="Prijzen" />
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-base" style={{ color: "rgba(14,28,58,0.66)", fontFamily: SANS }}>
              Geen verborgen kosten. Geen verrassingen.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 items-stretch">
          {PRICING.map((p, i) => {
            const f = p.featured;
            return (
              <Reveal key={p.name} delay={i * 90}>
                <div
                  className="relative h-full rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1.5"
                  style={{
                    backgroundColor: f ? BRAND.navy : BRAND.cream,
                    border: `1px solid ${f ? BRAND.navy : BRAND.beigeLine}`,
                    boxShadow: f
                      ? "0 30px 60px -28px rgba(14,28,58,0.55)"
                      : "0 18px 40px -30px rgba(14,28,58,0.30)",
                  }}
                >
                  {p.badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase px-3.5 py-1.5 rounded-full whitespace-nowrap"
                      style={{
                        letterSpacing: "0.14em",
                        backgroundColor: BRAND.gold,
                        color: BRAND.navy,
                        fontFamily: SANS,
                      }}
                    >
                      {p.badge}
                    </span>
                  )}

                  <span
                    className="text-xs font-semibold uppercase"
                    style={{
                      letterSpacing: "0.2em",
                      color: f ? "rgba(201,162,74,0.95)" : "#9A8246",
                      fontFamily: SANS,
                    }}
                  >
                    {p.name}
                  </span>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span
                      style={{
                        fontFamily: SERIF,
                        color: f ? BRAND.cream : BRAND.navy,
                        fontSize: p.price.includes("€") || p.price === "Let's talk" ? "clamp(1.9rem,3vw,2.5rem)" : "2.5rem",
                      }}
                    >
                      {p.price}
                    </span>
                  </div>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: f ? "rgba(241,235,223,0.6)" : "rgba(14,28,58,0.6)", fontFamily: SANS }}
                  >
                    {p.sub}
                  </p>

                  <ul className="mt-7 space-y-3 flex-1">
                    {PLAN_FEATURES.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: f ? "rgba(241,235,223,0.85)" : "rgba(14,28,58,0.78)", fontFamily: SANS }}
                      >
                        <Check size={16} strokeWidth={2.6} style={{ color: BRAND.gold, marginTop: 2 }} className="shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {f ? (
                      <GoldButton href="#contact" className="w-full" icon={false}>
                        {p.cta}
                      </GoldButton>
                    ) : (
                      <a
                        href="#contact"
                        className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          fontFamily: SANS,
                          color: BRAND.navy,
                          border: `1px solid rgba(14,28,58,0.25)`,
                          backgroundColor: "transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = BRAND.navy;
                          e.currentTarget.style.color = BRAND.cream;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = BRAND.navy;
                        }}
                      >
                        {p.cta}
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <p
            className="mt-10 text-center text-sm mx-auto max-w-2xl"
            style={{ color: "rgba(14,28,58,0.62)", fontFamily: SANS }}
          >
            Elk project bevat een gratis homepage-ontwerp — verzonden binnen 24 uur
            na uw aanvraag, zonder enige verplichting.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section: Final CTA + contact (navy)                               */
/* ------------------------------------------------------------------ */
function Field({ label, required, children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-xs font-semibold mb-2" style={{ color: "rgba(241,235,223,0.78)", fontFamily: SANS, letterSpacing: "0.04em" }}>
        {label}
        {required && <span style={{ color: BRAND.gold }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function Contact() {
  const [form, setForm] = useState({
    naam: "",
    bedrijf: "",
    email: "",
    telefoon: "",
    bericht: "",
    type: "",
    project: "",
    gevonden: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.04)",
    border: `1px solid ${BRAND.navyLine}`,
    color: BRAND.cream,
    fontFamily: SANS,
  };
  const inputCls =
    "w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-[#C9A24A]";

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.naam.trim() || !form.email.trim() || !form.bericht.trim()) {
      setError("Vul a.u.b. uw naam, e-mailadres en bericht in.");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <section id="contact" style={{ backgroundColor: BRAND.navy }} className="py-24 md:py-28 relative overflow-hidden">
      <div
        className="absolute -bottom-40 left-[-10%] w-[40rem] h-[40rem] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(201,162,74,0.12) 0%, transparent 62%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* left: pitch + contact */}
          <div>
            <Reveal>
              <Eyebrow light>Start Uw Project Vandaag</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <Headline pre="Laten We Samen Iets" emphasis="Moois Bouwen" light />
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 text-base md:text-lg leading-relaxed max-w-lg" style={{ color: "rgba(241,235,223,0.78)", fontFamily: SANS }}>
                Vertel ons over uw project en wij sturen u binnen 24 uur een offerte
                op maat én een gratis{" "}
                <span style={{ color: BRAND.gold }}>homepagina-ontwerp</span>. Helemaal
                vrijblijvend.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <ul className="mt-10 space-y-4">
                {[
                  { icon: PenTool, text: "Offerte op maat + gratis ontwerp binnen 24 uur" },
                  { icon: ShieldCheck, text: "Geen voorschot — u betaalt pas als u 100% tevreden bent" },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <li key={row.text} className="flex items-center gap-3 text-sm" style={{ color: "rgba(241,235,223,0.82)", fontFamily: SANS }}>
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ backgroundColor: "rgba(201,162,74,0.12)", border: "1px solid rgba(201,162,74,0.25)" }}>
                        <Icon size={17} style={{ color: BRAND.gold }} />
                      </span>
                      {row.text}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 pt-8 grid sm:grid-cols-1 gap-4" style={{ borderTop: `1px solid ${BRAND.navyLine}` }}>
                {[
                  { icon: Mail, label: "[E-mailadres]" },
                  { icon: Phone, label: "[Telefoonnummer]" },
                  { icon: MapPin, label: "[Adres]" },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <span key={c.label} className="inline-flex items-center gap-3 text-sm" style={{ color: "rgba(241,235,223,0.78)", fontFamily: SANS }}>
                      <Icon size={16} style={{ color: BRAND.gold }} />
                      {c.label}
                    </span>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* right: form card (no <form> tag) */}
          <Reveal delay={120}>
            <div
              className="rounded-2xl p-7 md:p-9"
              style={{
                backgroundColor: BRAND.navyDeep,
                border: `1px solid ${BRAND.navyLine}`,
                boxShadow: "0 30px 70px -30px rgba(0,0,0,0.6)",
              }}
            >
              {sent ? (
                <div className="py-14 text-center">
                  <span className="mx-auto inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: "rgba(201,162,74,0.15)" }}>
                    <Check size={32} strokeWidth={2.5} style={{ color: BRAND.gold }} />
                  </span>
                  <h3 className="mt-6 text-2xl" style={{ fontFamily: SERIF, color: BRAND.cream }}>
                    Bedankt voor uw aanvraag!
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "rgba(241,235,223,0.7)", fontFamily: SANS }}>
                    We hebben uw bericht goed ontvangen. U hoort binnen 24 uur van ons
                    met een offerte op maat én uw gratis homepagina-ontwerp.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSent(false); setForm({ naam: "", bedrijf: "", email: "", telefoon: "", bericht: "", type: "", project: "", gevonden: "" }); }}
                    className="mt-7 text-sm font-semibold underline underline-offset-4"
                    style={{ color: BRAND.gold, fontFamily: SANS }}
                  >
                    Nog een aanvraag versturen
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Naam" required htmlFor="f-naam">
                      <input id="f-naam" type="text" value={form.naam} onChange={set("naam")} className={inputCls} style={inputStyle} placeholder="Uw naam" />
                    </Field>
                    <Field label="Bedrijfsnaam" htmlFor="f-bedrijf">
                      <input id="f-bedrijf" type="text" value={form.bedrijf} onChange={set("bedrijf")} className={inputCls} style={inputStyle} placeholder="Uw bedrijf" />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="E-mail" required htmlFor="f-email">
                      <input id="f-email" type="email" value={form.email} onChange={set("email")} className={inputCls} style={inputStyle} placeholder="u@bedrijf.be" />
                    </Field>
                    <Field label="Telefoonnummer" htmlFor="f-tel">
                      <input id="f-tel" type="tel" value={form.telefoon} onChange={set("telefoon")} className={inputCls} style={inputStyle} placeholder="+32 ..." />
                    </Field>
                  </div>

                  <Field label="Bericht" required htmlFor="f-bericht">
                    <textarea id="f-bericht" rows={3} value={form.bericht} onChange={set("bericht")} className={inputCls} style={{ ...inputStyle, resize: "vertical" }} placeholder="Waar kunnen we u mee helpen?" />
                  </Field>

                  <Field label="Type website" htmlFor="f-type">
                    <select id="f-type" value={form.type} onChange={set("type")} className={inputCls} style={{ ...inputStyle, color: form.type ? BRAND.cream : "rgba(241,235,223,0.45)" }}>
                      <option value="" style={{ color: "#222" }}>Selecteer...</option>
                      <option value="Bedrijfswebsite" style={{ color: "#222" }}>Bedrijfswebsite</option>
                      <option value="Landingpagina" style={{ color: "#222" }}>Landingpagina</option>
                      <option value="Webshop" style={{ color: "#222" }}>Webshop</option>
                      <option value="Redesign" style={{ color: "#222" }}>Redesign</option>
                      <option value="Anders" style={{ color: "#222" }}>Anders</option>
                    </select>
                  </Field>

                  <Field label="Vertel ons over uw project" htmlFor="f-project">
                    <textarea id="f-project" rows={3} value={form.project} onChange={set("project")} className={inputCls} style={{ ...inputStyle, resize: "vertical" }} placeholder="Doelen, voorbeelden, deadlines..." />
                  </Field>

                  <Field label="Hoe heeft u ons gevonden?" htmlFor="f-gevonden">
                    <input id="f-gevonden" type="text" value={form.gevonden} onChange={set("gevonden")} className={inputCls} style={inputStyle} placeholder="Google, doorverwijzing, social media..." />
                  </Field>

                  {error && (
                    <p className="text-sm" style={{ color: "#E9A6A6", fontFamily: SANS }}>
                      {error}
                    </p>
                  )}

                  <GoldButton onClick={handleSubmit} className="w-full" icon={false}>
                    Verzenden
                  </GoldButton>
                  <p className="text-center text-xs" style={{ color: "rgba(241,235,223,0.5)", fontFamily: SANS }}>
                    Door te verzenden gaat u akkoord met een vrijblijvend contact.
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer (navy)                                                     */
/* ------------------------------------------------------------------ */
function Footer() {
  const cols = [
    { title: "Diensten", links: ["Bedrijfswebsites", "Landingpagina's", "Webshops", "Redesigns"] },
    { title: "Bedrijf", links: ["Werk", "Prijzen", "Over Ons", "Contact"] },
  ];
  return (
    <footer style={{ backgroundColor: BRAND.navyDeep, borderTop: `1px solid ${BRAND.navyLine}` }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="inline-flex items-baseline" style={{ fontFamily: SERIF }}>
              <span className="text-2xl font-semibold" style={{ color: BRAND.cream }}>Digital</span>
              <span className="text-2xl font-semibold italic ml-1.5" style={{ color: BRAND.gold }}>Impression</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "rgba(241,235,223,0.6)", fontFamily: SANS }}>
              Premium websites voor Belgische ondernemers — snel, mooi en gebouwd
              om klanten aan te trekken.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${BRAND.navyLine}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(201,162,74,0.18)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                >
                  <Icon size={16} style={{ color: BRAND.gold }} />
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-semibold uppercase mb-4" style={{ letterSpacing: "0.18em", color: BRAND.gold, fontFamily: SANS }}>
                {c.title}
              </h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(241,235,223,0.66)", fontFamily: SANS }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.gold)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,235,223,0.66)")}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* signup */}
          <div>
            <h4 className="text-xs font-semibold uppercase mb-4" style={{ letterSpacing: "0.18em", color: BRAND.gold, fontFamily: SANS }}>
              Blijf Op De Hoogte
            </h4>
            <p className="text-sm mb-4" style={{ color: "rgba(241,235,223,0.6)", fontFamily: SANS }}>
              Tips & inzichten over webdesign voor ondernemers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                aria-label="E-mailadres voor nieuwsbrief"
                placeholder="[E-mailadres]"
                className="flex-1 rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${BRAND.navyLine}`,
                  color: BRAND.cream,
                  fontFamily: SANS,
                }}
              />
              <button
                type="button"
                aria-label="Inschrijven"
                className="inline-flex items-center justify-center w-11 h-[42px] rounded-lg shrink-0 transition-transform duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: BRAND.gold, color: BRAND.navy }}
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${BRAND.navyLine}` }}
        >
          <p className="text-xs" style={{ color: "rgba(241,235,223,0.5)", fontFamily: SANS }}>
            © 2026 Digital Impression — Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ fontFamily: SANS }}>
            <a href="#" style={{ color: "rgba(241,235,223,0.5)" }}>Privacybeleid</a>
            <a href="#" style={{ color: "rgba(241,235,223,0.5)" }}>Algemene voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component                                                    */
/* ------------------------------------------------------------------ */
export default function DigitalImpressionSite() {
  // Inject brand fonts + global smooth-scroll once on mount.
  useEffect(() => {
    const links = [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap",
      },
    ];
    const created = links.map((attrs) => {
      const el = document.createElement("link");
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "crossOrigin") el.crossOrigin = v;
        else el.setAttribute(k, v);
      });
      document.head.appendChild(el);
      return el;
    });

    const prevScroll = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      created.forEach((el) => el.remove());
      document.documentElement.style.scrollBehavior = prevScroll;
    };
  }, []);

  return (
    <div style={{ backgroundColor: BRAND.navy, fontFamily: SANS, color: BRAND.cream, overflowX: "hidden" }}>
      <Header />
      <main>
        <Hero />
        <Impressions />
        <Services />
        <Portfolio />
        <Process />
        <WhyUs />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
