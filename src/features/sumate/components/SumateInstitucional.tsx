import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight, MailOutline } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

/**
 * Sección "Tu institución con ED" del hub `/sumate`. Anchor `#institucional`.
 *
 * Path B2B — para escuelas, ministerios, redes que quieren contratar
 * formación o asesoramiento de ED. NO pide datos acá: redirige al
 * formulario completo de /contacto donde está el flujo institucional.
 *
 * Tono más sobrio que las otras dos secciones: foco en autoridad
 * académica y trayectoria, no en conversión rápida.
 */
export function SumateInstitucional() {
  return (
    <section
      id="institucional"
      data-section="sumate-institucional"
      className="bg-grain bg-azul-principal relative scroll-mt-24 overflow-hidden py-20 text-white md:py-28"
    >
      {/* Decoración: dots sutiles a la derecha */}
      <span
        aria-hidden="true"
        className="absolute top-12 right-12 hidden h-40 w-40 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:16px_16px] md:block"
      />
      {/* Decoración: círculo azul-medio sutil abajo izquierda */}
      <span
        aria-hidden="true"
        className="bg-azul-medio/30 absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-[1px]"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7 lg:col-span-8">
            <Eyebrow variant="light" dashClass="w-14">
              03 · Institucional
            </Eyebrow>
            <h2
              className="font-display mt-5 leading-[1.05] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.85rem, 3.8vw, 2.75rem)" }}
            >
              Trabajamos con escuelas, ministerios y redes educativas.
            </h2>
            <p className="text-azul-claro/90 mt-6 max-w-xl font-sans text-[1rem] leading-relaxed">
              Desarrollo profesional docente, diseño curricular, evaluación e
              investigación aplicada. Trabajamos en alianza con instituciones de
              Argentina, Chile, Colombia, Costa Rica y México — desde equipos
              chicos hasta redes nacionales.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:col-span-5 md:items-end lg:col-span-4">
            <Link
              href="/contacto"
              className="btn-premium hover:text-azul-principal focus-visible:outline-verde-concepto relative inline-flex items-center gap-2 overflow-hidden rounded-lg border border-white/70 bg-transparent px-6 py-3 font-sans text-[0.95rem] font-medium text-white transition-all hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="btn-sheen" aria-hidden="true" />
              <span className="btn-ico relative z-[1]" aria-hidden="true">
                <span className="btn-ico__main">
                  <ArrowRight size={16} />
                </span>
                <span className="btn-ico__ghost">
                  <ArrowRight size={16} />
                </span>
              </span>
              <span className="relative z-[1]">
                Ir al formulario de contacto
              </span>
            </Link>

            <a
              href={`mailto:${siteConfig.contacto.email}?subject=${encodeURIComponent("Consulta institucional")}`}
              className="text-azul-claro/85 decoration-verde-concepto/60 hover:decoration-verde-concepto inline-flex items-center gap-2 font-sans text-[0.88rem] underline decoration-2 underline-offset-4 transition-colors hover:text-white"
            >
              <MailOutline size={14} aria-hidden="true" />
              <span>o escribinos directo: {siteConfig.contacto.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
