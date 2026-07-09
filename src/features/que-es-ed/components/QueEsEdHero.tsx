"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { MathField } from "@/components/ui/MathField";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero de "Qué es ED" (sección 1 del sitemap: APERTURA — «ED no es una
 * capacitación más»). Coreografía propia, distinta a las del Inicio:
 *
 *  1. La frase "es una capacitación más." sube palabra por palabra en GRIS
 *     apagado — lo genérico, lo enlatado.
 *  2. …beat… y el "No" SE ESTAMPA desde la profundidad (escala 3.4 + blur →
 *     nítido) con onda expansiva, sacudida del renglón y ráfaga de partículas;
 *     la frase entera se "enciende" a navy: la oración queda afirmada.
 *  3. Bajada y CTA suben con fade; todo el bloque tiene TILT 3D que sigue al
 *     mouse.
 *
 * El CTA es enlace de sección → Qué hacemos (azul; el naranja es de Contacto).
 * Sin JS / prefers-reduced-motion: TODO queda en su estado final por CSS (la
 * frase navy + "No" verde visibles, partículas y onda ocultas). El copy usa el
 * lenguaje oficial ("relación con el saber matemático escolar") [[ed-copy-oficial]].
 */

const SLAM_WORDS = ["es", "una", "capacitación", "más."];
const PARTICLES = 12;

export function QueEsEdHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    let raf = 0;
    let removeMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-slam-word]");
      const no = root.querySelector<HTMLElement>("[data-slam-no]");
      const line = root.querySelector<HTMLElement>("[data-slam-line]");
      const shock = root.querySelector<HTMLElement>("[data-shockwave]");
      const parts = gsap.utils.toArray<HTMLElement>("[data-no-particle]");
      const sub = root.querySelector<HTMLElement>("[data-hero-sub]");
      const actions = root.querySelector<HTMLElement>("[data-hero-actions]");
      const eyebrow = root.querySelector<HTMLElement>("[data-hero-eyebrow]");
      const tilt = root.querySelector<HTMLElement>("[data-hero-tilt]");
      if (!no || !line || !shock || !sub || !actions || !eyebrow || !tilt) return;

      // ── Estados iniciales (solo con motion: sin JS queda el estado final) ──
      gsap.set(eyebrow, { autoAlpha: 0, y: 12 });
      gsap.set(words, { autoAlpha: 0, yPercent: 120, color: "#b6bdc9" });
      gsap.set(no, { autoAlpha: 0, scale: 3.4, filter: "blur(14px)" });
      gsap.set([sub, actions], { autoAlpha: 0, y: 22 });

      // ── La frase gris → el SLAM del "No" → bajada y CTA ──────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.35 });
      tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.5 }, 0)
        .to(
          words,
          { autoAlpha: 1, yPercent: 0, duration: 0.8, stagger: 0.09 },
          0.15,
        )
        .addLabel("slam", "+=0.45")
        // el "No" cae desde la profundidad y se vuelve nítido al impactar
        .to(
          no,
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power4.in" },
          "slam",
        )
        // impacto: sacudida del renglón completo
        .to(
          line,
          { keyframes: { x: [-7, 6, -4, 2, 0] }, duration: 0.4, ease: "power2.out" },
          "slam+=0.5",
        )
        // onda expansiva
        .fromTo(
          shock,
          { scale: 0.4, autoAlpha: 0.9 },
          { scale: 3.6, autoAlpha: 0, duration: 0.8, ease: "power2.out" },
          "slam+=0.48",
        )
        // la frase se ENCIENDE: de gris apagado a navy (queda afirmada)
        .to(
          words,
          { color: "#1f2d4d", duration: 0.5, stagger: 0.05 },
          "slam+=0.5",
        )
        .to(sub, { autoAlpha: 1, y: 0, duration: 0.7 }, "slam+=0.95")
        .to(actions, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4");

      // ráfaga de partículas del impacto (ángulo repartido + jitter estable)
      parts.forEach((p, i) => {
        const ang = (i / PARTICLES) * Math.PI * 2 + (i % 3) * 0.35;
        const dist = 46 + (i % 4) * 24;
        tl.fromTo(
          p,
          { x: 0, y: 0, scale: 1, autoAlpha: 1 },
          {
            x: Math.cos(ang) * dist,
            y: Math.sin(ang) * dist,
            scale: 0,
            autoAlpha: 0,
            duration: 0.65 + (i % 3) * 0.15,
            ease: "power2.out",
          },
          "slam+=0.48",
        );
      });

      // ── Salida con el scroll: el contenido se eleva y funde ──────────────
      const scrollWrap = root.querySelector<HTMLElement>("[data-hero-scroll]");
      if (scrollWrap) {
        gsap.to(scrollWrap, {
          yPercent: -12,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "75% top", scrub: true },
        });
      }

      // ── TILT 3D del bloque siguiendo el mouse (solo pointer fino) ─────────
      if (window.matchMedia("(pointer: fine)").matches) {
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        const onMove = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const loop = () => {
          cx += (tx - cx) * 0.06;
          cy += (ty - cy) * 0.06;
          gsap.set(tilt, {
            rotateY: cx * 4,
            rotateX: -cy * 3,
            transformPerspective: 900,
          });
          raf = requestAnimationFrame(loop);
        };
        window.addEventListener("mousemove", onMove);
        raf = requestAnimationFrame(loop);
        removeMove = () => window.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      removeMove?.();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-grain-light relative isolate flex min-h-[100svh] items-center overflow-hidden bg-gradient-to-b from-white to-gris-fondo/50"
      aria-label="Qué es Empoderamiento Docente"
    >
      {/* Campo de nodos de marca, detrás de todo */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <MathField className="h-full w-full" />
      </div>

      {/* Halo verde sutil detrás del titular */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.07)_0%,transparent_65%)]"
      />

      <div data-hero-scroll className="relative z-10 mx-auto w-full max-w-screen-xl px-5 pt-24 pb-20 md:px-10">
        <div data-hero-tilt className="will-change-transform [transform-style:preserve-3d]">
          <div data-hero-eyebrow>
            <Eyebrow>Qué es ED</Eyebrow>
          </div>

          <h1
            className="font-display text-azul-principal mt-7 max-w-[16ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.6rem, 1.1rem + 5.2vw, 5rem)", lineHeight: 1.04 }}
          >
            <span className="sr-only">No es una capacitación más.</span>
            <span aria-hidden="true" data-slam-line className="block">
              <span data-slam-no className="text-verde-concepto relative inline-block will-change-transform">
                No
                {/* Onda expansiva del impacto */}
                <span
                  data-shockwave
                  aria-hidden="true"
                  className="border-verde-concepto/60 pointer-events-none absolute top-1/2 left-1/2 h-[1.4em] w-[1.7em] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-0"
                />
                {/* Ráfaga de partículas */}
                {Array.from({ length: PARTICLES }, (_, i) => (
                  <span
                    key={i}
                    data-no-particle
                    aria-hidden="true"
                    className={`pointer-events-none absolute top-1/2 left-1/2 h-2 w-2 rounded-full opacity-0 ${
                      i % 3 === 0 ? "bg-naranja-accion" : "bg-verde-concepto"
                    }`}
                  />
                ))}
              </span>{" "}
              {SLAM_WORDS.map((w, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden align-bottom">
                    <span data-slam-word className="inline-block will-change-transform">
                      {w}
                    </span>
                  </span>
                  {i < SLAM_WORDS.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          </h1>

          <p
            data-hero-sub
            className="text-gris-texto mt-7 max-w-[44ch] font-sans text-[1.05rem] leading-relaxed md:text-[1.2rem]"
          >
            Somos investigación, diseño y acompañamiento: un proceso colectivo
            que cambia la relación con el saber matemático escolar.
          </p>

          <div data-hero-actions className="mt-10">
            <ButtonSecondary href="/que-hacemos">Conocé qué hacemos</ButtonSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
