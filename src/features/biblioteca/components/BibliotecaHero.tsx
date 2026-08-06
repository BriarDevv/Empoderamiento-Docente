"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Search } from "@/components/ui/icons";
import { CategoriasRail } from "./CategoriasRail";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Hero de Biblioteca — "Publicaciones y recursos" (sitemap: apertura, ancla a
 * Materiales). Arquitectura de la referencia: una TARJETA redondeada gigante
 * a lo ancho de todo el viewport (solo el gutter chico de la sección), con el
 * contenido interno en el contenedor estándar del sitio (`max-w-screen-xl` +
 * `px-5/px-10`): el titular display centrado, la bajada, el buscador y un
 * riel de categorías en píldoras al pie. Traducida al branding ED:
 *  - Tarjeta en azul-principal (identidad institucional) con el patrón del
 *    manual §6: grilla de puntos blanca tenue + UNA forma plana azul-medio
 *    asomando del borde, y un glow superior de azul-claro (la luz del faro).
 *  - Titular blanco con "y recursos" en azul-claro (eco del logo negativo,
 *    donde "DOCENTE" va en azul-claro).
 *  - Buscador: única acción del bloque → botón naranja (naranja solo CTAs).
 *
 * Entrada: las dos líneas del titular suben desde su máscara, el sello de la
 * lámpara aparece con un giro corto, y bajada + buscador + riel suben con
 * fade escalonado. Sin motion / prefers-reduced-motion: todo visible.
 */
export function BibliotecaHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-bh-word]", { yPercent: 115 });
      gsap.set("[data-bh-rise]", { autoAlpha: 0, y: 24 });
      gsap.set("[data-bh-pill]", { autoAlpha: 0, x: 28 });

      const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power3.out" } });
      tl.to("[data-bh-word]", { yPercent: 0, duration: 1, stagger: 0.12 })
        .to("[data-bh-rise]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.55)
        .to("[data-bh-pill]", { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.05 }, 0.9);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="px-4 pt-24 pb-4 md:px-6 md:pt-28 md:pb-6"
      aria-label="Biblioteca — publicaciones y recursos"
    >
      <div className="bg-azul-principal relative isolate flex min-h-[82svh] w-full flex-col overflow-hidden rounded-[2rem] pt-16 pb-5 md:rounded-[2.75rem] md:pt-24 md:pb-7">
        {/* Fondo (manual §6): luz del faro + grilla de puntos + forma plana */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <span
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 0%, color-mix(in srgb, var(--color-azul-claro) 30%, transparent), transparent 72%)",
            }}
          />
          <span className="pattern-dots-inverse absolute inset-0 [mask-image:radial-gradient(85%_75%_at_50%_28%,#000,transparent)]" />
          <span className="bg-azul-medio/25 absolute -bottom-44 -left-36 h-[26rem] w-[26rem] rounded-full" />
        </div>

        {/* ── Titular + bajada + buscador (centrados) ────────────────────── */}
        <div className="mx-auto my-auto flex w-full max-w-screen-xl flex-col items-center px-5 pb-12 text-center md:px-10">
          <h1
            className="font-display font-extrabold tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2.75rem, 1.1rem + 7vw, 6.25rem)", lineHeight: 1 }}
          >
            {/* Visible en dos líneas enmascaradas; el sr-only evita que el
                lector las concatene sin espacio ("Publicacionesy recursos"). */}
            <span className="sr-only">Publicaciones y recursos</span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <span data-bh-word className="block">
                Publicaciones
              </span>
            </span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <span data-bh-word className="text-azul-claro block">
                y recursos
              </span>
            </span>
          </h1>

          <p
            data-bh-rise
            className="mt-6 max-w-[46ch] font-sans text-[1.02rem] leading-relaxed text-white/85 md:text-[1.15rem]"
          >
            Materiales de investigación y recursos pedagógicos, abiertos y
            listos para llevar al aula.
          </p>

          {/* Buscador — por ahora ancla al futuro listado (#materiales);
              cuando exista el catálogo, pasa a filtrarlo de verdad. */}
          <form
            data-bh-rise
            role="search"
            className="focus-within:ring-azul-claro/70 mt-9 flex w-full max-w-xl items-stretch gap-1.5 rounded-xl bg-white p-1.5 shadow-[0_24px_60px_-24px_rgb(0_0_0_/_0.45)] focus-within:ring-2"
            onSubmit={(e) => {
              e.preventDefault();
              document
                .getElementById("materiales")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <label htmlFor="biblioteca-buscar" className="sr-only">
              Buscar publicaciones y recursos
            </label>
            <input
              id="biblioteca-buscar"
              type="search"
              placeholder="Buscá por título, tema o autora…"
              className="text-azul-principal placeholder:text-gris-texto min-w-0 flex-1 bg-transparent px-3.5 font-sans text-[0.98rem] outline-none"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="bg-naranja-accion flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-90"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* ── Riel de categorías al pie de la tarjeta ────────────────────── */}
        <div data-bh-rise className="mx-auto w-full max-w-screen-xl px-5 md:px-10">
          <CategoriasRail />
        </div>
      </div>
    </section>
  );
}
