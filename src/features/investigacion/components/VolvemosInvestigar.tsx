"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ArrowUpRight } from "@/components/ui/icons";
import { PASOS } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Volvemos a investigar" — el feedback loop de ED, sin el lazo SVG (línea) de
 * antes. Los 4 pasos entran en cascada por scroll; los números reaccionan al
 * hover. El "loop" se dice con texto (↺ el ciclo no se cierra), no con un
 * gráfico de líneas. Fondo claro. CTA → Biblioteca. Sin motion: pasos legibles.
 */
export function VolvemosInvestigar() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-paso]", {
        autoAlpha: 0,
        x: -28,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-pasos]", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="bg-white" aria-label="Volvemos a investigar">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[46ch]">
          <Eyebrow>Volvemos a investigar</Eyebrow>
          <RevealLines
            as="h2"
            className="font-display text-azul-principal mt-6 max-w-[18ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.9rem, 1rem + 2.6vw, 3.2rem)", lineHeight: 1.08 }}
          >
            Evidencia, análisis y conocimiento.
          </RevealLines>
          <p className="text-gris-texto mt-6 max-w-[48ch] font-sans text-[1.05rem] leading-relaxed">
            Como organización que investiga, cerramos el círculo: lo que
            aprendemos en el aula alimenta la próxima pregunta.
          </p>
        </div>

        <ol data-pasos className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {PASOS.map((p, i) => (
            <li key={p.t} data-paso className="group flex gap-5">
              <span className="font-display text-verde-concepto/25 group-hover:text-verde-concepto/70 text-[2.6rem] leading-none font-extrabold tabular-nums transition-colors">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-display text-azul-principal text-[1.2rem] leading-snug font-bold">
                  {p.t}
                </h3>
                <p className="text-gris-texto mt-2 max-w-[42ch] font-sans text-[0.95rem] leading-relaxed">
                  {p.d}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-azul-principal flex items-center gap-2 text-[1.2rem] font-semibold">
            <span className="text-verde-concepto text-[1.4rem]">↺</span>
            Y el ciclo no se cierra: vuelve a empezar.
          </p>
          <a
            href="/biblioteca"
            className="group text-azul-principal hover:text-verde-concepto-texto inline-flex items-center gap-2 font-sans text-[0.95rem] font-medium transition-colors"
          >
            Ver la producción en la Biblioteca
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
