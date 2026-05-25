import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { TextReveal } from "@/components/ui/TextReveal";
import { ArrowRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

const principios = [
  "Centrados en aprender, más que en enseñar",
  "Sostenemos un vínculo continuo con el cuerpo docente",
  "Base científica en Matemática Educativa",
] as const;

export function SobreEd() {
  return (
    <section
      data-section="sobre-ed"
      className="text-azul-principal relative isolate overflow-hidden bg-white py-24 md:py-36"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-principal/30 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        003 / Identidad
      </span>

      {/* Composición del patrón gráfico (manual §6):
          parche de dots azul-medio + círculo verde sólido asomando
          por el borde izquierdo. */}
      <span
        aria-hidden="true"
        className="pattern-dots absolute top-1/2 right-24 z-0 hidden h-40 w-40 -translate-y-1/2 md:block"
      />
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute top-1/2 -right-32 z-0 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full md:h-[26rem] md:w-[26rem]"
      />

      <div className="relative z-10 mx-auto grid max-w-screen-xl gap-16 px-5 md:grid-cols-12 md:items-center md:gap-12 md:px-10">
        {/* Lado pull-quote (5/12) */}
        <div className="md:order-2 md:col-span-5" data-anim="sobre-quote">
          <span
            aria-hidden="true"
            className="font-display text-verde-concepto block text-[4rem] leading-none md:text-[5rem]"
          >
            &ldquo;
          </span>
          <TextReveal
            as="p"
            text="Vivir para hacer vivir."
            className="font-display text-azul-principal mt-3 leading-[0.96] font-bold tracking-[-0.025em]"
            stagger={0.08}
            duration={0.9}
          />
          <style>
            {`
              [data-section="sobre-ed"] [data-anim="sobre-quote"] p [data-word] {
                font-size: clamp(2.75rem, 6vw, 5rem);
                line-height: 0.96;
              }
            `}
          </style>
          <p className="text-gris-texto mt-8 max-w-xs font-sans text-[0.78rem] tracking-[0.22em] uppercase">
            Fase experiencial · principio rector
          </p>
          <p className="text-gris-texto mt-3 max-w-sm font-sans text-[0.98rem] leading-relaxed">
            El profesorado vivencia tareas disruptivas que problematizan la
            matemática escolar. Recién después, la diseñan para sus estudiantes.
          </p>
        </div>

        {/* Lado copy (7/12) */}
        <div className="md:order-1 md:col-span-7" data-anim="sobre-copy">
          <Eyebrow dashClass="w-14">Quiénes somos</Eyebrow>

          <h2
            className="font-display text-azul-principal mt-7 leading-[1.04] font-bold tracking-[-0.018em]"
            style={{ fontSize: "clamp(2.1rem, 4.8vw, 3.75rem)" }}
          >
            Una organización que <Highlight>piensa</Highlight> la enseñanza de
            las matemáticas.
          </h2>

          <p className="text-gris-texto first-letter:font-display first-letter:text-verde-concepto mt-9 font-sans text-[1.02rem] leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-[4.5rem] first-letter:leading-[0.85] first-letter:font-bold md:text-[1.08rem]">
            {siteConfig.name} trabaja con profesionales de la educación en{" "}
            {siteConfig.paises.join(", ")}, integrando investigación,
            acompañamiento y formación en torno a la Matemática Educativa.
          </p>

          <figure className="border-verde-concepto mt-9 border-l-2 pl-6">
            <figcaption className="text-gris-texto font-sans text-[0.72rem] font-medium tracking-[0.24em] uppercase">
              Nuestra base epistemológica
            </figcaption>
            <blockquote className="font-display text-azul-principal mt-3 text-[1.05rem] leading-relaxed md:text-[1.22rem]">
              &ldquo;El conocimiento matemático es una construcción social
              situada que adquiere sentido en las prácticas, los usos y las
              relaciones que las personas establecen con él.&rdquo;
            </blockquote>
          </figure>

          <ul className="mt-9 space-y-3.5">
            {principios.map((p) => (
              <li
                key={p}
                className="text-azul-principal flex items-start gap-4 font-sans text-[0.98rem]"
              >
                <span
                  aria-hidden="true"
                  className="bg-verde-concepto mt-2.5 inline-block h-px w-7 flex-shrink-0"
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-11">
            <ButtonSecondary href="/nosotros">
              <span className="inline-flex items-center gap-2">
                Conocé a las personas que hacen ED
                <ArrowRight size={16} />
              </span>
            </ButtonSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
