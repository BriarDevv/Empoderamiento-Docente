"use client";

import { useState } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitFlap } from "./SplitFlap";
import {
  NOVEDADES,
  ARCHIVO_ANIOS,
  anioDe,
  CATEGORIA_LABEL,
  fechaCorta,
} from "../data";

/**
 * "Archivo por año" — índice. El año elegido se muestra GIGANTE y gira con el
 * split-flap cada vez que cambia (números, no líneas). Al lado, las novedades
 * de ese año. Elegir un año re-monta el tablero (key={anio}) y vuelve a girar.
 */
export function ArchivoPorAnio() {
  const [anio, setAnio] = useState<number>(ARCHIVO_ANIOS[0]);
  const items = NOVEDADES.filter((n) => anioDe(n.fecha) === anio);

  return (
    <section className="bg-gris-fondo" aria-label="Archivo por año">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-28">
        <Eyebrow>Archivo</Eyebrow>

        <div className="mt-8 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
          {/* Año gigante que gira */}
          <div>
            <SplitFlap
              key={anio}
              as="div"
              text={String(anio)}
              charset="digits"
              trigger="mount"
              cycles={16}
              className="font-display text-azul-principal leading-none font-extrabold tracking-[-0.04em]"
              style={{ fontSize: "clamp(5rem, 3rem + 12vw, 12rem)" }}
            />
            <p className="text-gris-texto mt-4 font-mono text-[0.8rem] tracking-[0.16em] uppercase">
              {items.length > 0
                ? `${items.length} novedad${items.length > 1 ? "es" : ""}`
                : "Pronto"}
            </p>

            {/* Selector de años */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {ARCHIVO_ANIOS.map((y) => {
                const on = y === anio;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setAnio(y)}
                    aria-pressed={on}
                    className={`rounded-full border px-4 py-2 font-mono text-[0.82rem] tracking-[0.06em] transition-colors ${
                      on
                        ? "border-verde-concepto bg-verde-concepto text-white"
                        : "border-azul-principal/15 text-gris-texto hover:border-verde-concepto/50 hover:text-azul-principal"
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listado del año elegido — filas con highlight al hover, sin reglas. */}
          <div>
            {items.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href="#ultimas"
                      className="group hover:bg-azul-principal/[0.04] -mx-3 flex flex-col gap-1 rounded-xl px-3 py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between"
                    >
                      <span className="font-display text-azul-principal group-hover:text-verde-concepto-texto text-[1.05rem] font-semibold transition-colors">
                        {n.titulo}
                      </span>
                      <span className="text-gris-texto shrink-0 font-mono text-[0.68rem] tracking-[0.12em] uppercase">
                        {CATEGORIA_LABEL[n.categoria]} · {fechaCorta(n.fecha)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gris-texto max-w-[38ch] font-sans leading-relaxed">
                Estamos cargando el archivo de este año. Volvé pronto: la
                biblioteca y las novedades siguen creciendo.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
