import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

const stats = [
  { value: "14", label: "Profesionales" },
  { value: "5", label: "Países" },
  { value: "3", label: "Áreas" },
] as const;

/**
 * Header institucional de la página /nosotros. Full-screen (min-h-dvh)
 * con layout en 2 columnas: copy (eyebrow + h1 + bajada + stats + CTAs)
 * a la izquierda, composición visual del patrón gráfico oficial a la
 * derecha. Scroll indicator abajo en el patrón del Hero del home.
 *
 * Sin faro — esa metáfora es del home. Acá la metáfora visual es la
 * composición pura del manual §6 (dots + círculo verde sólido).
 */
export function PageHeader() {
  return (
    <section
      data-section="page-header"
      className="bg-grain bg-azul-principal relative isolate overflow-hidden text-white"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-claro/50 absolute top-6 right-5 z-10 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:top-8 md:right-10 md:block"
      >
        002 / Nosotros
      </span>

      <div className="relative z-10 mx-auto grid min-h-dvh max-w-screen-xl items-center gap-12 px-5 pt-20 pb-24 md:grid-cols-2 md:gap-16 md:px-10 md:pt-24">
        {/* Columna izquierda — copy + stats + CTAs */}
        <div className="flex flex-col">
          <Eyebrow variant="light" dashClass="w-14">
            Quiénes somos
          </Eyebrow>

          <h1 className="font-display text-display mt-6 font-bold tracking-[-0.025em]">
            Un equipo de investigadoras e investigadores que{" "}
            <span className="relative whitespace-nowrap">
              <Highlight>transformamos</Highlight>
            </span>{" "}
            la matemática escolar.
          </h1>

          <p className="text-azul-claro/90 mt-6 max-w-xl font-sans text-[1.02rem] leading-relaxed md:text-[1.08rem]">
            Distribuidas y distribuidos en Argentina, Chile, Colombia, Costa
            Rica y México. Articulamos investigación, formación y diseño de
            materiales en torno al desarrollo profesional docente.
          </p>

          {/* Stats */}
          <ul
            role="list"
            className="border-azul-claro/20 mt-10 grid max-w-md grid-cols-3 gap-x-4 border-t pt-8"
          >
            {stats.map(({ value, label }) => (
              <li key={label} className="flex flex-col">
                <span className="font-display text-[2.75rem] leading-none font-bold tracking-[-0.02em] md:text-[3.25rem]">
                  {value}
                </span>
                <span className="text-azul-claro/80 mt-2 font-sans text-[0.7rem] font-medium tracking-[0.22em] uppercase">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonPrimary href="#equipo">Conocé al equipo</ButtonPrimary>
            <ButtonSecondary href="/#comunidad" variant="dark">
              Sumate a la comunidad
            </ButtonSecondary>
          </div>
        </div>

        {/* Columna derecha — composición del patrón gráfico oficial.
            Dots blancos sobre navy + círculo verde sólido superpuesto. */}
        <div className="relative hidden md:block">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            {/* Parche de dots blancos */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:18px_18px]"
            />
            {/* Círculo verde sólido — gesto principal del patrón */}
            <span
              aria-hidden="true"
              className="bg-verde-concepto absolute top-1/2 right-0 h-[70%] w-[70%] translate-x-[15%] -translate-y-1/2 rounded-full"
            />
            {/* Acento azul-medio chico abajo izquierda */}
            <span
              aria-hidden="true"
              className="bg-azul-medio/40 absolute bottom-4 -left-4 h-20 w-20 rounded-full blur-[1px]"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator — patrón del Hero del home */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-azul-claro/60 font-sans text-[0.68rem] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <span className="bg-azul-claro/20 block h-12 w-px overflow-hidden">
          <span
            className="bg-verde-concepto block h-full w-full origin-top"
            style={{ animation: "scrollHint 2.4s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
