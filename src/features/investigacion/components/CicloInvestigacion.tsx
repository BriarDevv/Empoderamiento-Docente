"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Ciclo de investigación aplicada" (sitemap pág. 04, sección 4 · MÉTODO).
 * Lámina navy CLAVADA (sticky) donde el scroll RECORRE el ciclo de ED: un
 * punto de luz avanza por el anillo y va encendiendo las 4 fases una por una,
 * la problematización pulsa en el centro (motor), y a la derecha el panel de
 * la fase activa se renueva. Al final el punto vuelve al inicio: el ciclo se
 * reinicia. Todo atado al scroll (scrub) + tilt con el mouse.
 *
 * Contenido: Ciclo de Desarrollo Profesional Docente (modelo conceptual).
 * Reduced-motion / sin JS: las 4 fases y el motor quedan en flujo, legibles.
 */

const CX = 250;
const CY = 250;
const R = 168;

const FASES = [
  {
    n: "01",
    t: "Fase experiencial",
    sub: "«Vivir para hacer vivir»",
    d: "Los docentes vivencian tareas disruptivas que problematizan la matemática escolar.",
    ang: -90,
  },
  {
    n: "02",
    t: "Implementación en aula",
    sub: "Del taller a la clase",
    d: "Diseñan e implementan situaciones de aprendizaje con sus estudiantes.",
    ang: 0,
  },
  {
    n: "03",
    t: "Práctica reflexiva",
    sub: "Mirar lo que pasó",
    d: "Análisis colectivo de las experiencias, los argumentos y las evidencias de aprendizaje.",
    ang: 90,
  },
  {
    n: "04",
    t: "Resignificación del cme",
    sub: "Otra relación con el saber",
    d: "Cambios en la comprensión del conocimiento, en sus usos y en la relación con la matemática escolar.",
    ang: 180,
  },
] as const;

const pos = (ang: number, radius = R) => {
  const a = (ang * Math.PI) / 180;
  return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius };
};

export function CicloInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    let raf = 0;
    let removeMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // acople de la lámina sobre la sección anterior
      gsap.set(root, { transformOrigin: "50% 0%" });
      gsap.fromTo(
        root,
        { scale: 0.955, y: 44 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 30%", scrub: true },
        },
      );

      const zone = root.querySelector<HTMLElement>("[data-ciclo-zone]");
      const ringDraw = root.querySelector<SVGCircleElement>("[data-ring-draw]");
      const comet = root.querySelector<SVGGElement>("[data-comet]");
      const nodes = gsap.utils.toArray<SVGGElement>("[data-fase-node]");
      const paneles = gsap.utils.toArray<HTMLElement>("[data-panel]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-prog-dot]");
      const corePulse = root.querySelector<SVGCircleElement>("[data-core-pulse]");
      const tiltable = root.querySelector<HTMLElement>("[data-ciclo-tilt]");
      if (!zone || !comet || nodes.length !== 4 || paneles.length !== 4) return;

      // anillo listo para dibujarse
      let ringLen = 0;
      if (ringDraw) {
        ringLen = ringDraw.getTotalLength();
        gsap.set(ringDraw, { strokeDasharray: ringLen, strokeDashoffset: ringLen });
      }
      // estado base: paneles ocultos salvo el primero; nodos apagados
      gsap.set(paneles, { autoAlpha: 0, y: 24 });
      gsap.set(paneles[0], { autoAlpha: 1, y: 0 });
      dots.forEach((d, i) => gsap.set(d, { scale: i === 0 ? 1 : 0.5, opacity: i === 0 ? 1 : 0.35 }));

      const setNodo = (i: number, on: boolean) => {
        const halo = nodes[i].querySelector<SVGCircleElement>("[data-node-halo]");
        const dot = nodes[i].querySelector<SVGCircleElement>("[data-node-dot]");
        const num = nodes[i].querySelector<SVGTextElement>("[data-node-num]");
        gsap.to(halo, { attr: { r: on ? 30 : 0 }, duration: 0.4, overwrite: "auto" });
        gsap.to(dot, { attr: { r: on ? 15 : 9 }, fill: on ? "#1f9a78" : "#33507f", duration: 0.4, overwrite: "auto" });
        gsap.to(num, { fill: on ? "#ffffff" : "#a9c5e8", duration: 0.4, overwrite: "auto" });
      };
      nodes.forEach((_, i) => setNodo(i, false));

      let activa = -1;
      const activar = (i: number) => {
        if (i === activa) return;
        activa = i;
        nodes.forEach((_, k) => setNodo(k, k === i));
        paneles.forEach((p, k) => gsap.to(p, { autoAlpha: k === i ? 1 : 0, y: k === i ? 0 : (k < i ? -18 : 18), duration: 0.45, overwrite: "auto" }));
        dots.forEach((d, k) => gsap.to(d, { scale: k === i ? 1 : 0.5, opacity: k === i ? 1 : 0.35, duration: 0.35, overwrite: "auto" }));
      };

      // ── El scroll RECORRE el ciclo (sticky + scrub) ──────────────────────
      ScrollTrigger.create({
        trigger: zone,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          // 0–0.12: se dibuja el anillo. 0.12–1: el cometa recorre + fases.
          if (ringDraw) gsap.set(ringDraw, { strokeDashoffset: ringLen * (1 - Math.min(1, p / 0.12)) });

          const t = Math.max(0, (p - 0.12) / 0.88); // 0→1 sobre el recorrido
          const ang = -90 + t * 360; // una vuelta completa
          const cp = pos(ang);
          gsap.set(comet, { x: cp.x - CX, y: cp.y - CY });

          // fase activa por tramos (4 tramos de igual tamaño)
          const idx = Math.min(3, Math.floor(t * 3.999));
          activar(idx);
        },
      });

      // núcleo late
      if (corePulse) {
        gsap.to(corePulse, {
          attr: { r: 64 },
          autoAlpha: 0,
          duration: 2.4,
          ease: "sine.out",
          repeat: -1,
        });
      }

      // tilt del conjunto con el mouse
      if (tiltable && window.matchMedia("(pointer: fine)").matches) {
        let tx = 0, ty = 0, cx = 0, cy = 0;
        const onMove = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const loop = () => {
          cx += (tx - cx) * 0.05;
          cy += (ty - cy) * 0.05;
          gsap.set(tiltable, { rotateY: cx * 6, rotateX: -cy * 6, transformPerspective: 1000 });
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
      className="bg-azul-principal relative z-30 -mt-[5svh] rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
      aria-label="Ciclo de investigación aplicada"
    >
      {/* Zona alta = recorrido del scroll. Adentro, la escena clavada. */}
      <div data-ciclo-zone className="relative h-[420svh] motion-reduce:h-auto">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(31_154_120/0.12)_0%,transparent_65%)]"
          />

          <div className="relative mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-8 px-5 md:px-10 lg:grid-cols-2">
            {/* Ciclo (SVG) */}
            <div data-ciclo-tilt className="order-2 will-change-transform [transform-style:preserve-3d] lg:order-1">
              <svg viewBox="0 0 500 500" className="mx-auto w-full max-w-[30rem] overflow-visible" aria-hidden="true">
                {/* anillo base + anillo que se dibuja */}
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#33507f" strokeWidth="1.5" strokeDasharray="2 8" />
                <circle
                  data-ring-draw
                  cx={CX}
                  cy={CY}
                  r={R}
                  fill="none"
                  stroke="#1f9a78"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* núcleo: la problematización */}
                <circle data-core-pulse cx={CX} cy={CY} r="48" fill="none" stroke="#1f9a78" strokeWidth="1.5" />
                <circle cx={CX} cy={CY} r="48" fill="#16223c" stroke="#1f9a78" strokeWidth="1.5" />
                <text x={CX} y={CY - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" className="font-display">
                  problematizar
                </text>
                <text x={CX} y={CY + 11} textAnchor="middle" fontSize="9" fill="#a9c5e8" className="font-sans">
                  la matemática
                </text>
                <text x={CX} y={CY + 23} textAnchor="middle" fontSize="9" fill="#a9c5e8" className="font-sans">
                  escolar
                </text>

                {/* punto de luz que recorre el ciclo */}
                <g data-comet>
                  <circle cx={pos(-90).x} cy={pos(-90).y} r="20" fill="#1f9a78" opacity="0.2" />
                  <circle cx={pos(-90).x} cy={pos(-90).y} r="6" fill="#5fe0b8" />
                </g>

                {/* las 4 fases */}
                {FASES.map((f) => {
                  const p = pos(f.ang);
                  return (
                    <g data-fase-node key={f.n}>
                      <circle data-node-halo cx={p.x} cy={p.y} r="0" fill="rgb(31 154 120 / 0.18)" />
                      <circle data-node-dot cx={p.x} cy={p.y} r="9" fill="#33507f" />
                      <text data-node-num x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#a9c5e8" className="font-mono">
                        {f.n}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Copy + panel de la fase activa */}
            <div className="order-1 lg:order-2">
              <Eyebrow variant="light">Ciclo de investigación aplicada</Eyebrow>
              <h2
                className="font-display mt-5 max-w-[16ch] font-bold tracking-[-0.02em]"
                style={{ fontSize: "clamp(1.9rem, 1rem + 2.6vw, 3.2rem)", lineHeight: 1.08 }}
              >
                De la investigación a la acción.
              </h2>

              {/* Paneles apilados: el de la fase activa se muestra */}
              <div className="relative mt-8 h-[13rem] md:h-[12rem]">
                {FASES.map((f) => (
                  <div data-panel key={f.n} className="absolute inset-0">
                    <span className="font-mono text-verde-concepto text-[0.8rem] font-medium tabular-nums">
                      Fase {f.n}
                    </span>
                    <h3 className="font-display mt-2 text-[1.5rem] leading-tight font-bold md:text-[1.9rem]">
                      {f.t}
                    </h3>
                    <p className="text-verde-concepto/90 mt-1 font-sans text-[0.95rem] font-medium italic">
                      {f.sub}
                    </p>
                    <p className="text-azul-claro mt-3 max-w-[42ch] font-sans text-[1rem] leading-relaxed">
                      {f.d}
                    </p>
                  </div>
                ))}
              </div>

              {/* indicador de progreso 4 dots */}
              <div className="mt-8 flex items-center gap-2.5">
                {FASES.map((f) => (
                  <span key={f.n} data-prog-dot className="bg-verde-concepto block h-2 w-2 rounded-full" />
                ))}
                <span className="text-azul-claro/70 ml-3 flex items-center gap-2 font-sans text-[0.9rem]">
                  <span className="text-verde-concepto text-[1.1rem]">↺</span>
                  y el ciclo vuelve a empezar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
