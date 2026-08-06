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
 * Hero de Investigación (sitemap pág. 04 · APERTURA: "Investigar para
 * transformar"). Editorial + una firma propia detrás: LA RED DE EVIDENCIA.
 *
 * El fondo es un campo de datos dispersos (observaciones, registros, papers)
 * que en la entrada SE CONECTAN con líneas que se dibujan solas — la metáfora
 * literal de investigar: del dato suelto al conocimiento construido. Unos
 * pocos nodos verdes son los "hallazgos". La red deriva despacio y hace
 * parallax con el mouse; el titular editorial va por encima, protagonista.
 * "transformar" se enciende en verde con un subrayado que se traza.
 *
 * Sin JS / prefers-reduced-motion: red visible ya conectada, titular y copy
 * legibles, subrayado puesto.
 */

// ── Red de evidencia (determinista, para no depender de Math.random) ────────
const VB = { w: 1200, h: 760 };
const NODOS = Array.from({ length: 26 }, (_, i) => {
  const col = i % 6;
  const row = Math.floor(i / 6);
  const jx = Math.sin(i * 2.3) * 62;
  const jy = Math.cos(i * 1.7) * 52;
  return {
    x: 110 + col * 196 + jx,
    y: 95 + row * 190 + jy,
    verde: i % 8 === 3, // ~3 hallazgos
  };
});
// Aristas: cada nodo con sus 2 vecinos más cercanos (dedup por par ordenado).
const ARISTAS = (() => {
  const set = new Set<string>();
  const out: Array<{ a: number; b: number }> = [];
  NODOS.forEach((n, i) => {
    const dist = NODOS.map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    dist.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!set.has(key)) {
        set.add(key);
        out.push({ a: i, b: j });
      }
    });
  });
  return out;
})();

export function InvestigacionHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    let raf = 0;
    let removeMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const nodos = gsap.utils.toArray<SVGCircleElement>("[data-ev-nodo]");
      const aristas = gsap.utils.toArray<SVGLineElement>("[data-ev-arista]");
      const verdes = gsap.utils.toArray<SVGCircleElement>("[data-ev-verde]");
      const red = root.querySelector<SVGGElement>("[data-ev-red]");
      const foot = gsap.utils.toArray<HTMLElement>("[data-hero-foot]");

      // ── Estados iniciales ────────────────────────────────────────────────
      gsap.set(nodos, { scale: 0, transformOrigin: "center", transformBox: "fill-box" });
      aristas.forEach((l) => {
        const len = l.getTotalLength();
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(foot, { autoAlpha: 0, y: 20 });

      // ── Entrada: la evidencia aparece y se conecta ───────────────────────
      const tl = gsap.timeline({ delay: 0.4, defaults: { ease: "power3.out" } });
      // 1 — los datos aparecen dispersos
      tl.to(nodos, { scale: 1, duration: 0.6, ease: "back.out(2)", stagger: { each: 0.02, from: "random" } }, 0);
      // 2 — se dibujan las conexiones (se construye el conocimiento)
      tl.to(aristas, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.03 }, 0.35);
      // 3 — los hallazgos (verdes) laten
      tl.to(verdes, { attr: { r: 8 }, duration: 0.4, ease: "back.out(3)", stagger: 0.1 }, 0.9);
      // 4 — pie (bajada + CTAs)
      tl.to(foot, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12 }, 1.0);

      // latido perpetuo de los hallazgos verdes
      verdes.forEach((v, i) => {
        gsap.to(v, {
          attr: { r: 5.5 },
          duration: 1.8 + (i % 3) * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4 + i * 0.2,
        });
      });

      // ── Salida con el scroll: el contenido se eleva y funde ──────────────
      const scrollWrap = root.querySelector<HTMLElement>("[data-hero-scroll]");
      if (scrollWrap) {
        gsap.to(scrollWrap, {
          yPercent: -10,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "80% top", scrub: true },
        });
      }

      // ── Deriva + parallax de la red con el mouse (pointer fino) ───────────
      if (red && window.matchMedia("(pointer: fine)").matches) {
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        const onMove = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const loop = () => {
          cx += (tx - cx) * 0.04;
          cy += (ty - cy) * 0.04;
          gsap.set(red, { xPercent: cx * 2.2, yPercent: cy * 1.8 });
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
      className="relative isolate flex min-h-[92svh] flex-col justify-between overflow-hidden bg-gradient-to-b from-white via-white to-gris-fondo/50 px-6 pt-32 pb-12 md:px-12 md:pb-16"
      aria-label="Investigación"
    >
      {/* ── Red de evidencia (fondo a sangre) ──────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-70">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          {/* velo claro para que el titular respire sobre la red */}
          <g data-ev-red>
            {ARISTAS.map(({ a, b }, i) => (
              <line
                key={i}
                data-ev-arista
                x1={NODOS[a].x}
                y1={NODOS[a].y}
                x2={NODOS[b].x}
                y2={NODOS[b].y}
                stroke="#a9c5e8"
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            ))}
            {NODOS.map((n, i) =>
              n.verde ? (
                <circle key={i} data-ev-nodo data-ev-verde cx={n.x} cy={n.y} r="5.5" fill="#1f9a78" />
              ) : (
                <circle key={i} data-ev-nodo cx={n.x} cy={n.y} r="3.4" fill="#4a6fa5" fillOpacity="0.85" />
              ),
            )}
          </g>
        </svg>
      </div>

      {/* Difuminado radial suave detrás del titular (legibilidad) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-0 z-[1] h-[26rem] w-[46rem] -translate-y-1/2 bg-[radial-gradient(60%_60%_at_30%_50%,rgb(255_255_255/0.85)_0%,transparent_75%)]"
      />

      {/* ── Titular editorial (arriba) ─────────────────────────────────────── */}
      <div data-hero-scroll className="relative z-10 mx-auto w-full max-w-screen-xl">
        <Eyebrow>Investigación</Eyebrow>

        <RevealLines
          as="h1"
          className="font-display text-azul-principal mt-6 max-w-[15ch] font-extrabold tracking-[-0.025em]"
          style={{ fontSize: "clamp(2.8rem, 0.8rem + 7vw, 7rem)", lineHeight: 0.98 }}
        >
          Investigar para{" "}
          <span className="text-verde-concepto">transformar.</span>
        </RevealLines>
      </div>

      {/* ── Pie: bajada + CTAs (izq) · scroll-hint (der) ───────────────────── */}
      <div className="relative z-10 mx-auto flex w-full max-w-screen-xl flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-end">
        <div data-hero-foot className="max-w-[44ch]">
          <p className="text-gris-texto font-sans text-[1.05rem] leading-relaxed md:text-[1.15rem]">
            Producimos conocimiento propio sobre la matemática escolar y lo
            devolvemos al aula. Investigamos, diseñamos, implementamos y
            volvemos a investigar: un ciclo que no se detiene.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <ButtonSecondary href="#lineas">Ver las líneas</ButtonSecondary>
            <ButtonSecondary href="/biblioteca">Ir a la Biblioteca</ButtonSecondary>
          </div>
        </div>

        <div data-hero-foot className="text-gris-texto flex items-center gap-3">
          <span className="font-mono text-xs tracking-[0.14em] uppercase">
            Del dato al conocimiento
          </span>
        </div>
      </div>
    </section>
  );
}
