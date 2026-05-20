# Home — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar la home institucional `/` siguiendo el spec aprobado en 14 tareas atómicas, una por commit, sin tocar páginas internas ni backend.

**Architecture:** Server Components por default. Un único client wrapper (`HomeAnimations`) envuelve las secciones para GSAP + ScrollTrigger; Lenis vive en un `LenisProvider` global. Header + Footer + LenisProvider en `app/layout.tsx` (persistentes); `app/page.tsx` ensambla las 4 secciones de contenido. Datos institucionales vienen de `@/config/site.ts`. Animaciones encapsuladas en hooks reutilizables.

**Tech Stack:** Next.js 16.2.6 (App Router) · TypeScript strict · Tailwind v4 (`@theme` ya configurado) · GSAP 3.15.0 + Lenis 1.3.23 · React 19.2.4 · pnpm 11.0.9 · Node ≥22 · `lucide-react` para íconos (a instalar)

---

## Fuente

- **Spec:** `docs/superpowers/specs/2026-05-20-home-design.md` (commit `5f2210b`, branch `docs/home-design`)
- **Contratos:** `AGENTS.md`, `DESIGN.md`, `docs/COMMITS.md`, `docs/GLOSSARY.md`, `docs/AI_GUIDELINES.md`

## Decisiones del plan

### TDD limitado
La home es UI estática institucional sin lógica de negocio. **No se instala testing framework** (vitest/jest/RTL) para mantener YAGNI. Cada sección se verifica visualmente con `pnpm dev`. Quality gates al final: `pnpm check:all` + `pnpm build` + screenshots desktop/mobile en el PR.

Si el equipo decide sumar testing más adelante, va en otro sprint con su propia configuración (vitest + `@testing-library/react` + `jsdom`).

### Placeholders por decisiones abiertas (spec §9)
- **Email:** ya en `siteConfig.contacto.email = "contacto@empoderamientodocente.org"`. Cuando el cliente confirme el otro mail, cambia ese campo y todo se actualiza.
- **Redes:** `siteConfig.redes` está vacío. Mientras esté vacío, la sección Comunidad muestra un placeholder visible ("Pronto en redes") y el footer omite la columna 3. Cuando se llenen, el render condicional las muestra.
- **Faro SVG:** asset oficial pendiente. Mientras tanto se usa un SVG inline simple (caja navy con "ED" + líneas que sugieren el haz). El SVG vive en `src/features/home/components/FaroPlaceholder.tsx` para que sea fácil reemplazarlo.
- **Sede en footer:** usar `siteConfig.contacto.direccion` (ya cargado).
- **CV destination:** mientras no esté definido, el link "Trabajá con nosotros" del footer apunta a `mailto:contacto@empoderamientodocente.org?subject=Suma de CV` (fallback seguro, no inventa página).
- **Texto del CTA del header:** `Sumate` (decisión cerrada del spec §8).
- **Año copyright:** dinámico con `new Date().getFullYear()` (decisión del plan; reversible si el equipo prefiere fijo).
- **Créditos del equipo de dev en footer:** omitir por ahora; decisión abierta del equipo.

### Atomicidad
Cada tarea es un commit siguiendo `docs/COMMITS.md`. Header en español, imperativo, ≤72 chars, sin punto final. Antes de cada commit, el engineer ejecuta los quality gates locales (`pnpm typecheck` + `pnpm lint` + verificación visual) y pide confirmación humana (AGENTS §5.6, §9).

### Branch
Trabajar **siempre** en `docs/home-design` (ya pusheada). Cuando el plan termine, abrir PR a `main`.

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                       [MODIFY] integrar Header + Footer + LenisProvider
│   ├── page.tsx                         [REWRITE] ensamblar secciones home
│   └── globals.css                      [no toca - tokens ya OK]
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   [CREATE] sticky nav + mobile menu
│   │   └── Footer.tsx                   [CREATE] 4 columnas + bottom row
│   ├── providers/
│   │   └── LenisProvider.tsx            [CREATE] client, Lenis global + ScrollTrigger
│   └── ui/
│       ├── Eyebrow.tsx                  [CREATE] dash verde + label
│       ├── Highlight.tsx                [CREATE] <mark> con estilo verde
│       ├── ButtonPrimary.tsx            [CREATE] naranja, rounded-lg
│       └── ButtonSecondary.tsx          [CREATE] transparente + border navy
├── features/
│   └── home/
│       ├── components/
│       │   ├── Hero.tsx                 [CREATE] server
│       │   ├── FaroPlaceholder.tsx      [CREATE] SVG inline, fácil de reemplazar
│       │   ├── PilaresGrid.tsx          [CREATE] server
│       │   ├── SobreEd.tsx              [CREATE] server
│       │   └── ComunidadRedes.tsx       [CREATE] server, render condicional según site.redes
│       └── animations/
│           └── HomeAnimations.tsx       [CREATE] client wrapper GSAP/ScrollTrigger
├── lib/
│   └── hooks/
│       ├── useReducedMotion.ts          [CREATE] matchMedia hook
│       └── useFadeInOnScroll.ts         [CREATE] helper GSAP + ScrollTrigger
└── config/
    └── site.ts                          [MODIFY] tipar siteConfig.redes (opcional)
```

---

## Pre-flight check

Antes de la Task 1:

- [ ] Estás en `C:\Users\gasto\OneDrive\Desktop\De Caso\Clientes\EmpoderamientoDocente-Briar` (no la worktree de la-boutique)
- [ ] Branch actual = `docs/home-design`: `git branch --show-current` → `docs/home-design`
- [ ] Working tree limpio: `git status` → "nothing to commit"
- [ ] Git config local correcto: `git config user.name` → `Gaston3000`, `git config user.email` → `Gaston3000@users.noreply.github.com`
- [ ] `pnpm doctor` pasa
- [ ] `pnpm dev` arranca y http://localhost:3000 muestra el placeholder de Next

Si algo falla, parar y reportar al equipo antes de seguir.

---

## Tareas

### Task 1: Setup — limpiar placeholder y preparar tipos

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/config/site.ts:55-59`

- [ ] **Step 1.1: Reemplazar `src/app/page.tsx` por shell mínimo**

Contenido completo del archivo:

```tsx
export default function Home() {
  return (
    <main className="flex-1">
      {/* Sections will be added in subsequent tasks */}
    </main>
  );
}
```

- [ ] **Step 1.2: Tipar `siteConfig.redes` en `src/config/site.ts`**

Reemplazar las líneas 55-59 (el bloque `redes: { /* comentarios */ }`) por:

```ts
  // Redes sociales — pendientes de confirmar con el cliente. Dejar el
  // bloque vacío hasta tener los handles oficiales. No inventar URLs.
  // Cuando se llenen, el render condicional de ComunidadRedes y Footer
  // las muestra automáticamente.
  redes: {} as {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  },
```

- [ ] **Step 1.3: Verificar typecheck**

```bash
pnpm typecheck
```

Expected: sin errores. Si typecheck falla por `redes: {} as {...}`, revisar que el `as const` final del objeto siteConfig no haga conflicto (debería andar porque `as` interno especifica el tipo localmente).

- [ ] **Step 1.4: Verificar dev server**

```bash
pnpm dev
```

Abrir http://localhost:3000 → página vacía (off-white por el body default). Sin errores en consola.

- [ ] **Step 1.5: Pedir confirmación humana y commitear**

```bash
git status --short
git diff --staged
```

Mostrar al usuario los cambios. Cuando dé OK:

```bash
git add src/app/page.tsx src/config/site.ts
git commit -m "$(cat <<'EOF'
chore(home): limpiar placeholder y tipar campos opcionales de redes

Vaciar src/app/page.tsx (era boilerplate inicial de Next) y agregar
shape opcional al objeto siteConfig.redes para permitir render
condicional cuando lleguen las URLs oficiales del cliente.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Instalar `lucide-react` para íconos

**Files:**
- Modify: `package.json` (via `pnpm add`)
- Modify: `pnpm-lock.yaml` (auto)

- [ ] **Step 2.1: Pedir confirmación humana para sumar dependencia (AGENTS §5.6)**

Mostrar al usuario:

> Voy a sumar `lucide-react` (~2KB con tree-shaking) como dependencia. Justificación: DESIGN.md §5 recomienda Lucide para íconos lineales consistentes con el manual de marca. Sin esta dep, tendría que vectorizar manualmente cada ícono (book-open, users, target, instagram, linkedin, facebook, menu, x) y mantener un set propio.

Esperar OK explícito.

- [ ] **Step 2.2: Instalar**

```bash
pnpm add lucide-react
```

Expected: agrega `"lucide-react": "^X.Y.Z"` en dependencies.

- [ ] **Step 2.3: Verificar typecheck**

```bash
pnpm typecheck
```

Expected: pasa.

- [ ] **Step 2.4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): agregar lucide-react para iconografía lineal"
```

---

### Task 3: Hook `useReducedMotion`

**Files:**
- Create: `src/lib/hooks/useReducedMotion.ts`

- [ ] **Step 3.1: Crear el hook**

Contenido completo de `src/lib/hooks/useReducedMotion.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

/**
 * Detecta si el sistema operativo del usuario tiene prefers-reduced-motion: reduce.
 * Devuelve true cuando hay que evitar animaciones decorativas.
 *
 * SSR-safe: durante el primer render devuelve false; reevalúa en el client
 * después del mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3.2: Verificar typecheck + lint**

```bash
pnpm typecheck
pnpm lint
```

Expected: ambos pasan.

- [ ] **Step 3.3: Commit**

```bash
git add src/lib/hooks/useReducedMotion.ts
git commit -m "feat(anim): agregar hook useReducedMotion para chequear preferencias del SO"
```

---

### Task 4: Hook `useFadeInOnScroll`

**Files:**
- Create: `src/lib/hooks/useFadeInOnScroll.ts`

- [ ] **Step 4.1: Crear el hook**

Contenido completo de `src/lib/hooks/useFadeInOnScroll.ts`:

```ts
"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Options = {
  /** Delay del stagger entre hijos directos del target. 0 = sin stagger. */
  stagger?: number;
  /** Distancia en px que sube el elemento al aparecer. Default 16. */
  rise?: number;
  /** Duración en segundos. Default 0.6. */
  duration?: number;
  /** Desactivar la animación (ej. cuando reducedMotion = true). */
  disabled?: boolean;
};

/**
 * Anima el target (y opcionalmente sus hijos directos con stagger) con
 * fade-in + translateY al entrar al viewport.
 *
 * Solo anima transform y opacity (AGENTS §7 / DESIGN.md). Cleanup automático
 * con gsap.context() para evitar leaks al desmontar.
 *
 * Si disabled === true, no hace nada (los elementos quedan visibles desde
 * el inicio porque CSS no los oculta).
 */
export function useFadeInOnScroll(
  ref: RefObject<HTMLElement | null>,
  options: Options = {},
) {
  const { stagger = 0, rise = 16, duration = 0.6, disabled = false } = options;

  useEffect(() => {
    if (disabled) return;
    const target = ref.current;
    if (!target) return;

    const context = gsap.context(() => {
      const elements = stagger > 0 ? Array.from(target.children) : [target];

      gsap.fromTo(
        elements,
        { opacity: 0, y: rise },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: target,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, target);

    return () => context.revert();
  }, [ref, stagger, rise, duration, disabled]);
}
```

- [ ] **Step 4.2: Verificar typecheck**

```bash
pnpm typecheck
```

Expected: pasa. Si hay error de tipos en `gsap` o `ScrollTrigger`, chequear que `gsap` esté en deps (debería estar — `3.15.0`).

- [ ] **Step 4.3: Verificar lint**

```bash
pnpm lint
```

- [ ] **Step 4.4: Commit**

```bash
git add src/lib/hooks/useFadeInOnScroll.ts
git commit -m "feat(anim): agregar hook useFadeInOnScroll con GSAP y ScrollTrigger"
```

---

### Task 5: `LenisProvider` (smooth scroll global)

**Files:**
- Create: `src/components/providers/LenisProvider.tsx`

- [ ] **Step 5.1: Crear el provider**

Contenido completo de `src/components/providers/LenisProvider.tsx`:

```tsx
"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Monta una instancia única de Lenis para smooth scroll en toda la app
 * e integra su scroll con ScrollTrigger (que necesita saber cuando el
 * usuario desplaza para disparar triggers).
 *
 * Si reducedMotion === true, NO monta Lenis y el browser hace scroll normal.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    let frameId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
```

- [ ] **Step 5.2: Verificar typecheck**

```bash
pnpm typecheck
```

Expected: pasa.

- [ ] **Step 5.3: Commit**

```bash
git add src/components/providers/LenisProvider.tsx
git commit -m "feat(anim): agregar LenisProvider global con integración a ScrollTrigger"
```

---

### Task 6: Componentes UI primitivos — `Eyebrow`, `Highlight`, `ButtonPrimary`, `ButtonSecondary`

**Files:**
- Create: `src/components/ui/Eyebrow.tsx`
- Create: `src/components/ui/Highlight.tsx`
- Create: `src/components/ui/ButtonPrimary.tsx`
- Create: `src/components/ui/ButtonSecondary.tsx`

- [ ] **Step 6.1: `Eyebrow.tsx`**

Contenido completo:

```tsx
type Props = {
  children: React.ReactNode;
  /** Color del dash y del label. Default navy sobre fondos claros. */
  variant?: "dark" | "light";
};

/**
 * Eyebrow del manual de marca: dash verde corto + label en uppercase.
 * Usado como pre-título de cada sección.
 */
export function Eyebrow({ children, variant = "dark" }: Props) {
  const labelColor =
    variant === "dark" ? "text-gris-texto" : "text-azul-claro";

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="block h-px w-8 bg-verde-concepto"
      />
      <span
        className={`font-sans text-small font-medium uppercase tracking-wider ${labelColor}`}
      >
        {children}
      </span>
    </div>
  );
}
```

- [ ] **Step 6.2: `Highlight.tsx`**

Contenido completo:

```tsx
/**
 * Resalta texto con el highlight verde tipo marcador del manual.
 * Usa <mark> semántico (anuncia "highlighted" en lectores de pantalla)
 * en lugar del <span> del ejemplo de DESIGN.md §7.
 */
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <mark className="-mx-1 bg-verde-concepto/30 px-1 text-inherit">
      {children}
    </mark>
  );
}
```

- [ ] **Step 6.3: `ButtonPrimary.tsx`**

Contenido completo:

```tsx
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
};

/**
 * Botón primario (CTA). Naranja del manual. Único naranja por viewport
 * (DESIGN.md §1 reglas duras).
 */
export function ButtonPrimary({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-naranja-accion px-6 py-3 font-sans font-medium text-white transition-colors hover:bg-naranja-accion/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-naranja-accion"
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 6.4: `ButtonSecondary.tsx`**

Contenido completo:

```tsx
import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  /** Fondo sobre el que vive el botón. Define el color del texto/border. */
  variant?: "light" | "dark";
};

/**
 * Botón secundario. Transparente + border. Variante light = sobre claro
 * (texto y border navy), dark = sobre navy (texto y border blanco).
 */
export function ButtonSecondary({ href, children, variant = "light" }: Props) {
  const classes =
    variant === "light"
      ? "border-azul-principal text-azul-principal hover:bg-azul-claro/30"
      : "border-white text-white hover:bg-white/10";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg border bg-transparent px-6 py-3 font-sans font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-concepto ${classes}`}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 6.5: Verificar typecheck + lint**

```bash
pnpm typecheck
pnpm lint
```

- [ ] **Step 6.6: Commit (atómico: un solo commit con los 4 primitivos)**

```bash
git add src/components/ui/Eyebrow.tsx src/components/ui/Highlight.tsx src/components/ui/ButtonPrimary.tsx src/components/ui/ButtonSecondary.tsx
git commit -m "$(cat <<'EOF'
feat(ui): agregar primitivos eyebrow, highlight y botones

- Eyebrow: dash verde + label uppercase, soporta tema oscuro/claro
- Highlight: <mark> semántico con bg verde del manual
- ButtonPrimary: CTA naranja según DESIGN.md
- ButtonSecondary: transparente + border, soporta tema oscuro/claro

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Header (sticky nav + mobile menu)

**Files:**
- Create: `src/components/layout/Header.tsx`

- [ ] **Step 7.1: Crear `Header.tsx`**

Contenido completo:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Formación", href: "/formacion" },
  { label: "Recursos", href: "/recursos" },
  { label: "Contacto", href: "/contacto" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-gris-fondo transition-shadow ${
        scrolled ? "shadow-sm shadow-azul-principal/10" : ""
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-h3 font-bold text-azul-principal"
          aria-label={`${siteConfig.name} — Inicio`}
        >
          {siteConfig.shortName}
          {/* TODO: reemplazar por lockup ED completo (faro + wordmark) cuando llegue el SVG */}
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-sans text-body text-azul-principal hover:text-azul-medio ${
                  active ? "font-medium" : ""
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-px w-full bg-verde-concepto"
                  />
                )}
              </Link>
            );
          })}
          <ButtonPrimary href="#comunidad">Sumate</ButtonPrimary>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="h-7 w-7 text-azul-principal" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-gris-fondo px-5 py-4 md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-h3 font-bold text-azul-principal">
              {siteConfig.shortName}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="h-7 w-7 text-azul-principal" />
            </button>
          </div>
          <nav
            className="mt-12 flex flex-col gap-6"
            aria-label="Navegación principal"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-h2 font-medium text-azul-principal"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6">
              <ButtonPrimary href="#comunidad">Sumate</ButtonPrimary>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 7.2: Verificar typecheck + lint**

```bash
pnpm typecheck
pnpm lint
```

- [ ] **Step 7.3: Verificar visualmente — todavía no se ve, el layout no lo importa**

El Header se va a integrar en `layout.tsx` en la Task 9. Por ahora solo verificamos que compile.

- [ ] **Step 7.4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(header): agregar nav sticky con menú hamburger mobile"
```

---

### Task 8: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 8.1: Crear `Footer.tsx`**

Contenido completo:

```tsx
import Link from "next/link";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { siteConfig } from "@/config/site";

const navColumns = {
  navegar: {
    titulo: "Navegar",
    items: [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Formación", href: "/formacion" },
      { label: "Recursos", href: "/recursos" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
} as const;

const redesIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const redes = siteConfig.redes;
  const hasRedes = Object.keys(redes).length > 0;

  return (
    <footer className="bg-azul-principal py-16 text-white md:py-20">
      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Columna 1: Marca */}
          <div className="md:col-span-2">
            <p className="font-display text-h3 font-bold">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs font-sans text-body text-azul-claro">
              Comunidad docente en torno a la Matemática Educativa.
            </p>
          </div>

          {/* Columna 2: Navegar */}
          <nav aria-labelledby="footer-navegar">
            <h2
              id="footer-navegar"
              className="font-display text-small font-medium uppercase tracking-wider text-azul-claro"
            >
              {navColumns.navegar.titulo}
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {navColumns.navegar.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-body text-white hover:text-azul-claro"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Columna 3: Comunidad (solo si hay redes configuradas) */}
          {hasRedes && (
            <nav aria-labelledby="footer-comunidad">
              <h2
                id="footer-comunidad"
                className="font-display text-small font-medium uppercase tracking-wider text-azul-claro"
              >
                Comunidad
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {(Object.entries(redes) as Array<[keyof typeof redes, string]>).map(
                  ([key, url]) => {
                    const Icon = redesIcons[key];
                    if (!url || !Icon) return null;
                    return (
                      <li key={key}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-sans text-body text-white hover:text-azul-claro"
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          <span className="capitalize">{key}</span>
                        </a>
                      </li>
                    );
                  },
                )}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-12 border-t border-azul-medio/30 pt-6 md:flex md:items-center md:justify-between">
          <p className="font-sans text-small text-azul-claro">
            © {year} {siteConfig.name}
          </p>
          <address className="mt-2 font-sans text-small not-italic text-azul-claro md:mt-0">
            <a
              href={`mailto:${siteConfig.contacto.email}`}
              className="hover:text-white"
            >
              {siteConfig.contacto.email}
            </a>
            {" · "}
            {siteConfig.contacto.direccion.ciudad},{" "}
            {siteConfig.contacto.direccion.pais}
          </address>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8.2: Verificar typecheck + lint**

```bash
pnpm typecheck
pnpm lint
```

- [ ] **Step 8.3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(footer): agregar footer institucional con render condicional de redes"
```

---

### Task 9: Integrar Header + Footer + LenisProvider en `app/layout.tsx`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 9.1: Reemplazar `layout.tsx` completo**

Contenido completo nuevo:

```tsx
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/providers/LenisProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Empoderamiento Docente",
    template: "%s | Empoderamiento Docente",
  },
  description:
    "Desarrollo profesional docente y formación en Matemática Educativa. Talleres, cursos y diplomaturas para profesionales de la educación.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LenisProvider>
          <Header />
          {children}
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 9.2: Verificar en navegador**

```bash
pnpm dev
```

Abrir http://localhost:3000:
- Se ve el Header arriba con "ED" + nav + botón naranja "Sumate"
- Hay un main vacío en el medio (la home todavía no tiene secciones)
- Se ve el Footer abajo con copyright y email/dirección
- Probar resize a mobile (< 768px): el nav se reemplaza por hamburger
- Click en hamburger → menu fullscreen, click en X → cierra
- Probar `prefers-reduced-motion` activado en SO → Lenis no monta (scroll nativo)

- [ ] **Step 9.3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(layout): integrar header, footer y lenisProvider en app/layout"
```

---

### Task 10: Hero section (estática) + FaroPlaceholder

**Files:**
- Create: `src/features/home/components/FaroPlaceholder.tsx`
- Create: `src/features/home/components/Hero.tsx`

- [ ] **Step 10.1: Crear `FaroPlaceholder.tsx`**

Contenido completo:

```tsx
/**
 * Placeholder visual del faro mientras llega el SVG oficial del cliente.
 * Reemplazar este componente entero cuando el asset esté disponible.
 *
 * Decisión abierta del spec §9 (#6).
 */
export function FaroPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 280"
      role="img"
      aria-label="Faro — pieza icónica de Empoderamiento Docente"
      className={className}
    >
      {/* Cuerpo del faro */}
      <rect
        x="70"
        y="80"
        width="60"
        height="160"
        fill="currentColor"
        rx="2"
      />
      {/* Techo */}
      <polygon points="60,80 140,80 100,40" fill="currentColor" />
      {/* Ventana */}
      <circle cx="100" cy="130" r="8" fill="white" />
      {/* Base */}
      <rect x="55" y="240" width="90" height="20" fill="currentColor" />
      {/* Haz de luz (líneas) */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="100" y1="60" x2="180" y2="20" />
        <line x1="100" y1="60" x2="180" y2="60" />
        <line x1="100" y1="60" x2="180" y2="100" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 10.2: Crear `Hero.tsx`**

Contenido completo:

```tsx
import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { FaroPlaceholder } from "./FaroPlaceholder";

export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative overflow-hidden bg-gris-fondo py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-screen-xl gap-12 px-5 md:grid-cols-5 md:items-center md:px-8">
        {/* Lado izquierdo: copy (3/5) */}
        <div className="md:col-span-3" data-anim="hero-copy">
          <Eyebrow>{siteConfig.name}</Eyebrow>
          <h1 className="mt-6 font-display text-display font-bold text-azul-principal">
            Transformar la relación con las matemáticas es{" "}
            <Highlight>ampliar posibilidades</Highlight>.
          </h1>
          <p className="mt-6 max-w-xl font-sans text-body text-gris-texto">
            Comunidad docente en torno a la Matemática Educativa. Reflexiones,
            talleres, charlas, proyectos e investigación para profesionales de
            la educación en {siteConfig.paises.join(", ")}.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonPrimary href="#comunidad">Sumate a la comunidad</ButtonPrimary>
            <ButtonSecondary href="/nosotros">Conocé a ED</ButtonSecondary>
          </div>
        </div>

        {/* Lado derecho: pieza visual (2/5) */}
        <div
          className="relative flex items-center justify-center md:col-span-2"
          data-anim="hero-visual"
        >
          {/* Decoración trasera: círculo verde */}
          <span
            aria-hidden="true"
            className="absolute right-4 bottom-4 h-48 w-48 rounded-full bg-verde-concepto/80 md:h-64 md:w-64"
          />
          {/* Decoración trasera: patrón de puntos */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 h-32 w-32 bg-[radial-gradient(circle,var(--color-gris-texto)_1px,transparent_1px)] [background-size:12px_12px] opacity-35"
          />
          <FaroPlaceholder className="relative h-72 w-auto text-azul-principal md:h-96" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 10.3: Importar Hero en page.tsx**

Reemplazar `src/app/page.tsx`:

```tsx
import { Hero } from "@/features/home/components/Hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
    </main>
  );
}
```

- [ ] **Step 10.4: Verificar visual**

```bash
pnpm dev
```

http://localhost:3000:
- Se ve el hero con eyebrow + headline + highlight verde en "ampliar posibilidades" + bajada con países + CTAs (naranja + secundario)
- Lado derecho: faro placeholder + círculo verde detrás + patrón de puntos
- Mobile: stack vertical, faro abajo más chico
- Click en CTA "Sumate a la comunidad" → ancla `#comunidad` (todavía no existe, la URL se actualiza pero no scrollea)

- [ ] **Step 10.5: Commit**

```bash
git add src/features/home/components/FaroPlaceholder.tsx src/features/home/components/Hero.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(hero): agregar sección hero con headline, ctas y faro placeholder

El SVG del faro es un placeholder hasta que llegue el asset oficial
del cliente (spec §9 #6). FaroPlaceholder.tsx vive aislado para
facilitar el reemplazo.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: PilaresGrid section

**Files:**
- Create: `src/features/home/components/PilaresGrid.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 11.1: Crear `PilaresGrid.tsx`**

Contenido completo:

```tsx
import Link from "next/link";
import { BookOpen, Users, Target } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Pilar = {
  titulo: string;
  bajada: string;
  href: string;
  Icon: typeof BookOpen;
};

const pilares: readonly Pilar[] = [
  {
    titulo: "Formación",
    bajada:
      "Talleres, cursos, diplomaturas y seminarios para profesionales de la educación.",
    href: "/formacion",
    Icon: BookOpen,
  },
  {
    titulo: "Acompañamiento",
    bajada:
      "Sostenemos un vínculo continuo con docentes durante su aplicación al aula.",
    href: "/formacion#acompanamiento",
    Icon: Users,
  },
  {
    titulo: "Investigación",
    bajada:
      "Producimos conocimiento en Matemática Educativa con base científica.",
    href: "/recursos",
    Icon: Target,
  },
] as const;

export function PilaresGrid() {
  return (
    <section
      data-section="pilares"
      className="bg-white py-12 md:py-20"
    >
      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        <div className="flex justify-center">
          <Eyebrow>En qué trabajamos</Eyebrow>
        </div>

        <div
          className="mt-10 grid gap-6 md:mt-12 md:grid-cols-3 md:gap-8"
          data-anim="pilares-grid"
        >
          {pilares.map(({ titulo, bajada, href, Icon }) => (
            <article
              key={titulo}
              className="flex flex-col rounded-xl border border-azul-claro/40 bg-white p-6 md:p-8"
            >
              <Icon
                className="h-12 w-12 text-azul-principal"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-display text-h3 font-medium text-azul-principal">
                {titulo}
              </h3>
              <p className="mt-3 flex-1 font-sans text-body text-gris-texto">
                {bajada}
              </p>
              <Link
                href={href}
                className="mt-6 inline-flex font-sans font-medium text-verde-concepto hover:underline"
              >
                Conocé más →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 11.2: Sumar PilaresGrid a `page.tsx`**

```tsx
import { Hero } from "@/features/home/components/Hero";
import { PilaresGrid } from "@/features/home/components/PilaresGrid";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <PilaresGrid />
    </main>
  );
}
```

- [ ] **Step 11.3: Verificar visual**

```bash
pnpm dev
```

http://localhost:3000:
- Debajo del hero, fondo BLANCO (rompe del off-white)
- Eyebrow centrado: "EN QUÉ TRABAJAMOS"
- 3 cards en grid 3×1 (desktop) / stack (mobile)
- Cada card: ícono navy + título + bajada + link verde "Conocé más →"

- [ ] **Step 11.4: Commit**

```bash
git add src/features/home/components/PilaresGrid.tsx src/app/page.tsx
git commit -m "feat(home): agregar sección de pilares con formación, acompañamiento e investigación"
```

---

### Task 12: SobreEd section

**Files:**
- Create: `src/features/home/components/SobreEd.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 12.1: Crear `SobreEd.tsx`**

Contenido completo:

```tsx
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { siteConfig } from "@/config/site";

const bullets = [
  "Nos centramos en aprender, más que en enseñar",
  "Sostenemos un vínculo continuo con docentes",
  "Base científica en Matemática Educativa",
] as const;

export function SobreEd() {
  return (
    <section
      data-section="sobre-ed"
      className="relative overflow-hidden bg-azul-principal py-16 text-white md:py-24"
    >
      {/* Decoración: media circunferencia verde */}
      <span
        aria-hidden="true"
        className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-verde-concepto/60 md:-right-24"
      />
      {/* Decoración: patrón de puntos */}
      <span
        aria-hidden="true"
        className="absolute bottom-6 right-6 h-32 w-32 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:14px_14px] opacity-10"
      />

      <div className="relative mx-auto grid max-w-screen-xl gap-12 px-5 md:grid-cols-5 md:items-center md:px-8">
        <div className="md:col-span-3" data-anim="sobre-ed-copy">
          <Eyebrow variant="light">Quiénes somos</Eyebrow>
          <h2 className="mt-6 font-display text-h2 font-bold">
            Una organización que piensa la enseñanza de las matemáticas.
          </h2>
          <div className="mt-6 space-y-4 font-sans text-body text-azul-claro">
            <p>
              {siteConfig.name} trabaja con profesionales de la educación en{" "}
              {siteConfig.paises.join(", ")}. Generamos escenarios de
              aprendizaje donde pensar matemáticamente es una práctica viva.
            </p>
            <p>
              Nuestra base es la <strong className="text-white">Matemática Educativa</strong>:
              un campo disciplinar que estudia la enseñanza y aprendizaje de
              las matemáticas con rigor académico.
            </p>
          </div>
          <ul className="mt-8 space-y-3">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 font-sans text-body"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 inline-block h-px w-4 flex-shrink-0 bg-verde-concepto"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonSecondary href="/nosotros" variant="dark">
              Conocé a las personas que hacen ED →
            </ButtonSecondary>
          </div>
        </div>

        <div className="md:col-span-2" data-anim="sobre-ed-quote">
          <p className="font-display text-display font-bold leading-tight">
            Generar <Highlight>escenarios de aprendizaje</Highlight>
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 12.2: Sumar SobreEd a `page.tsx`**

```tsx
import { Hero } from "@/features/home/components/Hero";
import { PilaresGrid } from "@/features/home/components/PilaresGrid";
import { SobreEd } from "@/features/home/components/SobreEd";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <PilaresGrid />
      <SobreEd />
    </main>
  );
}
```

- [ ] **Step 12.3: Verificar visual**

http://localhost:3000:
- Bloque NAVY abajo de Pilares (cambio fuerte de valor)
- Texto blanco/azul-claro
- Eyebrow light "QUIÉNES SOMOS"
- H2 grande
- 2 párrafos
- 3 bullets con dash verde
- CTA secundario en variante oscura
- Lado derecho: pull-quote "Generar escenarios de aprendizaje" con highlight verde

- [ ] **Step 12.4: Commit**

```bash
git add src/features/home/components/SobreEd.tsx src/app/page.tsx
git commit -m "feat(home): agregar sección sobre ed con manifiesto y pull-quote"
```

---

### Task 13: ComunidadRedes section

**Files:**
- Create: `src/features/home/components/ComunidadRedes.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 13.1: Crear `ComunidadRedes.tsx`**

Contenido completo:

```tsx
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Highlight } from "@/components/ui/Highlight";
import { siteConfig } from "@/config/site";

const redesMap = {
  instagram: { label: "Instagram", Icon: Instagram, handle: "@empoderamientodocente" },
  linkedin: { label: "LinkedIn", Icon: Linkedin, handle: "Empoderamiento Docente" },
  facebook: { label: "Facebook", Icon: Facebook, handle: "@empoderamientodocente" },
} as const;

export function ComunidadRedes() {
  const redes = siteConfig.redes;
  const entries = Object.entries(redesMap) as Array<
    [keyof typeof redesMap, (typeof redesMap)[keyof typeof redesMap]]
  >;
  const activas = entries.filter(([key]) => key in redes && redes[key]);
  const hayRedes = activas.length > 0;

  return (
    <section
      id="comunidad"
      data-section="comunidad"
      className="bg-white py-12 md:py-20"
    >
      <div className="mx-auto max-w-screen-xl px-5 md:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Eyebrow>Sumate</Eyebrow>
          <h2 className="mt-6 font-display text-h1 font-bold text-azul-principal">
            Sumate a la <Highlight>comunidad</Highlight>.
          </h2>
          <p className="mt-4 font-sans text-body text-gris-texto">
            Encontranos donde la conversación está viva. Reflexiones, recursos
            y novedades de la comunidad docente.
          </p>
        </div>

        {hayRedes ? (
          <div
            className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3"
            data-anim="comunidad-cards"
          >
            {activas.map(([key, { label, Icon, handle }]) => {
              const url = redes[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-azul-claro/40 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-md hover:shadow-azul-principal/10"
                >
                  <Icon
                    className="h-8 w-8 text-azul-principal"
                    aria-hidden="true"
                  />
                  <p className="mt-4 font-display text-h3 font-medium text-azul-principal">
                    {label}
                  </p>
                  <p className="mt-1 font-sans text-small text-gris-texto">
                    {handle}
                  </p>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-center font-sans text-body text-gris-texto">
            Pronto vas a poder seguirnos en redes. Mientras tanto, escribinos a{" "}
            <a
              href={`mailto:${siteConfig.contacto.email}`}
              className="text-verde-concepto hover:underline"
            >
              {siteConfig.contacto.email}
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 13.2: Sumar ComunidadRedes a `page.tsx`**

```tsx
import { Hero } from "@/features/home/components/Hero";
import { PilaresGrid } from "@/features/home/components/PilaresGrid";
import { SobreEd } from "@/features/home/components/SobreEd";
import { ComunidadRedes } from "@/features/home/components/ComunidadRedes";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <PilaresGrid />
      <SobreEd />
      <ComunidadRedes />
    </main>
  );
}
```

- [ ] **Step 13.3: Verificar visual**

http://localhost:3000:
- Después del bloque navy, vuelve a blanco
- Centrado: eyebrow + título con highlight verde en "comunidad" + bajada
- Como `siteConfig.redes` está vacío, se ve el placeholder "Pronto vas a poder seguirnos en redes" con mailto al contacto
- Click en el CTA del hero "Sumate a la comunidad" → ahora scrollea suave hasta este bloque (Lenis hace el smooth scroll)

- [ ] **Step 13.4: Commit**

```bash
git add src/features/home/components/ComunidadRedes.tsx src/app/page.tsx
git commit -m "feat(home): agregar sección comunidad con render condicional de redes"
```

---

### Task 14: HomeAnimations — animaciones GSAP en client wrapper

**Files:**
- Create: `src/features/home/animations/HomeAnimations.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 14.1: Crear `HomeAnimations.tsx`**

Contenido completo:

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Cliente wrapper que aplica todas las animaciones de la home.
 * Las secciones server marcan elementos con data-anim="<id>"; este
 * componente las encuentra por query y las anima usando gsap.context()
 * para cleanup automático.
 *
 * Si reducedMotion === true, no anima — los elementos quedan visibles
 * desde el inicio (no hay opacity 0 en CSS).
 */
export function HomeAnimations({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const scope = root.current;
    if (!scope) return;

    const context = gsap.context(() => {
      // Hero: stagger eyebrow → headline → subhead → CTAs
      const heroCopy = scope.querySelector('[data-anim="hero-copy"]');
      if (heroCopy) {
        gsap.fromTo(
          heroCopy.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          },
        );
      }

      // Hero visual: fade-in
      const heroVisual = scope.querySelector('[data-anim="hero-visual"]');
      if (heroVisual) {
        gsap.fromTo(
          heroVisual,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", delay: 0.2 },
        );
      }

      // Pilares: stagger de las 3 cards al entrar viewport
      const pilaresGrid = scope.querySelector('[data-anim="pilares-grid"]');
      if (pilaresGrid) {
        gsap.fromTo(
          pilaresGrid.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: pilaresGrid,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      // SobreEd: copy + quote
      [
        '[data-anim="sobre-ed-copy"]',
        '[data-anim="sobre-ed-quote"]',
      ].forEach((selector) => {
        const target = scope.querySelector(selector);
        if (!target) return;
        gsap.fromTo(
          target,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: target,
              start: "top 80%",
              once: true,
            },
          },
        );
      });

      // Comunidad: stagger de las cards de redes
      const comunidadCards = scope.querySelector('[data-anim="comunidad-cards"]');
      if (comunidadCards) {
        gsap.fromTo(
          comunidadCards.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: comunidadCards,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    }, scope);

    return () => context.revert();
  }, [reducedMotion]);

  return <div ref={root}>{children}</div>;
}
```

- [ ] **Step 14.2: Envolver page.tsx con HomeAnimations**

```tsx
import { HomeAnimations } from "@/features/home/animations/HomeAnimations";
import { Hero } from "@/features/home/components/Hero";
import { PilaresGrid } from "@/features/home/components/PilaresGrid";
import { SobreEd } from "@/features/home/components/SobreEd";
import { ComunidadRedes } from "@/features/home/components/ComunidadRedes";

export default function Home() {
  return (
    <main className="flex-1">
      <HomeAnimations>
        <Hero />
        <PilaresGrid />
        <SobreEd />
        <ComunidadRedes />
      </HomeAnimations>
    </main>
  );
}
```

- [ ] **Step 14.3: Verificar animaciones en navegador**

http://localhost:3000:
- Al cargar: el copy del hero hace stagger (eyebrow → headline → subhead → CTAs)
- El faro fade-in con leve scale
- Scrollear: las 3 cards de pilares aparecen en stagger
- Scrollear más: SobreEd y el pull-quote aparecen suave
- Scrollear: cards de comunidad (si hay) o placeholder

Probar con `prefers-reduced-motion: reduce` activado en el SO:
- Todos los elementos aparecen instantáneamente, sin animación
- Sin errores en consola

- [ ] **Step 14.4: Commit**

```bash
git add src/features/home/animations/HomeAnimations.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(anim): agregar HomeAnimations con stagger y ScrollTrigger

Cliente wrapper único que orquesta las animaciones de las 4 secciones
de la home usando data-anim selectors. Respeta prefers-reduced-motion
chequeando con window.matchMedia (las secciones permanecen visibles
sin animar cuando el SO lo solicita).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Quality gates finales + screenshots + PR

**Files:** ninguno (verificación)

- [ ] **Step 15.1: Build de producción**

```bash
pnpm build
```

Expected: build exitoso, sin errores ni warnings de Next.js.

- [ ] **Step 15.2: Quality check completo**

```bash
pnpm check:all
```

Expected: lint + typecheck + format:check + doctor pasan todos.

- [ ] **Step 15.3: Smoke test en producción local**

```bash
pnpm start
```

Abrir http://localhost:3000:
- Verificar que las animaciones funcionan
- Verificar que el smooth scroll funciona (click "Sumate a la comunidad" del hero)
- Verificar mobile: resize a < 768px, hamburger funciona
- Verificar lectores de pantalla: `<mark>` se anuncia, `<nav aria-label>` funciona
- Probar `prefers-reduced-motion` desde DevTools (Rendering tab > Emulate CSS media feature)

- [ ] **Step 15.4: Capturar screenshots**

- Screenshot desktop full-page → `~/screenshots/home-desktop.png`
- Screenshot mobile (375×812 simulado) full-page → `~/screenshots/home-mobile.png`

- [ ] **Step 15.5: Checklist pre-PR (AGENTS §10)**

Verificar todos los ítems:

- [ ] `pnpm typecheck` pasa
- [ ] `pnpm lint` pasa
- [ ] `pnpm build` pasa
- [ ] `pnpm doctor` pasa
- [ ] 0 ocurrencias de "alumnos" (`grep -r "alumno" src/`)
- [ ] 0 masculinos genéricos no inclusivos detectables
- [ ] Contraste WCAG AA OK (auditar con axe DevTools o Lighthouse)
- [ ] `prefers-reduced-motion` respetado
- [ ] Componentes < 150 líneas (revisar Hero, Header, SobreEd, ComunidadRedes)
- [ ] Cero `any` sin comentario
- [ ] Cero hardcodes de color tipo `bg-[#...]`
- [ ] Sin datos institucionales hardcodeados (todo desde `site.ts`)
- [ ] Screenshots desktop + mobile listos

- [ ] **Step 15.6: Abrir PR (acción humana, AGENTS §5.6 + §5.7)**

```bash
# Verificar que la branch está actualizada en remote
git push origin docs/home-design
```

Después, manualmente en GitHub:

URL: https://github.com/BriarDevv/Empoderamiento-Docente/pull/new/docs/home-design

PR description sugerida:

```markdown
## Resumen

Implementa la home institucional siguiendo el spec aprobado en
`docs/superpowers/specs/2026-05-20-home-design.md`.

5 secciones (header sticky, hero, pilares, sobre ED, comunidad, footer)
con animaciones GSAP + Lenis smooth scroll. Server components por default;
un único client wrapper (`HomeAnimations`) para las animaciones.

## Cambios principales

- Hooks reutilizables: `useReducedMotion`, `useFadeInOnScroll`
- LenisProvider global integrado con ScrollTrigger
- 4 primitivos UI: Eyebrow, Highlight, ButtonPrimary, ButtonSecondary
- Header con nav desktop + mobile hamburger
- Footer con render condicional de redes
- 4 secciones de home (Hero, PilaresGrid, SobreEd, ComunidadRedes)
- Placeholder visible cuando `siteConfig.redes` está vacío

## Decisiones abiertas (esperan input del cliente)

Listadas en spec §9. Las que afectan visualmente la home:
- URLs de Instagram/LinkedIn/Facebook (sección 4.5 muestra placeholder)
- SVG oficial del faro (Hero usa FaroPlaceholder.tsx; reemplazar el componente cuando llegue)

## Screenshots

[Desktop + Mobile]

## Checklist pre-PR

- [x] typecheck / lint / build / doctor pasan
- [x] 0 ocurrencias de "alumnos"
- [x] Contraste WCAG AA verificado
- [x] `prefers-reduced-motion` respetado
- [x] Sin hardcodes de color
- [x] Datos institucionales desde `site.ts`
```

---

## Self-review (ya hecho por el plan-writer)

Coverage del spec:
- §4.1 Header → Task 7 + 9 ✓
- §4.2 Hero → Task 10 + 14 ✓
- §4.3 Pilares → Task 11 + 14 ✓
- §4.4 SobreEd → Task 12 + 14 ✓
- §4.5 Comunidad → Task 13 + 14 ✓
- §4.6 Footer → Task 8 + 9 ✓
- §5 Tokens → ya OK (no task)
- §6 Animación → Tasks 3, 4, 5, 14 ✓
- §7 Accesibilidad → embebido en cada section (focus visible, aria-labels, contraste) ✓
- §10 Quality gates → Task 15 ✓

Placeholders del plan: cada uno explícito y nombrado (FaroPlaceholder.tsx, redes vacías → placeholder visible, mailto fallback para CV). Ningún "TBD" oculto.

Type consistency:
- `useReducedMotion()` devuelve `boolean` y se usa con ese tipo en LenisProvider y HomeAnimations ✓
- `siteConfig.redes` tipado en Task 1 como `{ instagram?: string; linkedin?: string; facebook?: string }` y consumido coherentemente en Footer y ComunidadRedes ✓
- `gsap.context()` usado consistentemente en useFadeInOnScroll y HomeAnimations ✓

---

## Después del PR

Cuando el PR se mergea a `main`:

1. Vercel deploya automáticamente
2. El equipo + cliente reciben preview URL para validación
3. Resolver decisiones abiertas (spec §9) con cliente → en sprints siguientes:
   - PR: URLs de redes en `site.ts` → activa la sección comunidad real
   - PR: SVG oficial del faro → reemplaza `FaroPlaceholder.tsx`
   - PR: Lockup ED completo en Header (reemplaza "ED" texto)
   - PR: Páginas internas (`/nosotros`, `/formacion`, `/recursos`, `/contacto`)

---

## Próximos pasos cuando ejecutemos este plan

Modo de ejecución a elegir:

**1. Subagent-Driven (recomendado para este alcance)** — un subagent fresco por task, revisión entre tasks, iteración rápida. Ideal cuando hay 14 tasks.

**2. Inline Execution** — ejecutar tasks en la misma sesión con checkpoints de review. Más control directo pero consume más contexto.
