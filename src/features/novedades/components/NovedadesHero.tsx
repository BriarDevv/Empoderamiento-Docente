"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PuntosFaro } from "@/components/ui/PuntosFaro";
import { SplitFlap } from "./SplitFlap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Hero de Novedades — ESPEJO del hero de Biblioteca. Misma firma de marca, y a
 * propósito: son las dos puertas de entrada al material de ED y tienen que
 * leerse como hermanas. Lo que se comparte, literal:
 *  - Patrón §6 vivo: puntos base tenues + el "haz del faro" que sigue al cursor
 *    y enciende los puntos a su paso (<PuntosFaro />, el mismo componente).
 *  - Glow superior de azul-claro contenido, para no lavar el titular.
 *  - Titular blanco con el remate en verde-concepto (DESIGN.md §6).
 *
 * Lo que se ESPEJA (y alcanza para que las dos páginas no se confundan):
 *  - El barrido del faro entra por la DERECHA (`desde="derecha"`), no por la
 *    izquierda.
 *  - La bola azul-medio entra por abajo-derecha, no por abajo-izquierda.
 *
 * Entrada — el mismo gesto de ~2.2s: el haz de PuntosFaro barre de derecha a
 * izquierda encendiendo los puntos; el titular sube desde su máscara cuando la
 * luz cruza el centro, el glow "queda prendido", la bola entra traída por el
 * barrido y bajada + tablero + pista rematan con el haz ya entregado al cursor.
 * Los tiempos están ACOPLADOS a las constantes del barrido en PuntosFaro
 * (delay 0.3 + 1.3s de recorrido → cruza el centro ≈ 0.95s). Como el barrido es
 * simétrico, invertir el sentido no corre ese cruce: los tiempos son los mismos
 * que en Biblioteca.
 *
 * El detalle propio de Novedades: el tablero split-flap con la última fecha,
 * que gira al cargar (energía de "algo que acaba de llegar").
 * Sin motion / prefers-reduced-motion: todo visible, sin barrido ni giro.
 */
export function NovedadesHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-nh-word]", { yPercent: 115 });
      gsap.set("[data-nh-glow]", { autoAlpha: 0 });
      // Espejo de Biblioteca: allá entra desde la izquierda (x: -170), acá
      // desde la derecha.
      gsap.set("[data-nh-bola]", { x: 170, y: 170 });
      gsap.set("[data-nh-rise]", { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-nh-word]", { yPercent: 0, duration: 1, stagger: 0.12 }, 0.75)
        .to("[data-nh-glow]", { autoAlpha: 1, duration: 1, ease: "power2.out" }, 1.0)
        .to("[data-nh-bola]", { x: 0, y: 0, duration: 1 }, 0.9)
        .to("[data-nh-rise]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.45);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative isolate flex min-h-[88svh] flex-col justify-between overflow-hidden rounded-b-[2rem] pt-28 pb-10 text-white md:rounded-b-[2.75rem] md:pt-32"
      aria-label="Novedades"
    >
      {/* Fondo: glow de faro contenido + forma plana (manual §6) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          data-nh-glow
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 42% at 50% 0%, color-mix(in srgb, var(--color-azul-claro) 24%, transparent), transparent 70%)",
          }}
        />
        <span
          data-nh-bola
          className="bg-azul-medio/25 absolute -right-36 -bottom-44 h-[26rem] w-[26rem] rounded-full"
        />
        {/* Puntos vivos: capa base + haz que sigue al cursor. El barrido entra
            por la DERECHA, espejando el de Biblioteca igual que la bola. */}
        <PuntosFaro desde="derecha" />
      </div>

      {/* Bloque central — centrado, como el hero de Biblioteca. */}
      <div className="mx-auto my-auto flex w-full max-w-screen-xl flex-col items-center px-5 text-center md:px-10">
        <h1
          className="font-display font-extrabold tracking-[-0.03em] text-white"
          style={{ fontSize: "clamp(2.75rem, 1.1rem + 7vw, 6.25rem)", lineHeight: 1 }}
        >
          {/* Visible en dos líneas enmascaradas; el sr-only evita que el lector
              las concatene sin espacio ("Siempre estápasando algo."). */}
          <span className="sr-only">Siempre está pasando algo.</span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span data-nh-word className="block">
              Siempre está
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span data-nh-word className="text-verde-concepto block">
              pasando algo.
            </span>
          </span>
        </h1>

        <p
          data-nh-rise
          className="mt-7 max-w-[54ch] font-sans text-[1.05rem] leading-relaxed text-white/85 md:text-[1.2rem]"
        >
          Publicaciones, encuentros, convocatorias y prensa. Seguí de cerca lo
          que investigamos, diseñamos y llevamos al aula.
        </p>

        {/* Tablero "en vivo": punto verde latiendo + última fecha que gira.
            Apilado (etiqueta arriba, fecha abajo) para que la FECHA quede
            centrada en sí misma y no corrida a la derecha, que es lo que pasa
            cuando etiqueta y fecha comparten un renglón centrado como bloque. */}
        <div
          data-nh-rise
          className="text-azul-claro/90 mt-10 flex flex-col items-center gap-2.5 font-mono text-[0.8rem] tracking-[0.18em] uppercase"
        >
          <span className="inline-flex items-center gap-3 whitespace-nowrap">
            <span className="bg-verde-concepto h-2 w-2 animate-pulse rounded-full" />
            Última actualización
          </span>
          <SplitFlap
            text="15·07·2026"
            charset="digits"
            trigger="mount"
            className="text-white"
          />
        </div>
      </div>

      {/* Pista de scroll al pie del hero. */}
      <div
        data-nh-rise
        className="mx-auto w-full max-w-screen-xl px-5 text-center md:px-10"
      >
        <span className="font-mono text-[0.72rem] tracking-[0.2em] text-white/45 uppercase">
          Scrolleá para ver lo último ↓
        </span>
      </div>
    </section>
  );
}
