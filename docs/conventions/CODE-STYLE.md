# CODE-STYLE.md — Estilo de código y documentación

> Las reglas operativas viven en configuración (`.prettierrc`,
> `.editorconfig`, `eslint.config.mjs`, `tsconfig.json`,
> `commitlint.config.cjs`). Este archivo agrupa las decisiones de estilo
> **que las herramientas no enforce-an** y sirve como índice para
> encontrar dónde vive cada regla.

---

## Índice rápido por archivo

| Donde vive                | Qué regula                                  |
| ------------------------- | ------------------------------------------- |
| `.prettierrc`             | Format JS/TS/JSON/CSS (semi, quotes, width) |
| `.prettierignore`         | Qué no formatea Prettier                    |
| `.editorconfig`           | Charset, EOL (LF), indentación base         |
| `.gitattributes`          | EOL forzado a LF; lockfiles binarios        |
| `eslint.config.mjs`       | Reglas semánticas TS/React/Next.js          |
| `tsconfig.json`           | TS strict + path aliases                    |
| `commitlint.config.cjs`   | Conventional Commits, tipos válidos         |
| `docs/COMMITS.md`         | Convención humana de commits                |
| `docs/AI_GUIDELINES.md`   | Reglas de código IA-friendly (18 reglas)    |
| `docs/GLOSSARY.md`        | Vocabulario del dominio                     |
| `DESIGN.md`               | Tokens visuales                             |
| `AGENTS.md`               | Hard rules + quality standards              |

---

## Reglas que las herramientas no enforce-an

### Markdown

- **Sin emojis** salvo que el cliente lo pida explícito. Los badges del
  README son la excepción permitida (usan shields.io con texto, no
  pictogramas Unicode).
- **80 columnas prose-wrap** como objetivo. Prettier ignora Markdown a
  propósito; el wrap lo cuidás vos al escribir.
- **Headers ATX (`#`, `##`, `###`)**, no setext (`====`, `----`).
- **Listas con guion `-`**, no asterisco `*`.
- **Code fences con triple backtick y lenguaje declarado** (` ```ts `,
  no ` ``` ` pelado). Lenguajes válidos comunes: `ts`, `tsx`, `js`,
  `bash`, `yaml`, `jsonc`, `md`, `diff`.
- **Tablas alineadas con espacios** para que el raw sea legible; GitHub
  las renderiza igual si no, pero la lectura en el editor sufre.

### Naming

Detalle en [`../AI_GUIDELINES.md`](../AI_GUIDELINES.md) §3. Lo que se
repite acá por visibilidad:

- **Identificadores en código:** inglés salvo conceptos del dominio
  educativo que no traducimos (`trayecto`, `formacion`, `diplomatura`,
  `inscripcion`).
- **Identificadores visibles al usuario:** español inclusivo.
- **Branches:** `<tipo>/<scope>-<descripcion-corta>` en kebab-case.
  Ejemplos:
  - `feat/home-hero`
  - `fix/forms-validacion-email`
  - `chore/ci-deploy-placeholder`
  - `docs/glossary-aliados`
- **Tags:** `v0.x.y` semver, prefijo `v` obligatorio.

### Estructura de PRs

- **Un PR = una unidad lógica de cambio.** Si toca 5 áreas distintas,
  partilo en 2-3 PRs encadenados.
- **Título sigue Conventional Commits** del commit principal:
  `feat(home): integrar hero con animación de faro`.
- **Descripción usa `.github/PULL_REQUEST_TEMPLATE.md`** sin borrar las
  secciones de Compliance y Test plan.
- **Tamaño objetivo:** ≤ 400 líneas cambiadas (excluyendo lockfile y
  artifacts). Más que eso, considerá partirlo.

### Idioma

| Contexto                | Idioma                                       |
| ----------------------- | -------------------------------------------- |
| Identificadores código  | Inglés (con concepto-dominio en español)     |
| Commits                 | Español, imperativo (`agregar`, no `agregado`) |
| PR / issues             | Español                                      |
| Docs (`.md`)            | Español rioplatense conversacional           |
| Copy del sitio          | Español inclusivo (`AGENTS.md` §5.1)         |
| Comentarios de código   | Español (default), consistente por archivo   |

### Antipatrones que no detecta ESLint

- Comentarios que describen el **qué** en vez del **por qué**.
- `TODO` sin contexto (sin "qué falta" y "por qué no se hizo ahora").
- Archivos > 300 líneas — partir antes de cruzar ese umbral.
- Hooks o componentes con > 5 props sin nombrar las props como tipo
  (`type FooProps = {...}`).
- `useEffect` sin cleanup cuando crea suscripciones, timers, listeners
  o controllers.
- Imports relativos largos (`../../../`) — usar `@/`.
- Estado en componentes server (no se puede ni debería).

---

## Cómo evoluciona esta lista

Cuando aparezca una decisión de estilo nueva:

- **Si las tools la pueden enforce-ar** → mejor sumar la regla a
  `.prettierrc`, `eslint.config.mjs` o `.editorconfig`. Acá solo dejamos
  la referencia al archivo donde quedó.
- **Si es decisión humana** (Markdown, naming de branches, idioma) →
  sumarla acá.
- **Si es del dominio educativo / IA-friendly** → va a
  [`../AI_GUIDELINES.md`](../AI_GUIDELINES.md) o
  [`../GLOSSARY.md`](../GLOSSARY.md).
