"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Menu, X } from "@/components/ui/icons";
import { useLockScroll } from "@/lib/hooks/useLockScroll";
import { Brand } from "./Brand";
import { NavbarLinks } from "./NavbarLinks";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { NAV_LINKS, CTA_LINK, HOME_LINK } from "@/config/nav";
import { hasRevealed, onReveal } from "@/lib/intro-signal";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Navbar global (portado del proyecto de referencia, adaptado a ED):
 *  - Transparente en el top (sobre el hero) → frosted al dejar el hero
 *    (IntersectionObserver sobre `[data-nav-sentinel]`), condensando altura.
 *  - El LOGO es el acceso a Inicio (cliqueable) y MORFEA wordmark→isotipo.
 *  - Intro coreografiada (sincronizada con el gate): brand → links (mask-rise
 *    stagger) → acciones.
 *  - Links con "magic line" + text-swap en hover (en `NavbarLinks`).
 * Respeta prefers-reduced-motion (sin animación, estado final visible).
 */
export function Header() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  // Transparente → frosted: el sentinel del hero deja el top del viewport.
  useEffect(() => {
    const sentinel = document.querySelector("[data-nav-sentinel]");
    if (!sentinel) {
      const raf = requestAnimationFrame(() => setScrolled(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px 0px -100% 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  useLockScroll(menuOpen);

  // Intro coreografiada, sincronizada con el gate (brand → links → acciones).
  useIsomorphicLayoutEffect(() => {
    const nav = ref.current;
    if (!nav || reducedMotion) return;
    let cleanupEnter: (() => void) | undefined;
    let fallback: number | undefined;
    let ran = false;
    const ctx = gsap.context(() => {
      // Estado inicial OCULTO mientras el gate cubre la página (evita el flash
      // de verlo en su estado final antes de animar).
      gsap.set("[data-nav-brand]", { opacity: 0, y: -12 });
      gsap.set("[data-nav-stagger]", { yPercent: 110 });
      gsap.set("[data-nav-action]", { opacity: 0, y: -10 });

      const play = () => {
        if (ran) return;
        ran = true;
        // Pequeño beat tras el reveal del gate para que respire.
        gsap
          .timeline({ defaults: { ease: "power3.out" }, delay: 0.15 })
          .to("[data-nav-brand]", { opacity: 1, y: 0, duration: 0.6 })
          .to(
            "[data-nav-stagger]",
            { yPercent: 0, duration: 0.7, stagger: 0.07 },
            "<0.15",
          )
          .to(
            "[data-nav-action]",
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
            "<0.1",
          );
      };
      // La intro del nav se dispara cuando el gate TERMINA (página revelada),
      // para que se vea (su animación es corta y atada al zoom quedaba tapada).
      if (hasRevealed()) play();
      else {
        cleanupEnter = onReveal(play);
        fallback = window.setTimeout(play, 6000);
      }
    }, nav);
    return () => {
      if (fallback) window.clearTimeout(fallback);
      cleanupEnter?.();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-azul-principal/10 bg-gris-fondo/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Scrim sutil arriba: legibilidad del nav sobre el hero sin perder el
          look transparente/inmersivo. Se desvanece al pasar a frosted. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-gris-fondo/85 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`mx-auto flex max-w-screen-xl items-center justify-between px-5 transition-[height] duration-300 md:px-10 ${
          scrolled ? "h-16" : "h-20 md:h-24"
        }`}
      >
        {/* Logo = Inicio (cliqueable). Morfea wordmark→isotipo al scrollear. */}
        <Link
          data-nav-brand
          href={HOME_LINK.href}
          aria-label="Empoderamiento Docente — Inicio"
          className="flex items-center"
        >
          <span className="relative hidden items-center lg:inline-flex">
            <span
              className={`transition-opacity duration-300 ${scrolled ? "opacity-0" : "opacity-100"}`}
            >
              <Brand variant="full" tone="dark" asLink={false} />
            </span>
            <span
              className={`absolute top-1/2 left-0 -translate-y-1/2 transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}
            >
              <Brand variant="compact" tone="dark" asLink={false} />
            </span>
          </span>
          <span className="lg:hidden">
            <Brand variant="compact" tone="dark" asLink={false} />
          </span>
        </Link>

        <NavbarLinks />

        <div className="hidden items-center gap-4 lg:flex">
          <span data-nav-action className="inline-block">
            <ButtonPrimary href={CTA_LINK.href} withArrow={false}>
              {CTA_LINK.label}
            </ButtonPrimary>
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden"
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
          className="bg-gris-fondo fixed inset-0 z-50 flex flex-col px-5 py-4 lg:hidden"
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
            className="mt-14 flex flex-col gap-6"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-azul-principal text-[1.85rem] leading-tight font-medium"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-6">
              <ButtonPrimary href={CTA_LINK.href}>{CTA_LINK.label}</ButtonPrimary>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
