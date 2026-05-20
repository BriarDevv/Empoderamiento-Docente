"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "@/components/ui/icons";
import { Brand } from "./Brand";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Investigación", href: "/recursos" },
  { label: "Formación", href: "/formacion" },
  { label: "Contacto", href: "/contacto" },
] as const;

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gris-fondo/95 shadow-azul-principal/10 shadow-sm backdrop-blur"
          : "bg-gris-fondo"
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-4 md:px-10">
        <Brand variant="full" tone="dark" />

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group text-azul-principal/85 hover:text-azul-principal relative font-sans text-[0.92rem] transition-colors"
              >
                <span
                  className={active ? "text-azul-principal font-medium" : ""}
                >
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`bg-verde-concepto absolute -bottom-1.5 left-0 h-px transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          <div className="ml-2">
            <ButtonPrimary href="#comunidad" withArrow={false}>
              Sumate
            </ButtonPrimary>
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={26} className="text-azul-principal" />
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
            >
              <X size={26} className="text-azul-principal" />
            </button>
          </div>
          <nav
            className="mt-16 flex flex-col gap-7"
            aria-label="Navegación principal"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-azul-principal text-[2rem] leading-tight font-medium"
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
