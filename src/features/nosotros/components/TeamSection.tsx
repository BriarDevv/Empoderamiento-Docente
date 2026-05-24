"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { TeamMember } from "../types/team";
import { TeamCard } from "./TeamCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Variant = "large" | "medium" | "small";

interface TeamSectionProps {
  /** Número de capítulo, ej "01". */
  number: string;
  title: string;
  subtitle?: string;
  members: readonly TeamMember[];
  variant: Variant;
  startIndex: number;
  onOpen: (member: TeamMember, photoEl: HTMLElement) => void;
}

const GRID: Record<Variant, string> = {
  large: "grid-cols-1 sm:grid-cols-2",
  medium: "grid-cols-2 md:grid-cols-3",
  small: "grid-cols-2 md:grid-cols-3",
};

const GAP: Record<Variant, string> = {
  large: "gap-x-8 gap-y-10 md:gap-x-10 md:gap-y-12",
  medium: "gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10",
  small: "gap-x-5 gap-y-8 md:gap-x-7 md:gap-y-10",
};

const GRID_MAX: Record<Variant, string> = {
  large: "max-w-3xl",
  medium: "max-w-5xl",
  small: "max-w-5xl",
};

/**
 * Capítulo del equipo. Header editorial (number gigante + eyebrow +
 * título + subtítulo) + grid de TeamCards con stagger GSAP al entrar
 * en viewport. Patrón gráfico del manual (dots + semicírculo
 * azul-medio) como decoración ambient.
 */
export function TeamSection({
  number,
  title,
  subtitle,
  members,
  variant,
  startIndex,
  onOpen,
}: TeamSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (!gridRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current!.children;
      gsap.fromTo(
        cards,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24"
    >
      {/* Círculos verdes distribuidos — composición distinta por capítulo
          para que cada sección tenga personalidad propia (no copia-pega).
          Manual §6: forma plana verde = acento conceptual. */}
      <SectionCircles variant={number} />

      {/* Header editorial: número grande en flow + título + subtítulo */}
      <header className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        <span
          aria-hidden="true"
          className="font-display text-verde-concepto/35 block leading-[0.85] font-bold tabular-nums"
          style={{ fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}
        >
          {number}
        </span>
        <h2 className="font-display text-azul-principal mt-3 max-w-2xl text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.1] font-bold tracking-[-0.015em]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gris-texto mt-3 max-w-2xl font-sans text-[1rem] leading-relaxed md:text-[1.05rem]">
            {subtitle}
          </p>
        )}
      </header>

      {/* Grid de cards */}
      <div className="relative z-10 mx-auto mt-10 max-w-screen-xl px-5 md:mt-14 md:px-10">
        <div
          ref={gridRef}
          className={`grid ${GRID[variant]} ${GAP[variant]} ${GRID_MAX[variant]} mx-auto`}
        >
          {members.map((m, i) => (
            <TeamCard
              key={m.id}
              member={m}
              size={variant}
              index={startIndex + i}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Composición decorativa por capítulo: círculos verdes parcialmente
 * superpuestos a una grilla de puntos. Es el patrón gráfico oficial
 * del manual §6 ("formas planas... parcialmente superpuestos al grid").
 *
 * Cada capítulo arma una composición distinta para que la página
 * respire y no se sienta como copia-pega entre secciones.
 *
 * Opacidades bajas (4-9% para círculos, 30% para dots) — son ambient,
 * no protagonistas.
 */
function SectionCircles({ variant }: { variant: string }) {
  const DOTS =
    "bg-[radial-gradient(circle,rgba(107,114,128,0.32)_1px,transparent_1px)] [background-size:14px_14px]";

  if (variant === "01") {
    return (
      <>
        {/* Parche de dots arriba-derecha */}
        <span
          aria-hidden="true"
          className={`absolute top-16 right-10 z-0 hidden h-40 w-40 md:block ${DOTS}`}
        />
        {/* Círculo verde superpuesto al parche */}
        <span
          aria-hidden="true"
          className="bg-verde-concepto/[0.08] absolute top-8 right-4 z-0 hidden h-32 w-32 rounded-full md:block"
        />
        {/* Círculo enorme alejado abajo-izquierda */}
        <span
          aria-hidden="true"
          className="bg-verde-concepto/[0.06] absolute -bottom-32 -left-40 z-0 h-[34rem] w-[34rem] rounded-full"
        />
      </>
    );
  }
  if (variant === "02") {
    return (
      <>
        {/* Parche de dots izquierda-medio */}
        <span
          aria-hidden="true"
          className={`absolute top-1/2 left-8 z-0 hidden h-40 w-40 -translate-y-1/2 md:block ${DOTS}`}
        />
        {/* Círculo verde superpuesto */}
        <span
          aria-hidden="true"
          className="bg-verde-concepto/[0.08] absolute top-1/2 -left-4 z-0 hidden h-36 w-36 -translate-y-1/2 rounded-full md:block"
        />
        {/* Círculo grande alejado arriba-derecha */}
        <span
          aria-hidden="true"
          className="bg-verde-concepto/[0.05] absolute -top-32 -right-48 z-0 h-[40rem] w-[40rem] rounded-full"
        />
        {/* Acento chico abajo-centro */}
        <span
          aria-hidden="true"
          className="bg-verde-concepto/[0.07] absolute right-1/3 bottom-12 z-0 h-20 w-20 rounded-full blur-[2px]"
        />
      </>
    );
  }
  // "03"
  return (
    <>
      {/* Parche de dots arriba-centro (más sutil — sección final) */}
      <span
        aria-hidden="true"
        className={`absolute top-20 right-1/3 z-0 hidden h-32 w-32 md:block ${DOTS}`}
      />
      {/* Círculo verde superpuesto */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/[0.08] absolute top-12 right-1/3 z-0 hidden h-28 w-28 -translate-x-6 -translate-y-2 rounded-full md:block"
      />
      {/* Círculo grande alejado abajo-izquierda */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/[0.06] absolute -bottom-40 -left-32 z-0 h-[36rem] w-[36rem] rounded-full"
      />
      {/* Acento chico derecha-medio */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/[0.05] absolute top-1/2 right-8 z-0 h-16 w-16 -translate-y-1/2 rounded-full blur-[2px]"
      />
    </>
  );
}
