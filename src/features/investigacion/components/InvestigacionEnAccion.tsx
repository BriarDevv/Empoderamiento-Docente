"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Investigación en acción" (sitemap pág. 04, sección 6 · CASOS). La prueba
 * concreta: la producción académica REAL de ED (modelo conceptual oficial) —
 * el libro, los artículos en RELIME y Bolema 2025, congresos y redes. Cards
 * que entran en cascada por scroll, con el libro destacado. Lámina navy.
 * CTA naranja → Contacto (el naranja se reserva para la acción).
 *
 * Pendiente de cliente: año/editorial del libro y DOIs/links de los papers
 * (cuando lleguen, cada card enlaza a la ficha en la Biblioteca).
 *
 * Sin JS / prefers-reduced-motion: cards visibles y legibles.
 */

const DESTACADO = {
  tipo: "Libro",
  t: "Empoderamiento docente y Socioepistemología",
  d: "El marco teórico de ED hecho libro: cómo se resignifica el conocimiento matemático escolar y por qué eso transforma la profesión docente.",
};

const PRODUCCION = [
  { tipo: "Artículo · RELIME 2025", t: "Investigación en Matemática Educativa", d: "Revista Latinoamericana de referencia en el campo." },
  { tipo: "Artículo · Bolema 2025", t: "Boletim de Educação Matemática", d: "Publicación científica indexada, alcance regional." },
  { tipo: "Congresos", t: "Ponencias internacionales", d: "Presentamos y discutimos hallazgos con la comunidad." },
  { tipo: "Redes", t: "Comunidades de investigación", d: "Docentes, universidades e investigadores de América Latina." },
] as const;

export function InvestigacionEnAccion() {
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

      const cards = gsap.utils.toArray<HTMLElement>("[data-prod]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: "[data-prod-grid]", start: "top 80%" },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="en-accion"
      className="bg-azul-principal relative z-40 -mt-[5svh] scroll-mt-24 overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Investigación en acción"
    >
      <div className="relative mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[44ch]">
          <Eyebrow variant="light">Investigación en acción</Eyebrow>
          <h2
            className="font-display mt-6 font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.4rem)", lineHeight: 1.08 }}
          >
            Lo que investigamos, publicado.
          </h2>
          <p className="text-azul-claro mt-6 font-sans text-[1.02rem] leading-relaxed">
            No es teoría en abstracto: es producción con nombre, revista y año.
            Aplicada en proyectos reales.
          </p>
        </div>

        <div data-prod-grid className="mt-14 grid gap-5 md:grid-cols-3">
          {/* Destacado: el libro */}
          <article
            data-prod
            className="border-verde-concepto/30 from-verde-concepto/15 flex flex-col justify-between rounded-2xl border bg-gradient-to-br to-transparent p-7 md:col-span-2 md:row-span-2"
          >
            <div>
              <span className="text-verde-concepto font-mono text-[0.72rem] tracking-[0.16em] uppercase">
                {DESTACADO.tipo}
              </span>
              <h3 className="font-display mt-4 max-w-[18ch] text-[1.6rem] leading-tight font-bold md:text-[2.1rem]">
                {DESTACADO.t}
              </h3>
              <p className="text-azul-claro mt-4 max-w-[46ch] font-sans text-[0.98rem] leading-relaxed">
                {DESTACADO.d}
              </p>
            </div>
            <p className="text-white/50 mt-8 font-mono text-[0.72rem] tracking-[0.12em] uppercase">
              Ficha completa · pronto en la Biblioteca
            </p>
          </article>

          {/* Resto de la producción */}
          {PRODUCCION.map((p) => (
            <article
              data-prod
              key={p.tipo}
              className="border-white/12 rounded-2xl border bg-white/[0.04] p-6 backdrop-blur-sm"
            >
              <span className="text-verde-concepto/90 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                {p.tipo}
              </span>
              <h3 className="font-display mt-3 text-[1.1rem] leading-snug font-semibold">
                {p.t}
              </h3>
              <p className="text-azul-claro mt-2 font-sans text-[0.88rem] leading-relaxed">
                {p.d}
              </p>
            </article>
          ))}
        </div>

        {/* CTA a Contacto */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-white/12 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="font-display max-w-[30ch] text-[1.3rem] font-semibold md:text-[1.6rem]">
            ¿Querés que llevemos esto a tu institución?
          </p>
          <ButtonPrimary href="/contacto">Hablemos</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
