"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Ciclo de investigación aplicada" (sitemap pág. 04, sección 4 · MÉTODO).
 * Lámina navy con el Ciclo de Desarrollo Profesional Docente de ED (modelo
 * conceptual): cuatro fases en secuencia con la PROBLEMATIZACIÓN como motor
 * en el centro. Las fases entran en cascada por scroll, los conectores se
 * dibujan y un remate deja claro que el ciclo se reinicia — de la
 * investigación a la acción, y de vuelta.
 *
 * Sin JS / prefers-reduced-motion: las 4 fases visibles y legibles en flujo.
 */

const FASES = [
  {
    n: "01",
    t: "Fase experiencial",
    sub: "«Vivir para hacer vivir»",
    d: "Los docentes vivencian tareas disruptivas que problematizan la matemática escolar.",
  },
  {
    n: "02",
    t: "Implementación en aula",
    sub: "Del taller a la clase",
    d: "Diseñan e implementan situaciones de aprendizaje con sus estudiantes.",
  },
  {
    n: "03",
    t: "Práctica reflexiva",
    sub: "Mirar lo que pasó",
    d: "Análisis colectivo de las experiencias, los argumentos y las evidencias de aprendizaje.",
  },
  {
    n: "04",
    t: "Resignificación del cme",
    sub: "Otra relación con el saber",
    d: "Cambios en la comprensión del conocimiento, en sus usos y en la relación con la matemática escolar.",
  },
] as const;

export function CicloInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      // acople de la lámina
      gsap.set(root, { transformOrigin: "50% 0%" });
      gsap.fromTo(
        root,
        { scale: 0.955, y: 44 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 24%", scrub: true },
        },
      );

      const motor = root.querySelector<HTMLElement>("[data-motor]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-fase-card]");
      const conns = gsap.utils.toArray<HTMLElement>("[data-conn]");
      const cierre = root.querySelector<HTMLElement>("[data-ciclo-cierre]");
      const trigger = root.querySelector<HTMLElement>("[data-ciclo-grid]");

      if (motor) {
        gsap.fromTo(
          motor,
          { autoAlpha: 0, scale: 0.9, y: 20 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: { trigger: trigger ?? root, start: "top 78%" },
          },
        );
      }
      gsap.set(conns, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(cards, { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: trigger ?? root, start: "top 68%" },
      });
      cards.forEach((c, i) => {
        tl.to(c, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, i * 0.28);
        if (conns[i]) tl.to(conns[i], { scaleX: 1, duration: 0.28, ease: "power2.inOut" }, i * 0.28 + 0.32);
      });
      if (cierre) {
        tl.fromTo(cierre, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6 }, ">-0.1");
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative z-30 -mt-[5svh] overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Ciclo de investigación aplicada"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[10%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.12)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[42ch]">
          <Eyebrow variant="light">Ciclo de investigación aplicada</Eyebrow>
          <h2
            className="font-display mt-6 font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.4rem)", lineHeight: 1.08 }}
          >
            De la investigación a la acción, y de vuelta.
          </h2>
        </div>

        {/* Motor central del ciclo */}
        <div data-motor className="mt-12 flex justify-center">
          <div className="border-verde-concepto/40 bg-verde-concepto/10 inline-flex flex-col items-center rounded-2xl border px-6 py-4 text-center">
            <span className="text-verde-concepto font-mono text-[0.68rem] tracking-[0.16em] uppercase">
              En el centro
            </span>
            <span className="font-display mt-1 text-[1.05rem] font-semibold text-white">
              Problematizar la matemática escolar
            </span>
          </div>
        </div>

        {/* Las 4 fases en secuencia */}
        <div data-ciclo-grid className="mt-14 grid gap-5 md:grid-cols-4 md:gap-0">
          {FASES.map((f, i) => (
            <div key={f.n} className="relative md:px-3">
              <div
                data-fase-card
                className="border-white/12 h-full rounded-2xl border bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <span className="font-mono text-verde-concepto text-[0.8rem] font-medium tabular-nums">
                  {f.n}
                </span>
                <h3 className="font-display mt-3 text-[1.15rem] leading-snug font-semibold">
                  {f.t}
                </h3>
                <p className="text-verde-concepto/90 mt-1 font-sans text-[0.85rem] font-medium italic">
                  {f.sub}
                </p>
                <p className="text-azul-claro mt-3 font-sans text-[0.9rem] leading-relaxed">
                  {f.d}
                </p>
              </div>
              {/* conector hacia la fase siguiente (desktop) */}
              {i < FASES.length - 1 && (
                <span
                  data-conn
                  aria-hidden="true"
                  className="bg-verde-concepto/50 absolute top-1/2 -right-1 hidden h-px w-6 md:block"
                />
              )}
            </div>
          ))}
        </div>

        {/* Remate: el ciclo se reinicia */}
        <p
          data-ciclo-cierre
          className="text-azul-claro mt-12 flex items-center gap-3 font-sans text-[0.98rem]"
        >
          <span className="text-verde-concepto text-[1.3rem]">↺</span>
          Y la resignificación abre nuevas preguntas: el ciclo vuelve a empezar.
        </p>
      </div>
    </section>
  );
}
