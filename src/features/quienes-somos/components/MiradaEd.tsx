"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Nuestra mirada" (sección 3 del sitemap de Qué es ED): pensamiento
 * matemático · empoderamiento · educación como derecho.
 *
 * Concepto: la MIRADA como lente. Lámina clara que se acopla sobre la lámina
 * navy de Origen (mismo idioma de transición) y se clava (sticky). Tres
 * paneles-idea que se revelan con IRIS CIRCULAR (clip-path circle que se abre
 * como un ojo, desde orígenes distintos) conducido por el scroll. Micro-
 * coreografías por panel:
 *
 *  0. Pensamiento matemático — el remate de la frase ROTA en loop:
 *     «tomar decisiones» → «crear estrategias» → «argumentar con otros».
 *  1. Empoderamiento — un TACHADO se dibuja sobre "sobre otras personas" y un
 *     SUBRAYADO verde bajo "transformar", ambos al ritmo del scroll.
 *  2. Educación como derecho — CHIPS que explotan con resorte + CTA.
 *
 * Interactivo: un ANILLO-LENTE verde sigue al cursor dentro de la sección
 * (lerp), y el indicador de 3 puntos (cápsula naranja) marca la idea activa.
 *
 * Contenido basado en videos 3, 5, 6, 7, 9, 13 + brief del cliente (género,
 * inclusión, justicia social, mirada NO deficitaria) [[ed-brief-cliente]].
 * Reduced-motion / sin JS: paneles apilados en flow, legibles, sin loop.
 */

const ROTATOR = ["tomar decisiones", "crear estrategias", "argumentar con otros"];

const CHIPS = [
  "Perspectiva de género",
  "Inclusión",
  "Justicia social",
  "Conocimiento construido en comunidad",
  "Mirada no deficitaria del profesorado",
];

export function MiradaEd() {
  const rootRef = useRef<HTMLElement | null>(null);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const zone = zoneRef.current;
    if (!root || !zone || reduced) return;

    let raf = 0;
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-mirada-panel]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-mirada-dot]");
      const lens = root.querySelector<HTMLElement>("[data-lens]");
      if (panels.length !== 3) return;

      // ── Acople de la lámina clara sobre el navy de Origen ────────────────
      gsap.fromTo(
        root,
        { scale: 0.97, y: 36 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 14%", scrub: true },
        },
      );

      // ── Capas superpuestas (en flow sin motion) ──────────────────────────
      gsap.set(panels, { position: "absolute", inset: 0 });
      gsap.set(panels[1], { clipPath: "circle(0% at 30% 42%)" });
      gsap.set(panels[2], { clipPath: "circle(0% at 70% 58%)" });

      const q = (sel: string) => root.querySelector<HTMLElement>(sel);
      const qa = (sel: string) => gsap.utils.toArray<HTMLElement>(sel);

      const p0Bits = qa("[data-mirada-panel='0'] [data-bit]");
      const strike = q("[data-strike]");
      const underline = q("[data-underline]");
      const chips = qa("[data-chip]");
      const cta = q("[data-mirada-cta]");
      const rotWords = qa("[data-rot-word]");

      // Estados iniciales (solo con motion)
      gsap.set(p0Bits, { autoAlpha: 0, y: 26 });
      if (strike) gsap.set(strike, { scaleX: 0, transformOrigin: "left center" });
      if (underline) gsap.set(underline, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(chips, { scale: 0, autoAlpha: 0 });
      if (cta) gsap.set(cta, { autoAlpha: 0, y: 16 });

      // ── Indicador de 3 puntos (antes del timeline, por el onUpdate) ──────
      let lastIdx = -1;
      const setDot = (p: number) => {
        const bounds = [0.34, 0.66];
        let idx = 0;
        for (let i = 0; i < bounds.length; i++) if (p >= bounds[i]) idx = i + 1;
        if (idx === lastIdx) return;
        lastIdx = idx;
        dots.forEach((d, i) => {
          gsap.to(d, {
            width: i === idx ? 26 : 8,
            backgroundColor: i === idx ? "#e07a2f" : "rgba(31,45,77,0.18)",
            duration: 0.35,
            ease: "power2.out",
          });
        });
      };

      // ── Timeline maestro (8.6 unidades sobre toda la zona) ───────────────
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

      // PANEL 0 — entrada de piezas
      tl.to(p0Bits, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out" }, 0.15);

      // IRIS 1 — el ojo se abre sobre "Empoderamiento"
      tl.fromTo(
        panels[1],
        { clipPath: "circle(0% at 30% 42%)" },
        { clipPath: "circle(140% at 30% 42%)", duration: 1.0, ease: "power2.in" },
        2.4,
      );
      tl.set(panels[0], { autoAlpha: 0 }, 3.5);

      // PANEL 1 — tachado y subrayado se dibujan
      if (strike) tl.to(strike, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 3.8);
      if (underline) tl.to(underline, { scaleX: 1, duration: 0.6, ease: "power2.out" }, 4.5);

      // IRIS 2 — el ojo se abre sobre "Educación como derecho"
      tl.set(panels[0], { autoAlpha: 0 }, 5.2); // (por si se scrollea en reversa rápido)
      tl.fromTo(
        panels[2],
        { clipPath: "circle(0% at 70% 58%)" },
        { clipPath: "circle(140% at 70% 58%)", duration: 1.0, ease: "power2.in" },
        5.4,
      );
      tl.set(panels[1], { autoAlpha: 0 }, 6.5);

      // PANEL 2 — chips con resorte + CTA
      tl.to(
        chips,
        { scale: 1, autoAlpha: 1, duration: 0.45, stagger: 0.09, ease: "back.out(2.2)" },
        6.6,
      );
      if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.5 }, 7.4);
      tl.to({}, { duration: 0.7 }, 7.9); // respiro final
      setDot(0);

      // ── Loop del rotador (independiente del scroll; infinito) ────────────
      if (rotWords.length === ROTATOR.length) {
        gsap.set(rotWords[0], { yPercent: 0, autoAlpha: 1 });
        gsap.set(rotWords.slice(1), { yPercent: 110, autoAlpha: 0 });
        const loopTl = gsap.timeline({ repeat: -1 });
        ROTATOR.forEach((_, k) => {
          const next = (k + 1) % ROTATOR.length;
          loopTl
            .to(rotWords[k], { yPercent: -110, autoAlpha: 0, duration: 0.5, ease: "power3.in" }, k * 2 + 1.6)
            .fromTo(
              rotWords[next],
              { yPercent: 110, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" },
              k * 2 + 1.75,
            );
        });
      }

      // ── Anillo-lente que sigue al cursor (solo pointer fino) ─────────────
      if (lens && window.matchMedia("(pointer: fine)").matches) {
        const sticky = zone.querySelector<HTMLElement>("[data-sticky]");
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        let inside = false;
        const onMove = (e: MouseEvent) => {
          const r = (sticky ?? root).getBoundingClientRect();
          tx = e.clientX - r.left;
          ty = e.clientY - r.top;
        };
        const onEnter = () => {
          inside = true;
          gsap.to(lens, { autoAlpha: 1, duration: 0.4 });
        };
        const onLeave = () => {
          inside = false;
          gsap.to(lens, { autoAlpha: 0, duration: 0.4 });
        };
        const loop = () => {
          if (inside) {
            cx += (tx - cx) * 0.1;
            cy += (ty - cy) * 0.1;
            gsap.set(lens, { x: cx, y: cy });
          }
          raf = requestAnimationFrame(loop);
        };
        root.addEventListener("mousemove", onMove);
        root.addEventListener("mouseenter", onEnter);
        root.addEventListener("mouseleave", onLeave);
        raf = requestAnimationFrame(loop);
        cleanups.push(() => {
          root.removeEventListener("mousemove", onMove);
          root.removeEventListener("mouseenter", onEnter);
          root.removeEventListener("mouseleave", onLeave);
        });
      }
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="mirada"
      className="bg-grain-light relative z-30 -mt-[4svh] overflow-clip rounded-t-[2.5rem] bg-gradient-to-b from-white to-gris-fondo/60 shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.35)]"
      aria-label="Nuestra mirada"
    >
      <div ref={zoneRef} className="relative h-[460svh] motion-reduce:h-auto">
        <div
          data-sticky
          className="sticky top-0 h-[100svh] w-full overflow-hidden motion-reduce:static motion-reduce:h-auto"
        >
          {/* Anillo-lente que sigue al cursor */}
          <span
            data-lens
            aria-hidden="true"
            className="border-verde-concepto/35 pointer-events-none absolute top-0 left-0 z-40 -ml-14 -mt-14 h-28 w-28 rounded-full border-2 opacity-0 shadow-[0_0_40px_-10px_rgb(31_154_120/0.25)]"
          />

          {/* ── PANEL 0: Pensamiento matemático ─────────────────────────── */}
          <div
            data-mirada-panel="0"
            className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
          >
            <span
              aria-hidden="true"
              className="font-display text-azul-principal/[0.05] pointer-events-none absolute top-1/2 right-[4%] -translate-y-1/2 text-[16rem] font-bold select-none md:text-[24rem]"
            >
              01
            </span>
            <span data-bit className="text-gris-texto font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
              Nuestra mirada · Pensamiento matemático
            </span>
            <h2
              data-bit
              className="font-display text-azul-principal mt-6 max-w-[18ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.1rem, 1rem + 4.2vw, 4rem)", lineHeight: 1.08 }}
            >
              La matemática no es <span className="text-gris-texto/60 line-through decoration-2">resolver cuentas</span>.
            </h2>
            <p
              data-bit
              className="font-display text-azul-principal mt-5 font-semibold"
              style={{ fontSize: "clamp(1.4rem, 0.8rem + 2.2vw, 2.4rem)", lineHeight: 1.2 }}
            >
              Es una manera de actuar en el mundo:{" "}
              <span className="relative inline-grid overflow-hidden align-bottom text-left">
                {ROTATOR.map((w, i) => (
                  <span
                    key={w}
                    data-rot-word
                    className={`text-verde-concepto col-start-1 row-start-1 whitespace-nowrap ${i > 0 ? "opacity-0" : ""}`}
                  >
                    {w}.
                  </span>
                ))}
              </span>
            </p>
            <p data-bit className="text-gris-texto mt-7 max-w-[52ch] font-sans text-[1rem] leading-relaxed md:text-[1.1rem]">
              Del jardín de infantes al último año: el contenido curricular es un
              puente para construir habilidades que sirven para la vida — dentro
              y fuera del aula.
            </p>
          </div>

          {/* ── PANEL 1: Empoderamiento ─────────────────────────────────── */}
          <div
            data-mirada-panel="1"
            className="bg-gris-fondo flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
          >
            <span
              aria-hidden="true"
              className="font-display text-azul-principal/[0.05] pointer-events-none absolute top-1/2 left-[2%] -translate-y-1/2 text-[16rem] font-bold select-none md:text-[24rem]"
            >
              02
            </span>
            <span className="text-gris-texto font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
              Nuestra mirada · Empoderamiento
            </span>
            <h2
              className="font-display text-azul-principal mt-6 max-w-[20ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.1rem, 1rem + 4.2vw, 4rem)", lineHeight: 1.1 }}
            >
              El poder no es{" "}
              <span className="relative inline-block whitespace-nowrap">
                sobre otras personas.
                <span
                  data-strike
                  aria-hidden="true"
                  className="bg-azul-medio/70 absolute top-1/2 left-0 h-[0.09em] w-full -translate-y-1/2 rounded-full"
                />
              </span>
              <br />
              Es poder para{" "}
              <span className="relative inline-block">
                <span className="text-verde-concepto">transformar</span>
                <span
                  data-underline
                  aria-hidden="true"
                  className="bg-verde-concepto absolute -bottom-[0.08em] left-0 h-[0.09em] w-full rounded-full"
                />
              </span>
              .
            </h2>
            <p className="text-gris-texto mt-7 max-w-[54ch] font-sans text-[1rem] leading-relaxed md:text-[1.1rem]">
              El concepto viene de la psicología social: devolverle al
              profesorado la convicción de «puedo transformar», construida desde
              el saber matemático y el liderazgo — nunca desde el déficit.
            </p>
          </div>

          {/* ── PANEL 2: Educación como derecho ─────────────────────────── */}
          <div
            data-mirada-panel="2"
            className="flex h-full flex-col items-center justify-center bg-white px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
          >
            <span
              aria-hidden="true"
              className="font-display text-azul-principal/[0.05] pointer-events-none absolute top-1/2 right-[4%] -translate-y-1/2 text-[16rem] font-bold select-none md:text-[24rem]"
            >
              03
            </span>
            <span className="text-gris-texto font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
              Nuestra mirada · Educación como derecho
            </span>
            <h2
              className="font-display text-azul-principal mt-6 max-w-[18ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.1rem, 1rem + 4.2vw, 4rem)", lineHeight: 1.08 }}
            >
              La educación es un <span className="text-verde-concepto">derecho</span>.
            </h2>
            <ul className="mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-3">
              {CHIPS.map((c) => (
                <li
                  key={c}
                  data-chip
                  className="border-azul-principal/15 text-azul-principal hover:border-verde-concepto hover:bg-verde-concepto/5 rounded-full border bg-white px-5 py-2.5 font-sans text-[0.9rem] font-medium transition-colors duration-300"
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-gris-texto mt-8 max-w-[52ch] font-sans text-[1rem] leading-relaxed md:text-[1.1rem]">
              Repensamos la educación desde la práctica, la justicia social y la
              construcción colectiva del conocimiento.
            </p>
            <div data-mirada-cta className="mt-9">
              <ButtonSecondary href="/que-hacemos">Mirá cómo lo hacemos</ButtonSecondary>
            </div>
          </div>

          {/* Indicador de las 3 ideas */}
          <div
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2.5 motion-reduce:hidden"
            aria-hidden="true"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} data-mirada-dot className="bg-azul-principal/18 h-2 w-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
