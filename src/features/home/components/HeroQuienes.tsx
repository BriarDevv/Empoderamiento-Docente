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
 * La barra mide el alto del bloque y se despliega desde el centro hacia los
 * extremos. Clips complementarios → no se solapan; la línea es la costura. Todo
 * en píxeles para que línea y borrado vayan pegados.
 * Respeta prefers-reduced-motion (capas apiladas en flow, sin animación).
 */
export function HeroQuienes() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Progreso de scroll del hero (0 arriba → 1 cuando queda atrás). El campo de
  // nodos lo lee en cada frame para ir apagando nodos (cada vez menos).
  const heroScroll = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const zone = zoneRef.current;
    const panel = panelRef.current;
    if (!zone || !panel) return;

    const ctx = gsap.context(() => {
      // Apagado de nodos por scroll del hero: progreso 0 (hero arriba) → 1
      // (hero ya pasó). El MathField lo lee y va apagando nodos.
      const heroEl =
        wrapRef.current?.querySelector<HTMLElement>('[data-section="hero"]');
      if (heroEl) {
        ScrollTrigger.create({
          trigger: heroEl,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            heroScroll.current = self.progress;
          },
          onRefresh: (self) => {
            heroScroll.current = self.progress;
          },
        });
      }

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
      const OPEN = 0.16; // 0..OPEN abre | OPEN..CLOSE barre | CLOSE..1 cierra
      const CLOSE = 0.84;
      const openScale = (p: number) =>
        p < OPEN ? p / OPEN : p > CLOSE ? (1 - p) / (1 - CLOSE) : 1;
      const travel = (p: number) =>
        p <= OPEN ? 0 : p >= CLOSE ? 1 : (p - OPEN) / (CLOSE - OPEN);

      let panelW = 0;
      let xRight = 0;
      let xLeft = 0;
      const measure = () => {
        const pr = panel.getBoundingClientRect();
        panelW = pr.width;

        const cr = (bounds ?? about).getBoundingClientRect();
        xRight = cr.right - pr.left;
        xLeft = cr.left - pr.left;
        // la barra arranca con el alto y el centro vertical del bloque.
        gsap.set(line, { top: cr.top - pr.top, height: cr.height });

        // igualo la caja de Misión al alto real de QS (arrancan a la misma altura)
        const pAbout = about.querySelector<HTMLElement>("[data-qs-fill]");
        const pMision = mision.querySelector<HTMLElement>("[data-qs-fill]");
        if (pAbout && pMision) {
          gsap.set(pMision, { minHeight: 0 });
          gsap.set(pMision, { minHeight: pAbout.getBoundingClientRect().height });
        }
      };

      const apply = (p: number) => {
        const x = xRight + (xLeft - xRight) * travel(p); // der → izq
        gsap.set(line, { x, scaleY: openScale(p) });
        gsap.set(about, { clipPath: `inset(0px ${panelW - x}px 0px 0px)` });
        gsap.set(mision, { clipPath: `inset(0px 0px 0px ${x}px)` });
      };
      ScrollTrigger.create({
        trigger: zone,
        start: () => "top top-=" + window.innerHeight * 1.0,
        end: () => "top top-=" + window.innerHeight * 1.5,
        scrub: true,
        onRefresh: (self) => {
          measure();
          apply(self.progress);
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
      {/* Nodos detrás del hero — NO sticky: scrollean con el hero y se quedan
          atrás al scrollear (no siguen al viewport). Cubren el alto del hero. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden opacity-40 lg:h-[93.75vw]"
        aria-hidden="true"
      >
        <MathField className="h-full w-full" scrollRef={heroScroll} />
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
