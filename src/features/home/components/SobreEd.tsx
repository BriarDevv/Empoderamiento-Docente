import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { ArrowRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

const principios = [
  "Centrados en aprender, más que en enseñar",
  "Sostenemos un vínculo continuo con la comunidad docente",
  "Base científica en Matemática Educativa",
] as const;

const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/**
 * SobreEd — sección 3 del home (#sobre-ed). Versión compacta editorial.
 *
 * Estructura en 2 bloques (sin divisor):
 * 1. Top hero centered — eyebrow + pull-quote "Vivir para hacer vivir"
 *    como statement dominante, sin TextReveal (texto plano, animación
 *    sutil via container) + atribución FASE EXPERIENCIAL.
 * 2. Split 6/6 balanceado — identidad institucional (H2 + drop cap)
 *    a la izquierda + fundamentos académicos (base epistemológica +
 *    principios) a la derecha + CTA centered al pie.
 *
 * Sin TextReveal en el pull-quote (versión anterior tenía bug donde el
 * scrollTrigger no disparaba con Lenis + cambio de layout, dejando las
 * palabras ocultas para siempre). El texto plano + fade-in del container
 * cumple el mismo rol sin el riesgo.
 */
export function SobreEd() {
  return (
    <section
      data-section="sobre-ed"
      className="bg-grain-strong bg-azul-principal relative isolate flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center overflow-hidden py-14 text-white md:py-20"
    >
      {/* Grain noise sutil */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_DATA_URI }}
      />

      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-claro/40 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        003 / Identidad
      </span>

      {/* Ondas concéntricas decorativas — sutiles, sin invadir */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 -left-40 hidden -translate-y-1/2 md:block"
      >
        <span className="border-verde-concepto/10 absolute h-[20rem] w-[20rem] rounded-full border" />
        <span className="border-verde-concepto/[0.06] absolute h-[26rem] w-[26rem] -translate-x-8 -translate-y-8 rounded-full border" />
        <span className="bg-verde-concepto/15 absolute h-[14rem] w-[14rem] translate-x-8 translate-y-8 rounded-full blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Split balanceado — Identidad + base académica.
            items-start asegura que ambas columnas arranquen alineadas
            por el top (Eyebrows en la misma altura), no centradas. */}
        <div
          className="grid items-start gap-10 md:grid-cols-12 md:gap-12"
          data-anim="sobre-copy"
        >
          {/* Izq — Identidad institucional */}
          <div className="md:col-span-6">
            <Eyebrow variant="light" dashClass="w-14">
              Quiénes somos
            </Eyebrow>

            <h2
              className="font-display mt-5 leading-[1.08] font-bold tracking-[-0.018em]"
              style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)" }}
            >
              Una organización que <Highlight>piensa</Highlight> la enseñanza de
              las matemáticas.
            </h2>

            <p className="text-azul-claro/85 first-letter:font-display first-letter:text-verde-concepto mt-5 font-sans text-[0.98rem] leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-[3.5rem] first-letter:leading-[0.85] first-letter:font-bold md:text-[1.02rem]">
              {siteConfig.name} trabaja con profesionales de la educación en{" "}
              {siteConfig.paises.join(", ")}, integrando{" "}
              <strong className="font-medium text-white">
                investigación, acompañamiento y formación
              </strong>{" "}
              en torno a la{" "}
              <strong className="font-medium text-white">
                Matemática Educativa
              </strong>
              .
            </p>
          </div>

          {/* Der — Fundamentos académicos. Estructura simétrica con la
              columna izquierda: Eyebrow arriba (alineado con el de
              "QUIÉNES SOMOS") + bloque conceptual + lista de principios. */}
          <div className="md:col-span-6">
            <Eyebrow variant="light" dashClass="w-14">
              Nuestra base epistemológica
            </Eyebrow>

            <blockquote
              className="font-display text-azul-claro/85 mt-5 leading-relaxed"
              style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)" }}
            >
              &ldquo;El conocimiento matemático es una{" "}
              <strong className="font-medium text-white">
                construcción social situada
              </strong>{" "}
              que adquiere sentido en las{" "}
              <strong className="font-medium text-white">
                prácticas, los usos y las relaciones
              </strong>{" "}
              que las personas establecen con él.&rdquo;
            </blockquote>

            <ul className="mt-7 space-y-2.5">
              {principios.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 font-sans text-[0.92rem] text-white/95"
                >
                  <span
                    aria-hidden="true"
                    className="bg-verde-concepto mt-2.5 inline-block h-px w-6 flex-shrink-0"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA centered al pie */}
        <div className="mt-10 flex justify-center md:mt-12">
          <ButtonSecondary href="/nosotros" variant="dark">
            <span className="inline-flex items-center gap-2">
              Conocé a las personas que hacen ED
              <ArrowRight size={16} />
            </span>
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
}
