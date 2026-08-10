"use client";

import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { RevealImage } from "@/components/ui/RevealImage";
import { ArrowUpRight } from "@/components/ui/icons";
import { ScrambleText } from "./ScrambleText";
import { NOVEDADES, CATEGORIA_LABEL, fechaCorta } from "../data";
import { useTilt } from "@/lib/hooks/useTilt";

/**
 * "Novedad destacada" — la nota de tapa. Sección clara. La imagen entra con el
 * wipe de máscara (<RevealImage />) y se inclina hacia el cursor (useTilt); la
 * categoría se "decodifica" (ScrambleText). Sin líneas ni gráficos.
 *
 * El CTA "Leer" NO es naranja (el naranja es solo para Contacto/acción, regla
 * dura del manual): es un link con flecha que baja al listado.
 */
export function NovedadDestacada() {
  const n = NOVEDADES.find((x) => x.destacada) ?? NOVEDADES[0];
  const tiltRef = useTilt<HTMLDivElement>({ max: 6, lift: 4 });

  return (
    <section className="bg-gris-fondo" aria-label="Novedad destacada">
      <div className="mx-auto grid w-full max-w-screen-xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-10 md:py-28">
        {/* Imagen: wipe + tilt (el tilt va en un wrapper para no pelear con el
            scale del RevealImage). */}
        <div ref={tiltRef} className="[transform-style:preserve-3d]">
          <RevealImage
            from="left"
            className="aspect-[4/3] w-full rounded-2xl shadow-[0_40px_80px_-40px_rgb(31_45_77/0.4)]"
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
        </div>

        {/* Texto */}
        <div>
          <Eyebrow>Novedad destacada</Eyebrow>

          <div className="mt-5 flex items-center gap-3 font-mono text-[0.72rem] tracking-[0.16em] uppercase">
            <ScrambleText
              text={CATEGORIA_LABEL[n.categoria]}
              className="text-verde-concepto-texto"
            />
            <span className="bg-gris-texto/40 h-1 w-1 rounded-full" />
            <span className="text-gris-texto">{fechaCorta(n.fecha)}</span>
          </div>

          <RevealLines
            as="h2"
            className="font-display text-azul-principal mt-4 max-w-[20ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.8rem, 1rem + 2.6vw, 3.2rem)", lineHeight: 1.08 }}
          >
            {n.titulo}
          </RevealLines>

          <p className="text-gris-texto mt-5 max-w-[52ch] font-sans text-[1.05rem] leading-relaxed">
            {n.bajada}
          </p>

          <Link
            href="#ultimas"
            className="group text-azul-principal mt-8 inline-flex items-center gap-2 font-sans text-[0.98rem] font-medium"
          >
            Leer la nota
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
