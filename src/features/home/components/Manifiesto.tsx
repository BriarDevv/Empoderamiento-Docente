/**
 * Panel "¿Quiénes somos?": TÍTULO de sección + cuerpo OFICIAL del cliente
 * (VERBATIM) a la IZQUIERDA y una imagen a la DERECHA [[ed-copy-oficial]]. El
 * título da la jerarquía; el cuerpo (más chico) se rellena con el scroll. La
 * Misión es el espejo (texto derecha / imagen izquierda). El barrido verde lo
 * "borra" y revela la Misión en el mismo lugar — lo orquesta HeroQuienes.
 * NO parafrasear. Respeta prefers-reduced-motion (capas apiladas, sin animación).
 */
import Image from "next/image";
import { ScrollFillText, type FillSeg } from "./ScrollFillText";

// Acentos en AZUL: marca + conceptos clave; el resto se rellena en verde.
// Verbatim del cliente, dividido en dos párrafos (qué somos / cómo lo somos)
// para que el cuerpo respire — no es el título [[ed-copy-oficial]].
const QS_PARAGRAPHS: FillSeg[][] = [
  [
    { t: "Empoderamiento Docente", accent: true },
    {
      t: "es una consultora en educación, especializada en Matemáticas, que diseña e implementa intervenciones educativas que propicien la",
    },
    { t: "transformación escolar.", accent: true },
  ],
  [
    { t: "Creemos en la singularidad. Nos enorgullece ser" },
    {
      t: "artesanas de soluciones, arquitectas de sueños y diseñadoras de posibilidades.",
      accent: true,
    },
    {
      t: "Sabemos que cada desafío es único y merece una atención personalizada.",
    },
  ],
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
        {/* Texto (izquierda) — TÍTULO arriba + cuerpo debajo, centrados al medio
            del alto de la foto: la columna se estira al alto de la fila. */}
        <div className="relative flex flex-col justify-center self-stretch gap-5 text-left md:gap-6">
          <div>
            <span
              aria-hidden="true"
              className="bg-verde-concepto mb-4 block h-px w-10"
            />
            <h2 className="font-display text-azul-principal font-bold leading-[1.04] tracking-[-0.02em] [font-size:clamp(2rem,3.2vw,3.1rem)]">
              ¿Quiénes somos?
            </h2>
          </div>

          {/* Cuerpo (verbatim) — se rellena con el scroll: verde base, acentos
              en azul (ver QS_PARAGRAPHS). */}
          <ScrollFillText
            paragraphs={QS_PARAGRAPHS}
            className="font-sans text-verde-concepto font-medium leading-relaxed [font-size:clamp(1rem,1.1vw,1.15rem)]"
          />
        </div>

        {/* Imagen (derecha) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-28px_rgba(15,32,64,0.4)] lg:aspect-[5/4]">
          <Image
            src="/hero/hero-3.webp"
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
