"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RevealLines } from "@/components/ui/RevealLines";
import { ArrowUpRight } from "@/components/ui/icons";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Líneas de investigación" (sitemap pág. 04, sección 3 · TEMAS). Índice
 * editorial de las 7 líneas de ED (modelo conceptual oficial), numeradas
 * 01–07. Cada fila entra en cascada por scroll y reacciona al hover: el
 * número vira a verde, la fila se corre y aparece la descripción con una
 * flecha. Fondo claro (contrasta con la lámina navy anterior).
 *
 * id="lineas": ancla del CTA "Ver las líneas" del hero.
 * Descripciones: síntesis propia de cada línea a partir del modelo — VALIDAR
 * el fraseo con el cliente.
 *
 * Sin JS / prefers-reduced-motion: lista completa y legible.
 */

const LINEAS = [
  {
    t: "Resignificación del conocimiento matemático escolar",
    d: "Cambiar la comprensión, los usos y la relación con el saber matemático.",
  },
  {
    t: "Problematización de la matemática escolar",
    d: "Poner en cuestión lo dado para volver a construirlo con sentido.",
  },
  {
    t: "Tareas disruptivas y matemática funcional",
    d: "Situaciones que rompen la rutina y le devuelven el uso a la matemática.",
  },
  {
    t: "Desarrollo del pensamiento matemático",
    d: "Lo algebraico, lo geométrico y lo numérico, trabajados en profundidad.",
  },
  {
    t: "Desarrollo profesional docente sostenido",
    d: "Acompañamiento que dura en el tiempo, no un curso que empieza y termina.",
  },
  {
    t: "Relación con el conocimiento y empoderamiento docente",
    d: "Cómo cada docente se para frente al saber que enseña.",
  },
  {
    t: "Evaluación e impacto en aprendizajes",
    d: "Evidencia de que la transformación efectivamente llega al aula.",
  },
] as const;

export function LineasInvestigacion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      const filas = gsap.utils.toArray<HTMLElement>("[data-linea]");
      filas.forEach((f) => {
        gsap.fromTo(
          f,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: f, start: "top 88%" },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="lineas"
      className="relative scroll-mt-24 bg-white"
      aria-label="Líneas de investigación"
    >
      <div className="mx-auto w-full max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
        <div className="md:grid md:grid-cols-12 md:gap-x-8">
          <div className="md:col-span-5">
            <Eyebrow>Líneas de investigación</Eyebrow>
            <RevealLines
              as="h2"
              className="font-display text-azul-principal mt-6 max-w-[14ch] font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2rem, 1rem + 3vw, 3.4rem)", lineHeight: 1.08 }}
            >
              Siete líneas, un mismo objeto.
            </RevealLines>
            <p className="text-gris-texto mt-6 max-w-[40ch] font-sans text-[1.02rem] leading-relaxed">
              Los grandes temas que estudia ED. Todos giran alrededor de una
              pregunta: cómo se transforma la relación con la matemática
              escolar.
            </p>
          </div>

          {/* Índice de las 7 líneas */}
          <ul className="mt-14 md:col-span-7 md:mt-0">
            {LINEAS.map((l, i) => (
              <li
                key={l.t}
                data-linea
                className="group border-azul-claro/40 border-t last:border-b"
              >
                <div className="flex items-start gap-5 py-6 transition-transform duration-300 ease-out group-hover:translate-x-2">
                  <span className="font-mono text-verde-concepto/80 group-hover:text-verde-concepto mt-1 shrink-0 text-[0.8rem] font-medium tabular-nums transition-colors">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-azul-principal text-[1.15rem] leading-snug font-semibold tracking-[-0.01em] md:text-[1.3rem]">
                      {l.t}
                    </h3>
                    <p className="text-gris-texto mt-1.5 max-w-[52ch] font-sans text-[0.95rem] leading-relaxed">
                      {l.d}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-azul-claro group-hover:text-verde-concepto mt-1 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 md:pl-[calc(41.66%+2rem)]">
          <a
            href="#en-accion"
            className="group text-azul-principal hover:text-verde-concepto inline-flex items-center gap-2 font-sans text-[0.95rem] font-medium transition-colors"
          >
            Verlas en acción
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
