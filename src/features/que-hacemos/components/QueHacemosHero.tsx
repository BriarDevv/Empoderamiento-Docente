"use client";

import { useRef } from "react";
import gsap from "gsap";
import { PuntosFaro } from "@/components/ui/PuntosFaro";
import { getLenis } from "@/lib/lenis";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// Circunferencia del anillo de carga (r=36 en viewBox 80).
const ANILLO = 2 * Math.PI * 36;

/**
 * Hero de Qué hacemos — misma base de marca que Biblioteca/Novedades (navy a
 * sangre, <PuntosFaro />, glow contenido, titular con remate verde) con el
 * mensaje diferencial de ED como titular: "No formamos. / Transformamos."
 * (palabras de la clienta: "en ED no formamos, se trata de una transformación
 * educativa"). PENDIENTE validar el titular exacto con cliente.
 *
 * Entrada: el haz barre encendiendo los puntos y las dos líneas suben desde
 * su máscara cuando la luz cruza el centro (~0.95s, constantes de PuntosFaro).
 * Sin motion: todo visible y quieto.
 *
 * Portal "mantené apretado" (referencia Noomo, click-and-hold): al pie hay un
 * botón circular; mientras se mantiene apretado, un anillo se carga y una luz
 * verde sube desde abajo (el faro encendiéndose con el gesto). Al completar,
 * pulso de luz y viaje suave hasta la torre (#recorrido). NO es una puerta:
 * scrollear de largo sigue funcionando siempre. Con teclado (Enter/Espacio) o
 * prefers-reduced-motion, el botón salta directo sin exigir el hold.
 */
export function QueHacemosHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const holdRef = useRef<HTMLButtonElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-qh-word]", { yPercent: 115 });
      gsap.set("[data-qh-glow]", { autoAlpha: 0 });
      gsap.set("[data-qh-bola]", { x: -170, y: 170 });
      gsap.set("[data-qh-rise]", { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-qh-word]", { yPercent: 0, duration: 1, stagger: 0.12 }, 0.75)
        .to("[data-qh-glow]", { autoAlpha: 1, duration: 1, ease: "power2.out" }, 1.0)
        .to("[data-qh-bola]", { x: 0, y: 0, duration: 1 }, 0.9)
        .to("[data-qh-rise]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.45);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // ── Portal "mantené apretado" ──────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const btn = holdRef.current;
    const ring = ringRef.current;
    const root = rootRef.current;
    if (!btn || !ring || !root) return;

    const viajar = () => {
      const destino = document.getElementById("recorrido");
      if (!destino) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(destino, { duration: 1.6 });
      else destino.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    };

    // Sin motion: botón común, salta directo.
    if (reduced) {
      btn.addEventListener("click", viajar);
      return () => btn.removeEventListener("click", viajar);
    }

    const holdGlow = root.querySelector<HTMLElement>("[data-qh-holdglow]");
    const prog = { v: 0 };
    let holdTween: gsap.core.Tween | null = null;
    let disparado = false;

    ring.style.strokeDasharray = String(ANILLO);
    const pintar = () => {
      ring.style.strokeDashoffset = String(ANILLO * (1 - prog.v));
      if (holdGlow) holdGlow.style.opacity = String(prog.v * 0.9);
    };
    pintar();

    const encender = () => {
      disparado = true;
      // Flash de luz y viaje; el anillo se descarga mientras viajamos.
      if (holdGlow) {
        gsap.fromTo(
          holdGlow,
          { opacity: 0.9 },
          { opacity: 0, duration: 1.4, ease: "power2.out", delay: 0.15 },
        );
      }
      viajar();
      gsap.to(btn, { scale: 1, duration: 0.3 });
      gsap.to(prog, {
        v: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
        onUpdate: () => ring.style.strokeDashoffset = String(ANILLO * (1 - prog.v)),
        onComplete: () => {
          disparado = false;
        },
      });
    };

    const abajo = (e: PointerEvent) => {
      if (disparado) return;
      btn.setPointerCapture?.(e.pointerId);
      holdTween?.kill();
      holdTween = gsap.to(prog, { v: 1, duration: 1.1, ease: "none", onUpdate: pintar, onComplete: encender });
      gsap.to(btn, { scale: 0.94, duration: 0.25, ease: "power2.out" });
    };
    const soltar = () => {
      if (disparado) return;
      holdTween?.kill();
      holdTween = gsap.to(prog, { v: 0, duration: 0.35, ease: "power2.out", onUpdate: pintar });
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
    };
    // Con teclado el click llega con detail 0: no hay hold posible, va directo.
    const teclado = (e: MouseEvent) => {
      if (e.detail === 0 && !disparado) viajar();
    };

    btn.addEventListener("pointerdown", abajo);
    btn.addEventListener("pointerup", soltar);
    btn.addEventListener("pointercancel", soltar);
    btn.addEventListener("pointerleave", soltar);
    btn.addEventListener("click", teclado);
    return () => {
      holdTween?.kill();
      btn.removeEventListener("pointerdown", abajo);
      btn.removeEventListener("pointerup", soltar);
      btn.removeEventListener("pointercancel", soltar);
      btn.removeEventListener("pointerleave", soltar);
      btn.removeEventListener("click", teclado);
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="bg-azul-principal relative isolate flex min-h-[86svh] flex-col justify-between overflow-hidden rounded-b-[2rem] pt-28 pb-10 text-white md:rounded-b-[2.75rem] md:pt-32"
      aria-label="Qué hacemos"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          data-qh-glow
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 42% at 50% 0%, color-mix(in srgb, var(--color-azul-claro) 24%, transparent), transparent 70%)",
          }}
        />
        <span
          data-qh-bola
          className="bg-azul-medio/25 absolute -bottom-44 -left-36 h-[26rem] w-[26rem] rounded-full"
        />
        {/* Luz que se "carga" con el hold: sube desde el botón, abajo. */}
        <span
          data-qh-holdglow
          className="absolute inset-0 opacity-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 100%, color-mix(in srgb, var(--color-verde-concepto) 26%, transparent), transparent 72%)",
          }}
        />
        <PuntosFaro />
      </div>

      <div className="mx-auto my-auto flex w-full max-w-screen-xl flex-col items-center px-5 text-center md:px-10">
        <h1
          className="font-display font-extrabold tracking-[-0.03em] text-white"
          style={{ fontSize: "clamp(2.75rem, 1.1rem + 7vw, 6.25rem)", lineHeight: 1 }}
        >
          <span className="sr-only">No formamos. Transformamos.</span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span data-qh-word className="block">
              No formamos.
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
            <span data-qh-word className="text-verde-concepto block">
              Transformamos.
            </span>
          </span>
        </h1>

        <p
          data-qh-rise
          className="mt-7 max-w-[56ch] font-sans text-[1.05rem] leading-relaxed text-white/85 md:text-[1.2rem]"
        >
          Generamos escenarios de aprendizaje pensados para cada contexto —
          nunca enlatados — que transforman la relación con la matemática
          escolar.
        </p>
      </div>

      {/* Portal al recorrido: mantener apretado carga el anillo y enciende
          la luz; al completar, viaje suave a la torre. Scrollear sigue
          funcionando siempre — esto es un gesto, no una puerta. */}
      <div
        data-qh-rise
        className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-4 px-5 text-center md:px-10"
      >
        <button
          ref={holdRef}
          type="button"
          aria-label="Entrar al recorrido de lo que hacemos"
          className="focus-visible:outline-verde-concepto relative flex h-24 w-24 touch-none items-center justify-center rounded-full outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
            <circle
              ref={ringRef}
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="var(--color-verde-concepto)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={ANILLO}
              strokeDashoffset={ANILLO}
            />
          </svg>
          <span className="font-mono text-[0.66rem] tracking-[0.18em] text-white/90 uppercase">
            Entrar
          </span>
        </button>
        <span className="font-mono text-[0.7rem] tracking-[0.2em] text-white/45 uppercase">
          Mantené apretado para encender el recorrido
        </span>
      </div>
    </section>
  );
}
