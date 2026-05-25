import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { PageMarker } from "@/components/ui/PageMarker";
import { ArrowRight } from "@/components/ui/icons";
import { PostulacionForm } from "./PostulacionForm";

const queBuscamos = [
  "Trayectoria académica o profesional en educación matemática, investigación o diseño didáctico.",
  "Apertura para trabajar en equipos distribuidos en Latinoamérica.",
  "Práctica reflexiva y compromiso con el desarrollo profesional sostenido.",
] as const;

/**
 * Header de /sumate — versión "form-first".
 *
 * Decisión de IA: el formulario de postulación está EMBEBIDO en el hero
 * (lado derecho), visible apenas carga la página, sin scroll. Esta página
 * pivota de "hub neutro de 3 paths" a "principalmente para postularse
 * + acceso secundario a las otras formas de sumarte".
 *
 * Por qué: el caso de uso con más valor de negocio es recibir CVs.
 * Tener el form al final (versión anterior con PathSelector + secciones
 * sucesivas) generaba ~3 scrolls antes de llegar a la conversión y la
 * mayoría de usuarios no llegaba. Ahora aparece en el primer pantallazo.
 *
 * Las 2 audiencias secundarias (comunidad / institucional) viven abajo
 * como secciones cortas + mini-links inline en el copy del hero para
 * que el user que viene por otro motivo no se sienta excluido.
 *
 * DIFERENCIA VISUAL CON HOME (navy) Y /NOSOTROS (blanco):
 * fondo gris-fondo con acento naranja (acción / conversión).
 */
export function PageHeader() {
  return (
    <section
      id="equipo"
      data-section="sumate-header"
      className="bg-gris-fondo text-azul-principal relative isolate scroll-mt-24 overflow-hidden"
    >
      {/* PageMarker prominente */}
      <PageMarker
        number="005"
        label="Sumate"
        variant="dark"
        className="absolute top-5 left-5 z-10 md:top-6 md:left-10"
      />

      {/* Decoración: círculo naranja sutil arriba derecha */}
      <span
        aria-hidden="true"
        className="bg-naranja-accion/8 absolute -top-20 -right-20 hidden h-72 w-72 rounded-full blur-[2px] md:block"
      />

      {/* Decoración: dots azul-medio abajo izquierda */}
      <span
        aria-hidden="true"
        className="absolute bottom-10 left-10 hidden h-32 w-32 bg-[radial-gradient(circle,var(--pattern-dot-blue)_1px,transparent_1px)] [background-size:14px_14px] opacity-55 md:block"
      />

      <div className="relative z-10 mx-auto grid max-w-screen-xl gap-10 px-5 pt-24 pb-16 md:grid-cols-12 md:items-start md:gap-12 md:px-10 md:pt-28 md:pb-20">
        {/* ── Lado copy (5/12) — más estrecho que el form ─────────── */}
        <div className="flex flex-col md:col-span-5">
          <Eyebrow variant="dark" dashClass="w-14">
            Sumate
          </Eyebrow>

          <h1 className="font-display text-display text-azul-principal mt-5 font-bold tracking-[-0.025em]">
            <Highlight>Trabajá</Highlight> con nosotros.
          </h1>

          <p className="text-gris-texto mt-6 font-sans text-[1.02rem] leading-relaxed md:text-[1.05rem]">
            Buscamos personas que compartan nuestra mirada sobre la enseñanza de
            la matemática y quieran sumarse a proyectos con impacto real.
          </p>

          {/* Qué buscamos — list compacto */}
          <ul className="mt-7 space-y-3">
            {queBuscamos.map((item) => (
              <li
                key={item}
                className="text-gris-texto flex items-start gap-3 font-sans text-[0.92rem] leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="bg-verde-concepto mt-2 inline-block h-px w-5 flex-shrink-0"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-gris-texto mt-6 font-sans text-[0.85rem] leading-relaxed">
            No publicamos vacantes específicas todo el tiempo —{" "}
            <strong className="text-azul-principal font-medium">
              aceptamos envío espontáneo
            </strong>{" "}
            y armamos equipos según los proyectos en curso.
          </p>

          {/* Mini-links a otras formas de sumarte */}
          <div className="border-azul-principal/15 mt-9 border-t pt-7">
            <p className="text-azul-principal/55 font-sans text-[0.7rem] font-medium tracking-[0.22em] uppercase">
              ¿Otra forma de sumarte?
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="#comunidad"
                className="group text-azul-principal decoration-verde-concepto/40 hover:decoration-verde-concepto inline-flex items-center gap-2 self-start font-sans text-[0.95rem] font-medium underline decoration-2 underline-offset-4 transition-all hover:gap-3"
              >
                <span>Sumate a la comunidad docente</span>
                <ArrowRight size={14} className="text-verde-concepto" />
              </Link>
              <Link
                href="#institucional"
                className="group text-azul-principal decoration-azul-medio/40 hover:decoration-azul-medio inline-flex items-center gap-2 self-start font-sans text-[0.95rem] font-medium underline decoration-2 underline-offset-4 transition-all hover:gap-3"
              >
                <span>Desde tu institución (escuela, ministerio, red)</span>
                <ArrowRight size={14} className="text-azul-medio" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Lado form (7/12) — la pieza dominante de la página ────── */}
        <div className="md:col-span-7">
          {/* Eyebrow del form (orientación contextual) */}
          <div className="mb-4 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="bg-naranja-accion h-2 w-2 flex-shrink-0 rounded-full"
            />
            <p className="text-azul-principal/75 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase">
              Postulate al equipo
            </p>
          </div>
          <PostulacionForm />
        </div>
      </div>
    </section>
  );
}
