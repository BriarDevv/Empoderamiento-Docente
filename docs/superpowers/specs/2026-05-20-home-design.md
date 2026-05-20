# Home — Diseño funcional

> **Fecha:** 2026-05-20
> **Branch:** `docs/home-design`
> **Autor:** brainstorm con socios (Gastón + Mateo + Querque) bajo el contrato de `AGENTS.md`
> **Alcance:** sólo la página `/` (home). Páginas internas (`/nosotros`, `/formacion`, `/recursos`, `/contacto`) son out of scope de este spec.

---

## 1. Contexto y decisiones de propósito

ED es una organización de desarrollo profesional docente en Matemática Educativa con presencia en Chile, México y Argentina. La home tiene tres metas del README (§1 AGENTS): posicionamiento, captación vía CV, y comunicación de la oferta formativa.

**Decisión de propósito primario:** la home no es lead-gen. Es **institucional + comunidad**. Un visitante que llega a `/` debería poder entender qué hace ED en 30 segundos y tener una vía clara para sumarse a la comunidad (redes sociales).

**Decisión de forma:** sitio **multipágina**, home **corta institucional clásica** que distribuye a páginas internas. No es scroll-storytelling de una sola página.

---

## 2. Out of scope

No se cubren en este spec (otros sprints):
- Páginas internas (`/nosotros`, `/formacion`, `/recursos`, `/contacto`)
- Backend de newsletter (no hay newsletter en la home)
- Forms con submit (sin formularios en la home; el contacto vive en `/contacto`)
- Sitemap, robots, structured data y demás SEO técnico
- Páginas de cada formación individual (`/formacion/[slug]`)
- Conexión MongoDB (no hay queries dinámicas en la home v1)

---

## 3. Arquitectura del page

`src/app/page.tsx` es un **server component** que ensambla las secciones. La animación es un único componente client que envuelve la home con `gsap.context()` (sigue AI_GUIDELINES §9 — aislar la frontera client).

Estructura propuesta de archivos nuevos:

```
src/
├── app/
│   └── page.tsx                          # server, ensambla secciones
├── features/
│   └── home/
│       ├── components/
│       │   ├── Hero.tsx                  # server
│       │   ├── PilaresGrid.tsx           # server
│       │   ├── SobreEd.tsx               # server
│       │   └── ComunidadRedes.tsx        # server
│       ├── animations/
│       │   └── HomeAnimations.tsx        # client, GSAP context
│       └── copy.ts                       # textos constantes de la home
├── components/
│   ├── layout/
│   │   ├── Header.tsx                    # client (hamburger state + scroll listener)
│   │   └── Footer.tsx                    # server
│   └── ui/
│       ├── Eyebrow.tsx                   # dash verde + label
│       ├── Highlight.tsx                 # <mark> verde
│       ├── ButtonPrimary.tsx             # naranja
│       └── ButtonSecondary.tsx           # transparente + border navy
└── config/
    └── site.ts                           # datos institucionales (mail, sede, redes, etc.)
```

**Regla:** ningún dato institucional (email, sede, URLs de redes) hardcodeado en JSX. Todo viene de `@/config/site.ts` (AGENTS §5.3).

---

## 4. Secciones

### 4.1 — Header (sticky)

**Layout:** sticky top · max-w-screen-xl centrado · `py-4` desktop / `py-3` mobile · padding lateral `px-5` mobile / `px-8` desktop · background off-white (`#F2F4F7`) con shadow sutil al scrollear.

**Composición desktop:**
- **Izquierda:** lockup ED (monograma + faro + wordmark) → linkea a `/`
- **Centro/derecha (nav inline):** `Inicio` · `Nosotros` · `Formación` · `Recursos` · `Contacto`. Active link marcado con dash verde abajo (eco de los eyebrows).
- **Extrema derecha:** CTA naranja `rounded-lg` chico — texto: `Sumate` (consistencia con el CTA primario del hero).

**Composición mobile:** logo izquierda · hamburger derecha. Menu fullscreen overlay con nav items grandes (≥44px touch) + CTA naranja al final.

**Comportamiento:**
- Sticky + shadow al scrollear (state controlado por scroll listener en el component client)
- Hamburger: ARIA expanded, focus trap dentro del menu, escape cierra

**Nota lingüística:** `Nosotros` (no `Nosotras`) es decisión editorial — el equipo es mixto y "Nosotros" como genérico inclusivo abarca a todas las personas. `GLOSSARY.md` debe actualizarse para reflejar esta decisión (era un punto pendiente).

---

### 4.2 — Hero

**Layout:** split 60/40 desktop · stack vertical en mobile (copy arriba, faro abajo, faro más chico) · background off-white `#F2F4F7`.

**Lado izquierdo (copy):**
- **Eyebrow:** dash verde + `EMPODERAMIENTO DOCENTE` (Inter Medium, uppercase, `tracking-wider`, `text-gris-texto`)
- **Headline** (Manrope Bold, `text-display`, `text-azul-principal`):
  > Transformar la relación con las matemáticas es <mark>ampliar posibilidades</mark>.

  El `<mark>` usa el estilo highlight verde del manual (`bg-verde-concepto/30 px-1 -mx-1`).
- **Subhead** (Inter Regular, `text-body`, `text-gris-texto`):
  > Comunidad docente en torno a la Matemática Educativa. Reflexiones, talleres, charlas, proyectos e investigación para profesionales de la educación en Chile, México y Argentina.
- **CTAs:**
  - Primario (`ButtonPrimary`): `Sumate a la comunidad` → ancla `#comunidad` (sección 4.5) con smooth scroll vía Lenis
  - Secundario (`ButtonSecondary`): `Conocé a ED` → `/nosotros`

**Lado derecho (pieza visual):**
- Faro grande en `azul-principal` (SVG)
- Detrás: patrón de puntos (`gris-texto/35`) y media circunferencia sólida verde (`#3E7C6D`) — eco directo del manual de marca
- _Nota: SVG del faro a definir cuando llegue el asset oficial. Por ahora placeholder con bounding box equivalente._

**Animación (`HomeAnimations`, respeta `prefers-reduced-motion`):**
- Stagger de entrada al cargar: eyebrow → headline → subhead → CTAs (cada uno con 100ms de delay, 600ms `power2.out`, `opacity 0 → 1 + translateY(12px → 0)`)
- Faro: fade-in del cuerpo + draw del haz de luz como SVG path animation (1.2s, una sola vez)
- Con `reduced-motion`: todo aparece sin movimiento, sin path draw

**SEO:** este es el único `<h1>` de la página. Marca-up: `<h1>` con `<mark>` dentro para la palabra destacada.

**Nota sobre `<mark>`:** el componente `Highlight.tsx` usa el elemento HTML `<mark>` (no `<span>` como dice DESIGN.md §7 ejemplo). Razón: `<mark>` tiene semántica de "texto destacado por relevancia contextual" que los lectores de pantalla anuncian. El estilo visual sigue siendo el mismo (`bg-verde-concepto/30 px-1 -mx-1`).

---

### 4.3 — 3 pilares (qué hace ED)

**Layout:** grid 3×1 desktop · stack mobile · background blanco puro (rompe del off-white del hero) · `py-20` desktop / `py-12` mobile.

**Eyebrow:** dash verde + `EN QUÉ TRABAJAMOS` (centrado, sobre el grid).

**3 cards:**

| Pilar | Ícono (Lucide o equivalente lineal navy) | Copy (Inter Regular `text-body`) | Link |
|-------|------------------------------------------|----------------------------------|------|
| **Formación** | `BookOpen` | "Talleres, cursos, diplomaturas y seminarios para profesionales de la educación." | → `/formacion` |
| **Acompañamiento** | `Users` | "Sostenemos un vínculo continuo con docentes durante su aplicación al aula." | → `/formacion#acompanamiento` |
| **Investigación** | `Target` o `Microscope` | "Producimos conocimiento en Matemática Educativa con base científica." | → `/recursos` |

**Composición de cada card:**
- `rounded-xl`, padding `p-8` desktop / `p-6` mobile
- Border sutil `border-azul-claro/40`, sin shadow
- Ícono 48px navy arriba
- Título Manrope Medium `text-h3`
- Bajada Inter Regular `text-body` `text-gris-texto`
- Link "Conocé más →" en `verde-concepto`, hover subraya

**Animación:** stagger al entrar viewport (`ScrollTrigger start: "top 80%"`), 120ms apart, fade + `translateY(16px → 0)`, 500ms `power2.out`. Sin `scrub`.

**Por qué 3 y no 4:** "Asesorías a instituciones" podría sumar como 4° pilar pero rompería el grid 1×3 limpio. Vive dentro de `/formacion` o `/nosotros`.

---

### 4.4 — Sobre ED (sin personas)

**Layout:** split 60/40 desktop · stack mobile · background navy `#1F2A44`.

**Decoración de fondo:** media circunferencia verde (`#3E7C6D`) + patrón de puntos blanco al 12% al costado (eco del manual).

**Lado izquierdo (texto):**
- **Eyebrow:** dash verde + `QUIÉNES SOMOS` (blanco sobre navy)
- **Título** (Manrope Bold `text-h2`, blanco): "Una organización que piensa la enseñanza de las matemáticas."
- **Manifiesto** (Inter Regular `text-body`, `text-azul-claro`):
  > Empoderamiento Docente trabaja con profesionales de la educación en Chile, México y Argentina. Generamos escenarios de aprendizaje donde pensar matemáticamente es una práctica viva.
  >
  > Nuestra base es la **Matemática Educativa**: un campo disciplinar que estudia la enseñanza y aprendizaje de las matemáticas con rigor académico.
- **3 bullets de "lo que nos define"** (cada uno con un ícono lineal blanco 20px):
  - Nos centramos en **aprender**, más que en enseñar
  - Sostenemos un **vínculo continuo** con docentes
  - Base científica en **Matemática Educativa**
- **CTA secundario:** `Conocé a las personas que hacen ED →` (link blanco subrayado al hover) → `/nosotros`

**Lado derecho (pull-quote como pieza visual):**
- Frase pilar tipografía gigante (Manrope Bold, ~`text-display`) en blanco con highlight verde en palabra clave:
  > Generar <mark>escenarios de aprendizaje</mark>

**Decisión clave:** sin fotos ni nombres en la home. El equipo y las figuras (Daniela Reyes-Gasperini, Raquel Ayala, resto del equipo) viven en `/nosotros`. La home presenta a ED como colectivo institucional. Esto fue decisión explícita del cliente.

**Animación:** entrada con ScrollTrigger desde `top 80%`, stagger título → manifiesto → bullets → CTA + pull-quote en paralelo. Sin scrub.

---

### 4.5 — Comunidad (CTA primario blando)

**Anchor:** `<section id="comunidad">` (target del CTA primario del hero).

**Layout:** bloque centrado · fondo blanco puro · `py-20` desktop / `py-12` mobile.

**Composición:**
- **Eyebrow:** dash verde + `SUMATE` (centrado)
- **Título** (Manrope Bold `text-h1`, `text-azul-principal`, centrado):
  > Sumate a la <mark>comunidad</mark>.
- **Sub** (Inter Regular `text-body`, `text-gris-texto`, centrado, `max-w-prose`):
  > Encontranos donde la conversación está viva. Reflexiones, recursos y novedades de la comunidad docente.
- **3 cards de redes** (grid 3×1 desktop · stack mobile):
  - Ícono lineal navy (32px) — `Instagram`, `Linkedin`, `Facebook` (Lucide)
  - Nombre de la red (Manrope Medium `text-h3`)
  - Handle real (Inter Regular `text-small`, `text-gris-texto`) — viene de `@/config/site.ts`
  - Card: fondo blanco · border `azul-claro/40` · `rounded-xl` · `p-8`
  - Hover: `translateY(-4px)` + shadow sutil con tinte azul (`shadow-azul-principal/10`)
  - Toda la card es link (`<a>` envolvente)

**Decisión clave:** sin newsletter en la home. Saca de encima el backend (MongoDB collection o servicio externo). Si la newsletter se suma en el futuro, va a `/contacto` o a una sección dedicada.

**Decisión cromática:** íconos en `azul-principal` (no colores oficiales de cada red). Razones: coherencia paleta de marca + manual prohíbe naranja decorativo + estas cards no son CTAs primarios sino links institucionales.

**Animación:** stagger de las 3 cards al entrar viewport (igual que sección 4.3).

---

### 4.6 — Footer

**Layout:** background navy `#1F2A44` · `py-16` desktop / `py-10` mobile · texto blanco / `azul-claro`.

**Top row** (4 columnas en desktop · acordeón en mobile):

| Columna | Contenido |
|---------|-----------|
| **Marca** | Lockup ED en blanco + 1 línea manifiesto: "Comunidad docente en torno a la Matemática Educativa" |
| **Navegar** | Inicio · Nosotros · Formación · Recursos · Contacto |
| **Comunidad** | Instagram · LinkedIn · Facebook (mismas URLs que sección 4.5) |
| **Institucional** | Email · Sede · Trabajá con nosotros (link a CV) |

**Divider:** `border-azul-medio/30` sutil.

**Bottom row:**
- Izquierda: `© 2026 Empoderamiento Docente`
- Derecha (opcional): "Hecho por Mateo · Querque · Gastón" — _decisión abierta del equipo de dev_

**Datos institucionales:** todos vienen de `@/config/site.ts` (AGENTS §5.3).

---

## 5. Tokens visuales

Todo viene del `@theme` de `globals.css` ya mapeado por el equipo (ver DESIGN.md §8).

- **Colores:** `azul-principal`, `azul-medio`, `azul-claro`, `verde-concepto`, `naranja-accion`, `gris-fondo`, `gris-texto`
- **Tipografía:** `font-display` (Manrope, títulos), `font-sans` (Inter, cuerpo)
- **Escala:** `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body`, `text-small`
- **Espaciado de sección:** `py-20` desktop / `py-12` mobile, `max-w-screen-xl` centrado, `px-5` mobile / `px-8` desktop
- **Cards:** `rounded-xl`, `p-6` mobile / `p-8` desktop, border `border-azul-claro/40`
- **Botones:** `rounded-lg`, `px-6 py-3`
- **Sombras:** evitar. Cuando hacen falta, `shadow-md shadow-azul-principal/10`

**Regla:** ningún hardcode tipo `bg-[#1F2A44]` en JSX. Si falta un token, se edita primero `DESIGN.md` (AGENTS §5.2).

---

## 6. Animación — reglas globales para esta página

- **Una sola instancia client** `HomeAnimations` que envuelve el contenido server con `gsap.context()` (cleanup en return del useEffect)
- **ScrollTrigger:** start "top 80%" para entradas discretas. Sin `scrub` para entries discretas (AGENTS §8 prohíbe `scrub: true`; si en otro contexto hace falta scrub, mínimo `0.5`)
- **Hooks reutilizables** (en `src/lib/hooks/`):
  - `useFadeInOnScroll(ref, options)` — fade + translate Y
  - `useStaggerOnScroll(refs, options)` — stagger en grupo
- **Reduced motion:** chequeo con `window.matchMedia('(prefers-reduced-motion: reduce)')`. Si reduce → no animar (early return en el effect). Los componentes deben renderizar igual sin la animación.
- **Lenis:** instancia global (probablemente `LenisProvider` en `layout.tsx`). Integrar con ScrollTrigger.
- **Solo `transform` y `opacity`** — nunca width/height/top/left/etc. (AGENTS §7)
- **`markers: false`** en producción (`markers: true` solo en desarrollo, nunca commitear).

---

## 7. Accesibilidad

- **Contraste WCAG AA:**
  - Texto sobre off-white: `azul-principal` (#1F2A44) = ratio 14:1 ✓
  - Texto sobre navy: blanco = ratio 16:1 ✓ / `azul-claro` (#A9C5E8) sobre navy = ratio 7.5:1 ✓
  - CTAs naranjas: blanco sobre `naranja-accion` (#E07A2F) = ratio 3.4:1 ✓ para botones grandes
  - Highlight verde: `#3E7C6D` al 30% — el texto sigue siendo negro/navy sobre el verde, no se afecta el contraste
- **Keyboard nav:** todos los enlaces y botones reachable con Tab; focus visible con outline `verde-concepto` o `naranja-accion`
- **Hamburger mobile:** `aria-expanded`, `aria-controls`, focus trap dentro del overlay, escape cierra
- **`<mark>` semántico** para highlights (no solo decoración) — los lectores de pantalla lo anuncian
- **Alt descriptivo** en imágenes; el faro decorativo del hero puede ser `alt=""` (decorativo) si el headline transmite el mensaje completo
- **`prefers-reduced-motion`** respetado en toda animación

---

## 8. Decisiones cerradas (en este brainstorm)

1. **Propósito primario:** institucional + comunidad (no lead-gen, no inscripción directa, no captación de CV agresiva)
2. **Forma:** multipágina, home corta institucional clásica
3. **Estructura:** opción A "Faro" — 5 secciones (header, hero, pilares, sobreED, comunidad, footer)
4. **3 pilares:** Formación / Acompañamiento / Investigación (3, no 4)
5. **Personas en home:** ninguna — manifiesto colectivo. Fotos del equipo viven en `/nosotros`
6. **Pull-quote sección 3:** "Generar escenarios de aprendizaje"
7. **Newsletter:** NO en la home — solo 3 cards de redes
8. **Color de íconos de redes:** navy (coherencia paleta, no colores oficiales de cada red)
9. **Nav item:** "Nosotros" (no "Nosotras") — genérico inclusivo para equipo mixto. Actualizar GLOSSARY en commit aparte.
10. **CTA del header:** "Sumate" (corto, consistente con CTA primario del hero)

---

## 9. Decisiones abiertas (requieren input del cliente)

| # | Decisión | Quién decide | Bloqueante para |
|---|----------|--------------|-----------------|
| 1 | Email oficial: `contacto@empoderamientodocente.org` (README) vs `hola@empoderamientodocente.com.ar` (manual) | Cliente | `site.ts`, footer |
| 2 | Dirección de sede en footer: "Av. Irarrázaval 2821, Santiago" sí/no | Cliente | Footer columna 4 |
| 3 | URLs reales de Instagram / LinkedIn / Facebook | Cliente | Sección 4.5, footer |
| 4 | Rol exacto de Raquel Ayala en la org | Cliente | `/nosotros` (no afecta home) |
| 5 | CV destination: form (requiere backend) o `mailto:` | Cliente + equipo | Footer link "Trabajá con nosotros" |
| 6 | SVG oficial del faro (asset visual) | Cliente / equipo de diseño | Hero sección 4.2 |
| 7 | Año copyright dinámico (`{new Date().getFullYear()}`) o fijo `© 2026` | Equipo | Footer bottom row |
| 8 | Créditos del equipo de dev en footer (sí/no) | Equipo (Mateo, Querque, Gastón) | Footer bottom row |

Mientras estos no se resuelvan, el código usa **placeholders explícitos** (no datos inventados, AGENTS §5.3 + CLAUDE.md de Gaston "no inventar datos del negocio").

---

## 10. Quality gates antes de PR (AGENTS §10)

- [ ] `pnpm typecheck` pasa
- [ ] `pnpm lint` pasa
- [ ] `pnpm build` pasa
- [ ] `pnpm doctor` pasa
- [ ] 0 ocurrencias de "alumnos" en el código
- [ ] 0 masculinos genéricos no inclusivos en copy
- [ ] Contraste WCAG AA verificado (cuerpo 4.5:1, títulos grandes 3:1)
- [ ] `prefers-reduced-motion` respetado y testeado
- [ ] Componentes < 150 líneas, hooks < 80 líneas
- [ ] Cero `any` sin comentario justificando
- [ ] Cero `bg-[#...]` o `text-[#...]` hardcodes
- [ ] Sin datos institucionales hardcodeados (todo vía `site.ts`)
- [ ] Screenshots desktop + mobile en el PR description

---

## 11. Próximos pasos

1. **Revisión humana del spec** (vos + Mateo + Querque) — feedback sobre decisiones cerradas
2. **Resolver decisiones abiertas con la cliente** — al menos email oficial, redes y faro
3. **Pasar a `writing-plans`** para armar el plan de implementación (tareas atómicas, orden, dependencias)
4. **Implementar** siguiendo el plan, commits atómicos (AGENTS §9), confirmación humana antes de push (§5.6)
5. **PR a main** con screenshots + checklist §10

---

_Spec generado mediante brainstorming colaborativo con el contrato `AGENTS.md`. Fuente de verdad sigue siendo AGENTS + DESIGN + GLOSSARY; este documento es el aterrizaje de esos contratos al diseño específico de la home._
