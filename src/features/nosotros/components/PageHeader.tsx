import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { PageMarker } from "@/components/ui/PageMarker";
import { HeroH1Reveal } from "@/features/home/components/HeroH1Reveal";

const stats = [
  { value: "14", label: "Profesionales" },
  { value: "5", label: "Países" },
  { value: "3", label: "Áreas" },
] as const;

/**
 * Header institucional de /nosotros.
 *
 * DIFERENCIA VISUAL CON EL HOME: fondo BLANCO con acento verde (dominancia
 * humana / cálida — son las personas del equipo). Identificación
 * inmediata: si entrás aquí, sabés que NO estás en home (que es navy).
 *
 * Composición:
 * - PageMarker prominente arriba izquierda ("002 — NOSOTROS")
 * - Layout 12-col asimétrico (copy 7-8, composición visual 5-4)
 * - Patrón gráfico oficial a la derecha (dots azul-medio + círculo verde)
 */
export function PageHeader() {
  return (
    <section
      data-section="page-header"
      className="text-azul-principal relative isolate overflow-hidden bg-white"
    >
      {/* PageMarker prominente arriba izquierda */}
      <PageMarker
        number="002"
        label="Nosotros"
        variant="dark"
        className="absolute top-5 left-5 z-10 md:top-6 md:left-10"
      />

      {/* Decoración: parche de dots azul-medio arriba derecha */}
      <span
        aria-hidden="true"
        className="absolute top-20 right-10 hidden h-32 w-32 bg-[radial-gradient(circle,var(--pattern-dot-blue)_1px,transparent_1px)] [background-size:14px_14px] opacity-60 md:block"
      />

      {/* Decoración: círculo verde sutil abajo izquierda (refuerza el acento) */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/8 absolute -bottom-32 -left-32 h-72 w-72 rounded-full blur-[2px]"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-var(--header-height))] max-w-screen-xl items-center gap-8 px-5 pt-20 pb-12 md:grid-cols-12 md:gap-12 md:px-10 md:pt-24 md:pb-16">
        {/* Columna izquierda — copy + stats + CTAs */}
        <div className="flex flex-col md:col-span-7 lg:col-span-8">
          <div data-anim-item="eyebrow">
            <Eyebrow variant="dark" dashClass="w-14">
              Quiénes somos
            </Eyebrow>
          </div>

          {/* H1 con reveal por palabra + highlight de "transforma" */}
          <HeroH1Reveal
            text="Un equipo de investigadores que transforma la matemática escolar."
            highlight="transforma"
            className="font-display text-display text-azul-principal mt-4 font-bold tracking-[-0.025em]"
          />

          <p
            data-anim-item="bajada"
            className="text-gris-texto mt-4 max-w-xl font-sans text-[1.02rem] leading-relaxed md:text-[1.08rem]"
          >
            Con presencia en Argentina, Chile, Colombia, Costa Rica y México.
            Articulamos investigación, formación y diseño de materiales en torno
            al desarrollo profesional docente.
          </p>

          {/* Stats editoriales — números grandes baseline aligned,
              divisores verticales sutiles, label con dash verde corto. */}
          <ul
            role="list"
            data-anim="stats"
            className="border-azul-principal/15 divide-azul-principal/10 mt-8 grid grid-cols-3 divide-x border-t pt-6"
          >
            {stats.map(({ value, label }) => (
              <li
                key={label}
                data-anim-stat
                className="flex flex-col first:pl-0 last:pr-0 md:px-5"
              >
                <span
                  className="font-display text-azul-principal leading-none font-bold tracking-[-0.03em] tabular-nums"
                  style={{ fontSize: "clamp(2.75rem, 5vw, 3.75rem)" }}
                >
                  {value}
                </span>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="bg-verde-concepto block h-px w-4 flex-shrink-0"
                  />
                  <span className="text-azul-principal/65 font-sans text-[0.68rem] font-medium tracking-[0.2em] uppercase">
                    {label}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div
            data-anim-item="ctas"
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <ButtonPrimary href="#equipo">Conocé al equipo</ButtonPrimary>
            <ButtonSecondary href="/sumate" variant="light">
              Sumate a la comunidad
            </ButtonSecondary>
          </div>
        </div>

        {/* Columna derecha — composición del patrón gráfico oficial.
            Dots azul-medio sobre blanco + círculo verde sólido superpuesto. */}
        <div className="relative hidden md:col-span-5 md:block lg:col-span-4">
          <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-md">
            {/* Parche de dots azul-medio (manual §6) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle,var(--pattern-dot-blue)_1px,transparent_1px)] [background-size:18px_18px] opacity-55"
            />
            {/* Círculo verde sólido — gesto principal del patrón */}
            <span
              aria-hidden="true"
              className="bg-verde-concepto absolute top-1/2 right-0 h-[70%] w-[70%] translate-x-[15%] -translate-y-1/2 rounded-full"
            />
            {/* Acento azul-medio chico abajo izquierda */}
            <span
              aria-hidden="true"
              className="bg-azul-medio/30 absolute bottom-4 -left-4 h-20 w-20 rounded-full blur-[1px]"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator — adaptado al fondo claro */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-azul-principal/50 font-sans text-[0.68rem] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <span className="bg-azul-principal/15 block h-12 w-px overflow-hidden">
          <span
            className="bg-verde-concepto block h-full w-full origin-top"
            style={{ animation: "scrollHint 2.4s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
