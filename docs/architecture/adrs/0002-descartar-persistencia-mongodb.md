# ADR-0002: Descartar persistencia (MongoDB) — sitio frontend/estático

- **Status:** Accepted
- **Date:** 2026-06-28
- **Decision-makers:** @BriarDevv
- **Supersedes:** ADR-0001 (solo la capa de persistencia / base de datos)

---

## Contexto

[ADR-0001](0001-stack-base.md) fijó el stack base e incluyó **MongoDB**
como base de datos, anticipando formularios (inscripción, envío de CV) que
iban a persistir datos. El sitio se reconstruyó desde cero y, en su estado
actual, es **puramente institucional/informativo**:

1. No hay formularios que persistan datos en este alcance.
2. No hay backend propio ni API routes (`src/app/api/`) en el repo.
3. La oferta y los datos institucionales son **estáticos** y viven en
   `src/config/` (p. ej. `site.ts`, `nav.ts`).
4. Sumar MongoDB hoy agrega infraestructura, costos y superficie de
   seguridad (credenciales, conexión, hosting) que el sitio no usa.

## Decisión

**El sitio es frontend/estático: no se usa MongoDB ni ninguna base de
datos, y no hay backend.** Se elimina la persistencia del alcance vigente.
La validación con **Zod** se mantiene en el stack para los bordes cuando
aparezcan (formularios), pero hoy no hay capa de datos.

## Consecuencias

### Positivas

- **Menos superficie y menos costo.** Sin DB que aprovisionar, conectar,
  asegurar ni mantener. Deploy estático trivial.
- **Onboarding más simple.** No hay `src/lib/db/`, ni schemas, ni queries,
  ni variables de entorno de conexión.
- **Performance.** Todo se sirve estático/SSR sin round-trips a una DB.

### Negativas

- **Sin captura de datos.** No se pueden recibir inscripciones ni CVs
  dentro del repo tal cual está; haría falta sumar un backend o un servicio
  externo cuando el cliente lo pida.

### Mitigaciones

- Cuando aparezca la necesidad de persistir o recibir datos, **abrir un ADR
  nuevo** que defina el enfoque (form service externo, route handlers +
  DB, headless CMS, etc.) y recién entonces sumar la dependencia.
- Mantener **Zod** como validador de bordes desde el día uno de cualquier
  formulario.

## Alternativas consideradas

### Alternativa A: Mantener MongoDB "por las dudas"

- **Qué hubiera implicado:** conservar driver, conexión y schemas sin uso
  real.
- **Por qué se descarta:** YAGNI. Infra y riesgo sin beneficio presente;
  reintroducirla cuando se necesite es barato y queda documentado en un ADR.

### Alternativa B: Reemplazar Mongo por Postgres / otro motor

- **Qué hubiera implicado:** misma carga de infraestructura con otro motor.
- **Por qué se descarta:** el problema no es *qué* base usar, sino que
  **hoy no hay datos que persistir**. La elección de motor se difiere al
  ADR que introduzca persistencia, si llega.

## Referencias

- [ADR-0001 — Stack base del sitio](0001-stack-base.md) — decisión original
  (incluía MongoDB).
- [AGENTS.md §2 Stack](../../../AGENTS.md) — stack vigente (sin backend ni DB).
- [docs/AI_GUIDELINES.md §12](../../AI_GUIDELINES.md) — backend y
  persistencia (no hay por ahora).
