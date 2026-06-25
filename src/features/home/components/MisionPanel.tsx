/**
 * Panel "Misión": espejo de "¿Quiénes somos?" — imagen a la IZQUIERDA y el texto
 * OFICIAL del cliente (VERBATIM) a la DERECHA [[ed-copy-oficial]]. Lo revela el
 * barrido verde (lo orquesta HeroQuienes). NO parafrasear. Respeta reduced-motion.
 */
import Image from "next/image";
import { ScrollFillText, type FillSeg } from "./ScrollFillText";

// Acentos en AZUL: conceptos clave de la misión; el resto se rellena en verde.
const MISION_SEGMENTS: FillSeg[] = [
  { t: "Que las y los participantes de nuestros encuentros vivan un proceso de" },
  { t: "empoderamiento,", accent: true },
  { t: "reconocido como" },
  { t: "cambio de relación con el saber matemático escolar,", accent: true },
  {
    t: "a través de estrategias basadas en la investigación y la teoría educativa, para promover la",
  },
  { t: "transformación y mejora educativa.", accent: true },
];

export function MisionPanel() {
  return (
    <section
      className="relative flex h-full w-full items-center overflow-hidden py-16 motion-reduce:h-auto motion-reduce:py-24"
      aria-label="Misión"
    >
      <div className="mx-auto grid w-full max-w-[88rem] grid-cols-1 items-start gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-16">
        {/* Imagen (izquierda) — en mobile va debajo del texto */}
        <div className="relative order-last aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(15,32,64,0.4)] lg:order-first lg:aspect-[5/4]">
          <Image
            src="/hero/hero-6.jpg"
            alt="Docentes participando de una propuesta de Empoderamiento Docente"
            fill
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="object-cover"
          />
        </div>

        {/* Texto (derecha) — eyebrow arriba (absoluto) y párrafo centrado al
            medio del alto de la foto: la columna se estira al alto de la fila. */}
        <div className="relative flex items-center self-stretch text-left">
          <span className="absolute top-0 left-0 inline-flex items-center gap-3">
            <span aria-hidden="true" className="bg-verde-concepto block h-px w-8" />
            <span className="font-mono text-gris-texto text-[0.78rem] font-medium tracking-[0.22em] uppercase">
              Misión
            </span>
          </span>

          {/* Misión (verbatim) — se rellena con el scroll: verde base, acentos
              en azul (ver MISION_SEGMENTS). */}
          <ScrollFillText
            segments={MISION_SEGMENTS}
            className="font-display text-verde-concepto text-balance font-semibold leading-[1.3] tracking-[-0.01em]"
            style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.7rem)" }}
          />
        </div>
      </div>
    </section>
  );
}
