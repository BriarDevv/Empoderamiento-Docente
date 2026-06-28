# AGENTS.md — Orchestrator Contract

> Contrato AI-neutral para trabajar dentro de este repositorio. Cualquier
> agente de IA (Claude, Codex, Gemini, Cursor, otros) lee este archivo para
> entender cómo opera el sistema. Mappings específicos de cada IA viven en
> archivos adaptadores (`CLAUDE.md`, `GEMINI.md`, `.codex/`).

---

## Quickstart (30 segundos)

- **Qué es:** sitio web institucional de **Empoderamiento Docente (ED)**.
- **Stack:** Next.js (App Router) + TypeScript strict + Tailwind + GSAP +
  Lenis + MongoDB.
- **Lanzamiento:** **junio 2026** (estimado).
- **Reglas duras** (no negociables):
  1. **Lenguaje inclusivo siempre** (`las y los`), nunca "alumnos" → siempre "estudiantes".
  2. **Tokens, no hardcodes.** Colores y tipos viven en `DESIGN.md`.
  3. **Naranja solo CTAs.** Verde para conceptos. Azul base.
  4. **Commits atómicos** Conventional, español, imperativo.
  5. **Confirmación humana** antes de commits, push, dependencias o tocar
     meta-docs.
- **Empezá leyendo:** este archivo + [`docs/README.md`](docs/README.md).

---

## Read Order by Task

### Siempre primero

1. Este archivo (`AGENTS.md`).
2. [`docs/README.md`](docs/README.md) — índice de documentación auxiliar.

### Después, según la tarea

| Tarea                                       | Leer en este orden                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Crear o modificar **componente UI**         | `DESIGN.md` → `docs/AI_GUIDELINES.md`                                                       |
| Implementar una **página nueva**            | `DESIGN.md` → `docs/AI_GUIDELINES.md` → `docs/GLOSSARY.md`                                  |
| **Animar** algo (GSAP / Lenis)              | §7 global rules → §8 anti-patterns GSAP → `docs/AI_GUIDELINES.md` §11                       |
| Escribir o revisar **copy**                 | `docs/GLOSSARY.md` → §5.1 lenguaje inclusivo → §5.5 mensajes pilares                        |
| Crear un **endpoint** / Route Handler       | `docs/AI_GUIDELINES.md` §8 + §12 → §7 global rules (API)                                    |
| Diseñar **schema o query** de Mongo         | `docs/AI_GUIDELINES.md` §12 → §7 global rules (DB)                                          |
| Configurar **metadata / SEO**               | `docs/AI_GUIDELINES.md` (SEO) → §6 quality standards (contenido)                            |
| **Refactorizar**                            | `docs/AI_GUIDELINES.md` (todo) → §8 anti-patterns → §9 commit protocol                      |
| Hacer **commits**                           | `docs/COMMITS.md` → §9 commit protocol                                                      |
| Hacer **review** antes de PR                | §6 quality standards → §10 pre-PR checklist                                                 |
| Entender la **arquitectura del repo**       | `README.md` → §1 purpose → §3 project structure                                             |
| **Instalar y correr local**                 | `README.md` quickstart                                                                      |

> Si tu tarea no entra en la tabla, pedile al usuario que la describa y
> elegí el enfoque que consideres apropiado (trabajo directo o delegación
> a un sub-agente, según las herramientas de la IA que estés usando).

---

## 1. System Purpose

Construir el sitio web institucional de **Empoderamiento Docente (ED)**,
organización dirigida por **Daniela Reyes-Gasperini** que trabaja desarrollo
profesional docente en Chile, México y Argentina. El sitio también destaca
el trabajo y la trayectoria de **Raquel Ayala** (rol exacto y vínculo con
ED a definir con el cliente).

**Lanzamiento:** junio 2026 (estimado).
**Metas medibles:**
1. Posicionamiento institucional en buscadores y redes.
2. Captación de docentes vía CTA de envío de CV.
3. Comunicación clara de la oferta formativa (talleres, cursos, diplomaturas).

---

## 2. Stack

- **Next.js** (App Router)
- **TypeScript** (strict, sin `any` salvo justificación)
- **Tailwind CSS**
- **GSAP 3** + **Lenis** (animaciones, smooth scroll)
- **MongoDB** (driver oficial o Mongoose — pendiente decisión en init)

Versiones exactas → `package.json` cuando exista. Fijar majors, minors flotando (`^`).

---

## 3. Project Structure

```
/
├── AGENTS.md              ← este archivo (contrato AI-neutral)
├── CLAUDE.md              ← adapter para Claude Code
├── DESIGN.md              ← sistema de diseño (tokens, tipos, reglas)
├── README.md              ← onboarding humano
├── docs/
│   ├── README.md          ← índice de documentación
│   ├── COMMITS.md         ← convenciones de commit
│   ├── GLOSSARY.md        ← jerga del dominio ED
│   ├── AI_GUIDELINES.md   ← reglas detalladas de código IA-friendly
│   └── adr/               ← decisiones arquitectónicas (cuando aplique)
├── public/
├── src/
│   ├── app/               ← rutas Next.js (App Router)
│   ├── components/        ← UI reutilizable
│   ├── features/          ← módulos por dominio
│   ├── lib/               ← utilidades, clientes (db, etc.)
│   ├── config/            ← site.ts (datos institucionales)
│   ├── styles/            ← globals.css, tokens
│   └── types/             ← tipos compartidos
└── .claude/               ← adapter Claude (settings; opcionalmente sub-agentes y slash-commands)
```

**Golden rule:** los `.md` raíz y `docs/` son la fuente de verdad. Los
folders `.claude/`, `.gemini/`, `.codex/` (cuando se sumen) son adaptadores
— nunca contenido propio.

---

## 4. Cuándo delegar (vs. trabajar directo)

Cada IA decide **cómo y a quién delegar** según las herramientas que
tiene disponibles. Este repo no prescribe un roster fijo de sub-agentes —
es decisión de la IA (o del operador humano) elegir el enfoque correcto.

**Delegar a un sub-agente / contexto separado** cuando:
- La tarea requiere búsqueda extensa (>3 lecturas de archivos).
- Hay un dominio claramente especializado (animación, schema de DB, copy).
- Conviene proteger el contexto del hilo principal.
- La tarea es paralelizable (varias búsquedas o validaciones independientes).

**Trabajar directo** cuando:
- Es 1-2 archivos conocidos.
- Es decisión que requiere conversación con el usuario.
- Es escribir documentación o discutir arquitectura.

**Reglas comunes a cualquier delegación:**
- **Briefing auto-contenido:** un sub-agente no asume que leyó la
  conversación. Pasale todo el contexto necesario.
- **Verificación obligatoria:** quien delega revisa el resultado leyendo
  los archivos, no se confía del resumen.
- **Output formateado:** pedile el formato que necesitás (archivos
  modificados, reporte breve, lista de hallazgos…).

---

## 5. Hard Rules (no negociables)

Toda IA y todo humano que toque este repo respeta estas reglas. Sin
excepción.

### 5.1. Lenguaje inclusivo

Toda copy del sitio (UI, contenido, alt-text, errores, metadatos, emails)
usa lenguaje inclusivo:

- Desdoblamiento: `las y los profesores`, `las y los estudiantes`.
- **Nunca "alumnos"** → siempre `estudiantes` (ED evita "alumno"
  explícitamente: significa "sin luz").
- Cuidar inclusión de género en cargos, profesiones y roles.

### 5.2. Tokens, no hardcodes

- Colores, tipografías, espaciado, radius → tokens definidos en `DESIGN.md`,
  mapeados al config de Tailwind.
- **Sin valores arbitrarios** (`bg-[#1F2A44]`) salvo prototipo.
- Si hace falta un token nuevo, **se edita `DESIGN.md` primero**, después
  el código.
- Reglas claves: azul base, **naranja solo CTAs**, verde para conceptos,
  verde y naranja no compiten en el mismo bloque.

### 5.3. Datos institucionales centralizados

- Email, dirección, teléfono, URLs de redes → `src/config/site.ts`.
- Nunca hardcodear datos institucionales en JSX.

### 5.4. Logos de aliados

Solo publicar con autorización confirmada por el usuario. Por defecto, NO
publicar. Aliados a chequear antes de cada uso: Ministerios de Educación
(CL/MX/AR), Techint, OEI, ser+, SEMS-SEP, CENEVAL.

### 5.5. Mensajes pilares

Reusar (no parafrasear sin chequear) las frases pilares de ED:

- "Generar escenarios de aprendizaje"
- "Potenciamos fortalezas, fortalecemos potencialidades"
- ED se centra en **aprender** más que en **enseñar**
- Las y los docentes son **profesionales de la educación**
- "Comunidad docente en torno a la Matemática Educativa"

### 5.6. Acciones que requieren confirmación humana

Ninguna IA ejecuta sin confirmación explícita del usuario:

- `git commit`, `git push`, `git reset --hard`, force-push.
- Crear/cerrar PRs o issues.
- Agregar dependencias (`npm install`, `pnpm add`).
- Modificar `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`,
  `DESIGN.md`.
- Ejecutar migraciones de DB en cualquier ambiente.
- Cualquier acción visible fuera del repo local.

### 5.7. Estrategia de merge a `main`

- **`main` solo se actualiza vía PR mergeado en GitHub.** Push directo
  a `main` está prohibido salvo emergencia documentada por escrito
  (incident, prod caída). Aún en ese caso, abrir el PR del fix después
  de estabilizar para que el cambio quede revisado.
- **Estrategia:** *Rebase and merge*. Mantiene el grafo lineal y
  preserva los commits atómicos que pide §9. Merge commit y squash
  están deshabilitados a nivel repo.
- **Branch protection** (configurada en GitHub):
  - `required_linear_history: true`.
  - `allow_force_pushes: false`.
  - `allow_deletions: false`.
  - `required_conversation_resolution: true` (resolver review comments
    antes de mergear).
  - `required_approving_review_count: 0` — el gate de review es
    *cultural* (CODEOWNERS + convención), no técnico. Subir a 1+
    cuando el equipo crezca.
- **CI debe estar verde** antes de pedir review (`pnpm doctor`,
  `pnpm check`, `pnpm build`).

---

## 6. Quality Standards (medibles)

### Contenido

- [ ] 0 ocurrencias de "alumno/alumnos/alumna/alumnas" en copy público.
- [ ] 0 masculinos genéricos detectables ("los profesores" sin desdoblar).
- [ ] Todo CTA usa verbo en imperativo ("Inscribite", "Descargá", "Sumate").
- [ ] Toda página tiene `<title>` y `<meta description>` únicos.
- [ ] Imágenes con `alt` descriptivo (no decorativo) cuando aportan info.

### Diseño / UI

- [ ] Contraste WCAG AA (4.5:1 cuerpo, 3:1 títulos grandes).
- [ ] Solo un CTA primario (naranja) visible por viewport.
- [ ] Verde y naranja nunca conviven en primer plano.
- [ ] Tipografía: Manrope para títulos/subtítulos, Inter para cuerpo.
- [ ] `prefers-reduced-motion` respetado en toda animación.

### Código

- [ ] TypeScript strict pasa sin warnings.
- [ ] Lint pasa.
- [ ] Componentes < 150 líneas, hooks < 80 líneas, route handlers < 100.
- [ ] Cero `any` sin comentario justificando.
- [ ] Cero rutas relativas largas (`../../..`) — usar `@/` alias.

### Performance (target en producción)

- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms

---

## 7. Global Rules (técnicas)

- **Server Components por defecto.** `"use client"` solo cuando hace falta.
- **Animaciones:** solo `transform` y `opacity`, nunca `width`/`height`/
  `top`/`left`.
- **GSAP:** registrar plugins una vez, usar `gsap.context()` para cleanup,
  `gsap.matchMedia()` para responsive + reduced-motion.
- **Lenis:** una sola instancia global, integrada con ScrollTrigger.
- **Imágenes:** `next/image` con `alt`, `width`, `height`, `loading="lazy"`
  excepto LCP.
- **Fonts:** `next/font/google` con `display: 'swap'` y subset `latin`.
- **API:** validar input con Zod, devolver `Response.json()` con status
  correcto, no exponer detalles internos en errores.
- **DB:** schemas en `src/lib/db/schemas/`, queries en `src/lib/db/queries/`,
  nunca queries inline en componentes ni en handlers.
- **Imports:** orden framework → externos → internos (`@/...`).
- **Naming:** PascalCase componentes/tipos, camelCase utils/hooks
  (con prefijo `use`), SCREAMING_SNAKE_CASE constantes, kebab-case carpetas.

---

## 8. Anti-Patterns

Detectables en code review automático. No deben llegar a `main`.

### Código
- `any` sin justificación.
- Rutas relativas largas (`../../../`).
- Hardcodes de color/typo/spacing.
- Comentarios que describen el "qué" en vez del "por qué".
- Componentes monstruo (>200 líneas).
- Estado en componentes server (no se puede; debe ser señal de mala separación).

### GSAP
- `scrub: true` (usar `scrub: 0.5` mínimo).
- ScrollTrigger sobre tweens hijos de timeline (poner en el timeline).
- `scrub` + `toggleActions` juntos.
- `markers: true` en producción.
- Animar propiedades caras (layout-affecting).
- Olvidar cleanup de `gsap.context()`.

### Contenido
- Masculino genérico ("los profesores").
- "Alumnos" en cualquier lugar.
- Siglas sin glosa en primera mención (ED, OEI, SEMS-SEP).
- Marketing barato ("revolucioná tu aula", "transformá tu vida").

### Commits
- Mensajes vagos ("cambios", "wip", "asdf").
- Mezclar varios scopes en un commit.
- `git add -A` o `git add .` sin verificar staging.
- Commitear sin lint/typecheck pasando.

---

## 9. Commit Protocol

**Conventional Commits + atómicos + alta granularidad.** Detalle completo
en `docs/COMMITS.md`.

Resumen para agentes:

```
<tipo>(<scope>): <descripción imperativa minúsculas>

[cuerpo opcional con el porqué]
```

- Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
  `chore`, `build`, `ci`, `content`, `design`.
- Idioma: español, imperativo.
- Header ≤ 72 chars, sin punto final.
- Un commit = un cambio lógico. **Muchos commits chicos > pocos gigantes.**
- Si el cambio toca varios scopes, partirlo en commits separados.

**Ninguna IA commitea sin que el usuario lo confirme explícitamente.**
Para cualquier cambio listo para versionar:

1. Listar los commits planeados (en seco).
2. Esperar OK del usuario.
3. Ejecutar.

---

## 10. Pre-PR Checklist (mandatorio)

Antes de pedir merge a `main`:

- [ ] `pnpm typecheck` (o equivalente) pasa.
- [ ] `pnpm lint` pasa.
- [ ] `pnpm build` pasa.
- [ ] Tests pasan (si existen).
- [ ] Quality Standards (§6) cumplidos en lo modificado.
- [ ] No hay copy con masculino genérico ni "alumnos".
- [ ] No hay logos de aliados sin autorización confirmada.
- [ ] Commits atómicos siguiendo `docs/COMMITS.md`.
- [ ] PR description en español, link a la sección/feature, screenshots
  cuando sea visual.

---

## 11. References

- **Mensajes pilares de marca:** §5.5 de este archivo + `docs/GLOSSARY.md`.
- **Sistema de diseño:** `DESIGN.md`.
- **Convenciones de commit:** `docs/COMMITS.md`.
- **Guía de código IA-friendly:** `docs/AI_GUIDELINES.md`.
- **Glosario del dominio:** `docs/GLOSSARY.md`.
- **Adapter Claude:** `CLAUDE.md`.
- **Adapter Gemini:** `GEMINI.md` (cuando se sume).
- **Adapter Codex:** `.codex/AGENTS.override.md` (cuando se sume; Codex
  lee `AGENTS.md` nativamente).

---

## 12. Estado del proyecto

- [x] Manual de marca procesado → `DESIGN.md`
- [x] Documentación AI-neutral inicial (`AGENTS.md`, `CLAUDE.md`, `docs/`)
- [x] Scaffold Next.js 16 (App Router + Turbopack) + TS strict + Tailwind v4 + ESLint 9
- [x] Stack adicional instalado: GSAP, Lenis, MongoDB driver oficial, Zod
- [x] Tooling: Prettier + `prettier-plugin-tailwindcss`
- [x] `pnpm-workspace.yaml` con `allowBuilds` aprobando sharp y unrs-resolver
- [x] `git init` + remote `origin` (`BriarDevv/Empoderamiento-Docente`)
- [x] Primer commit + push inicial (4 commits atómicos en `main`)
- [x] Mapear tokens de `DESIGN.md` al Tailwind v4 (`globals.css` con `@theme`)
- [x] Cargar fuentes Manrope + Inter (`next/font/google`)
- [x] Configurar metadata base + `lang="es"` en root layout
- [ ] Crear `src/config/site.ts` con datos institucionales
- [ ] Conectar MongoDB (Atlas vs local — pendiente decisión)
- [ ] Reemplazar placeholder de `src/app/page.tsx` por home real
- [ ] Sitemap definitivo
- [ ] CI/CD
