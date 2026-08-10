"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ArrowUpRight } from "@/components/ui/icons";
import { LANZAMIENTOS } from "../data";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * "Lanzamientos y recursos recientes" — puente a Biblioteca. Riel horizontal
 * que se arrastra con inercia (drag + momentum) en desktop; en touch va el
 * scroll nativo (que ya trae su propia inercia). Sin líneas ni gráficos: pura
 * física de arrastre. La última tarjeta es el CTA a Biblioteca.
 */
export function LanzamientosRecientes() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const st = useRef({ down: false, startX: 0, startScroll: 0, vx: 0, lastX: 0, raf: 0 });

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return; // touch → scroll nativo
    const el = trackRef.current;
    if (!el) return;
    cancelAnimationFrame(st.current.raf);
    Object.assign(st.current, {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      lastX: e.clientX,
      vx: 0,
    });
    el.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = st.current;
    const el = trackRef.current;
    if (!s.down || !el) return;
    el.scrollLeft = s.startScroll - (e.clientX - s.startX);
    s.vx = e.clientX - s.lastX;
    s.lastX = e.clientX;
  };

  const onUp = () => {
    const s = st.current;
    const el = trackRef.current;
    if (!s.down || !el) return;
    s.down = false;
    if (reduced) return;
    let v = s.vx;
    const decay = () => {
      v *= 0.92;
      el.scrollLeft -= v;
      if (Math.abs(v) > 0.4) s.raf = requestAnimationFrame(decay);
    };
    s.raf = requestAnimationFrame(decay);
  };

  return (
    <section className="bg-gris-fondo" aria-label="Lanzamientos y recursos recientes">
      <div className="mx-auto w-full max-w-screen-xl px-5 pt-6 md:px-10">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-[42ch]">
            <Eyebrow>Lanzamientos y recursos recientes</Eyebrow>
            <RevealLines
              as="h2"
              className="font-display text-azul-principal mt-5 font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.7rem, 1rem + 2.4vw, 3rem)", lineHeight: 1.08 }}
            >
              Recién salido, listo para el aula.
            </RevealLines>
          </div>
          <Link
            href="/biblioteca"
            className="group text-azul-principal hover:text-verde-concepto-texto mb-2 hidden shrink-0 items-center gap-2 font-sans text-[0.95rem] font-medium transition-colors md:inline-flex"
          >
            Ir a Biblioteca
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Riel arrastrable */}
      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        className="scrollbar-none mt-8 flex gap-5 overflow-x-auto px-5 pb-20 select-none md:cursor-grab md:px-10"
      >
        {LANZAMIENTOS.map((l) => (
          <article
            key={l.id}
            className="group relative aspect-[3/4] w-[76vw] shrink-0 overflow-hidden rounded-2xl sm:w-[42vw] lg:w-[23rem]"
          >
            <Image
              src={l.imagen}
              alt=""
              fill
              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 42vw, 368px"
              draggable={false}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="from-azul-principal/90 via-azul-principal/10 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <span className="text-azul-claro font-mono text-[0.66rem] tracking-[0.14em] uppercase">
                {l.tipo}
              </span>
              <h3 className="font-display mt-1.5 text-[1.15rem] leading-snug font-bold">
                {l.titulo}
              </h3>
            </div>
          </article>
        ))}

        {/* CTA final del riel */}
        <Link
          href="/biblioteca"
          className="group border-azul-principal/15 hover:border-verde-concepto/50 flex aspect-[3/4] w-[60vw] shrink-0 flex-col items-start justify-end rounded-2xl border bg-white p-6 transition-colors sm:w-[32vw] lg:w-[17rem]"
        >
          <span className="bg-verde-concepto/10 text-verde-concepto-texto mb-4 flex h-11 w-11 items-center justify-center rounded-xl">
            <ArrowUpRight size={22} />
          </span>
          <h3 className="font-display text-azul-principal text-[1.2rem] leading-snug font-bold">
            Toda la biblioteca
          </h3>
          <p className="text-gris-texto mt-2 font-sans text-[0.9rem] leading-relaxed">
            Publicaciones, materiales y proyectos, abiertos para llevar al aula.
          </p>
        </Link>
      </div>
    </section>
  );
}
