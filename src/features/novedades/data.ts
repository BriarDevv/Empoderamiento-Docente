// Contenido de Novedades.
//
// OJO: todo esto es PLACEHOLDER anclado en producción real de ED (RELIME 2025,
// Bolema 2025, el libro de Socioepistemología, los 5 países, los aliados) para
// que se vea creíble mientras no haya CMS. Las fechas, bajadas y algunos
// títulos son tentativos → PENDIENTE de reemplazar por el material real del
// cliente. No inventar links a papers ni datos que no tengamos.

import type { ReactElement } from "react";
import {
  BookOpen,
  Users,
  Target,
  TrendingUp,
  Compass,
  type IconProps,
} from "@/components/ui/icons";

export type CategoriaKey =
  | "publicaciones"
  | "eventos"
  | "convocatorias"
  | "prensa"
  | "alianzas";

export type Categoria = {
  key: CategoriaKey;
  label: string;
  Icon: (props: IconProps) => ReactElement;
};

// Fecha ISO → "15 jul 2026" (sin arrastrar libs de fecha ni depender del locale
// del navegador, que rompería la hidratación).
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export function fechaCorta(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${y}`;
}

// El orden acá manda el orden de los chips de filtro.
export const CATEGORIAS: Categoria[] = [
  { key: "publicaciones", label: "Publicaciones", Icon: BookOpen },
  { key: "eventos", label: "Eventos", Icon: Users },
  { key: "convocatorias", label: "Convocatorias", Icon: Target },
  { key: "prensa", label: "Prensa", Icon: TrendingUp },
  { key: "alianzas", label: "Alianzas", Icon: Compass },
];

export const CATEGORIA_LABEL: Record<CategoriaKey, string> = Object.fromEntries(
  CATEGORIAS.map((c) => [c.key, c.label]),
) as Record<CategoriaKey, string>;

export type Novedad = {
  id: string;
  /** ISO (YYYY-MM-DD) — se formatea a mano para no arrastrar libs de fecha. */
  fecha: string;
  categoria: CategoriaKey;
  titulo: string;
  bajada: string;
  imagen: string;
  /** Solo una debería ser la de tapa. */
  destacada?: boolean;
};

// Listado de novedades. La primera con destacada:true es la "nota de tapa".
export const NOVEDADES: Novedad[] = [
  {
    id: "libro-socioepistemologia",
    fecha: "2026-07-15",
    categoria: "publicaciones",
    // "el libro" era redundante: la categoría ya dice PUBLICACIONES y la bajada
    // arranca contando que es un libro.
    titulo: "Sale «Empoderamiento docente y Socioepistemología»",
    bajada:
      "Reunimos años de investigación y trabajo con escuelas en un libro que piensa la matemática escolar desde sus usos, sus prácticas y quienes la enseñan.",
    imagen: "/hero/hero-2.webp",
    destacada: true,
  },
  {
    id: "relime-2025",
    fecha: "2026-06-02",
    categoria: "publicaciones",
    titulo: "Nuevo artículo en RELIME sobre resignificación del saber escolar",
    bajada:
      "Publicamos en la Revista Latinoamericana de Investigación en Matemática Educativa un estudio sobre cómo se resignifica el conocimiento matemático en el aula.",
    imagen: "/quienes-somos/origen-03-pregunta.webp",
  },
  {
    id: "congreso-2026",
    fecha: "2026-05-20",
    categoria: "eventos",
    titulo: "ED en el encuentro regional de educación matemática",
    bajada:
      "Compartimos hallazgos y talleres junto a docentes de la región: tres días de matemática funcional, tareas disruptivas y práctica reflexiva.",
    imagen: "/hero/hero-6.webp",
  },
  {
    id: "bolema-2025",
    fecha: "2026-04-11",
    categoria: "publicaciones",
    titulo: "Capítulo en Bolema: matemática funcional y tareas disruptivas",
    bajada:
      "Un recorrido por las tareas que rompen con la matemática de reglas y ponen el saber a funcionar en situaciones reales.",
    imagen: "/metodo/disenamos.webp",
  },
  {
    id: "alianza-nueva",
    fecha: "2026-03-28",
    categoria: "alianzas",
    titulo: "Sumamos una nueva alianza institucional",
    bajada:
      "Ampliamos la red que sostiene el desarrollo profesional docente: más escuelas, más territorios, la misma apuesta situada.",
    imagen: "/hero/hero-9.webp",
  },
  {
    id: "convocatoria-red",
    fecha: "2026-03-05",
    categoria: "convocatorias",
    titulo: "Abrimos la convocatoria a la red docente",
    bajada:
      "Buscamos docentes que quieran investigar su propia práctica y llevar la matemática funcional a sus aulas. No es una capacitación: es una comunidad.",
    imagen: "/metodo/acompanamos.webp",
  },
  {
    id: "prensa-nota",
    fecha: "2026-02-18",
    categoria: "prensa",
    titulo: "ED en los medios: «enseñar matemática de otra manera»",
    bajada:
      "Una nota sobre por qué el problema no son los chicos ni los docentes, sino la matemática que la escuela decidió enseñar.",
    imagen: "/quienes-somos/origen-01-aulas.webp",
  },
  {
    id: "taller-2025",
    fecha: "2025-11-22",
    categoria: "eventos",
    titulo: "Cerramos el ciclo de talleres 2025",
    bajada:
      "Un año de encuentros con equipos docentes en cinco países, poniendo a prueba en el aula lo que investigamos.",
    imagen: "/metodo/escuchamos.webp",
  },
  {
    id: "recurso-guias",
    fecha: "2025-09-10",
    categoria: "publicaciones",
    titulo: "Nuevas guías para el desarrollo del pensamiento matemático",
    bajada:
      "Materiales abiertos para llevar directo al aula, pensados con y para docentes.",
    imagen: "/metodo/evaluamos.webp",
  },
];

// ── "ED en movimiento" — la escena de profundidad (cards que se acercan) ──────
// Cada momento sale de la luz del faro en el horizonte y viene hacia el usuario
// con el scroll. La etiqueta (mono) es corta y va arriba de cada card; la frase
// es lo que aparece grande al centro cuando ese momento pasa cerca.
export type MomentoMovimiento = {
  id: string;
  etiqueta: string;
  frase: string;
  /**
   * Tramo de `frase` que va en verde-concepto (DESIGN §6: el verde nombra el
   * concepto, igual que "y recursos" en el hero de Biblioteca o "transformar."
   * en el de Investigación). Debe ser un substring EXACTO de `frase`; si no
   * matchea, la frase se muestra entera en blanco.
   */
  acento: string;
  imagen: string;
};

export const MOVIMIENTO: MomentoMovimiento[] = [
  { id: "aulas", etiqueta: "EN LAS AULAS", frase: "Empieza en el aula.", acento: "el aula.", imagen: "/quienes-somos/origen-01-aulas.webp" },
  { id: "docentes", etiqueta: "CON DOCENTES", frase: "Junto a quienes enseñan.", acento: "quienes enseñan.", imagen: "/metodo/escuchamos.webp" },
  { id: "investigacion", etiqueta: "INVESTIGACIÓN", frase: "Investigamos lo que hacemos.", acento: "lo que hacemos.", imagen: "/quienes-somos/origen-03-pregunta.webp" },
  { id: "diseno", etiqueta: "DISEÑO", frase: "Diseñamos tareas que importan.", acento: "tareas que importan.", imagen: "/metodo/disenamos.webp" },
  { id: "congresos", etiqueta: "CONGRESOS", frase: "Lo llevamos a la región.", acento: "a la región.", imagen: "/hero/hero-6.webp" },
  { id: "paises", etiqueta: "CINCO PAÍSES", frase: "En cinco países, a la vez.", acento: "cinco países", imagen: "/hero/hero-9.webp" },
];

// ── Lanzamientos y recursos recientes (puente a Biblioteca) ───────────────────
export type Lanzamiento = {
  id: string;
  tipo: string;
  titulo: string;
  imagen: string;
};

export const LANZAMIENTOS: Lanzamiento[] = [
  { id: "l-libro", tipo: "Libro", titulo: "Empoderamiento docente y Socioepistemología", imagen: "/hero/hero-2.webp" },
  { id: "l-relime", tipo: "Artículo · RELIME 2025", titulo: "Resignificación del conocimiento matemático escolar", imagen: "/quienes-somos/origen-03-pregunta.webp" },
  { id: "l-bolema", tipo: "Capítulo · Bolema 2025", titulo: "Matemática funcional y tareas disruptivas", imagen: "/metodo/disenamos.webp" },
  { id: "l-guias", tipo: "Guías", titulo: "Desarrollo del pensamiento matemático", imagen: "/metodo/evaluamos.webp" },
  { id: "l-taller", tipo: "Materiales", titulo: "Del ciclo de talleres 2025", imagen: "/metodo/acompanamos.webp" },
];
