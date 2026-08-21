"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Magnetic } from "@/components/ui/Magnetic";
import { PuntosFaro } from "@/components/ui/PuntosFaro";
import { getLenis } from "@/lib/lenis";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// ── Escena ambiente: imágenes que nacen de la luz del horizonte ────────────
// Misma idea que el hero de Investigación (imágenes evocativas que se acercan
// y pasan de largo) pero manejada por TIEMPO, no por scroll: loop continuo y
// lento detrás del titular. Es atmósfera — sin etiquetas, el titular manda.
const ESCENA = [
  "/hero/hero-2.webp",
  "/metodo/acompanamos.webp",
  "/hero/hero-9.webp",
  "/metodo/evaluamos.webp",
  "/hero/hero-11.webp",
  "/hero/hero-3.webp",
];

// Carriles: lado (izq/der) y banda vertical de destino — esquivan el centro,
// donde vive el titular.
const CARRILES = [
  { side: -1, y: -0.2 },
  { side: 1, y: 0.14 },
  { side: -1, y: 0.18 },
  { side: 1, y: -0.16 },
  { side: -1, y: 0.02 },
  { side: 1, y: 0.2 },
];

const VIAJE = 14; // segundos que tarda una imagen de nacer a irse
const CADENCIA = 3.5; // cada cuánto nace una imagen nueva

/**
 * Hero de Qué hacemos — pantalla completa (100svh) a sangre, sin bordes
 * redondeados, todo centrado en el medio: titular, bajada y el botón portal
 * (referencia Ink). Fondo atmosférico propio: navy que oscurece hacia
 * arriba y un HORIZONTE DE LUZ azul abajo — el faro debajo del horizonte,
 * a punto de encenderse (el click del portal lo enciende en verde encima).
 * <PuntosFaro /> da la textura de puntos + haz del cursor. Titular con el
 * mensaje diferencial de ED: "No formamos. / Transformamos." (palabras de
 * la clienta: "en ED no formamos, se trata de una transformación
 * educativa"). PENDIENTE validar el titular exacto con cliente.
 *
 * ESCENA AMBIENTE (idea del hero de Investigación, adaptada): imágenes
 * evocativas nacen chiquitas en la luz del horizonte, se acercan de a poco
 * derivando hacia los costados y pasan de largo — loop continuo por TIEMPO
 * (acá no hay scroll-scrub: el hero es una pantalla). Solo desktop con
 * puntero fino y motion; en mobile/reduced ni se montan.
 *
 * Entrada: el haz barre encendiendo los puntos y las dos líneas suben desde
 * su máscara cuando la luz cruza el centro (~0.95s, constantes de PuntosFaro).
 * Sin motion: todo visible y quieto.
 *
 * MOUSE-PARALLAX (misma fórmula que el hero del home): un solo RAF con lerp
 * setea --qhx/--qhy (-1..1 desde el centro del viewport) sobre la section.
 * Cada capa los multiplica por su profundidad: el contenido sigue LEVEMENTE
 * al cursor (+), el fondo (glow/bola) se desplaza en contra (-) para dar
 * profundidad. Amplitudes chicas (≤18px) — acompaña, no marea. Solo con
 * puntero fino (hover:hover); sin motion no hay parallax.
 *
 * ESTRUCTURA (referencia Ink): eyebrow → titular blanco con subrayado verde
 * bajo la palabra clave (el marcador de concepto de la marca, en versión
 * subrayado) → bajada → botón pill naranja (CTA de acción, §7 del manual).
 *
 * Portal al recorrido: el pill responde a click Y a hold — cualquier gesto
 * termina encendiendo. Apretar carga el botón a ritmo lento (~1.1s, un
 * barrido oscuro lo va llenando); si soltás antes de completar, cuenta como
 * click y la carga restante se acelera (~0.4s). Al completar: la luz verde
 * sube desde abajo (el faro encendiéndose) y viaja suave hasta la torre
 * (#recorrido). El hover insinúa la carga (barrido al 15%) como affordance.
 * NO es una puerta: scrollear de largo sigue funcionando siempre. Teclado
 * (click sintético) carga rápido; con prefers-reduced-motion salta directo.
 */
export function QueHacemosHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const holdRef = useRef<HTMLButtonElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  // La escena de imágenes solo corre en desktop con puntero fino y motion:
  // en mobile/reduced el hero queda limpio (y ni se cargan las fotos).
  const [escenaViva, setEscenaViva] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-qh-word]", { yPercent: 115 });
      gsap.set("[data-qh-underline]", { scaleX: 0 });
      // El celeste entra desde la DERECHA (cruzado con el subrayado, que se
      // dibuja desde la izquierda).
      gsap.set("[data-qh-pintura]", { clipPath: "inset(0% 0% 0% 100%)" });
      gsap.set("[data-qh-glow]", { autoAlpha: 0 });
      gsap.set("[data-qh-rise]", { autoAlpha: 0, y: 24 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-qh-word]", { yPercent: 0, duration: 1, stagger: 0.12 }, 0.75)
        .to("[data-qh-glow]", { autoAlpha: 1, duration: 1.4, ease: "power2.out" }, 1.0)
        // El subrayado se dibuja de izquierda a derecha cuando el titular
        // ya está arriba — el gesto del marcador — y la palabra se tiñe de
        // celeste con un barrido cruzado, desde la derecha.
        .to("[data-qh-underline]", { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, 1.7)
        .to("[data-qh-pintura]", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power3.inOut" }, 1.7)
        .to("[data-qh-rise]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.45);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // ── Mouse-parallax del hero ────────────────────────────────────────────
  // RAF único con lerp (EASE bajo = trailing suave). Solo actualiza CSS vars;
  // las capas mueven vía transform con calc() — GSAP nunca toca esos nodos,
  // así que no hay pelea de transforms.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let started = false;
    const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v);
    const onMove = (e: MouseEvent) => {
      tx = clamp((e.clientX / window.innerWidth - 0.5) * 2);
      ty = clamp((e.clientY / window.innerHeight - 0.5) * 2);
      started = true;
    };
    const EASE = 0.07; // más bajo = más retardo (muy smooth, sin exagerar)
    const tick = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      if (started) {
        root.style.setProperty("--qhx", cx.toFixed(4));
        root.style.setProperty("--qhy", cy.toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // ── Escena ambiente: encender solo donde corresponde ───────────────────
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (min-width: 768px)").matches) return;
    setEscenaViva(true);
  }, [reduced]);

  // ── Escena ambiente: el loop (corre recién cuando las figuras montaron) ──
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !escenaViva) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-qh-img]");
      const W = window.innerWidth;
      const H = window.innerHeight;
      // Ciclo total por tarjeta = CADENCIA * n; el resto del viaje es espera.
      const espera = Math.max(0, CADENCIA * cards.length - VIAJE);

      cards.forEach((card, i) => {
        const { side, y } = CARRILES[i % CARRILES.length];
        gsap.set(card, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: espera,
          delay: 2.2 + i * CADENCIA, // arranca cuando la entrada ya pasó
        });
        // Nace chiquita en la luz del horizonte…
        tl.set(card, { x: 0, y: H * 0.3, scale: 0.08, autoAlpha: 0 })
          // …aparece de a poco…
          .to(card, { autoAlpha: 0.85, duration: 2.4, ease: "power1.in" }, 0)
          // …se acerca derivando hacia su carril…
          .to(card, { x: side * W * 0.36, y: y * H, scale: 0.95, duration: VIAJE - 4, ease: "power1.out" }, 0)
          // …y pasa de largo, agrandándose mientras se va.
          .to(
            card,
            { x: side * W * 0.56, y: y * H - H * 0.14, scale: 1.5, autoAlpha: 0, duration: 4, ease: "power1.in" },
            VIAJE - 4,
          );
      });
    }, root);

    return () => ctx.revert();
  }, [escenaViva]);

  // ── Portal al recorrido (click / hold sobre el pill) ───────────────────
  useIsomorphicLayoutEffect(() => {
    const btn = holdRef.current;
    const fill = fillRef.current;
    const root = rootRef.current;
    if (!btn || !fill || !root) return;

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
    let tween: gsap.core.Tween | null = null;
    // idle → cargando (dedo abajo o click acelerando) → viajando → idle.
    let fase: "idle" | "cargando" | "viajando" = "idle";

    // El barrido oscuro del pill marca el progreso de la carga.
    const pintar = () => {
      fill.style.transform = `scaleX(${prog.v})`;
      if (holdGlow) holdGlow.style.opacity = String(prog.v * 0.9);
    };
    pintar();

    // Carga completa: flash de luz y viaje; el barrido se descarga mientras
    // viajamos.
    const fuego = () => {
      fase = "viajando";
      viajar();
      if (holdGlow) {
        gsap.fromTo(
          holdGlow,
          { opacity: 0.9 },
          { opacity: 0, duration: 1.4, ease: "power2.out", delay: 0.15 },
        );
      }
      gsap.to(btn, { scale: 1, duration: 0.45, ease: "power2.out" });
      gsap.to(prog, {
        v: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out",
        onUpdate: () => (fill.style.transform = `scaleX(${prog.v})`),
        onComplete: () => {
          fase = "idle";
        },
      });
    };

    // Carga el resto del barrido en `dur` (escalado por lo que falta) y fuego.
    const cargar = (dur: number, ease: string) => {
      tween?.kill();
      tween = gsap.to(prog, {
        v: 1,
        duration: dur * (1 - prog.v),
        ease,
        onUpdate: pintar,
        onComplete: fuego,
      });
    };

    // Dedo abajo: carga lenta (el gesto de "encender manteniendo").
    const abajo = (e: PointerEvent) => {
      if (fase !== "idle") return;
      fase = "cargando";
      // Capturar el puntero mantiene el hold vivo aunque el dedo derive un
      // poco; si el navegador lo rechaza (puntero ya soltado), da igual.
      try {
        btn.setPointerCapture?.(e.pointerId);
      } catch {
        /* noop */
      }
      gsap.to(btn, { scale: 0.94, duration: 0.25, ease: "power2.out" });
      cargar(1.1, "none");
    };
    // Soltó antes de completar: fue un click — la carga restante se acelera.
    const arriba = () => {
      if (fase !== "cargando") return;
      cargar(0.4, "power2.in");
    };
    // Cancelación real del puntero (no un release): descarga.
    const cancelar = () => {
      if (fase !== "cargando") return;
      fase = "idle";
      tween?.kill();
      tween = gsap.to(prog, { v: 0, duration: 0.35, ease: "power2.out", onUpdate: pintar });
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
    };
    // Teclado: el click llega con detail 0, sin pointerdown previo.
    const teclado = (e: MouseEvent) => {
      if (e.detail === 0 && fase === "idle") {
        fase = "cargando";
        cargar(0.5, "power2.in");
      }
    };

    // Hover: insinúa la carga (affordance de "esto se enciende").
    const entrar = () => {
      if (fase !== "idle") return;
      tween?.kill();
      tween = gsap.to(prog, { v: 0.15, duration: 0.35, ease: "power2.out", onUpdate: pintar });
      gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    };
    const salir = () => {
      if (fase !== "idle") return;
      tween?.kill();
      tween = gsap.to(prog, { v: 0, duration: 0.4, ease: "power2.out", onUpdate: pintar });
      gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    btn.addEventListener("pointerdown", abajo);
    btn.addEventListener("pointerup", arriba);
    btn.addEventListener("pointercancel", cancelar);
    btn.addEventListener("click", teclado);
    btn.addEventListener("pointerenter", entrar);
    btn.addEventListener("pointerleave", salir);
    return () => {
      tween?.kill();
      btn.removeEventListener("pointerdown", abajo);
      btn.removeEventListener("pointerup", arriba);
      btn.removeEventListener("pointercancel", cancelar);
      btn.removeEventListener("click", teclado);
      btn.removeEventListener("pointerenter", entrar);
      btn.removeEventListener("pointerleave", salir);
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden pt-24 pb-12 text-white"
      aria-label="Qué hacemos"
      style={
        {
          "--qhx": "0",
          "--qhy": "0",
          // Navy que oscurece hacia arriba: profundidad de cielo nocturno
          // sin salir de la paleta (azul-principal mezclado con negro).
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-azul-principal) 52%, #04060c) 0%, color-mix(in srgb, var(--color-azul-principal) 78%, #04060c) 55%, var(--color-azul-principal) 100%)",
        } as CSSProperties
      }
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Horizonte de luz: el faro debajo del horizonte. GSAP solo anima
            autoAlpha (entrada); el transform queda libre para el parallax
            por CSS var — sin pelea de transforms. */}
        <span
          data-qh-glow
          className="absolute inset-0 will-change-transform"
          style={{
            background:
              "radial-gradient(90% 62% at 50% 110%, color-mix(in srgb, var(--color-azul-medio) 52%, transparent) 0%, color-mix(in srgb, var(--color-azul-claro) 16%, transparent) 42%, transparent 72%)",
            transform:
              "translate3d(calc(var(--qhx, 0) * -18px), calc(var(--qhy, 0) * -10px), 0)",
          }}
        />
        {/* Luz que se "carga" con el click: sube desde el botón, abajo. */}
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

      {/* Escena ambiente: imágenes que nacen de la luz del horizonte, se
          acercan de a poco y pasan de largo. Detrás del contenido (z-0 vs
          z-10); parallax leve EN CONTRA del mouse (son "lejos"). */}
      {escenaViva && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          style={{
            transform:
              "translate3d(calc(var(--qhx, 0) * -12px), calc(var(--qhy, 0) * -8px), 0)",
          }}
        >
          {ESCENA.map((src) => (
            <figure
              key={src}
              data-qh-img
              className="absolute top-1/2 left-1/2 w-[clamp(170px,17vw,280px)] opacity-0 will-change-transform"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/10">
                <Image src={src} alt="" fill sizes="280px" className="object-cover" />
                <span className="bg-azul-principal/25 absolute inset-0" />
              </div>
            </figure>
          ))}
        </div>
      )}

      <div
        className="relative z-10 mx-auto flex w-full max-w-screen-xl flex-col items-center px-5 text-center will-change-transform md:px-10"
        style={{
          // Sigue al mouse y ADEMÁS se inclina apenas hacia él (mira al
          // cursor) — mismos signos que useTilt: rotateY con x, rotateX
          // contra y. Ángulos chicos para que acompañe sin marear.
          transform:
            "perspective(1000px) translate3d(calc(var(--qhx, 0) * 10px), calc(var(--qhy, 0) * 8px), 0) rotateY(calc(var(--qhx, 0) * 2.6deg)) rotateX(calc(var(--qhy, 0) * -2.1deg))",
        }}
      >
        <h1
          className="font-display font-extrabold tracking-[-0.03em] text-white [text-shadow:0_2px_30px_rgb(15_21_40/0.55)]"
          style={{ fontSize: "clamp(2.75rem, 1.1rem + 7vw, 6.25rem)", lineHeight: 1.04 }}
        >
          <span className="sr-only">No formamos. Transformamos.</span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
            <span data-qh-word className="block">
              No formamos.
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden pb-[0.14em]">
            <span data-qh-word className="block">
              {/* Marcador verde de la marca, en versión subrayado (ref Ink):
                  se dibuja de izquierda a derecha en la entrada, y a la vez
                  una copia en azul-claro (el celeste de la paleta, §1) se
                  revela con clip-path DESDE LA DERECHA — barrido cruzado:
                  el subrayado va y el color viene. Sin motion: celeste
                  directo (el clip solo lo setea GSAP). */}
              <span className="relative inline-block">
                Transformamos.
                <span aria-hidden="true" data-qh-pintura className="text-azul-claro absolute inset-0">
                  Transformamos.
                </span>
                <span
                  data-qh-underline
                  className="bg-verde-concepto absolute right-[0.04em] -bottom-[0.04em] left-[0.02em] h-[0.045em] origin-left rounded-full"
                />
              </span>
            </span>
          </span>
        </h1>

        <p
          data-qh-rise
          className="mt-6 max-w-[56ch] font-sans text-[1.05rem] leading-relaxed text-white/85 md:text-[1.2rem]"
        >
          Generamos escenarios de aprendizaje pensados para cada contexto —
          nunca enlatados — que transforman la relación con la matemática
          escolar.
        </p>

        {/* Portal al recorrido: click u hold cargan el barrido del pill,
            encienden la luz y viajan suave a la torre. Scrollear sigue
            funcionando siempre — esto es un atajo, no una puerta. */}
        <div data-qh-rise className="mt-10 md:mt-12">
          <Magnetic strength={0.25}>
            <button
              ref={holdRef}
              type="button"
              aria-label="Entrar al recorrido de lo que hacemos"
              className="bg-naranja-accion relative inline-flex cursor-pointer touch-none items-center overflow-hidden rounded-full px-9 py-4 font-sans text-[0.98rem] font-medium text-white outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80"
            >
              {/* Barrido de carga (click/hold): mismo lenguaje que el sweep
                  hover del CtaButton del nav, acá manejado por GSAP. */}
              <span
                ref={fillRef}
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-black/20"
              />
              <span className="relative">Entrá al recorrido</span>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
