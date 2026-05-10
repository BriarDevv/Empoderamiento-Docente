# CLAUDE.md — Adapter para Claude Code

> Adapter delgado. La fuente de verdad sobre cómo opera el sistema vive en
> `AGENTS.md` (AI-neutral). Este archivo solo mapea esos conceptos a las
> herramientas concretas de Claude Code.

---

## ANTES DE RESPONDER — leer en este orden

1. **`AGENTS.md`** — contrato del sistema, roster de agentes, hard rules,
   commit protocol, quality standards.
2. **`DESIGN.md`** — tokens visuales (colores, tipos, espaciado).
3. **`docs/GLOSSARY.md`** — solo si vas a tocar copy o usar jerga del
   dominio educativo.
4. **`docs/COMMITS.md`** — solo si la tarea termina en commits.

Si está activo un hook `SessionStart` que auto-inyecta `AGENTS.md`, este
paso está cubierto. Si no, leerlos explícitamente.

---

## Mapeo de conceptos AGENTS.md → Claude Code

| Concepto (AGENTS.md)              | Herramienta Claude                                       |
| --------------------------------- | -------------------------------------------------------- |
| Spawn agent / delegar             | `Agent(subagent_type=<rol>)`                             |
| Workflow / patrón de orquestación | `Skill(<nombre>)` si está registrado, sino prompt manual |
| Lectura de archivo                | `Read`                                                   |
| Búsqueda por nombre               | `Glob`                                                   |
| Búsqueda por contenido            | `Grep`                                                   |
| Edición de archivo existente      | `Edit`                                                   |
| Creación / overwrite              | `Write`                                                  |
| Shell                             | `Bash` (PowerShell en Windows)                           |
| Trackeo de tareas largas          | `TaskCreate` / `TaskUpdate`                              |
| Búsqueda exploratoria amplia      | `Agent(subagent_type=Explore)`                           |

### Sub-agentes en este proyecto

**No prescribimos un roster fijo de roles.** Cuando una tarea cumple los
criterios de delegación de `AGENTS.md` §4 (Cuándo delegar), elegí el
`subagent_type` apropiado según la tarea y las herramientas disponibles
en Claude Code. Algunos defaults razonables:

- **`general-purpose`** — la mayoría de tareas multi-archivo o de
  investigación.
- **`Explore`** — búsqueda exploratoria amplia (read-only, no edita).
- **`Plan`** — diseño de plan de implementación antes de codear.

Briefa al sub-agente de forma auto-contenida (no asume contexto previo) y
verificá el resultado leyendo los archivos modificados, no solo el resumen.

Si en algún momento se materializan sub-agentes específicos del proyecto
en `.claude/agents/<nombre>.md` (con frontmatter YAML), listarlos acá y
documentar cuándo invocar cada uno.

---

## Quirks específicos de Claude

- **Idioma por defecto con el usuario:** español.
- **OS:** Windows. Shell por defecto **PowerShell** (sintaxis: `$null`, no
  `/dev/null`; `$env:VAR`, no `$VAR`; backtick para line continuation).
  Bash disponible vía la herramienta `Bash` para scripts POSIX.
- **Path style:** rutas absolutas Windows (`C:\Users\USER\Desktop\...`)
  para tools que las requieren.
- **Memoria persistente** activa en
  `C:\Users\USER\.claude\projects\C--Users-USER-Desktop-Empoderamiento-Docente\memory\`.
  Leer `MEMORY.md` al iniciar para recuperar contexto previo entre sesiones.
- **Ultrareview** disponible vía `/ultrareview` cuando haya PR para
  revisión multi-agente.

---

## Cuándo delegar

Resumen del criterio (versión completa en `AGENTS.md` §6):

**Delegar** cuando:
- Multi-archivo, refactor, debug profundo, review, planning, research,
  verificación.
- Búsqueda exploratoria que va a tomar más de 3 reads.
- Tarea paralelizable.

**Trabajar directo** cuando:
- 1-2 archivos conocidos.
- Decisión que requiere conversación con el usuario.
- Documentación o discusión arquitectónica.

---

## Acciones que requieren confirmación humana (recordatorio)

Definidas en `AGENTS.md` §5.6. En Claude Code, esto significa: **antes** de
ejecutar un `Bash` con cualquiera de estos comandos, mostrar el plan y
esperar OK:

- `git commit`, `git push`, `git reset --hard`, force-push.
- `gh pr create`, `gh pr merge`, `gh issue close`.
- `pnpm add`, `npm install`, `npm i`.
- Modificación de `AGENTS.md`, `CLAUDE.md`, `DESIGN.md` (los meta-docs).
- Migraciones de DB.

---

## Project-level Claude config

Cuando se cree:

```
.claude/
├── agents/          ← un .md por sub-agente con frontmatter YAML
├── commands/        ← slash-commands específicos del proyecto
└── settings.json    ← permisos, hooks, env vars del proyecto
```

Formato esperado de `.claude/agents/<nombre>.md` (si se decide
materializar un sub-agente del proyecto):

```yaml
---
name: <nombre-del-rol>
description: <cuándo invocar este sub-agente>
tools: [Read, Write, Edit, Glob, Grep, Bash]
model: sonnet
---
<prompt del rol — debe respetar las hard rules de AGENTS.md §5>
```

---

## Trabajo en este repo: cheat sheet

1. Leer `AGENTS.md` (Quickstart + Read Order by Task + §4-§11 son lo más denso).
2. Identificar dominio → decidir si trabajar directo o delegar.
3. Si toca diseño → `DESIGN.md`.
4. Si toca copy → `docs/GLOSSARY.md` + lenguaje inclusivo.
5. Cambio chico, atómico, alineado a `docs/COMMITS.md`.
6. Confirmar con el usuario antes de cualquier acción del §5.6 de AGENTS.md.
