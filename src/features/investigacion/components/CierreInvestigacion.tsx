"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Cierre" (sitemap pág. 04, sección 8 · CONVERSIÓN). Lámina navy que remata
 * la página con la ECUACIÓN de ED (modelo conceptual oficial): Investigación +
 * Acción + Reflexión + Alianzas = Transformación. Los términos se arman uno a
 * uno por scroll y "Transformación" cierra en verde. CTA naranja → Contacto.
 *
 * Sin JS / prefers-reduced-motion: ecuación completa y CTA visibles.
 */

const TERMINOS = ["Investigación", "Acción", "Reflexión", "Alianzas"] as const;

export function CierreInvestigacion() {
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
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 26%", scrub: true },
        },
      );

      const chips = gsap.utils.toArray<HTMLElement>("[data-term]");
      const ops = gsap.utils.toArray<HTMLElement>("[data-op]");
      const result = root.querySelector<HTMLElement>("[data-result]");
      const tagline = root.querySelector<HTMLElement>("[data-cierre-tag]");
      const cta = root.querySelector<HTMLElement>("[data-cierre-cta]");

      gsap.set([...chips, ...ops], { autoAlpha: 0, y: 18, scale: 0.9 });
      if (result) gsap.set(result, { autoAlpha: 0, scale: 0.8 });
      if (tagline) gsap.set(tagline, { autoAlpha: 0, y: 16 });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-ecuacion]", start: "top 72%" },
        defaults: { ease: "back.out(1.7)" },
      });
      // términos y operadores se arman alternados
      chips.forEach((c, i) => {
        tl.to(c, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4 }, i * 0.22);
        if (ops[i]) tl.to(ops[i], { autoAlpha: 1, y: 0, scale: 1, duration: 0.3 }, i * 0.22 + 0.18);
      });
      if (result) tl.to(result, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "back.out(2.4)" }, ">0.1");
      if (tagline) tl.to(tagline, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, ">-0.2");
      if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "<0.15");
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative z-50 -mt-[5svh] overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Cierre"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[6%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.14)_0%,transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-screen-xl px-5 py-28 text-center md:px-10 md:py-36">
        {/* Ecuación */}
        <div
          data-ecuacion
          className="font-display flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-bold tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.4rem, 0.8rem + 2vw, 2.6rem)" }}
        >
          {TERMINOS.map((t, i) => (
            <Fragment key={t}>
              <span data-term className="inline-block">
                {t}
              </span>
              {i < TERMINOS.length - 1 ? (
                <span data-op className="text-verde-concepto inline-block font-normal">
                  +
                </span>
              ) : (
                <span data-op className="text-verde-concepto inline-block font-normal">
                  =
                </span>
              )}
            </Fragment>
          ))}
          <span
            data-result
            className="text-verde-concepto inline-block"
            style={{ fontSize: "clamp(1.6rem, 0.8rem + 2.6vw, 3.2rem)" }}
          >
            Transformación
          </span>
        </div>

        <p
          data-cierre-tag
          className="text-azul-claro mx-auto mt-12 max-w-[40ch] font-sans text-[1.05rem] leading-relaxed md:text-[1.2rem]"
        >
          Investigamos lo que hacemos, hacemos lo que investigamos y
          transformamos la educación.
        </p>

        <div data-cierre-cta className="mt-10 flex justify-center">
          <ButtonPrimary href="/contacto">Trabajemos juntos</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
