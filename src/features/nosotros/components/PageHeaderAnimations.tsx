"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Wrapper client que orquesta la presentación coordinada del PageHeader
 * de /nosotros. Mismo patrón que el HomeAnimations del home pero focused
 * en esta página.
 *
 * Cadencia editorial:
 * - t=0.5  eyebrow
 * - t=0.8  H1 reveal por palabra (interno a HeroH1Reveal)
 * - t=1.0  bajada
 * - t=1.4  stats con sub-stagger entre cada uno
 * - t=1.7  CTAs
 * - t=1.9  highlight de "transforma" (interno a HeroH1Reveal — coincide
 *          con el cierre del reveal por palabra)
 *
 * Reduced-motion respetado: early return + items visibles desde el
 * primer paint (no hay style inline ocultándolos).
 */
export function PageHeaderAnimations({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const scope = root.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      // Items que entran como bloque con fade + rise sutil.
      const items: Array<{ sel: string; delay: number; dur: number }> = [
        { sel: '[data-anim-item="eyebrow"]', delay: 0.5, dur: 0.6 },
        { sel: '[data-anim-item="bajada"]', delay: 1.0, dur: 0.7 },
        { sel: '[data-anim-item="ctas"]', delay: 1.7, dur: 0.7 },
      ];
      for (const { sel, delay, dur } of items) {
        const el = scope.querySelector(sel);
        if (!el) continue;
        gsap.fromTo(
          el,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: dur, delay, ease: "power3.out" },
        );
      }

      // Stats: sub-stagger entre los 3 stats (14, 5, 3). Da un efecto
      // editorial de "los números aparecen ordenadamente, uno tras otro".
      const statsContainer = scope.querySelector('[data-anim="stats"]');
      if (statsContainer) {
        const statItems =
          statsContainer.querySelectorAll<HTMLElement>("[data-anim-stat]");
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.09,
            delay: 1.4,
          },
        );
      }
    }, scope);

    return () => ctx.revert();
  }, [reducedMotion]);

  return <div ref={root}>{children}</div>;
}
