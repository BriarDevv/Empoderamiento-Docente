"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Por qué investigamos" (sitemap pág. 04, sección 2 · SENTIDO). Lámina NAVY
 * que se acopla sobre el hero y CLAVA la base epistemológica de ED: la frase
 * fundacional de la Socioepistemología. Se ENCIENDE palabra por palabra con
 * el scroll (de un tenue a blanco; las palabras clave a verde), así el sentido
 * se revela a medida que se profundiza — y siempre queda legible.
 *
 * Contenido: frase canónica del modelo conceptual oficial. Cierre con el nombre
 * del campo (Socioepistemología) donde ED produce conocimiento.
 *
 * Sin JS / prefers-reduced-motion: la frase queda encendida y legible en flujo.
 */

// Frase fundacional, tokenizada. key = palabra que se enciende en verde.
const FRASE: Array<{ t: string; key?: boolean }> = [
  { t: "El" }, { t: "conocimiento" }, { t: "matemático" }, { t: "es" }, { t: "una" },
  { t: "construcción", key: true }, { t: "social", key: true }, { t: "situada", key: true },
  { t: "que" }, { t: "adquiere" }, { t: "sentido" }, { t: "en" }, { t: "las" },
  { t: "prácticas,", key: true }, { t: "los" }, { t: "usos", key: true }, { t: "y" }, { t: "las" },
  { t: "relaciones", key: true }, { t: "que" }, { t: "las" }, { t: "personas" },
  { t: "establecen" }, { t: "con" }, { t: "él." },
];

export function SentidoInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      // ── Acople de la lámina sobre el hero (mismo patrón que las otras) ────
      gsap.set(root, { transformOrigin: "50% 0%" });
      gsap.fromTo(
        root,
        { scale: 0.955, y: 44 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 22%", scrub: true },
        },
      );

      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      const zone = root.querySelector<HTMLElement>("[data-zone]");
      const tail = root.querySelector<HTMLElement>("[data-sentido-tail]");
      if (!words.length || !zone) return;

      // color base (tenue) para todas; las clave se distinguen al encenderse
      gsap.set(words, { color: "rgb(169 197 232 / 0.28)" });
      if (tail) gsap.set(tail, { autoAlpha: 0, y: 16 });

      // ── Encendido palabra por palabra atado al scroll ────────────────────
      const tl = gsap.timeline({
        scrollTrigger: { trigger: zone, start: "top 78%", end: "bottom 82%", scrub: 0.6 },
      });
      words.forEach((w) => {
        const on = w.dataset.key === "1" ? "#1f9a78" : "#ffffff";
        tl.to(w, { color: on, duration: 0.5 }, "<0.35");
      });
      if (tail) tl.to(tail, { autoAlpha: 1, y: 0, duration: 1.2 }, ">-0.3");
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative z-20 -mt-[5svh] overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Por qué investigamos"
    >
      {/* halo verde tenue */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[12%] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.13)_0%,transparent_65%)]"
      />

      <div data-zone className="relative h-[210svh] motion-reduce:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center motion-reduce:static motion-reduce:h-auto motion-reduce:py-28">
          <div className="mx-auto w-full max-w-screen-xl px-5 md:px-10">
            <Eyebrow variant="light">Por qué investigamos</Eyebrow>

            <p
              className="font-display mt-8 max-w-[24ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.9rem, 1rem + 3.4vw, 4rem)", lineHeight: 1.16 }}
            >
              {FRASE.map((w, i) => (
                <Fragment key={i}>
                  <span data-word data-key={w.key ? "1" : "0"} className="inline-block">
                    {w.t}
                  </span>
                  {i < FRASE.length - 1 ? " " : null}
                </Fragment>
              ))}
            </p>

            <p
              data-sentido-tail
              className="text-azul-claro mt-10 max-w-[52ch] font-sans text-[1rem] leading-relaxed md:text-[1.1rem]"
            >
              Es <span className="font-semibold text-white">Socioepistemología</span>: el
              campo desde donde ED produce conocimiento propio. No es una idea
              de marketing — es el fundamento teórico de todo lo que hacemos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
