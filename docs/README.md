# Documentación — Empoderamiento Docente

Índice de la documentación auxiliar del proyecto.

- **Si sos una IA** trabajando en el repo: empezá por
  [`../AGENTS.md`](../AGENTS.md), después volvé acá.
- **Si sos humano**: empezá por [`../README.md`](../README.md).

---

## Documentos canónicos

| Área              | Documento                                       | Para qué sirve                                                                |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Orquestación IA   | [`../AGENTS.md`](../AGENTS.md)                  | Contrato AI-neutral: hard rules, quality standards, anti-patterns, commit protocol |
| Adapter Claude    | [`../CLAUDE.md`](../CLAUDE.md)                  | Mapeo de conceptos de `AGENTS.md` a herramientas concretas de Claude Code     |
| Sistema de diseño | [`../DESIGN.md`](../DESIGN.md)                  | Tokens visuales: colores, tipografía, espaciado, componentes, iconografía    |
| Onboarding humano | [`../README.md`](../README.md)                  | Quickstart, arquitectura, stack, identidad visual resumida                    |
| Commits           | [`COMMITS.md`](COMMITS.md)                      | Conventional Commits + atómicos + ejemplos por categoría                      |
| Glosario          | [`GLOSSARY.md`](GLOSSARY.md)                    | Jerga del dominio educativo de ED, vocabulario de UI, frases pilares          |
| Mensajes de marca | [`MESSAGING.md`](MESSAGING.md)                  | Copy canónico: tagline, hero, triángulo de pilares, manifiesto, tono de voz   |
| Código IA-friendly| [`AI_GUIDELINES.md`](AI_GUIDELINES.md)          | 18 reglas detalladas: naming, archivos chicos, TS, Tailwind, GSAP, Mongo      |

---

## Empezá por…

| Objetivo                                          | Leer en este orden                                                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Maquetar un componente o sección                  | [`../DESIGN.md`](../DESIGN.md) → [`AI_GUIDELINES.md`](AI_GUIDELINES.md)              |
| Escribir copy del sitio                           | [`MESSAGING.md`](MESSAGING.md) → [`GLOSSARY.md`](GLOSSARY.md) → `../AGENTS.md` §5.1 (lenguaje inclusivo) |
| Trabajar con animaciones (GSAP / Lenis)           | `../AGENTS.md` §7 → §8 (anti-patterns) → [`AI_GUIDELINES.md`](AI_GUIDELINES.md) §11  |
| Crear endpoints / API                             | [`AI_GUIDELINES.md`](AI_GUIDELINES.md) §8 + §12 → `../AGENTS.md` §7                  |
| Modelar datos en MongoDB                          | [`AI_GUIDELINES.md`](AI_GUIDELINES.md) §12 → `../AGENTS.md` §7                       |
| Hacer commits                                     | [`COMMITS.md`](COMMITS.md) → `../AGENTS.md` §9                                       |
| Entender la arquitectura del proyecto             | [`../README.md`](../README.md) → `../AGENTS.md` §1 + §3                              |
| Instalar y correr local                           | [`../README.md`](../README.md) (Quickstart)                                          |
| Ponerte al día con el estado del proyecto         | [`../README.md`](../README.md) (sección "Estado del proyecto") + `../AGENTS.md` §12  |

---

## Cuándo agregar documentación nueva

La regla de oro: **si una decisión o convención no se puede inferir leyendo
el código en una sesión futura, va a un `.md`.**

| Naturaleza del cambio                              | Va a…                              |
| -------------------------------------------------- | ---------------------------------- |
| Token visual nuevo, regla de uso de color o tipo   | `../DESIGN.md`                     |
| Convención de naming, patrón de código             | `AI_GUIDELINES.md`                 |
| Nueva agente / workflow / hard rule                | `../AGENTS.md`                     |
| Término nuevo del dominio educativo                | `GLOSSARY.md`                      |
| Mensaje canónico, claim, tagline, pilar de marca   | `MESSAGING.md`                     |
| Cambio en el formato de commits                    | `COMMITS.md`                       |
| Quirk específico de Claude Code                    | `../CLAUDE.md`                     |
| Datos institucionales, contacto, redes             | `../README.md` (resumen) + `src/config/site.ts` (canónico cuando exista) |

Si una decisión arquitectónica grande aparece (ej: App Router vs Pages
Router, Mongo Atlas vs local, agregar i18n), planteala en conversación
con el usuario y resolvela en el doc correspondiente. Las decisiones de
escala mayor pueden vivir como ADR si en algún momento se introduce
`docs/adr/`.
