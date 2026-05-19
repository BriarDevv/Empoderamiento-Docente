# Empoderamiento Docente — Sitio Institucional

> Sitio web institucional para **Empoderamiento Docente (ED)**, organización
> de desarrollo profesional docente con presencia en Chile, México y
> Argentina. Dirigido por **Daniela Reyes-Gasperini**, destacando también
> el trabajo de **Raquel Ayala** (rol exacto a confirmar con el cliente).
> Lanzamiento estimado: **junio 2026**.

[![Stack: Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000)](https://nextjs.org)
[![Lang: TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Styles: Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4)](https://tailwindcss.com)
[![Motion: GSAP + Lenis](https://img.shields.io/badge/Motion-GSAP%20%2B%20Lenis-88ce02)](https://gsap.com)
[![DB: MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248)](https://www.mongodb.com)
[![AI-Friendly](https://img.shields.io/badge/AI--Friendly-Claude%20%7C%20Codex%20%7C%20Gemini-8e44ad)](./AGENTS.md)

---

## Snapshot — dónde mirar qué

| Si querés…                            | Empezá por                                                |
| ------------------------------------- | --------------------------------------------------------- |
| Entender la arquitectura              | [`AGENTS.md`](./AGENTS.md) §1-§3                          |
| Conocer las reglas no negociables     | [`AGENTS.md`](./AGENTS.md) §5                             |
| Trabajar con tokens visuales          | [`DESIGN.md`](./DESIGN.md)                                |
| Escribir copy del sitio               | [`docs/GLOSSARY.md`](./docs/GLOSSARY.md) + AGENTS.md §5.1 |
| Hacer commits                         | [`docs/COMMITS.md`](./docs/COMMITS.md)                    |
| Escribir código IA-friendly           | [`docs/AI_GUIDELINES.md`](./docs/AI_GUIDELINES.md)        |
| Estilo de Markdown / naming / PRs     | [`docs/conventions/CODE-STYLE.md`](./docs/conventions/CODE-STYLE.md) |
| Decisiones arquitectónicas            | [`docs/architecture/adrs/`](./docs/architecture/adrs/)    |
| Reportar una vulnerabilidad           | [`SECURITY.md`](./SECURITY.md)                            |
| Onboardear una IA específica          | [`CLAUDE.md`](./CLAUDE.md) · [`CODEX.md`](./CODEX.md) · [`GEMINI.md`](./GEMINI.md) |

---

## Quickstart

```bash
# 1. Inicializar (chequea herramientas, copia .env.example → .env.local)
bash scripts/init.sh

# 2. Instalar dependencias
pnpm install

# 3. Completar .env.local con MONGODB_URI

# 4. Health check
pnpm doctor

# 5. Dev server
pnpm dev          # http://localhost:3000
```

Comandos disponibles:

| Comando            | Qué hace                                 |
| ------------------ | ---------------------------------------- |
| `pnpm dev`         | Next.js en modo desarrollo               |
| `pnpm build`       | Build de producción                      |
| `pnpm start`       | Servir el build                          |
| `pnpm lint`        | ESLint                                   |
| `pnpm typecheck`   | `tsc --noEmit`                           |
| `pnpm format`      | Prettier --write                         |
| `pnpm format:check`| Prettier --check                         |
| `pnpm doctor`      | Health check de §5 hard rules            |
| `pnpm check`       | lint + typecheck + format:check          |
| `pnpm check:all`   | check + doctor (lo que pide el CI)       |

También hay `Makefile` con los mismos atajos (`make build`, `make doctor`,
etc.) para quienes prefieren `make` sobre `pnpm`.

---

## Stack

| Capa            | Tecnología                                   |
| --------------- | -------------------------------------------- |
| Framework       | Next.js 16 (App Router + Turbopack)          |
| Lenguaje        | TypeScript strict                            |
| Estilos         | Tailwind CSS v4 con tokens en `DESIGN.md`    |
| Animación       | GSAP 3 + Lenis (smooth scroll)               |
| Datos           | MongoDB (driver oficial) + Zod               |
| Package manager | pnpm 11                                      |
| Runtime         | Node ≥ 22                                    |
| Hosting         | Vercel                                       |

Detalle y trade-offs en [`docs/architecture/adrs/0001-stack-base.md`](./docs/architecture/adrs/0001-stack-base.md).

---

## Arquitectura del repo

```
Empoderamiento-Docente/
├── AGENTS.md                # Contrato AI-neutral (fuente de verdad)
├── CLAUDE.md                # Adapter para Claude Code
├── CODEX.md                 # Adapter para OpenAI Codex CLI
├── GEMINI.md                # Adapter para Gemini CLI
├── DESIGN.md                # Sistema de diseño (tokens, tipos, reglas)
├── README.md                # Este archivo
├── SECURITY.md              # Política de seguridad y canal de reportes
├── Makefile                 # Atajos cross-platform (opcional)
├── commitlint.config.cjs    # Enforce de Conventional Commits
├── .editorconfig            # Charset + EOL + indentación
├── .gitattributes           # LF forzado, lockfile binario
├── .prettierrc / .prettierignore
├── .env.example
├── .github/
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   └── workflows/
│       ├── ci.yml           # Lint + typecheck + format + build
│       └── deploy-web.yml   # Placeholder (Vercel maneja deploy)
├── .husky/                  # Git hooks (pre-commit, commit-msg)
├── docs/
│   ├── README.md            # Índice de docs auxiliares
│   ├── COMMITS.md           # Conventional Commits + atómicos
│   ├── GLOSSARY.md          # Jerga del dominio ED
│   ├── AI_GUIDELINES.md     # 18 reglas de código IA-friendly
│   ├── conventions/
│   │   └── CODE-STYLE.md    # Estilo no automatizable
│   └── architecture/
│       └── adrs/            # Architecture Decision Records
├── scripts/
│   ├── ed-doctor.sh         # Health check de §5 hard rules
│   └── init.sh              # Bootstrap para developer nuevo
├── skills/
│   ├── pr-review/SKILL.md   # Workflow de review de PRs
│   └── adr-create/SKILL.md  # Workflow para nuevos ADRs
├── public/
└── src/
    ├── app/                 # Rutas Next.js (App Router)
    ├── components/          # UI reutilizable
    ├── features/            # Módulos por dominio
    ├── lib/                 # Utilidades, clientes (db, etc.)
    ├── config/              # site.ts (datos institucionales)
    ├── styles/              # globals.css con tokens
    └── types/               # Tipos compartidos
```

**Golden rule:** los `.md` raíz y `docs/` son la fuente de verdad. Los
folders `.claude/`, `.codex/`, `.gemini/` (cuando se sumen) son
adaptadores — nunca contenido propio.

---

## Para agentes de IA

Si sos una IA trabajando en este repo:

1. **Leé [`AGENTS.md`](./AGENTS.md)** — contrato AI-neutral. Cubre hard
   rules, quality standards, anti-patterns, commit protocol.
2. **Leé tu adapter** según la herramienta:
   - Claude Code → [`CLAUDE.md`](./CLAUDE.md)
   - OpenAI Codex → [`CODEX.md`](./CODEX.md)
   - Gemini → [`GEMINI.md`](./GEMINI.md)
   - Cursor / Copilot / otras → seguí `AGENTS.md` directamente.
3. **Si vas a tocar diseño** → [`DESIGN.md`](./DESIGN.md).
4. **Si vas a tocar copy** → [`docs/GLOSSARY.md`](./docs/GLOSSARY.md) +
   las hard rules de lenguaje inclusivo en `AGENTS.md` §5.1.
5. **Si tu workflow matchea una skill** → leer
   [`skills/<nombre>/SKILL.md`](./skills/).

### Reglas que no se discuten (resumen ejecutivo)

- **Lenguaje inclusivo siempre** (`las y los`), nunca "alumnos" → siempre
  "estudiantes".
- **Tokens, no hardcodes.** Colores y tipos viven en `DESIGN.md`.
- **Naranja solo para CTAs.** Verde para conceptos. Azul base. Verde y
  naranja no compiten en el mismo bloque.
- **Commits atómicos** con Conventional Commits, en español, imperativo.
  Muchos commits chicos > pocos commits gigantes.
- **`main` solo se actualiza vía PR mergeado.** Push directo prohibido
  salvo emergencia documentada (AGENTS.md §5.7).
- **Confirmación humana** antes de cualquier `git commit`, `git push`,
  `pnpm add`, o cambio en los meta-docs.

---

## Cómo contribuir

1. **Onboarding:** `bash scripts/init.sh` → seguir las instrucciones que
   imprime.
2. **Leer** [`AGENTS.md`](./AGENTS.md) + [`docs/COMMITS.md`](./docs/COMMITS.md)
   + [`docs/conventions/CODE-STYLE.md`](./docs/conventions/CODE-STYLE.md).
3. **Branchear desde `main`** con naming
   `<tipo>/<scope>-<descripcion-corta>` (ver CODE-STYLE.md).
4. **Commits atómicos** siguiendo `docs/COMMITS.md`. El hook commit-msg
   te frena si no cumple.
5. **Pre-PR:** `pnpm check:all` debe pasar verde.
6. **PR description** usa
   [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md);
   no borrar las secciones de Compliance ni Test plan.
7. **Merge:** Rebase and merge desde GitHub UI (única opción habilitada).
   Push directo a `main` está prohibido.

---

## Estado del proyecto

- [x] Manual de marca procesado → `DESIGN.md`
- [x] Documentación AI-neutral (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`)
- [x] Scaffold Next.js 16 + TS strict + Tailwind v4 + ESLint 9
- [x] Stack adicional: GSAP, Lenis, MongoDB driver oficial, Zod
- [x] Tooling: Prettier + `prettier-plugin-tailwindcss`
- [x] Mapear tokens de `DESIGN.md` al Tailwind v4 (`@theme` en `globals.css`)
- [x] Cargar fuentes Manrope + Inter (`next/font/google`)
- [x] Configurar metadata base + `lang="es"` en root layout
- [x] CI workflow (lint + typecheck + format + build)
- [x] Pre-commit hooks (husky + lint-staged + commitlint + ed-doctor)
- [x] Templates de PR e issue
- [x] CODEOWNERS + branch protection (linear history, sin force-push,
      rebase merge único)
- [x] SECURITY.md + scripts de onboarding/health check
- [x] Skills (pr-review, adr-create) + primer ADR (stack base)
- [ ] Crear `src/config/site.ts` con datos institucionales
- [ ] Conectar MongoDB (Atlas vs local — pendiente decisión)
- [ ] Reemplazar placeholder de `src/app/page.tsx` por home real
- [ ] Sitemap definitivo

---

## Identidad visual

Resumen rápido (detalle completo en [`DESIGN.md`](./DESIGN.md)):

- **Paleta:** azul naval `#1F2A44` base, azul medio `#4A6FA5`, azul claro
  `#A9C5E8`, verde concepto `#3E7C6D`, naranja acción `#E07A2F`, neutros
  `#F2F4F7` y `#6B7280`.
- **Tipografías:** **Manrope** (títulos, subtítulos), **Inter** (cuerpo).
- **Tono:** sobrio, profesional, cálido. Sin estética infantil.
- **Movimiento:** GSAP + Lenis, contenido (400-800ms, easing
  `power2.out`), respeta `prefers-reduced-motion`.

---

## Contacto

- **Cliente:** Empoderamiento Docente
- **Mail institucional:** `contacto@empoderamientodocente.org`
- **Dirección:** Avenida Irarrázaval 2821, Torre B, Oficina 527, Santiago,
  Región Metropolitana, Chile.

---

## Licencia

Pendiente de definir con el cliente.
