"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ArrowUpRight } from "@/components/ui/icons";
import { LINEAS, type Linea } from "../data";
import { useTilt } from "@/lib/hooks/useTilt";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Card de línea — se inclina en 3D hacia el cursor. */
function LineaCard({ l }: { l: Linea }) {
  const ref = useTilt<HTMLElement>({ max: 8, lift: 6 });
  return (
    <article
      ref={ref}
      data-linea
      className="border-azul-principal/8 hover:border-verde-concepto/40 group relative flex flex-col rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgb(31_45_77/0.04),0_18px_40px_-22px_rgb(31_45_77/0.14)] transition-colors will-change-transform"
    >
      <span className="text-verde-concepto-texto font-mono text-[0.85rem] font-medium tabular-nums">
        {l.n}
      </span>
      <h3 className="font-display text-azul-principal mt-4 text-[1.12rem] leading-snug font-bold tracking-[-0.01em]">
        {l.t}
      </h3>
      <p className="text-gris-texto mt-2 font-sans text-[0.92rem] leading-relaxed">
        {l.d}
      </p>
    </article>
  );
}

/**
 * "Líneas de investigación" — las 7 líneas del modelo como grilla de cards que
 * se inclinan hacia el cursor (useTilt), en vez del índice plano anterior.
 * Fondo claro. Descripciones: síntesis del modelo → VALIDAR con el cliente.
 * Sin motion: grilla legible, sin inclinación.
 */
export function LineasInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-linea]", {
        autoAlpha: 0,
        y: 28,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-lineas-grid]", start: "top 82%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="lineas"
      className="bg-gris-fondo scroll-mt-24"
      aria-label="Líneas de investigación"
    >
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[46ch]">
          <Eyebrow>Líneas de investigación</Eyebrow>
          <RevealLines
            as="h2"
            className="font-display text-azul-principal mt-6 max-w-[16ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.4rem)", lineHeight: 1.06 }}
          >
            Siete líneas, un mismo objeto.
          </RevealLines>
          <p className="text-gris-texto mt-6 max-w-[44ch] font-sans text-[1.02rem] leading-relaxed">
            Los grandes temas que estudia ED. Todos giran alrededor de una
            pregunta: cómo se transforma la relación con la matemática escolar.
          </p>
        </div>

        <div
          data-lineas-grid
          className="mt-12 grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {LINEAS.map((l) => (
            <LineaCard key={l.n} l={l} />
          ))}
        </div>

        <a
          href="#en-accion"
          className="group text-azul-principal hover:text-verde-concepto-texto mt-12 inline-flex items-center gap-2 font-sans text-[0.95rem] font-medium transition-colors"
        >
          Verlas en acción
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </section>
  );
}
