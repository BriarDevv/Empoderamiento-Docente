"use client";

import Image from "next/image";
import Link from "next/link";
import { RevealLines } from "@/components/ui/RevealLines";
import { RevealImage } from "@/components/ui/RevealImage";
import { ArrowUpRight } from "@/components/ui/icons";
import { ScrambleText } from "./ScrambleText";
import { NOVEDADES, CATEGORIA_LABEL, fechaCorta } from "../data";

/**
 * "Novedad destacada" — la nota de tapa. Sección clara.
 *
 * Es UNA SOLA PIEZA: foto y texto comparten contenedor, pegados, sin gap ni
 * radio en el encuentro. El radio y el borde viven en el <article>, y su
 * overflow-hidden es lo que recorta las esquinas exteriores de la foto — por
 * eso la foto no lleva rounded propio. Antes eran dos objetos sueltos sobre el
 * gris (una foto sólida y un texto flotando) y no pesaban igual.
 *
 * La imagen entra con el wipe de máscara (<RevealImage />) y la categoría se
 * "decodifica" (ScrambleText). Sin tilt: inclinar la foto despegaría el borde
 * que ahora tiene que quedar a ras del blanco.
 *
 * El CTA "Leer" NO es naranja (el naranja es solo para Contacto/acción, regla
 * dura del manual): es un link con flecha que baja al listado.
 */
export function NovedadDestacada() {
  const n = NOVEDADES.find((x) => x.destacada) ?? NOVEDADES[0];

  return (
    <section className="bg-gris-fondo" aria-label="Novedad destacada">
      <div className="mx-auto w-full max-w-screen-xl px-5 py-20 md:px-10 md:py-28">
        <article className="border-azul-claro/40 grid overflow-hidden rounded-2xl border bg-white shadow-[0_30px_70px_-45px_rgb(31_45_77/0.45)] md:grid-cols-2">
          {/* Foto a sangre contra el borde izquierdo del contenedor. */}
          <RevealImage
            from="left"
            className="aspect-[4/3] w-full md:aspect-auto md:h-full"
          >
            <div className="relative h-full w-full">
              <Image
                src={n.imagen}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </RevealImage>

          {/* Texto: arranca pegado a la foto, con su aire por dentro. */}
          <div className="flex flex-col justify-center p-7 md:p-11">
            <div className="flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.16em] uppercase">
              <ScrambleText
                text={CATEGORIA_LABEL[n.categoria]}
                className="text-verde-concepto-texto"
              />
              <span className="bg-gris-texto/40 h-1 w-1 rounded-full" />
              <span className="text-gris-texto">{fechaCorta(n.fecha)}</span>
            </div>

            <RevealLines
              as="h2"
              // El tope baja de 3.2rem a 2.5rem: con palabras como
              // "Socioepistemología" cualquier redacción rompía en 4 renglones.
              className="font-display text-azul-principal mt-4 font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.7rem, 1rem + 1.9vw, 2.5rem)", lineHeight: 1.1 }}
            >
              {n.titulo}
            </RevealLines>

            <p className="text-gris-texto mt-5 max-w-[52ch] font-sans text-[1.05rem] leading-relaxed">
              {n.bajada}
            </p>

            <Link
              href="#ultimas"
              className="group text-azul-principal mt-8 inline-flex w-fit items-center gap-2 font-sans text-[0.98rem] font-medium"
            >
              Leer la nota
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
