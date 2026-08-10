// Contenido de Investigación — del modelo conceptual oficial de ED.
//
// El copy es real; algunas descripciones son síntesis propia a partir del
// modelo → VALIDAR el fraseo con el cliente. La producción académica es real
// (RELIME 2025, Bolema 2025, el libro), pero falta año/editorial/DOIs: cuando
// lleguen, cada ítem enlaza a su ficha en la Biblioteca.

// ── Las 7 líneas de investigación ─────────────────────────────────────────────
export type Linea = { n: string; t: string; d: string };
export const LINEAS: Linea[] = [
  { n: "01", t: "Resignificación del conocimiento matemático escolar", d: "Cambiar la comprensión, los usos y la relación con el saber matemático." },
  { n: "02", t: "Problematización de la matemática escolar", d: "Poner en cuestión lo dado para volver a construirlo con sentido." },
  { n: "03", t: "Tareas disruptivas y matemática funcional", d: "Situaciones que rompen la rutina y le devuelven el uso a la matemática." },
  { n: "04", t: "Desarrollo del pensamiento matemático", d: "Lo algebraico, lo geométrico y lo numérico, trabajados en profundidad." },
  { n: "05", t: "Desarrollo profesional docente sostenido", d: "Acompañamiento que dura en el tiempo, no un curso que empieza y termina." },
  { n: "06", t: "Relación con el conocimiento y empoderamiento docente", d: "Cómo cada docente se para frente al saber que enseña." },
  { n: "07", t: "Evaluación e impacto en aprendizajes", d: "Evidencia de que la transformación efectivamente llega al aula." },
];

// ── Frase epistemológica (Socioepistemología), tokenizada ─────────────────────
// key = palabra que se enciende en verde.
export type Token = { t: string; key?: boolean };
export const FRASE: Token[] = [
  { t: "El" }, { t: "conocimiento" }, { t: "matemático" }, { t: "es" }, { t: "una" },
  { t: "construcción", key: true }, { t: "social", key: true }, { t: "situada", key: true },
  { t: "que" }, { t: "adquiere" }, { t: "sentido" }, { t: "en" }, { t: "las" },
  { t: "prácticas,", key: true }, { t: "los" }, { t: "usos", key: true }, { t: "y" }, { t: "las" },
  { t: "relaciones", key: true }, { t: "que" }, { t: "las" }, { t: "personas" },
  { t: "establecen" }, { t: "con" }, { t: "él." },
];

// ── Ciclo de investigación aplicada — 4 fases (motor: la problematización) ─────
export type Fase = { n: string; t: string; sub: string; d: string };
export const NUCLEO = "problematizar la matemática escolar";
export const FASES: Fase[] = [
  { n: "01", t: "Fase experiencial", sub: "«Vivir para hacer vivir»", d: "Los docentes vivencian tareas disruptivas que problematizan la matemática escolar." },
  { n: "02", t: "Implementación en aula", sub: "Del taller a la clase", d: "Diseñan e implementan situaciones de aprendizaje con sus estudiantes." },
  { n: "03", t: "Práctica reflexiva", sub: "Mirar lo que pasó", d: "Análisis colectivo de las experiencias, los argumentos y las evidencias de aprendizaje." },
  { n: "04", t: "Resignificación del cme", sub: "Otra relación con el saber", d: "Cambios en la comprensión del conocimiento, en sus usos y en la relación con la matemática escolar." },
];

// ── Feedback loop — "Volvemos a investigar" (4 pasos) ─────────────────────────
export type Paso = { t: string; d: string };
export const PASOS: Paso[] = [
  { t: "Recolección de evidencias", d: "Observaciones, producciones, registros de clase y resultados de aprendizaje." },
  { t: "Análisis e interpretación", d: "Procesos de resignificación y cambios en la relación con el conocimiento." },
  { t: "Producción de conocimiento", d: "Informes, publicaciones y modelos teóricos y metodológicos propios." },
  { t: "Retroalimentación del ciclo", d: "Los hallazgos orientan nuevas acciones y proyectos. El ciclo continúa." },
];

// ── Investigación en acción — producción académica REAL (escena de profundidad) ─
export type Produccion = { id: string; etiqueta: string; t: string; imagen: string };
export const PRODUCCION_ANCLA = "Empoderamiento docente y Socioepistemología";
export const PRODUCCION: Produccion[] = [
  { id: "libro", etiqueta: "LIBRO", t: "El marco teórico, hecho libro", imagen: "/hero/hero-2.webp" },
  { id: "relime", etiqueta: "ARTÍCULO · RELIME 2025", t: "Investigación en Matemática Educativa", imagen: "/quienes-somos/origen-03-pregunta.webp" },
  { id: "bolema", etiqueta: "ARTÍCULO · BOLEMA 2025", t: "Boletim de Educação Matemática", imagen: "/metodo/disenamos.webp" },
  { id: "congresos", etiqueta: "CONGRESOS", t: "Ponencias internacionales", imagen: "/hero/hero-6.webp" },
  { id: "redes", etiqueta: "REDES", t: "Comunidades de investigación en América Latina", imagen: "/hero/hero-9.webp" },
];

// Frases al centro de la escena de profundidad (lo que se acumula → conocimiento).
export const ACCION_FRASES = [
  "La evidencia se acumula.",
  "Se analiza.",
  "Se vuelve conocimiento.",
  "Publicado, con nombre y año.",
];

// ── Escena de profundidad del HERO — imágenes evocativas que se acercan ────────
// Sin etiquetas: es atmósfera, el titular manda. Fotos de aulas, docentes y el
// trabajo de investigación.
export const HERO_ESCENA = [
  "/quienes-somos/origen-01-aulas.webp",
  "/metodo/escuchamos.webp",
  "/quienes-somos/origen-03-pregunta.webp",
  "/metodo/disenamos.webp",
  "/hero/hero-6.webp",
  "/quienes-somos/origen-02-inflexion.webp",
];

// ── Cierre — la ecuación de ED ────────────────────────────────────────────────
export const ECUACION_TERMINOS = ["Investigación", "Acción", "Reflexión", "Alianzas"] as const;
export const ECUACION_RESULTADO = "Transformación";
export const ECUACION_TAGLINE =
  "Investigamos lo que hacemos, hacemos lo que investigamos y transformamos la educación.";
