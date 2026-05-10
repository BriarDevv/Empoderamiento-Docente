# Empoderamiento Docente — Sitio Institucional

> Sitio web institucional para **Empoderamiento Docente (ED)**, organización
> de desarrollo profesional docente con presencia en Chile, México y
> Argentina.

[![Stack: Next.js](https://img.shields.io/badge/Next.js-App%20Router-000000)](https://nextjs.org)
[![Lang: TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Styles: Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06b6d4)](https://tailwindcss.com)
[![Motion: GSAP + Lenis](https://img.shields.io/badge/Motion-GSAP%20%2B%20Lenis-88ce02)](https://gsap.com)
[![DB: MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248)](https://www.mongodb.com)
[![AI-Friendly](https://img.shields.io/badge/AI--Friendly-Claude%20%7C%20Codex%20%7C%20Gemini-8e44ad)](./AGENTS.md)

---

## ¿Qué es esto?

Sitio web institucional para **Empoderamiento Docente (ED)**, dirigido por
**Daniela Reyes-Gasperini**, que también destaca el trabajo de **Raquel
Ayala** (rol exacto a confirmar con el cliente). Su lanzamiento está
previsto para **junio 2026** y debe cumplir tres metas:

1. **Posicionamiento institucional** de ED.
2. **Captación de docentes** vía CTA de envío de CV.
3. **Comunicación clara** de la oferta formativa (talleres, cursos virtuales,
   diplomaturas, asesorías, materiales).

Más contexto del cliente: ver [`docs/GLOSSARY.md`](./docs/GLOSSARY.md).

---

## Quickstart

> Pendiente de inicialización. Cuando el proyecto Next.js esté creado:

```bash
# 1. Instalar
pnpm install

# 2. Variables de entorno
cp .env.example .env.local
# completar MONGODB_URI y demás

# 3. Dev server
pnpm dev          # http://localhost:3000

# 4. Build de producción
pnpm build && pnpm start
```

---

## Stack

- **Next.js** (App Router) + **TypeScript** strict
- **Tailwind CSS** con tokens de marca mapeados desde `DESIGN.md`
- **GSAP 3** + **Lenis** para animaciones y smooth scroll
- **MongoDB** (driver oficial o Mongoose, decisión pendiente)

---

## Arquitectura

```
Empoderamiento-Docente/
├── AGENTS.md             # Contrato AI-neutral (orquestador)
├── CLAUDE.md             # Adapter para Claude Code
├── DESIGN.md             # Sistema de diseño (tokens, tipos, reglas)
├── README.md             # Este archivo
├── docs/
│   ├── COMMITS.md        # Conventional Commits + atómicos
│   ├── GLOSSARY.md       # Jerga del dominio ED
│   ├── AI_GUIDELINES.md  # Reglas de código IA-friendly
│   └── adr/              # Decisiones arquitectónicas (cuando aplique)
├── public/
├── src/
│   ├── app/              # Rutas Next.js
│   ├── components/       # UI reutilizable
│   ├── features/         # Módulos por dominio
│   ├── lib/              # Utilidades, clientes (db, etc.)
│   ├── config/           # site.ts (datos institucionales)
│   ├── styles/           # globals.css, tokens
│   └── types/            # Tipos compartidos
└── .claude/              # Adapter Claude (sub-agentes, slash-commands)
```

**Golden rule:** los `.md` raíz y `docs/` son la fuente de verdad. Los
folders `.claude/`, `.gemini/`, `.codex/` (cuando se sumen) son adaptadores
— nunca contenido propio.

---

## Para agentes de IA

Si sos una IA trabajando en este repo:

1. **Leé [`AGENTS.md`](./AGENTS.md)** — contrato AI-neutral, te dice cómo
   opera el sistema, qué agentes especializados existen, qué reglas son no
   negociables, cómo se commitea.
2. **Leé tu adapter** según la herramienta:
   - **Claude Code** → [`CLAUDE.md`](./CLAUDE.md)
   - **Gemini CLI** → `GEMINI.md` (cuando se sume)
   - **Codex** → lee `AGENTS.md` nativamente; deltas en
     `.codex/AGENTS.override.md` cuando se sume
   - **Cursor / Copilot / otras** → seguí `AGENTS.md` directamente
3. **Si vas a tocar diseño** → [`DESIGN.md`](./DESIGN.md).
4. **Si vas a tocar copy** → [`docs/GLOSSARY.md`](./docs/GLOSSARY.md) +
   las hard rules de lenguaje inclusivo en `AGENTS.md` §5.1.

### Reglas que no se discuten (resumen ejecutivo)

- **Lenguaje inclusivo siempre** (`las y los`), nunca "alumnos" → siempre
  "estudiantes".
- **Tokens, no hardcodes.** Colores y tipos viven en `DESIGN.md`.
- **Naranja solo para CTAs.** Verde para conceptos. Azul base. Verde y
  naranja no compiten en el mismo bloque.
- **Commits atómicos** con Conventional Commits, en español, imperativo.
  Muchos commits chicos > pocos commits gigantes.
- **Confirmación humana** antes de cualquier `git commit`, `git push`,
  `pnpm add`, o cambio en los meta-docs.

---

## Convenciones

- **Commits:** [`docs/COMMITS.md`](./docs/COMMITS.md). Conventional Commits
  + atómicos + alta granularidad.
- **Código:** [`docs/AI_GUIDELINES.md`](./docs/AI_GUIDELINES.md). Archivos
  chicos, nombres claros, tipos en bordes.
- **Idioma del código y commits:** español.
- **Idioma del copy del sitio:** español rioplatense neutro, inclusivo.

---

## Estado del proyecto

- [x] Manual de marca recibido y procesado → `DESIGN.md`
- [x] Documentación AI-friendly inicial (`AGENTS.md`, `CLAUDE.md`, `docs/`)
- [ ] Inicializar Next.js + TS + Tailwind
- [ ] `git init` + primer commit
- [ ] Mapear tokens de `DESIGN.md` al config
- [ ] Cargar fuentes Manrope + Inter
- [ ] Conectar MongoDB
- [ ] Sitemap definitivo
- [ ] CI/CD

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
