/**
 * Panel "¿Quiénes somos?": texto OFICIAL del cliente (VERBATIM) a la IZQUIERDA y
 * una imagen a la DERECHA [[ed-copy-oficial]]. La Misión es el espejo (texto
 * derecha / imagen izquierda). El barrido verde lo "borra" y revela la Misión en
 * el mismo lugar — lo orquesta HeroQuienes.
 * NO parafrasear. Respeta prefers-reduced-motion (capas apiladas, sin animación).
 */
import Image from "next/image";
import { ScrollFillText, type FillSeg } from "./ScrollFillText";

// Acentos en AZUL: marca + conceptos clave; el resto se rellena en verde.
const QS_SEGMENTS: FillSeg[] = [
  { t: "Empoderamiento Docente", accent: true },
  {
    t: "es una consultora en educación, especializada en Matemáticas, que diseña e implementa intervenciones educativas que propicien la",
  },
  { t: "transformación escolar.", accent: true },
  { t: "Creemos en la singularidad. Nos enorgullece ser" },
  {
    t: "artesanas de soluciones, arquitectas de sueños y diseñadoras de posibilidades.",
    accent: true,
  },
  { t: "Sabemos que cada desafío es único y merece una atención personalizada." },
];

export function Manifiesto() {
  return (
    <section
      className="relative flex h-full w-full items-center overflow-hidden py-16 motion-reduce:h-auto motion-reduce:py-24"
      aria-label="Quiénes somos"
    >
      <div
        data-wipe-bounds
        className="mx-auto grid w-full max-w-[88rem] grid-cols-1 items-start gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-16"
      >
        {/* Texto (izquierda) — eyebrow arriba (absoluto) y párrafo centrado al
            medio del alto de la foto: la columna se estira al alto de la fila. */}
        <div className="relative flex items-center self-stretch text-left">
          <span className="absolute top-0 left-0 inline-flex items-center gap-3">
            <span aria-hidden="true" className="bg-verde-concepto block h-px w-8" />
            <span className="font-mono text-gris-texto text-[0.78rem] font-medium tracking-[0.22em] uppercase">
              Quiénes somos
            </span>
          </span>

          {/* Quiénes somos (verbatim) — se rellena con el scroll: verde base,
              acentos en azul (ver QS_SEGMENTS). */}
          <ScrollFillText
            segments={QS_SEGMENTS}
            className="font-display text-verde-concepto text-balance font-semibold leading-[1.3] tracking-[-0.01em]"
            style={{ fontSize: "clamp(1.25rem, 1.7vw, 1.7rem)" }}
          />
        </div>

        {/* Imagen (derecha) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(15,32,64,0.4)] lg:aspect-[5/4]">
          <Image
            src="/hero/hero-3.jpg"
            alt="Equipo de Empoderamiento Docente en un encuentro de trabajo"
            fill
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
