"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { BookOpen, LampManual, Target, Compass } from "@/components/ui/icons";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Conexión con Investigación" (sitemap pág. 05, sección 7 · PUENTE) —
 * VERSIÓN A: cards que se DAN VUELTA. Cada tipo de recurso (frente) esconde,
 * en el dorso, la línea de investigación que lo origina: "detrás de cada
 * recurso hay una investigación", literal y jugable. Flip al hover/focus,
 * entrada en cascada por scroll. Fondo claro. CTA ↗ Investigación.
 *
 * Mapeo recurso→línea: inferido del modelo conceptual — VALIDAR con cliente.
 * Sin JS / prefers-reduced-motion: cards visibles (frente); el dorso aparece
 * igual al hover/focus (es solo CSS).
 */

const CARDS = [
  { Icon: BookOpen, tipo: "Publicaciones", linea: "Resignificación del conocimiento matemático escolar" },
  { Icon: LampManual, tipo: "Materiales", linea: "Tareas disruptivas y matemática funcional" },
  { Icon: Target, tipo: "Proyectos", linea: "Desarrollo profesional docente sostenido" },
  { Icon: Compass, tipo: "Guías", linea: "Desarrollo del pensamiento matemático" },
] as const;

export function PuenteInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-flip]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 30, rotateX: -12 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-flip-grid]", start: "top 82%" },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative bg-white" aria-label="Conexión con Investigación">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[46ch]">
          <RevealLines
            as="h2"
            className="font-display text-azul-principal max-w-[18ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.6rem)", lineHeight: 1.06 }}
          >
            Detrás de cada recurso, una investigación.
          </RevealLines>
          <p className="text-gris-texto mt-6 font-sans text-[1.05rem] leading-relaxed">
            Pasá el mouse por cada tarjeta: nada de lo que hay en la biblioteca
            salió de la nada. Todo nace de estudiar cómo se aprende y se enseña
            la matemática.
          </p>
        </div>

        <div data-flip-grid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ Icon, tipo, linea }) => (
            <div key={tipo} data-flip className="group h-56 [perspective:1200px]">
              <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]">
                {/* Frente: el recurso */}
                <div className="border-azul-claro/50 absolute inset-0 flex flex-col justify-between rounded-2xl border bg-gris-fondo/50 p-6 [backface-visibility:hidden]">
                  <span className="bg-azul-principal/8 text-verde-concepto flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon size={24} />
                  </span>
                  <div>
                    <h3 className="font-display text-azul-principal text-[1.25rem] font-bold">{tipo}</h3>
                    <button
                      type="button"
                      className="text-gris-texto mt-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase"
                    >
                      Ver origen →
                    </button>
                  </div>
                </div>
                {/* Dorso: la investigación que lo origina */}
                <div className="bg-azul-principal absolute inset-0 flex flex-col justify-between rounded-2xl p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-verde-concepto font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                    Nace de
                  </span>
                  <p className="font-display text-[1.02rem] leading-snug font-semibold">{linea}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <ButtonSecondary href="/investigacion">Ir a Investigación</ButtonSecondary>
          <ButtonSecondary href="/novedades">Ver novedades</ButtonSecondary>
        </div>
      </div>
    </section>
  );
}
