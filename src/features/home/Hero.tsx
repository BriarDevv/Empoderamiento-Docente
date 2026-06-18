"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { CtaButton } from "@/components/ui/CtaButton";
import { ArrowDownIcon } from "@/components/ui/icons";
import { CTA_LINK } from "@/config/nav";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Hero: panel ancho con esquinas redondeadas (inset del viewport), foto de
 * fondo con overlay navy (DESIGN.md §10: 60%+ sobre foto) y contenido blanco
 * centrado. Comparte el max-width con el Navbar para alinear el logo con el
 * borde del panel. Headline = frase pilar de ED (§5.5), CTA naranja único.
 * Entrada coreografiada con guard de reduced-motion. Lleva el sentinel del nav.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
        .from("[data-hero-panel]", {
          opacity: 0,
          scale: 0.985,
          duration: 0.9,
          ease: "power2.out",
        })
        .from(
          "[data-hero-item]",
          { opacity: 0, y: 22, duration: 0.8, stagger: 0.1 },
          "-=0.5",
        );
    }, scope);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={ref}
      data-nav-sentinel
      className="relative bg-white px-5 pt-[5.5rem] pb-4 md:px-8 md:pt-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <div
          data-hero-panel
          className="shadow-hero relative flex min-h-[86svh] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] px-6 py-20 text-center ring-1 ring-white/10 sm:rounded-[2.25rem] md:px-10"
        >
          <Image
            src="/hero/hero.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1400px) 1400px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="from-azul-principal/85 via-azul-principal/65 to-azul-principal/90 absolute inset-0 bg-gradient-to-b"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            <p
              data-hero-item
              className="text-small text-azul-claro font-sans font-medium tracking-[0.16em]"
            >
              Desarrollo profesional docente
            </p>

            <h1
              data-hero-item
              className="text-display font-display mt-5 leading-[1.04] font-extrabold tracking-tight text-balance text-white"
            >
              Potenciamos fortalezas,
              <br className="hidden sm:block" /> fortalecemos potencialidades.
            </h1>

            <p
              data-hero-item
              className="text-body mx-auto mt-6 max-w-xl text-white/75"
            >
              Desarrollo profesional con las y los docentes de Chile, México y
              Argentina: investigación, formación situada y comunidad en torno a
              la Matemática Educativa.
            </p>

            <div
              data-hero-item
              className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"
            >
              <CtaButton href={CTA_LINK.href} label={CTA_LINK.label} />
              <Link
                href="#enfoque"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Conocé el enfoque
                <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
