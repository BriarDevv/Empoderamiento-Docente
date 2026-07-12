"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MathField } from "@/components/ui/MathField";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero de "Qué es ED" — estilo EDITORIAL (referencia: hero "DATA DRIVES OUR
 * WORLD"): titular GIGANTE alineado a la izquierda A ANCHO TOTAL (sin el
 * container del sitio; solo padding), sobre el fondo de nodos del Inicio
 * (MathField); abajo, a la izquierda un "scrolleá para explorar" y a la
 * derecha la bajada. El hero NO llega a 100vh: deja ASOMAR un poco la sección
 * siguiente (el navy de Origen), que invita a seguir.
 *
 * Entrada: el titular se RELLENA. Arranca en gris tenue y un frente verde barre
 * de izquierda a derecha dejándolo navy — se hace con background-clip:text sobre
 * un gradiente (navy · verde · gris) cuya posición anima. La bajada y el pie
 * suben con un fade.
 *
 * Sin motion / prefers-reduced-motion: el titular queda navy y todo visible
 * (el gradiente en su posición final). Copy oficial [[ed-copy-oficial]].
 */

// Gradiente del relleno: navy (ya relleno) · verde (frente) · gris (sin rellenar).
const FILL_GRADIENT =
  "linear-gradient(100deg, #1f2d4d 0%, #1f2d4d 35%, #1f9a78 43%, #c5ccd6 52%, #c5ccd6 100%)";

export function QueEsEdHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const title = root.querySelector<HTMLElement>("[data-title]");
      const foot = gsap.utils.toArray<HTMLElement>("[data-hero-foot]");
      const wheel = root.querySelector<HTMLElement>("[data-mouse-wheel]");
      if (!title) return;

      // ── Estado inicial ───────────────────────────────────────────────────
      gsap.set(foot, { autoAlpha: 0, y: 20 });

      // ── El titular se RELLENA (gris → navy, con frente verde barriendo) ──
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(
        title,
        { backgroundPosition: "100% 0" },
        { backgroundPosition: "0% 0", duration: 1.7, ease: "power2.inOut" },
        0,
      );
      // el pie sube cuando el relleno ya avanzó
      tl.to(foot, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.9);

      // ── Ruedita del mouse (indicador de scroll) baja y vuelve, en loop ───
      if (wheel) {
        gsap.fromTo(
          wheel,
          { y: -3, autoAlpha: 1 },
          { y: 5, autoAlpha: 0.2, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[87svh] flex-col justify-between overflow-hidden bg-gradient-to-b from-white via-white to-gris-fondo/40 px-6 pt-32 pb-12 md:px-12 md:pb-16"
      aria-label="Qué es Empoderamiento Docente"
    >
      {/* Fondo de nodos de marca (el mismo del Inicio), detrás de todo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <MathField className="h-full w-full" />
      </div>

      {/* ── Titular gigante (arriba, a la izquierda) ─────────────────────── */}
      <h1
        className="font-display relative z-10 max-w-[15ch] font-extrabold tracking-[-0.025em]"
        style={{ fontSize: "clamp(2.8rem, 0.5rem + 9vw, 8.5rem)", lineHeight: 0.96 }}
      >
        <span className="sr-only">No es una capacitación más.</span>
        <span
          aria-hidden="true"
          data-title
          className="block"
          style={{
            backgroundImage: FILL_GRADIENT,
            backgroundSize: "250% 100%",
            backgroundPosition: "0% 0",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
          }}
        >
          No es una capacitación más.
        </span>
      </h1>

      {/* ── Pie: scrolleá para explorar (izq) + bajada (der) ─────────────── */}
      <div className="relative z-10 flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-end">
        <div data-hero-foot className="text-gris-texto flex items-center gap-3">
          <svg
            width="22"
            height="34"
            viewBox="0 0 22 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="1" y="1" width="20" height="32" rx="10" />
            <line data-mouse-wheel x1="11" y1="8" x2="11" y2="13" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-xs tracking-[0.14em] uppercase">
            Scrolleá para explorar
          </span>
        </div>

        <p
          data-hero-foot
          className="text-azul-principal max-w-[42ch] font-sans text-[1.05rem] leading-relaxed font-medium md:text-right md:text-[1.2rem]"
        >
          Somos investigación, diseño y acompañamiento: un proceso colectivo que
          cambia la relación con el saber matemático escolar.
        </p>
      </div>
    </section>
  );
}
