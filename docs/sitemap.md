# Sitemap — Empoderamiento Docente

Mapa estructural de las páginas existentes del sitio: qué bloques tiene
cada una, en qué orden aparecen, qué copy y CTAs contienen.

> **Estado de implementación:** páginas activas: `/` (Home), `/nosotros`.
> Páginas previstas pero no implementadas: `/servicios`, `/recursos`,
> `/formacion`, `/contacto`, `/novedades`, `/unite`.

---

## Layout global (presente en todas las páginas)

### Header (`src/components/layout/Header.tsx`)

- Sticky top con fondo `gris-fondo/95` + backdrop blur cuando hay scroll.
- **Brand**: logo `Brand variant="full"` (isotipo + wordmark CSS en dos
  colores: "Empoderamiento" navy + "Docente" azul-medio).
- **Nav desktop**: `Inicio · Nosotros · Investigación (→/recursos) ·
  Formación · Contacto` con underline verde animado en hover. El link
  activo muestra `aria-current="page"` + underline permanente.
- **CTA primario**: ButtonPrimary naranja "Sumate" (anchor a `#comunidad`).
- **Mobile**: hamburguesa que abre overlay full-screen con la misma nav
  a tamaño grande.

### Footer (`src/components/layout/Footer.tsx`)

- Fondo navy (`bg-azul-principal`), texto blanco.
- **Bloque CTA arriba**: Eyebrow `Sumate al ciclo` + H2 "Investigamos
  para `transformar` la matemática escolar." + ButtonPrimary "Sumate" +
  link "Contactanos →".
- **Ecuación editorial** (manual): `Investigación + Acción + Reflexión +
  Alianzas = Transformación educativa.` (`=` en naranja).
- **Grid de 4 columnas**:
  - Marca (5/12): Brand full + bajada institucional.
  - Navegar (3/12): 5 links principales.
  - Comunidad (2/12): Instagram / LinkedIn / Facebook (render condicional
    si están configuradas en `siteConfig.redes`).
  - Contacto (2/12): email + dirección.
- **Bottom bar**: © + tagline "Investigamos lo que hacemos, hacemos lo
  que investigamos."
- **Decoración**: círculo verde sólido en la esquina inferior derecha +
  parche de dots blancos al 18% (composición canónica manual §6).

---

## Página · Home (`/`)

Archivo: `src/app/page.tsx` orquesta los bloques dentro de
`<HomeAnimations>` (wrapper client con GSAP que coordina los stagger
por scroll).

### 1. Hero — `001 / Home`

**Archivo:** `src/features/home/components/Hero.tsx`

- **Page marker** arriba derecha: `001 / Home` con `/` en naranja.
- **Layout 2 columnas** (md+):
  - Izquierda: Eyebrow `Investigación · Acción · Reflexión` + H1
    "Transformamos la `enseñanza` de la matemática." (palabra clave en
    verde sólido) + línea decorativa verde + bajada + flujo del ciclo
    (Investigamos → Diseñamos → Implementamos → Volvemos a investigar,
    flechas en naranja) + CTAs (ButtonPrimary "Conocé más" +
    ButtonSecondary "Conocé al equipo").
  - Derecha: isotipo macizo `/brand/logotipo-ed-principal.svg` +
    semicírculo verde sólido asomando por la esquina inferior derecha +
    parche de dots azules superpuestos al verde.
- **Scroll indicator** abajo centrado (barra animada con `scrollHint`).
- **Animaciones**: stagger del copy con `data-anim="hero-copy"` +
  `data-anim-item` en cada hijo.

### 2. CicloTrabajo — `002 / Ciclo`

**Archivo:** `src/features/home/components/CicloTrabajo.tsx`

- **Fondo** `gris-fondo`.
- **Header**: Eyebrow `Cómo trabajamos` + H2 "Un ciclo continuo de
  conocimiento, acción y transformación." + bajada "Investigamos lo que
  hacemos. Hacemos lo que investigamos."
- **Grid de 3 fases** (arco con conectores horizontales hairline +
  curva verde de retorno):
  - **01 · Investigamos** → "Construimos conocimiento propio." (link a
    `/recursos`).
  - **02 · Hacemos** → "Diseñamos e implementamos acciones." (link a
    `/formacion`).
  - **03 · Volvemos a investigar** → "Analizamos lo que ocurre." (link
    a `/nosotros`).
- **Frase de cierre**: `Investigación + Acción + Reflexión + Alianzas
  = Transformación educativa.` (con `=` en naranja).
- **Decoración**: parche de dots + círculo verde sólido en la esquina
  superior derecha.

### 3. SobreEd — `003 / Identidad`

**Archivo:** `src/features/home/components/SobreEd.tsx`

- **Fondo blanco**.
- **Layout 2 columnas** (md+):
  - Izquierda (7/12): Eyebrow `Quiénes somos` + H2 "Una organización
    que `piensa` la enseñanza de las matemáticas." (Highlight verde
    sobre "piensa") + bajada con drop-cap verde + figure con la base
    epistemológica oficial + 3 principios + ButtonSecondary "Conocé a
    las personas que hacen ED".
  - Derecha (5/12): pull-quote `"Vivir para hacer vivir."` con
    TextReveal por palabra + caption "Fase experiencial · principio
    rector" + descripción.
- **Decoración**: círculo verde sólido asomando por la derecha + parche
  de dots azules superpuesto.

### 4. Impacto — `004 / Impacto`

**Archivo:** `src/features/home/components/Impacto.tsx`

- **Fondo blanco**.
- **Header centrado**: Eyebrow `Nuestro impacto` + H2 "Investigamos lo
  que hacemos. Hacemos lo que investigamos. Y `transformamos` la
  educación." + bajada con la frase de cierre del modelo conceptual.
- **Grid de 4 audiencias** (lg:grid-cols-4):
  - Docentes (ícono Users).
  - Estudiantes (ícono Lightbulb).
  - Escuelas (ícono School).
  - Sistemas educativos (ícono TrendingUp).
- Cada card: círculo verde con ícono que se invierte en hover + título
  + bajada.
- **Decoración**: dots azules + círculo verde sólido en la izquierda.

### 5. Aliados — `005 / Alianzas`

**Archivo:** `src/features/home/components/Aliados.tsx`

- **Fondo** `gris-fondo`.
- **Header 2 col**: Eyebrow `Trabajamos en alianza` + H2 "Construimos
  con quienes mueven la educación." + bajada a la derecha.
- **Grid de 6 partners** (lg:grid-cols-3) en cards con border-left
  destacado al hover:
  - TECHINT.
  - Gen Técnico Roberto Rocca.
  - Escuelas Técnicas Roberto Rocca.
  - Ministerio de Educación de CABA.
  - Bloom.
  - Redes y comunidades.
- **Decoración**: dots + círculo verde sólido en la esquina inferior
  derecha.

### 6. ComunidadRedes — `006 / Comunidad`

**Archivo:** `src/features/home/components/ComunidadRedes.tsx`
**Anchor:** `id="comunidad"` (destino del CTA "Sumate" del Header y
del footer).

- **Fondo blanco**.
- **Header centrado**: Eyebrow `Sumate` + H2 "Sumate a la `comunidad`."
  (Highlight verde) + bajada.
- **Render condicional**:
  - Si hay redes activas: grid de 3 cards (Instagram / LinkedIn /
    Facebook) con ícono + handle + link "Seguir →".
  - Si no hay redes: placeholder con dots arriba + "Pronto en redes" +
    CTA email directo.
- **Decoración**: dots + círculo verde sólido en la esquina inferior
  izquierda.

---

## Página · /nosotros

Archivo: `src/app/nosotros/page.tsx` orquesta los bloques.
Estado interno (`useState` para `openContext` del modal) + restauración
de foco con `flushSync` al cerrar.

### 1. PageHeader — `002 / Nosotros`

**Archivo:** `src/features/nosotros/components/PageHeader.tsx`

- **Fondo blanco**, full-screen (`min-h-dvh`).
- **Page marker** arriba derecha: `002 / Nosotros` con `/` en naranja.
- **Layout 2 columnas** (md+):
  - Izquierda: Eyebrow `Quiénes somos` + H1 "Un equipo de investigación
    que `transforma` la matemática escolar" (verde sólido en
    "transforma") + línea decorativa verde + bajada institucional +
    stats `14 / 5 / 3` (Profesionales / Países / Áreas) + CTAs
    (ButtonPrimary "Conocé al equipo" anchor `#equipo` +
    ButtonSecondary "Sumate a la comunidad" a `/#comunidad`).
  - Derecha: composición canónica del manual §6 — círculo verde sólido
    grande en la esquina inferior derecha + parche de dots azules
    superpuestos.
- **Scroll indicator** abajo centrado.

### 2. TeamSection 01 · Dirección

**Anchor:** `id="equipo"` (destino del CTA "Conocé al equipo").
**Variant:** `large` (grid 1-2 cols, max-w-3xl).
**Personas:** 2 (Dirección General y Académica).

- **Header**: número editorial `01` grande verde sutil + H2 "Dirección"
  + subtítulo "Quienes trazan el rumbo de la consultora y articulan la
  visión académica del equipo."
- **Cards**: foto a color, hover con scale + underline verde del nombre
  + CTA "Leer semblanza →". Click abre TeamModal.
- **Decoración**: dots + círculo verde sólido asomando por la esquina
  derecha alta.

### 3. TeamSection 02 · Líderes de Área y Proyecto

**Variant:** `medium` (grid 2-3 cols, max-w-5xl).
**Personas:** 6.

- **Header**: número `02` + H2 "Líderes de Área y Proyecto" + subtítulo
  "Quienes sostienen la estructura académica y conducen las líneas de
  investigación."
- **Decoración**: dots + círculo verde grande asomando por el borde
  izquierdo medio.

### 4. TeamSection 03 · Facilitación y Diseño

**Variant:** `small` (grid 2-3 cols, max-w-5xl).
**Personas:** 6.

- **Header**: número `03` + H2 "Facilitación y Diseño" + subtítulo
  "Quienes construyen la práctica de aula y diseñan los materiales que
  llegan a docentes."
- **Decoración**: dots + círculo verde asomando por la esquina derecha
  baja.

### 5. TeamModal (overlay global)

**Archivo:** `src/features/nosotros/components/TeamModal.tsx`
(usa el hook `useMorphClone` para la animación + `ModalContent` para
la columna derecha + `MorphMonogram` para fallback sin foto).

- Se monta cuando hay `openContext` en el state.
- **Morph animation**: la foto de la card vuela desde su posición
  original hasta el slot del modal mientras backdrop y sheet aparecen.
  Al cerrar, vuelve.
- **Layout 2 cols dentro del sheet**:
  - Slot de foto (izquierda).
  - Contenido (derecha): country badge + tier + nombre H2 + role +
    Semblanza + Formación (credenciales) + Especialidad + CTA "Ver en
    LinkedIn" naranja.
- **Watermark de tier** (ícono Lucide del manual): `Target` (Dirección)
  · `Users` (Líderes) · `BookOpen` (Facilitación).
- **Accesibilidad**: focus trap (al cerrar restaura foco a la card que
  lo abrió con `flushSync`), ESC cierra, click en backdrop cierra,
  `useLockScroll` bloquea scroll del body con contador de consumidores.

---

## Convenciones transversales

### Identidad visual

- **Paleta** (`globals.css` `@theme`): `azul-principal` `#1f2d4d` ·
  `azul-medio` `#4a6fa5` · `azul-claro` `#a9c5e8` · `verde-concepto`
  `#1f9a78` · `naranja-accion` `#e07a2f` · `gris-fondo` `#f2f4f7` ·
  `gris-texto` `#6b7280`.
- **Tipografía**: Manrope (display) + Inter (cuerpo).
- **Patrón gráfico oficial (manual §6)**: clase utility `.pattern-dots`
  + círculo verde sólido. Cada sección lo aplica con composición propia.

### Reglas del manual aplicadas

- ✅ **Naranja solo CTAs**: ButtonPrimary del Hero / SobreEd / Aliados
  / ComunidadRedes / PageHeader; "Ver en LinkedIn" del TeamModal; flecha
  del flujo del Hero (`→`); separador del page marker; `=` de la
  ecuación de cierre.
- ✅ **Verde para conceptos**: palabra clave del H1 ("enseñanza" /
  "transforma" / "piensa"), líneas decorativas, divisores, índice tick
  de cards, underline verde animado en hover de nombres / nav.
- ✅ **Azul como base**: footer navy, page markers, todo el texto.
- ✅ **Movimiento contenido (DESIGN.md §9)**: easings `power2.out` /
  `expo.out`, durations 0.4–0.8s.

### Animaciones

- `HomeAnimations` (`src/features/home/animations/`) orquesta el home
  vía data-attributes y GSAP ScrollTrigger.
- TeamCard tiene su propia hover timeline.
- TeamModal usa `useMorphClone` para la animación de apertura/cierre.
- Todas respetan `useReducedMotion`.
