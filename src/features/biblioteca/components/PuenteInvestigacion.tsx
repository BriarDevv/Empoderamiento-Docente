"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Conexión con Investigación" (sitemap pág. 05, sección 7 · PUENTE). Une la
 * Biblioteca con Investigación: nada de lo que hay acá salió de la nada. A la
 * derecha, un flujo — el nodo "investigación" del que SALEN las ramas hacia
 * los recursos; las ramas se dibujan con el scroll y cada recurso se enciende
 * al final de la suya. Fondo claro. CTA ↗ Investigación.
 *
 * Sin JS / prefers-reduced-motion: flujo y texto visibles.
 */

const NODO = { x: 96, y: 210 };
const RECURSOS = [
  { x: 372, y: 70, label: "Publicaciones" },
  { x: 400, y: 150, label: "Materiales" },
  { x: 400, y: 250, label: "Proyectos" },
  { x: 372, y: 330, label: "Guías" },
] as const;

// rama curva del nodo a cada recurso
const rama = (rx: number, ry: number) =>
  `M ${NODO.x} ${NODO.y} C ${NODO.x + 120} ${NODO.y}, ${rx - 120} ${ry}, ${rx} ${ry}`;

export function PuenteInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const nodo = root.querySelector<SVGGElement>("[data-nodo]");
      const ramas = gsap.utils.toArray<SVGPathElement>("[data-rama]");
      const recursos = gsap.utils.toArray<SVGGElement>("[data-recurso]");

      if (nodo) gsap.set(nodo, { autoAlpha: 0, scale: 0.6, transformOrigin: "center", transformBox: "fill-box" });
      ramas.forEach((r) => {
        const len = r.getTotalLength();
        gsap.set(r, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(recursos, { autoAlpha: 0, x: -12 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%" },
        defaults: { ease: "power3.out" },
      });
      if (nodo) tl.to(nodo, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" }, 0);
      ramas.forEach((r, i) => {
        tl.to(r, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.3 + i * 0.16);
        if (recursos[i]) tl.to(recursos[i], { autoAlpha: 1, x: 0, duration: 0.4 }, 0.3 + i * 0.16 + 0.5);
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative bg-white" aria-label="Conexión con Investigación">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="items-center gap-12 lg:grid lg:grid-cols-2">
          <div>
            <Eyebrow>Conexión con Investigación</Eyebrow>
            <RevealLines
              as="h2"
              className="font-display text-azul-principal mt-6 max-w-[16ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.6rem)", lineHeight: 1.06 }}
            >
              Cada recurso nace de una investigación.
            </RevealLines>
            <p className="text-gris-texto mt-6 max-w-[44ch] font-sans text-[1.05rem] leading-relaxed">
              Nada de lo que hay acá salió de la nada: es el resultado de años
              de estudiar cómo se aprende y se enseña la matemática. La
              biblioteca es la punta visible de ese trabajo.
            </p>
            <div className="mt-9">
              <ButtonSecondary href="/investigacion">Ir a Investigación</ButtonSecondary>
            </div>
          </div>

          {/* Flujo: de la investigación salen los recursos */}
          <div className="mt-14 lg:mt-0">
            <svg viewBox="0 0 500 420" className="w-full" aria-hidden="true">
              {RECURSOS.map((r, i) => (
                <path
                  data-rama
                  key={`rama${i}`}
                  d={rama(r.x, r.y)}
                  fill="none"
                  stroke="#a9c5e8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}

              {/* recursos al final de cada rama */}
              {RECURSOS.map((r, i) => (
                <g data-recurso key={`rec${i}`}>
                  <rect x={r.x} y={r.y - 17} width="96" height="34" rx="8" fill="#f2f4f7" stroke="#a9c5e8" strokeWidth="1" />
                  <text x={r.x + 48} y={r.y + 4} textAnchor="middle" fontSize="12" fill="#1f2d4d" fontWeight="600" className="font-sans">
                    {r.label}
                  </text>
                </g>
              ))}

              {/* nodo investigación */}
              <g data-nodo>
                <circle cx={NODO.x} cy={NODO.y} r="46" fill="#1f9a78" />
                <circle cx={NODO.x} cy={NODO.y} r="46" fill="none" stroke="#1f9a78" strokeOpacity="0.3" strokeWidth="10" />
                <text x={NODO.x} y={NODO.y - 2} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" className="font-display">
                  Investi-
                </text>
                <text x={NODO.x} y={NODO.y + 13} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" className="font-display">
                  gación
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
