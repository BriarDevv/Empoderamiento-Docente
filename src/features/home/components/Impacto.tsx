import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import {
  Users,
  Lightbulb,
  School,
  TrendingUp,
  type IconProps,
} from "@/components/ui/icons";
import type { ComponentType } from "react";

type Audiencia = {
  Icono: ComponentType<IconProps>;
  titulo: string;
  detalle: string;
};

const audiencias: readonly Audiencia[] = [
  {
    Icono: Users,
    titulo: "Docentes",
    detalle:
      "Mayor conocimiento profesional, confianza y capacidad de tomar decisiones didácticas fundamentadas.",
  },
  {
    Icono: Lightbulb,
    titulo: "Estudiantes",
    detalle:
      "Desarrollo del pensamiento matemático, comprensión profunda y uso funcional de la matemática.",
  },
  {
    Icono: School,
    titulo: "Escuelas",
    detalle:
      "Prácticas de enseñanza innovadoras, trabajo colaborativo y cultura de mejora continua.",
  },
  {
    Icono: TrendingUp,
    titulo: "Sistemas educativos",
    detalle:
      "Políticas y decisiones basadas en evidencia para una educación más equitativa y de calidad.",
  },
];

export function Impacto() {
  return (
    <section
      data-section="impacto"
      className="relative bg-white py-24 md:py-32"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-principal/30 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        004 / Impacto
      </span>

      {/* Patrón gráfico oficial (manual §6 / pág. 8): parche de dots
          azul-medio + círculo verde sólido asomando por la izquierda. */}
      <span
        aria-hidden="true"
        className="absolute top-24 left-16 hidden h-40 w-40 bg-[radial-gradient(circle,rgba(74,111,165,0.55)_1px,transparent_1px)] [background-size:14px_14px] md:block"
      />
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute top-32 -left-12 z-0 hidden h-44 w-44 rounded-full md:block"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Header */}
        <div
          className="mx-auto max-w-3xl text-center"
          data-anim="impacto-intro"
        >
          <Eyebrow dashClass="w-14">Nuestro impacto</Eyebrow>
          <h2
            className="font-display text-azul-principal mt-6 leading-[1.04] font-bold tracking-[-0.018em]"
            style={{ fontSize: "clamp(2.1rem, 4.8vw, 3.5rem)" }}
          >
            Investigamos lo que hacemos. Hacemos lo que investigamos. Y{" "}
            <Highlight>transformamos</Highlight> la educación.
          </h2>
          <p className="text-gris-texto mx-auto mt-6 max-w-2xl font-sans text-[1rem] leading-relaxed md:text-[1.05rem]">
            La resignificación del conocimiento matemático escolar es parte
            constitutiva de la profesión docente y motor de transformación
            social.
          </p>
        </div>

        {/* Grid de 4 audiencias */}
        <ul
          data-anim="impacto-cards"
          className="mt-16 grid gap-6 sm:grid-cols-2 md:mt-20 md:gap-7 lg:grid-cols-4"
        >
          {audiencias.map(({ Icono, titulo, detalle }) => (
            <li
              key={titulo}
              className="group border-azul-principal/10 hover:border-verde-concepto/60 hover:shadow-azul-principal/10 relative flex flex-col rounded-2xl border bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl md:p-8"
            >
              <span className="bg-verde-concepto/10 text-verde-concepto group-hover:bg-verde-concepto inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-500 group-hover:text-white">
                <Icono size={22} />
              </span>
              <h3 className="font-display text-azul-principal mt-6 text-[1.25rem] leading-tight font-bold tracking-[-0.005em]">
                {titulo}
              </h3>
              <p className="text-gris-texto mt-3 font-sans text-[0.95rem] leading-relaxed">
                {detalle}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
