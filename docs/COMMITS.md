# COMMITS.md — Convenciones de commit

Este proyecto usa **[Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)**
+ **commits atómicos** + **alta granularidad** (preferimos muchos commits
chicos antes que pocos commits gigantes).

---

## 1. Formato

```
<tipo>(<scope>): <descripción imperativa, minúsculas, sin punto final>

[cuerpo opcional explicando el porqué del cambio,
líneas de máximo 72 caracteres]

[footer opcional: BREAKING CHANGE, refs a issues, etc.]
```

### Reglas de formato
- **Idioma:** español.
- **Imperativo:** "agregar" no "agregado", "corregir" no "corregido".
- **Minúsculas** en la descripción (excepto nombres propios).
- **Sin punto final** en el header.
- **Header ≤ 72 caracteres.**
- Líneas en blanco entre header, cuerpo y footer.

---

## 2. Tipos permitidos

| Tipo       | Cuándo usarlo                                                     |
| ---------- | ----------------------------------------------------------------- |
| `feat`     | Nueva funcionalidad visible para el usuario final                 |
| `fix`      | Corrección de un bug                                              |
| `docs`     | Solo documentación (`*.md`, comentarios, JSDoc)                   |
| `style`    | Formato, espacios, comas — sin cambios de código real             |
| `refactor` | Cambio interno sin alterar comportamiento                         |
| `perf`     | Mejora de performance                                             |
| `test`     | Agregar o ajustar tests                                           |
| `chore`    | Tareas de mantenimiento (dependencias, scripts, configuración)    |
| `build`    | Cambios en build system, bundler, Tailwind config, Next config    |
| `ci`       | Cambios en pipelines de CI/CD                                     |
| `content`  | Solo copy/contenido del sitio (textos visibles, imágenes, alt)    |
| `design`   | Cambios en `DESIGN.md` o tokens de diseño en código               |

---

## 3. Scopes recomendados

Reflejan las áreas del repo. No es exhaustivo — el scope debe ser **claro
para alguien que no estuvo en la sesión**.

- `home` · `nosotros` · `formacion` · `recursos` · `contacto` (páginas)
- `header` · `footer` · `nav` · `hero` (componentes globales)
- `ui` (componentes UI reutilizables: button, card, input)
- `forms` (formularios: inscripción, contacto, CV)
- `api` (route handlers)
- `db` · `mongo` (schemas, queries, migraciones)
- `seo` (metadata, sitemap, structured data)
- `anim` (GSAP, Lenis, transiciones)
- `i18n` (si hay multi-idioma)
- `config` (site.ts, env, constants)
- `deps` (dependencias)
- `tooling` (eslint, prettier, ts-config, etc.)

Si un cambio toca varios scopes, **partirlo en commits separados**.

---

## 4. Atomicidad

Un commit atómico:
- Hace **una** cosa.
- Compila y pasa lint/test.
- Su mensaje describe esa única cosa.
- Puede revertirse sin romper nada que no esté relacionado.

**Antipatrones (evitar):**
- "feat: varias cosas del hero, fix de mobile y refactor de utils"
- "wip"
- "asdf"
- "cambios"
- "agregar todo lo del día"

**Patrón correcto:**
```
feat(hero): agregar título y bajada principal del home
feat(hero): integrar ilustración del faro con responsive
style(hero): ajustar tracking de título a -0.02em
fix(hero): corregir overflow del haz de luz en mobile
```

---

## 5. Cuerpo del commit (cuándo escribirlo)

Escribir cuerpo cuando:
- El **porqué** del cambio no es obvio desde el código.
- Hay un trade-off importante (ej: elegir un enfoque sobre otro).
- Se documenta un comportamiento sutil o una decisión que afecta a futuro.

**No escribir cuerpo** cuando:
- El header ya dice todo.
- El cambio es trivial (typos, formato, dependencias menores).

### Ejemplo con cuerpo

```
refactor(forms): extraer validación de email a helper compartido

La regex se duplicaba en 3 formularios. Centralizarla evita
inconsistencias entre el formulario de inscripción y el de
contacto, donde una versión aceptaba "+" en el local-part y la
otra no.
```

---

## 6. Cambios disruptivos (`BREAKING CHANGE`)

Cuando un cambio rompe contratos públicos (API, props de un componente
exportado, esquemas de DB usados desde fuera):

```
feat(api)!: cambiar shape de respuesta de /api/inscripciones

BREAKING CHANGE: el endpoint ahora devuelve { data, meta } en
lugar de un array plano. Actualizar consumidores antes de mergear.
```

El `!` después del scope (o tipo) es la marca visual; el footer
`BREAKING CHANGE:` es lo que toman las herramientas de changelog.

---

## 7. Cómo partir un working tree desordenado

Cuando hay varios cambios mezclados sin commitear:

1. `git status` — listar todo.
2. Agrupar mentalmente por scope/tipo.
3. Para cada grupo:
   - `git add <archivos del grupo>` (o `git add -p` para hunks específicos).
   - `git commit -m "..."` con el mensaje atómico.
4. Repetir hasta `git status` limpio.

**No usar `git add -A` ni `git add .`** salvo que se haya verificado que
todo lo pendiente pertenece al mismo commit.

---

## 8. Ejemplos por categoría

### Setup / chore
```
chore: inicializar proyecto next.js con typescript
chore(deps): agregar gsap y lenis para animaciones
chore(tooling): configurar prettier con tailwind plugin
build(tailwind): mapear tokens de design.md al config
```

### Features
```
feat(home): agregar sección hero con título principal
feat(formacion): listar trayectos formativos desde mongo
feat(forms): implementar formulario de envío de cv
feat(api): crear endpoint POST /api/inscripciones
```

### Fixes
```
fix(header): corregir desbordamiento del menú en breakpoint md
fix(api): validar email antes de guardar inscripción
fix(anim): respetar prefers-reduced-motion en hero
```

### Documentación y contenido
```
docs: agregar guía de commits
docs(claude): actualizar pointers a docs/glossary
content(home): actualizar bajada del hero con frase pilar
content(nosotros): redactar bio de daniela reyes-gasperini
```

### Diseño
```
design: matizar verde-concepto a #3e7c6d
design(tokens): agregar variante azul-claro al tailwind config
```

---

## 9. Antes de cada commit, verificar

- [ ] El header tiene tipo + scope + descripción imperativa.
- [ ] El cambio es atómico (una sola cosa).
- [ ] Si hay copy: usa lenguaje inclusivo.
- [ ] Si hay estilos: usan tokens, no hardcodes.
- [ ] El proyecto compila (`pnpm build` o equivalente).
- [ ] Lint y typecheck pasan.

---

## 10. Confirmación con el usuario

**Claude no commitea por iniciativa propia.** Antes de ejecutar
`git commit`:

1. Mostrar al usuario los commits planeados (en seco).
2. Esperar confirmación explícita.
3. Recién entonces ejecutar.

`git push` es **siempre** una operación que requiere confirmación
explícita del usuario.
