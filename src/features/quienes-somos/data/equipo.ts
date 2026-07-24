/**
 * EQUIPO ED — fuente única de datos de las personas que sostienen ED.
 *
 * Centraliza el roster que antes vivía inline en ImpulsanEd.tsx para que las
 * tarjetas y el perfil full-screen (shell) consuman la misma estructura y sea
 * reutilizable en la Parte 2 (recorrido inmersivo por persona).
 *
 * JERARQUÍA institucional del cliente (Equipo ED.docx) — `tier`:
 *   1. Dirección General            → Daniela (nivel exclusivo)
 *   2. Dirección Académica          → Karla
 *   3. Líderes de área y proyecto   → Iván · Judith · Gabriela · Marcela
 *   4. Facilitación y diseño         → las seis restantes
 *
 * `imagePosition`: object-position individual por foto (encuadres reales muy
 * dispares: retratos, selfies, planos enteros y una landscape). Ubica el rostro
 * sin recortarlo mal. Afinado sobre las fotos reales de /public/equipo.
 *
 * DATOS REALES ÚNICAMENTE. Campos pendientes del cliente (no inventar):
 *   - `linkedin`: nadie tiene URL todavía → el shell/ficha lo muestra deshabilitado.
 *   - `pubs`: solo quienes ya las aportaron.
 *   - Andrea Vergara y Luis López: aún sin foto en carpeta → fuera del array.
 *   - Trayectoria / investigaciones / materiales: Parte 2 (no en esta etapa).
 */

export type Publicacion = { titulo: string; url?: string };

export type Tier = 1 | 2 | 3 | 4;

/* ─────────────────────────────────────────────────────────────────────────
 * PERFIL INMERSIVO (Parte 2) — motor de datos reutilizable.
 *
 * `Persona.profile` es OPCIONAL: solo las personas con recorrido desarrollado
 * lo tienen. Hoy únicamente Daniela (caso modelo). El resto conserva el shell
 * básico de la Parte 1. Para sumar otra persona luego alcanza con cargar su
 * `Profile`: el mismo componente (ImmersiveProfile) se adapta a la cantidad
 * real de etapas, hitos y publicaciones — sin duplicar animación ni layout.
 *
 * Familias de color (acento, nunca fondo por etapa — ver DESIGN.md §manual):
 *   verde   → aula / origen / concepto (empoderamiento) / convergencia
 *   azul    → investigación y saber
 *   naranja → transformación y política (acento puntual, uso mínimo)
 * ──────────────────────────────────────────────────────────────────────── */

export type ProfileColor = "verde" | "azul" | "naranja";

/** Hito puntual dentro de una etapa (cargo, tesis, diseño…). */
export type Milestone = {
  period?: string;
  title: string;
  detail?: string;
  /** Se destaca por sobre el resto (p. ej. Directora General de ED). */
  primary?: boolean;
};

/** Ramificación menor de una etapa (estancias internacionales, señales). */
export type Branch = {
  period?: string;
  place: string;
  detail: string;
};

/** Pieza de producción. Sin portada real → card tipográfica (no inventar portada). */
export type ProfilePublication = {
  year?: string;
  kind: "Libro" | "Artículo" | "Colección" | "Materiales";
  title: string;
  meta?: string;
  /** Conceptos representativos (colección de materiales), no ISBN ni catálogo. */
  concepts?: string[];
  featured?: boolean;
};

/** Categoría lateral persistente (orientación durante el recorrido). */
export type ProfileCategory = { id: string; label: string; color: ProfileColor };

/**
 * Composición visual de la etapa dentro del recorrido (variedad editorial,
 * no "otra card blanca más"):
 *   editorial → bloque amplio sin chrome: título grande + texto + lista mínima.
 *   ficha     → panel breve y acotado (títulos académicos) + ramas satélite.
 *   concepto  → tratamiento tipográfico: cita destacada + línea sostenida.
 *   hitos     → 1-2 hitos primarios con aire + secundarios en línea compacta.
 *   mapa      → etiquetas territoriales sueltas (constelación, no lista).
 *   ramas     → piezas editoriales como ramificaciones del camino.
 *   sintesis  → hito primario protagonista + roles actuales compactos.
 */
export type StageVariant =
  | "editorial"
  | "ficha"
  | "concepto"
  | "hitos"
  | "mapa"
  | "ramas"
  | "sintesis";

/** Una de las etapas del recorrido (7 en Daniela; variable en otras personas). */
export type ProfileStage = {
  id: string;
  /** Número de etapa 1..N — se muestra y ancla el nodo del camino. */
  n: number;
  /** Categoría lateral que se activa al entrar a esta etapa. */
  categoryId: string;
  eyebrow: string;
  color: ProfileColor;
  period?: string;
  title: string;
  body: string;
  /** Composición visual de la etapa. Default: "editorial". */
  variant?: StageVariant;
  /** Cita textual REAL destacable (p. ej. título validado de la tesis). */
  quote?: string;
  milestones?: Milestone[];
  branches?: Branch[];
  /** Etiquetas sintéticas (p. ej. países de la etapa internacional). */
  tags?: string[];
  publications?: ProfilePublication[];
};

/**
 * Recorrido inmersivo completo de una persona. `identity` (nombre, cargo, país)
 * vive en la `Persona`; acá se agrega la narrativa, la fotografía recortada y
 * las etapas. Estructura pensada para reutilizar: cargar datos → elegir etapas
 * → asignar imagen → mismo motor.
 */
export type Profile = {
  /** Nombre completo validado (difiere del `nombre` corto de la card). */
  fullName: string;
  role: string;
  location: string;
  origin?: string;
  /** Figura recortada con fondo transparente (capa del hero). */
  cutout: string;
  cutoutPosition?: string;
  headline: string;
  intro: string;
  formation: string[];
  categories: ProfileCategory[];
  stages: ProfileStage[];
  closing: { title: string; body: string; body2?: string };
};

export type Persona = {
  /** slug — coincide con el archivo /public/equipo/{key}.jpg */
  key: string;
  nombre: string;
  rol: string;
  pais: string;
  tier: Tier;
  /** Bio oficial. Se preserva del sistema anterior; se muestra en el perfil (Parte 2). */
  bio: string;
  /** object-position del <img> para encuadrar el rostro según la foto real. */
  imagePosition: string;
  linkedin?: string;
  pubs?: Publicacion[];
  /** Recorrido inmersivo (Parte 2). Solo quienes lo tienen desarrollado. */
  profile?: Profile;
};

/** Rótulo institucional por nivel jerárquico. */
export const TIER_ROTULO: Record<Tier, string> = {
  1: "Dirección general",
  2: "Dirección académica",
  3: "Líderes de área y proyecto",
  4: "Facilitación y diseño de materiales",
};

export const EQUIPO: Persona[] = [
  {
    key: "daniela-reyes",
    nombre: "Daniela Reyes",
    rol: "Directora General",
    pais: "Argentina",
    tier: 1,
    imagePosition: "50% 20%",
    bio: "Especialista en desarrollo profesional docente y desarrollo del pensamiento matemático. Profesora de Matemática. Doctora en Ciencias con especialidad en Matemática Educativa.",
    profile: {
      fullName: "Daniela Reyes-Gasperini",
      role: "Dirección General",
      location: "Santiago de Chile, Chile",
      origin: "Buenos Aires, Argentina",
      cutout: "/equipo/daniela-reyes-cutout.webp",
      cutoutPosition: "50% 22%",
      headline:
        "Del aula a la investigación. De la investigación, a la transformación educativa.",
      intro:
        "Profesora de Matemática, investigadora y asesora educativa. Su recorrido conecta la práctica docente, la Matemática Educativa, el diseño curricular y las políticas de transformación.",
      formation: [
        "Profesora de Matemática",
        "Magíster en Ciencias — Matemática Educativa",
        "Doctora en Ciencias — Matemática Educativa",
        "Especialista en Política y Gestión Educativa",
      ],
      categories: [
        { id: "matematica-educativa", label: "Matemática educativa", color: "azul" },
        { id: "empoderamiento-docente", label: "Empoderamiento docente", color: "verde" },
        { id: "investigacion-aplicada", label: "Investigación aplicada", color: "azul" },
        { id: "desarrollo-profesional", label: "Desarrollo profesional docente", color: "verde" },
        { id: "politica-transformacion", label: "Política y transformación educativa", color: "naranja" },
      ],
      stages: [
        {
          id: "aula",
          n: 1,
          categoryId: "matematica-educativa",
          color: "verde",
          eyebrow: "El aula como origen",
          period: "2008 – 2009",
          variant: "editorial",
          title: "Todo comenzó enseñando Matemática.",
          body: "Daniela comenzó su recorrido como profesora de Matemática en escuelas secundarias de Buenos Aires. La práctica docente fue el punto de partida de una pregunta que atravesaría toda su trayectoria: cómo transformar la relación entre el profesorado, el saber matemático y el aula.",
          milestones: [
            { title: "Colegio Francesco Faà di Bruno", detail: "Profesora de Matemática — Buenos Aires" },
            { title: "Instituto William C. Morris", detail: "Profesora de Matemática — Buenos Aires" },
            {
              title: "Instituto Superior del Profesorado «Dr. Joaquín V. González»",
              detail: "Formación y docencia — Buenos Aires",
            },
          ],
        },
        {
          id: "mexico",
          n: 2,
          categoryId: "investigacion-aplicada",
          color: "azul",
          eyebrow: "Investigar la práctica",
          period: "2009 – 2016",
          variant: "ficha",
          title: "Del aula a la Matemática Educativa.",
          body: "En México, su experiencia docente se convirtió en investigación. Cursó la maestría y el doctorado en Matemática Educativa en el Cinvestav-IPN, profundizando en la socioepistemología y en los procesos de transformación de la práctica docente.",
          milestones: [
            { period: "2009 – 2011", title: "Maestría en Ciencias — Matemática Educativa", detail: "Cinvestav-IPN, México" },
            { period: "2012 – 2016", title: "Doctorado en Ciencias — Matemática Educativa", detail: "Cinvestav-IPN, México" },
          ],
          branches: [
            { period: "2015", place: "Francia", detail: "Estancia doctoral — Université Paris Diderot · Paris 7" },
            { period: "2015", place: "Portugal", detail: "Estancia doctoral — Instituto de Educação, Universidad de Lisboa" },
          ],
        },
        {
          id: "empoderamiento",
          n: 3,
          categoryId: "empoderamiento-docente",
          color: "verde",
          eyebrow: "Una idea toma forma",
          period: "2011 – 2016",
          variant: "concepto",
          title: "Empoderamiento docente desde la socioepistemología.",
          body: "Durante su maestría y doctorado desarrolló una línea de investigación centrada en el empoderamiento docente: no como poder sobre otras personas, sino como la construcción de saber, convicción y herramientas para transformar la práctica educativa.",
          // Título REAL de la línea de tesis (maestría → doctorado) — se muestra
          // UNA vez como cita destacada; los tres trabajos van como línea sostenida.
          quote:
            "Empoderamiento docente desde una visión Socioepistemológica: una alternativa de intervención para el cambio y la mejora educativa.",
          milestones: [
            {
              period: "2011",
              title: "Tesis de maestría",
              detail: "«Empoderamiento docente desde una visión Socioepistemológica: estudio de los factores de cambio en las prácticas del profesor de matemáticas.»",
            },
            {
              period: "2013",
              title: "Memoria predoctoral",
              detail: "«Empoderamiento docente desde una visión Socioepistemológica: una alternativa de intervención para el cambio y la mejora educativa.»",
            },
            {
              period: "2016",
              title: "Tesis doctoral",
              detail: "«Empoderamiento docente desde una visión Socioepistemológica: una alternativa de intervención para el cambio y la mejora educativa.»",
            },
          ],
          publications: [
            {
              year: "2016",
              kind: "Libro",
              title: "Empoderamiento docente y Socioepistemología",
              meta: "Un estudio sobre la transformación educativa en Matemáticas · Editorial Gedisa",
              featured: true,
            },
          ],
        },
        {
          id: "formacion",
          n: 4,
          categoryId: "desarrollo-profesional",
          color: "naranja",
          eyebrow: "De la investigación a la acción",
          period: "2012 – 2020",
          variant: "hitos",
          title: "La investigación se convirtió en trabajo institucional.",
          body: "Su trabajo se expandió hacia la formación de docentes, el diseño curricular, la innovación educativa y la construcción de políticas públicas en Matemáticas.",
          milestones: [
            { period: "2014 – 2017", title: "Diseño del currículo de Matemáticas — Educación Media Superior", detail: "México", primary: true },
            { period: "2018", title: "Dirección Académica e Innovación Educativa", detail: "Secretaría de Educación Pública de México", primary: true },
            { period: "2012 – 2014", title: "Docencia de posgrado para formación docente", detail: "Oaxaca, México" },
            { period: "2016 – 2018", title: "Coordinación académica — Desarrollo Profesional Docente en Matemáticas", detail: "Programa Interdisciplinario, Cinvestav-IPN" },
            { period: "2017 – 2018", title: "Dirección de área y asesoría académica", detail: "Construye T" },
            { period: "2020 – 2023", title: "Consejo Técnico de los Exámenes Nacionales de Ingreso", detail: "CENEVAL" },
          ],
        },
        {
          id: "internacional",
          n: 5,
          categoryId: "politica-transformacion",
          color: "azul",
          eyebrow: "Una mirada que cruza contextos",
          variant: "mapa",
          title: "Argentina, México y Chile: una trayectoria regional.",
          body: "Su recorrido se construyó entre aulas, universidades, ministerios, organizaciones y equipos de distintos países. Esa experiencia regional permitió conectar investigación, práctica docente y transformación institucional.",
          tags: [
            "Argentina",
            "México",
            "Chile",
            "Estancias en Francia y Portugal",
            "Publicación internacional · UNESCO y educación inclusiva",
          ],
        },
        {
          id: "produccion",
          n: 6,
          categoryId: "investigacion-aplicada",
          color: "azul",
          eyebrow: "Investigación, libros y materiales",
          variant: "ramas",
          title: "Investigar para construir herramientas.",
          body: "Su producción articula investigación, formación docente y materiales destinados a transformar la enseñanza de la Matemática.",
          publications: [
            { year: "2013", kind: "Libro", title: "La transversalidad de la proporcionalidad", meta: "Secretaría de Educación Pública de México" },
            { year: "2016", kind: "Libro", title: "Empoderamiento docente y Socioepistemología", meta: "Editorial Gedisa", featured: true },
            { year: "2023", kind: "Artículo", title: "Aprendizaje de las matemáticas: ¿qué, para qué, para quién?", meta: "Con Karla Gómez-Osalde" },
            { year: "2024", kind: "Colección", title: "Matemática en Red", meta: "Coordinación de publicaciones · Ministerio de Educación de la Ciudad de Buenos Aires" },
            { year: "2025", kind: "Artículo", title: "Problematizar la matemática escolar: ¿cómo contribuye al desarrollo profesional docente?" },
            {
              year: "2019",
              kind: "Materiales",
              title: "Plan Nacional Aprender Matemática",
              meta: "Colección de materiales para el desarrollo del pensamiento matemático",
              concepts: ["Inferir", "Medir", "Aproximar", "Comparar", "Equivaler", "Predecir", "Visualizar"],
            },
          ],
        },
        {
          id: "convergencia",
          n: 7,
          categoryId: "empoderamiento-docente",
          color: "verde",
          eyebrow: "La convergencia",
          period: "2020 – actualidad",
          variant: "sintesis",
          title: "Una trayectoria que converge en ED.",
          body: "Empoderamiento Docente reúne los distintos planos de su recorrido: aula, investigación, formación docente, diseño curricular, materiales, políticas educativas y liderazgo institucional.",
          milestones: [
            { period: "2020 – actualidad", title: "Directora General de Empoderamiento Docente", primary: true },
            { period: "2020 – actualidad", title: "Fundadora de Casa Bosque – Escuela Montessori", detail: "Chile" },
            { period: "2021 – actualidad", title: "Asesora global en Matemáticas", detail: "Techint Group" },
            { period: "2022 – 2024", title: "Profesora del Diplomado en Matemática Educativa", detail: "UDLA Chile" },
            { period: "2023", title: "Profesora honoraria de Didáctica de la Matemática", detail: "UMCE" },
            { period: "2023 – actualidad", title: "Asesora ministerial en Matemáticas", detail: "Plan Estratégico Buenos Aires Aprende" },
          ],
        },
      ],
      closing: {
        title: "Del recorrido individual a una construcción colectiva.",
        body: "Desde la Dirección General, Daniela articula investigación, asesoría, formación docente, diseño de materiales y construcción de equipos para transformar contextos educativos concretos.",
        body2: "ED es el punto donde su trayectoria entre aula, saber, política educativa y transformación se convierte en acción colectiva.",
      },
    },
  },
  {
    key: "karla-gomez",
    nombre: "Karla Gómez",
    rol: "Directora Académica",
    pais: "México",
    tier: 2,
    imagePosition: "50% 16%",
    bio: "Especialista en desarrollo del pensamiento matemático y en el diseño de tareas. Licenciada en Enseñanza de las Matemáticas. Doctora en Ciencias con especialidad en Matemática Educativa.",
    pubs: [
      { titulo: "Experiencias de aprendizaje y reconceptualización geométrica: una propuesta para la reorganización de la práctica docente" },
      { titulo: "Gómez et al. (2020) — PME-NA 42" },
    ],
  },
  {
    key: "ivan-perez",
    nombre: "Iván Pérez",
    rol: "Líder de Modelación y Tecnologías",
    pais: "Chile",
    tier: 3,
    imagePosition: "50% 22%",
    bio: "Académico del Departamento de Matemática de la Universidad Metropolitana de Ciencias de la Educación (UMCE), responsable de proyectos de investigación y de vinculación con el medio escolar.",
  },
  {
    key: "judith-hernandez",
    nombre: "Judith Hernández",
    rol: "Líder de proyecto · Currículum",
    pais: "México",
    tier: 3,
    imagePosition: "50% 25%",
    bio: "Especialista en análisis y diseño del currículum en Matemáticas y desarrollo profesional docente. Doctora en Ciencias con especialidad en Matemática Educativa.",
    pubs: [
      { titulo: "Hernández, Páez y Aké (2026)" },
      { titulo: "Rodríguez, Briceño y Hernández (2026)" },
      { titulo: "Valero y Hernández (2024)" },
      { titulo: "Hernández, Padilla y Briceño (2023)" },
    ],
  },
  {
    key: "gabriela-buendia",
    nombre: "Gabriela Buendía",
    rol: "Líder de proyecto · Facilitadora",
    pais: "México",
    tier: 3,
    imagePosition: "50% 22%",
    bio: "Doctora en Ciencias con especialidad en Matemática Educativa. Especialista en desarrollo del pensamiento matemático. Facilitadora y diseñadora de material didáctico.",
  },
  {
    key: "marcela-cano",
    nombre: "Marcela Cano",
    rol: "Líder de proyecto · Evaluación",
    pais: "México",
    tier: 3,
    imagePosition: "50% 20%",
    bio: "Especialista en evaluación educativa a gran escala: diseño, implementación y coordinación de evaluaciones en todos los niveles. Ex directora del programa de evaluación del desempeño docente y del área EGEL. Estudios en Psicología por la UNAM.",
  },
  {
    key: "wendolyne-rios",
    nombre: "Wendolyne Ríos",
    rol: "Facilitadora y diseñadora de material didáctico",
    pais: "México",
    tier: 4,
    imagePosition: "50% 20%",
    bio: "Licenciada en Física y Matemáticas. Maestra en Ciencias con especialidad en Matemática Educativa. Especialista en pensamiento y lenguaje variacional.",
  },
  {
    key: "pedro-vidal-szabo",
    nombre: "Pedro Vidal-Szabo",
    rol: "Facilitador · Pensamiento estocástico",
    pais: "Chile",
    tier: 4,
    imagePosition: "50% 12%",
    bio: "Especialista en pensamiento estocástico. Investigador y académico. Magíster y Doctor en Didáctica de la Matemática. Profesor de Matemática, mención Estadística Educacional.",
  },
  {
    key: "paola-balda",
    nombre: "Paola Balda",
    rol: "Facilitadora · Pensamiento proporcional",
    pais: "Colombia",
    tier: 4,
    imagePosition: "50% 28%",
    bio: "Especialista en pensamiento proporcional y formación docente. Licenciada en Matemáticas. Doctora en Educación. Magíster en Docencia de las Matemáticas y especialista en Gerencia Educativa.",
  },
  {
    key: "darly-ku-euan",
    nombre: "Darly Ku-Euan",
    rol: "Diseñadora de material didáctico",
    pais: "México",
    tier: 4,
    imagePosition: "50% 45%",
    bio: "Especialista en pensamiento matemático y desarrollo profesional docente. Profesora de Matemáticas. Doctora en Ciencias con especialidad en Matemática Educativa.",
  },
  {
    key: "luis-cabrera",
    nombre: "Luis Cabrera Chim",
    rol: "Facilitador · Evaluación educativa",
    pais: "México",
    tier: 4,
    imagePosition: "50% 15%",
    bio: "Especialista en desarrollo profesional docente, pensamiento y lenguaje variacional y evaluación educativa. Doctor en Ciencias con especialidad en Matemática Educativa.",
  },
  {
    key: "eduardo-briceno",
    nombre: "Eduardo Briceño",
    rol: "Diseñador de material didáctico",
    pais: "México",
    tier: 4,
    imagePosition: "50% 14%",
    bio: "Especialista en la construcción social del conocimiento y el uso de tecnología en la enseñanza de las matemáticas. Doctor en Ciencias con especialidad en Matemática Educativa.",
    pubs: [
      { titulo: "Rodríguez, Briceño y Hernández (2026)" },
      { titulo: "Hernández, Padilla y Briceño (2023)" },
    ],
  },
];

/** Ruta de la foto real aprobada de una persona. */
export const fotoDe = (key: string) => `/equipo/${key}.jpg`;

/** Personas de un nivel jerárquico, en el orden del array. */
export const porTier = (tier: Tier) => EQUIPO.filter((p) => p.tier === tier);

/** Dirección General (nivel 1) — persona que abre el recorrido. */
export const DANIELA = EQUIPO[0];

/** Busca una persona por su slug. */
export const personaPorKey = (key: string) => EQUIPO.find((p) => p.key === key);
