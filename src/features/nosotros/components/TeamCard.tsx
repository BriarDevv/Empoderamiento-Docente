"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { TeamMember } from "../types/team";
import { MonogramAvatar } from "./MonogramAvatar";

type Size = "large" | "medium" | "small";

interface TeamCardProps {
  member: TeamMember;
  size: Size;
  index: number;
  onOpen: (member: TeamMember, photoEl: HTMLElement) => void;
}

const NAME_SIZE: Record<Size, string> = {
  large: "text-h3",
  medium: "text-h3",
  small: "text-[1.05rem]",
};

/**
 * Card de persona del equipo. Al hover: foto pasa de grayscale a color +
 * scale 1.04 + underline verde aparece en el nombre + CTA "Leer semblanza"
 * fade-in. Al click: dispara morph del modal.
 *
 * Timings y easings alineados con DESIGN.md §9 (movimiento contenido).
 */
export function TeamCard({ member, size, index, onOpen }: TeamCardProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (
      !photoInnerRef.current ||
      !underlineRef.current ||
      !ctaRef.current ||
      !rootRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power2.out" } })
        .to(photoInnerRef.current, { scale: 1.04, duration: 0.6 }, 0)
        .to(
          underlineRef.current,
          { scaleX: 1, duration: 0.55, ease: "power3.inOut" },
          0,
        )
        .to(ctaRef.current, { opacity: 1, x: 0, duration: 0.4 }, 0.05);

      if (colorRef.current) {
        tl.to(colorRef.current, { opacity: 1, duration: 0.55 }, 0);
      }

      hoverTl.current = tl;
    }, rootRef);

    return () => {
      ctx.revert();
      hoverTl.current = null;
    };
  }, [reducedMotion]);

  const handleClick = () => {
    const el = photoWrapperRef.current;
    if (el) onOpen(member, el);
  };

  return (
    <button
      ref={rootRef}
      onClick={handleClick}
      onMouseEnter={() => hoverTl.current?.play()}
      onMouseLeave={() => hoverTl.current?.reverse()}
      className="group focus-visible:ring-azul-medio block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      aria-label={`Abrir detalle de ${member.name}`}
    >
      <div
        ref={photoWrapperRef}
        className="bg-azul-principal relative mb-4 aspect-[4/5] overflow-hidden"
      >
        {/* Capa base: grayscale (o monogram si no hay foto). */}
        <div
          ref={photoInnerRef}
          className="absolute inset-0 will-change-transform"
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={`Retrato de ${member.name}`}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover contrast-[1.05] grayscale"
              draggable={false}
            />
          ) : (
            <MonogramAvatar name={member.name} className="h-full w-full" />
          )}
        </div>

        {/* Capa color: aparece en hover. */}
        {member.photo && (
          <div
            ref={colorRef}
            className="pointer-events-none absolute inset-0"
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            <Image
              src={member.photo}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover"
              draggable={false}
            />
          </div>
        )}

        {/* Index tick — verde, arriba izquierda. */}
        <span
          className="bg-verde-concepto absolute top-3 left-3 px-2 py-0.5 font-sans text-[10px] font-medium tracking-[0.22em] text-white uppercase"
          aria-hidden="true"
        >
          N°{String(index).padStart(2, "0")}
        </span>

        {/* Country badge — blanco, abajo derecha, siempre legible. */}
        <span className="text-azul-principal absolute right-3 bottom-3 bg-white/95 px-2 py-1 font-sans text-[10px] font-medium tracking-[0.22em] backdrop-blur-sm">
          {member.countryCode}
        </span>
      </div>

      <div className="space-y-1.5">
        <h3
          className={`font-display text-azul-principal relative inline-block leading-[1.1] font-bold ${NAME_SIZE[size]}`}
          style={{ letterSpacing: "-0.012em" }}
        >
          {member.name}
          <span
            ref={underlineRef}
            className="bg-verde-concepto absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left"
            style={{ transform: "scaleX(0)" }}
            aria-hidden="true"
          />
        </h3>

        <p className="text-gris-texto font-sans text-[12px] leading-snug font-medium tracking-[0.14em] uppercase">
          {member.role}
        </p>

        <div className="text-azul-medio flex items-center gap-2 pt-1.5">
          <span
            ref={ctaRef}
            className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase"
            style={{ opacity: 0, transform: "translateX(-6px)" }}
          >
            Leer semblanza
          </span>
          <svg
            viewBox="0 0 24 12"
            className="h-2.5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 6H22M22 6L17 1M22 6L17 11"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
