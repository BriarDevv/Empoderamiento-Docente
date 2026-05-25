import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";

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
      className="text-azul-principal relative isolate overflow-hidden bg-white"
    >
      {/* Page marker editorial — acento naranja en el separador */}
      <span
        aria-hidden="true"
        className="text-azul-principal/40 absolute top-6 right-5 z-10 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:top-8 md:right-10 md:block"
      >
        001 <span className="text-naranja-accion">/</span> Home
      </span>

      {/* Patrón de puntos azules — arriba izquierda */}
      <span
        aria-hidden="true"
        className="pattern-dots absolute top-28 left-6 z-0 hidden h-48 w-48 md:block"
      />

      <div className="relative z-10 mx-auto grid min-h-[78vh] max-w-screen-xl gap-12 px-5 pt-16 pb-20 md:grid-cols-2 md:items-center md:gap-12 md:px-10 md:pt-20 md:pb-24">
        {/* Pilar copy */}
        <div className="flex flex-col" data-anim="hero-copy">
          <div data-anim-item>
            <Eyebrow dashClass="w-14">
              Investigación · Acción · Reflexión
            </Eyebrow>
          </div>

          <h1
            data-anim-item
            className="font-display text-display mt-6 font-bold tracking-[-0.025em]"
          >
            Transformamos la{" "}
            <span className="text-verde-concepto">enseñanza</span> de la
            matemática.
          </h1>

          {/* Línea verde decorativa */}
          <span
            data-anim-item
            aria-hidden="true"
            className="bg-verde-concepto mt-7 block h-px w-14"
          />

          <p
            data-anim-item
            className="text-gris-texto mt-6 max-w-md font-sans text-[1.02rem] leading-relaxed md:text-[1.08rem]"
          >
            Formación, reflexión y acompañamiento para docentes que quieren ir
            más allá, en {siteConfig.paises.join(", ")}.
          </p>

          {/* Flujo del ciclo */}
          <ol
            data-anim-item
            className="text-azul-principal/85 mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-3 font-sans text-[0.78rem] tracking-[0.15em] uppercase md:text-[0.82rem]"
          >
            {flujo.map((fase, i) => (
              <li key={fase} className="flex items-center gap-2.5">
                <span className="font-medium">{fase}</span>
                {i < flujo.length - 1 && (
                  <span aria-hidden="true" className="text-naranja-accion">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>

          <div
            data-anim-item
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <ButtonPrimary href="#comunidad">Conocé más</ButtonPrimary>
            <ButtonSecondary href="/nosotros">Conocé al equipo</ButtonSecondary>
          </div>
        </div>

        {/* Pilar logo — composición del manual §5: isotipo macizo +
            semicírculo verde en esquina inferior derecha + dots
            azules superpuestos al verde. */}
        <div className="relative flex items-center justify-center">
          <span
            aria-hidden="true"
            className="bg-verde-concepto absolute right-0 -bottom-40 z-0 h-[22rem] w-[22rem] translate-x-1/2 rounded-full md:-bottom-48 md:h-[26rem] md:w-[26rem]"
          />

          <span
            aria-hidden="true"
            className="pattern-dots absolute -right-4 -bottom-16 z-20 hidden h-40 w-40 md:block"
          />

          <Image
            src="/brand/logotipo-ed-principal.svg"
            alt="Empoderamiento Docente"
            width={262}
            height={335}
            priority
            className="relative z-10 h-auto w-full max-w-[14rem] md:max-w-[18rem]"
          />
        </div>
      </div>
    </section>
  );
}
