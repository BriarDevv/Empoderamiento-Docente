"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  // Easing exacto del reveal de blueprintapps.io: cubic-bezier(0.65,0.2,0,1)
  CustomEase.create("bpReveal", "0.65,0.2,0,1");
}

/**
 * Sección de respiro post-Hero. Tipografía grande con mask reveal por línea
 * (clip-path cortina de abajo hacia arriba, stagger 0.12s, power4.out).
 * Tres valores de marca en stagger horizontal. Parallax dispar de fondo
 * (data-speed 0.8–1.3) para dar profundidad sin distraer.
 * Fondo blanco, frase parada desde la enseñanza.
 */
export function Manifiesto() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ── Parallax de formas de fondo ──────────────────────────────
      el.querySelectorAll<HTMLElement>("[data-speed]").forEach((shape) => {
        const speed = parseFloat(shape.getAttribute("data-speed") ?? "1");
        gsap.to(shape, {
          yPercent: (1 - speed) * -50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      // ── Reveal de líneas estilo Blueprint ────────────────────────
      // El texto SUBE desde detrás del borde recto (la máscara es el
      // overflow-hidden del wrapper). yPercent 110→0, easing bpReveal
      // (cubic-bezier 0.65,0.2,0,1), 1.5s, stagger 0.1s, play-once.
      const lines = el.querySelectorAll<HTMLElement>("[data-line]");
      if (lines.length) {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.5,
            ease: "bpReveal",
            stagger: 0.1,
            scrollTrigger: {
              trigger: el.querySelector("[data-manifiesto-headline]"),
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // ── Eyebrow ──────────────────────────────────────────────────
      const eyebrow = el.querySelector("[data-manifiesto-eyebrow]");
      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: eyebrow,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ── Valores de marca — stagger horizontal ────────────────────
      const valores = el.querySelectorAll<HTMLElement>("[data-valor]");
      if (valores.length) {
        gsap.fromTo(
          valores,
          { opacity: 0, x: -32, clipPath: "inset(0 0 0 100%)" },
          {
            opacity: 1,
            x: 0,
            clipPath: "inset(0 0 0 0%)",
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: el.querySelector("[data-manifiesto-valores]"),
              start: "top 86%",
              once: true,
            },
          },
        );
      }

      // ── Separador / línea ─────────────────────────────────────────
      const sep = el.querySelector("[data-manifiesto-sep]");
      if (sep) {
        gsap.fromTo(
          sep,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sep,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="relative flex h-full w-full items-center overflow-hidden py-16 motion-reduce:h-auto motion-reduce:py-28"
      aria-label="Quiénes somos"
    >
      {/* Formas ambientales con parallax dispar */}
      <span
        aria-hidden="true"
        data-speed="1.1"
        className="border-azul-medio/15 pointer-events-none absolute right-[9%] top-[20%] hidden h-20 w-20 rounded-full border-2 md:block"
      />
      <span
        aria-hidden="true"
        data-speed="0.88"
        className="pointer-events-none absolute left-[5%] bottom-[18%] hidden h-36 w-36 bg-[radial-gradient(circle,rgb(74_111_165/0.3)_2.5px,transparent_3px)] [background-size:22px_22px] md:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-5 md:px-10">
        {/* Eyebrow */}
        <span
          data-manifiesto-eyebrow
          className="inline-flex items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="bg-verde-concepto block h-px w-10"
          />
          <span className="font-mono text-gris-texto text-[0.78rem] font-medium tracking-[0.22em] uppercase">
            Quiénes somos
          </span>
        </span>

        {/* Titular con mask reveal por línea */}
        <div
          data-manifiesto-headline
          className="mt-8 max-w-4xl"
        >
          {/* Cada línea: overflow-hidden + span data-line para la cortina */}
          <div className="overflow-hidden">
            <p
              data-line
              className="font-display text-azul-principal font-bold tracking-[-0.022em] leading-[1.07]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              Somos una consultora especializada
            </p>
          </div>
          <div className="overflow-hidden">
            <p
              data-line
              className="font-display font-bold tracking-[-0.022em] leading-[1.07]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
            >
              en la{" "}
              <span className="text-verde-concepto">enseñanza</span>
              {" "}de la Matemática.
            </p>
          </div>
        </div>

        {/* Separador */}
        <div
          data-manifiesto-sep
          aria-hidden="true"
          className="bg-azul-principal/10 mt-12 h-px w-full"
        />

        {/* Valores de marca — stagger horizontal */}
        <ul
          data-manifiesto-valores
          className="mt-12 flex flex-col gap-6 md:flex-row md:items-start md:gap-16"
        >
          {[
            {
              n: "01",
              palabra: "Investigación",
              nota: "Base científica en matemática educativa.",
            },
            {
              n: "02",
              palabra: "Acompañamiento",
              nota: "Trabajo situado junto a cada docente.",
            },
            {
              n: "03",
              palabra: "Transformación",
              nota: "Cambios que se sostienen en el tiempo.",
            },
          ].map(({ n, palabra, nota }) => (
            <li
              key={n}
              data-valor
              className="flex flex-col gap-2"
            >
              <span className="font-mono text-verde-concepto/40 text-[0.75rem] font-bold tabular-nums tracking-widest">
                {n}
              </span>
              <span className="font-display text-azul-principal text-[1.4rem] font-bold leading-tight tracking-[-0.01em] md:text-[1.65rem]">
                {palabra}
              </span>
              <span className="text-gris-texto font-sans text-[0.92rem] leading-relaxed">
                {nota}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
