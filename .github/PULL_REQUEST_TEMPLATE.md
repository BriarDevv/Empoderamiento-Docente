<!--
Antes de abrir el PR:
1. Corré `pnpm doctor` y `pnpm check` localmente (cuando estén disponibles).
2. Verificá que cada commit cumple `docs/COMMITS.md`.
3. Borrá las secciones que no apliquen a este PR.
-->

## Resumen

<!-- 2-4 líneas: qué problema resuelve este PR y cuál es la solución elegida. -->

## Commits incluidos

<!-- Lista atómica de los commits que entran. Si vas a "Rebase and merge",
     todos quedan visibles en el grafo. Si la lista crece mucho, considerá
     partir en PRs más chicos. -->

- `<tipo>(<scope>): <descripción>`
- `<tipo>(<scope>): <descripción>`

## Cambios principales

<!-- Sub-secciones por área (UI / contenido / datos / config / docs). -->

### `<área>`

- …

## Verificación local

- [ ] `pnpm typecheck` pasa
- [ ] `pnpm lint` pasa
- [ ] `pnpm format:check` pasa
- [ ] `pnpm build` pasa
- [ ] `pnpm doctor` pasa (si está disponible)

## Compliance con reglas no negociables

<!-- Marcá las que aplican. Cualquiera sin tildar requiere justificación. -->

- [ ] **§5.1** — Toda copy nueva usa lenguaje inclusivo (`las y los`, nada de "alumnos")
- [ ] **§5.2** — Estilos usan tokens de `DESIGN.md`, sin valores arbitrarios (`bg-[#...]`)
- [ ] **§5.3** — Datos institucionales centralizados en `src/config/site.ts`, no hardcodeados en JSX
- [ ] **§5.4** — Si aparecen logos de aliados (OEI, SEP, ministerios, Techint…), hay autorización confirmada por el cliente
- [ ] **§5.5** — Mensajes pilares de marca usados verbatim, no parafraseados sin chequeo
- [ ] **§9** — Commits atómicos, Conventional Commits en español imperativo (`docs/COMMITS.md`)
- [ ] **§5.6** — Cualquier dependencia nueva fue autorizada explícitamente antes de instalarse

## Conocido fuera de scope

<!-- Deuda técnica que dejaste a propósito. Ej: "no actualicé los snapshots del
     componente vecino porque escapa al alcance del PR". -->

- …

## Reviewer ask

<!-- Si querés review focalizada de alguien en particular: -->

- @BriarDevv → revisar …
- (otros cuando se sumen al equipo)

## Test plan

<!-- Pasos manuales para verificar el cambio en local. -->

- [ ] `pnpm dev`, navegar a `<ruta>`, verificar `<comportamiento esperado>`
- [ ] Probar responsive en mobile (375px) y desktop (1440px)
- [ ] Verificar `prefers-reduced-motion` si hay animación

## Próximo PR

<!-- Si este PR es parte de una serie, anticipá qué viene después. -->

- …
