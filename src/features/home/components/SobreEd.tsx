import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { TextReveal } from "@/components/ui/TextReveal";
import { ArrowRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

const principios = [
  "Centrados en aprender, más que en enseñar",
  "Sostenemos un vínculo continuo con la comunidad docente",
  "Base científica en Matemática Educativa",
] as const;

export function SobreEd() {
  return (
    <section
      data-section="sobre-ed"
      className="bg-grain-strong bg-azul-principal relative isolate overflow-hidden py-24 text-white md:py-36"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-claro/40 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        003 / Identidad
      </span>

      {/* Ondas concéntricas a la izquierda */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 -left-40 hidden -translate-y-1/2 md:block"
      >
        <span className="border-verde-concepto/15 absolute h-[28rem] w-[28rem] rounded-full border" />
        <span className="border-verde-concepto/10 absolute h-[34rem] w-[34rem] -translate-x-12 -translate-y-12 rounded-full border" />
        <span className="border-verde-concepto/[0.06] absolute h-[40rem] w-[40rem] -translate-x-24 -translate-y-24 rounded-full border" />
        <span className="bg-verde-concepto/30 absolute h-[20rem] w-[20rem] translate-x-12 translate-y-12 rounded-full blur-[2px]" />
      </div>

      {/* Patrón de puntos sutil derecha */}
      <span
        aria-hidden="true"
        className="absolute right-12 bottom-14 hidden h-48 w-48 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.08] md:block"
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
            className="font-display mt-3 leading-[0.96] font-bold tracking-[-0.025em]"
            stagger={0.08}
            duration={0.9}
            // Aplicamos el size con inline-style fuera del wrapper para que
            // el reveal por palabra mantenga el clip-mask
          />
          <style>
            {`
              [data-section="sobre-ed"] [data-anim="sobre-quote"] p [data-word] {
                font-size: clamp(2.75rem, 6vw, 5rem);
                line-height: 0.96;
              }
            `}
          </style>
          <p className="text-azul-claro/70 mt-8 max-w-xs font-sans text-[0.78rem] tracking-[0.22em] uppercase">
            Fase experiencial · principio rector
          </p>
          <p className="text-azul-claro/85 mt-3 max-w-sm font-sans text-[0.98rem] leading-relaxed">
            La comunidad docente vivencia tareas disruptivas que problematizan
            la matemática escolar. Recién después, las diseña para sus
            estudiantes.
          </p>
        </div>

        {/* Lado copy (7/12) */}
        <div className="md:order-1 md:col-span-7" data-anim="sobre-copy">
          <Eyebrow variant="light" dashClass="w-14">
            Quiénes somos
          </Eyebrow>

          <h2
            className="font-display mt-7 leading-[1.04] font-bold tracking-[-0.018em]"
            style={{ fontSize: "clamp(2.1rem, 4.8vw, 3.75rem)" }}
          >
            Una organización que <Highlight>piensa</Highlight> la enseñanza de
            las matemáticas.
          </h2>

          <p className="text-azul-claro/95 first-letter:font-display first-letter:text-verde-concepto mt-9 font-sans text-[1.02rem] leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:text-[4.5rem] first-letter:leading-[0.85] first-letter:font-bold md:text-[1.08rem]">
            {siteConfig.name} trabaja con profesionales de la educación en{" "}
            {siteConfig.paises.join(", ")}, integrando investigación,
            acompañamiento y formación en torno a la Matemática Educativa.
          </p>

          <figure className="border-verde-concepto mt-9 border-l-2 pl-6">
            <figcaption className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.24em] uppercase">
              Nuestra base epistemológica
            </figcaption>
            <blockquote className="font-display mt-3 text-[1.05rem] leading-relaxed text-white md:text-[1.22rem]">
              &ldquo;El conocimiento matemático es una construcción social
              situada que adquiere sentido en las prácticas, los usos y las
              relaciones que las personas establecen con él.&rdquo;
            </blockquote>
          </figure>

          <ul className="mt-9 space-y-3.5">
            {principios.map((p) => (
              <li
                key={p}
                className="flex items-start gap-4 font-sans text-[0.98rem] text-white/95"
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
            <ButtonSecondary href="/nosotros" variant="dark">
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
