# Empoderamiento Docente — Web (rebuild) · Spec de diseño

**Fecha:** 2026-06-18
**Alcance de este spec:** base del proyecto nuevo + página **Inicio**.
Las otras 6 páginas (Qué hacemos, Quiénes somos, Investigación, Biblioteca,
Novedades, Contacto) tendrán su propio ciclo spec → plan → build después.

---

## 1. Objetivo

Reconstruir el sitio de ED desde cero, siguiendo el **sitemap aprobado**
(`site-map-ED.pdf`), replicando la **estética y el sistema de animación**
del proyecto actual (`repos/Empoderamiento-Docente`), pero ajustando el
contenido a estas reglas:

- **Copy parado desde el aprendizaje** (no desde la enseñanza). Decisión
  explícita del cliente-dev, anula la línea previa del material.
- **Lenguaje sin marcar género** (neutro/abarcativo; nada de "las y los").
  La *perspectiva* de género sigue siendo un valor (aparece en Quiénes somos),
  pero el lenguaje del copy es neutro.
- **Poco texto.** Frases cortas; nadie lee bloques largos.
- **Coherencia** entre todas las secciones.

Ubicación: `C:\Users\facun\repos\empoderamiento-docente-web` (proyecto nuevo,
no toca el actual).

---

## 2. Stack y arquitectura (replica del proyecto actual)

- Next.js 16.2.6 (App Router) · React 19 · TypeScript strict · pnpm.
- Tailwind v4 (tokens en `@theme` de `globals.css`).
- GSAP 3.15 + ScrollTrigger (+ MotionPath donde haga falta) + Lenis 1.3.
- Fuentes vía `next/font/google`: **Manrope** (display) + **Inter** (cuerpo).
- Estructura de carpetas: `src/app`, `src/components/{layout,ui,providers,brand}`,
  `src/features/home/{components,animations}`, `src/config/site.ts`, `src/lib/hooks`.

### Sistema de animación (no negociable)
- `LenisProvider` global en `app/layout.tsx`; Lenis corre dentro del ticker
  de GSAP; respeta `prefers-reduced-motion` (no monta Lenis).
- Un orquestador `HomeAnimations` que selecciona por `data-*` y usa
  `gsap.context()` para cleanup.
- Scroll-driven = `sticky top-0` + wrapper `h-[Nvh]` + timeline con `scrub`.
  **Nunca `pin:true`** (conflictúa con Lenis). Usar `fromTo` (no `gsap.set`)
  para rehidratar al hacer scroll hacia arriba.

---

## 3. Tokens de diseño (del manual de marca)

| Token | Valor | Uso |
|-------|-------|-----|
| `azul-principal` | `#1f2d4d` | Base, fondos oscuros, títulos sobre claro |
| `azul-medio` | `#4a6fa5` | Acentos, dots |
| `azul-claro` | `#a9c5e8` | Fondos suaves, texto sobre navy |
| `verde-concepto` | `#1f9a78` | Conceptos, highlight de palabra clave, íconos |
| `naranja-accion` | `#e07a2f` | **Solo CTAs** |
| `gris-fondo` | `#f2f4f7` | Fondo alternativo |
| `gris-texto` | `#6b7280` | Texto secundario |

Reglas: azul es la base; naranja solo acciones; verde para conceptos;
**verde y naranja no conviven**; contraste WCAG AA. Tipografía: Manrope 700
para títulos (tracking -0.02em), Inter 400/500 cuerpo. Escala fluida con
`clamp()` (display/h1/h2/h3/body/small). Utilidades: `.pattern-dots`,
`.bg-grain-light`, `.card-elevated`.

---

## 4. Navegación

Header (7 secciones del sitemap aprobado): **Inicio · Qué hacemos ·
Quiénes somos · Investigación · Biblioteca · Novedades · Contacto** + CTA
**Contacto** (naranja). Footer: nav secundaria + contacto real (ya en
`config/site.ts`: contacto@empoderamientodocente.org, Santiago, Chile).

---

## 5. Página Inicio — recorrido (8 bloques)

Orden de scroll según sitemap aprobado:

1. **APERTURA · Hero** — 2 columnas. Copy: "Transformamos el **aprendizaje**
   de la matemática" (highlight verde en "aprendizaje", frase pilar del manual)
   + bajada corta. Visual: logo + círculo verde + dots.
   CTAs: → Contacto (naranja) · ↗ Qué hacemos (secundario).
   Anim: entrada stagger fade/blur, H1 mask-reveal, parallax del círculo en scroll.

2. **INSTITUCIONAL · Acerca de + Valores** — "Consultora en educación
   especializada en Matemáticas." + 3 valores (1 palabra c/u).
   Anim: reveal + stagger. Enlace: ↗ Quiénes somos.

3. **IMPACTO Y CONFIANZA · Datos duros + Alianzas** — 3–4 cifras de alcance
   (contador animado) + tira de logos de aliados (solo autorizados: Techint /
   Roberto Rocca / CABA). Sin CTA. Cifras = placeholder hasta tener números reales.

4. **ENFOQUE · Cómo trabajamos** — síntesis del acompañamiento situado
   (pasos del método). Bloque scroll-driven sticky; pasos que se revelan.
   Enlace: ↗ Qué hacemos.

5. **ÁREAS · Líneas de acción** — áreas de trabajo en titulares cortos
   (lista editorial numerada). Anim: stagger lateral. Enlace: ↗ Investigación.

6. **CONTENIDOS · Biblioteca + Novedades** — 2 cards de acceso a recursos y
   últimas publicaciones. Anim: reveal en par. Enlaces: ↗ Biblioteca · ↗ Novedades.

7. **CONVERSIÓN · Forma parte de ED** — cierre breve orientado a la
   participación + CTA grande. → Contacto.

8. **CIERRE · Footer** — nav secundaria + contacto.

---

## 6. Componentes (unidades)

- `app/layout.tsx` — html/fonts, `LenisProvider`, Header, Footer, metadata.
- `components/providers/LenisProvider.tsx` — Lenis + GSAP ticker + reduced-motion.
- `components/layout/{Header,Footer,Brand}.tsx` — nav de 7 items, footer, marca.
- `components/ui/` — `ButtonPrimary` (naranja), `ButtonSecondary` (outline),
  `Eyebrow` (dash verde), `Highlight`, `SplitChars`/`TextReveal` (reveals),
  `ImagePlaceholder`, `AmbientShapes`.
- `features/home/components/` — `Hero`, `AcercaValores`, `DatosAlianzas`,
  `ComoTrabajamos`, `LineasAccion`, `BibliotecaNovedades`, `FormaParte`.
- `features/home/animations/HomeAnimations.tsx` — orquestador por `data-*`.
- `config/site.ts` — datos institucionales (reuso del actual).

Cada componente de sección expone `data-section` / `data-anim*` para que
`HomeAnimations` lo encuentre.

---

## 7. Fuera de alcance / a definir

- Cifras reales del bloque 3 (placeholder por ahora).
- Páginas internas (cada una su ciclo).
- Backend/formulario de Contacto (la página Contacto vendrá después).
- Contenido real de Biblioteca/Novedades (lo carga ED).

---

## 8. Testing / verificación

- `pnpm typecheck` + `pnpm lint` limpios.
- `pnpm dev` levanta sin errores; Inicio renderiza los 8 bloques.
- Animaciones scroll-driven funcionan al bajar y al subir (rehidratan).
- Verificación visual en navegador real (Lenis rompe scroll programático).
