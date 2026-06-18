// Navegación canónica del sitio — fuente única.
//
// El navbar (desktop + mobile) y el footer consumen estos arrays. Nunca
// hardcodear labels ni hrefs en los componentes: agregar/editar acá.
// Labels alineados al GLOSSARY (docs/GLOSSARY.md §UI) y al brief de nav.

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

// Links principales visibles en la barra (desktop) y apilados (mobile).
// ED tiene 7 páginas: Inicio + estas 5 + Contacto (CTA).
export const NAV_LINKS: readonly NavLink[] = [
  { label: "Qué hacemos", href: "/que-hacemos" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Investigación", href: "/investigacion" },
  { label: "Biblioteca", href: "/biblioteca" },
  { label: "Novedades", href: "/novedades" },
] as const;

export const HOME_LINK: NavLink = { label: "Inicio", href: "/" } as const;

// CTA naranja (único acento de acción del nav). Texto confirmado: "Contacto".
export const CTA_LINK: NavLink = {
  label: "Contacto",
  href: "/contacto",
} as const;

// Search del MVP: no hay buscador global todavía → lleva a la Biblioteca con
// foco en su buscador. Cuando exista search global, repuntar este href.
export const SEARCH_HREF = "/biblioteca#buscador" as const;
