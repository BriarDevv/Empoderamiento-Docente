"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { PRODUCCION, PRODUCCION_ANCLA } from "../data";
import { useTilt } from "@/lib/hooks/useTilt";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LIBRO = PRODUCCION[0]; // el destacado
const RESTO = PRODUCCION.slice(1); // artículos, congresos, redes

/** Card de producción — se inclina hacia el cursor. */
function ProdCard({ etiqueta, t, imagen }: (typeof RESTO)[number]) {
  const ref = useTilt<HTMLElement>({ max: 7, lift: 5 });
  return (
    <article
      ref={ref}
      data-prod
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_18px_40px_-22px_rgb(31_45_77/0.28)] will-change-transform"
    >
      <Image src={imagen} alt="" fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="from-azul-principal/90 via-azul-principal/20 absolute inset-0 bg-gradient-to-t to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <span className="text-azul-claro font-mono text-[0.64rem] tracking-[0.14em] uppercase">
          {etiqueta}
        </span>
        <h3 className="font-display mt-1.5 text-[1.02rem] leading-snug font-semibold">{t}</h3>
      </div>
    </article>
  );
}

/**
 * "Investigación en acción" — la producción académica REAL de ED, en claro (el
 * efecto de acercamiento se mudó al hero). El libro como destacado + los
 * artículos, congresos y redes como cards que se inclinan hacia el cursor.
 * CTA naranja → Contacto (acción). Pendiente de cliente: año/editorial y DOIs.
 */
export function InvestigacionEnAccion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-prod]", {
        autoAlpha: 0,
        y: 28,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-prod-grid]", start: "top 82%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="en-accion"
      className="bg-white scroll-mt-24"
      aria-label="Investigación en acción"
    >
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[44ch]">
          <Eyebrow>Investigación en acción</Eyebrow>
          <RevealLines
            as="h2"
            className="font-display text-azul-principal mt-6 font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.4rem)", lineHeight: 1.08 }}
          >
            Lo que investigamos, publicado.
          </RevealLines>
          <p className="text-gris-texto mt-6 font-sans text-[1.02rem] leading-relaxed">
            No es teoría en abstracto: es producción con nombre, revista y año.
          </p>
        </div>

        <div data-prod-grid className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Destacado: el libro */}
          <article
            data-prod
            className="border-verde-concepto/25 from-verde-concepto/8 relative flex flex-col justify-end overflow-hidden rounded-2xl border bg-gradient-to-br to-transparent lg:col-span-2 lg:row-span-2"
          >
            <Image
              src={LIBRO.imagen}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover opacity-30"
            />
            <div className="from-white via-white/85 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="relative p-7 md:p-9">
              <span className="text-verde-concepto-texto font-mono text-[0.72rem] tracking-[0.16em] uppercase">
                {LIBRO.etiqueta}
              </span>
              <h3 className="font-display text-azul-principal mt-4 max-w-[18ch] text-[1.6rem] leading-tight font-bold md:text-[2.1rem]">
                {PRODUCCION_ANCLA}
              </h3>
              <p className="text-gris-texto mt-4 max-w-[46ch] font-sans text-[0.98rem] leading-relaxed">
                El marco teórico de ED hecho libro: cómo se resignifica el
                conocimiento matemático escolar y por qué eso transforma la
                profesión docente.
              </p>
              <p className="text-gris-texto/70 mt-6 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
                Ficha completa · pronto en la Biblioteca
              </p>
            </div>
          </article>

          {/* Resto de la producción */}
          {RESTO.map((p) => (
            <ProdCard key={p.id} {...p} />
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 border-t border-azul-principal/10 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-azul-principal max-w-[30ch] text-[1.3rem] font-semibold md:text-[1.6rem]">
            ¿Querés que llevemos esto a tu institución?
          </p>
          <ButtonPrimary href="/contacto">Hablemos</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
