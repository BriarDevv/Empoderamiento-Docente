"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { NAV_LINKS } from "@/config/nav";

/**
 * Links de texto (desktop). Dos firmas de movimiento (portadas del proyecto de
 * referencia, adaptadas a la paleta de ED — verde, nunca naranja):
 *  - Text-swap vertical en hover: dos copias del label en máscara (CSS).
 *  - "Magic line": un único subrayado que se DESLIZA al link en hover y
 *    descansa en el activo (GSAP, transform-only → x + scaleX, sin layout).
 * El span `data-nav-stagger` lo anima la entrada coreografiada del Header.
 */
export function NavbarLinks() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = NAV_LINKS.findIndex((link) => link.href === pathname);

  const moveTo = (index: number, animate = true) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const duration = animate && !reducedMotion ? 0.4 : 0;
    if (index < 0) {
      gsap.to(indicator, { opacity: 0, duration });
      return;
    }
    const el = linkRefs.current[index];
    if (!el) return;
    gsap.to(indicator, {
      opacity: 1,
      x: el.offsetLeft,
      scaleX: el.offsetWidth,
      duration,
      ease: "power3.out",
    });
  };

  useIsomorphicLayoutEffect(() => {
    moveTo(activeIndex, false);
  }, [activeIndex]);

  return (
    <ul
      onMouseLeave={() => moveTo(activeIndex)}
      className="relative hidden items-center gap-8 lg:flex"
    >
      {NAV_LINKS.map((link, index) => {
        const active = index === activeIndex;
        return (
          <li key={link.href}>
            <Link
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              href={link.href}
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => moveTo(index)}
              className="group text-azul-principal/85 block font-sans text-[0.92rem]"
            >
              <span className="block overflow-hidden">
                <span data-nav-stagger className="relative block overflow-hidden">
                  <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                    {link.label}
                  </span>
                  <span className="text-verde-concepto absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
                    {link.label}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="bg-verde-concepto pointer-events-none absolute -bottom-1.5 left-0 h-0.5 w-px origin-left rounded-full opacity-0"
      />
    </ul>
  );
}
