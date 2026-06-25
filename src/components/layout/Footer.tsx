"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Brand } from "./Brand";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { Magnetic } from "@/components/ui/Magnetic";
import { MailOutline, ArrowRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { NAV_LINKS, CTA_LINK, HOME_LINK } from "@/config/nav";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Footer institucional de Empoderamiento Docente — cierre compacto.
 *
 * Banda de servicio (marca + descripción + navegación de 7 + contacto con
 * CTA) sobre una hairline con índice verde, y una franja animada con los
 * LOGOS de aliados reales ("Confían en nuestro trabajo") en loop lento.
 *
 * La sensación premium viene de tipografía + estructura (hairlines reales)
 * + la tira de logos como señal de confianza. Sin frase-display gigante,
 * sin círculo verde, altura natural (no se fuerza a llenar el viewport).
 * Datos desde @/config/site y navegación desde @/config/nav (nunca
 * hardcodear). Respeta prefers-reduced-motion (estado final visible,
 * franja estática).
 */

// Las 7 rutas del sitemap: el logo (Inicio) + la nav principal + Contacto.
const FOOTER_LINKS = [HOME_LINK, ...NAV_LINKS, CTA_LINK] as const;

// Aliados con logo AUTORIZADO (assets reales en /public/aliados). Los SVG
// vienen en navy (#1f2d4d): se renderizan en blanco monocromo sobre el
// footer. NO agregar un aliado sin su archivo de logo real ni sin OK.
const ALIADOS = [
  { src: "/aliados/techint.svg", alt: "Techint" },
  { src: "/aliados/roberto-rocca.svg", alt: "Roberto Rocca" },
  {
    src: "/aliados/caba.svg",
    alt: "Ministerio de Educación de la Ciudad de Buenos Aires",
  },
] as const;

/** Link de footer con el "text-swap" vertical del navbar (hover en verde). */
function FooterNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group focus-visible:outline-azul-claro inline-flex min-h-[44px] items-center rounded-sm py-2 font-sans text-[0.95rem] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="relative block overflow-hidden">
        <span className="block text-white/90 transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {label}
        </span>
        <span className="text-verde-concepto absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
          {label}
        </span>
      </span>
    </Link>
  );
}

/** Una tanda de logos de aliados (se renderiza dos veces para el loop). */
function AliadosSet({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {ALIADOS.map((aliado) => (
        // Slot de altura fija: los logos se normalizan a una misma altura y
        // a blanco monocromo (los SVG vienen en navy → invisibles sin esto).
        <li key={aliado.src} className="flex h-12 shrink-0 items-center px-9 md:px-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aliado.src}
            alt={ariaHidden ? "" : aliado.alt}
            draggable={false}
            className="h-7 w-auto opacity-70 transition-opacity duration-300 hover:opacity-100 [filter:brightness(0)_invert(1)]"
          />
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const loopRef = useRef<gsap.core.Tween | null>(null);
  const reducedMotion = useReducedMotion();

  const year = new Date().getFullYear();
  const { email, direccion } = siteConfig.contacto;

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ── Entrada coreografiada (una sola timeline, sin scrub ni pin) ──
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      tl.fromTo(
        "[data-bg-overlay]",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
        0,
      )
        .fromTo(
          "[data-top-rule]",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.0, ease: "expo.out" },
          0.1,
        )
        .fromTo(
          "[data-col]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          0.2,
        )
        .fromTo(
          "[data-mid-rule]",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.0, ease: "expo.out" },
          0.5,
        );

      // ── Franja de aliados: el loop arranca SOLO al entrar al viewport ──
      // (el footer monta global; no gastamos CPU en cada página fuera de
      // pantalla).
      ScrollTrigger.create({
        trigger: el,
        start: "top 95%",
        once: true,
        onEnter: () => {
          const track = trackRef.current;
          if (!track) return;
          const loop = gsap.to(track, {
            xPercent: -50,
            duration: 28,
            ease: "none",
            repeat: -1,
          });
          loop.timeScale(0);
          loopRef.current = loop;
          gsap.fromTo(
            "[data-marquee]",
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" },
          );
          gsap.to(loop, { timeScale: 1, duration: 0.8, ease: "power1.out" });
        },
      });
    }, el);

    return () => {
      ctx.revert();
      loopRef.current = null;
    };
  }, [reducedMotion]);

  // Hover de la franja: desacelera elegante (no frena en seco).
  const slowMarquee = () => {
    if (!loopRef.current) return;
    gsap.to(loopRef.current, { timeScale: 0.15, duration: 0.6 });
  };
  const resumeMarquee = () => {
    if (!loopRef.current) return;
    gsap.to(loopRef.current, { timeScale: 1, duration: 0.6 });
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      data-section="footer"
      className="bg-azul-principal relative isolate flex flex-col overflow-hidden text-white"
    >
      {/* Profundidad sutil pero VISIBLE: gradiente que oscurece hacia abajo. */}
      <span
        data-bg-overlay
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,transparent_0%,transparent_50%,rgba(13,20,38,0.5)_100%)]"
      />

      <div className="relative z-10">
        <div className="mx-auto w-full max-w-screen-xl px-5 pt-16 md:px-10 md:pt-20">
          {/* Hairline estructural con "índice verde" (firma de marca). */}
          <div
            data-top-rule
            aria-hidden="true"
            className="bg-azul-medio/20 relative h-px w-full"
          >
            <span className="bg-verde-concepto absolute top-0 left-0 h-px w-28" />
          </div>

          {/* Banda de servicio · Marca + Navegación + Contacto (con CTA) */}
          <div className="grid grid-cols-1 gap-y-10 pt-12 pb-14 sm:grid-cols-2 md:grid-cols-12 md:gap-x-8 md:pt-14">
            {/* A · Marca + descripción + presencia regional */}
            <div data-col className="sm:col-span-2 md:col-span-4">
              <Brand variant="full" tone="light" asLink={false} />
              <p className="text-azul-claro/85 mt-5 max-w-xs font-sans text-[0.92rem] leading-relaxed">
                Investigamos, diseñamos y acompañamos procesos educativos
                situados junto a comunidades, instituciones y equipos docentes.
              </p>
              <p className="text-azul-claro/80 mt-5 font-mono text-[0.72rem] tracking-[0.18em] uppercase">
                {siteConfig.paises.join(" · ")}
              </p>
            </div>

            {/* B · Navegación (las 7 rutas) */}
            <nav
              data-col
              aria-label="Navegación del pie"
              className="md:col-span-4"
            >
              <h3 className="text-azul-claro/60 font-mono text-[0.72rem] font-medium tracking-[0.22em] uppercase">
                Navegar
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-6">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <FooterNavLink href={item.href} label={item.label} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* C · Contacto + ubicación + CTA */}
            <div data-col className="md:col-span-4">
              <h3 className="text-azul-claro/60 font-mono text-[0.72rem] font-medium tracking-[0.22em] uppercase">
                Contacto
              </h3>
              <ul className="mt-3 flex flex-col gap-3">
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="group text-azul-claro/90 focus-visible:outline-azul-claro inline-flex items-center gap-2.5 rounded-sm font-sans text-[0.95rem] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <MailOutline
                      size={15}
                      className="group-hover:text-verde-concepto transition-colors"
                      aria-hidden="true"
                    />
                    <span>{email}</span>
                  </a>
                </li>
                <li>
                  <address className="text-azul-claro/80 inline-flex items-center gap-2.5 font-sans text-[0.92rem] not-italic">
                    <span
                      aria-hidden="true"
                      className="bg-verde-concepto/70 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    />
                    {direccion.ciudad}, {direccion.pais}
                  </address>
                </li>
              </ul>

              {/* CTA principal — vive en la columna de contacto. */}
              <div className="mt-6">
                <Magnetic strength={0.25}>
                  <ButtonPrimary href={CTA_LINK.href} withArrow>
                    Conversemos
                  </ButtonPrimary>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Hairline banda | aliados, con índice verde. */}
          <div
            data-mid-rule
            aria-hidden="true"
            className="bg-azul-medio/15 relative h-px w-full"
          >
            <span className="bg-verde-concepto absolute top-0 left-0 h-px w-20" />
          </div>

          {/* Label de la franja de confianza (accesible). */}
          <p className="text-azul-claro/60 pt-8 font-mono text-[0.72rem] font-medium tracking-[0.22em] uppercase">
            Confían en nuestro trabajo
          </p>
        </div>

        {/* Franja full-bleed con los logos de aliados (en loop) */}
        <div
          data-marquee
          className="relative left-1/2 mt-6 w-screen -translate-x-1/2"
          onMouseEnter={slowMarquee}
          onMouseLeave={resumeMarquee}
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            maskImage:
              "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <div ref={trackRef} className="flex w-max will-change-transform">
            <AliadosSet />
            <AliadosSet ariaHidden />
          </div>
        </div>

        {/* Bottom-bar · copyright + volver arriba */}
        <div className="mx-auto w-full max-w-screen-xl px-5 md:px-10">
          <div className="border-azul-medio/12 mt-8 flex flex-col gap-3 border-t py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-azul-claro/80 font-sans text-[0.78rem] tracking-wide">
              © {year} {siteConfig.name}. Todos los derechos reservados.
            </p>
            <button
              type="button"
              onClick={scrollTop}
              className="group text-azul-claro/75 focus-visible:outline-azul-claro inline-flex items-center gap-2 self-start rounded-sm font-sans text-[0.78rem] tracking-wide transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:self-auto"
            >
              Volver arriba
              <ArrowRight
                size={13}
                className="-rotate-90 transition-transform group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
