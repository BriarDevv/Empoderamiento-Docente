import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/icons";

type Fase = {
  n: string;
  titulo: string;
  resumen: string;
  detalles: string;
  href: string;
};

const fases: readonly Fase[] = [
  {
    n: "01",
    titulo: "Investigamos",
    resumen: "Construimos conocimiento propio.",
    detalles:
      "Líneas de investigación en resignificación del conocimiento matemático escolar, tareas disruptivas y pensamiento matemático. Producción académica en RELIME, Bolema, libros, ponencias y redes en Latinoamérica.",
    href: "/recursos",
  },
  {
    n: "02",
    titulo: "Hacemos",
    resumen: "Diseñamos e implementamos acciones.",
    detalles:
      "Desarrollo profesional docente (workshops, acompañamiento, diplomados), diseño curricular y pedagógico, evaluación e investigación aplicada, fortalecimiento institucional, recursos y plataformas.",
    href: "/formacion",
  },
  {
    n: "03",
    titulo: "Volvemos a investigar",
    resumen: "Analizamos lo que ocurre.",
    detalles:
      "Recolección de evidencias, análisis e interpretación, producción de conocimiento metodológico y retroalimentación del ciclo. Los hallazgos orientan nuevas acciones y proyectos.",
    href: "/nosotros",
  },
] as const;

export function CicloTrabajo() {
  return (
    <section
      data-section="ciclo"
      className="bg-gris-fondo relative py-24 md:py-32"
    >
      {/* Page marker editorial */}
      <span
        aria-hidden="true"
        className="text-azul-principal/30 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        002 / Ciclo
      </span>

      {/* Patrón de puntos sutil */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 -left-10 hidden h-72 w-72 -translate-y-1/2 bg-[radial-gradient(circle,var(--color-gris-texto)_1px,transparent_1px)] [background-size:18px_18px] opacity-25 md:block"
      />

      <div className="relative mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Encabezado */}
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7" data-anim="ciclo-intro">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2
              className="font-display text-azul-principal mt-7 leading-[1.04] font-bold tracking-[-0.018em]"
              style={{ fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)" }}
            >
              Un ciclo continuo de conocimiento, acción y transformación.
            </h2>
          </div>
          <p
            data-anim="ciclo-intro-text"
            className="text-gris-texto font-sans text-[0.98rem] leading-relaxed md:col-span-5 md:text-right"
          >
            Investigamos lo que hacemos. Hacemos lo que investigamos. Volvemos a
            investigar lo aprendido. Y empezamos otra vez.
          </p>
        </div>

        {/* Fases del ciclo — arco con conectores */}
        <div
          data-anim="ciclo-fases"
          className="relative mt-20 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-0"
        >
          {/* Línea conectora horizontal (desktop) */}
          <span
            aria-hidden="true"
            className="bg-azul-principal/15 absolute top-12 right-[12%] left-[12%] hidden h-px md:block"
          />
          {/* Línea de retorno curva (loop) */}
          <svg
            aria-hidden="true"
            className="absolute right-[12%] -bottom-12 hidden h-28 w-[76%] md:block"
            viewBox="0 0 760 110"
            fill="none"
          >
            <path
              d="M 0 0 Q 380 130 760 0"
              stroke="var(--color-verde-concepto)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.5"
            />
            <polygon
              points="6,0 0,-6 -6,0 0,6"
              fill="var(--color-verde-concepto)"
              transform="translate(6 6) rotate(180)"
            />
          </svg>

          {fases.map(({ n, titulo, resumen, detalles, href }, idx) => (
            <article
              key={n}
              className="group relative flex flex-col"
              style={{ marginTop: idx % 2 === 1 ? "0" : "0" }}
            >
              {/* Bullet sobre la línea */}
              <span
                aria-hidden="true"
                className="bg-verde-concepto ring-gris-fondo absolute top-12 left-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 md:block"
              />

              <div className="flex flex-col px-6 md:px-8 md:pt-24">
                {/* Número editorial gigante */}
                <span
                  aria-hidden="true"
                  className="font-display text-verde-concepto/30 group-hover:text-verde-concepto/55 leading-none font-bold tracking-[-0.04em] transition-colors duration-500"
                  style={{ fontSize: "clamp(4.5rem, 9vw, 7.5rem)" }}
                >
                  {n}
                </span>

                <h3 className="font-display text-h2 text-azul-principal mt-3 leading-tight font-bold tracking-[-0.01em]">
                  {titulo}
                </h3>
                <p className="text-azul-principal/85 mt-3 font-sans text-[1.02rem] leading-snug font-medium">
                  {resumen}
                </p>
                <p className="text-gris-texto mt-5 font-sans text-[0.92rem] leading-relaxed">
                  {detalles}
                </p>

                <Link
                  href={href}
                  className="border-verde-concepto/40 text-azul-principal hover:border-verde-concepto mt-7 inline-flex items-center gap-2 self-start border-b pb-1 font-sans text-[0.88rem] font-medium tracking-wide transition-all hover:gap-3"
                >
                  <span>Conocé más</span>
                  <ArrowRight size={14} className="text-verde-concepto" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Frase de cierre del ciclo */}
        <p
          data-anim="ciclo-outro"
          className="font-display text-azul-principal/70 mx-auto mt-32 max-w-3xl text-center text-[1.1rem] leading-relaxed md:mt-40 md:text-[1.35rem]"
        >
          Investigación + Acción + Reflexión + Alianzas{" "}
          <span className="text-naranja-accion">=</span>{" "}
          <span className="text-azul-principal">Transformación educativa.</span>
        </p>
      </div>
    </section>
  );
}
