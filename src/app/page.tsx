import Image from "next/image";
import Link from "next/link";
import ConsultaTabs from "@/components/landing/ConsultaTabs";
import {
  Wind,
  CloudSun,
  Users,
  Leaf,
  Sparkles,
  Baby,
  HeartHandshake,
  Compass,
} from "lucide-react";

const servicios = [
  { label: "Ansiedad y ataques de pánico", Icon: Wind },
  { label: "Depresión y estado de ánimo", Icon: CloudSun },
  { label: "Relaciones y vínculos", Icon: Users },
  { label: "Duelo y pérdida", Icon: Leaf },
  { label: "Autoestima e identidad", Icon: Sparkles },
  { label: "Infancia y adolescencia", Icon: Baby },
  { label: "Terapia de pareja", Icon: HeartHandshake },
  { label: "Desarrollo personal", Icon: Compass },
];

const equipo = [
  {
    foto: "/equipo/carla_jaimes.jpeg",
    nombre: "Carla Jaimes",
    especialidad: "Terapia Cognitiva Conductual",
    area: "Orientación Conductual Contextual",
  },
  {
    foto: "/equipo/sol_lunge.png",
    nombre: "Sol Lunge",
    especialidad: "Terapia Cognitiva Conductual",
    area: "Clínica con adolescentes y adultos",
  },
  {
    foto: "/equipo/agus_enriquez.jpeg",
    nombre: "Agustina Enríquez",
    especialidad: "Terapia Cognitiva Conductual",
    area: "Clínica infanto-juvenil",
  },
  {
    foto: "/equipo/yazmin_bourdieu.png",
    nombre: "Yazmín Bourdieu",
    especialidad: "Terapia Sistémica",
    area: "Orientación Conductual Contextual"
  },
  {
    foto: "/equipo/monica_czuhaj.png",
    nombre: "Mónica Czuhaj",
    especialidad: "Terapia Conductual Contextual",
    area: "Práctica y habilidades de Mindfulness",
  },
] as const;

const pilares = [
  {
    num: "01",
    title: "Equipo interdisciplinario",
    desc: "Profesionales con distintas orientaciones teóricas para encontrar la mejor coincidencia con tu proceso.",
  },
  {
    num: "02",
    title: "Primera entrevista gratuita",
    desc: "Sin compromiso. Evaluamos juntos cuál es el camino más adecuado para vos antes de empezar.",
  },
  {
    num: "03",
    title: "Confidencialidad total",
    desc: "Todo lo que compartís en el espacio terapéutico está protegido por el secreto profesional.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream font-karma">
      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-cream/[92.5%] backdrop-blur-[18px] border-b border-sage/21">
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,5vw,60px)] h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/nido-logo-no-bg.png"
              alt="Nido"
              width={150}
              height={150}
              className="object-contain"
            />
            <div className="hidden flex-col items-center md:flex">
              <span className="font-brand font-normal text-[28px] text-sage tracking-[-0.01em]">
                Nido
              </span>
              <span className="font-karma font-light text-[12px] tracking-[0.2em] text-sage uppercase ml-1">
                Centro de terapias
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="#consulta"
              className="bg-olive text-white font-karma font-medium text-[14px] py-2 px-[22px] rounded-full no-underline tracking-[0.03em]"
            >
              Consultá gratis
            </a>
            <Link
              href="/login"
              className="font-karma text-[14px] text-text-soft no-underline tracking-[0.04em]"
            >
              Profesionales →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="md:min-h-[calc(100vh-80px)] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,5vw,60px)] md:min-h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: copy */}
          <div className="flex flex-col justify-center py-[clamp(48px,8vh,100px)] pr-[clamp(24px,3vw,56px)] animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 bg-lavender-l/31 border border-lavender/31 rounded-full py-[5px] px-[14px] mb-10 self-start">
              <div className="w-[5px] h-[5px] rounded-full bg-lavender" />
              <span className="font-karma text-sm tracking-[0.2em] text-lavender uppercase">
                Posadas, Misiones
              </span>
            </div>

            <h1 className="font-karma font-normal m-0 leading-[1.12] text-foreground">
              <span className="block text-[clamp(40px,4.8vw,66px)]">
                Dar el primer paso
              </span>
              <span className="block text-[clamp(40px,4.8vw,66px)]">
                es lo más difícil.
              </span>
              <span className="block text-[clamp(34px,4vw,56px)] italic text-sage mt-2.5">
                Ya lo diste.
              </span>
            </h1>

            <p className="font-karma text-xl font-light text-text-mid leading-[1.9] max-w-[430px] mt-7 mb-11">
              En Nido encontrás un espacio seguro y un equipo de psicólogos
              comprometidos con acompañarte en cada etapa de tu proceso.
            </p>

            <a
              href="#consulta"
              className="inline-block self-start bg-olive text-white font-karma font-medium text-lg py-3.5 px-[38px] rounded-full no-underline tracking-[0.03em]"
            >
              Primera consulta gratuita
            </a>

            <span className="font-karma text-sm text-text-soft mt-4 tracking-[0.02em]">
              Sin costo · Sin compromiso · Respondemos en 24 hs
            </span>
          </div>

          {/* Right: bird illustration */}
          <div className="hidden md:flex items-center justify-center relative animate-fade-in">
            {/* Soft lavender halo */}
            <div className="absolute w-[clamp(300px,34vw,460px)] h-[clamp(300px,34vw,460px)] rounded-full pointer-events-none [background:radial-gradient(circle,#D1C5E145_0%,#D1C5E100_70%)]" />
            {/* Outer ring */}
            <div className="absolute w-[clamp(340px,38vw,510px)] h-[clamp(340px,38vw,510px)] rounded-full border border-sage/16 pointer-events-none" />

            <Image
              src="/nido-pajaro-rama-crema.png"
              alt="Pájaro ilustrado en una rama"
              width={520}
              height={520}
              className="object-contain relative z-10 animate-breathe max-w-[90%]"
            />

            {/* Floating badge: primera entrevista */}
            <div className="absolute bottom-[15%] left-[2%] bg-white border border-lavender-l rounded-[14px] py-3.5 px-5 z-20 shadow-[0_4px_24px_#A99BC418]">
              <div className="font-karma text-sm text-lavender tracking-[0.15em] uppercase mb-1">
                Primera entrevista
              </div>
              <div className="font-karma font-medium text-lg text-foreground">
                Sin costo ✓
              </div>
            </div>

            {/* Floating badge: respuesta */}
            <div className="absolute top-[20%] right-[4%] bg-sage rounded-[14px] py-3 px-4.5 z-20">
              <div className="font-karma text-sm text-white/75 mb-[3px]">
                Respondemos en
              </div>
              <div className="font-karma font-semibold text-[26px] text-white leading-none">
                24 hs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────────────── */}
      <section className="bg-cream py-[100px] border-t border-sage/19">
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,5vw,60px)]">
          <div className="mb-[52px]">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-7 h-px bg-sage" />
              <span className="font-karma text-sm tracking-[0.24em] text-sage uppercase">
                Áreas de trabajo
              </span>
            </div>
            <h2 className="font-karma font-normal text-[clamp(30px,3.8vw,48px)] text-foreground leading-[1.15] m-0">
              Te acompañamos en
              <br />
              <em className="text-sage">lo que necesitás.</em>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {servicios.map(({ label, Icon }) => (
              <div
                key={label}
                className="bg-sage/8 border border-sage/25 rounded-2xl py-6 px-5"
              >
                <div className="mb-3.5 text-olive">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div className="font-karma text-[14px] font-normal text-foreground leading-[1.5]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PILARES ──────────────────────────────────────────── */}
      <section className="bg-sage py-[104px]">
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,5vw,60px)]">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-7 h-px bg-white/40" />
              <span className="font-karma text-sm tracking-[0.24em] text-white/80 uppercase">
                Por qué elegirnos
              </span>
            </div>
            <h2 className="font-karma font-normal text-[clamp(30px,3.8vw,48px)] text-white leading-[1.15] m-0">
              Un espacio pensado
              <br />
              <em>para vos.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[52px]">
            {pilares.map((p) => (
              <div key={p.num}>
                <div className="font-karma text-[56px] font-normal text-white/90 leading-none mb-[22px]">
                  {p.num}
                </div>
                <div className="w-7 h-px bg-white/38 mb-[22px]" />
                <h3 className="font-karma font-medium text-xl text-white mb-3">
                  {p.title}
                </h3>
                <p className="font-karma text-lg font-light text-white/65 leading-[1.9] m-0">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────── */}
      <section className="bg-cream py-[120px] relative overflow-hidden">
        {/* Decorative faint bird */}
        <div className="absolute right-[4%] top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Image
            src="/nido-pajaro-rama-crema.png"
            alt=""
            width={440}
            height={440}
            className="object-contain"
          />
        </div>

        <div className="max-w-[780px] mx-auto px-[clamp(20px,5vw,48px)] text-center relative z-10">
          <div className="w-px h-[52px] bg-lavender/44 mx-auto mb-11" />

          <blockquote className="font-karma text-[clamp(22px,3.2vw,42px)] font-normal italic text-foreground leading-[1.55] m-0">
            "Pedir ayuda no es una señal de debilidad — es el primer acto de
            cuidado hacia uno mismo."
          </blockquote>

          <div className="w-px h-[52px] bg-lavender/44 mx-auto mt-11 mb-7" />

          <div className="inline-flex items-center gap-2.5">
            <div className="w-4 h-px bg-sage/50" />
            <span className="font-karma text-sm text-text-soft tracking-[0.24em] uppercase">
              Equipo Nido
            </span>
            <div className="w-4 h-px bg-sage/50" />
          </div>
        </div>
      </section>

      {/* ── EQUIPO ───────────────────────────────────────────── */}
      <section className="bg-cream py-25 border-t border-sage/19">
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,5vw,60px)]">
          <div className="mb-13 text-center">
            <div className="inline-flex items-center gap-2.5 mb-5 justify-center">
              <div className="w-7 h-px bg-sage" />
              <span className="font-karma text-sm tracking-[0.24em] text-sage uppercase">
                Quiénes somos
              </span>
              <div className="w-7 h-px bg-sage" />
            </div>
            <h2 className="font-karma font-normal text-[clamp(30px,3.8vw,48px)] text-foreground leading-[1.15] m-0">
              El equipo <em className="text-sage">Nido.</em>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {equipo.map((m) => (
              <div key={m.nombre} className="flex flex-col items-center w-[180px]">
                <div className="relative w-[120px] h-[120px] mb-5">
                  <div className="absolute inset-0 rounded-full border-2 border-sage/40 scale-[1.07]" />
                  <Image
                    src={m.foto}
                    alt={m.nombre}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <p className="font-karma font-medium text-xl text-foreground text-center leading-snug m-0 mb-1">
                  Lic. {m.nombre}
                </p>
                <p className="font-karma text-md text-sage text-center leading-[1.5] m-0">
                  {m.especialidad}
                </p>
                <p className="font-karma text-sm text-text-soft text-center leading-[1.5] m-0 mt-0.5">
                  {m.area}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULARIO ───────────────────────────────────────── */}
      <section
        id="consulta"
        className="bg-lavender-l/16 py-[104px] border-t border-lavender/19"
      >
        <div className="max-w-[760px] mx-auto px-[clamp(20px,5vw,40px)]">
          <div className="mb-[52px] text-center">
            <div className="inline-flex items-center gap-2.5 mb-[22px]">
              <div className="w-6 h-px bg-lavender" />
              <span className="font-karma text-sm tracking-[0.24em] text-lavender uppercase">
                Primera consulta
              </span>
              <div className="w-6 h-px bg-lavender" />
            </div>
            <h2 className="font-karma font-normal text-[clamp(30px,3.8vw,48px)] text-foreground leading-[1.15] m-0 mb-[18px]">
              Consulta por inicio
              <br />
              <em className="text-lavender">de tratamiento.</em>
            </h2>
            <p className="font-karma text-[16px] font-light text-text-mid leading-[1.8] max-w-[480px] mx-auto">
              Completá el formulario y un profesional se va a comunicar con vos
              en menos de{" "}
              <strong className="font-medium text-foreground">
                48 horas
              </strong>{" "}
              para coordinar una primera entrevista sin costo.
            </p>
          </div>

          <ConsultaTabs />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="bg-[#1A1A1A] py-[38px]">
        <div className="max-w-[1200px] mx-auto px-[clamp(20px,5vw,60px)] flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-brand font-normal text-xl text-sage/50">
              Nido
            </span>
            <span className="font-karma text-sm text-white/18 tracking-[0.16em] uppercase">
              Centro de Terapias
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-karma text-[12px] text-white/18">
              © 2026
            </span>
            <Link
              href="/login"
              className="font-karma text-[12px] text-white/28 no-underline tracking-[0.03em]"
            >
              Acceso profesionales
            </Link>
          </div>
          <a
            href="https://www.yaguaretech.net"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 no-underline opacity-40 hover:opacity-70 transition-opacity"
          >
            <Image
              src="/yaguaretech-isotipo.png"
              alt="Yaguaretech"
              width={18}
              height={18}
              className="object-contain brightness-0 invert"
            />
            <span className="font-karma text-[11px] text-white/60 tracking-[0.08em]">
              hecho por Yaguaretech
            </span>
          </a>
        </div>
      </footer>
    </div>
  );
}
