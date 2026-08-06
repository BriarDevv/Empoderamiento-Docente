"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hero de Investigación (sitemap pág. 04 · APERTURA "Investigar para
 * transformar"). Editorial a la izquierda + LA CURVA DEL CONOCIMIENTO a la
 * derecha: una función que asciende sobre una grilla, con el área bajo la
 * curva rellenándose, puntos de datos que aparecen al paso de la línea e
 * hitos verdes que laten. Es la investigación hecha gráfico — evidencia que
 * se acumula y se vuelve conocimiento. La curva se dibuja en la entrada y hace
 * parallax con el mouse; el titular manda con "transformar" en verde.
 *
 * Sin JS / prefers-reduced-motion: curva y puntos visibles en su lugar,
 * titular y copy legibles.
 */

const VB = { w: 620, h: 480 };
// Curva ascendente (bezier). base en y=430; sube a la derecha.
const CURVE = "M 30 428 C 150 420 230 398 310 336 C 388 276 452 150 590 58";
const AREA = `${CURVE} L 590 452 L 30 452 Z`;
// Puntos de datos sobre la curva, por fracción de longitud. hito = verde+halo.
const PUNTOS = [
  { f: 0.12, hito: false },
  { f: 0.3, hito: false },
  { f: 0.46, hito: true },
  { f: 0.62, hito: false },
  { f: 0.8, hito: true },
  { f: 0.95, hito: false },
];

export function InvestigacionHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // ── Posicionar los puntos EXACTO sobre la curva (siempre, aun en reduced) ─
    const curve = root.querySelector<SVGPathElement>("[data-curve]");
    const puntos = gsap.utils.toArray<SVGGElement>("[data-punto]");
    if (curve) {
      const len = curve.getTotalLength();
      puntos.forEach((g, i) => {
        const p = curve.getPointAtLength(len * PUNTOS[i].f);
        g.querySelectorAll("circle").forEach((c) => {
          c.setAttribute("cx", `${p.x}`);
          c.setAttribute("cy", `${p.y}`);
        });
      });
    }

    if (reduced) return;

    let raf = 0;
    let removeMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const grid = gsap.utils.toArray<SVGElement>("[data-grid-line]");
      const areaClip = root.querySelector<SVGRectElement>("[data-area-clip]");
      const hitos = gsap.utils.toArray<SVGCircleElement>("[data-hito-halo]");
      const dots = gsap.utils.toArray<SVGGElement>("[data-punto]");
      const foot = gsap.utils.toArray<HTMLElement>("[data-hero-foot]");
      const plot = root.querySelector<HTMLElement>("[data-plot]");

      const len = curve ? curve.getTotalLength() : 0;

      // estados iniciales
      gsap.set(grid, { autoAlpha: 0 });
      if (curve) gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len });
      if (areaClip) gsap.set(areaClip, { attr: { width: 0 } });
      gsap.set(dots, { autoAlpha: 0, scale: 0, transformOrigin: "center", transformBox: "fill-box" });
      gsap.set(foot, { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({ delay: 0.4, defaults: { ease: "power3.out" } });
      // 1 — la grilla aparece
      tl.to(grid, { autoAlpha: 1, duration: 0.6, stagger: 0.02 }, 0);
      // 2 — la curva se traza y el área se rellena en simultáneo (izq→der)
      if (curve) tl.to(curve, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0.25);
      if (areaClip) tl.to(areaClip, { attr: { width: VB.w }, duration: 1.5, ease: "power2.inOut" }, 0.25);
      // 3 — los puntos aparecen al paso de la línea (delay ~ su fracción)
      dots.forEach((g, i) => {
        tl.to(g, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2.5)" }, 0.25 + PUNTOS[i].f * 1.5);
      });
      // 4 — pie
      tl.to(foot, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 1.1);

      // latido perpetuo de los hitos verdes
      hitos.forEach((h, i) => {
        gsap.to(h, {
          attr: { r: 18 },
          autoAlpha: 0,
          duration: 1.8 + (i % 2) * 0.5,
          ease: "sine.out",
          repeat: -1,
          delay: 1.8 + i * 0.3,
        });
      });

      // salida con el scroll
      const scrollWrap = root.querySelector<HTMLElement>("[data-hero-scroll]");
      if (scrollWrap) {
        gsap.to(scrollWrap, {
          yPercent: -10,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "80% top", scrub: true },
        });
      }

      // parallax de la curva con el mouse
      if (plot && window.matchMedia("(pointer: fine)").matches) {
        let tx = 0, ty = 0, cx = 0, cy = 0;
        const onMove = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const loop = () => {
          cx += (tx - cx) * 0.05;
          cy += (ty - cy) * 0.05;
          gsap.set(plot, { xPercent: cx * 2.5, yPercent: cy * 2, rotateY: cx * 4, rotateX: -cy * 3, transformPerspective: 1000 });
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

  const gridV = Array.from({ length: 6 }, (_, i) => 30 + i * 112);
  const gridH = Array.from({ length: 5 }, (_, i) => 60 + i * 98);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-gradient-to-b from-white via-white to-gris-fondo/50"
      aria-label="Investigación"
    >
      <div
        data-hero-scroll
        className="relative z-10 mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-10 px-5 pt-32 pb-20 md:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-8"
      >
        {/* ── Copy ─────────────────────────────────────────────────────────── */}
        <div>
          <Eyebrow>Investigación</Eyebrow>
          <RevealLines
            as="h1"
            className="font-display text-azul-principal mt-6 max-w-[13ch] font-extrabold tracking-[-0.025em]"
            style={{ fontSize: "clamp(2.7rem, 1rem + 5.4vw, 5.4rem)", lineHeight: 0.98 }}
          >
            Investigar para{" "}
            <span className="text-verde-concepto">transformar.</span>
          </RevealLines>

          <p
            data-hero-foot
            className="text-gris-texto mt-7 max-w-[44ch] font-sans text-[1.05rem] leading-relaxed md:text-[1.15rem]"
          >
            Producimos conocimiento propio sobre la matemática escolar y lo
            devolvemos al aula. La evidencia se acumula, se analiza y se vuelve
            un saber que transforma.
          </p>

          <div data-hero-foot className="mt-9 flex flex-wrap gap-4">
            <ButtonSecondary href="#lineas">Ver las líneas</ButtonSecondary>
            <ButtonSecondary href="/biblioteca">Ir a la Biblioteca</ButtonSecondary>
          </div>
        </div>

        {/* ── La curva del conocimiento ────────────────────────────────────── */}
        <div className="relative">
          <div data-plot className="will-change-transform [transform-style:preserve-3d]">
            <svg
              viewBox={`0 0 ${VB.w} ${VB.h}`}
              className="h-full w-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="inv-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1f9a78" stopOpacity="0.28" />
                  <stop offset="1" stopColor="#1f9a78" stopOpacity="0" />
                </linearGradient>
                <clipPath id="inv-area-clip">
                  <rect data-area-clip x="0" y="0" width={VB.w} height={VB.h} />
                </clipPath>
              </defs>

              {/* Grilla */}
              {gridV.map((x, i) => (
                <line data-grid-line key={`v${i}`} x1={x} y1="40" x2={x} y2="452" stroke="#a9c5e8" strokeWidth="1" strokeOpacity="0.35" />
              ))}
              {gridH.map((y, i) => (
                <line data-grid-line key={`h${i}`} x1="30" y1={y} x2="600" y2={y} stroke="#a9c5e8" strokeWidth="1" strokeOpacity="0.35" />
              ))}
              {/* eje base */}
              <line data-grid-line x1="30" y1="452" x2="600" y2="452" stroke="#4a6fa5" strokeWidth="1.5" strokeOpacity="0.5" />

              {/* Área bajo la curva (revelada por el clip que se expande) */}
              <path d={AREA} fill="url(#inv-area)" clipPath="url(#inv-area-clip)" />

              {/* La curva */}
              <path
                data-curve
                d={CURVE}
                fill="none"
                stroke="#1f9a78"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Puntos de datos (posicionados sobre la curva en runtime) */}
              {PUNTOS.map((p, i) => (
                <g data-punto key={i}>
                  {p.hito && <circle data-hito-halo r="6" fill="rgb(31 154 120 / 0.22)" />}
                  <circle r={p.hito ? "7" : "5"} fill={p.hito ? "#1f9a78" : "#ffffff"} stroke={p.hito ? "#ffffff" : "#1f9a78"} strokeWidth="2" />
                </g>
              ))}

              {/* etiquetas de ejes, sutiles */}
              <text x="30" y="474" fontSize="11" fill="#6b7280" className="font-mono">investigación</text>
              <text x="600" y="34" fontSize="11" fill="#1f9a78" textAnchor="end" fontWeight="600" className="font-mono">conocimiento</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
