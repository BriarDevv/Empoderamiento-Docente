"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Puntos del manual §6 sobre azul-principal, con el "haz del faro": una capa
 * base tenue siempre visible y una capa encendida recortada por una máscara
 * radial. El haz tiene dos vidas:
 *
 * 1. BARRIDO DE ENTRADA (~0.3s–1.6s): el haz nace fuera del borde izquierdo,
 *    agrandado, y barre todo el hero encendiendo los puntos a su paso — la
 *    rotación del faro. El timing del titular/glow/bola en BibliotecaHero
 *    está acoplado a estas constantes.
 * 2. HANDOFF AL CURSOR: al terminar, el radio se encoge al de crucero y el
 *    haz queda al servicio del mouse (lerp suave vía RAF que solo actualiza
 *    CSS vars). Si el cursor no está sobre el hero (o es touch), se apaga
 *    con fade.
 *
 * Los listeners van sobre la SECTION del hero (closest): esta capa y su
 * contenedor decorativo son pointer-events-none. Con prefers-reduced-motion
 * no hay barrido ni haz: queda la capa base estática.
 */
const RADIO_HAZ = 260; // crucero (cursor)
const RADIO_BARRIDO = 420; // durante la entrada
const EASE = 0.12;

export function PuntosFaro() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest("section");
    if (!el || !host || reduced) return;

    const finoHover = window.matchMedia("(hover: hover)").matches;
    const setVar = (n: string, v: string) => el.style.setProperty(n, v);

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let iniciado = false; // hay posición de cursor conocida
    let sobreHero = false; // el cursor está ahora dentro del hero
    let enSweep = true; // el barrido es dueño de las vars

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      sobreHero = true;
      // Primer movimiento fuera del barrido: el haz nace donde está el
      // cursor (sin barrido desde 0,0).
      if (!iniciado && !enSweep) {
        cx = tx;
        cy = ty;
      }
      iniciado = true;
      if (!enSweep) setVar("--faro-alpha", "1");
    };
    const onLeave = () => {
      sobreHero = false;
      if (!enSweep) setVar("--faro-alpha", "0");
    };

    const tick = () => {
      if (!enSweep) {
        cx += (tx - cx) * EASE;
        cy += (ty - cy) * EASE;
        if (iniciado) {
          setVar("--faro-x", `${cx.toFixed(1)}px`);
          setVar("--faro-y", `${cy.toFixed(1)}px`);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    // ── Barrido de entrada ───────────────────────────────────────────────
    const r = el.getBoundingClientRect();
    const proxy = { x: -r.width * 0.12, radio: RADIO_BARRIDO };
    cy = r.height * 0.42; // altura del barrido: la franja del titular
    ty = cy;
    setVar("--faro-alpha", "1"); // nace apuntando fuera de cuadro → oscuro
    setVar("--faro-x", `${proxy.x.toFixed(1)}px`);
    setVar("--faro-y", `${cy.toFixed(1)}px`);
    setVar("--faro-r", `${RADIO_BARRIDO}px`);

    const sweep = gsap
      .timeline({ delay: 0.3 })
      .to(proxy, {
        x: r.width * 1.12,
        duration: 1.3,
        ease: "power2.inOut",
        onUpdate: () => setVar("--faro-x", `${proxy.x.toFixed(1)}px`),
      })
      .to(
        proxy,
        {
          radio: RADIO_HAZ,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: () => setVar("--faro-r", `${proxy.radio.toFixed(0)}px`),
        },
        "-=0.4",
      )
      .call(() => {
        enSweep = false;
        cx = proxy.x; // el lerp del cursor arranca donde terminó el haz
        if (!(finoHover && sobreHero)) setVar("--faro-alpha", "0");
      });

    if (finoHover) {
      host.addEventListener("mousemove", onMove, { passive: true });
      host.addEventListener("mouseleave", onLeave);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      sweep.kill();
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const mascaraHaz =
    "radial-gradient(circle var(--faro-r, 260px) at var(--faro-x, 50%) var(--faro-y, 40%), #000, transparent 72%)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ "--faro-alpha": "0" } as CSSProperties}
    >
      {/* Capa base: puntos apagados, siempre presentes */}
      <span className="pattern-dots-inverse absolute inset-0 [--dots-alpha:0.07]" />
      {/* Capa encendida: solo se ve dentro del haz */}
      <span
        className="pattern-dots-inverse absolute inset-0 transition-opacity duration-500 [--dots-alpha:0.3]"
        style={{
          opacity: "var(--faro-alpha)",
          maskImage: mascaraHaz,
          WebkitMaskImage: mascaraHaz,
        }}
      />
    </div>
  );
}
