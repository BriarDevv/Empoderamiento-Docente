"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Brand } from "./Brand";
import { NavbarLinks } from "./NavbarLinks";
import { MobileNav } from "./MobileNav";
import { SocialLinks } from "./SocialLinks";
import { CtaButton } from "@/components/ui/CtaButton";
import { siteConfig } from "@/config/site";
import { CTA_LINK, HOME_LINK } from "@/config/nav";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Navbar global sobre lienzo claro. Transparente en el top (texto/logo navy);
 * al dejar el hero vira a blanco frosted, condensa y el logo morfea
 * wordmark→isotipo. Comparte el max-width (max-w-6xl) con el panel del hero
 * para que el logo alinee con el borde izquierdo del panel y el CTA con el
 * derecho. Naranja solo en el CTA; activo de links en celeste/azul.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

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

  // Entrada coreografiada: brand → links (mask-rise stagger) → acciones.
  useIsomorphicLayoutEffect(() => {
    const nav = ref.current;
    if (!nav || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-nav-brand]", {
          opacity: 0,
          y: -12,
          duration: 0.6,
          delay: 0.1,
        })
        .from(
          "[data-nav-stagger]",
          { yPercent: 110, duration: 0.7, stagger: 0.07 },
          "<0.15",
        )
        .from(
          "[data-nav-action]",
          { opacity: 0, y: -10, duration: 0.5, stagger: 0.08 },
          "<0.1",
        );
    }, nav);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 border-b px-5 transition-[background-color,border-color,backdrop-filter] duration-300 md:px-8 ${
        scrolled
          ? "border-azul-principal/10 bg-white/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between transition-[height] duration-300 ${
          scrolled ? "h-16" : "h-20 md:h-24"
        }`}
      >
        <Link
          data-nav-brand
          href={HOME_LINK.href}
          aria-label={`${siteConfig.name} — Inicio`}
          className="flex items-center"
        >
          <span className="relative hidden items-center md:inline-flex">
            <Brand
              variant="full"
              tone="principal"
              priority
              className={`h-12 w-auto transition-opacity duration-300 ${
                scrolled ? "opacity-0" : "opacity-100"
              }`}
            />
            <Brand
              variant="isotipo"
              tone="principal"
              className={`absolute top-1/2 left-0 h-10 w-auto -translate-y-1/2 transition-opacity duration-300 ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
            />
          </span>
          <Brand
            variant="isotipo"
            tone="principal"
            priority
            className="h-9 w-auto md:hidden"
          />
        </Link>

        <NavbarLinks />

        <div className="hidden items-center gap-4 md:flex">
          <span data-nav-action className="inline-flex">
            <SocialLinks />
          </span>
          <span data-nav-action className="inline-block">
            <CtaButton href={CTA_LINK.href} label={CTA_LINK.label} />
          </span>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
