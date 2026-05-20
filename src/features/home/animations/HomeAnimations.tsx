"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wrapper client que orquesta las animaciones de las secciones de la home.
 * Cada sección server marca elementos con data-anim="<id>" (y opcionalmente
 * data-anim-item para hijos animables). Cleanup con gsap.context().
 *
 * Si reducedMotion === true, no anima — los elementos quedan visibles desde
 * el inicio (no hay opacity:0 en CSS).
 */
export function HomeAnimations({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const scope = root.current;
    if (!scope) return;

    const context = gsap.context(() => {
      // ─── HERO ────────────────────────────────────────────────────
      // Copy: stagger de hijos data-anim-item (eyebrow → headline → bajada → flujo → CTAs)
      const heroCopy = scope.querySelector('[data-anim="hero-copy"]');
      if (heroCopy) {
        const items = heroCopy.querySelectorAll("[data-anim-item]");
        gsap.fromTo(
          items,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.085,
          },
        );
      }

      // Logo: fade-in + sutil scale-up
      const heroLogo = scope.querySelector('[data-anim="hero-logo"]');
      if (heroLogo) {
        gsap.fromTo(
          heroLogo,
          { opacity: 0, scale: 0.92, y: 16 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            delay: 0.3,
            ease: "power3.out",
          },
        );
      }

      // Scroll indicator: fade-in al final
      const scrollIndicator = scope.querySelector(
        '[data-anim="scroll-indicator"]',
      );
      if (scrollIndicator) {
        gsap.fromTo(
          scrollIndicator,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, delay: 1.2, ease: "power2.out" },
        );
      }

      // ─── CICLO ────────────────────────────────────────────────────
      // Intro: fade + rise
      ['[data-anim="ciclo-intro"]', '[data-anim="ciclo-intro-text"]'].forEach(
        (selector) => {
          const target = scope.querySelector(selector);
          if (!target) return;
          gsap.fromTo(
            target,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: target,
                start: "top 82%",
                once: true,
              },
            },
          );
        },
      );

      // Fases: stagger al entrar
      const fases = scope.querySelector('[data-anim="ciclo-fases"]');
      if (fases) {
        const articles = Array.from(fases.children).filter(
          (child) => child.tagName === "ARTICLE",
        );
        gsap.fromTo(
          articles,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.14,
            scrollTrigger: {
              trigger: fases,
              start: "top 75%",
              once: true,
            },
          },
        );
      }

      // Outro
      const cicloOutro = scope.querySelector('[data-anim="ciclo-outro"]');
      if (cicloOutro) {
        gsap.fromTo(
          cicloOutro,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cicloOutro,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ─── SOBRE ED ────────────────────────────────────────────────
      ['[data-anim="sobre-copy"]', '[data-anim="sobre-quote"]'].forEach(
        (selector, index) => {
          const target = scope.querySelector(selector);
          if (!target) return;
          gsap.fromTo(
            target,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              ease: "power3.out",
              delay: index === 1 ? 0.18 : 0,
              scrollTrigger: {
                trigger: target,
                start: "top 80%",
                once: true,
              },
            },
          );
        },
      );

      // ─── COMUNIDAD ────────────────────────────────────────────────
      const comunidadIntro = scope.querySelector(
        '[data-anim="comunidad-intro"]',
      );
      if (comunidadIntro) {
        gsap.fromTo(
          comunidadIntro,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: comunidadIntro,
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // Cards o placeholder
      [
        '[data-anim="comunidad-cards"]',
        '[data-anim="comunidad-placeholder"]',
      ].forEach((selector) => {
        const target = scope.querySelector(selector);
        if (!target) return;
        gsap.fromTo(
          target,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: target,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    }, scope);

    return () => context.revert();
  }, [reducedMotion]);

  return <div ref={root}>{children}</div>;
}
