"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { NAV_LINKS, CTA_LINK, HOME_LINK } from "@/config/nav";
import { hasRevealed, onReveal } from "@/lib/intro-signal";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Navbar Blueprint — réplica 1:1 del navbar del hero "Blueprint" de la rama
 * `nuevo-frontend`. Es una PÍLDORA flotante centrada (white/70 + backdrop-blur):
 *  - Logo (PNG transparente del cliente) + wordmark "Empoderamiento Docente".
 *  - Intro coreografiada: arranca CERRADO (logo + wordmark) y MORFEA a ABIERTO
 *    (el wordmark se colapsa y entran los links en mono + el CTA naranja).
 *  - Links en `font-mono`; CTA "Contacto" naranja (único acento de acción).
 *
 * Adaptación a ED (invisible, igual que el Header anterior): la intro se dispara
 * cuando el IntroGate TERMINA (`onReveal`), no en el mount — si no, su animación
 * corta queda tapada por el zoom-through del gate. Sin gate o con reduced-motion,
 * el JSX por defecto ya muestra el estado ABIERTO (final). Respeta prefers-reduced-motion.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  // En el Inicio, el morph del navbar se choreografía DESPUÉS del hero (cards +
  // texto), igual que en Empoderamiento Docente (3001): ~3.2s. En otras rutas
  // no hay hero que coordinar, así que abre enseguida.
  const isHome = usePathname() === "/";

  useIsomorphicLayoutEffect(() => {
    const nav = ref.current;
    if (!nav || reducedMotion) return;
    let cleanupReveal: (() => void) | undefined;
    let fallback: number | undefined;
    let ran = false;

    const ctx = gsap.context(() => {
      // Estado inicial CERRADO: wordmark expandido + visible, links colapsados.
      // (El JSX por defecto es el ABIERTO, para verse armado sin JS / reduced-motion.)
      gsap.set("[data-nav-word]", { width: "auto", autoAlpha: 1, marginLeft: 12 });
      gsap.set("[data-nav-links]", { width: 0, autoAlpha: 0 });

      const play = () => {
        if (ran) return;
        ran = true;
        // Morph cerrado → abierto: el wordmark fade (rápido y adelantado) + colapsa
        // su ancho, y A LA VEZ abren los links. Mismo timing que el hero Blueprint.
        gsap
          .timeline({ defaults: { ease: "power3.out" }, delay: isHome ? 3.2 : 0.2 })
          // 1) CIERRA: el wordmark se desvanece y colapsa su ancho del todo.
          .to("[data-nav-word]", {
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(
            "[data-nav-word]",
            { width: 0, marginLeft: 0, duration: 0.45, ease: "power3.out" },
            "<",
          )
          // 2) ABRE: ESPEJO del cierre — misma duración (0.45) y mismo easing
          // (power3.out) para el ancho, y el mismo fade (0.3). Así abrir se
          // siente a la MISMA velocidad que cerrar. Respiro entre ambas fases.
          .to(
            "[data-nav-links]",
            { width: "auto", duration: 0.45, ease: "power3.out" },
            "+=0.08",
          )
          .to(
            "[data-nav-links]",
            { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
            "<",
          );
      };

      // Se dispara cuando el gate termina (página revelada). Fallback por si no
      // hubo gate o nunca avisó.
      if (hasRevealed()) play();
      else {
        cleanupReveal = onReveal(play);
        fallback = window.setTimeout(play, 6000);
      }
    }, nav);

    return () => {
      if (fallback) window.clearTimeout(fallback);
      cleanupReveal?.();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <nav
      ref={ref}
      data-bp-nav
      className="border-azul-principal/10 fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-[1.25rem] border bg-white/70 px-4 py-3 backdrop-blur-xl"
    >
      {/* Grupo logo + wordmark. El wordmark colapsa (width + marginLeft → 0) sin
          dejar gap residual: la separación con los links la da el gap-3 del nav. */}
      <Link
        href={HOME_LINK.href}
        aria-label="Empoderamiento Docente — Inicio"
        className="flex shrink-0 items-center"
      >
        {/* Logo (PNG transparente) tal cual lo pasó el cliente, sin recuadro. */}
        <Image
          src="/brand/logotipo-principal-ed.png"
          alt="Empoderamiento Docente"
          width={425}
          height={467}
          priority
          unoptimized
          className="h-11 w-auto shrink-0"
        />
        {/* Wordmark que se colapsa */}
        <span
          data-nav-word
          className="font-display overflow-hidden text-[1.05rem] font-extrabold tracking-tight whitespace-nowrap"
          style={{ width: 0, opacity: 0 }}
        >
          Empoderamiento&nbsp;Docente
        </span>
      </Link>

      {/* Links + CTA que se abren */}
      <div
        data-nav-links
        className="flex items-center gap-1 whitespace-nowrap"
      >
        <ul className="text-azul-principal/70 hidden items-center gap-1 pr-2 font-mono text-[14px] lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:bg-azul-principal/5 hover:text-azul-principal rounded-lg px-3 py-2 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={CTA_LINK.href}
          className="bg-naranja-accion rounded-xl px-5 py-2.5 font-mono text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          {CTA_LINK.label}
        </Link>
      </div>
    </nav>
  );
}
