import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { LogoED } from "@/components/brand/LogoED";

const flujo = [
  "Investigamos",
  "Diseñamos",
  "Implementamos",
  "Volvemos a investigar",
] as const;

export function Hero() {
  return (
    <section
      data-section="hero"
      className="bg-grain bg-azul-principal relative isolate overflow-hidden text-white"
    >
      {/* Page marker editorial */}
      <span
        aria-hidden="true"
        className="text-azul-claro/50 absolute top-6 right-5 z-10 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:top-8 md:right-10 md:block"
      >
        001 / Home
      </span>

      {/* Grid editorial sutil */}
      <span
        aria-hidden="true"
        className="bg-azul-claro/[0.05] absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
      />

      {/* Círculo verde a la derecha (decoración inferior) */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/30 absolute -right-32 -bottom-32 z-0 h-[34rem] w-[34rem] rounded-full blur-[1px]"
      />

      {/* Patrón de puntos arriba izquierda */}
      <span
        aria-hidden="true"
        className="absolute top-28 left-6 z-0 hidden h-40 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:14px_14px] md:block"
      />

      <div className="relative z-10 mx-auto grid min-h-[88vh] max-w-screen-xl gap-12 px-5 pt-24 pb-32 md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:pt-28 md:pb-40">
        {/* Lado copy (7/12) */}
        <div className="md:col-span-7" data-anim="hero-copy">
          <div data-anim-item>
            <Eyebrow variant="light" dashClass="w-14">
              Investigación · Acción · Reflexión
            </Eyebrow>
          </div>

          <h1
            data-anim-item
            className="font-display mt-10 leading-[0.96] font-bold tracking-[-0.025em]"
            style={{ fontSize: "clamp(2.85rem, 7.5vw, 6.25rem)" }}
          >
            Investigamos para{" "}
            <span className="relative whitespace-nowrap">
              <Highlight>transformar</Highlight>
            </span>{" "}
            la matemática escolar.
          </h1>

          <p
            data-anim-item
            className="text-azul-claro/90 mt-8 max-w-xl font-sans text-[1.02rem] leading-relaxed md:text-[1.12rem]"
          >
            Desarrollo profesional docente y resignificación del conocimiento
            matemático escolar en {siteConfig.paises.join(", ")}. Un ciclo
            continuo de conocimiento, acción y transformación.
          </p>

          {/* Flujo del ciclo — chips con flechas */}
          <ol
            data-anim-item
            className="text-azul-claro mt-10 flex flex-wrap items-center gap-x-2.5 gap-y-3 font-sans text-[0.78rem] tracking-[0.15em] uppercase md:text-[0.82rem]"
          >
            {flujo.map((fase, i) => (
              <li key={fase} className="flex items-center gap-2.5">
                <span className="font-medium">{fase}</span>
                {i < flujo.length - 1 && (
                  <span aria-hidden="true" className="text-verde-concepto/80">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div
            data-anim-item
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <ButtonPrimary href="#comunidad">
              Sumate a la comunidad
            </ButtonPrimary>
            <ButtonSecondary href="/nosotros" variant="dark">
              Conocé a ED
            </ButtonSecondary>
          </div>
        </div>

        {/* Lado logo gigante (5/12) — pieza heroica */}
        <div
          className="relative flex items-center justify-center md:col-span-5"
          data-anim="hero-logo"
        >
          {/* Glow detrás del logo */}
          <span
            aria-hidden="true"
            className="bg-azul-claro/5 absolute inset-0 -m-12 rounded-full blur-2xl"
          />
          <LogoED
            variant="negativo"
            priority
            className="relative h-auto w-full max-w-md drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:max-w-none"
            alt="Empoderamiento Docente"
          />
        </div>
      </div>

      {/* Scroll indicator abajo */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        data-anim="scroll-indicator"
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
