import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";

type Paso = {
  numero: string;
  titulo: string;
  descripcion: string;
};

const pasos: readonly Paso[] = [
  {
    numero: "01",
    titulo: "Escuchamos",
    descripcion:
      "Nos sentamos con vos y atendemos lo que está pasando en tu institución, equipo o aula.",
  },
  {
    numero: "02",
    titulo: "Comprendemos",
    descripcion:
      "Definimos juntos los objetivos del proceso y dónde están las oportunidades reales de transformación.",
  },
  {
    numero: "03",
    titulo: "Diseñamos en equipo",
    descripcion:
      "Construimos una propuesta única para tu desafío, articulada con investigación y experiencia previa.",
  },
] as const;

/**
 * Filosofía de trabajo — bloque "Cómo trabajamos" como split editorial
 * con steps numerados + composición visual concéntrica.
 *
 * Tomado del PDF oficial de ED: "Siempre comenzamos con una conversación.
 * Nos sentamos con vos y escuchamos tus necesidades, comprendemos tus
 * objetivos y exploramos las oportunidades en equipo."
 *
 * Va inmediatamente después de ManifestoSection. El cambio visual
 * (white → navy + grain + visual geométrico) crea un segundo "momento"
 * editorial — alterna con el bloque anterior para evitar repetición.
 */
export function FilosofiaSection() {
  return (
    <section
      data-section="filosofia"
      className="bg-grain bg-azul-principal relative isolate overflow-hidden py-24 text-white md:py-32"
    >
      {/* Decoración: dots sutiles arriba derecha */}
      <span
        aria-hidden="true"
        className="absolute top-16 right-16 hidden h-40 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:16px_16px] md:block"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        <div className="grid items-start gap-14 md:grid-cols-12 md:gap-16">
          {/* Lado copy + steps (7/12) */}
          <div className="md:col-span-7">
            <Eyebrow variant="light" dashClass="w-14">
              Cómo trabajamos
            </Eyebrow>

            <h2
              className="font-display mt-6 font-bold tracking-[-0.02em]"
              style={{
                fontSize: "clamp(1.85rem, 3.8vw, 2.85rem)",
                lineHeight: "1.08",
              }}
            >
              Siempre <Highlight>comenzamos</Highlight> con una conversación.
            </h2>

            <p className="text-azul-claro/90 mt-6 max-w-xl font-sans text-[1.02rem] leading-relaxed">
              Nuestra filosofía se basa en escuchar atentamente a quien se
              acerca a dialogar. Cada proyecto que emprendemos es una historia
              en sí misma.
            </p>

            {/* Lista de 3 pasos con numeración editorial */}
            <ol className="mt-12 space-y-7">
              {pasos.map(({ numero, titulo, descripcion }) => (
                <li key={numero} className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="font-display text-verde-concepto mt-1 flex-shrink-0 font-bold tabular-nums"
                    style={{
                      fontSize: "1.5rem",
                      lineHeight: "1",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {numero}
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-display text-[1.18rem] leading-tight font-medium text-white">
                      {titulo}
                    </h3>
                    <p className="text-azul-claro/85 mt-1.5 font-sans text-[0.96rem] leading-relaxed">
                      {descripcion}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Lado visual conceptual (5/12) — ondas concéntricas
              que evocan diálogo / propagación / escucha activa */}
          <div className="relative hidden md:col-span-5 md:block">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {/* 5 círculos concéntricos verdes desde el centro */}
              <svg
                viewBox="0 0 400 400"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
              >
                {/* Círculos exteriores — borde sutil */}
                <circle
                  cx="200"
                  cy="200"
                  r="190"
                  fill="none"
                  stroke="var(--color-verde-concepto)"
                  strokeWidth="1"
                  opacity="0.15"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="var(--color-verde-concepto)"
                  strokeWidth="1"
                  opacity="0.25"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="110"
                  fill="none"
                  stroke="var(--color-verde-concepto)"
                  strokeWidth="1.2"
                  opacity="0.4"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="72"
                  fill="none"
                  stroke="var(--color-verde-concepto)"
                  strokeWidth="1.4"
                  opacity="0.6"
                />
                {/* Núcleo verde sólido — el "punto de origen" del diálogo */}
                <circle
                  cx="200"
                  cy="200"
                  r="38"
                  fill="var(--color-verde-concepto)"
                />
                {/* Punto blanco en el centro — la voz / la persona */}
                <circle cx="200" cy="200" r="4" fill="white" />
              </svg>

              {/* Patrón de puntos pequeño superpuesto arriba derecha */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 h-24 w-24 bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:12px_12px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
