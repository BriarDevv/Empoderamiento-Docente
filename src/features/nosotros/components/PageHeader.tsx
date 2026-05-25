import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

const stats = [
  { value: "14", label: "Profesionales" },
  { value: "5", label: "Países" },
  { value: "3", label: "Áreas" },
] as const;

/**
 * Header institucional de la página /nosotros. Misma identidad visual
 * que el Hero del home: fondo blanco + texto navy, composición canónica
 * del manual §6 (círculo verde sólido + dots azules) en la columna
 * derecha. Stats del equipo + CTAs.
 */
export function PageHeader() {
  return (
    <section
      data-section="page-header"
      className="text-azul-principal relative isolate overflow-hidden bg-white"
    >
      {/* Page marker editorial — separador en naranja como en el Hero */}
      <span
        aria-hidden="true"
        className="text-azul-principal/40 absolute top-6 right-5 z-10 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:top-8 md:right-10 md:block"
      >
        002 <span className="text-naranja-accion">/</span> Nosotros
      </span>

      {/* Parche de dots azules — arriba izquierda */}
      <span
        aria-hidden="true"
        className="pattern-dots absolute top-28 left-6 z-0 hidden h-48 w-48 md:block"
      />

      <div className="relative z-10 mx-auto grid min-h-[78vh] max-w-screen-xl items-center gap-12 px-5 pt-16 pb-20 md:grid-cols-2 md:gap-12 md:px-10 md:pt-20 md:pb-24">
        {/* Columna izquierda — copy + stats + CTAs */}
        <div className="flex flex-col">
          <Eyebrow dashClass="w-14">Quiénes somos</Eyebrow>

          <h1 className="font-display text-display mt-6 max-w-lg font-bold tracking-[-0.025em]">
            Un equipo que{" "}
            <span className="text-verde-concepto">transforma</span> la
            matemática escolar.
          </h1>

          {/* Línea verde decorativa */}
          <span
            aria-hidden="true"
            className="bg-verde-concepto mt-7 block h-px w-14"
          />

          <p className="text-gris-texto mt-6 max-w-md font-sans text-[1.02rem] leading-relaxed md:text-[1.08rem]">
            Una red de 14 profesionales en Argentina, Chile, Colombia, Costa
            Rica y México. Articulamos investigación, formación y diseño de
            materiales en torno al desarrollo profesional docente.
          </p>

          {/* Stats */}
          <ul
            role="list"
            className="border-azul-principal/15 mt-10 grid max-w-md grid-cols-3 gap-x-4 border-t pt-8"
          >
            {stats.map(({ value, label }) => (
              <li key={label} className="flex flex-col">
                <span className="font-display text-azul-principal text-[2.75rem] leading-none font-bold tracking-[-0.02em] md:text-[3.25rem]">
                  {value}
                </span>
                <span className="text-gris-texto mt-2 font-sans text-[0.7rem] font-medium tracking-[0.22em] uppercase">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonPrimary href="#equipo">Conocé al equipo</ButtonPrimary>
            <ButtonSecondary href="/#comunidad">
              Sumate a la comunidad
            </ButtonSecondary>
          </div>
        </div>

        {/* Columna derecha — composición canónica del manual §6:
            círculo verde sólido + parche de dots azules superpuestos. */}
        <div className="relative hidden h-72 md:block">
          <span
            aria-hidden="true"
            className="bg-verde-concepto absolute top-1/2 -right-16 z-0 h-72 w-72 -translate-y-1/2 rounded-full"
          />
          <span
            aria-hidden="true"
            className="pattern-dots absolute top-1/2 right-6 z-20 h-36 w-36 -translate-y-1/2"
          />
        </div>
      </div>
    </section>
  );
}
