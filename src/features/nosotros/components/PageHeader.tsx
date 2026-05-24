import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";

/**
 * Header institucional de la página /nosotros. Más sobrio que el Hero
 * del home (sin faro — esa metáfora es del home) y más corto (40-48vh).
 * Fondo azul-principal con grain + patrón de puntos + semicírculo
 * azul-medio que asoma desde el borde derecho (DESIGN.md §6).
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

      {/* Semicírculo azul-medio asomando por la derecha */}
      <span
        aria-hidden="true"
        className="bg-azul-medio/20 absolute -right-40 -bottom-32 z-0 h-[28rem] w-[28rem] rounded-full blur-[1px]"
      />

      {/* Grid de puntos arriba a la derecha */}
      <span
        aria-hidden="true"
        className="absolute top-24 right-8 z-0 hidden h-36 w-36 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:14px_14px] md:block"
      />

      <div className="relative z-10 mx-auto flex min-h-[40vh] max-w-screen-xl flex-col justify-center px-5 pt-20 pb-16 md:min-h-[48vh] md:px-10 md:pt-24 md:pb-20">
        <Eyebrow variant="light" dashClass="w-14">
          Quiénes somos
        </Eyebrow>

        <h1 className="font-display text-display mt-6 max-w-3xl font-bold tracking-[-0.025em]">
          Un equipo de investigadoras e investigadores que{" "}
          <span className="relative whitespace-nowrap">
            <Highlight>transformamos</Highlight>
          </span>{" "}
          la matemática escolar.
        </h1>

        <p className="text-azul-claro/90 mt-6 max-w-2xl font-sans text-[1.02rem] leading-relaxed md:text-[1.08rem]">
          14 profesionales distribuidas y distribuidos en Argentina, Chile,
          Colombia, Costa Rica y México. Articulamos investigación, formación y
          diseño de materiales en torno al desarrollo profesional docente.
        </p>
      </div>
    </section>
  );
}
