"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealLines } from "@/components/ui/RevealLines";
import {
  NOVEDADES,
  CATEGORIAS,
  CATEGORIA_LABEL,
  fechaCorta,
  type CategoriaKey,
  type Novedad,
} from "../data";
import { useTilt } from "@/lib/hooks/useTilt";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Filtro = "todas" | CategoriaKey;

/** Card de novedad — se inclina hacia el cursor (useTilt) y la foto respira. */
function NovedadCard({ n }: { n: Novedad }) {
  const ref = useTilt<HTMLElement>({ max: 7, lift: 5 });
  return (
    <article
      ref={ref}
      data-card
      data-id={n.id}
      data-cat={n.categoria}
      className="border-azul-principal/8 group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgb(31_45_77/0.04),0_18px_40px_-20px_rgb(31_45_77/0.14)] will-change-transform"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={n.imagen}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
          <span className="text-verde-concepto-texto">
            {CATEGORIA_LABEL[n.categoria]}
          </span>
          <span className="bg-gris-texto/40 h-1 w-1 rounded-full" />
          <span className="text-gris-texto">{fechaCorta(n.fecha)}</span>
        </div>
        <h3 className="font-display text-azul-principal mt-3 text-[1.15rem] leading-snug font-bold">
          {n.titulo}
        </h3>
        <p className="text-gris-texto mt-2 line-clamp-2 font-sans text-[0.92rem] leading-relaxed">
          {n.bajada}
        </p>
      </div>
    </article>
  );
}

/**
 * "Filtros por categoría" + "Últimas novedades" del sitemap, resueltos como una
 * sola unidad interactiva. Los chips filtran DE VERDAD y la grilla se reacomoda
 * con FLIP real: se mide la posición de cada card antes y después del filtro y
 * se anima el delta (las que quedan vuelan a su lugar; las nuevas aparecen). El
 * filtrado se hace imperativo sobre el DOM para no pelear con React.
 *
 * Sin motion: el filtro igual funciona (toggle de display), sin animación.
 */
export function FiltrosNovedades() {
  const [activa, setActiva] = useState<Filtro>("todas");
  const gridRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  // Entrada en cascada al entrar al viewport.
  useIsomorphicLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-card]", {
        autoAlpha: 0,
        y: 28,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: grid, start: "top 80%" },
      });
    }, grid);
    return () => ctx.revert();
  }, [reduced]);

  const filtrar = (next: Filtro) => {
    setActiva(next);
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-card]"));

    // FIRST: posición y visibilidad previas.
    const first = new Map(
      cards.map((c) => [
        c,
        { rect: c.getBoundingClientRect(), vis: c.style.display !== "none" },
      ]),
    );

    // Mutar: mostrar/ocultar según el filtro.
    cards.forEach((c) => {
      const match = next === "todas" || c.dataset.cat === next;
      c.style.display = match ? "" : "none";
    });

    if (reduced) return;

    // LAST + PLAY: las que siguen visibles vuelan del rect viejo al nuevo; las
    // que reaparecen entran con fade/scale.
    let enterIdx = 0;
    cards.forEach((c) => {
      if (c.style.display === "none") return;
      const info = first.get(c);
      const last = c.getBoundingClientRect();
      if (info?.vis) {
        const dx = info.rect.left - last.left;
        const dy = info.rect.top - last.top;
        if (dx || dy) {
          gsap.fromTo(
            c,
            { x: dx, y: dy },
            { x: 0, y: 0, duration: 0.5, ease: "power3.out" },
          );
        }
      } else {
        gsap.fromTo(
          c,
          { autoAlpha: 0, scale: 0.92, y: 12 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            delay: enterIdx * 0.04,
          },
        );
        enterIdx++;
      }
    });
  };

  const chips: Filtro[] = ["todas", ...CATEGORIAS.map((c) => c.key)];

  return (
    <section id="ultimas" className="bg-gris-fondo" aria-label="Últimas novedades">
      <div className="mx-auto w-full max-w-screen-xl px-5 pt-6 pb-24 md:px-10 md:pb-28">
        {/* Sin max-w: los `ch` del wrapper se resolvían contra los 16px del
            body (~368px), no contra el tamaño del titular, y lo partían en dos. */}
        <div>
          <RevealLines
            as="h2"
            className="font-display text-azul-principal font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 1rem + 2.6vw, 3.2rem)", lineHeight: 1.08 }}
          >
            Lo que viene pasando.
          </RevealLines>
        </div>

        {/* Chips de filtro */}
        <div
          className="mt-8 flex flex-wrap gap-2.5"
          role="group"
          aria-label="Filtrar por categoría"
        >
          {chips.map((key) => {
            const label = key === "todas" ? "Todas" : CATEGORIA_LABEL[key];
            const on = activa === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => filtrar(key)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-2 font-mono text-[0.72rem] tracking-[0.1em] uppercase transition-colors ${
                  on
                    ? "border-verde-concepto bg-verde-concepto text-white"
                    : "border-azul-principal/15 text-gris-texto hover:border-verde-concepto/50 hover:text-azul-principal"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Grilla — todas las cards viven siempre; el filtro es imperativo. */}
        <div
          ref={gridRef}
          className="mt-8 grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3"
        >
          {NOVEDADES.map((n) => (
            <NovedadCard key={n.id} n={n} />
          ))}
        </div>
      </div>
    </section>
  );
}
