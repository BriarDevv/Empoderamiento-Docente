# GEMINI.md — Adapter para Gemini CLI / Code Assist

> Adapter delgado. La fuente de verdad sobre cómo opera el sistema vive en
> `AGENTS.md` (AI-neutral). Este archivo solo mapea esos conceptos a las
> particularidades de Gemini.

---

## Golden rule

Si algo de este archivo contradice `AGENTS.md`, **gana `AGENTS.md`**.

---

## ANTES DE RESPONDER — leer en este orden

1. **`AGENTS.md`** — contrato del sistema, hard rules, commit protocol,
   quality standards.
2. **`DESIGN.md`** — solo si vas a tocar UI o tokens.
3. **`docs/GLOSSARY.md`** — solo si vas a tocar copy.
4. **`docs/COMMITS.md`** — solo si la tarea termina en commits.

---

## Quirks específicos de Gemini

- **Idioma por defecto con el usuario:** español.
- **OS:** depende del developer (Windows / macOS / Linux). En Windows el
  shell por defecto es PowerShell.
- **MCP servers.** Gemini CLI soporta MCP — si el equipo configura
  servidores MCP para este proyecto, vivirán en `.gemini/settings.json`.
  Mientras no se configuren, ignorar.
- **Sin Skills nativas.** Mismo planteo que Codex: los workflows estables
  viven en `skills/<nombre>/SKILL.md` como documentos planos; leerlos
  manualmente cuando la tarea matchee su descripción.
- **Privacidad de datos.** Si el equipo usa Gemini con datos del cliente
  (mails reales, dirección, contactos), confirmar que el plan de Gemini
  usado no envíe ese contenido a entrenamiento. Por default Gemini Code
  Assist for Individuals **sí** lo hace; usar Gemini for Business o
  desactivar telemetría antes de pegar PII del cliente.

---

## Acciones que requieren confirmación humana (recordatorio)

Definidas en `AGENTS.md` §5.6. Antes de ejecutar cualquiera, mostrar el
plan y esperar OK explícito:

- `git commit`, `git push`, `git reset --hard`, force-push.
- Crear/cerrar PRs o issues.
- `pnpm add`, `npm install`, `npm i`.
- Modificación de `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`,
  `DESIGN.md` (meta-docs).
- Migraciones / cambios de schema de **Supabase** (cuando se integre):
  confirmar el diseño antes de crear o alterar tablas o políticas RLS
  (ver `AGENTS.md` §12).

---

## Trabajo en este repo: cheat sheet

1. Leer `AGENTS.md` (si no está ya en contexto).
2. Identificar el dominio del cambio.
3. Si toca diseño → `DESIGN.md`.
4. Si toca copy → `docs/GLOSSARY.md` + lenguaje inclusivo (`AGENTS.md` §5.1).
5. Cambio chico, atómico, alineado a `docs/COMMITS.md`.
6. Confirmar con el usuario antes de cualquier acción del §5.6.
