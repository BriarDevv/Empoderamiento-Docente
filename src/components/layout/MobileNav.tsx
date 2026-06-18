"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";
import { SocialLinks } from "./SocialLinks";
import { NAV_LINKS, CTA_LINK } from "@/config/nav";
import { useLockScroll } from "@/lib/hooks/useLockScroll";

const WIPE_EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

/**
 * Navegación mobile. La hamburguesa morfea a X; el panel claro (glow del faro)
 * entra con un wipe de clip-path y los links aparecen en stagger (CSS, via
 * transition-delay). Lock-scroll + Escape. El botón va por encima del panel
 * (z mayor dentro del header) para seguir clickeable como cierre.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useLockScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const delay = (i: number) => (open ? `${120 + i * 60}ms` : "0ms");

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="text-azul-principal relative z-[80] grid h-10 w-10 place-items-center"
      >
        <span className="relative block h-4 w-6">
          <span
            className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute top-1/2 left-0 block h-0.5 w-6 -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute left-0 block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`}
          />
        </span>
      </button>

      <div
        className={`faro-glow text-azul-principal fixed inset-0 z-[70] flex flex-col transition-[clip-path] duration-500 ${WIPE_EASE} ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <div className="flex h-20 items-center px-5">
          <Brand variant="isotipo" tone="principal" className="h-9 w-auto" />
        </div>

        <nav
          aria-label="Principal (móvil)"
          className="flex flex-1 flex-col justify-center gap-3 px-6"
        >
          {NAV_LINKS.map((link, i) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                style={{ transitionDelay: delay(i) }}
                className={`font-display text-4xl font-bold tracking-tight transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${active ? "text-azul-medio" : "text-azul-principal"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-5 px-6 pb-10">
          <div
            style={{ transitionDelay: delay(NAV_LINKS.length) }}
            className={`transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <SocialLinks
              className="gap-4"
              iconClassName="text-azul-principal/70"
            />
          </div>
          <Link
            href={CTA_LINK.href}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: delay(NAV_LINKS.length + 1) }}
            className={`bg-naranja-accion block rounded-full px-6 py-4 text-center text-base font-medium text-white transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            {CTA_LINK.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
