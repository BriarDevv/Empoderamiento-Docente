"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LuzCursor } from "@/features/novedades/components/LuzCursor";
import { HERO_ESCENA } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero de Investigación como ESCENA DE PROFUNDIDAD: entrás a la sección y, con
 * el scroll, imágenes evocativas (aulas, docentes, investigación) se acercan
 * desde la luz del faro y pasan de largo — la "entrada" a la sección. El titular
 * "Investigar para transformar." recibe y, a medida que scrolleás, cede lugar al
 * dive. Navy (la única gran mancha oscura del arranque). Sin motion / touch:
 * hero estático legible con una tira de imágenes.
 */
const LANES = [
  { side: -1, y: -0.18 },
  { side: 1, y: 0.12 },
  { side: -1, y: 0.2 },
  { side: 1, y: -0.16 },
  { side: -1, y: 0.06 },
  { side: 1, y: 0.18 },
];

export function InvestigacionHero() {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (min-width: 768px)").matches) return;
    setLive(true);

    const zone = zoneRef.current;
    const stage = stageRef.current;
    if (!zone || !stage) return;

    const ctx = gsap.context(() => {
      // Entrada del titular (una sola vez): sube por líneas enmascaradas.
      gsap.set("[data-hero-word]", { yPercent: 115 });
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.to("[data-hero-word]", { yPercent: 0, duration: 1, stagger: 0.12 }, 0.3);
      intro.fromTo("[data-hero-rise]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.7);

      const cards = gsap.utils.toArray<HTMLElement>("[data-hero-img]");
      const W = window.innerWidth;
      const H = window.innerHeight;
      const vpY = H * 0.06;

      cards.forEach((card) => {
        gsap.set(card, { xPercent: -50, yPercent: -50, x: 0, y: vpY, scale: 0.05, autoAlpha: 0, transformOrigin: "50% 50%" });
      });

      const step = 1.7;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: zone, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      cards.forEach((card, i) => {
        const lane = LANES[i % LANES.length];
        const t = i * step;
        tl.to(card, { x: lane.side * W * 0.34, y: lane.y * H, scale: 1, autoAlpha: 1, ease: "none", duration: 2.2 }, t).to(
          card,
          { x: lane.side * W * 0.55, y: lane.y * H * 1.5, scale: 1.7, autoAlpha: 0, ease: "none", duration: 1.1 },
          t + 2.2,
        );
      });

      // El titular recibe y cede: sube y se desvanece en el primer tramo.
      gsap.to("[data-hero-content]", {
        yPercent: -22,
        autoAlpha: 0.05,
        ease: "none",
        scrollTrigger: { trigger: zone, start: "top top", end: "40% top", scrub: true },
      });
    }, stage);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={zoneRef}
      className={live ? "relative h-[380svh] bg-azul-principal" : "bg-azul-principal"}
      aria-label="Investigación"
    >
      <div
        ref={stageRef}
        className={
          "relative isolate overflow-hidden text-white " +
          (live ? "sticky top-0 flex h-[100svh] flex-col" : "flex min-h-[92svh] flex-col")
        }
      >
        {/* Puntos §6 + luz del faro. */}
        <span
          aria-hidden="true"
          className="pattern-dots-inverse pointer-events-none absolute inset-0 -z-10 [--dots-alpha:0.07]"
        />
        <LuzCursor horizonte={44} />

        {/* Imágenes que se acercan (live) o tira estática (fallback). */}
        <div
          className={
            live
              ? "pointer-events-none absolute inset-0 z-0"
              : "pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center gap-3 px-5 pb-8 opacity-40"
          }
        >
          {HERO_ESCENA.map((src, i) => (
            <figure
              key={src}
              data-hero-img
              className={
                live
                  ? "absolute top-1/2 left-1/2 w-[clamp(200px,20vw,320px)] will-change-transform"
                  : i < 3
                    ? "relative aspect-[4/3] w-1/3 max-w-[16rem]"
                    : "hidden"
              }
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
                <Image src={src} alt="" fill sizes="(max-width: 768px) 33vw, 320px" className="object-cover" />
                <span className="bg-azul-principal/25 absolute inset-0" />
              </div>
            </figure>
          ))}
        </div>

        {/* Titular (por encima de las imágenes). */}
        <div
          data-hero-content
          className="relative z-10 mx-auto my-auto w-full max-w-screen-xl px-5 md:px-10"
        >
          <div data-hero-rise>
            <Eyebrow variant="light">Investigación</Eyebrow>
          </div>
          <h1
            className="font-display mt-6 max-w-[13ch] font-extrabold tracking-[-0.03em] [text-shadow:0_2px_30px_rgb(15_21_40/0.5)]"
            style={{ fontSize: "clamp(2.7rem, 1rem + 6vw, 6rem)", lineHeight: 0.98 }}
          >
            <span className="sr-only">Investigar para transformar.</span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <span data-hero-word className="block">
                Investigar para
              </span>
            </span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <span data-hero-word className="text-verde-concepto block">
                transformar.
              </span>
            </span>
          </h1>
          <p
            data-hero-rise
            className="mt-7 max-w-[42ch] font-sans text-[1.05rem] leading-relaxed text-white/85 md:text-[1.2rem]"
          >
            Producimos conocimiento propio sobre la matemática escolar y lo
            devolvemos al aula.
          </p>
        </div>

        {/* Pista de scroll. */}
        <div
          data-hero-rise
          className="relative z-10 mx-auto w-full max-w-screen-xl px-5 pb-10 md:px-10"
        >
          <span className="font-mono text-[0.72rem] tracking-[0.2em] text-white/45 uppercase">
            Scrolleá para entrar ↓
          </span>
        </div>
      </div>
    </div>
  );
}
