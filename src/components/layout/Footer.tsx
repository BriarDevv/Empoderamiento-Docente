import Link from "next/link";
import { Brand } from "./Brand";
import { siteConfig } from "@/config/site";
import {
  Instagram,
  Linkedin,
  Facebook,
  MailOutline,
} from "@/components/ui/icons";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Investigación", href: "/recursos" },
  { label: "Formación", href: "/formacion" },
  { label: "Contacto", href: "/contacto" },
  // Sumate aparece en footer (no en header — el header lo tiene como CTA).
  // Da visibilidad al hub /sumate desde la navegación institucional.
  { label: "Sumate", href: "/sumate" },
  { label: "Trabajá con nosotros", href: "/sumate#equipo" },
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
      className="bg-azul-principal relative overflow-hidden text-white"
      data-section="footer"
    >
      {/* Decoración: media circunferencia verde sutil */}
      <span
        aria-hidden="true"
        className="bg-verde-concepto/15 absolute -right-20 -bottom-32 h-80 w-80 rounded-full"
      />
      {/* Decoración: patrón de puntos */}
      <span
        aria-hidden="true"
        className="absolute top-10 left-1/2 h-32 w-32 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:14px_14px] opacity-[0.06]"
      />

      <div className="relative mx-auto max-w-screen-xl px-5 py-16 md:px-10 md:py-20">
        {/* Equation de cierre — eco directo de la infografía oficial */}
        <p className="font-display max-w-3xl text-[1.35rem] leading-snug md:text-[1.65rem]">
          Investigación <span className="text-verde-concepto">+</span> Acción{" "}
          <span className="text-verde-concepto">+</span> Reflexión{" "}
          <span className="text-verde-concepto">+</span> Alianzas{" "}
          <span className="text-verde-concepto">=</span>{" "}
          <span className="text-azul-claro">Transformación educativa.</span>
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          {/* Marca */}
          <div className="md:col-span-5">
            <Brand variant="compact" tone="light" asLink={false} />
            <p className="text-azul-claro/90 mt-5 max-w-sm font-sans text-[0.95rem] leading-relaxed">
              Investigamos para transformar la matemática escolar. Desarrollo
              profesional docente con presencia en{" "}
              {siteConfig.paises.join(", ")}.
            </p>
          </div>

          {/* Navegar */}
          <nav className="md:col-span-3" aria-labelledby="footer-navegar">
            <h2
              id="footer-navegar"
              className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase"
            >
              Navegar
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
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

          {/* Comunidad — render condicional */}
          {hayRedes && (
            <nav className="md:col-span-2" aria-labelledby="footer-comunidad">
              <h2
                id="footer-comunidad"
                className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase"
              >
                Comunidad
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {redesActivas.map(([key, Icon]) => {
                  const url = redes[key];
                  if (!url) return null;
                  return (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-sans text-[0.95rem] text-white/90 hover:text-white"
                      >
                        <Icon size={16} aria-hidden="true" />
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
            <h2
              id="footer-contacto"
              className="text-azul-claro/70 font-sans text-[0.72rem] font-medium tracking-[0.22em] uppercase"
            >
              Contacto
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.contacto.email}`}
                  className="inline-flex items-center gap-2 font-sans text-[0.95rem] text-white/90 hover:text-white"
                >
                  <MailOutline size={15} aria-hidden="true" />
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

        <div className="border-azul-medio/25 mt-14 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-azul-claro/70 font-sans text-[0.78rem] tracking-wide">
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p className="text-azul-claro/60 font-sans text-[0.78rem] tracking-wide">
            Investigamos lo que hacemos, hacemos lo que investigamos.
          </p>
        </div>
      </div>
    </footer>
  );
}
