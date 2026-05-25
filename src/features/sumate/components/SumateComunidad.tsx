import {
  Instagram,
  Linkedin,
  Facebook,
  MailOutline,
  ArrowRight,
} from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { siteConfig } from "@/config/site";

const redesMap = {
  instagram: {
    label: "Instagram",
    Icon: Instagram,
    handle: "@empoderamientodocente",
  },
  linkedin: {
    label: "LinkedIn",
    Icon: Linkedin,
    handle: "Empoderamiento Docente",
  },
  facebook: {
    label: "Facebook",
    Icon: Facebook,
    handle: "@empoderamientodocente",
  },
} as const;

type RedKey = keyof typeof redesMap;

/**
 * Sección "Sumate a la comunidad" del hub `/sumate`. Anchor `#comunidad`.
 *
 * Si `siteConfig.redes` está vacío (estado actual), muestra placeholder
 * teatral con mailto fallback. Cuando llegan las URLs, render condicional
 * activa las cards con hover lift.
 *
 * Esta sección reusa lógica de `ComunidadRedes.tsx` del home pero queda
 * separada para que cada path tenga su tono propio: acá el foco es la
 * comunidad masiva (docentes/escuelas/lectores), no la conversión.
 */
export function SumateComunidad() {
  const redes = siteConfig.redes;
  const activas = (Object.keys(redesMap) as RedKey[]).filter((k) =>
    Boolean(redes[k]),
  );
  const hayRedes = activas.length > 0;

  return (
    <section
      id="comunidad"
      data-section="sumate-comunidad"
      className="relative scroll-mt-24 bg-white py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-screen-xl px-5 md:px-10">
        {/* Header de sección */}
        <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <Eyebrow dashClass="w-14">01 · Comunidad</Eyebrow>
            <h2
              className="font-display text-azul-principal mt-5 leading-[1.05] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.85rem, 3.8vw, 2.75rem)" }}
            >
              Donde la conversación está viva.
            </h2>
          </div>
          <p className="text-gris-texto font-sans text-[0.98rem] leading-relaxed md:col-span-5 md:text-right">
            Reflexiones, recursos y novedades de la comunidad docente que piensa
            la matemática escolar.
          </p>
        </div>

        {hayRedes ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-7">
            {activas.map((key) => {
              const { label, Icon, handle } = redesMap[key];
              const url = redes[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border-azul-principal/10 hover:border-verde-concepto/60 hover:shadow-azul-principal/10 relative flex flex-col rounded-2xl border bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <Icon
                    size={32}
                    className="text-azul-principal group-hover:text-verde-concepto transition-colors duration-500"
                    aria-hidden="true"
                  />
                  <p className="font-display text-h3 text-azul-principal mt-6 font-medium">
                    {label}
                  </p>
                  <p className="text-gris-texto mt-1 font-sans text-[0.88rem]">
                    {handle}
                  </p>
                  <span className="text-verde-concepto mt-7 inline-flex items-center gap-2 font-sans text-[0.88rem] font-medium transition-all duration-500 group-hover:gap-3">
                    Seguir
                    <ArrowRight size={14} />
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="border-azul-principal/10 bg-gris-fondo relative rounded-2xl border p-10 text-center md:p-14">
              <span
                aria-hidden="true"
                className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 gap-2"
              >
                <span className="bg-verde-concepto block h-1.5 w-1.5 rounded-full" />
                <span className="bg-verde-concepto/60 block h-1.5 w-1.5 rounded-full" />
                <span className="bg-verde-concepto/30 block h-1.5 w-1.5 rounded-full" />
              </span>

              <p className="text-verde-concepto font-sans text-[0.72rem] font-medium tracking-[0.26em] uppercase">
                Pronto en redes
              </p>
              <p className="font-display text-azul-principal mt-5 text-[1.4rem] leading-snug font-medium md:text-[1.65rem]">
                Estamos preparando nuestros canales para sumarte a la
                conversación.
              </p>
              <p className="text-gris-texto mt-5 font-sans text-[0.95rem]">
                Mientras tanto, escribinos directo:
              </p>
              <a
                href={`mailto:${siteConfig.contacto.email}`}
                className="border-azul-principal/15 text-azul-principal hover:border-verde-concepto hover:shadow-azul-principal/10 mt-5 inline-flex items-center gap-3 rounded-full border bg-white px-6 py-3 font-sans text-[1rem] font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <MailOutline size={18} className="text-verde-concepto" />
                {siteConfig.contacto.email}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
