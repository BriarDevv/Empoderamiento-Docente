"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BookOpen, Linkedin, X } from "@/components/ui/icons";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Quienes la impulsan" — el EQUIPO dentro de "Quiénes sostienen ED", con
 * JERARQUÍA en 4 niveles (roles del Equipo ED.docx del cliente):
 *
 *   1. DIRECCIÓN GENERAL — Daniela, SPOTLIGHT exclusivo (tarjeta horizontal
 *      con bio a la vista: nadie comparte su nivel).
 *   2. DIRECCIÓN ACADÉMICA — Karla, tarjeta grande.
 *   3. LÍDERES de área y proyecto — medianas (Iván · Judith · Gabriela · Marcela).
 *   4. FACILITACIÓN Y DISEÑO — compactas (las seis restantes).
 *
 * La ENTRADA es la metáfora de la sección — LA RED SE CONVOCA: las tarjetas
 * VUELAN desde fuera de la pantalla (cada una desde su dirección, con giro 3D)
 * y aterrizan nivel por nivel. Hover: la foto toma color y la tarjeta se eleva.
 *
 * CLIC en una persona → MODAL con su ficha completa: foto, nombre, rol, país,
 * BIO oficial, LinkedIn y sus PUBLICACIONES. Navegable con ←/→ sin cerrar;
 * ESC o clic afuera para cerrar.
 *
 * PENDIENTES del cliente: URLs de LinkedIn (botones deshabilitados hasta
 * tenerlas) y links de publicaciones (se listan y anuncian la Biblioteca).
 * Andrea Vergara y Luis López sin foto en carpeta — sumar cuando lleguen.
 * Reduced-motion / sin JS: grillas estáticas visibles; el modal abre sin animar.
 */

type Publicacion = { titulo: string; url?: string };

type Persona = {
  key: string;
  nombre: string;
  rol: string;
  pais: string;
  bio: string;
  tier: 1 | 2 | 3 | 4;
  linkedin?: string;
  pubs?: Publicacion[];
};

const EQUIPO: Persona[] = [
  {
    key: "daniela-reyes",
    nombre: "Daniela Reyes",
    rol: "Directora General",
    pais: "Argentina",
    tier: 1,
    bio: "Especialista en desarrollo profesional docente y desarrollo del pensamiento matemático. Profesora de Matemáticas. Doctora en Ciencias con especialidad en Matemática Educativa.",
  },
  {
    key: "karla-gomez",
    nombre: "Karla Gómez",
    rol: "Directora Académica",
    pais: "México",
    tier: 2,
    bio: "Especialista en desarrollo del pensamiento matemático y en el diseño de tareas. Licenciada en Enseñanza de las Matemáticas. Doctora en Ciencias con especialidad en Matemática Educativa.",
    pubs: [
      { titulo: "Experiencias de aprendizaje y reconceptualización geométrica: una propuesta para la reorganización de la práctica docente" },
      { titulo: "Gómez et al. (2020) — PME-NA 42" },
    ],
  },
  {
    key: "ivan-perez",
    nombre: "Iván Pérez",
    rol: "Líder de Modelación y Tecnologías",
    pais: "Chile",
    tier: 3,
    bio: "Académico del Departamento de Matemática de la Universidad Metropolitana de Ciencias de la Educación (UMCE), responsable de proyectos de investigación y de vinculación con el medio escolar.",
  },
  {
    key: "judith-hernandez",
    nombre: "Judith Hernández",
    rol: "Líder de proyecto · Currículum",
    pais: "México",
    tier: 3,
    bio: "Especialista en análisis y diseño del currículum en Matemáticas y desarrollo profesional docente. Doctora en Ciencias con especialidad en Matemática Educativa.",
    pubs: [
      { titulo: "Hernández, Páez y Aké (2026)" },
      { titulo: "Rodríguez, Briceño y Hernández (2026)" },
      { titulo: "Valero y Hernández (2024)" },
      { titulo: "Hernández, Padilla y Briceño (2023)" },
    ],
  },
  {
    key: "gabriela-buendia",
    nombre: "Gabriela Buendía",
    rol: "Líder de proyecto · Facilitadora",
    pais: "México",
    tier: 3,
    bio: "Doctora en Ciencias con especialidad en Matemática Educativa. Especialista en desarrollo del pensamiento matemático. Facilitadora y diseñadora de material didáctico.",
  },
  {
    key: "marcela-cano",
    nombre: "Marcela Cano",
    rol: "Líder de proyecto · Evaluación",
    pais: "México",
    tier: 3,
    bio: "Especialista en evaluación educativa a gran escala: diseño, implementación y coordinación de evaluaciones en todos los niveles. Ex directora del programa de evaluación del desempeño docente y del área EGEL. Estudios en Psicología por la UNAM.",
  },
  {
    key: "wendolyne-rios",
    nombre: "Wendolyne Ríos",
    rol: "Facilitadora y diseñadora de material didáctico",
    pais: "México",
    tier: 4,
    bio: "Licenciada en Física y Matemáticas. Maestra en Ciencias con especialidad en Matemática Educativa. Especialista en pensamiento y lenguaje variacional.",
  },
  {
    key: "pedro-vidal-szabo",
    nombre: "Pedro Vidal-Szabo",
    rol: "Facilitador · Pensamiento estocástico",
    pais: "Chile",
    tier: 4,
    bio: "Especialista en pensamiento estocástico. Investigador y académico. Magíster y Doctor en Didáctica de la Matemática. Profesor de Matemática, mención Estadística Educacional.",
  },
  {
    key: "paola-balda",
    nombre: "Paola Balda",
    rol: "Facilitadora · Pensamiento proporcional",
    pais: "Colombia",
    tier: 4,
    bio: "Especialista en pensamiento proporcional y formación docente. Licenciada en Matemáticas. Doctora en Educación. Magíster en Docencia de las Matemáticas y especialista en Gerencia Educativa.",
  },
  {
    key: "darly-ku-euan",
    nombre: "Darly Ku-Euan",
    rol: "Diseñadora de material didáctico",
    pais: "México",
    tier: 4,
    bio: "Especialista en pensamiento matemático y desarrollo profesional docente. Profesora de Matemáticas. Doctora en Ciencias con especialidad en Matemática Educativa.",
  },
  {
    key: "luis-cabrera",
    nombre: "Luis Cabrera Chim",
    rol: "Facilitador · Evaluación educativa",
    pais: "México",
    tier: 4,
    bio: "Especialista en desarrollo profesional docente, pensamiento y lenguaje variacional y evaluación educativa. Doctor en Ciencias con especialidad en Matemática Educativa.",
  },
  {
    key: "eduardo-briceno",
    nombre: "Eduardo Briceño",
    rol: "Diseñador de material didáctico",
    pais: "México",
    tier: 4,
    bio: "Especialista en la construcción social del conocimiento y el uso de tecnología en la enseñanza de las matemáticas. Doctor en Ciencias con especialidad en Matemática Educativa.",
    pubs: [
      { titulo: "Rodríguez, Briceño y Hernández (2026)" },
      { titulo: "Hernández, Padilla y Briceño (2023)" },
    ],
  },
];

const DANIELA = EQUIPO[0];

// Reveal de la bio: cada PALABRA en un span (sin símbolos ni ruido) para
// encenderla en ola estilo blueprint — de tenue a plena, como el home.
function BioWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i, arr) => (
        <span key={i}>
          <span data-bio-word className="inline-block will-change-transform">
            {w}
          </span>
          {i < arr.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

const TIERS: Array<{ tier: 2 | 3 | 4; rotulo: string; grid: string; card: "lg" | "md" | "sm" }> = [
  { tier: 2, rotulo: "Dirección académica", grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", card: "lg" },
  { tier: 3, rotulo: "Líderes de área y proyecto", grid: "grid-cols-2 md:grid-cols-4", card: "md" },
  { tier: 4, rotulo: "Facilitación y diseño de materiales", grid: "grid-cols-2 sm:grid-cols-3 md:grid-cols-6", card: "sm" },
];

// Tipografías por tamaño de tarjeta (jerarquía visual).
const CARD_TXT = {
  lg: { nombre: "text-[1.25rem]", rol: "text-[0.82rem]", pais: "text-[0.64rem]", pad: "p-5" },
  md: { nombre: "text-[1.02rem]", rol: "text-[0.75rem]", pais: "text-[0.62rem]", pad: "p-4" },
  sm: { nombre: "text-[0.88rem]", rol: "text-[0.66rem]", pais: "text-[0.56rem]", pad: "p-3" },
} as const;

export function ImpulsanEd() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  // origen del morph (rect de la foto clickeada) + si el modal ya estaba abierto
  const originRef = useRef<{ rect: DOMRect; src: string } | null>(null);
  const wasOpenRef = useRef(false);
  const reduced = useReducedMotion();

  // ── Entrada ATADA AL SCROLL: cada nivel vuela a su lugar durante su
  //    propia franja de scroll (scrub) — las tarjetas siempre se ven llegar
  //    al ritmo del usuario, y al scrollear hacia atrás la convocatoria se
  //    reproduce en reversa. La bio de Daniela se enciende igual (scrub). ──
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      // Acople de la lámina navy del equipo sobre la lámina blanca de la Red
      const sheet = root.closest("section");
      if (sheet) {
        gsap.fromTo(
          sheet,
          { scale: 0.97, y: 36 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: sheet, start: "top 96%", end: "top 14%", scrub: true },
          },
        );
      }

      const heads = gsap.utils.toArray<HTMLElement>("[data-imp-head]");
      gsap.set(heads, { autoAlpha: 0, y: 24 });
      gsap.to(heads, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });

      let cardIndex = 0;
      gsap.utils.toArray<HTMLElement>("[data-tier-group]").forEach((grupo) => {
        const cards = gsap.utils.toArray<HTMLElement>(
          grupo.querySelectorAll("[data-persona-card]"),
        );
        const rotulo = grupo.querySelector<HTMLElement>("[data-tier-rotulo]");

        cards.forEach((c) => {
          const ang = cardIndex * 2.399; // ángulo áureo → cada una desde su dirección
          gsap.set(c, {
            x: Math.cos(ang) * 640,
            y: Math.sin(ang) * 420,
            rotationY: (cardIndex % 2 === 0 ? 1 : -1) * 90,
            rotation: (cardIndex % 2 === 0 ? 1 : -1) * (10 + (cardIndex % 4) * 6),
            scale: 0.4,
            autoAlpha: 0,
            transformPerspective: 900,
          });
          cardIndex += 1;
        });
        if (rotulo) gsap.set(rotulo, { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: grupo, start: "top 94%", end: "top 38%", scrub: true },
        });
        if (rotulo) tl.to(rotulo, { autoAlpha: 1, y: 0, duration: 0.25, ease: "none" }, 0);
        tl.to(
          cards,
          {
            x: 0,
            y: 0,
            rotationY: 0,
            rotation: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
            stagger: 0.14,
          },
          0.05,
        );
      });

      // Bio de Daniela: se ENCIENDE palabra a palabra con el scroll, en el
      // tramo final de la franja del spotlight (ya aterrizado).
      const bioWords = gsap.utils.toArray<HTMLElement>("[data-bio-word]");
      const spotlight = root.querySelector<HTMLElement>("[data-tier-group]");
      if (bioWords.length && spotlight) {
        gsap.set(bioWords, { opacity: 0.12, y: 6 });
        gsap.to(bioWords, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "none",
          stagger: 0.03,
          scrollTrigger: { trigger: spotlight, start: "top 55%", end: "top 16%", scrub: true },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // ── Modal: apertura FLASHERA y FLUIDA — la foto de la tarjeta clickeada
  //    VUELA hasta el modal como fantasma animado SOLO con transforms
  //    (translate+scale, GPU) y reusando la imagen ya decodificada de la
  //    tarjeta (cero reflow, cero descarga). Aterriza con crossfade, una
  //    COSTURA verde sella la unión y el contenido cae en cascada. En
  //    navegación ←/→ solo re-cascadea. Reduced-motion/mobile: simple. ────
  useEffect(() => {
    if (sel === null) {
      wasOpenRef.current = false;
      return;
    }

    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const panel = modalRef.current;
    const firstOpen = !wasOpenRef.current;
    wasOpenRef.current = true;

    let ghost: HTMLDivElement | null = null;

    if (panel && !reduced) {
      const ctx = gsap.context(() => {
        const photo = panel.querySelector<HTMLElement>("[data-modal-photo]");
        const seam = panel.querySelector<HTMLElement>("[data-modal-seam]");
        const card = panel.querySelector<HTMLElement>("[data-modal-panel]");
        if (firstOpen) {
          gsap.fromTo(
            "[data-modal-backdrop]",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.28, ease: "power2.out" },
          );
        }

        const o = originRef.current;
        const photoOn = photo && photo.getBoundingClientRect().width > 0;

        if (firstOpen && o && photoOn && card) {
          // El panel entra deslizando mientras la foto-fantasma vuela
          gsap.fromTo(
            card,
            { autoAlpha: 0, x: 34 },
            { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", delay: 0.06 },
          );
          const t = photo.getBoundingClientRect();
          ghost = document.createElement("div");
          ghost.style.cssText =
            "position:fixed;z-index:130;overflow:hidden;border-radius:1rem;pointer-events:none;" +
            'left:' + o.rect.left + 'px;top:' + o.rect.top + 'px;width:' + o.rect.width + 'px;height:' + o.rect.height + 'px;' +
            'transform-origin:top left;will-change:transform;backface-visibility:hidden;';
          const img = document.createElement("img");
          img.src = o.src; // imagen YA cargada y decodificada en la tarjeta
          img.style.cssText = "width:100%;height:100%;object-fit:cover;";
          ghost.appendChild(img);
          document.body.appendChild(ghost);
          gsap.set(photo, { opacity: 0 });
          const g = ghost;
          gsap.to(g, {
            x: t.left - o.rect.left,
            y: t.top - o.rect.top,
            scaleX: t.width / o.rect.width,
            scaleY: t.height / o.rect.height,
            duration: 0.5,
            ease: "power3.inOut",
            force3D: true,
            onComplete: () => {
              // aterrizaje con CROSSFADE (sin swap seco)
              if (photo) gsap.to(photo, { opacity: 1, duration: 0.18 });
              gsap.to(g, {
                autoAlpha: 0,
                duration: 0.18,
                onComplete: () => {
                  g.remove();
                },
              });
              ghost = null;
              if (seam) {
                gsap.fromTo(
                  seam,
                  { scaleY: 0, autoAlpha: 1 },
                  {
                    scaleY: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                      gsap.to(seam, { autoAlpha: 0, duration: 0.45, delay: 0.1 });
                    },
                  },
                );
              }
            },
          });
          gsap.fromTo(
            "[data-modal-bit]",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.4, ease: "power3.out" },
          );
        } else {
          // Navegación dentro del modal (o sin morph posible): re-cascada
          gsap.fromTo(
            "[data-modal-panel]",
            { autoAlpha: 0, y: 30, scale: 0.95 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
          );
          gsap.fromTo(
            "[data-modal-bit]",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, delay: 0.1, ease: "power3.out" },
          );
        }
      }, panel);
      return () => {
        ctx.revert();
        ghost?.remove();
        document.documentElement.style.overflow = "";
      };
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [sel, reduced]);

  // ── Teclado: ESC cierra · ←/→ navegan ────────────────────────────────────
  const move = useCallback((dir: 1 | -1) => {
    setSel((s) => (s === null ? s : (s + dir + EQUIPO.length) % EQUIPO.length));
  }, []);

  useEffect(() => {
    if (sel === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, move]);

  const p = sel !== null ? EQUIPO[sel] : null;

  return (
    <section
      aria-label="Quienes impulsan ED"
      className="bg-azul-principal relative z-[45] -mt-[4svh] overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
    >
      {/* Textura de puntos de marca */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle,#fff_1.1px,transparent_1.6px)] [background-size:24px_24px]"
      />
      <div ref={rootRef} className="relative z-10 mx-auto max-w-screen-xl px-5 py-24 md:px-10 md:py-28">
      {/* ── Encabezado ──────────────────────────────────────────────────── */}
      <div className="max-w-3xl">
        <span data-imp-head className="text-azul-claro/80 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
          Quienes la impulsan
        </span>
        <h3
          data-imp-head
          className="font-display mt-5 font-bold tracking-[-0.02em] text-white"
          style={{ fontSize: "clamp(1.7rem, 0.9rem + 2.6vw, 2.8rem)", lineHeight: 1.1 }}
        >
          La red tiene <span className="text-verde-concepto">nombres</span>.
        </h3>
        <p data-imp-head className="text-azul-claro/80 mt-4 max-w-[52ch] font-sans text-[0.98rem] leading-relaxed">
          Conocé a cada integrante: su recorrido, su especialidad y su
          producción académica.
        </p>
      </div>

      {/* ── Nivel 1 · Dirección General: spotlight exclusivo de Daniela ──── */}
      <div data-tier-group className="mt-12">
        <p
          data-tier-rotulo
          className="text-verde-concepto/90 flex items-center gap-3 font-mono text-[0.68rem] font-medium tracking-[0.22em] uppercase"
        >
          <span aria-hidden="true" className="bg-verde-concepto/60 block h-px w-7" />
          Dirección general
        </p>
        <button
          type="button"
          data-persona-card
          onClick={(e) => {
            const im = e.currentTarget.querySelector("img");
                        originRef.current = im ? { rect: im.getBoundingClientRect(), src: im.currentSrc || im.src } : null;
            setSel(0);
          }}
          className="group relative mt-5 grid w-full cursor-pointer overflow-hidden rounded-3xl text-left ring-1 ring-white/12 transition-shadow duration-500 will-change-transform hover:shadow-[0_32px_90px_-28px_rgb(31_154_120/0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-concepto sm:grid-cols-[2fr_3fr] lg:grid-cols-[1fr_2fr]"
        >
          <span className="relative block aspect-[4/5] w-full sm:aspect-auto sm:min-h-[22rem]">
            <Image
              src={`/equipo/${DANIELA.key}.jpg`}
              alt={`${DANIELA.nombre} — ${DANIELA.rol}`}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover grayscale-[0.35] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          </span>
          <span className="flex flex-col justify-center bg-white/[0.05] p-7 backdrop-blur-sm md:p-10">
            <span className="text-verde-concepto font-mono text-[0.68rem] tracking-[0.2em] uppercase">
              {DANIELA.rol} · {DANIELA.pais}
            </span>
            <span className="font-display mt-3 block text-[1.9rem] leading-tight font-bold text-white md:text-[2.3rem]">
              {DANIELA.nombre}
            </span>
            <span className="text-azul-claro/85 mt-4 block max-w-[52ch] font-sans text-[0.95rem] leading-relaxed">
              <BioWords text={DANIELA.bio} />
            </span>
            <span className="text-verde-concepto mt-6 inline-flex items-center gap-2 font-sans text-[0.9rem] font-medium">
              Ver ficha completa
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </button>
      </div>

      {/* ── Niveles 2–4: Dirección académica → Líderes → Facilitación ────── */}
      {TIERS.map(({ tier, rotulo, grid, card }) => {
        const txt = CARD_TXT[card];
        return (
          <div key={tier} data-tier-group className="mt-12">
            <p
              data-tier-rotulo
              className="text-verde-concepto/90 flex items-center gap-3 font-mono text-[0.68rem] font-medium tracking-[0.22em] uppercase"
            >
              <span aria-hidden="true" className="bg-verde-concepto/60 block h-px w-7" />
              {rotulo}
            </p>
            <ul className={`mt-5 grid gap-4 md:gap-6 ${grid}`}>
              {EQUIPO.filter((e) => e.tier === tier).map((persona) => {
                const i = EQUIPO.indexOf(persona);
                return (
                  <li key={persona.key}>
                    <button
                      type="button"
                      data-persona-card
                      onClick={(e) => {
                        const im = e.currentTarget.querySelector("img");
                        originRef.current = im ? { rect: im.getBoundingClientRect(), src: im.currentSrc || im.src } : null;
                        setSel(i);
                      }}
                      className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl text-left ring-1 ring-white/10 transition-shadow duration-500 will-change-transform hover:shadow-[0_28px_70px_-24px_rgb(31_154_120/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-concepto"
                    >
                      <span className="relative block aspect-[3/4] w-full">
                        <Image
                          src={`/equipo/${persona.key}.jpg`}
                          alt={`${persona.nombre} — ${persona.rol}`}
                          fill
                          sizes={card === "lg" ? "(max-width: 640px) 100vw, 33vw" : card === "md" ? "(max-width: 768px) 50vw, 25vw" : "(max-width: 768px) 50vw, 17vw"}
                          className="object-cover grayscale-[0.4] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        />
                        <span aria-hidden="true" className="from-azul-principal/95 via-azul-principal/35 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent" />
                      </span>
                      <span className={`absolute inset-x-0 bottom-0 ${txt.pad}`}>
                        <span className={`font-display block leading-tight font-bold text-white ${txt.nombre}`}>
                          {persona.nombre}
                        </span>
                        <span className={`text-azul-claro/85 mt-1 line-clamp-1 block font-sans leading-snug ${txt.rol}`}>
                          {persona.rol}
                        </span>
                        <span className={`text-verde-concepto mt-1.5 block font-mono tracking-[0.16em] uppercase ${txt.pais}`}>
                          {persona.pais}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="bg-verde-concepto absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
                      >
                        <ArrowRight size={14} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Pendientes de foto: Andrea Vergara (Pensamiento Estadístico, Chile) y
          Luis López (Pensamiento Aritmético y Algebraico, Costa Rica). */}

      {/* ── Modal de ficha ──────────────────────────────────────────────── */}
      {p && (
        <div ref={modalRef} className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={`Ficha de ${p.nombre}`}>
          {/* Backdrop */}
          <div
            data-modal-backdrop
            onClick={() => setSel(null)}
            className="bg-azul-principal/90 absolute inset-0"
          />

          {/* Panel */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 md:p-8">
            <div
              data-modal-panel
              className="pointer-events-auto relative grid max-h-[90svh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[2fr_3fr]"
            >
              {/* Costura verde del morph: sella la unión foto+contenido */}
              <span
                data-modal-seam
                aria-hidden="true"
                className="bg-verde-concepto absolute inset-y-0 left-[40%] z-20 hidden w-[3px] origin-center opacity-0 md:block"
              />
              {/* Foto */}
              <div data-modal-photo className="relative hidden min-h-[24rem] md:block">
                <Image
                  key={p.key}
                  src={`/equipo/${p.key}.jpg`}
                  alt={p.nombre}
                  fill
                  sizes="40vw"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Contenido */}
              <div className="overflow-y-auto p-7 md:p-9">
                <span data-modal-bit className="text-verde-concepto font-mono text-[0.68rem] tracking-[0.18em] uppercase">
                  {p.pais} · {sel! + 1} / {EQUIPO.length}
                </span>
                <h4 data-modal-bit className="font-display text-azul-principal mt-2 text-[1.7rem] leading-tight font-bold tracking-[-0.01em]">
                  {p.nombre}
                </h4>
                <p data-modal-bit className="text-verde-concepto mt-1 font-sans text-[0.95rem] font-semibold">
                  {p.rol}
                </p>
                <p data-modal-bit className="text-gris-texto mt-4 font-sans text-[0.93rem] leading-relaxed">
                  {p.bio}
                </p>

                {/* Redes — TODO: pedir URLs de LinkedIn al cliente */}
                <div data-modal-bit className="mt-6 flex items-center gap-3">
                  {p.linkedin ? (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-azul-principal/15 text-azul-principal hover:border-verde-concepto hover:text-verde-concepto inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                      aria-label={`LinkedIn de ${p.nombre}`}
                    >
                      <Linkedin size={17} />
                    </a>
                  ) : (
                    <span
                      className="border-azul-principal/10 text-azul-principal/30 inline-flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border"
                      title="Perfil de LinkedIn próximamente"
                      aria-disabled="true"
                    >
                      <Linkedin size={17} />
                    </span>
                  )}
                  <span className="text-gris-texto/70 font-sans text-[0.78rem]">
                    {p.linkedin ? "LinkedIn" : "LinkedIn próximamente"}
                  </span>
                </div>

                {/* Publicaciones */}
                {p.pubs && p.pubs.length > 0 && (
                  <div data-modal-bit className="border-azul-principal/10 mt-6 border-t pt-5">
                    <p className="text-azul-principal flex items-center gap-2 font-sans text-[0.82rem] font-semibold tracking-wide uppercase">
                      <BookOpen size={15} className="text-verde-concepto" />
                      Publicaciones
                    </p>
                    <ul className="mt-3 space-y-2">
                      {p.pubs.map((pub) => (
                        <li key={pub.titulo} className="flex items-baseline gap-2">
                          <span aria-hidden="true" className="bg-verde-concepto mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {pub.url ? (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-azul-principal hover:text-verde-concepto font-sans text-[0.88rem] leading-snug underline-offset-2 hover:underline"
                            >
                              {pub.titulo}
                            </a>
                          ) : (
                            <span className="text-gris-texto font-sans text-[0.88rem] leading-snug">
                              {pub.titulo}
                              <span className="text-gris-texto/60"> · pronto en la Biblioteca</span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Navegación */}
                <div className="border-azul-principal/10 mt-7 flex items-center justify-between border-t pt-5">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    className="border-azul-principal/15 text-azul-principal hover:border-verde-concepto hover:bg-verde-concepto inline-flex h-10 w-10 rotate-180 items-center justify-center rounded-full border transition-all hover:text-white"
                    aria-label="Persona anterior"
                  >
                    <ArrowRight size={16} />
                  </button>
                  <span className="text-gris-texto/70 font-mono text-[0.72rem] tracking-[0.14em]">
                    ← → para navegar
                  </span>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    className="border-azul-principal/15 text-azul-principal hover:border-verde-concepto hover:bg-verde-concepto inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:text-white"
                    aria-label="Persona siguiente"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Cerrar */}
              <button
                ref={closeRef}
                type="button"
                onClick={() => setSel(null)}
                className="bg-azul-principal/85 absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-colors hover:bg-verde-concepto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-concepto"
                aria-label="Cerrar ficha"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
