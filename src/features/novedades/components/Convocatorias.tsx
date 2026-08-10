"use client";

import { useRef, type MouseEvent as ReactMouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { CONVOCATORIAS } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Convocatorias / Forma parte" (SIN bolsa de trabajo — alinea con el feedback
 * de Dani). Lámina navy que se acopla sobre la sección clara (sheet-dock). Cada
 * card se enciende con la luz del faro siguiendo al cursor (spotlight): la misma
 * metáfora de marca, sin puntos ni líneas. CTA naranja → Contacto (acá el
 * naranja sí corresponde: es acción/contacto).
 */
export function Convocatorias() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      // Acople de la lámina sobre la sección clara de arriba.
      gsap.set(root, { transformOrigin: "50% 0%" });
      gsap.fromTo(
        root,
        { scale: 0.955, y: 40 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 40%", scrub: true },
        },
      );

      gsap.from("[data-conv]", {
        autoAlpha: 0,
        y: 26,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-conv-grid]", start: "top 82%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const spot = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative z-20 -mt-[4svh] overflow-hidden rounded-t-[2.5rem] rounded-b-[2.5rem] text-white"
      aria-label="Convocatorias · Formá parte"
    >
      {/* Puntos §6 sobre el navy (los mismos de Biblioteca), tenues. */}
      <span
        aria-hidden="true"
        className="pattern-dots-inverse pointer-events-none absolute inset-0 [--dots-alpha:0.06]"
      />
      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-[46ch]">
          <Eyebrow variant="light">Convocatorias · Formá parte</Eyebrow>
          <RevealLines
            as="h2"
            className="font-display mt-6 font-bold tracking-[-0.025em]"
            style={{ fontSize: "clamp(2rem, 1rem + 3.4vw, 3.8rem)", lineHeight: 1.04 }}
          >
            Sumate a lo que estamos construyendo.
          </RevealLines>
          <p className="text-azul-claro mt-6 max-w-[54ch] font-sans text-[1.05rem] leading-relaxed">
            No es una capacitación más: es una comunidad que investiga su propia
            práctica. Estas son las formas de entrar.
          </p>
        </div>

        <div
          data-conv-grid
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {CONVOCATORIAS.map((c, i) => (
            <div
              key={c.id}
              data-conv
              onMouseMove={spot}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20"
            >
              {/* Spotlight del faro que sigue al cursor. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle 220px at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-verde-concepto) 26%, transparent), transparent 70%)",
                }}
              />
              <div className="relative">
                <span className="text-azul-claro/70 font-mono text-[0.8rem] tracking-[0.14em]">
                  0{i + 1}
                </span>
                <h3 className="font-display mt-4 text-[1.4rem] leading-tight font-bold">
                  {c.titulo}
                </h3>
                <p className="text-azul-claro/85 mt-3 font-sans text-[0.98rem] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div data-conv className="mt-12">
          <ButtonPrimary href="/contacto">Quiero formar parte</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
