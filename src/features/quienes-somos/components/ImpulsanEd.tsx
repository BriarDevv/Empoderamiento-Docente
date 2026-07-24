"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { DANIELA, porTier, type Persona } from "@/features/quienes-somos/data/equipo";
import { PersonCard } from "@/features/quienes-somos/components/PersonCard";
import { TeamProfileOverlay } from "@/features/quienes-somos/components/TeamProfileOverlay";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Quiénes sostienen ED" — el EQUIPO con JERARQUÍA institucional en 4 niveles,
 * como un PLIEGO EDITORIAL sobre la lámina navy (continuidad con las secciones
 * apiladas). Una card base única (PersonCard) a cuatro escalas:
 *
 *   N1 Dirección General      → Daniela: card ancha, masthead top-left.
 *   N2 Dirección Académica    → Karla: card ancha menor, escalonada abajo-derecha
 *                                (bandas superpuestas + conector → nunca aislada).
 *   N3 Líderes de área/proy.  → fila de 4 cards iguales (misma jerarquía).
 *   N4 Facilitación y diseño  → banda de 6 cards compactas (soporte, no menor).
 *
 * La jerarquía la comunican escala, espacio, orientación, ritmo de aparición y
 * los rótulos — nunca color por persona. Las cards aparecen nivel por nivel con
 * el scroll (transform+opacity, se anima el WRAPPER: la foto nunca se separa).
 * Clic → shell de perfil full-screen (portaleado a body). Reduced-motion: todo
 * legible sin animación.
 */

function KickerRotulo({ children }: { children: React.ReactNode }) {
  return (
    <p
      data-reveal
      className="text-verde-concepto flex items-center gap-3 font-mono text-[0.7rem] font-medium tracking-[0.22em] uppercase"
    >
      <span aria-hidden="true" className="bg-verde-concepto/60 block h-px w-7" />
      {children}
    </p>
  );
}

function RuleRotulo({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal className="flex items-center gap-4">
      <p className="text-verde-concepto shrink-0 font-mono text-[0.7rem] font-medium tracking-[0.22em] uppercase">
        {children}
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-white/12" />
    </div>
  );
}

export function ImpulsanEd() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<{ persona: Persona; el: HTMLElement } | null>(null);

  const lideres = porTier(3);
  const facilitacion = porTier(4);
  const karla = porTier(2)[0];

  const openProfile = (persona: Persona, el: HTMLButtonElement) => {
    setSelected({ persona, el });
  };

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      // Acople de la lámina navy sobre la lámina blanca previa (misma mecánica
      // que el resto de las secciones apiladas).
      const sheet = root.closest("section");
      if (sheet) {
        gsap.fromTo(
          sheet,
          { scale: 0.97, y: 36 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: sheet, start: "top 96%", end: "top 14%", scrub: true },
          },
        );
      }

      // Encabezado en tres tiempos.
      const heads = gsap.utils.toArray<HTMLElement>("[data-team-head]");
      // opacity (no autoAlpha): NO usamos visibility:hidden, así el contenido
      // sigue en el árbol de accesibilidad y es enfocable aunque no se haya
      // revelado todavía. El fallback de focusin (abajo) garantiza que también
      // sea visible para quien navega con teclado.
      gsap.set(heads, { opacity: 0, y: 24 });
      gsap.to(heads, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      // Aparición por nivel: se anima el WRAPPER de cada card (la foto es hija
      // inset-0, nunca se separa). transform+opacity, once, ritmo por nivel.
      gsap.utils.toArray<HTMLElement>("[data-team-group]").forEach((grupo) => {
        const items = gsap.utils.toArray<HTMLElement>(grupo.querySelectorAll("[data-reveal]"));
        if (!items.length) return;
        const y = Number(grupo.dataset.revealY ?? 28);
        const dur = Number(grupo.dataset.revealDur ?? 0.6);
        const stg = Number(grupo.dataset.revealStagger ?? 0.1);
        gsap.set(items, { opacity: 0, y });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: dur,
          stagger: stg,
          ease: "power3.out",
          scrollTrigger: { trigger: grupo, start: "top 82%", once: true },
        });
      });
    }, root);

    // Revela lo que ya esté en viewport al montar (p. ej. recarga con la página
    // scrolleada): nunca queda oculto por no haber scrolleado.
    ScrollTrigger.refresh();

    // Fallback de teclado: si el foco entra a la sección antes de que el scroll
    // revele, mostramos todo de una — el contenido no depende del movimiento.
    const revealAll = () => {
      gsap.to(gsap.utils.toArray<HTMLElement>("[data-team-head], [data-reveal]"), {
        opacity: 1,
        y: 0,
        duration: 0.3,
        overwrite: true,
      });
    };
    root.addEventListener("focusin", revealAll, { once: true });

    return () => {
      root.removeEventListener("focusin", revealAll);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      aria-label="Quiénes sostienen ED — el equipo"
      className="bg-azul-principal relative z-[45] -mt-[4svh] overflow-clip rounded-t-[2.5rem] text-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.45)]"
    >
      {/* Textura de puntos de marca */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle,#fff_1.1px,transparent_1.6px)] [background-size:24px_24px]"
      />

      <div ref={rootRef} className="relative z-10 mx-auto max-w-screen-xl px-5 py-24 md:px-10 md:py-28">
        {/* ── Encabezado ─────────────────────────────────────────────────── */}
        <div className="max-w-2xl">
          <span data-team-head className="text-azul-claro/80 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
            Quiénes sostienen ED
          </span>
          <h3
            data-team-head
            className="font-display mt-5 font-bold tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(1.9rem, 0.9rem + 2.9vw, 3rem)", lineHeight: 1.08 }}
          >
            La red tiene <span className="text-verde-concepto">nombres</span>.
          </h3>
          <p data-team-head className="text-azul-claro/80 mt-4 max-w-[54ch] font-sans text-[1rem] leading-relaxed">
            Una red de especialistas, trayectorias y experiencias que hace
            posible el trabajo de ED.
          </p>
        </div>

        {/* ── Masthead: N1 Daniela + N2 Karla, dos retratos escalonados ──── */}
        <div
          data-team-group
          data-reveal-y="34"
          data-reveal-dur="0.85"
          data-reveal-stagger="0.18"
          className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8"
        >
          {/* N1 — Dirección General (retrato grande, arriba-izquierda) */}
          <div className="lg:col-span-5">
            <KickerRotulo>Dirección general</KickerRotulo>
            <div data-reveal className="mt-4">
              <PersonCard persona={DANIELA} onOpen={openProfile} />
            </div>
          </div>

          {/* N2 — Dirección Académica (retrato menor, abajo-derecha, escalonado) */}
          <div className="lg:col-span-4 lg:col-start-9 lg:mt-[9rem] lg:self-start">
            <KickerRotulo>Dirección académica</KickerRotulo>
            <div data-reveal className="mt-4">
              {karla && <PersonCard persona={karla} onOpen={openProfile} />}
            </div>
          </div>

          {/* Conector verde discreto entre las dos direcciones (solo desktop) */}
          <span
            aria-hidden="true"
            className="via-verde-concepto/40 absolute top-[56%] left-[43%] hidden h-px w-[15%] -rotate-[18deg] bg-gradient-to-r from-transparent to-transparent lg:block"
          />
        </div>

        {/* ── N3 — Líderes de área y proyecto: 4 iguales ─────────────────── */}
        <div
          data-team-group
          data-reveal-y="28"
          data-reveal-dur="0.6"
          data-reveal-stagger="0.1"
          className="mt-24"
        >
          <RuleRotulo>Líderes de área y proyecto</RuleRotulo>
          <ul className="mt-6 grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4">
            {lideres.map((persona) => (
              <li key={persona.key} data-reveal>
                <PersonCard persona={persona} onOpen={openProfile} />
              </li>
            ))}
          </ul>
        </div>

        {/* ── N4 — Facilitación y diseño de materiales: 6 compactas ──────── */}
        <div
          data-team-group
          data-reveal-y="22"
          data-reveal-dur="0.5"
          data-reveal-stagger="0.07"
          className="mt-16"
        >
          <RuleRotulo>Facilitación y diseño de materiales</RuleRotulo>
          <ul className="mt-6 grid grid-cols-3 gap-4 md:gap-5 lg:grid-cols-6">
            {facilitacion.map((persona) => (
              <li key={persona.key} data-reveal>
                <PersonCard persona={persona} onOpen={openProfile} />
              </li>
            ))}
          </ul>
        </div>

        {/* Pendientes de foto del cliente: Andrea Vergara (Pensamiento
            Estadístico, Chile) y Luis López (Pensamiento Aritmético y
            Algebraico, Costa Rica) — sumar cuando lleguen. */}

        {/* ── Cierre: respiración final + nodo (la red se resuelve en un
            punto), sin CTA inventado. Deja continuidad con la sección
            siguiente, que acopla su lámina clara por encima. ─────────────── */}
        <div className="mt-24 flex flex-col items-center">
          <span
            aria-hidden="true"
            className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/18 to-transparent"
          />
          <span
            aria-hidden="true"
            className="bg-verde-concepto mt-[-5px] block h-2.5 w-2.5 rounded-full shadow-[0_0_0_6px_rgb(31_154_120/0.16)]"
          />
        </div>
      </div>

      {/* ── Shell de perfil full-screen (reemplaza el modal roto) ────────── */}
      {selected && (
        <TeamProfileOverlay
          persona={selected.persona}
          originEl={selected.el}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
