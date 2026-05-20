"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Options = {
  /** Stagger entre hijos directos. 0 = sin stagger (anima el target). */
  stagger?: number;
  /** Distancia en px que el elemento sube al aparecer. Default 16. */
  rise?: number;
  /** Duración en segundos. Default 0.6. */
  duration?: number;
  /** Desactivar la animación (reducedMotion === true). */
  disabled?: boolean;
};

/**
 * Anima el target con fade-in + translateY al entrar al viewport.
 * Solo transform y opacity (AGENTS §7). Cleanup automático con
 * gsap.context() para evitar leaks al desmontar.
 */
export function useFadeInOnScroll(
  ref: RefObject<HTMLElement | null>,
  options: Options = {},
) {
  const { stagger = 0, rise = 16, duration = 0.6, disabled = false } = options;

  useEffect(() => {
    if (disabled) return;
    const target = ref.current;
    if (!target) return;

    const context = gsap.context(() => {
      const elements = stagger > 0 ? Array.from(target.children) : [target];

      gsap.fromTo(
        elements,
        { opacity: 0, y: rise },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: target,
            start: "top 82%",
            once: true,
          },
        },
      );
    }, target);

    return () => context.revert();
  }, [ref, stagger, rise, duration, disabled]);
}
