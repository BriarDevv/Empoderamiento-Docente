# ADR-0001: Stack base del sitio

- **Status:** Accepted — **parcialmente superseded por
  [ADR-0002](0002-descartar-persistencia-mongodb.md)** (2026-06-28)
- **Date:** 2026-05-19
- **Decision-makers:** @BriarDevv (resto del equipo a sumar cuando se den
  de alta en GitHub)

> **Nota de actualización (2026-06-28).** La capa de **persistencia
> (MongoDB)** descrita más abajo **se descartó**: el sitio quedó como
> proyecto **puramente frontend/estático**, sin backend ni base de datos.
> Ver [ADR-0002](0002-descartar-persistencia-mongodb.md). El resto del
> stack sigue vigente, con estas precisiones respecto del texto original:
> Tailwind v4 se usa **CSS-first** (sin `tailwind.config.js`; tema en
> `src/app/globals.css`) y **no hay Prettier/commitlint configurados** (el
> lint corre con ESLint vía `pnpm lint`). El stack vigente y resumido vive
> en `AGENTS.md` §2. El cuerpo original se conserva sin reescribir, como
> registro histórico de la decisión.

---

## Contexto

Empoderamiento Docente necesita su sitio web institucional para junio 2026.
Restricciones:

1. **Cliente real, no juguete.** La marca y los mensajes están definidos.
   El sitio tiene que mostrar trayectos formativos, captar CVs docentes
   y comunicar la oferta institucional.
2. **Equipo chico (3 personas) + IAs colaborando.** Necesitamos un stack
   que sea **predecible** para que una IA pueda navegarlo y modificarlo
   con poca curva.
3. **Performance objetivo** alto (LCP < 2.5s, CLS < 0.1, INP < 200ms).
4. **Animaciones cuidadas** son parte del valor de marca (movimiento sutil,
   nada infantil), respetando `prefers-reduced-motion`.
5. **Sin presión de scale masivo** — institucional, tráfico moderado.
   No precisamos arquitectura distribuida.

## Decisión

El sitio se construye sobre:

| Capa             | Tecnología                                   |
| ---------------- | -------------------------------------------- |
| Framework        | **Next.js 16** (App Router + Turbopack)      |
| Lenguaje         | **TypeScript** strict (`noUncheckedIndexedAccess`) |
| Estilos          | **Tailwind CSS v4** (CSS-first, `@theme` block) |
| Animación        | **GSAP 3** + **Lenis** (smooth scroll)       |
| Base de datos    | **MongoDB** (driver oficial 7.x + Zod 4)     |
| Package manager  | **pnpm 11** (pinned via `packageManager`)    |
| Format / lint    | Prettier 3 + `prettier-plugin-tailwindcss` + ESLint 9 |
| Runtime          | Node ≥ 22                                    |
| Hosting          | Vercel (decisión operativa, no de stack)     |

## Consecuencias

### Positivas

- **AI-friendly por diseño.** App Router + Server Components + carpetas
  por dominio + tipado estricto bajan el costo de que una IA modifique
  partes desconocidas del repo. Los tokens centralizados en `DESIGN.md`
  + `@theme` permiten cambios visuales globales en un solo lugar.
- **Performance moderna out-of-the-box.** RSC + streaming + `next/font` +
  `next/image` resuelven la mayoría de Core Web Vitals sin trabajo manual.
- **Tooling maduro.** Turbopack acelera dev. Tailwind v4 es estable.
  GSAP 3 sigue siendo el referente de animación pro. Lenis es la opción
  estándar para smooth scroll que se integra con ScrollTrigger.
- **Vercel** está hecho para Next.js — deploy automático, preview por PR,
  zero-config.
- **MongoDB** flexible para schemas que pueden evolucionar (oferta
  formativa, inscripciones); Zod cuida los bordes.

### Negativas

- **Next.js 16 es muy nuevo** (Octubre 2025). Algunos paquetes del
  ecosistema todavía no actualizaron a React 19 / Turbopack.
- **Tailwind v4 también es reciente** (Enero 2025). La docu y los recursos
  comunitarios todavía se concentran en v3.
- **Vendor lock-in suave con Vercel.** Migrar a self-hosted requiere
  reconfigurar deploy, preview branches, edge functions.
- **GSAP no es open-source 100% gratis para uso comercial** según el plan
  (los plugins de "Club GSAP" como `SplitText`, `MorphSVG` son pagos).
  Para este proyecto bastan los plugins core (free); si más adelante
  necesitamos los premium, evaluamos.
- **MongoDB no es relacional** — joins complejos pueden volverse
  incómodos. Acepable para el alcance actual; revisar si crece.

### Mitigaciones

- **Para nuevos paquetes:** verificar compatibilidad con React 19 / Next
  16 antes de instalar (regla §5.6).
- **Para Tailwind v4:** mantener `DESIGN.md` como referencia única de
  tokens; cualquier duda de v4 se valida contra el blog oficial de
  Tailwind.
- **Para vendor lock-in:** mantener la lógica del sitio independiente de
  features Vercel-only (KV, Cron, etc.) hasta que las necesitemos
  explícitamente.

## Alternativas consideradas

### Alternativa A: Astro

- **Qué hubiera implicado:** sitio estático con islas interactivas; menos
  JS shipped por default; muy alineado a sites con mucho contenido.
- **Por qué se descarta:** queremos App Router de Next.js y RSC para que
  el equipo (y las IAs) tengan un modelo consistente entre páginas
  estáticas y dinámicas (formulario de CV, panel admin futuro). Astro
  obliga a mezclar dos modelos cuando aparece interactividad seria.

### Alternativa B: Eleventy / Hugo (sitio 100% estático)

- **Qué hubiera implicado:** máxima performance, deploy a cualquier
  static host, costo cercano a cero.
- **Por qué se descarta:** sabemos que vamos a necesitar al menos un
  formulario de inscripción y otro de envío de CV que persisten en DB.
  Empezar 100% estático y migrar después es más fricción que arrancar
  con SSR ya.

### Alternativa C: Remix / Vite + React Router 7

- **Qué hubiera implicado:** stack React con SSR moderno fuera del
  ecosistema Vercel/Next.
- **Por qué se descarta:** adopción más chica, menos integración con
  Vercel, menos contenido sobre App Router-equivalents. Para un equipo
  que quiere predecibilidad y velocidad de onboarding, Next es la
  opción de menor fricción hoy.

### Alternativa D: Postgres en vez de Mongo

- **Qué hubiera implicado:** schema rígido, joins fuertes, SQL.
- **Por qué se descarta (por ahora):** el modelo de datos institucional
  (trayectos, formaciones, inscripciones) tiene shapes que probablemente
  vayan a iterar; Mongo permite cambiar la estructura sin migraciones
  pesadas durante el desarrollo. Si aparece necesidad de joins o
  consistencia transaccional fuerte, abrir nuevo ADR para evaluar.

## Referencias

- [Manual de marca ED](../../../DESIGN.md) — restricciones visuales del
  cliente.
- [AGENTS.md §2 Stack](../../../AGENTS.md) — declaración corta del stack
  que este ADR detalla.
- [Next.js 16 release notes](https://nextjs.org/blog) — App Router +
  Turbopack stable.
- [Tailwind v4 announcement](https://tailwindcss.com/blog) — `@theme`
  CSS-first.
- [GSAP licensing](https://gsap.com/licensing/) — uso comercial free para
  plugins core.
