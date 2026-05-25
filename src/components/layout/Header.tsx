"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "@/components/ui/icons";
import { useLockScroll } from "@/lib/hooks/useLockScroll";
import { Brand } from "./Brand";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Investigación", href: "/recursos" },
  { label: "Formación", href: "/formacion" },
  { label: "Contacto", href: "/contacto" },
] as const;

/**
 * Hamburger SVG inline con 2 líneas que morphean en X al click.
 * El morph vive 100% en CSS (`globals.css` → `.hbg-svg line`): cuando el
 * padre tiene `data-open="true"`, cada línea translatea al centro vertical
 * y rota 45/-45 grados. Sin Motion library, sin SMIL.
 */
function HamburgerSVG() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={26}
      height={26}
      className="hbg-svg text-azul-principal"
      aria-hidden="true"
    >
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
    </svg>
  );
}

/**
 * Link del nav desktop. Compone:
 * - `.nav-link` (selector base + targeting de hover/active).
 * - `.nav-label` con `main + ghost`: al hover el label sube y un clon entra
 *   desde abajo (CSS-only, micro-overshoot).
 * - `.nav-link-underline` que se anima `scaleX(0)→1` con cubic-bezier
 *   circular-out. El estado activo lo fija en `scaleX(1)`.
 */
function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      data-active={active}
      aria-current={active ? "page" : undefined}
      className="nav-link group text-azul-principal/85 hover:text-azul-principal relative font-sans text-[0.92rem]"
    >
      <span className="nav-label">
        <span
          className={`nav-label__main ${active ? "text-azul-principal font-medium" : ""}`}
        >
          {label}
        </span>
        <span
          className="nav-label__ghost text-azul-principal"
          aria-hidden="true"
        >
          {label}
        </span>
      </span>
      <span className="nav-link-underline" aria-hidden="true" />
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLockScroll(menuOpen);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gris-fondo/95 shadow-azul-principal/10 shadow-sm backdrop-blur"
          : "bg-gris-fondo"
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 md:px-10">
        {/* Brand — primer elemento del stagger de entrada (Acto 1) */}
        <span
          className="nav-enter inline-flex"
          style={{ "--i": 0 } as CSSProperties}
        >
          <Brand variant="full" tone="dark" />
        </span>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item, idx) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <span
                key={item.href}
                className="nav-enter inline-flex"
                style={{ "--i": idx + 1 } as CSSProperties}
              >
                <NavLink label={item.label} href={item.href} active={active} />
              </span>
            );
          })}
          <div
            className="nav-enter ml-2"
            style={{ "--i": navItems.length + 1 } as CSSProperties}
          >
            <ButtonPrimary href="/sumate" withArrow={false}>
              Sumate
            </ButtonPrimary>
          </div>
        </nav>

        {/* Mobile hamburger — morphea a X cuando menuOpen=true.
            En mobile, la nav está oculta: el hamburger es el único item
            que sigue al Brand en el stagger (--i=1). */}
        <button
          type="button"
          data-open={menuOpen}
          className="hbg-btn nav-enter text-azul-principal md:hidden"
          style={{ "--i": 1 } as CSSProperties}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <HamburgerSVG />
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="bg-gris-fondo fixed inset-0 z-50 flex flex-col px-5 py-4 md:hidden"
        >
          <div className="flex items-center justify-between">
            <Brand variant="compact" tone="dark" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="hbg-btn text-azul-principal"
            >
              <X size={26} />
            </button>
          </div>
          <nav
            className="mt-16 flex flex-col gap-3"
            aria-label="Navegación principal"
          >
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{ "--i": i } as CSSProperties}
                className="nav-mobile-item nav-mobile-link font-display text-azul-principal block rounded-lg px-3 py-3 text-[2rem] leading-tight font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div
              style={{ "--i": navItems.length } as CSSProperties}
              className="nav-mobile-item mt-6"
            >
              <ButtonPrimary href="/sumate">Sumate</ButtonPrimary>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
