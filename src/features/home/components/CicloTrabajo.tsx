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
      className="bg-gris-fondo relative overflow-hidden py-24 md:py-32"
    >
      {/* Page marker editorial */}
      <span
        aria-hidden="true"
        className="text-azul-principal/40 absolute top-8 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        002 <span className="text-naranja-accion">/</span> Ciclo
      </span>

      {/* Composición canónica — esquina superior derecha */}
      <span
        aria-hidden="true"
        className="pattern-dots absolute top-20 right-32 hidden h-44 w-44 md:block"
      />
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute -top-20 -right-20 z-0 hidden h-72 w-72 rounded-full md:block"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Header */}
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7" data-anim="ciclo-intro">
            <Eyebrow>Cómo trabajamos</Eyebrow>
            <h2
              className="font-display text-azul-principal mt-6 leading-[1.05] font-bold tracking-[-0.018em]"
              style={{ fontSize: "clamp(2rem, 4.4vw, 3.25rem)" }}
            >
              Un ciclo continuo de conocimiento, acción y{" "}
              <span className="text-verde-concepto">transformación</span>.
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

        {/* Cards del ciclo con flechas naranjas entre ellas */}
        <div
          data-anim="ciclo-fases"
          className="mt-14 grid items-stretch gap-6 md:mt-20 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4"
        >
          {fases.map((fase, idx) => (
            <FaseCard key={fase.n} fase={fase} arrow={idx < fases.length - 1} />
          ))}
        </div>

        {/* Cierre editorial — el ciclo se reinicia */}
        <p
          data-anim="ciclo-outro"
          className="border-azul-principal/15 text-gris-texto mt-20 flex flex-wrap items-center justify-center gap-3 border-t pt-10 text-center font-sans text-[0.95rem] md:mt-24 md:text-[1.02rem]"
        >
          <span
            aria-hidden="true"
            className="bg-verde-concepto inline-block h-1.5 w-1.5 rounded-full"
          />
          <span>
            El ciclo no termina:{" "}
            <span className="text-azul-principal font-medium">
              lo aprendido alimenta nuevas preguntas
            </span>
            .
          </span>
        </p>
      </div>
    </section>
  );
}

/**
 * Card de una fase del ciclo. Render condicional de flecha al final
 * (todas menos la última en desktop).
 */
function FaseCard({ fase, arrow }: { fase: Fase; arrow: boolean }) {
  const { n, titulo, resumen, detalles, href } = fase;
  return (
    <>
      <article className="border-azul-principal/10 hover:border-verde-concepto/60 hover:shadow-azul-principal/10 group relative flex flex-col rounded-2xl border bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl md:p-8">
        <header className="flex items-start justify-between gap-4">
          <span
            aria-hidden="true"
            className="text-verde-concepto/40 group-hover:text-verde-concepto/70 font-display text-[2.75rem] leading-none font-bold tracking-[-0.02em] tabular-nums transition-colors duration-500"
          >
            {n}
          </span>
          <span
            aria-hidden="true"
            className="bg-verde-concepto/15 text-verde-concepto group-hover:bg-verde-concepto inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-500 group-hover:text-white"
          >
            <ArrowRight size={14} />
          </span>
        </header>

        <h3 className="font-display text-azul-principal mt-6 text-[1.5rem] leading-tight font-bold tracking-[-0.01em]">
          {titulo}
        </h3>
        <p className="text-azul-principal/85 mt-2 font-sans text-[0.98rem] leading-snug font-medium">
          {resumen}
        </p>
        <p className="text-gris-texto mt-4 flex-1 font-sans text-[0.9rem] leading-relaxed">
          {detalles}
        </p>

        <Link
          href={href}
          className="border-verde-concepto/40 text-azul-principal hover:border-verde-concepto mt-6 inline-flex items-center gap-2 self-start border-b pb-1 font-sans text-[0.85rem] font-medium tracking-wide transition-all hover:gap-3"
        >
          <span>Conocé más</span>
          <ArrowRight size={13} className="text-verde-concepto" />
        </Link>
      </article>

      {arrow && (
        <div
          aria-hidden="true"
          className="hidden items-center justify-center md:flex"
        >
          <ArrowRight size={28} className="text-naranja-accion" />
        </div>
      )}
    </>
  );
}
