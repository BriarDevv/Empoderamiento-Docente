"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";

/**
 * SVG inline encodeado como background-image — trazo de marcador con
 * bordes orgánicos. Igual al del componente `Highlight` para mantener
 * consistencia visual. Verde concepto al 55% opacity. */
const STROKE_VERDE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 32' preserveAspectRatio='none'><path d='M3,7 C20,4 50,3 90,5 C130,4 170,5 200,4 C220,5 230,6 237,5 L237,26 C220,29 200,27 180,27 C150,28 120,27 90,28 C60,27 30,28 3,26 Z' fill='%233e7c6d' fill-opacity='0.85'/></svg>\")";

type Props = {
  /** Texto completo del H1 (sin HTML). */
  text: string;
  /** Palabra a destacar con el stroke marker (match exacto, case-sensitive). */
  highlight: string;
  /** Delay base antes del primer word reveal (s). Default 0.8 — arranca
   *  después que el eyebrow ya entró. */
  delay?: number;
  /** Stagger entre palabras (s). Default 0.09. */
  stagger?: number;
  /** Duración de cada word reveal (s). Default 0.65. */
  duration?: number;
  /** Delay absoluto desde mount del highlight stroke (s). Default 1.9 —
   *  coincide con el momento que el logo termina E + D y va al pulse. */
  highlightDelay?: number;
  /** Duración del trazo de marcador (s). Default 0.75. */
  highlightDuration?: number;
  /** Clases tipográficas del H1 (font, tamaño, color, etc.). */
  className?: string;
};

/**
 * H1 con reveal por palabra (clip-mask + translateY) y la palabra
 * destacada con un highlight que se DIBUJA al final como un trazo de
 * marcador real (clip-path izq→der). Self-contained: timeline GSAP
 * propia al montar — sin depender de HomeAnimations.
 *
 * Acto 2 + cierre del Acto 3 de la presentación inicial: el H1 entra
 * mientras el logo se construye; el highlight remata cuando el logo
 * termina sus letras y va al pulse — sincronía visual deliberada.
 *
 * Defensa en profundidad: las palabras NO tienen style inline para
 * ocultarlas. GSAP las oculta SÍNCRONAMENTE en useIsomorphicLayoutEffect
 * (pre-paint en client). Si por algún motivo el JS falla, las palabras
 * quedan visibles por default — preferible a un H1 invisible para siempre.
 *
 * Accesibilidad: el texto completo se expone vía `<span class="sr-only">`
 * para lectores de pantalla; el split por palabra es solo visual.
 * `prefers-reduced-motion`: las palabras y el stroke quedan visibles
 * desde el primer frame, sin animación.
 */
export function HeroH1Reveal({
  text,
  highlight,
  delay = 0.8,
  stagger = 0.09,
  duration = 0.65,
  highlightDelay = 1.9,
  highlightDuration = 0.75,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  // Splittea conservando espacios. Ej: ["Investigamos", " ", "para", " ", ...]
  const partes = text.split(/(\s+)/);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const inners =
        root.querySelectorAll<HTMLSpanElement>("[data-word-inner]");
      const stroke = root.querySelector<HTMLSpanElement>("[data-hl-stroke]");

      // Estado inicial — SÍNCRONO antes del primer paint del client.
      // Si el JS no cargara, los <span> ya están visibles por default
      // (no hay style inline ocultándolos).
      gsap.set(inners, { yPercent: 110 });
      if (stroke) {
        gsap.set(stroke, { clipPath: "inset(0 100% 0 0)" });
      }

      // Word reveal: cada palabra "sube" desde abajo con stagger.
      gsap.to(inners, {
        yPercent: 0,
        duration,
        ease: "power3.out",
        stagger,
        delay,
      });

      // Highlight stroke: se "dibuja" de izq a der como cierre.
      if (stroke) {
        gsap.to(stroke, {
          clipPath: "inset(0 0% 0 0)",
          duration: highlightDuration,
          ease: "power3.out",
          delay: highlightDelay,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [
    reducedMotion,
    delay,
    stagger,
    duration,
    highlightDelay,
    highlightDuration,
  ]);

  return (
    <h1 ref={rootRef} className={className}>
      {/* Accesibilidad: el texto completo va a screen readers de corrido */}
      <span className="sr-only">{text}</span>

      {/* Render visual: cada palabra wrappeada para el reveal por palabra.
          Las palabras son VISIBLES por default — GSAP las oculta en
          useIsomorphicLayoutEffect (pre-paint). */}
      <span aria-hidden="true">
        {partes.map((parte, i) => {
          // Espacios entre palabras: render normal (NO se animan)
          if (/^\s+$/.test(parte)) {
            return <span key={i}>{parte}</span>;
          }

          const esHighlight = parte === highlight;

          return (
            <span
              key={i}
              className="relative inline-block overflow-hidden align-bottom"
            >
              <span
                data-word-inner
                className="relative inline-block whitespace-nowrap"
              >
                {/* Stroke del marcador detrás de la palabra highlighted.
                    Por default visible (sin clip-path inline). GSAP lo
                    recorta en pre-paint y lo destapa al final del reveal.
                    Más alto (0.85em) + más opaco (0.85) para contraste
                    fuerte sobre el navy del Hero. */}
                {esHighlight && (
                  <span
                    data-hl-stroke
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundImage: STROKE_VERDE,
                      backgroundSize: "100% 0.85em",
                      backgroundPosition: "0 75%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}
                <span className="relative">{parte}</span>
              </span>
            </span>
          );
        })}
      </span>
    </h1>
  );
}
