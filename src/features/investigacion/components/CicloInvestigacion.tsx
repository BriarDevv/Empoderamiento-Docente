"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FASES, NUCLEO } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Ciclo de investigación aplicada" — escena CLAVADA (sticky) sobre fondo claro:
 * el scroll AVANZA por las 4 fases, con un número gigante de fondo que cambia y
 * el texto de la fase activa que entra; el núcleo (la problematización) queda de
 * motor persistente. Sin anillo/cometa ni líneas. Sin motion: 4 fases apiladas.
 */
export function CicloInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const zone = root.querySelector<HTMLElement>("[data-zone]");
      const paneles = gsap.utils.toArray<HTMLElement>("[data-fase]");
      const nums = gsap.utils.toArray<HTMLElement>("[data-fase-num]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-prog]");
      if (!zone || paneles.length !== 4) return;

      gsap.set(paneles, { autoAlpha: 0, y: 26 });
      gsap.set(paneles[0], { autoAlpha: 1, y: 0 });
      gsap.set(nums, { autoAlpha: 0 });
      gsap.set(nums[0], { autoAlpha: 1 });
      dots.forEach((d, i) =>
        gsap.set(d, { scaleX: i === 0 ? 1 : 0.35, opacity: i === 0 ? 1 : 0.4, transformOrigin: "left center" }),
      );

      let activa = 0;
      const activar = (i: number) => {
        if (i === activa) return;
        paneles.forEach((p, k) =>
          gsap.to(p, { autoAlpha: k === i ? 1 : 0, y: k === i ? 0 : k < i ? -26 : 26, duration: 0.5, overwrite: "auto" }),
        );
        nums.forEach((n, k) => gsap.to(n, { autoAlpha: k === i ? 1 : 0, duration: 0.5, overwrite: "auto" }));
        dots.forEach((d, k) =>
          gsap.to(d, { scaleX: k === i ? 1 : 0.35, opacity: k === i ? 1 : 0.4, duration: 0.35, overwrite: "auto" }),
        );
        activa = i;
      };

      ScrollTrigger.create({
        trigger: zone,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => activar(Math.min(3, Math.floor(self.progress * 3.999))),
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-clip bg-white"
      aria-label="Ciclo de investigación aplicada"
    >
      <div data-zone className="relative h-[300svh] motion-reduce:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-clip motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
          <div className="mx-auto w-full max-w-screen-xl px-5 md:px-10">
            <Eyebrow>Ciclo de investigación aplicada</Eyebrow>

            {/* Escena: número gigante de fondo + texto de la fase activa */}
            <div className="relative mt-8 min-h-[22rem] motion-reduce:min-h-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-0 leading-none select-none motion-reduce:hidden"
              >
                {FASES.map((f) => (
                  <span
                    key={f.n}
                    data-fase-num
                    className="font-display text-azul-principal/[0.06] absolute top-0 right-0 leading-none font-extrabold"
                    style={{ fontSize: "clamp(9rem, 6rem + 16vw, 20rem)" }}
                  >
                    {f.n}
                  </span>
                ))}
              </div>

              {FASES.map((f, i) => (
                <div
                  key={f.n}
                  data-fase
                  className={
                    "absolute inset-0 flex max-w-[42ch] flex-col justify-center motion-reduce:static " +
                    (i > 0 ? "motion-reduce:mt-12" : "")
                  }
                >
                  <span className="text-verde-concepto-texto font-mono text-[0.8rem] font-medium tabular-nums">
                    Fase {f.n}
                  </span>
                  <h3 className="font-display text-azul-principal mt-3 leading-tight font-bold" style={{ fontSize: "clamp(1.9rem, 1rem + 3vw, 3.4rem)" }}>
                    {f.t}
                  </h3>
                  <p className="text-verde-concepto-texto mt-1 font-sans text-[1rem] font-medium italic">
                    {f.sub}
                  </p>
                  <p className="text-gris-texto mt-4 max-w-[44ch] font-sans text-[1.05rem] leading-relaxed">
                    {f.d}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {FASES.map((f) => (
                  <span key={f.n} data-prog className="bg-verde-concepto block h-1 w-12 rounded-full" />
                ))}
                <span className="text-gris-texto ml-3 flex items-center gap-2 font-sans text-[0.9rem]">
                  <span className="text-verde-concepto text-[1.1rem]">↺</span>
                  y el ciclo vuelve a empezar
                </span>
              </div>
              <p className="text-gris-texto font-sans text-[0.92rem]">
                En el centro, siempre lo mismo:{" "}
                <span className="text-azul-principal font-semibold">{NUCLEO}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
