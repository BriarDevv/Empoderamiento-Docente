"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FRASE } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Por qué investigamos" — la base epistemológica, en claro. La frase entra
 * palabra por palabra al scrollear y cada palabra se marca (pasa a tinta / verde
 * pleno y crece apenas) al pasar el mouse por encima: se lee como un statement
 * editorial vivo, sin paredón a full ni gráficos de líneas. Sin motion: frase
 * legible en su color base.
 */
export function SentidoInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-word]", {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.025,
        scrollTrigger: { trigger: "[data-frase]", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-gris-fondo flex min-h-[78svh] items-center"
      aria-label="Por qué investigamos"
    >
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10">
        <Eyebrow>Por qué investigamos</Eyebrow>
        <p className="text-gris-texto mt-6 font-mono text-[0.8rem] tracking-[0.16em] uppercase">
          Todo lo que hacemos parte de una idea
        </p>

        <p
          data-frase
          className="font-display mt-6 max-w-[26ch] font-bold tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.6rem, 1rem + 2.6vw, 3.2rem)", lineHeight: 1.2 }}
        >
          {FRASE.map((w, i) => (
            <Fragment key={i}>
              <span
                data-word
                className={`inline-block cursor-default transition-[color,transform] duration-300 hover:scale-[1.04] ${
                  w.key
                    ? "text-verde-concepto-texto hover:text-verde-concepto"
                    : "text-azul-medio hover:text-azul-principal"
                }`}
              >
                {w.t}
              </span>
              {i < FRASE.length - 1 ? " " : null}
            </Fragment>
          ))}
        </p>

        <p className="text-gris-texto mt-10 max-w-[54ch] font-sans text-[1rem] leading-relaxed md:text-[1.1rem]">
          Es <span className="text-azul-principal font-semibold">Socioepistemología</span>:
          el campo desde donde ED produce conocimiento propio. No es una idea de
          marketing — es el fundamento teórico de todo lo que hacemos.
        </p>
      </div>
    </section>
  );
}
