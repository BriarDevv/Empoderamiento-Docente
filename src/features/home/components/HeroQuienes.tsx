"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./Hero";
import { Manifiesto } from "./Manifiesto";
import { MathField } from "@/components/ui/MathField";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * El Hero queda INTACTO (alto, con su scroll vertical y el parallax de las
 * tarjetas) — solo que su campo de nodos pasó a ser una capa PERSISTENTE acá
 * detrás. Al llegar al final del hero, las imágenes se desplazan a la izquierda
 * y SOLO EL TEXTO de "Quiénes somos" entra desde la derecha; los nodos del
 * fondo NO se mueven y siguen animando (sticky + scrub, sin pin:true). Luego
 * QS sale con el scroll hacia las secciones siguientes.
 */
export function HeroQuienes() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroSlideRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const qsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const heroSlide = heroSlideRef.current;
    const zone = zoneRef.current;
    const qs = qsRef.current;
    if (!heroSlide || !zone || !qs) return;

    const ctx = gsap.context(() => {
      gsap.set(qs, { xPercent: 100 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: zone, start: "top top", end: "+=55%", scrub: true },
      });
      // El hero (imágenes) sale por la izquierda...
      tl.to(heroSlide, { xPercent: -100, ease: "none" }, 0);
      // ...y SOLO el texto de Quiénes somos entra por la derecha (los nodos quedan).
      tl.to(qs, { xPercent: 0, ease: "none" }, 0);
    }, wrapRef);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className="relative isolate bg-gradient-to-b from-white via-white to-gris-fondo/40">
      {/* Nodos PERSISTENTES: pegados al viewport durante todo el stage, animando.
          Quedan detrás del hero y de Quiénes somos (el hero ahora es transparente). */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <MathField className="h-full w-full" />
        </div>
      </div>

      {/* Hero (foreground transparente): se desliza a la izquierda en el cruce */}
      <div ref={heroSlideRef} className="relative z-10 will-change-transform">
        <Hero />
      </div>

      {/* Transición: SOLO el texto de Quiénes somos entra desde la derecha,
          sobre los nodos persistentes. */}
      <div
        ref={zoneRef}
        className="relative z-20 -mt-[100svh] h-[200svh] motion-reduce:mt-0 motion-reduce:h-auto"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden motion-reduce:static motion-reduce:h-auto">
          <div ref={qsRef} className="h-full w-full will-change-transform motion-reduce:h-auto">
            <Manifiesto />
          </div>
        </div>
      </div>
    </div>
  );
}
