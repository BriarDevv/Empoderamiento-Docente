"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { hasEntered, onEnter } from "@/lib/intro-signal";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Tarjeta del hero. Réplica EXACTA del campo de imágenes de blueprintapps.io:
 * 9 tarjetas con tamaños/relaciones de aspecto fijas (medidas del original) y
 * posiciones dispersas, sin rotación. Cada medida está expresada como fracción
 * del viewport para que escale igual que el original (su rem = 100vw/1728).
 */
type Card = {
  /** ancho como % del viewport (designRem / 1728 * 100). */
  w: number;
  /** relación de aspecto ancho/alto (CSS aspect-ratio). */
  ar: string;
  /** centro X como % del ancho del hero. */
  cx: number;
  /** centro Y como % del alto del hero. */
  cy: number;
  /** factor de parallax de scroll medido en el original (>1 = adelanta). */
  par: number;
  /** foto real, o null para usar un cuadrado de marca (placeholder). */
  img: string | null;
  alt?: string;
  label?: { title: string; desc?: string };
};

// Orden, cantidad (9) y métricas EXACTAS del hero de referencia. Slots 1, 3 y 8
// usan cuadrado de marca hasta tener las fotos (los más chicos / sin label).
const CARDS: Card[] = [
  { w: 17.36, ar: "300 / 250", cx: 31.25, cy: 7.1, par: 1.027, img: "/hero/hero-1.jpg", alt: "Equipo en reunión de trabajo", label: { title: "En el aula" } },
  { w: 12.73, ar: "220 / 280", cx: 81.6, cy: 16.07, par: 1.108, img: "/hero/hero-7.jpg", alt: "Encuentro de trabajo en equipo" },
  { w: 13.89, ar: "240 / 320", cx: 93.75, cy: 26.85, par: 1.014, img: "/hero/hero-3.jpg", alt: "Investigación en equipo", label: { title: "Investigación aplicada" } },
  { w: 12.73, ar: "220 / 260", cx: 5.21, cy: 25.01, par: 1.068, img: "/hero/hero-8.jpg", alt: "Materiales educativos" },
  { w: 16.2, ar: "280 / 240", cx: 16.2, cy: 44.61, par: 1.034, img: "/hero/hero-5.jpg", alt: "Taller en aula", label: { title: "Acompañamiento situado" } },
  { w: 19.68, ar: "340 / 260", cx: 72.92, cy: 55.71, par: 1.007, img: "/hero/hero-6.jpg", alt: "Encuentro de trabajo" },
  { w: 14.47, ar: "250 / 320", cx: 24.59, cy: 71.16, par: 1.088, img: "/hero/hero-4.jpg", alt: "Equipo de Empoderamiento Docente" },
  { w: 19.68, ar: "340 / 250", cx: 53.24, cy: 84.82, par: 1.024, img: "/hero/hero-2.jpg", alt: "Equipo con su publicación", label: { title: "Chile · México · Argentina", desc: "Presencia regional" } },
  { w: 9.84, ar: "170 / 230", cx: 85.94, cy: 93.84, par: 1.068, img: "/hero/hero-9.jpg", alt: "Lectura de material didáctico" },
];

/**
 * Hero adaptado a ED: título centrado rodeado por un campo de 9 tarjetas
 * dispersas en un hero alto (~1.85 viewports), sobre el campo de nodos
 * persistente. Animación de las cards portada del proyecto de referencia /
 * blueprintapps.io:
 *  - INTRO (al atravesar el gate): arrancan APILADAS en el centro, aparecen
 *    (scale 0.5→0.62) y se DESPLIEGAN a su lugar (scale →1, power3.inOut 1.7s,
 *    stagger desde el centro).
 *  - SCROLL: parallax por capa (`[data-card-outer]`, scrub).
 *  - MOUSE: un solo RAF con lerp setea `--pnx/--pny` (-1..1) y cada card se
 *    desplaza por su profundidad, EN CONTRA del mouse (`[data-card-mouse]`).
 * Respeta prefers-reduced-motion (sin animación, estado final visible).
 */
export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const scope = ref.current;
    if (!scope || reduced) return;

    let cleanupEnter: (() => void) | undefined;
    let fallback: number | undefined;
    let ran = false;

    const ctx = gsap.context(() => {
      const inners = gsap.utils.toArray<HTMLElement>("[data-card-inner]");
      const outers = gsap.utils.toArray<HTMLElement>("[data-card-outer]");

      // Ocultas hasta el ingreso desde el gate.
      gsap.set(inners, { autoAlpha: 0 });
      gsap.set("[data-card-label]", { opacity: 0, scale: 0 });
      gsap.set("[data-hero-copy]", { opacity: 0 });

      // Centrado base de cada tarjeta. El scroll-parallax va sobre ESTA capa.
      gsap.set(outers, { xPercent: -50, yPercent: -50 });

      // ENTRADA (fórmula del proyecto de referencia / blueprintapps.io): las
      // cards arrancan APILADAS en el centro y se despliegan a su lugar. Se
      // dispara al atravesar el gate.
      const entrance = () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Durante el despliegue, las cards van DELANTE del título.
        tl.set("[data-hero-cards]", { zIndex: 40 }, 0);

        // Estado inicial: apiladas/superpuestas en el centro del viewport,
        // chicas e invisibles (offset al centro calculado en runtime).
        gsap.set(inners, {
          x: (_i, el: HTMLElement) => {
            const r = el.getBoundingClientRect();
            return window.innerWidth / 2 - (r.left + r.width / 2);
          },
          y: (_i, el: HTMLElement) => {
            const r = el.getBoundingClientRect();
            return window.innerHeight / 2 - (r.top + r.height / 2);
          },
          scale: 0.5,
          autoAlpha: 0,
        });

        // 1a — aparecen apiladas en el centro.
        tl.to(
          inners,
          { autoAlpha: 1, scale: 0.62, duration: 0.7, ease: "power2.out", stagger: 0.04 },
          0.15,
        );

        // 1b — se despliegan desde el centro hasta su lugar (crecen a 1; stagger
        // desde el centro, easing power3.inOut suave).
        tl.to(
          inners,
          { x: 0, y: 0, scale: 1, duration: 1.7, ease: "power3.inOut", stagger: { each: 0.06, from: "center" } },
          1.0,
        );

        // Copy: entra mientras las cards se despliegan.
        tl.fromTo(
          "[data-hero-copy]",
          { opacity: 0, y: 26, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out" },
          1.1,
        );

        // Asentadas en la periferia, vuelven DETRÁS del título.
        tl.set("[data-hero-cards]", { zIndex: 10 }, 3.1);

        // Labels (spring) + hint.
        tl.fromTo(
          "[data-card-label]",
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.7)", stagger: 0.16 },
          3.0,
        );
        tl.fromTo("[data-hero-hint-inner]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 3.3);
      };

      const runOnce = () => {
        if (ran) return;
        ran = true;
        entrance();
      };
      if (hasEntered()) runOnce();
      else {
        cleanupEnter = onEnter(runOnce);
        // Salvaguarda: si por algún motivo no hubo señal del gate, animamos igual.
        fallback = window.setTimeout(runOnce, 6000);
      }

      // Parallax de scroll por tarjeta (capa [data-card-outer]).
      outers.forEach((outer, i) => {
        const extra = -(CARDS[i].par - 1) * (scope.offsetHeight || 1);
        gsap.to(outer, {
          y: extra,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
        });
      });

      // La copy y el hint se van con el scroll.
      gsap.to("[data-hero-copy-scroll]", {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "55% top", scrub: 1 },
      });
      gsap.to("[data-hero-hint]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "12% top", scrub: true },
      });
      gsap.to("[data-hero-arrow]", {
        y: 8,
        duration: 1.05,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, scope);

    // Parallax de mouse (fórmula de la referencia): un solo RAF con lerp setea
    // --pnx/--pny (-1..1 desde el centro). Cada card los multiplica por su
    // profundidad (capa [data-card-mouse]) y se desplaza EN CONTRA del mouse.
    let tnx = 0;
    let tny = 0;
    let cnx = 0;
    let cny = 0;
    let started = false;
    let raf = 0;
    const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
    const onMove = (e: MouseEvent) => {
      tnx = clamp((e.clientX / window.innerWidth - 0.5) * 2);
      tny = clamp((e.clientY / window.innerHeight - 0.5) * 2);
      started = true;
    };
    const EASE = 0.09; // más bajo = más retardo (trailing/lerp)
    const tick = () => {
      cnx += (tnx - cnx) * EASE;
      cny += (tny - cny) * EASE;
      if (started) {
        scope.style.setProperty("--pnx", cnx.toFixed(4));
        scope.style.setProperty("--pny", cny.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.clearTimeout(refresh);
      if (fallback) window.clearTimeout(fallback);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      cleanupEnter?.();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={ref}
      data-section="hero"
      className="text-azul-principal relative isolate min-h-[100svh] overflow-hidden lg:h-[93.75vw]"
      style={{ "--pnx": "0", "--pny": "0" } as CSSProperties}
    >
      {/* Sentinel del navbar: mientras está a la vista (top del viewport) el
          navbar es transparente; al dejarlo, vira a frosted. */}
      <span
        data-nav-sentinel
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[85vh] w-px"
      />

      {/* Glow verde para profundidad */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[40vh] left-1/2 z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, rgb(31 154 120 / 0.1) 0%, transparent 70%)" }}
      />

      {/* Marcador editorial mono */}
      <span
        aria-hidden="true"
        className="font-mono text-azul-principal/40 absolute top-6 right-5 z-30 hidden text-[0.7rem] tracking-[0.3em] uppercase md:top-8 md:right-10 md:block"
      >
        001 <span className="text-naranja-accion">/</span> Inicio
      </span>

      {/* Campo de 9 tarjetas dispersas (desktop) */}
      <div
        data-hero-cards
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
      >
        {CARDS.map((c, i) => {
          // Profundidad del mouse-parallax: más grande = más cerca = se mueve más
          // (negativo = en contra del mouse), igual que la referencia.
          const depth = -Math.round(c.w * 2);
          return (
            <div
              key={i}
              data-card-outer
              className="absolute"
              style={{ left: `${c.cx}%`, top: `${c.cy}%`, width: `${c.w}vw`, transform: "translate(-50%, -50%)" }}
            >
              <div
                data-card-mouse
                className="will-change-transform"
                style={{ transform: `translate(calc(var(--pnx, 0) * ${depth}px), calc(var(--pny, 0) * ${depth}px))` }}
              >
                <div data-card-inner className="relative">
                  <div
                    className="relative w-full overflow-hidden rounded-2xl shadow-[0_28px_70px_-28px_rgb(31_45_77_/_0.5)] ring-1 ring-white/40"
                    style={{ aspectRatio: c.ar }}
                  >
                    {c.img ? (
                      <Image src={c.img} alt={c.alt ?? ""} fill sizes="22vw" className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-azul-principal via-[#34507f] to-verde-concepto">
                        <span
                          className="absolute inset-0 opacity-30"
                          style={{ background: "radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.5) 0%, transparent 55%)" }}
                        />
                        <span className="font-display absolute bottom-3 left-4 text-[1.5rem] font-bold tracking-tight text-white/85">
                          ED
                        </span>
                      </div>
                    )}
                  </div>

                  {c.label ? (
                    <div className="absolute top-[90%] left-1/2 w-max -translate-x-1/2">
                      <div
                        data-card-label
                        className="bg-azul-principal/55 max-w-[15rem] rounded-xl border border-white/15 px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgb(0_0_0_/_0.6)] backdrop-blur-md"
                      >
                        <span className="text-verde-concepto block font-sans text-[0.82rem] font-semibold">
                          {c.label.title}
                        </span>
                        {c.label.desc ? (
                          <span className="mt-1 block font-mono text-[0.66rem] tracking-wide text-white/55">
                            {c.label.desc}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contenido CENTRADO en el primer viewport (se va con el scroll) */}
      <div
        data-hero-copy-scroll
        className="absolute inset-x-0 top-0 z-20 flex h-screen flex-col items-center justify-center px-5 text-center md:px-10"
      >
        <div data-hero-copy className="mx-auto max-w-3xl">
          <div className="flex justify-center">
            <Eyebrow dashClass="w-14">Consultora en educación matemática</Eyebrow>
          </div>

          <h1
            className="font-display mt-7 font-bold tracking-[-0.035em]"
            style={{ fontSize: "clamp(2.9rem, 1.1rem + 7vw, 6rem)", lineHeight: 0.98 }}
          >
            Transformamos la <span className="text-verde-concepto">enseñanza</span> de la matemática.
          </h1>

          <p className="text-gris-texto mx-auto mt-8 max-w-xl font-sans text-[1.08rem] leading-relaxed md:text-[1.2rem]">
            Diseñamos, acompañamos y sostenemos el cambio en el aula — junto a cada escuela y cada docente.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonPrimary href="/contacto">Contacto</ButtonPrimary>
            <ButtonSecondary href="/que-hacemos">Qué hacemos</ButtonSecondary>
          </div>
        </div>
      </div>

      {/* Scroll hint, abajo del primer viewport */}
      <div
        data-hero-hint
        className="absolute inset-x-0 top-[calc(100vh-5.5rem)] z-20 flex items-center justify-center"
      >
        <Link
          data-hero-hint-inner
          href="#contenido"
          className="group inline-flex flex-col items-center gap-2.5 md:flex-row md:gap-3"
        >
          <span className="font-mono text-azul-principal/60 group-hover:text-azul-principal text-[0.72rem] font-medium tracking-[0.28em] uppercase transition-colors">
            Seguí bajando
          </span>
          <span
            data-hero-arrow
            className="border-azul-principal/20 text-azul-principal group-hover:border-naranja-accion group-hover:text-naranja-accion flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
