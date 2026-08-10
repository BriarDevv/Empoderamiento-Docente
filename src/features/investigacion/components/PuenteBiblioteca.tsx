"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { BookOpen, LampManual, Target, ArrowUpRight } from "@/components/ui/icons";
import { useTilt } from "@/lib/hooks/useTilt";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const RECURSOS = [
  { Icon: BookOpen, t: "Publicaciones", d: "Artículos, capítulos y el libro." },
  { Icon: LampManual, t: "Materiales", d: "Tareas y recursos para el aula." },
  { Icon: Target, t: "Proyectos", d: "Lo aplicado, documentado." },
] as const;

/** Card de recurso — se inclina hacia el cursor y linkea a la Biblioteca. */
function RecursoCard({ Icon, t, d }: (typeof RECURSOS)[number]) {
  const ref = useTilt<HTMLAnchorElement>({ max: 9, lift: 6 });
  return (
    <a
      ref={ref}
      href="/biblioteca"
      data-recurso
      className="border-azul-principal/8 hover:border-verde-concepto/40 group relative flex flex-col rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgb(31_45_77/0.04),0_18px_40px_-22px_rgb(31_45_77/0.14)] transition-colors will-change-transform"
    >
      <span className="bg-verde-concepto/10 text-verde-concepto-texto flex h-11 w-11 items-center justify-center rounded-xl">
        <Icon size={22} />
      </span>
      <h3 className="font-display text-azul-principal mt-4 text-[1.1rem] font-bold">{t}</h3>
      <p className="text-gris-texto mt-1.5 font-sans text-[0.9rem] leading-relaxed">{d}</p>
      <span className="text-gris-texto group-hover:text-verde-concepto-texto mt-4 inline-flex items-center gap-1 font-mono text-[0.68rem] tracking-[0.12em] uppercase transition-colors">
        Ver <ArrowUpRight size={13} />
      </span>
    </a>
  );
}

/**
 * "Conexión con Biblioteca" — sin los lomos anteriores. Bloque editorial +
 * cards de recurso que se inclinan hacia el cursor (useTilt) y llevan a la
 * Biblioteca, donde vive la producción. Fondo claro. Sin motion: legible.
 */
export function PuenteBiblioteca() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-recurso]", {
        autoAlpha: 0,
        y: 26,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-recursos]", start: "top 84%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="bg-white" aria-label="Conexión con Biblioteca">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Eyebrow>Conexión con Biblioteca</Eyebrow>
            <RevealLines
              as="h2"
              className="font-display text-azul-principal mt-6 max-w-[16ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.6rem)", lineHeight: 1.06 }}
            >
              Todo esto vive en la Biblioteca.
            </RevealLines>
            <p className="text-gris-texto mt-6 max-w-[44ch] font-sans text-[1.05rem] leading-relaxed">
              Publicaciones, materiales y recursos — abiertos y listos para
              llevar al aula. Ahí está la producción que sostiene todo lo que
              investigamos.
            </p>
            <div className="mt-9">
              <ButtonSecondary href="/biblioteca">Entrar a la Biblioteca</ButtonSecondary>
            </div>
          </div>

          <div data-recursos className="grid gap-4 [perspective:1200px] sm:grid-cols-3">
            {RECURSOS.map((r) => (
              <RecursoCard key={r.t} {...r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
