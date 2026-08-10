"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ArrowUpRight } from "@/components/ui/icons";
import { PuntosFaro } from "./PuntosFaro";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Cierre de Biblioteca (sitemap pág. 05, sección 8 · CIERRE). Lámina navy que
 * remata la página con el haz del faro de marca (PuntosFaro, la misma firma
 * del hero) barriendo y siguiendo al cursor: el faro que ilumina el aula. El
 * titular sube por líneas y el CTA cierra en naranja → Contacto.
 *
 * Sin JS / prefers-reduced-motion: titular y CTA visibles, faro estático.
 */
export function CierreBiblioteca() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      // acople de la lámina sobre el listado (claro)
      gsap.set(root, { transformOrigin: "50% 0%" });
      gsap.fromTo(
        root,
        { scale: 0.955, y: 44 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 30%", scrub: true },
        },
      );

      const foot = gsap.utils.toArray<HTMLElement>("[data-cierre-foot]");
      gsap.fromTo(
        foot,
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 60%" },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-footer-dock-dark
      className="bg-azul-principal relative z-40 -mt-[5svh] overflow-hidden rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Cierre"
    >
      {/* Haz del faro (misma firma que el hero de Biblioteca) */}
      <PuntosFaro />
      {/* glow verde de apoyo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[20%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.12)_0%,transparent_65%)]"
      />
      {/* Difuminado inferior: los puntos se disuelven en el navy hacia el pie.
          Como el footer ahora comparte ese navy (data-footer-dock-dark), el
          cierre y el footer se leen como una sola superficie, sin corte seco. */}
      <span
        aria-hidden="true"
        className="from-azul-principal pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-52 bg-gradient-to-t to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[72svh] w-full max-w-screen-xl flex-col items-center justify-center px-5 py-28 text-center md:px-10">
        <div data-cierre-foot>
          <Eyebrow variant="light">Biblioteca abierta</Eyebrow>
        </div>

        <RevealLines
          as="h2"
          className="font-display mt-6 max-w-[16ch] font-extrabold tracking-[-0.025em]"
          style={{ fontSize: "clamp(2.4rem, 1rem + 4.6vw, 5rem)", lineHeight: 1.02 }}
        >
          Un faro para cada aula.
        </RevealLines>

        <p
          data-cierre-foot
          className="text-azul-claro mt-7 max-w-[52ch] font-sans text-[1.05rem] leading-relaxed md:text-[1.2rem]"
        >
          Todo lo que investigamos y diseñamos, abierto y listo para usar. La
          biblioteca sigue creciendo: volvé cuando quieras.
        </p>

        <div data-cierre-foot className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <ButtonPrimary href="/contacto">¿Buscás un material puntual?</ButtonPrimary>
          <a
            href="/novedades"
            className="group text-azul-claro hover:text-white inline-flex items-center gap-2 font-sans text-[0.95rem] font-medium transition-colors"
          >
            Ver novedades
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
