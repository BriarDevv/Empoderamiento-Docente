# /nosotros — Spec de diseño

> **Estado:** brainstorming completo, listo para implementación.
> **Origen:** portado y adaptado del proyecto `empoderamiento-docente-next`
> (archivo en `OneDrive/Desktop/todo/Archivo/`) al manual de marca actual.
> **Fecha:** 2026-05-24.

---

## 1. Scope

Crear la página `/nosotros` del sitio institucional. Único entregable de
esta iteración — el resto del sitemap (`/servicios`, `/proyectos`,
`/recursos`, `/formacion`, `/contacto`) queda fuera del alcance.

**Out of scope explícito:**

- Cambios al home (`/`) y a sus componentes (Hero, CicloTrabajo, SobreEd,
  ComunidadRedes).
- Otras rutas del sitemap.
- Estructura backend / API de equipo (los datos van hardcodeados en
  `data/team.ts`, sin DB).

## 2. Approach elegido

**B · Adaptación al lenguaje del Next actual** (vs. portado literal o
reescritura desde cero).

- Se portan los componentes del proyecto previo que tienen lógica de
  animación pulida (`TeamSection`, `TeamCard`, `TeamModal`,
  `MonogramAvatar`, `useLockScroll`) y la data (`team.ts`, `types/team.ts`).
- Se reescribe la capa visual usando los tokens del `DESIGN.md` del Next
  actual (paleta azul/verde/naranja, Manrope/Inter, patrón gráfico oficial).
- Se reemplazan los watermarks tipográficos `Σ/∫/∞` del modal por íconos
  Lucide del manual (`target`, `users`, `book-open`).

Justificación: conserva la inversión en animaciones (morph clone del
modal, hover grayscale→color, stagger de cards) y la jerarquía en 3 tiers,
pero queda coherente con el home actual sin chocar visualmente.

## 3. Arquitectura de la página

```
src/app/nosotros/page.tsx                       ← ruta nueva, 'use client'
└── <PageHeader />                              ← componente nuevo
    <TeamSection number="01" tier="direccion">  ← 2 personas, grid 2 col (large)
    <TeamSection number="02" tier="lideres">    ← 6 personas, grid 2/3 col (medium)
    <TeamSection number="03" tier="facilitacion">← 6 personas, grid 2/3 col (small)
    <TeamModal />                               ← global, abre desde cualquier card
```

**Layout de feature** (replica el patrón `src/features/home/`):

```
src/features/nosotros/
├── components/
│   ├── PageHeader.tsx
│   ├── TeamSection.tsx
│   ├── TeamCard.tsx
│   ├── TeamModal.tsx
│   └── MonogramAvatar.tsx
├── data/team.ts
└── types/team.ts

src/lib/hooks/useLockScroll.ts   ← hook genérico, va junto al resto
```

`page.tsx` solo orquesta: importa los componentes, maneja el estado
`openContext` del modal, y pasa los grupos `teamByTier` a cada
`TeamSection`.

`useLockScroll` vive en `src/lib/hooks/` (junto a `useReducedMotion` y
`useFadeInOnScroll`) porque es genérico — no depende del dominio
`/nosotros` y podría reutilizarse en cualquier modal/overlay del sitio.

## 4. Componentes: qué se trae, qué se ajusta

| Componente prev | Acción | Cambios |
|---|---|---|
| `TeamSection.tsx` | portar + re-tintear | Reemplazar blob ambient verde por **puntos** (DESIGN.md §6) + semicírculo `azul-medio`. Cambiar `font-display` editorial por Manrope. |
| `TeamCard.tsx` | portar + simplificar hover | Mantener morph trigger, index tick, country badge, "Leer semblanza". Quitar el `markRef` rotate +45°. Hover scale 1.04 (idem) con duration **0.6s power2.out** (era 0.9s). |
| `TeamModal.tsx` | portar + re-tintear + ajustes | Mantener morph clone animation. Cambiar watermark `Σ/∫/∞` por íconos Lucide: `target` (Dirección), `users` (Líderes), `book-open` (Facilitación). LinkedIn button: `bg-naranja-accion text-white hover:bg-naranja-accion/90`. Backdrop blur **8px** (era 12px). Duration open **0.7s** (era 0.85s). |
| `MonogramAvatar.tsx` | portar + re-tintear | Bg `azul-claro/20`, letras `azul-principal` font-display. |
| `SectionHeader.tsx` (prev) | **reescribir** | No portar. Componer un mini-header dentro de `TeamSection` usando `Eyebrow` + `SectionNumber` que ya existen en `src/components/ui/` y `src/features/home/components/`. |
| `useLockScroll.ts` | portar tal cual | Sin cambios funcionales. Ubicación: `src/lib/hooks/useLockScroll.ts` (no en `features/nosotros/`, porque es genérico). |
| `data/team.ts` | portar tal cual | 14 personas, sin tocar bio/credentials/specialty. |
| `types/team.ts` | portar tal cual | Tipo `TeamMember`, enum `tier`. |
| `lib/gsap.ts` (prev) | **no portar** | El proyecto actual no usa `@gsap/react`. Refactorizar los `useGSAP({ scope })` → `useEffect + gsap.context(scope)` (mismo patrón que `LogotipoEDInline.tsx` y `HomeAnimations.tsx`). |

## 5. Mapeo de tokens (previo → manual ED)

### Color

| Token previo | Token nuevo | Uso |
|---|---|---|
| `bg-paper` | `bg-white` | Fondo de página |
| `bg-paper-deep` | `bg-azul-principal` | Foto placeholder, fondo del modal (cuando es over-azul) |
| `text-ink` | `text-azul-principal` | Texto principal |
| `text-ink-muted` | `text-gris-texto` | Roles, metadatos |
| `bg-accent` (verde editorial) | `bg-verde-concepto` | Index tick, divisores, watermark (íconos) |
| `bg-cta` | `bg-naranja-accion` | Solo botón "Ver en LinkedIn" del modal |
| `border-hairline` | `border-azul-claro/40` | Divisores y bordes sutiles |
| `mix-blend-difference` (badge país) | `bg-white text-azul-principal` | Country badge legible siempre |

### Tipografía

| Uso previo | Equivalente nuevo |
|---|---|
| `font-display` (serif editorial) | `font-display` (Manrope Bold) — ya configurado en `globals.css` |
| `font-body` | `font-sans` (Inter) — default del body |
| `font-mono` (índices, tags) | `font-sans` (Inter Medium) + `tracking-widest` + `uppercase` — el manual no tiene mono |

### Escala

Aplicar las clases `text-display` / `text-h1` / `text-h2` / `text-h3` /
`text-body` / `text-small` definidas en el `@theme` de `globals.css`.

- PageHeader: H1 → `text-display` (la `/nosotros` puede compartir
  pesos con el hero del home porque va sola en la página).
- TeamSection title: `text-h2` con eyebrow encima.
- TeamCard nombre: `text-h3` para `large` y `medium`, `text-body` font-bold para `small`.
- TeamModal nombre: `text-h2`.

## 6. PageHeader

**Estructura:**

```
<section bg-azul-principal text-white relative overflow-hidden>
  <pattern dots top-right + media-luna azul-medio derecha />
  <container>
    <Eyebrow variant="light">Quiénes somos</Eyebrow>
    <h1 text-display font-display>
      Un equipo de investigadoras e investigadores
      <br />
      que transformamos la matemática escolar.
    </h1>
    <p text-body text-azul-claro/90>
      14 profesionales distribuidos en Argentina, Chile,
      Colombia, Costa Rica y México. Articulamos investigación,
      formación y diseño de materiales en torno al desarrollo
      profesional docente.
    </p>
  </container>
</section>
```

- Fondo `azul-principal` con la clase `bg-grain` ya existente.
- Patrón gráfico: dots arriba a la derecha (clon del que usa el Hero del
  home) + un semicírculo `azul-medio` parcialmente fuera del borde derecho.
- Sin faro — esa metáfora es exclusiva del home.
- Altura `min-h-[40vh] md:min-h-[48vh]` — más corto que el hero del home.

## 7. Animaciones (alineadas con DESIGN.md §9)

> Regla del manual: "Movimiento contenido. Suaves, 400–800ms, easing
> `power2.out`. Nada de bounces."

| Animación | Duración | Easing | Trigger |
|---|---|---|---|
| Stagger entrada cards | 0.8s · stagger 0.07 | `power3.out` | ScrollTrigger `top 88%` once |
| Hover scale 1.04 foto | 0.6s | `power2.out` | mouseenter (reverse en mouseleave) |
| Hover color reveal (grayscale→color) | 0.55s | `power2.out` | mouseenter |
| Underline del nombre (scaleX 0→1) | 0.55s | `power3.inOut` | mouseenter |
| "Leer semblanza" reveal | 0.4s | `power2.out` | mouseenter |
| ~~Corner mark rotate +45°~~ | — | — | **eliminado** |
| Modal open: backdrop fade | 0.5s | `power2.out` | onOpen |
| Modal open: sheet fade+y | 0.7s | `expo.out` | onOpen |
| Modal open: morph clone | 0.7s | `expo.out` | onOpen |
| Modal open: content stagger | 0.55s · stagger 0.045 | `power2.out` | onOpen +0.35s |
| Modal close: stagger reverso | 0.25s · stagger 0.02 | `power2.in` | onClose |
| Modal close: morph back | 0.7s | `power3.inOut` | onClose +0.1s |
| Modal close: backdrop fade | 0.5s | `power2.in` | onClose +0.2s |

**Reduced motion:** todas las animaciones se saltean. Los elementos
quedan visibles desde el inicio (no `opacity: 0` por CSS). Se usa el
hook `useReducedMotion` que ya existe en `src/lib/hooks/` (basado en
`useSyncExternalStore`, SSR-safe y reactivo a cambios en vivo), idem
patrón de `HomeAnimations` y `LogotipoEDInline`.

## 8. Reglas del manual aplicadas (checklist)

- [x] **Naranja solo CTAs** → solo el botón "Ver en LinkedIn" del modal.
- [x] **Verde para conceptos** → index tick de cards, divisores del modal,
  "Semblanza" label, underline del nombre en hover.
- [x] **Azul es base** → fondos de página/foto/modal/headers.
- [x] **Verde y naranja no conviven en primer plano** → el naranja vive
  dentro del modal en su bloque CTA aislado; en cards solo hay verde.
- [x] **Tipografía Manrope/Inter** → mapeo completo en §5.
- [x] **Movimiento contenido** → todos los timings ≤ 800ms, easings
  `power2.out` / `expo.out` / `power3.out`. Sin bounces ni elastic.
- [x] **Patrón gráfico** → dots + semicírculo en PageHeader y entre
  secciones (uno cada 2-3, no saturar).
- [x] **Contraste WCAG AA** → `azul-principal` sobre blanco (15:1),
  `gris-texto` sobre blanco (5:1), `verde-concepto` sobre blanco (4.5:1),
  `naranja-accion` sobre blanco (3.4:1 — uso solo en botones grandes con
  texto blanco encima, donde el contraste es navy/blanco).

## 9. Datos

`src/features/nosotros/data/team.ts`: 14 personas, tres tiers
(`direccion` 2 · `lideres` 6 · `facilitacion` 6). Cada persona:

```ts
{
  id: string,            // kebab-case
  name: string,
  role: string,
  tier: 'direccion' | 'lideres' | 'facilitacion',
  country: string,       // "Argentina"
  countryCode: string,   // "AR" (ISO 3166-1 alpha-2)
  photo: string | null,  // path en /public/team/ o null → MonogramAvatar
  bio: string,           // 1-3 oraciones
  credentials: string[],
  specialty: string,
  linkedin: string,      // "#" por ahora (URLs reales se completan después)
}
```

`teamByTier` exporta los tres grupos filtrados.

**Fotos:** las fotos del proyecto previo (`/team/*.jpg`) **no se portan
en esta iteración**. Mientras tanto todas las cards muestran
`MonogramAvatar`. En una iteración posterior se pueden subir las fotos
reales a `/public/team/` con los mismos filenames y las cards las van a
levantar automáticamente.

## 10. Routing + integración con el header

- Ruta: `src/app/nosotros/page.tsx`. Es un client component (`'use
  client'`) porque maneja estado del modal.
- Metadata: definida vía `export const metadata` en el page (no en un
  layout específico). `title: "Nosotros"` (usa el template del root
  layout), `description` con la bajada del PageHeader.
- Header: **no requiere cambios.** El link "Nosotros" ya existe en
  `src/components/layout/Header.tsx` y maneja el estado activo via
  `usePathname()` + `aria-current="page"` + underline animado verde
  (`bg-verde-concepto`). Cuando la URL pase a `/nosotros`, el link se
  va a activar automáticamente.

## 11. Accesibilidad

- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-name"`.
- Focus management: al abrir, foco al botón "Cerrar". Al cerrar, foco
  restaurado al elemento previo (guardado en `lastFocusedRef`).
- ESC cierra el modal.
- Click en backdrop cierra.
- `useLockScroll` bloquea el scroll del body mientras el modal está
  abierto.
- TeamCard es `<button>` semántico con `aria-label="Abrir detalle de
  {nombre}"`.
- Foto: `alt="Retrato de {nombre}"`.
- Country code es texto visible (no requiere `aria-label` adicional).
- Reduced motion: ver §7.

## 12. Tests / verificación

Esta iteración no incluye tests automatizados (el repo no tiene
infraestructura de test todavía). Verificación manual:

1. `pnpm typecheck` — sin errores.
2. `pnpm lint` — sin errores.
3. `pnpm dev` + browser:
   - Abrir `/nosotros`, ver PageHeader + 3 secciones de cards.
   - Hover card: foto pasa a color, underline aparece.
   - Click card: modal abre con morph desde la posición de la card.
   - Modal: scroll del body bloqueado, ESC cierra, click backdrop cierra,
     foco regresa a la card al cerrar.
   - DevTools → emular `prefers-reduced-motion: reduce` → animaciones
     skipeadas, contenido visible.
   - Lighthouse a11y ≥ 95.
4. Doctor pre-commit (`bash scripts/ed-doctor.sh`) → verde.

## 13. Commits previstos (Conventional Commits es)

1. `feat(nosotros): agregar tipos y datos del equipo`
2. `feat(hooks): agregar useLockScroll para bloquear scroll en modales`
3. `feat(nosotros): agregar MonogramAvatar y TeamCard`
4. `feat(nosotros): agregar TeamSection con animación de entrada`
5. `feat(nosotros): agregar TeamModal con morph animation`
6. `feat(nosotros): agregar PageHeader`
7. `feat(nosotros): wire-up de la ruta /nosotros`

Atómicos, cada uno verificable independientemente (typecheck + lint
verde, build sin errores). Doctor verde en cada commit.

## 14. Risks / open questions

- **Performance del morph del modal en mobile** — el clone usa
  `position:fixed` + animación de `top/left/width/height` que fuerza
  layout. Si rinde mal en celulares de gama baja, evaluar pasar a
  `transform: translate + scale` (no forza layout) en una segunda
  iteración.
- **Fotos no portadas en esta iteración** — todas las cards muestran
  monogramas. Visualmente puede quedar uniforme. Mitigación: el
  `MonogramAvatar` debe estar bien diseñado (bg azul-claro/20, letras
  navy en Manrope) para que se vea intencional, no como placeholder.
- **Copy del PageHeader** — la bajada cita "5 países" basándose en los
  datos actuales del team. Si la lista cambia, hay que actualizar el
  número manualmente (no es derivado).
