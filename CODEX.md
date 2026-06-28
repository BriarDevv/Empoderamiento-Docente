# CODEX.md — Adapter para OpenAI Codex CLI

> Adapter delgado. La fuente de verdad sobre cómo opera el sistema vive en
> `AGENTS.md` (AI-neutral). Este archivo solo mapea esos conceptos a las
> particularidades de Codex.

---

## Golden rule

Si algo de este archivo contradice `AGENTS.md`, **gana `AGENTS.md`**.

---

## ANTES DE RESPONDER — leer en este orden

1. **`AGENTS.md`** — contrato del sistema, hard rules, commit protocol,
   quality standards. Codex lo lee nativamente, así que probablemente ya
   esté en contexto.
2. **`DESIGN.md`** — solo si vas a tocar UI o tokens.
3. **`docs/GLOSSARY.md`** — solo si vas a tocar copy.
4. **`docs/COMMITS.md`** — solo si la tarea termina en commits.

---

## Quirks específicos de Codex

- **Idioma por defecto con el usuario:** español.
- **OS:** depende del developer (Windows / macOS / Linux). En Windows el
  shell por defecto es PowerShell.
- **Sin Skills nativas.** Codex no tiene el concepto de Skills como Claude
  Code. Los workflows estables del proyecto viven en `skills/<nombre>/SKILL.md`
  como documentos planos — leerlos manualmente cuando la tarea matchee
  su descripción.
- **Sin sub-agentes nativos.** Para tareas grandes paralelizables, pedile
  al usuario que abra sesiones separadas con contexto auto-contenido en
  lugar de intentar delegar dentro de la misma sesión.
- **Tool permissions.** Codex se aprueba por tool, no por workflow.
  Cuando una acción cae en `AGENTS.md` §5.6, el OK humano corre además
  de cualquier permiso de tool ya otorgado.

---

## Acciones que requieren confirmación humana (recordatorio)

Definidas en `AGENTS.md` §5.6. Antes de ejecutar cualquiera, mostrar el
plan y esperar OK explícito:

- `git commit`, `git push`, `git reset --hard`, force-push.
- Crear/cerrar PRs o issues.
- `pnpm add`, `npm install`, `npm i`.
- Modificación de `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`,
  `DESIGN.md` (meta-docs).

---

## Trabajo en este repo: cheat sheet

1. Leer `AGENTS.md` (si no está ya en contexto).
2. Identificar el dominio del cambio.
3. Si toca diseño → `DESIGN.md`.
4. Si toca copy → `docs/GLOSSARY.md` + lenguaje inclusivo (`AGENTS.md` §5.1).
5. Cambio chico, atómico, alineado a `docs/COMMITS.md`.
6. Confirmar con el usuario antes de cualquier acción del §5.6.
