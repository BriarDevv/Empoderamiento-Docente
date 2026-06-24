"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_LINKS, CTA_LINK } from "@/config/nav";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Réplica del hero de blueprintapps.io traducida a la marca de ED.
 *
 * Comportamiento (intro coreografiada con GSAP):
 *  1. Cards arrancan APILADAS en el centro y vuelan a sus posiciones (scatter).
 *  2. El navbar arranca CERRADO (isotipo + wordmark "Empoderamiento Docente");
 *     el wordmark se colapsa, queda el isotipo y se ABRE (entran links + CTA).
 *  3. Sube el titular y aparece el CTA.
 * Fondo navy de marca con grilla doble (cells sólidas + sub-grilla punteada)
 * que se ILUMINA siguiendo el mouse. Parallax por scroll (mismo stack Lenis).
 *
 * Fotos en /public/blueprint = fotos reales de ED (docentes, talleres,
 * formación). Las cards sin `label` no muestran caption (se pueden agregar
 * captions de concepto de ED si se desea).
 */

type CardLabel = { name: string; role: string };
type Card = {
  id: number;
  img: string;
  leftPct: number; // posición relativa al viewport (vw) — como el original
  topPct: number; // posición relativa al viewport (vh)
  wVw: number; // ancho en vw (% del ancho del viewport)
  aspect: number; // alto / ancho
  speed: number; // parallax (px) al scrollear
  label?: CardLabel;
};

// Posiciones EXACTAS del hero original (medidas a 1920×1080, post-intro, mouse
// neutro) → coinciden con la referencia. Relativas al viewport para que las
// imágenes abracen bordes/esquinas igual que el original. hero-7/8/9 quedan
// apenas debajo del fold (se asoman al scrollear con el parallax).
const CARDS: readonly Card[] = [
  {
    id: 1,
    img: "/blueprint/hero-1.jpg",
    leftPct: 23.3,
    topPct: 1.4,
    wVw: 17.4,
    aspect: 0.835,
    speed: -150,
  },
  {
    id: 2,
    img: "/blueprint/hero-2.jpg",
    leftPct: 72.5,
    topPct: 11.1,
    wVw: 12.7,
    aspect: 1.275,
    speed: -320,
  },
  {
    id: 3,
    img: "/blueprint/hero-3.jpg",
    leftPct: 84.1,
    topPct: 23.0,
    wVw: 13.9,
    aspect: 1.333,
    speed: -110,
  },
  {
    id: 4,
    img: "/blueprint/hero-4.jpg",
    leftPct: 1.3,
    topPct: 28.0,
    wVw: 12.7,
    aspect: 1.184,
    speed: -260,
  },
  {
    id: 5,
    img: "/blueprint/hero-5.jpg",
    leftPct: 9.6,
    topPct: 59.6,
    wVw: 16.2,
    aspect: 0.859,
    speed: -150,
  },
  {
    id: 6,
    img: "/blueprint/hero-6.jpg",
    leftPct: 60.5,
    topPct: 81.6,
    wVw: 19.7,
    aspect: 0.765,
    speed: -300,
  },
  {
    id: 7,
    img: "/blueprint/hero-7.jpg",
    leftPct: 44,
    topPct: 104,
    wVw: 14.5,
    aspect: 1.28,
    speed: -200,
  },
  {
    id: 8,
    img: "/blueprint/hero-8.jpg",
    leftPct: 20,
    topPct: 112,
    wVw: 19.7,
    aspect: 0.735,
    speed: -260,
  },
  {
    id: 9,
    img: "/blueprint/hero-9.jpg",
    leftPct: 73,
    topPct: 107,
    wVw: 9.8,
    aspect: 1.353,
    speed: -130,
  },
] as const;

// Grilla relativa al ELEMENTO (100%, no 100vw → sin sesgo de la barra de
// scroll). 18 columnas (17 enteras + 1/2 a cada lado) y 10 filas (9 enteras +
// 1/2 arriba/abajo). `background-position: center` hace que las mitades de los
// bordes sean simétricas por construcción.
const COLS = 18;
const ROWS = 10;
const CW = `calc(100% / ${COLS})`;
const CH = `calc(100% / ${ROWS})`;

// Dos tiles SVG con la MISMA geometría (mismo viewBox/size/position) → tilean
// idéntico y quedan alineados a la perfección entre sí:
//  - gridMainTile: solo el borde sólido del cuadro grande (4 lados). SIEMPRE
//    visible. Bordes compartidos entre celdas vecinas se solapan → 1px completo.
//  - gridSubTile: solo la sub-grilla 5×5 punteada (líneas internas a 1/5..4/5).
//    Se revela ÚNICAMENTE en el círculo que sigue al cursor.
const gridMainTile = (line: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M0 0H100M0 100H100M0 0V100M100 0V100' fill='none' stroke='${line}' stroke-width='1'/></svg>`,
  )}")`;

const gridSubTile = (sub: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'><g fill='none' stroke='${sub}' stroke-width='1' stroke-dasharray='5 4'><path d='M20 0V100M40 0V100M60 0V100M80 0V100M0 20H100M0 40H100M0 60H100M0 80H100'/></g></svg>`,
  )}")`;

const GRID_SIZE = `${CW} ${CH}`;
const GRID_POS = "center";

export function BlueprintHero() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  // Intro coreografiada + parallax.
  useIsomorphicLayoutEffect(() => {
    const scope = heroRef.current;
    if (!scope || reducedMotion) return;

    const ctx = gsap.context(() => {
      // Estado inicial CERRADO del navbar (el JSX por defecto es el ABIERTO,
      // para que sin JS / reduced-motion se vea el estado final).
      gsap.set("[data-nav-word]", {
        width: "auto",
        autoAlpha: 1,
        marginLeft: 12,
      });
      gsap.set("[data-nav-links]", { width: 0, autoAlpha: 0 });

      // Estado inicial de las cards: APILADAS y superpuestas en el centro,
      // chicas e invisibles (el offset al centro se calcula en runtime).
      gsap.set("[data-bp-inner]", {
        x: (_i, el: HTMLElement) => {
          const r = el.getBoundingClientRect();
          return window.innerWidth / 2 - (r.left + r.width / 2);
        },
        y: (_i, el: HTMLElement) => {
          const r = el.getBoundingClientRect();
          return window.innerHeight / 2 - (r.top + r.height / 2);
        },
        scale: 0.5,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });

      // 1a. Aparecen apiladas/superpuestas en el centro.
      tl.to("[data-bp-inner]", {
        autoAlpha: 1,
        scale: 0.62,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.04,
      });

      // 1b. Se abren desde el centro hacia sus posiciones (más lento, suave).
      tl.to(
        "[data-bp-inner]",
        {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.7,
          ease: "power3.inOut",
          stagger: { each: 0.06, from: "center" },
        },
        "+=0.15",
      );

      // 2. Titular + descripción + CTA (mientras terminan de abrirse).
      tl.from(
        "[data-bp-headline] .bp-line",
        { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.12 },
        "-=1.0",
      )
        .from("[data-bp-desc]", { opacity: 0, y: 18, duration: 0.7 }, "-=0.55")
        .from("[data-bp-cta]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4");

      // 3. Navbar: morph "cerrado → abierto" (colapsa el wordmark + abren los
      //    links A LA VEZ, fluido como antes). El fade del wordmark va más
      //    rápido y adelantado que el colapso de ancho → el texto desaparece
      //    antes de que se note el recorte de "Docente".
      tl.to(
        "[data-nav-word]",
        { autoAlpha: 0, duration: 0.22, ease: "power1.in" },
        "-=0.7",
      )
        .to(
          "[data-nav-word]",
          { width: 0, marginLeft: 0, duration: 0.5, ease: "power3.inOut" },
          "<",
        )
        .to(
          "[data-nav-links]",
          { width: "auto", autoAlpha: 1, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        );

      // Parallax: cada card deriva hacia arriba a su propia velocidad.
      gsap.utils.toArray<HTMLElement>("[data-bp-card]").forEach((card) => {
        gsap.to(card, {
          y: Number(card.dataset.speed ?? 0),
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Mouse, con RETARDO suave (trailing/lerp). Maneja dos efectos:
  //  - Glow de la grilla: --mx/--my en px (centro del círculo revelado).
  //  - Parallax de las imágenes: --pnx/--pny normalizados (-1..1) desde el
  //    centro; cada card los multiplica por su profundidad y se desplaza.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let tx = -1000;
    let ty = -1000; // objetivo (mouse)
    let cx = -1000;
    let cy = -1000; // actual (lerp)
    let started = false;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!started) {
        cx = tx;
        cy = ty;
        started = true;
      }
    };
    const EASE = 0.09; // más bajo = más retardo
    const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
    const tick = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      el.style.setProperty("--mx", `${cx}px`);
      el.style.setProperty("--my", `${cy}px`);
      if (started) {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        el.style.setProperty("--pnx", clamp((cx - w / 2) / (w / 2)).toFixed(4));
        el.style.setProperty("--pny", clamp((cy - h / 2) / (h / 2)).toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-gris-fondo text-azul-principal">
      <section
        ref={heroRef}
        className="faro-glow relative h-screen min-h-[760px] overflow-hidden"
        style={
          {
            "--mx": "-1000px",
            "--my": "-1000px",
            "--pnx": "0",
            "--pny": "0",
          } as React.CSSProperties
        }
      >
        {/* Grilla principal (cuadros grandes): SIEMPRE visible, sutil.
            Sobre fondo claro → líneas en gris-texto a baja opacidad (DESIGN §6). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: gridMainTile("rgba(107,114,128,0.22)"),
            backgroundSize: GRID_SIZE,
            backgroundPosition: GRID_POS,
          }}
        />
        {/* Halo de luz (faro) azul-claro que sigue al cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle 280px at var(--mx) var(--my), rgba(169,197,232,0.35), rgba(169,197,232,0.10) 45%, transparent 72%)",
          }}
        />
        {/* Bajo el cursor: se ilumina la grilla grande (azul-medio) y recién ahí
            aparece la sub-grilla 5×5 interna de cada cuadro. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `${gridSubTile("rgba(74,111,165,0.3)")}, ${gridMainTile("rgba(74,111,165,0.55)")}`,
            backgroundSize: `${GRID_SIZE}, ${GRID_SIZE}`,
            backgroundPosition: GRID_POS,
            maskImage:
              "radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, transparent 70%)",
          }}
        />

        {/* Navbar pill grande con apertura (isotipo + wordmark → isotipo + links) */}
        <nav
          data-bp-nav
          className="border-azul-principal/10 fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-[1.25rem] border bg-white/70 px-4 py-3 backdrop-blur-xl"
        >
          {/* Grupo logo + wordmark. El wordmark colapsa (width + marginLeft → 0)
              SIN dejar gap residual: la separación con los links la da el gap-3
              del nav entre ESTE grupo y el bloque de links → siempre consistente. */}
          <div className="flex shrink-0 items-center">
            {/* Logo (PNG transparente) tal cual lo pasó el cliente, sin recuadro. */}
            <Image
              src="/brand/logotipo-principal-ed.png"
              alt="Empoderamiento Docente"
              width={425}
              height={467}
              priority
              unoptimized
              className="h-11 w-auto shrink-0"
            />
            {/* Wordmark que se colapsa */}
            <span
              data-nav-word
              className="font-display overflow-hidden text-[1.05rem] font-extrabold tracking-tight whitespace-nowrap"
              style={{ width: 0, opacity: 0 }}
            >
              Empoderamiento&nbsp;Docente
            </span>
          </div>

          {/* Links + CTA que se abren */}
          <div
            data-nav-links
            className="flex items-center gap-1 overflow-hidden whitespace-nowrap"
          >
            <ul className="text-azul-principal/70 hidden items-center gap-1 pr-2 font-mono text-[14px] lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:bg-azul-principal/5 hover:text-azul-principal rounded-lg px-3 py-2 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={CTA_LINK.href}
              className="bg-naranja-accion rounded-xl px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              {CTA_LINK.label}
            </a>
          </div>
        </nav>

        {/* Cards posicionadas relativo al viewport (vw/vh), como el original:
            abrazan bordes y esquinas. Capas independientes:
            root = mouse-parallax (CSS) · data-bp-card = scroll-parallax (GSAP)
            · data-bp-inner = intro (GSAP). La profundidad escala con el tamaño
            (cards grandes = más cerca = se mueven más con el mouse). */}
        <div className="absolute inset-0">
          {CARDS.map((card) => {
            const depth = -Math.round(card.wVw * 2); // negativo = lado contrario al mouse
            return (
              <div
                key={card.id}
                className="absolute will-change-transform"
                style={{
                  left: `${card.leftPct}vw`,
                  top: `${card.topPct}vh`,
                  width: `${card.wVw}vw`,
                  height: `${(card.wVw * card.aspect).toFixed(2)}vw`,
                  transform: `translate(calc(var(--pnx, 0) * ${depth}px), calc(var(--pny, 0) * ${depth}px))`,
                }}
              >
                <div
                  data-bp-card
                  data-speed={card.speed}
                  className="relative h-full w-full will-change-transform"
                >
                  <div data-bp-inner className="relative h-full w-full">
                    <div className="ring-azul-principal/10 shadow-azul-principal/15 relative h-full w-full overflow-hidden rounded-[12px] shadow-xl ring-1">
                      <Image
                        src={card.img}
                        alt=""
                        fill
                        sizes="22vw"
                        priority={
                          card.id === 1 || card.id === 3 || card.id === 6
                        }
                        className="object-cover"
                      />
                    </div>
                    {card.label ? (
                      <div className="border-azul-principal/10 shadow-azul-principal/10 absolute -bottom-5 left-3 max-w-[220px] rounded-[12px] border bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md">
                        <p className="text-azul-principal font-mono text-[11px] leading-tight font-medium">
                          {card.label.name}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] leading-snug">
                          <span className="text-verde-concepto">
                            {card.label.role.split(" — ")[0]}
                          </span>
                          <span className="text-gris-texto">
                            {" "}
                            — {card.label.role.split(" — ")[1]}
                          </span>
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Titular central */}
        <div className="absolute inset-x-0 top-[36%] z-30 flex flex-col items-center px-6 text-center">
          <h1
            data-bp-headline
            className="text-azul-principal font-display text-[clamp(1.85rem,0.8rem+2.8vw,2.9rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance [text-shadow:0_2px_20px_rgba(242,244,247,0.9)]"
          >
            <span className="bp-line block overflow-hidden">
              <span className="block">Generando escenarios</span>
            </span>
            <span className="bp-line block overflow-hidden">
              <span className="block">
                de <span className="text-verde-concepto">aprendizaje</span>.
              </span>
            </span>
          </h1>
          <p
            data-bp-desc
            className="text-gris-texto mt-5 max-w-xl text-[15px] leading-relaxed [text-shadow:0_2px_14px_rgba(242,244,247,0.9)]"
          >
            Con foco en aprender, no solo en enseñar.
          </p>
          <div
            data-bp-cta
            className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {/* CTA primario: botón naranja (DESIGN §7). Va a /contacto (consultas
                por servicios / preguntas) → label cálido que invita a conversar. */}
            <a
              href={CTA_LINK.href}
              className="bg-naranja-accion shadow-naranja-accion/25 group inline-flex items-center gap-1.5 rounded-lg px-6 py-3 text-[15px] font-medium text-white shadow-lg transition-opacity hover:opacity-90"
            >
              Hablemos
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
            {/* Secundario: solo navega → /que-hacemos. Label específico para no
                confundir con "Quiénes somos". */}
            <a
              href={NAV_LINKS[0].href}
              className="text-azul-principal/80 hover:text-azul-principal text-[15px] font-medium underline-offset-4 transition-colors hover:underline"
            >
              Lo que hacemos
            </a>
          </div>
        </div>
      </section>

      {/* Espacio de scroll para apreciar el parallax */}
      <section className="flex h-[120vh] items-start justify-center pt-32">
        <p className="text-gris-texto/60 font-mono text-sm">
          (espacio para ver el parallax — acá iría el resto de la página)
        </p>
      </section>
    </div>
  );
}
