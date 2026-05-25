import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";

/**
 * Manifesto editorial centered — bloque "Lo que somos" como pull-quote
 * tipográfico premium. Tagline oficial del PDF de ED:
 * "Artesanas de soluciones, arquitectas de sueños y diseñadoras de
 *  posibilidades."
 *
 * Femenino genérico en el tagline = decisión de marca del PDF, no
 * descuido del lenguaje inclusivo.
 *
 * Va inmediatamente después del PageHeader (navy). El cambio visual
 * brusco (navy → white) abre un "momento" propio antes de la filosofía.
 */
export function ManifestoSection() {
  return (
    <section
      data-section="manifesto"
      className="bg-gris-fondo relative overflow-hidden py-24 md:py-36"
    >
      {/* Decoración: parche de dots arriba derecha (eco del manual §6) */}
      <span
        aria-hidden="true"
        className="absolute top-16 right-10 hidden h-32 w-32 bg-[radial-gradient(circle,var(--pattern-dot-blue)_1px,transparent_1px)] [background-size:14px_14px] opacity-60 md:block"
      />

      {/* Decoración: círculo verde sutil abajo izquierda */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/12 absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-[2px]"
      />

      <div className="relative mx-auto max-w-screen-xl px-5 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center">
            <Eyebrow dashClass="w-14">Lo que somos</Eyebrow>
          </div>

          {/* Comilla tipográfica gigante decorativa */}
          <span
            aria-hidden="true"
            className="font-display text-verde-concepto/30 mt-7 block leading-none"
            style={{ fontSize: "clamp(4rem, 9vw, 7rem)" }}
          >
            &ldquo;
          </span>

          {/* Tagline editorial — el pull-quote dominante de la sección */}
          <p
            className="font-display text-azul-principal -mt-4 font-bold tracking-[-0.022em]"
            style={{
              fontSize: "clamp(1.85rem, 4.5vw, 3.4rem)",
              lineHeight: "1.08",
            }}
          >
            Artesanas de soluciones, arquitectas de sueños y diseñadoras de{" "}
            <Highlight>posibilidades</Highlight>.
          </p>

          <p className="text-gris-texto mx-auto mt-10 max-w-2xl font-sans text-[1.05rem] leading-relaxed md:text-[1.12rem]">
            Creemos en la singularidad. Sabemos que cada desafío es único y
            merece una atención personalizada. Cada proyecto que emprendemos es
            una historia en sí mismo, tejida con los hilos de tu visión y
            nuestras habilidades.
          </p>

          {/* Cita atribución sutil */}
          <p className="text-azul-principal/50 mt-8 font-sans text-[0.72rem] font-medium tracking-[0.26em] uppercase">
            Empoderamiento Docente
          </p>
        </div>
      </div>
    </section>
  );
}
