"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Instancia única de Lenis para smooth scroll global, integrada con
 * ScrollTrigger (Lenis dispara `scroll` y ScrollTrigger.update se engancha).
 *
 * Si el SO solicita reduced-motion, NO monta Lenis: scroll nativo del
 * navegador, sin smooth.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      // Valores exactos medidos en blueprintapps.io (runtime).
      lerp: 0.1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Lenis corre dentro del ticker de GSAP para compartir el mismo
    // frame que ScrollTrigger — evita el jitter típico de refresh-rates
    // variables (120Hz, ProMotion) y dos RAF loops desincronizados.
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Re-sincronizar Lenis + ScrollTrigger cuando cambia el alto del contenido
    // (hot-reload en dev, imágenes tardías, secciones que montan después). Sin
    // esto Lenis cachea el alto viejo y clampea el scroll antes del final del
    // documento — síntoma: "no se puede bajar" en mitad de una sección larga.
    let resizeRaf = 0;
    const resync = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
    };
    const resizeObserver = new ResizeObserver(resync);
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeRaf);
      gsap.ticker.remove(tickerFn);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
