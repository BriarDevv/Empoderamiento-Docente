"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { Instagram, Linkedin, Facebook } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { LuzCursor } from "./LuzCursor";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const REDES = [
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "facebook", label: "Facebook", Icon: Facebook },
] as const;

/**
 * Cierre de Novedades. Lámina navy que se funde con el footer (marca la página
 * con data-footer-dock-dark: la muesca del pie se pinta navy, sin triángulos
 * claros — mismo mecanismo que estrenamos en Biblioteca). La luz del faro sigue
 * al cursor (LuzCursor) para cerrar coherente con el hero. CTA naranja →
 * Contacto (acción) + redes.
 */
export function CierreNovedades() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
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
      gsap.fromTo(
        "[data-cierre-foot]",
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
      className="bg-azul-principal relative z-40 -mt-[5svh] overflow-hidden rounded-t-[2.5rem] text-white"
      aria-label="Cierre"
    >
      {/* Puntos §6 sobre el navy (los mismos de Biblioteca), difuminados hacia
          el pie para que la fusión con el footer siga sin costura. */}
      <span
        aria-hidden="true"
        className="pattern-dots-inverse pointer-events-none absolute inset-0 -z-10 [--dots-alpha:0.07]"
        style={{
          maskImage: "linear-gradient(to bottom, #000 55%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 92%)",
        }}
      />
      <LuzCursor horizonte={22} />

      <div className="relative z-10 mx-auto flex min-h-[70svh] w-full max-w-screen-xl flex-col items-center justify-center px-5 py-28 text-center md:px-10">
        <div data-cierre-foot>
          <Eyebrow variant="light">Seguí de cerca</Eyebrow>
        </div>

        <RevealLines
          as="h2"
          className="font-display mt-6 max-w-[16ch] font-extrabold tracking-[-0.025em]"
          style={{ fontSize: "clamp(2.4rem, 1rem + 4.6vw, 5rem)", lineHeight: 1.02 }}
        >
          No te pierdas nada.
        </RevealLines>

        <p
          data-cierre-foot
          className="text-azul-claro mt-7 max-w-[52ch] font-sans text-[1.05rem] leading-relaxed md:text-[1.2rem]"
        >
          Escribinos y contamos lo que estamos haciendo, o seguinos en redes para
          enterarte de cada novedad apenas sale.
        </p>

        <div
          data-cierre-foot
          className="mt-10 flex flex-col items-center gap-7"
        >
          <ButtonPrimary href="/contacto">Hablemos</ButtonPrimary>
          <ul className="flex items-center gap-5">
            {REDES.map(({ key, label, Icon }) => {
              const url = siteConfig.redes[key];
              return (
                <li key={key}>
                  <a
                    href={url ?? "#"}
                    {...(url
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`Empoderamiento Docente en ${label}`}
                    className="text-azul-claro/70 hover:text-white inline-flex transition-colors"
                  >
                    <Icon size={22} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
