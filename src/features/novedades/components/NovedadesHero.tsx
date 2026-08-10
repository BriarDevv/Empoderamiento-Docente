"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { LuzCursor } from "./LuzCursor";
import { SplitFlap } from "./SplitFlap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Hero de Novedades. Navy a sangre, esquinas inferiores redondeadas (telón que
 * se levanta sobre el gris del body, como los demás heroes). SIN patrón de
 * puntos/nodos: el fondo es solo la luz del faro siguiendo al cursor
 * (<LuzCursor />) — ese es el hilo coherente con Biblioteca.
 *
 * El detalle "vivo": un tablero split-flap con la última fecha que gira al
 * cargar (energía de "algo que acaba de llegar"). Deja asomar la sección de
 * abajo. Sin motion: todo visible, sin giro.
 */
export function NovedadesHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-rise]",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.25,
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative isolate flex min-h-[88svh] flex-col justify-between overflow-hidden rounded-b-[2rem] pt-28 pb-10 text-white md:rounded-b-[2.75rem] md:pt-32"
      aria-label="Novedades"
    >
      {/* Puntos §6 sobre el navy (los mismos de Biblioteca), tenues. */}
      <span
        aria-hidden="true"
        className="pattern-dots-inverse pointer-events-none absolute inset-0 -z-10 [--dots-alpha:0.07]"
      />
      <LuzCursor horizonte={28} />

      {/* Bloque central */}
      <div className="mx-auto my-auto flex w-full max-w-screen-xl flex-col px-5 md:px-10">
        <div data-hero-rise>
          <Eyebrow variant="light">Novedades</Eyebrow>
        </div>

        <RevealLines
          as="h1"
          className="font-display mt-6 max-w-[15ch] font-extrabold tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.75rem, 1.1rem + 7vw, 6.25rem)", lineHeight: 1.0 }}
        >
          Siempre está pasando algo.
        </RevealLines>

        <p
          data-hero-rise
          className="mt-7 max-w-[54ch] font-sans text-[1.05rem] leading-relaxed text-white/85 md:text-[1.2rem]"
        >
          Publicaciones, encuentros, convocatorias y prensa. Seguí de cerca lo
          que investigamos, diseñamos y llevamos al aula.
        </p>

        {/* Tablero "en vivo": punto verde latiendo + última fecha que gira. */}
        <div
          data-hero-rise
          className="text-azul-claro/90 mt-10 inline-flex items-center gap-3 font-mono text-[0.8rem] tracking-[0.18em] uppercase"
        >
          <span className="bg-verde-concepto h-2 w-2 animate-pulse rounded-full" />
          Última actualización
          <SplitFlap
            text="15·07·2026"
            charset="digits"
            trigger="mount"
            className="text-white"
          />
        </div>
      </div>

      {/* Pista de scroll al pie del hero. */}
      <div
        data-hero-rise
        className="mx-auto w-full max-w-screen-xl px-5 md:px-10"
      >
        <span className="font-mono text-[0.72rem] tracking-[0.2em] text-white/45 uppercase">
          Scrolleá para ver lo último ↓
        </span>
      </div>
    </section>
  );
}
