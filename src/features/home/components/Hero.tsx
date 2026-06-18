import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { LogotipoEDInline } from "@/components/brand/LogotipoEDInline";
import { PageMarker } from "@/components/ui/PageMarker";
import { HeroH1Reveal } from "./HeroH1Reveal";

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
      {/* Page marker editorial — versión intermedia, compose 'número +
          dash verde + label'. Variant light = sobre fondo navy. */}
      <PageMarker
        number="001"
        label="Home"
        variant="light"
        className="absolute top-5 left-5 z-10 md:top-6 md:left-10"
      />

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

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-var(--header-height))] max-w-screen-xl gap-8 px-5 pt-6 pb-12 md:grid-cols-12 md:items-center md:gap-10 md:px-10 md:pt-8 md:pb-16">
        {/* Pilar copy — 8/12 del ancho para que el H1 respire en 2-3 líneas. */}
        <div
          className="flex flex-col md:col-span-7 lg:col-span-8"
          data-anim="hero-copy"
        >
          <div data-anim-item="eyebrow">
            <Eyebrow variant="light" dashClass="w-14">
              Investigación · Acción · Reflexión
            </Eyebrow>
          </div>

          {/* H1 con reveal por palabra + highlight de "transformar" que se
              dibuja como cierre narrativo. Self-contained (timeline GSAP
              propia, no usa el sistema data-anim-item). */}
          <HeroH1Reveal
            text="Investigamos para transformar la matemática escolar."
            highlight="transformar"
            className="font-display text-display mt-4 font-bold tracking-[-0.025em]"
          />

          <p
            data-anim-item="bajada"
            className="text-azul-claro/90 mt-4 font-sans text-[1.02rem] leading-relaxed md:text-[1.08rem]"
          >
            Desarrollo profesional docente y resignificación del conocimiento
            matemático escolar en {siteConfig.paises.join(", ")}. Un ciclo
            continuo de conocimiento, acción y transformación.
          </p>

          {/* Flujo del ciclo — chips con flechas */}
          <ol
            data-anim-item="flujo"
            className="text-azul-claro mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-3 font-sans text-[0.78rem] tracking-[0.15em] uppercase md:text-[0.82rem]"
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
            data-anim-item="ctas"
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            <ButtonPrimary href="/sumate">Sumate</ButtonPrimary>
            <ButtonSecondary href="/nosotros" variant="dark">
              Conocé a ED
            </ButtonSecondary>
          </div>
        </div>

        {/* Pilar logo — 4/12 del ancho con max-width reducido para que el
            copy tenga más espacio. La animación de "construcción"
            (stroke-draw + reveal por partes) vive dentro de LogotipoEDInline. */}
        <div className="relative flex items-center justify-center md:col-span-5 lg:col-span-4">
          {/* Glow detrás del logo */}
          <span
            aria-hidden="true"
            className="bg-azul-claro/5 absolute inset-0 -m-12 rounded-full blur-2xl"
          />
          <LogotipoEDInline
            variant="negativo"
            className="relative h-auto w-full max-w-[12rem] drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:max-w-[14rem] lg:max-w-[16rem]"
            alt="Empoderamiento Docente"
          />
        </div>
      </div>
    </section>
  );
}
