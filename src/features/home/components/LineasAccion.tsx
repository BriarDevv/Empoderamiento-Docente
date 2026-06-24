"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINEAS = [
  {
    n: "01",
    titulo: "Formación docente",
    detalle: "Trayectos situados para quienes enseñan matemática.",
  },
  {
    n: "02",
    titulo: "Asesoría a instituciones",
    detalle: "Acompañamiento a escuelas y redes en procesos de mejora.",
  },
  {
    n: "03",
    titulo: "Investigación aplicada",
    detalle: "Conocimiento que vuelve al aula como práctica concreta.",
  },
  {
    n: "04",
    titulo: "Materiales y recursos",
    detalle: "Propuestas listas para llevar a la enseñanza diaria.",
  },
] as const;

/**
 * Lista editorial numerada de las áreas de trabajo. Filas con reveal
 * lateral + máscara (clip-path inset izq→0, stagger). Fondo con parallax
 * dispar en capas (data-speed 0.85–1.3). Números en font-mono.
 * Enlace a /investigacion. Fondo gris-fondo.
 */
export function LineasAccion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ── Parallax dispar de formas de fondo ───────────────────────
      el.querySelectorAll<HTMLElement>("[data-speed]").forEach((shape) => {
        const speed = parseFloat(shape.getAttribute("data-speed") ?? "1");
        gsap.to(shape, {
          yPercent: (1 - speed) * -50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      // ── Header: mask reveal ──────────────────────────────────────
      const headline = el.querySelector("[data-lineas-headline]");
      if (headline) {
        gsap.fromTo(
          headline,
          { clipPath: "inset(0 0 100% 0)", y: 24 },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headline,
              start: "top 84%",
              once: true,
            },
          },
        );
      }

      // ── Filas: reveal lateral + máscara (clip-path desde derecha) ─
      const rows = el.querySelectorAll<HTMLElement>("[data-linea-row]");
      if (rows.length) {
        gsap.fromTo(
          rows,
          {
            opacity: 0,
            x: -48,
            clipPath: "inset(0 0 0 8%)",
            filter: "blur(6px)",
          },
          {
            opacity: 1,
            x: 0,
            clipPath: "inset(0 0 0 0%)",
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.13,
            scrollTrigger: {
              trigger: el.querySelector("[data-lineas-list]"),
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // ── Números: entran con escala+resorte, ligeramente después ───
      const nums = el.querySelectorAll<HTMLElement>("[data-linea-num]");
      if (nums.length) {
        gsap.fromTo(
          nums,
          { opacity: 0, scale: 0.5, x: -24 },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 1,
            ease: "back.out(2)",
            stagger: 0.13,
            delay: 0.1,
            scrollTrigger: {
              trigger: el.querySelector("[data-lineas-list]"),
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // ── CTA final ─────────────────────────────────────────────────
      const cta = el.querySelector("[data-lineas-cta]");
      if (cta) {
        gsap.fromTo(
          cta,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: cta,
              start: "top 90%",
              once: true,
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
      className="bg-gris-fondo relative overflow-hidden py-24 md:py-32"
      aria-label="Líneas de acción"
    >
      {/* Formas de fondo con parallax dispar */}
      <span
        aria-hidden="true"
        data-speed="0.85"
        className="bg-verde-concepto pointer-events-none absolute -bottom-24 -left-24 z-0 hidden h-72 w-72 rounded-full opacity-80 md:block"
      />
      <span
        aria-hidden="true"
        data-speed="1.28"
        className="bg-verde-concepto/[0.06] pointer-events-none absolute -top-16 right-[12%] z-0 h-[24rem] w-[24rem] rounded-full blur-3xl"
      />
      <span
        aria-hidden="true"
        data-speed="1.05"
        className="pointer-events-none absolute top-[18%] right-14 z-0 hidden h-40 w-40 bg-[radial-gradient(circle,rgb(74_111_165/0.3)_2.5px,transparent_3px)] [background-size:22px_22px] md:block"
      />
      <span
        aria-hidden="true"
        data-speed="0.9"
        className="border-azul-medio/15 pointer-events-none absolute left-[8%] top-[40%] z-0 hidden h-16 w-16 rounded-full border-2 md:block"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Header */}
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Eyebrow>Líneas de acción</Eyebrow>
            <div className="overflow-hidden mt-6">
              <h2
                data-lineas-headline
                className="font-display text-azul-principal font-bold tracking-[-0.018em] leading-[1.04]"
                style={{ fontSize: "clamp(2rem, 4.4vw, 3.25rem)" }}
              >
                Lo que hacemos,{" "}
                <span className="text-verde-concepto">en concreto</span>.
              </h2>
            </div>
          </div>
          <p className="text-gris-texto font-sans text-[0.97rem] leading-relaxed md:col-span-5 md:text-right">
            Cuatro frentes de trabajo para acompañar la enseñanza de la
            matemática.
          </p>
        </div>

        {/* Lista editorial numerada */}
        <ul data-lineas-list className="mt-14 md:mt-20">
          {LINEAS.map(({ n, titulo, detalle }) => (
            <li key={n} data-linea-row>
              <div className="border-azul-principal/10 group hover:border-verde-concepto/30 relative grid grid-cols-[auto_1fr] items-center gap-x-5 border-t py-7 transition-colors duration-500 md:grid-cols-[5rem_1fr_auto] md:gap-x-8 md:py-9">
                {/* Número mono */}
                <span
                  data-linea-num
                  className="font-mono text-azul-principal/20 group-hover:text-verde-concepto/40 text-[1.9rem] leading-none font-bold tabular-nums transition-colors duration-500 md:text-[2.75rem]"
                >
                  {n}
                </span>

                {/* Título + detalle */}
                <div>
                  <h3 className="font-display text-azul-principal text-[1.15rem] leading-tight font-bold tracking-[-0.01em] md:text-[1.55rem]">
                    {titulo}
                  </h3>
                  <p className="text-gris-texto mt-1.5 max-w-xl font-sans text-[0.93rem] leading-relaxed">
                    {detalle}
                  </p>
                </div>

                {/* Flecha */}
                <span
                  aria-hidden="true"
                  className="border-azul-principal/15 text-azul-principal group-hover:border-naranja-accion group-hover:bg-naranja-accion col-span-2 hidden h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 group-hover:text-white md:col-span-1 md:inline-flex"
                >
                  <ArrowRight size={16} />
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          data-lineas-cta
          className="border-azul-principal/10 mt-4 flex border-t pt-10"
        >
          <Link href="/investigacion" className="group inline-flex items-center gap-3">
            <span className="border-azul-principal/15 group-hover:border-naranja-accion group-hover:bg-naranja-accion inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 group-hover:text-white">
              <ArrowRight size={17} />
            </span>
            <span className="text-azul-principal group-hover:text-naranja-accion font-sans text-[0.93rem] font-medium tracking-wide transition-colors duration-500">
              Explorar nuestra investigación
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
