"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Datos de los 4 pasos ──────────────────────────────────────────────────
const PASOS = [
  {
    n: "01",
    slug: "escuchamos",
    titulo: "Escuchamos.",
    resumen: "Antes de proponer, leemos.",
    detalle:
      "Dialogamos con la institución y el profesorado, observamos el aula y relevamos necesidades reales para construir una lectura situada.",
    foto: "/metodo/escuchamos.png",
    fotoAlt: "Docentes en conversación — etapa de escucha",
  },
  {
    n: "02",
    slug: "disenamos",
    titulo: "Diseñamos.",
    resumen: "A medida, nunca enlatado.",
    detalle:
      "Co-construimos trayectos y materiales con base científica en matemática educativa, pensados para ese contexto y esas personas.",
    foto: "/metodo/disenamos.png",
    fotoAlt: "Planificación pedagógica colaborativa — etapa de diseño",
  },
  {
    n: "03",
    slug: "acompanamos",
    titulo: "Acompañamos.",
    resumen: "Presencia en todo el recorrido.",
    detalle:
      "Sostenemos la implementación en el territorio, reflexionamos sobre la práctica y ajustamos con evidencia para que el cambio perdure.",
    foto: "/metodo/acompanamos.png",
    fotoAlt: "Trabajo situado en el aula — etapa de acompañamiento",
  },
  {
    n: "04",
    slug: "reflexionamos",
    titulo: "Reflexionamos.",
    resumen: "El cambio que se sostiene.",
    detalle:
      "Revisamos la práctica con datos concretos, celebramos los avances y ajustamos las propuestas para que nada dependa de condiciones aisladas.",
    foto: "/metodo/reflexionamos.png",
    fotoAlt: "Equipo analizando resultados — etapa de reflexión",
  },
] as const;

/**
 * Bloque sticky scroll-telling. h-[400vh] + sticky top-0 h-screen
 * (sin pin:true — compatible con Lenis). 4 pasos con fotos reales que
 * se cross-fadean con el progreso del scroll. Timeline scrubbed mapea
 * 0→1 a las 4 fases. Nav lateral de puntos sincronizado. Mask reveal
 * del título de cada paso. Foto alterna izq/der por índice.
 */
export function ComoTrabajamos() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const pasos = el.querySelectorAll<HTMLElement>("[data-paso]");
      const navDots = el.querySelectorAll<HTMLElement>("[data-nav-dot]");
      const glowBg = el.querySelector<HTMLElement>("[data-glow-bg]");

      // ── Estado inicial: paso 0 visible, 1-3 ocultos ───────────────
      if (pasos.length === 4) {
        gsap.set(pasos[0], { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
        gsap.set([pasos[1], pasos[2], pasos[3]], {
          opacity: 0,
          y: 64,
          scale: 0.97,
          filter: "blur(8px)",
        });

        // ── Timeline scrubbed — 4 fases en 0→1 ───────────────────────
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        // 3 transiciones uniformes: [0.2→0.28], [0.45→0.53], [0.7→0.78]
        const TRANSITIONS = [
          { outAt: 0.2, inAt: 0.26 },
          { outAt: 0.45, inAt: 0.51 },
          { outAt: 0.7, inAt: 0.76 },
        ] as const;

        TRANSITIONS.forEach(({ outAt, inAt }, i) => {
          tl.to(
            pasos[i],
            {
              opacity: 0,
              y: -56,
              scale: 0.97,
              filter: "blur(8px)",
              duration: 0.1,
              ease: "power2.in",
            },
            outAt,
          ).to(
            pasos[i + 1],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.14,
              ease: "power3.out",
            },
            inAt,
          );
        });

        // ── Nav dots sincronizados ─────────────────────────────────
        if (navDots.length === 4) {
          const dotsTl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });
          [
            { from: 0, to: 1, t: 0.25 },
            { from: 1, to: 2, t: 0.5 },
            { from: 2, to: 3, t: 0.75 },
          ].forEach(({ from, to, t }) => {
            dotsTl
              .to(
                navDots[from],
                {
                  height: 8,
                  backgroundColor: "rgb(31 45 77 / 0.18)",
                  ease: "power2.inOut",
                  duration: 0.1,
                },
                t,
              )
              .to(
                navDots[to],
                {
                  height: 36,
                  backgroundColor: "var(--color-naranja-accion)",
                  ease: "power2.inOut",
                  duration: 0.1,
                },
                t,
              );
          });
        }
      }

      // ── Glow bg parallax ─────────────────────────────────────────
      if (glowBg) {
        gsap.fromTo(
          glowBg,
          { x: 0, y: 0 },
          {
            x: -120,
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: 2,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      data-section="metodo"
      className="bg-grain-light relative overflow-clip bg-gradient-to-b from-white via-white to-gris-fondo/20"
      aria-label="Cómo trabajamos"
    >
      <div className="relative h-[400vh]">
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Glow verde ambiental */}
          <div
            data-glow-bg
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 bottom-0 z-0 h-[44rem] w-[44rem] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgb(31 154 120 / 0.18) 0%, transparent 65%)",
            }}
          />

          {/* Eyebrow fijo + nav lateral */}
          <div className="absolute top-8 left-5 right-5 z-30 mx-auto flex max-w-screen-xl items-center justify-between md:top-10 md:left-10 md:right-10">
            <Eyebrow dashClass="w-8">Cómo trabajamos</Eyebrow>

            {/* Nav lateral de puntos — indicadores de progreso */}
            <div
              aria-hidden="true"
              className="flex flex-col items-center gap-2"
            >
              {PASOS.map((p, idx) => (
                <span
                  key={p.n}
                  data-nav-dot={idx}
                  className="w-1.5 rounded-full"
                  style={{
                    height: idx === 0 ? 36 : 8,
                    backgroundColor:
                      idx === 0
                        ? "var(--color-naranja-accion)"
                        : "rgb(31 45 77 / 0.18)",
                    transition: "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Pasos apilados full-screen */}
          <div className="absolute inset-0 flex items-center">
            {PASOS.map((paso, idx) => {
              const fotoRight = idx % 2 === 1;
              return (
                <div
                  key={paso.n}
                  data-paso={idx}
                  className="absolute inset-0 flex items-center"
                  style={{ willChange: "opacity, transform, filter" }}
                >
                  <div className="mx-auto grid w-full max-w-screen-xl items-center gap-8 px-5 md:grid-cols-12 md:gap-12 md:px-10">

                    {/* Foto real — alterna lado */}
                    <div
                      className={`hidden md:block md:col-span-5 ${fotoRight ? "md:order-2" : "md:order-1"}`}
                    >
                      <div className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-2xl shadow-[0_24px_64px_-16px_rgb(31_45_77/0.18)]">
                        <Image
                          src={paso.foto}
                          alt={paso.fotoAlt}
                          width={352}
                          height={469}
                          className="aspect-[3/4] w-full object-cover"
                          sizes="(max-width: 768px) 90vw, 352px"
                          priority={idx === 0}
                        />
                        {/* Overlay tenue de marca */}
                        <div
                          aria-hidden="true"
                          className="bg-verde-concepto/10 absolute inset-0 mix-blend-multiply"
                        />
                      </div>
                    </div>

                    {/* Contenido */}
                    <div
                      className={`relative md:col-span-7 ${fotoRight ? "md:order-1" : "md:order-2"}`}
                    >
                      {/* Número watermark */}
                      <span
                        aria-hidden="true"
                        className="font-display text-azul-principal/[0.05] pointer-events-none absolute -top-20 -left-2 select-none text-[9rem] leading-none font-bold tabular-nums md:text-[14rem]"
                      >
                        {paso.n}
                      </span>

                      {/* Caja glass para legibilidad */}
                      <div className="relative bg-white/60 backdrop-blur-[2px] rounded-2xl p-6 md:p-8 md:bg-transparent md:backdrop-blur-none md:p-0">
                        {/* Etiqueta naranja = acción */}
                        <span className="text-naranja-accion font-mono inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.28em] uppercase">
                          <span
                            aria-hidden="true"
                            className="bg-naranja-accion block h-px w-6"
                          />
                          Paso {paso.n} · {paso.slug}
                        </span>

                        <h2
                          className="font-display text-azul-principal mt-4 leading-[1.02] font-bold tracking-[-0.022em]"
                          style={{ fontSize: "clamp(2rem, 4.8vw, 3.5rem)" }}
                        >
                          {paso.titulo}
                        </h2>

                        {/* Resumen — verde concepto */}
                        <p className="text-verde-concepto mt-4 font-sans text-[1.05rem] font-semibold leading-snug md:text-[1.2rem]">
                          {paso.resumen}
                        </p>

                        <p className="text-gris-texto mt-3 max-w-md font-sans text-[0.97rem] leading-relaxed md:text-[1.02rem]">
                          {paso.detalle}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Enlace fijo al pie */}
          <div className="absolute bottom-8 left-5 z-30 w-full max-w-screen-xl md:bottom-10 md:left-10">
            <Link
              href="/que-hacemos"
              className="group inline-flex items-center gap-3"
            >
              <span className="border-azul-principal/15 group-hover:border-naranja-accion group-hover:bg-naranja-accion inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 group-hover:text-white">
                <ArrowRight size={16} />
              </span>
              <span className="text-azul-principal group-hover:text-naranja-accion font-sans text-[0.88rem] font-medium tracking-wide transition-colors duration-500">
                Ver cómo trabajamos en detalle
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
