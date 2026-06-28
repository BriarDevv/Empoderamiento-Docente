---
name: adr-create
description: Crear un nuevo Architecture Decision Record (ADR) siguiendo el formato del proyecto. Usar cuando aparezca una decisión arquitectónica con trade-offs no triviales.
---

# Skill — Crear un ADR

## Cuándo usar esta skill

Ejecutar cuando:

- Elegimos una tecnología grande (framework, ORM, base de datos, hosting).
- Tomamos una decisión arquitectónica que cuesta revertir (estructura de
  carpetas, esquema de auth, patrón de manejo de estado).
- Aparece un trade-off con varias opciones razonables y queremos que la
  decisión quede explícita.
- Vamos a **superseder** un ADR previo (en ese caso el nuevo ADR
  referencia al viejo con `Supersedes: ADR-NNNN`).

## Cuándo NO usar

- Decisión trivial (color de un botón → `DESIGN.md`).
- Refactor interno sin trade-offs.
- Algo que ya está cubierto por `DESIGN.md`, `docs/AI_GUIDELINES.md`,
  `docs/GLOSSARY.md` o `AGENTS.md`.
- "Decisión" que en realidad es una sugerencia de implementación sin
  alternativas reales.

## Pre-requisitos

- Acceso de escritura al repo.
- Conocer el contexto: por qué surge la decisión, qué fuerzas la motivan
  (técnicas, de negocio, de equipo, de timing).
- Tener al menos **una alternativa real considerada** que se descarta.

---

## Paso a paso

### 1. Determinar el número del ADR

Listar los ADRs existentes y asignar el próximo número (4 dígitos,
zero-pad, orden creciente, irreversible).

```bash
ls docs/architecture/adrs/ | grep -E '^[0-9]{4}-' | sort | tail -1
```

Si el último es `0001-stack-base.md`, el nuevo es `0002-...`.

### 2. Copiar el template

```bash
NUM=0002  # ajustar
SLUG=manejo-de-auth  # kebab-case corto y descriptivo
cp docs/architecture/adrs/_template.md docs/architecture/adrs/${NUM}-${SLUG}.md
```

### 3. Completar cabecera

Editar las primeras líneas del archivo nuevo:

```markdown
# ADR-NNNN: <título corto, imperativo>

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Decision-makers:** @handle1 @handle2
- **Consulted:** @handle3 (opcional)
- **Supersedes:** ADR-XXXX (solo si reemplaza una decisión previa)
```

`Date` siempre se completa con la fecha **del día en que se acepta**, no
del día en que se empieza a redactar.

### 4. Escribir Contexto

Describir el problema y las fuerzas en juego. **Sin la respuesta todavía.**
Si la fuerza principal es no-técnica ("el cliente lo pidió", "tenemos 2
semanas"), decilo explícito.

### 5. Escribir Decisión

Una o dos oraciones claras:

> "Vamos a usar X para resolver Y."

Si necesita expandirse, hacerlo con sub-puntos. Pero la primera línea
debe ser comprensible aislada.

### 6. Listar Consecuencias

Tres sub-secciones: **Positivas**, **Negativas**, **Mitigaciones**.

Si las negativas están vacías, **probablemente la decisión no merece
ADR** — toda elección no trivial tiene costo.

### 7. Listar Alternativas consideradas

Mínimo **una** alternativa real. Para cada una:

- Qué hubiera implicado.
- Por qué se descarta.

Esto previene re-discutir lo mismo en 6 meses.

### 8. Sumar Referencias

Links a documentación oficial, papers, posts, otras ADRs, conversaciones
relevantes.

### 9. Actualizar el índice

Sumar la fila correspondiente a la tabla "Listado" de
`docs/architecture/adrs/README.md`.

### 10. Cambiar Status a `Accepted`

Una vez consensuado con el equipo (o aprobado por los decision-makers
listados), cambiar:

```markdown
- **Status:** Proposed
```

por

```markdown
- **Status:** Accepted
```

y completar `Date` con la fecha de aprobación.

### 11. Commit

Conventional Commits + español imperativo (`docs/COMMITS.md`):

```bash
git add docs/architecture/adrs/NNNN-slug.md docs/architecture/adrs/README.md
git commit -m "docs(architecture): agregar ADR-NNNN <título corto>"
```

Si el ADR superseda otro, en el mismo commit actualizar el ADR previo
con `Status: Superseded by ADR-NNNN`.

### 12. Confirmar con el usuario antes del commit

Por la regla `AGENTS.md` §5.6 (modificar meta-docs requiere OK humano),
mostrar el plan al usuario y esperar confirmación antes de ejecutar el
commit final.

---

## Checklist antes de cerrar

- [ ] Número asignado y único (4 dígitos zero-pad).
- [ ] Cabecera completa (Status, Date, Decision-makers).
- [ ] Contexto explica el **problema**, no la solución.
- [ ] Decisión está en 1-2 oraciones claras.
- [ ] Consecuencias incluyen **al menos una negativa real**.
- [ ] Al menos una alternativa documentada con razón de descarte.
- [ ] Referencias con links concretos.
- [ ] Índice de `README.md` actualizado.
- [ ] Status `Accepted` solo si hay OK del/los decision-makers.
- [ ] Commit message sigue `docs/COMMITS.md`.

---

## Referencias

- [Template oficial](../../docs/architecture/adrs/_template.md)
- [Índice de ADRs](../../docs/architecture/adrs/README.md)
- [Nygard ADRs (paper original)](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [AGENTS.md §5.6](../../AGENTS.md) — meta-docs requieren OK humano.
