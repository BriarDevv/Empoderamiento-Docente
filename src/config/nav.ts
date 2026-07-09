/**
 * Navegación principal del sitio.
 *
 * "Inicio" NO va como link de texto: el LOGO es el acceso a Inicio (cliqueable).
 * "Contacto" se rinde como CTA (naranja), no como link de texto, para respetar
 * la regla del manual (naranja solo en acciones).
 */
export const NAV_LINKS = [
  { label: "Qué hacemos", href: "/que-hacemos" },
  { label: "Qué es ED", href: "/que-es-ed" },
  { label: "Investigación", href: "/investigacion" },
  { label: "Biblioteca", href: "/biblioteca" },
  { label: "Novedades", href: "/novedades" },
] as const;

export const CTA_LINK = { label: "Contacto", href: "/contacto" } as const;
export const HOME_LINK = { label: "Inicio", href: "/" } as const;
