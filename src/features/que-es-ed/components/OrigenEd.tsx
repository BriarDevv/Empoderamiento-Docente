"use client";

import { Fragment, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitChars } from "@/components/ui/SplitChars";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Origen, sentido y evolución" (sección 2 del sitemap de Qué es ED).
 * Lámina NAVY inmersiva que se ACOPLA sobre el hero (transición de sección:
 * sube con escala + esquinas redondeadas) y se CLAVA (sticky). Adentro, una
 * historia en 5 BEATS conducida 100% por el scroll (scrub — ida y vuelta):
 *
 *  0. "No nacimos de una teoría." — al avanzar, las LETRAS ESTALLAN y se
 *     dispersan (cada char vuela con rotación propia).
 *  1. El punto de inflexión: la CITA de la profesora entra como tarjeta que
 *     se LEVANTA EN 3D (flip desde el plano) y sus líneas suben por máscara.
 *  2. "¿Qué hicimos exactamente?" — se TIPEA carácter por carácter con el
 *     scroll (retroceder la des-tipea), con caret latiendo.
 *  3. Evolución: una CONSTELACIÓN se dibuja sola (línea SVG por dash-offset)
 *     y sus 5 hitos laten al llegar la línea: Maestría → Doctorado → México →
 *     Argentina → Hoy. Los nodos tienen hover (crecen).
 *  4. Remate: «Vivir para hacer vivir» — las palabras convergen desde el blur.
 *
 * Además: TILT 3D del panel siguiendo el mouse e indicador de progreso de 5
 * puntos (cápsula naranja = beat activo, mismo idioma que el home).
 *
 * Contenido basado en los videos del cliente (resumen videos.txt §1–3). La
 * redacción exacta de la cita es una dramatización del testimonio del video 2
 * — VALIDAR con el cliente antes de publicar.
 * Reduced-motion / sin JS: los beats quedan apilados en flow, legibles.
 */

const HITOS = [
  { t: "Maestría", d: "Observar y caracterizar lo que pasaba con los docentes." },
  { t: "Doctorado", d: "Explicaciones propias y una intervención de años en el aula." },
  { t: "México", d: "Parte del desarrollo profesional docente a nivel nacional." },
  { t: "Argentina", d: "La expansión regional, con la filosofía intacta." },
  { t: "Hoy", d: "Una línea de investigación viva y una organización que transforma." },
] as const;

// Coordenadas de los hitos sobre el viewBox 1000×220 (misma curva del path).
const NODOS = [
  { x: 60, y: 150 },
  { x: 280, y: 90 },
  { x: 500, y: 140 },
  { x: 720, y: 80 },
  { x: 940, y: 120 },
] as const;

const PATH_D =
  "M 60 150 C 133 150 207 90 280 90 C 353 90 427 140 500 140 C 573 140 647 80 720 80 C 793 80 867 120 940 120";

const PREGUNTA = "¿Qué hicimos exactamente?";

export function OrigenEd() {
  const rootRef = useRef<HTMLElement | null>(null);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const zone = zoneRef.current;
    if (!root || !zone || reduced) return;

    let raf = 0;
    let removeMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const beats = gsap.utils.toArray<HTMLElement>("[data-beat]");
      const tilt = root.querySelector<HTMLElement>("[data-story-tilt]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-story-dot]");
      if (beats.length !== 5 || !tilt) return;

      // ── Acople de la lámina sobre el hero (transición de sección) ────────
      gsap.fromTo(
        root,
        { scale: 0.955, y: 44 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 12%", scrub: true },
        },
      );

      // ── Capas: pasan a superponerse (en flow quedan apiladas sin motion) ─
      gsap.set(beats, { position: "absolute", inset: 0 });
      gsap.set(beats.slice(1), { autoAlpha: 0 });

      const q = (sel: string) => root.querySelector<HTMLElement>(sel);
      const qa = (sel: string) => gsap.utils.toArray<HTMLElement>(sel);

      const chars0 = qa("[data-beat='0'] [data-char]");
      const quoteCard = q("[data-quote-card]");
      const quoteLines = qa("[data-quote-line]");
      const typeChars = qa("[data-type] [data-char]");
      const sub2 = q("[data-beat='2'] [data-sub]");
      const path = root.querySelector<SVGPathElement>("[data-const-path]");
      const nodos = gsap.utils.toArray<SVGCircleElement>("[data-const-node]");
      const labels = qa("[data-const-label]");
      const finWords = qa("[data-fin-word]");
      const finRule = q("[data-fin-rule]");
      const finSub = q("[data-fin-sub]");

      // Estados iniciales de piezas internas (solo con motion)
      if (quoteCard) {
        gsap.set(quoteCard, {
          rotateX: -72,
          y: 80,
          autoAlpha: 0,
          transformPerspective: 1000,
          transformOrigin: "center bottom",
        });
      }
      gsap.set(quoteLines, { yPercent: 115 });
      gsap.set(typeChars, { opacity: 0.13 });
      if (sub2) gsap.set(sub2, { autoAlpha: 0, y: 18 });
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      }
      nodos.forEach((n) => gsap.set(n, { attr: { r: 0 } }));
      gsap.set(labels, { autoAlpha: 0, y: 14 });
      gsap.set(finWords, { autoAlpha: 0, scale: 1.7, filter: "blur(10px)" });
      if (finRule) gsap.set(finRule, { scaleX: 0 });
      if (finSub) gsap.set(finSub, { autoAlpha: 0, y: 18 });

      // ── Indicador de 5 puntos (definido ANTES del timeline: su onUpdate
      //    puede dispararse apenas se crea el ScrollTrigger) ─────────────────
      let lastIdx = -1;
      const setDot = (p: number) => {
        // umbrales = inicio de cada beat sobre la duración total (11.5)
        const bounds = [0.13, 0.35, 0.57, 0.83];
        let idx = 0;
        for (let i = 0; i < bounds.length; i++) if (p >= bounds[i]) idx = i + 1;
        if (idx === lastIdx) return;
        lastIdx = idx;
        dots.forEach((d, i) => {
          gsap.to(d, {
            width: i === idx ? 26 : 8,
            backgroundColor: i === idx ? "#e07a2f" : "rgba(255,255,255,0.25)",
            duration: 0.35,
            ease: "power2.out",
          });
        });
      };

      // ── Timeline maestro (≈11.5 unidades repartidas en toda la zona) ─────
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: zone,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => setDot(self.progress),
        },
      });

      // BEAT 0 → estallido de letras
      chars0.forEach((c, i) => {
        tl.to(
          c,
          {
            x: Math.sin(i * 3.7) * 190,
            y: -70 - ((i * 37) % 110),
            rotation: Math.sin(i * 1.3) * 55,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power2.in",
          },
          0.6 + (i % 7) * 0.05,
        );
      });
      tl.to(beats[0], { autoAlpha: 0, duration: 0.4 }, 1.3);

      // BEAT 1 — la cita (tarjeta 3D)
      tl.to(beats[1], { autoAlpha: 1, duration: 0.3 }, 1.5)
        .to(quoteCard, { rotateX: 0, y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" }, 1.6)
        .to(quoteLines, { yPercent: 0, duration: 0.6, stagger: 0.14, ease: "power3.out" }, 2.1)
        .to(beats[1], { autoAlpha: 0, y: -50, scale: 0.96, duration: 0.6 }, 3.6);

      // BEAT 2 — la pregunta se tipea con el scroll
      tl.to(beats[2], { autoAlpha: 1, duration: 0.3 }, 4.0)
        .to(typeChars, { opacity: 1, duration: 0.02, stagger: 0.055, ease: "none" }, 4.2);
      if (sub2) tl.to(sub2, { autoAlpha: 1, y: 0, duration: 0.5 }, 5.6);
      tl.to(beats[2], { autoAlpha: 0, y: -50, scale: 0.96, duration: 0.6 }, 6.2);

      // BEAT 3 — la constelación se dibuja
      tl.to(beats[3], { autoAlpha: 1, duration: 0.3 }, 6.6);
      if (path) tl.to(path, { strokeDashoffset: 0, duration: 2.2, ease: "none" }, 6.8);
      nodos.forEach((n, i) => {
        const at = 6.8 + (i / (nodos.length - 1)) * 2.0;
        tl.to(n, { attr: { r: 7 }, duration: 0.25, ease: "back.out(3)" }, at);
        if (labels[i]) tl.to(labels[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.08);
      });
      tl.to(beats[3], { autoAlpha: 0, y: -40, scale: 0.97, duration: 0.5 }, 9.2);

      // BEAT 4 — «Vivir para hacer vivir»
      tl.to(beats[4], { autoAlpha: 1, duration: 0.3 }, 9.5);
      tl.to(
        finWords,
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.55, stagger: 0.16, ease: "power3.out" },
        9.6,
      );
      if (finRule) tl.to(finRule, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 10.2);
      if (finSub) tl.to(finSub, { autoAlpha: 1, y: 0, duration: 0.5 }, 10.35);
      tl.to({}, { duration: 0.6 }, 10.9); // respiro final antes de soltar el pin
      setDot(0);

      // ── TILT 3D del panel con el mouse (suave, solo pointer fino) ────────
      if (window.matchMedia("(pointer: fine)").matches) {
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        const onMove = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const loop = () => {
          cx += (tx - cx) * 0.06;
          cy += (ty - cy) * 0.06;
          gsap.set(tilt, { rotateY: cx * 1.8, rotateX: -cy * 1.4, transformPerspective: 1100 });
          raf = requestAnimationFrame(loop);
        };
        window.addEventListener("mousemove", onMove);
        raf = requestAnimationFrame(loop);
        removeMove = () => window.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      removeMove?.();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="origen"
      className="bg-azul-principal relative z-20 -mt-[5svh] overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Origen, sentido y evolución"
    >
      {/* Textura de puntos blanca muy sutil (motivo de marca sobre navy) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle,#fff_1.1px,transparent_1.6px)] [background-size:24px_24px]"
      />
      {/* Glow verde de fondo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[8%] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.14)_0%,transparent_65%)]"
      />

      <div ref={zoneRef} className="relative h-[560svh] motion-reduce:h-auto">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden motion-reduce:static motion-reduce:h-auto">
          <div
            data-story-tilt
            className="relative h-full w-full will-change-transform [transform-style:preserve-3d] motion-reduce:h-auto"
          >
            {/* ── BEAT 0: "No nacimos de una teoría." ─────────────────────── */}
            <div
              data-beat="0"
              className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
            >
              <span className="text-azul-claro/80 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
                Origen, sentido y evolución
              </span>
              <h2
                className="font-display mt-6 max-w-[16ch] font-bold tracking-[-0.02em] text-white"
                style={{ fontSize: "clamp(2.2rem, 1rem + 4.6vw, 4.4rem)", lineHeight: 1.06 }}
              >
                <SplitChars text="No nacimos de una teoría." />
              </h2>
              <p className="text-azul-claro/85 mt-6 max-w-[46ch] font-sans text-[1.02rem] leading-relaxed md:text-[1.15rem]">
                Nacimos en aulas reales, discutiendo la matemática a fondo con
                docentes de distintos estados de México.
              </p>
            </div>

            {/* ── BEAT 1: la cita de la profesora (tarjeta 3D) ────────────── */}
            <div
              data-beat="1"
              className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
            >
              <span className="text-azul-claro/80 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
                El punto de inflexión
              </span>
              {/* Dramatización del testimonio (video 2) — validar con cliente */}
              <figure
                data-quote-card
                className="mt-8 max-w-2xl rounded-3xl bg-white/[0.06] px-8 py-10 ring-1 ring-white/10 backdrop-blur-sm transition-shadow duration-500 will-change-transform hover:shadow-[0_30px_80px_-30px_rgb(31_154_120/0.35)] md:px-12"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-verde-concepto block text-6xl leading-none font-bold"
                >
                  “
                </span>
                <blockquote
                  className="font-display mt-3 font-semibold tracking-[-0.01em] text-white"
                  style={{ fontSize: "clamp(1.35rem, 0.8rem + 2vw, 2.1rem)", lineHeight: 1.3 }}
                >
                  <span className="block overflow-hidden">
                    <span data-quote-line className="block">Estaba a punto de jubilarme.</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-quote-line className="block">Ahora quiero volver:</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-quote-line className="text-verde-concepto block">
                      quiero transformar el aula.
                    </span>
                  </span>
                </blockquote>
                <figcaption className="text-azul-claro/75 mt-6 font-sans text-[0.85rem] tracking-wide">
                  Una profesora, al cerrar uno de los primeros encuentros · México
                </figcaption>
              </figure>
            </div>

            {/* ── BEAT 2: la pregunta fundacional (typewriter por scroll) ─── */}
            <div
              data-beat="2"
              className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
            >
              <span className="text-azul-claro/80 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
                Esa reacción se repetía
              </span>
              <h3
                data-type
                className="font-display mt-7 font-bold tracking-[-0.01em] text-white"
                style={{ fontSize: "clamp(1.9rem, 0.9rem + 3.6vw, 3.6rem)", lineHeight: 1.1 }}
              >
                <SplitChars text={PREGUNTA} />
                <span
                  data-caret
                  aria-hidden="true"
                  className="bg-verde-concepto ml-2 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] animate-pulse rounded-full"
                />
              </h3>
              <p
                data-sub
                className="text-azul-claro/85 mt-6 max-w-[52ch] font-sans text-[1.02rem] leading-relaxed md:text-[1.15rem]"
              >
                ¿Por qué este cuerpo docente sentía, de repente, el impulso de
                volver y transformar su entorno? Esa pregunta —nacida en plena
                maestría— fundó Empoderamiento Docente.
              </p>
            </div>

            {/* ── BEAT 3: la evolución (constelación que se dibuja) ───────── */}
            <div
              data-beat="3"
              className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
            >
              <span className="text-azul-claro/80 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
                De una pregunta a un movimiento
              </span>
              <div className="relative mt-10 w-full max-w-5xl">
                <svg viewBox="0 0 1000 220" className="h-auto w-full" aria-hidden="true">
                  <path
                    d={PATH_D}
                    fill="none"
                    stroke="rgba(169,197,232,0.25)"
                    strokeWidth="2"
                    strokeDasharray="3 7"
                  />
                  <path
                    data-const-path
                    d={PATH_D}
                    fill="none"
                    stroke="#1f9a78"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {NODOS.map((n, i) => (
                    <Fragment key={i}>
                      <circle cx={n.x} cy={n.y} r="12" fill="rgba(31,154,120,0.15)" />
                      <circle
                        data-const-node
                        cx={n.x}
                        cy={n.y}
                        r="7"
                        fill={i === NODOS.length - 1 ? "#e07a2f" : "#1f9a78"}
                        className="origin-center cursor-pointer transition-transform duration-300 [transform-box:fill-box] hover:scale-150"
                      />
                    </Fragment>
                  ))}
                </svg>
                {/* Etiquetas HTML sobre la misma grilla del viewBox. El div
                    EXTERNO posiciona (transform estático); el interno anima
                    (así GSAP no pisa el offset de posicionamiento). */}
                {HITOS.map((h, i) => (
                  <div
                    key={h.t}
                    className="absolute w-40 md:w-48"
                    style={{
                      left: `${(NODOS[i].x / 1000) * 100}%`,
                      top: `${(NODOS[i].y / 220) * 100}%`,
                      transform: `translate(-50%, ${i % 2 === 0 ? "16px" : "calc(-100% - 16px)"})`,
                    }}
                  >
                    <div data-const-label>
                      <p className="font-display text-[0.95rem] font-bold text-white md:text-[1.05rem]">
                        {h.t}
                      </p>
                      <p className="text-azul-claro/75 mt-1 hidden font-sans text-[0.78rem] leading-snug md:block">
                        {h.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── BEAT 4: «Vivir para hacer vivir» ────────────────────────── */}
            <div
              data-beat="4"
              className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
            >
              <h3
                className="font-display font-bold tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.6rem, 1rem + 5.6vw, 5.4rem)", lineHeight: 1.05 }}
              >
                {["Vivir", "para", "hacer", "vivir."].map((w, i) => (
                  <Fragment key={i}>
                    <span
                      data-fin-word
                      className={`inline-block will-change-transform ${
                        i === 0 || i === 3 ? "text-verde-concepto" : "text-white"
                      }`}
                    >
                      {w}
                    </span>
                    {i < 3 ? " " : null}
                  </Fragment>
                ))}
              </h3>
              <span
                data-fin-rule
                aria-hidden="true"
                className="bg-verde-concepto mt-8 block h-[2px] w-24 origin-center rounded-full"
              />
              <p
                data-fin-sub
                className="text-azul-claro/85 mt-7 max-w-[50ch] font-sans text-[1.02rem] leading-relaxed md:text-[1.15rem]"
              >
                Para construir escenarios de aprendizaje diversos, el cuerpo
                docente necesita primero vivir una nueva relación con la
                matemática. Ese es nuestro pilar desde el primer día.
              </p>
            </div>

            {/* Indicador de progreso de la historia (5 beats) */}
            <div
              className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2.5 motion-reduce:hidden"
              aria-hidden="true"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} data-story-dot className="h-2 w-2 rounded-full bg-white/25" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
