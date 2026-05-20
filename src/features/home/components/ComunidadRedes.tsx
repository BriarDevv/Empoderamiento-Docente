import {
  Instagram,
  Linkedin,
  Facebook,
  MailOutline,
  ArrowRight,
} from "@/components/ui/icons";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
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

export function ComunidadRedes() {
  const redes = siteConfig.redes;
  const activas = (Object.keys(redesMap) as RedKey[]).filter((k) =>
    Boolean(redes[k]),
  );
  const hayRedes = activas.length > 0;

  return (
    <section
      id="comunidad"
      data-section="comunidad"
      className="relative bg-white py-28 md:py-40"
    >
      {/* Page marker */}
      <span
        aria-hidden="true"
        className="text-azul-principal/30 absolute top-10 right-5 hidden font-sans text-[0.7rem] tracking-[0.3em] uppercase md:right-10 md:block"
      >
        004 / Comunidad
      </span>

      {/* Decoración: dash verde grueso a la izquierda */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute top-1/2 left-0 h-32 w-1 -translate-y-1/2"
      />

      <div className="relative mx-auto max-w-screen-xl px-5 md:px-10">
        <div
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          data-anim="comunidad-intro"
        >
          <Eyebrow dashClass="w-14">Sumate</Eyebrow>
          <h2
            className="font-display text-azul-principal mt-7 leading-[0.98] font-bold tracking-[-0.025em]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.75rem)" }}
          >
            Sumate a la <Highlight>comunidad</Highlight>.
          </h2>
          <p className="text-gris-texto mt-7 max-w-xl font-sans text-[1.05rem] leading-relaxed md:text-[1.15rem]">
            Encontranos donde la conversación está viva. Reflexiones, recursos y
            novedades de la comunidad docente que piensa la matemática escolar.
          </p>
        </div>

        {hayRedes ? (
          <div
            data-anim="comunidad-cards"
            className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-7"
          >
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
          <div
            data-anim="comunidad-placeholder"
            className="mx-auto mt-16 max-w-2xl"
          >
            <div className="border-azul-principal/10 bg-gris-fondo relative rounded-2xl border p-10 text-center md:p-14">
              {/* Decoración: dots arriba */}
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
              <p className="font-display text-azul-principal mt-5 text-[1.45rem] leading-snug font-medium md:text-[1.75rem]">
                Estamos preparando nuestros canales para sumarte a la
                conversación.
              </p>
              <p className="text-gris-texto mt-6 font-sans text-[0.96rem]">
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
