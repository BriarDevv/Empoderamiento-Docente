"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "./Hero";
import { Manifiesto } from "./Manifiesto";
import { MisionPanel } from "./MisionPanel";
import { MathField } from "@/components/ui/MathField";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Secciones APILADAS verticalmente (sin slide horizontal). El campo de nodos
 * (MathField) es una capa PERSISTENTE detrás del hero y del panel. El Hero
 * scrollea normal; debajo, el panel se clava (sticky) y una LÍNEA VERDE barre de
 * derecha a izquierda: BORRA "¿Quiénes somos?" (clip desde la derecha) y revela
 * la "Misión" (clip desde la izquierda) en el mismo lugar, con la MISMA forma.
 * Clips complementarios → no se solapan; la línea es la costura.
 * Respeta prefers-reduced-motion (capas apiladas en flow, sin animación).
 */
export function HeroQuienes() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const zone = zoneRef.current;
    const panel = panelRef.current;
    if (!zone || !panel) return;

    const ctx = gsap.context(() => {
      const about = panel.querySelector<HTMLElement>("[data-about-layer]");
      const mision = panel.querySelector<HTMLElement>("[data-mision-layer]");
      const line = panel.querySelector<HTMLElement>("[data-wipe-line]");
      if (!about || !mision || !line) return;

      // Las dos capas pasan a SUPERPONERSE (en flow quedaban apiladas para reduced-motion).
      gsap.set([about, mision], { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" });
      gsap.set(about, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(mision, { clipPath: "inset(0% 0% 0% 100%)" });
      gsap.set(line, { autoAlpha: 1, transformOrigin: "center center", scaleY: 0 });

      // 1) FILL — cada texto se COMPLETA palabra por palabra con el scroll
      //    (estilo blueprint): arranca gris tenue y se enciende en VERDE; las
      //    palabras [data-accent] se encienden en AZUL de marca. "Quiénes somos"
      //    se llena ANTES del barrido; la Misión DESPUÉS (ya revelada).
      const GRAY = "#b6bdc9";
      const fillTarget = (_i: number, t: Element) =>
        t.hasAttribute("data-accent") ? "#1f2d4d" : "#1f9a78";

      const aboutWords = about.querySelectorAll<HTMLElement>("[data-qs-word]");
      const misionWords = mision.querySelectorAll<HTMLElement>("[data-qs-word]");
      gsap.set([...aboutWords, ...misionWords], { color: GRAY });

      if (aboutWords.length) {
        gsap.to(aboutWords, {
          color: fillTarget,
          ease: "none",
          stagger: 0.4,
          duration: 1,
          scrollTrigger: {
            trigger: zone,
            start: () => "top top+=" + window.innerHeight * 0.12,
            end: () => "top top-=" + window.innerHeight * 0.8,
            scrub: true,
          },
        });
      }

      if (misionWords.length) {
        gsap.to(misionWords, {
          color: fillTarget,
          ease: "none",
          stagger: 0.4,
          duration: 1,
          scrollTrigger: {
            trigger: zone,
            start: () => "top top-=" + window.innerHeight * 1.65,
            end: () => "top top-=" + window.innerHeight * 2.35,
            scrub: true,
          },
        });
      }

      // 2) BARRIDO verde: "Quiénes somos" → "Misión". La barra mide EXACTO el
      //    alto del bloque (no de la pantalla) y viaja solo por su ancho. Todo en
      //    píxeles para que la LÍNEA y el borrado (clip) queden siempre pegados.
      //    Coreografía: abre desde el centro → barre der→izq → cierra al centro.
      const bounds = about.querySelector<HTMLElement>("[data-wipe-bounds]");
      let xRight = 0;
      let xLeft = 0;
      let panelW = 0;
      const measure = () => {
        const pr = panel.getBoundingClientRect();
        const cr = (bounds ?? about).getBoundingClientRect();
        panelW = pr.width;
        xRight = cr.right - pr.left;
        xLeft = cr.left - pr.left;
        // la barra arranca con el alto y el centro vertical del bloque.
        gsap.set(line, { top: cr.top - pr.top, height: cr.height });

        // los dos párrafos están centrados en su columna; para que ARRANQUEN a
        // la misma altura igualo la caja de Misión al alto real de Quiénes somos
        // (el más largo). Robusto a cualquier ancho / cantidad de líneas.
        const pAbout = about.querySelector<HTMLElement>("[data-qs-fill]");
        const pMision = mision.querySelector<HTMLElement>("[data-qs-fill]");
        if (pAbout && pMision) {
          gsap.set(pMision, { minHeight: 0 });
          gsap.set(pMision, { minHeight: pAbout.getBoundingClientRect().height });
        }
      };

      const OPEN = 0.16; // 0..OPEN abre | OPEN..CLOSE barre | CLOSE..1 cierra
      const CLOSE = 0.84;
      const apply = (p: number) => {
        const scaleY =
          p < OPEN ? p / OPEN : p > CLOSE ? (1 - p) / (1 - CLOSE) : 1;
        const t =
          p <= OPEN ? 0 : p >= CLOSE ? 1 : (p - OPEN) / (CLOSE - OPEN);
        const x = xRight + (xLeft - xRight) * t; // der → izq
        gsap.set(line, { x, scaleY });
        gsap.set(about, { clipPath: `inset(0px ${panelW - x}px 0px 0px)` });
        gsap.set(mision, { clipPath: `inset(0px 0px 0px ${x}px)` });
      };

      ScrollTrigger.create({
        trigger: zone,
        start: () => "top top-=" + window.innerHeight * 1.0,
        end: () => "top top-=" + window.innerHeight * 1.5,
        scrub: true,
        onRefresh: () => {
          measure();
          apply(0);
        },
        onUpdate: (self) => apply(self.progress),
      });
    }, wrapRef);

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className="relative isolate bg-gradient-to-b from-white via-white to-gris-fondo/40">
      {/* Nodos PERSISTENTES: pegados al viewport, detrás del hero y del panel. */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <MathField className="h-full w-full" />
        </div>
      </div>

      {/* Hero — scrollea normal (sin slide). */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* Quiénes somos → barrido verde → Misión (apilado debajo del hero). */}
      <div ref={zoneRef} className="relative z-20 h-[340svh] motion-reduce:h-auto">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden motion-reduce:static motion-reduce:h-auto">
          <div ref={panelRef} className="relative h-full w-full motion-reduce:h-auto">
            {/* Capa 1: Quiénes somos (se borra). */}
            <div data-about-layer className="h-full w-full motion-reduce:h-auto">
              <Manifiesto />
            </div>
            {/* Capa 2: Misión (se revela en el mismo lugar). */}
            <div data-mision-layer className="h-full w-full motion-reduce:h-auto">
              <MisionPanel />
            </div>
            {/* Línea-borrador verde: la costura del barrido (derecha → izquierda). */}
            <span
              data-wipe-line
              aria-hidden="true"
              className="bg-verde-concepto pointer-events-none absolute top-0 left-0 z-30 w-[3px] rounded-full opacity-0 shadow-[0_0_18px_rgba(31,154,120,0.55)] will-change-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
