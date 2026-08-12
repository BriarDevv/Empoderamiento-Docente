"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FASES } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Ciclo de investigación aplicada" — scroll-story CLAVADO. Las 4 fases son
 * cards que, al scrollear, SE CIERRAN una por una (colapsan a solo el título)
 * mientras un LAZO GRUESO VERDE se va dibujando y serpentea entre ellas — el
 * flujo del ciclo. Cierra con un titular grande. Fondo claro.
 *
 * Sin motion / touch / pantalla chica: no clava; muestra las 4 fases en grilla
 * legible + el titular. `live` arranca en false (coincide con SSR).
 */

// Cards a la DERECHA (zig-zag), sobre el recorrido del lazo, para que serpentee
// entre ellas. % del escenario.
const POS = [
  { left: "44%", top: "8%" },
  { left: "66%", top: "26%" },
  { left: "46%", top: "50%" },
  { left: "68%", top: "62%" },
];

// Lazo GRANDE y protagonista: baja por el centro-izquierda y hace un RULO
// dramático en el lado derecho (viewBox 1600x900; grosor fijo por
// non-scaling-stroke).
const RIBBON = "M 560 -70 C 430 170 410 380 600 460 C 800 550 960 480 1060 340 C 1190 160 1490 190 1540 470 C 1585 700 1300 810 1150 640 C 1050 515 1180 420 1310 500";

export function CicloInvestigacion() {
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

    const run = () => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const ribbon = stage.querySelector<SVGPathElement>("[data-ribbon]");
        const headline = stage.querySelector<HTMLElement>("[data-headline]");
        const intro = stage.querySelector<HTMLElement>("[data-ciclo-intro]");
        if (cards.length !== 4 || !ribbon) return;

        // Medir las zonas colapsables y fijarles alto para poder animarlo a 0.
        const colapsables = gsap.utils.toArray<HTMLElement>("[data-collapse]");
        colapsables.forEach((c) => gsap.set(c, { height: c.scrollHeight }));
        // Las cards arrancan ABAJO y ocultas: llegan subiendo con el scroll.
        gsap.set(cards, { y: 760, autoAlpha: 0 });
        if (headline) gsap.set(headline, { autoAlpha: 0, y: 24, scale: 0.96 });

        // Lazo listo para dibujarse.
        const len = ribbon.getTotalLength();
        gsap.set(ribbon, { strokeDasharray: len, strokeDashoffset: len });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: zone, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });

        // 1 — el lazo se dibuja a lo largo de casi toda la escena.
        tl.to(ribbon, { strokeDashoffset: 0, ease: "none", duration: 8 }, 0);

        // 2 — cada card LLEGA subiendo desde abajo y SE CIERRA mientras sube.
        cards.forEach((card, i) => {
          const t = i * 1.5;
          const icono = card.querySelector("[data-collapse-icon]");
          const cuerpo = card.querySelector("[data-collapse]");
          // sube desde abajo a su lugar
          tl.to(card, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 1.6 }, t);
          // se cierra a medida que avanza (arranca antes de terminar de subir)
          if (icono) tl.to(icono, { height: 0, autoAlpha: 0, marginBottom: 0, ease: "none", duration: 0.9 }, t + 0.8);
          if (cuerpo) tl.to(cuerpo, { height: 0, autoAlpha: 0, marginTop: 0, ease: "none", duration: 1.0 }, t + 0.8);
        });

        // 3 — las cards terminan de subir y ceden; entra el titular grande.
        tl.to(cards, { autoAlpha: 0, y: -70, ease: "power1.in", duration: 1.2 }, 7.8);
        if (intro) tl.to(intro, { autoAlpha: 0, ease: "none", duration: 0.6 }, 7.8);
        if (headline) tl.to(headline, { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: 1.3 }, 8.2);
      }, stage);

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;
    if (document.fonts?.ready) document.fonts.ready.then(() => (cleanup = run()));
    else cleanup = run();
    return () => cleanup?.();
  }, [reduced]);

  return (
    <div
      ref={zoneRef}
      className={live ? "relative h-[480svh] bg-white" : "bg-white"}
      aria-label="Ciclo de investigación aplicada"
    >
      <div
        ref={stageRef}
        className={
          "overflow-clip " +
          (live ? "sticky top-0 h-[100svh]" : "relative flex min-h-[70svh] flex-col py-24")
        }
      >
        {/* Encabezado */}
        <div
          data-ciclo-intro
          className={
            live
              ? "absolute inset-x-0 top-0 z-20 mx-auto w-full max-w-screen-xl px-5 pt-10 md:px-10 md:pt-14"
              : "mx-auto w-full max-w-screen-xl px-5 md:px-10"
          }
        >
          <Eyebrow>Ciclo de investigación aplicada</Eyebrow>
          <p className="text-gris-texto mt-3 max-w-[38ch] font-sans text-[0.98rem] leading-relaxed">
            Cuatro fases que se encadenan y vuelven a empezar.
          </p>
        </div>

        {/* Lazo verde que serpentea (detrás de las cards). */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
          className={live ? "pointer-events-none absolute inset-0 z-0 h-full w-full" : "hidden"}
          style={{ filter: "drop-shadow(0 24px 34px rgb(31 154 120 / 0.22))" }}
        >
          <path
            data-ribbon
            d={RIBBON}
            fill="none"
            stroke="#1f9a78"
            strokeWidth={62}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Titular grande del final (aparece al cerrar las cards). */}
        {live && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-5 md:px-10">
            <h2
              data-headline
              className="font-display text-azul-principal mx-auto w-full max-w-screen-xl font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.4rem, 1rem + 5vw, 5rem)", lineHeight: 1.02 }}
            >
              Del aula a la teoría,
              <br />
              <span className="text-verde-concepto-texto">y de vuelta al aula.</span>
            </h2>
          </div>
        )}

        {/* Las 4 fases como cards. */}
        <div
          className={
            live
              ? "absolute inset-0 z-10"
              : "mx-auto mt-12 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 md:px-10"
          }
        >
          {FASES.map((f, i) => (
            <article
              key={f.n}
              data-card
              className={live ? "absolute w-[clamp(250px,24vw,22rem)]" : "relative"}
              style={live ? POS[i] : undefined}
            >
              <div className="border-azul-principal/8 rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgb(31_45_77/0.04),0_24px_50px_-24px_rgb(31_45_77/0.18)]">
                <div data-collapse-icon className="overflow-hidden">
                  <span className="bg-verde-concepto/10 text-verde-concepto-texto mb-4 flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[0.85rem] font-semibold">
                    {f.n}
                  </span>
                </div>
                <h3 className="font-display text-azul-principal text-[1.35rem] leading-tight font-bold">
                  {f.t}
                </h3>
                <div data-collapse className="overflow-hidden">
                  <p className="text-verde-concepto-texto mt-1 font-sans text-[0.95rem] font-medium italic">
                    {f.sub}
                  </p>
                  <p className="text-gris-texto mt-3 font-sans text-[0.95rem] leading-relaxed">
                    {f.d}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
