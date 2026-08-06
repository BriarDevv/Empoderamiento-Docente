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
 * "Conexión con Biblioteca" (sitemap pág. 04, sección 7 · PUENTE). Banda clara
 * que empalma Investigación con la Biblioteca — dónde vive la producción
 * académica. Unos lomos se inclinan y deslizan hacia la derecha (hacia la
 * biblioteca) al entrar; el CTA ↗ Biblioteca remata el gesto.
 *
 * Sin JS / prefers-reduced-motion: lomos y texto visibles.
 */

const LOMOS = ["#1f2d4d", "#4a6fa5", "#1f9a78", "#a9c5e8", "#1f2d4d", "#4a6fa5"];

export function PuenteBiblioteca() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const lomos = gsap.utils.toArray<HTMLElement>("[data-lomo]");
      gsap.fromTo(
        lomos,
        { autoAlpha: 0, y: 24, rotate: -6 },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(1.6)",
          stagger: 0.07,
          scrollTrigger: { trigger: root, start: "top 78%" },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="relative bg-white" aria-label="Conexión con Biblioteca">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-28">
        <div className="items-center gap-12 lg:grid lg:grid-cols-2">
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
              llevar al aula. Ahí está la producción académica que sostiene todo
              lo que investigamos.
            </p>
            <div className="mt-9">
              <ButtonSecondary href="/biblioteca">Entrar a la Biblioteca</ButtonSecondary>
            </div>
          </div>

          {/* Lomos que se inclinan hacia la biblioteca */}
          <div className="mt-14 flex items-end justify-center gap-2.5 lg:mt-0" aria-hidden="true">
            {LOMOS.map((c, i) => (
              <span
                key={i}
                data-lomo
                className="block w-8 rounded-t-md md:w-11"
                style={{ background: c, height: `${8 + ((i * 3) % 5) + 8}rem` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
