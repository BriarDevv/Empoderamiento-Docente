import Link from "next/link";
import { Brand } from "./Brand";
import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import {
  Instagram,
  Linkedin,
  Facebook,
  MailOutline,
  ArrowRight,
} from "@/components/ui/icons";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Investigación", href: "/recursos" },
  { label: "Formación", href: "/formacion" },
  { label: "Contacto", href: "/contacto" },
] as const;

const redesIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const redes = siteConfig.redes;
  const redesActivas = (
    Object.entries(redesIcons) as Array<
      [keyof typeof redesIcons, typeof Instagram]
    >
  ).filter(([key]) => Boolean(redes[key]));
  const hayRedes = redesActivas.length > 0;

  return (
    <footer
      className="bg-azul-principal relative isolate overflow-hidden text-white"
      data-section="footer"
    >
      {/* Composición canónica del manual §6: círculo verde sólido +
          dots azul-claro sobre el navy. */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto absolute -right-32 -bottom-40 z-0 h-[28rem] w-[28rem] rounded-full md:h-[34rem] md:w-[34rem]"
      />
      <span
        aria-hidden="true"
        className="absolute right-32 bottom-24 z-0 hidden h-44 w-44 bg-[radial-gradient(circle,rgba(255,255,255,0.18)_2.5px,transparent_3px)] [background-size:22px_22px] md:block"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-5 py-10 md:px-10 md:py-14">
        {/* ── Bloque CTA + ecuación combinados ───────────────────── */}
        <div className="grid items-end gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <Eyebrow variant="light" dashClass="w-10">
              Sumate al ciclo
            </Eyebrow>
            <h2
              className="font-display mt-4 leading-[1.05] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)" }}
            >
              Investigamos para{" "}
              <span className="text-verde-concepto">transformar</span> la
              matemática escolar.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-4 md:justify-end">
            <ButtonPrimary href="/#comunidad">Sumate</ButtonPrimary>
            <Link
              href="/contacto"
              className="text-azul-claro inline-flex items-center gap-2 font-sans text-[0.9rem] font-medium transition-colors hover:text-white"
            >
              Contactanos
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Ecuación editorial — pegada al bloque CTA */}
        <p className="border-azul-medio/25 font-display text-azul-claro/90 mt-8 max-w-3xl border-t pt-6 text-[0.95rem] leading-snug md:text-[1.05rem]">
          Investigación <span className="text-verde-concepto">+</span> Acción{" "}
          <span className="text-verde-concepto">+</span> Reflexión{" "}
          <span className="text-verde-concepto">+</span> Alianzas{" "}
          <span className="text-naranja-accion">=</span>{" "}
          <span className="text-white">Transformación educativa.</span>
        </p>

        {/* ── Grid principal ─────────────────────────────────────── */}
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:gap-8">
          {/* Marca */}
          <div className="md:col-span-5">
            <Brand variant="full" tone="light" asLink={false} />
            <p className="text-azul-claro/90 mt-4 max-w-sm font-sans text-[0.88rem] leading-relaxed">
              Desarrollo profesional docente y resignificación del conocimiento
              matemático escolar. Presencia en {siteConfig.paises.join(", ")}.
            </p>
          </div>

          {/* Navegar */}
          <nav className="md:col-span-3" aria-labelledby="footer-navegar">
            <h3
              id="footer-navegar"
              className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase"
            >
              Navegar
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center font-sans text-[0.95rem] text-white/90 transition-colors hover:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-verde-concepto mr-0 inline-block h-px w-0 transition-all duration-300 group-hover:mr-2 group-hover:w-4"
                    />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Comunidad (render condicional) */}
          {hayRedes && (
            <nav className="md:col-span-2" aria-labelledby="footer-comunidad">
              <h3
                id="footer-comunidad"
                className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase"
              >
                Comunidad
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {redesActivas.map(([key, Icon]) => {
                  const url = redes[key];
                  if (!url) return null;
                  return (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2.5 font-sans text-[0.95rem] text-white/90 hover:text-white"
                      >
                        <Icon
                          size={16}
                          className="group-hover:text-verde-concepto transition-colors"
                          aria-hidden="true"
                        />
                        <span className="capitalize">{key}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {/* Contacto */}
          <div
            className={hayRedes ? "md:col-span-2" : "md:col-span-4"}
            aria-labelledby="footer-contacto"
          >
            <h3
              id="footer-contacto"
              className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase"
            >
              Contacto
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${siteConfig.contacto.email}`}
                  className="group inline-flex items-center gap-2.5 font-sans text-[0.95rem] text-white/90 hover:text-white"
                >
                  <MailOutline
                    size={15}
                    className="group-hover:text-verde-concepto transition-colors"
                    aria-hidden="true"
                  />
                  <span>{siteConfig.contacto.email}</span>
                </a>
              </li>
              <li>
                <address className="text-azul-claro/80 font-sans text-[0.9rem] leading-relaxed not-italic">
                  {siteConfig.contacto.direccion.calle}
                  <br />
                  {siteConfig.contacto.direccion.ciudad},{" "}
                  {siteConfig.contacto.direccion.pais}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div className="border-azul-medio/25 mt-10 flex flex-col gap-2 border-t pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-azul-claro/70 font-sans text-[0.78rem] tracking-wide">
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p className="text-azul-claro/60 font-sans text-[0.78rem] tracking-wide italic">
            Investigamos lo que hacemos, hacemos lo que investigamos.
          </p>
        </div>
      </div>
    </footer>
  );
}
