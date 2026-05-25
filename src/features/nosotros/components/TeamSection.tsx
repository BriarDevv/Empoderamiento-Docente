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

      {/* Header editorial — jerarquía: eyebrow "Capítulo NN" / título / línea / subtítulo */}
      <header className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        <span className="text-gris-texto inline-flex items-center gap-3 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase">
          <span
            aria-hidden="true"
            className="bg-verde-concepto block h-px w-10"
          />
          Capítulo <span className="text-verde-concepto">{number}</span>
        </span>
        <h2 className="font-display text-azul-principal mt-5 max-w-2xl text-[clamp(2rem,3.8vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.015em]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gris-texto mt-4 max-w-xl font-sans text-[0.98rem] leading-relaxed md:text-[1.02rem]">
            {subtitle}
          </p>
        )}
      </header>

      {/* Grid de cards — items-start alinea las cards al top de cada fila
          (no se centran si tienen contenido de altura distinta). */}
      <div className="relative z-10 mx-auto mt-12 max-w-screen-xl px-5 md:mt-16 md:px-10">
        <div
          ref={gridRef}
          className={`grid items-start ${GRID[variant]} ${GAP[variant]} ${GRID_MAX[variant]} mx-auto`}
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
/**
 * Composición canónica del manual §6: parche de dots azul-medio
 * (.pattern-dots) + círculo verde sólido asomando por el borde.
 * Cada capítulo varía la esquina para no repetir composición.
 */
function SectionCircles({ variant }: { variant: string }) {
  if (variant === "01") {
    return (
      <>
        <span
          aria-hidden="true"
          className="pattern-dots absolute top-16 right-28 z-0 hidden h-40 w-40 md:block"
        />
        <span
          aria-hidden="true"
          className="bg-verde-concepto absolute top-24 -right-12 z-0 hidden h-44 w-44 rounded-full md:block"
        />
      </>
    );
  }
  if (variant === "02") {
    return (
      <>
        <span
          aria-hidden="true"
          className="pattern-dots absolute top-1/2 left-28 z-0 hidden h-40 w-40 -translate-y-1/2 md:block"
        />
        <span
          aria-hidden="true"
          className="bg-verde-concepto absolute top-1/2 -left-16 z-0 hidden h-52 w-52 -translate-y-1/2 rounded-full md:block"
        />
      </>
    );
  }
  // "03"
  return (
    <>
      <span
        aria-hidden="true"
        className="pattern-dots absolute right-28 bottom-20 z-0 hidden h-36 w-36 md:block"
      />
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute -right-12 -bottom-12 z-0 hidden h-44 w-44 rounded-full md:block"
      />
    </>
  );
}
