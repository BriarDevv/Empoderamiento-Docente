"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { hasEntered, onEnter } from "@/lib/intro-signal";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
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
  { w: 17.36, ar: "300 / 250", cx: 31.25, cy: 7.1, par: 1.027, img: "/hero/hero-1.webp", alt: "Equipo en reunión de trabajo", label: { title: "En el aula", desc: "Acompañamos el aprendizaje donde sucede." } },
  { w: 12.73, ar: "220 / 280", cx: 81.6, cy: 16.07, par: 1.108, img: "/hero/hero-7.webp", alt: "Encuentro de trabajo en equipo" },
  { w: 13.89, ar: "240 / 320", cx: 93.75, cy: 26.85, par: 1.014, img: "/hero/hero-3.webp", alt: "Investigación en equipo", label: { title: "Investigación aplicada", desc: "Conocimiento que vuelve al aula." } },
  { w: 12.73, ar: "220 / 260", cx: 5.21, cy: 25.01, par: 1.068, img: "/hero/hero-8.webp", alt: "Materiales educativos" },
  { w: 16.2, ar: "280 / 240", cx: 16.2, cy: 44.61, par: 1.034, img: "/hero/hero-5.webp", alt: "Taller en aula", label: { title: "Acompañamiento situado", desc: "Junto a cada docente y escuela." } },
  { w: 19.68, ar: "340 / 260", cx: 72.92, cy: 55.71, par: 1.007, img: "/hero/hero-6.webp", alt: "Encuentro de trabajo", label: { title: "Formación docente", desc: "Trayectos para docentes de matemática." } },
  { w: 14.47, ar: "250 / 320", cx: 24.59, cy: 71.16, par: 1.088, img: "/hero/hero-4.webp", alt: "Equipo de Empoderamiento Docente" },
  { w: 19.68, ar: "340 / 250", cx: 53.24, cy: 84.82, par: 1.024, img: "/hero/hero-2.webp", alt: "Equipo con su publicación", label: { title: "Presencia regional", desc: "Chile · México · Argentina · Colombia · Brasil." } },
  { w: 9.84, ar: "170 / 230", cx: 85.94, cy: 93.84, par: 1.068, img: "/hero/hero-9.webp", alt: "Lectura de material didáctico" },
  // Sumadas para llenar el vacío de la parte de abajo y "bajar" hacia Acerca de.
  { w: 14, ar: "300 / 210", cx: 50, cy: 64, par: 1.04, img: "/hero/hero-10.webp", alt: "Materiales de geometría en una actividad de aula" },
  { w: 13, ar: "240 / 300", cx: 11, cy: 84, par: 1.07, img: "/hero/hero-11.webp", alt: "Cuadernillo de matemática con representación de números", label: { title: "Materiales propios", desc: "Recursos listos para llevar al aula." } },
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
 *
 * Copy (idioma de Empoderamiento Docente): el titular entra LIMPIO, línea por
 * línea (fade-up con stagger, SIN blur), y después la descripción y las acciones
 * suben con un fade suave — así el texto no "molesta" al aparecer.
 * Respeta prefers-reduced-motion (sin animación, estado final visible).
 */
export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Layout effect (síncrono, pre-paint): oculta las cards antes del primer
  // paint para que, sin gate, no haya flash del hero ya armado antes de animar.
  useIsomorphicLayoutEffect(() => {
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
      // Copy oculta por partes: el titular en MÁSCARA (cada línea baja fuera de
      // su recorte) + descripción + acciones.
      // Titular: cada palabra arranca volteada hacia abajo (flip 3D) e invisible.
      gsap.set("[data-hero-word]", {
        opacity: 0,
        yPercent: 120,
        rotateX: -85,
        transformOrigin: "50% 100%",
        transformPerspective: 700,
      });
      // El acento ENTRA en azul (como el resto) y vira a verde en el pop.
      gsap.set("[data-hero-accent]", { color: "#1f2d4d" });
      gsap.set("[data-hero-desc]", { autoAlpha: 0, y: 18 });
      gsap.set("[data-hero-actions]", { autoAlpha: 0, y: 16 });
      // Los carteles de las fotos arrancan ocultos: aparecen DESPUÉS, cuando las
      // cards ya llegaron a su lugar (no desde el frame 0, apiladas).
      gsap.set("[data-card-label]", { autoAlpha: 0, y: 8 });

      // Centrado base de cada tarjeta. El scroll-parallax va sobre ESTA capa.
      gsap.set(outers, { xPercent: -50, yPercent: -50 });

      // ENTRADA (fórmula del proyecto de referencia / blueprintapps.io): las
      // cards arrancan APILADAS en el centro y se despliegan a su lugar. Se
      // dispara al atravesar el gate.
      const entrance = () => {
        // Mismos TEMPOS que el hero de Empoderamiento Docente (BlueprintHero):
        // delay 0.2 → cards aparecen apiladas (0.7s) → beat 0.15 → se despliegan
        // (1.7s) → el titular sube en el ÚLTIMO ~1s del despliegue (-=1.0), y
        // recién después la descripción (-=0.55) y las acciones (-=0.4).
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });

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
          0,
        );

        // 1b — se despliegan desde el centro hasta su lugar (crecen a 1; stagger
        // desde el centro, easing power3.inOut suave). Beat de 0.15 entre ambas.
        tl.to(
          inners,
          { x: 0, y: 0, scale: 1, duration: 1.7, ease: "power3.inOut", stagger: { each: 0.06, from: "center" } },
          "+=0.15",
        );

        // Asentadas, vuelven DETRÁS del título justo cuando el texto va a entrar.
        tl.set("[data-hero-cards]", { zIndex: 10 }, "-=1.0");

        // Copy (idioma de Empoderamiento Docente): el titular SUBE línea por
        // línea desde su máscara (mask-rise, sin blur) en el último tramo del
        // despliegue, y después la descripción y las acciones. Tempos del FUENTE.
        tl.to(
          "[data-hero-word]",
          {
            opacity: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.95,
            ease: "back.out(1.5)",
            stagger: 0.07,
          },
          "<",
        )
          // Pop del acento (aprendizaje) justo cuando termina de armarse el título.
          .to(
            "[data-hero-accent]",
            {
              keyframes: [
                { scale: 1.16, color: "#1f9a78", duration: 0.22, ease: "power2.out" },
                { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" },
              ],
            },
            "-=0.35",
          )
          .to(
            "[data-hero-desc]",
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.6",
          )
          .to(
            "[data-hero-actions]",
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.4",
          )
          // Carteles de las fotos: entran al final, ya con las cards en su lugar
          // (fade-up, stagger), como remate del armado.
          .to(
            "[data-card-label]",
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 },
            "-=0.25",
          );
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

      // La copy se va con el scroll.
      gsap.to("[data-hero-copy-scroll]", {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top top", end: "55% top", scrub: 1 },
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

                  {/* Cartel referencial (tipo web de referencia): sobresale del
                      borde inferior para "rellenar" el hueco al scrollear. */}
                  {c.label && (
                    <div
                      data-card-label
                      className="absolute -bottom-5 left-3 z-10 w-max max-w-[20rem] rounded-xl bg-white/85 px-3.5 py-2.5 shadow-[0_16px_36px_-18px_rgb(31_45_77_/_0.45)] ring-1 ring-azul-principal/10 backdrop-blur-md"
                    >
                      <p className="font-display text-verde-concepto text-[0.82rem] leading-tight font-semibold tracking-[-0.01em]">
                        {c.label.title}
                      </p>
                      {c.label.desc && (
                        <p className="text-gris-texto mt-0.5 font-sans text-[0.72rem] leading-snug whitespace-nowrap">
                          {c.label.desc}
                        </p>
                      )}
                    </div>
                  )}
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
        <div data-hero-copy className="mx-auto max-w-xl translate-y-[5vh]">
          <h1
            data-hero-headline
            className="font-display font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2rem, 1rem + 2.5vw, 2.8rem)", lineHeight: 1.12 }}
          >
            <span className="block">
              <span data-hero-word className="inline-block">Impulsamos</span>{" "}
              <span data-hero-word className="inline-block">el</span>{" "}
              <span
                data-hero-word
                data-hero-accent
                className="text-verde-concepto inline-block"
              >
                aprendizaje
              </span>
            </span>
            <span className="block">
              <span data-hero-word className="inline-block">de</span>{" "}
              <span data-hero-word className="inline-block">la</span>{" "}
              <span data-hero-word className="inline-block">matemática.</span>
            </span>
          </h1>

          <p
            data-hero-desc
            className="text-gris-texto mx-auto mt-6 max-w-md text-balance font-sans text-[1.05rem] leading-relaxed md:text-[1.2rem]"
          >
            Acompañamos a cada docente y a cada escuela, con base en la
            investigación, para que el aprendizaje tenga sentido.
          </p>

          <div
            data-hero-actions
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <ButtonPrimary href="/contacto">Contactanos</ButtonPrimary>
            <ButtonSecondary href="/que-hacemos">Qué hacemos</ButtonSecondary>
          </div>
        </div>
      </div>
    </section>
  );
}
