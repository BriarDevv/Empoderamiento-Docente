"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ArrowUpRight } from "@/components/ui/icons";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Volvemos a investigar" (sitemap pág. 04, sección 5 · MEJORA CONTINUA). El
 * feedback loop de ED como organización que investiga: 4 pasos (modelo
 * conceptual) que cierran el círculo y lo reinician. A la izquierda un LAZO
 * que se dibuja con el scroll (el ciclo que no se cierra); a la derecha los 4
 * pasos entran en cascada. Fondo claro. CTA ↗ Biblioteca (donde vive la
 * producción de conocimiento).
 *
 * Sin JS / prefers-reduced-motion: lazo visible y 4 pasos legibles.
 */

const PASOS = [
  {
    t: "Recolección de evidencias",
    d: "Observaciones, producciones, registros de clase y resultados de aprendizaje.",
  },
  {
    t: "Análisis e interpretación",
    d: "Procesos de resignificación y cambios en la relación con el conocimiento.",
  },
  {
    t: "Producción de conocimiento",
    d: "Informes, publicaciones y modelos teóricos y metodológicos propios.",
  },
  {
    t: "Retroalimentación del ciclo",
    d: "Los hallazgos orientan nuevas acciones y proyectos. El ciclo continúa.",
  },
] as const;

export function VolvemosInvestigar() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const loop = root.querySelector<SVGPathElement>("[data-loop-path]");
      const arrow = root.querySelector<SVGPolygonElement>("[data-loop-arrow]");
      const pasos = gsap.utils.toArray<HTMLElement>("[data-paso]");

      if (loop) {
        const len = loop.getTotalLength();
        gsap.set(loop, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(loop, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 70%", end: "bottom 75%", scrub: 0.6 },
        });
      }
      if (arrow) {
        gsap.fromTo(
          arrow,
          { autoAlpha: 0 },
          { autoAlpha: 1, scrollTrigger: { trigger: root, start: "top 40%" } },
        );
      }
      pasos.forEach((p) => {
        gsap.fromTo(
          p,
          { autoAlpha: 0, x: 26 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: p, start: "top 86%" },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative bg-white" aria-label="Volvemos a investigar">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="items-center gap-12 lg:grid lg:grid-cols-2">
          {/* Lazo que se dibuja */}
          <div className="relative flex justify-center">
            <svg viewBox="0 0 320 320" className="w-full max-w-[22rem]" aria-hidden="true">
              {/* círculo base tenue */}
              <circle cx="160" cy="160" r="120" fill="none" stroke="#a9c5e8" strokeWidth="1" strokeOpacity="0.4" />
              {/* lazo que se traza (deja un hueco arriba para la flecha de retorno) */}
              <path
                data-loop-path
                d="M 160 40 A 120 120 0 1 1 118 48"
                fill="none"
                stroke="#1f9a78"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* flecha de retorno (el ciclo reinicia) */}
              <polygon data-loop-arrow points="160,30 172,44 150,48" fill="#1f9a78" />
              <text x="160" y="150" textAnchor="middle" className="font-display" fontSize="16" fontWeight="700" fill="#1f2d4d">
                el ciclo
              </text>
              <text x="160" y="176" textAnchor="middle" className="font-display" fontSize="16" fontWeight="700" fill="#1f9a78">
                no se cierra
              </text>
            </svg>
          </div>

          {/* Copy + 4 pasos */}
          <div className="mt-12 lg:mt-0">
            <Eyebrow>Volvemos a investigar</Eyebrow>
            <RevealLines
              as="h2"
              className="font-display text-azul-principal mt-6 max-w-[18ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.9rem, 1rem + 2.6vw, 3rem)", lineHeight: 1.1 }}
            >
              Evidencia, análisis y conocimiento.
            </RevealLines>

            <ol className="mt-10 space-y-6">
              {PASOS.map((p, i) => (
                <li key={p.t} data-paso className="flex gap-4">
                  <span className="bg-verde-concepto/12 text-verde-concepto flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[0.8rem] font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-azul-principal text-[1.05rem] font-semibold">
                      {p.t}
                    </h3>
                    <p className="text-gris-texto mt-1 max-w-[46ch] font-sans text-[0.93rem] leading-relaxed">
                      {p.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href="/biblioteca"
              className="group text-azul-principal hover:text-verde-concepto mt-10 inline-flex items-center gap-2 font-sans text-[0.95rem] font-medium transition-colors"
            >
              Ver la producción en la Biblioteca
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
