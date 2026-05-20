# CONTRIBUTING.md — Cómo contribuir a Empoderamiento Docente

> **Antes de nada:** leer [`AGENTS.md`](./AGENTS.md). Es el contrato del
> repo y aplica para humanos y para IAs por igual.

## Flujo de trabajo

> **Regla del repo — `main` solo se actualiza vía PR mergeado en
> GitHub** (AGENTS.md §5.7).
>
> **Prohibido**, aunque haya OK humano para el comando individual:
>
> - `git push origin main` directo (sin pasar por PR).
> - `git merge <rama>` local hacia `main` + `git push` del resultado.
> - `git push --force` o cualquier force-push a `main`.
> - Borrar la rama `main` (`git push origin :main`,
>   `git branch -D main` seguido de un push, etc.).
>
> Branch protection en GitHub la hace cumplir técnicamente
> (`required_linear_history: true`, sin force-push, sin delete). Si la
> protection no estuviera habilitada por algún motivo, la regla sigue
> vigente por convención del equipo.

### 1. Crear branch desde `main`

Naming (`docs/conventions/CODE-STYLE.md`):

- `feat/<scope>-<descripcion-corta>` — feature nueva
- `fix/<scope>-<descripcion>` — bug
- `docs/<descripcion>` — solo documentación
- `chore/<descripcion>` — tareas de mantenimiento
- `design/<descripcion>` — cambios en tokens visuales
- `content/<descripcion>` — solo copy del sitio

Ejemplos:

- `feat/home-hero-faro`
- `fix/forms-validacion-email`
- `docs/glossary-aliados`
- `design/refinar-iconografia`

**Antes de `git checkout -b`:** verificar que estás parado en `main`
sincronizado con `origin/main`:

```bash
git checkout main
git pull --rebase origin main
git status         # debe estar limpio
```

`ed-doctor` (check #6) valida esto automáticamente — si tu rama no
deriva del tip de `origin/main`, el pre-commit te lo avisa.

**Sync con remote: rebase, no merge.** Configuración global
recomendada: `git config --global pull.rebase true`.

### 2. Commits

Conventional Commits en español, imperativo, y **atómicos** — un commit
= un cambio lógico (`docs/COMMITS.md` + `AGENTS.md` §9).

```
feat(home): agregar hero con animación de faro
fix(forms): corregir validación de email del CV
docs(architecture): agregar ADR-002 sobre conexión a Mongo
chore(deps): actualizar gsap a 3.16
refactor(lib/db): renombrar Inscripcion a InscripcionFormacion
```

Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
`test`, `chore`, `build`, `ci`, `content`, `design`, `revert`.
`commitlint` rechaza otros automáticamente.

**Cómo splitear PRs grandes:** si pasás de ~200 líneas o de 3 archivos
en áreas distintas, parar y splitear antes de pushear. Detalle en
[`docs/COMMITS.md`](./docs/COMMITS.md) §4 (Atomicidad).

### 3. Verificación local pre-PR

`pnpm check:all` corre todo lo que CI corre (más el doctor):

```bash
pnpm check:all
# equivale a:
#   pnpm lint          (eslint)
#   pnpm typecheck     (tsc --noEmit)
#   pnpm format:check  (prettier)
#   pnpm doctor        (scripts/ed-doctor.sh)
```

Y `pnpm build` debe pasar.

### 4. Pull request

- **Template obligatorio:** [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md).
  No borrar las secciones de **Compliance** ni **Test plan**.
- **Tamaño objetivo:** ≤ 400 líneas cambiadas (excluyendo lockfile). Si
  es más grande, considerá splitear por commits o por PRs encadenados.
- **CODEOWNER:** GitHub asigna automáticamente según
  `.github/CODEOWNERS`.
- **Sin auto-merge.**
- **CI verde antes de pedir review** — no pedir review con jobs
  fallando.
- **Merge strategy:** *Rebase and merge* (única opción habilitada).
  Comando: `gh pr merge <N> --rebase --delete-branch` o el botón
  "Rebase and merge" en la UI. Mantiene `main` lineal.

## Code review

- IAs pueden hacer una pasada de review usando
  [`skills/pr-review/SKILL.md`](./skills/pr-review/SKILL.md), pero la
  **aprobación final es humana** (AGENTS.md §5.6).
- Cualquier PR que toque meta-docs (`AGENTS.md`, `CLAUDE.md`,
  `CODEX.md`, `GEMINI.md`, `DESIGN.md`, `docs/GLOSSARY.md`,
  `docs/COMMITS.md`) requiere aprobación de @BriarDevv (resto del
  equipo se suma cuando sean dados de alta como colaboradores).
- Cambios en tokens visuales sin actualizar `DESIGN.md` se piden
  cambios.
- Copy sin lenguaje inclusivo se piden cambios (AGENTS.md §5.1).

## Tono y estilo

- **Documentación:** español rioplatense conversacional.
- **Código:** identificadores en inglés, salvo conceptos del dominio
  educativo que no traducimos (`trayecto`, `formacion`, `diplomatura`,
  `inscripcion`).
- **Copy del sitio:** español inclusivo (`las y los`, nunca "alumnos").
- **TypeScript strict** sin `any` salvo justificación documentada.
- **Archivos chicos:** target < 300 líneas. Refactor obligatorio si
  pasan de 500. Detalle en `docs/AI_GUIDELINES.md` §2.
- **Sin emojis** en código ni en docs salvo que un humano lo pida
  explícitamente.

## Cambios arquitectónicos

Cualquier cambio que afecte:

- El stack (cambiar de Next.js a otra cosa, agregar otra DB, swap de
  GSAP por otra librería de animación).
- La estructura de carpetas raíz (`src/`, `docs/`, `.github/`).
- El esquema de auth o datos sensibles (cuando exista).
- La estrategia de deploy (Vercel vs self-hosted).

requiere un **ADR nuevo** en `docs/architecture/adrs/` **antes** del PR
de implementación. Workflow guiado en
[`skills/adr-create/SKILL.md`](./skills/adr-create/SKILL.md).

## Datos sensibles (recordatorio)

- **Nunca commitear** `.env`, `.env.local`, credenciales de MongoDB,
  tokens de API. El `.gitignore` los cubre y `ed-doctor` (check #2)
  rechaza el commit si entrara alguno.
- **Logos de aliados** (OEI, SEMS-SEP, CENEVAL, Techint, ministerios)
  **no se publican** sin autorización confirmada del cliente
  (AGENTS.md §5.4).
- **Mail y dirección institucional** viven en `src/config/site.ts`,
  no hardcodeados en JSX (AGENTS.md §5.3).

## Para IAs

- Leé `AGENTS.md` siempre antes de empezar (Claude Code lo hace via
  hook `SessionStart` si está configurado; Codex lo carga
  nativamente; Gemini lo tiene en `GEMINI.md`).
- Respetá las hard rules (`AGENTS.md` §5).
- Pedí confirmación humana antes de las acciones del §5.6 (commits,
  push, deps, modificar meta-docs).
- Si hay un `TODO` o ambigüedad, **preguntá — no inventes** (regla
  global de `AGENTS.md` §4).
- Tono rioplatense en chat. Inglés solo en identificadores de código.
- Si una tarea matchea una skill (`skills/<nombre>/SKILL.md`), leela y
  seguila paso a paso en lugar de improvisar.

## Reportar problemas

- **Bug del sitio o del código:** abrir un issue con
  [`bug_report`](./.github/ISSUE_TEMPLATE/bug_report.md).
- **Idea / mejora:** abrir un issue con
  [`feature_request`](./.github/ISSUE_TEMPLATE/feature_request.md).
- **Vulnerabilidad de seguridad:** canal privado — ver
  [`SECURITY.md`](./SECURITY.md). **No abrir issue público.**
- **Pregunta del dominio educativo o de marca:**
  [GitHub Discussions](https://github.com/BriarDevv/Empoderamiento-Docente/discussions).
