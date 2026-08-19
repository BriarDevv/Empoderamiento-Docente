"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NIVELES } from "../data";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Niveles en los que intervenimos" — scroll-story CLAVADO, mismo lenguaje
 * que el ciclo de /investigacion (el patrón que quedó aprobado): los 5
 * niveles son cards que LLEGAN subiendo desde abajo y SE CIERRAN una por una
 * (colapsan a solo el título) mientras suben, repartidas en zig-zag por todo
 * el ancho — de lo micro a lo macro. Sin lazo de fondo: acá el hilo es la
 * escalada misma. Cierra con el titular grande.
 *
 * Sin motion / touch / pantalla chica: no clava; grilla legible + titular.
 * `live` arranca en false (coincide con SSR).
 */

// Zig-zag a lo ancho del escenario, esquivando la esquina superior izquierda
// (ahí vive el encabezado de la sección): % del escenario.
const POS = [
  { left: "7%", top: "40%" },
  { left: "44%", top: "14%" },
  { left: "24%", top: "60%" },
  { left: "66%", top: "34%" },
  { left: "44%", top: "64%" },
];

// Recorrido del lazo viajero (viewBox 1600x900): entra por arriba, serpentea
// entre las cards y sale por abajo. No se dibuja y queda — VIAJA: la cabeza
// avanza mientras la cola se borra, y al final sale de escena (referencia
// Assistantly). Lo persigue una cápsula corta por detrás.
const LAZO =
  "M 520 -80 C 420 120 220 220 240 400 C 260 560 420 640 620 560 C 800 490 700 220 860 140 C 1020 60 1200 140 1240 300 C 1280 470 1140 560 980 640 C 820 720 640 780 560 950";
const LAZO_SEG = 0.3; // largo de la serpiente (fracción del recorrido)
const PUNTO_SEG = 0.035; // largo de la cápsula perseguidora
const PUNTO_GAP = 0.05; // aire entre la cola del lazo y la cápsula

export function NivelesEscala() {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (min-width: 768px)").matches) return;
    setLive(true);

    const zone = zoneRef.current;
    const stage = stageRef.current;
    if (!zone || !stage) return;

    const run = () => {
      const limpiadores: Array<() => void> = [];
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-nivel-card]");
        const headline = stage.querySelector<HTMLElement>("[data-nivel-headline]");
        const intro = stage.querySelector<HTMLElement>("[data-nivel-intro]");
        if (cards.length !== NIVELES.length) return;

        // Medir las zonas colapsables y fijarles alto para poder animarlo a 0.
        const colapsables = gsap.utils.toArray<HTMLElement>("[data-collapse]");
        colapsables.forEach((c) => gsap.set(c, { height: c.scrollHeight }));
        gsap.set(cards, { y: 760, autoAlpha: 0 });
        if (headline) gsap.set(headline, { autoAlpha: 0, y: 24, scale: 0.96 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: zone, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });

        // El lazo viajero + su cápsula: ventana visible que se desliza a lo
        // largo del recorrido vía dashoffset — entra, serpentea entre las
        // cards y SALE (no queda estático de fondo). La cápsula corre con un
        // offset corrido detrás de la cola, siempre sobre el mismo path.
        const lazo = stage.querySelector<SVGPathElement>("[data-nivel-lazo]");
        const punto = stage.querySelector<SVGPathElement>("[data-nivel-punto]");
        const cinta = stage.querySelector<SVGSVGElement>("[data-nivel-cinta]");
        if (lazo && punto) {
          const L = lazo.getTotalLength();
          const seg = L * LAZO_SEG;
          const dot = L * PUNTO_SEG;
          const gap = L * PUNTO_GAP;
          const corrimiento = gap + dot;
          gsap.set(lazo, { strokeDasharray: `${seg} ${L * 2}`, strokeDashoffset: seg });
          gsap.set(punto, {
            strokeDasharray: `${dot} ${L * 2}`,
            strokeDashoffset: seg + corrimiento,
          });
          // Viaja hasta que la cápsula también salió del todo — y termina
          // ANTES de que las cards cedan y entre el titular (7.5/7.9): que el
          // remate no conviva con restos del lazo en escena.
          const final = -(L + corrimiento + L * 0.02);
          tl.to(lazo, { strokeDashoffset: final, ease: "none", duration: 7.3 }, 0).to(
            punto,
            { strokeDashoffset: final + corrimiento, ease: "none", duration: 7.3 },
            0,
          );
          // Seguro definitivo: el tramo de salida por el borde de abajo es
          // largo y la cápsula ronda ahí un rato — el SVG entero se desvanece
          // antes del remate, así después de este punto no queda tinta en
          // escena pase lo que pase con la geometría.
          if (cinta) tl.to(cinta, { autoAlpha: 0, ease: "none", duration: 0.6 }, 6.6);
        }

        // Cada nivel LLEGA subiendo desde abajo y SE CIERRA mientras sube;
        // al aterrizar suelta un ping que se expande.
        cards.forEach((card, i) => {
          const t = i * 1.4;
          const icono = card.querySelector("[data-collapse-icon]");
          const cuerpo = card.querySelector("[data-collapse]");
          const ping = card.querySelector("[data-nivel-ping]");
          tl.to(card, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 1.6 }, t);
          if (icono) tl.to(icono, { height: 0, autoAlpha: 0, marginBottom: 0, ease: "none", duration: 0.9 }, t + 0.8);
          if (cuerpo) tl.to(cuerpo, { height: 0, autoAlpha: 0, marginTop: 0, ease: "none", duration: 1.0 }, t + 0.8);
          if (ping) {
            tl.fromTo(
              ping,
              { scale: 0.3, autoAlpha: 0.7 },
              { scale: 2.1, autoAlpha: 0, ease: "power1.out", duration: 0.9 },
              t + 1.2,
            );
          }
        });

        // Click en una card cerrada → se despliega para leerla; otro click la
        // vuelve a cerrar. El estado se infiere del alto real (quien haya
        // movido la card por scroll manda hasta el próximo click).
        cards.forEach((card) => {
          const cuerpo = card.querySelector<HTMLElement>("[data-collapse]");
          const icono = card.querySelector<HTMLElement>("[data-collapse-icon]");
          const mas = card.querySelector<HTMLElement>("[data-nivel-mas]");
          if (!cuerpo || !icono) return;
          const alternar = () => {
            const abierto = cuerpo.offsetHeight > 4;
            gsap.to([cuerpo, icono], {
              height: abierto ? 0 : "auto",
              autoAlpha: abierto ? 0 : 1,
              duration: 0.45,
              ease: "power2.inOut",
              // Un click arriba de otro mata el tween anterior: sin estados
              // colgados a mitad de apertura.
              overwrite: "auto",
            });
            card.setAttribute("aria-expanded", String(!abierto));
            if (mas) mas.style.transform = abierto ? "" : "rotate(45deg)";
          };
          const teclado = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              alternar();
            }
          };
          card.addEventListener("click", alternar);
          card.addEventListener("keydown", teclado);
          limpiadores.push(() => {
            card.removeEventListener("click", alternar);
            card.removeEventListener("keydown", teclado);
          });
        });

        // Las cards ceden; entra el titular grande.
        tl.to(cards, { autoAlpha: 0, y: -70, ease: "power1.in", duration: 1.2 }, 7.5);
        if (intro) tl.to(intro, { autoAlpha: 0, ease: "none", duration: 0.6 }, 7.5);
        if (headline)
          tl.to(headline, { autoAlpha: 1, y: 0, scale: 1, ease: "power2.out", duration: 1.3 }, 7.9);
        tl.to({}, { duration: 0.4 });
      }, stage);

      return () => {
        limpiadores.forEach((fn) => fn());
        ctx.revert();
      };
    };

    // Los colapsables se miden con la tipografía definitiva.
    let cleanup: (() => void) | undefined;
    if (document.fonts?.ready) document.fonts.ready.then(() => (cleanup = run()));
    else cleanup = run();
    return () => cleanup?.();
  }, [reduced]);

  return (
    <div
      ref={zoneRef}
      className={live ? "relative h-[460svh] bg-white" : "bg-white"}
      aria-label="Niveles en los que intervenimos"
    >
      <div
        ref={stageRef}
        className={
          "overflow-clip " +
          (live ? "sticky top-0 h-[100svh]" : "relative flex min-h-[70svh] flex-col py-24")
        }
      >
        {/* Grilla de puntos §6: textura de base para que el escenario no
            quede pelado entre las cards. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle,color-mix(in_srgb,var(--color-azul-principal)_22%,transparent)_1.1px,transparent_1.6px)] [background-size:22px_22px]"
        />

        {/* Lazo viajero + cápsula perseguidora (solo live, detrás de las cards). */}
        {live && (
          <svg
            data-nivel-cinta
            aria-hidden="true"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          >
            <path
              data-nivel-lazo
              d={LAZO}
              fill="none"
              stroke="var(--color-azul-medio)"
              strokeWidth={54}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 20px 30px rgb(74 111 165 / 0.25))" }}
            />
            <path
              data-nivel-punto
              d={LAZO}
              fill="none"
              stroke="var(--color-verde-concepto)"
              strokeWidth={54}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {/* Encabezado */}
        <div
          data-nivel-intro
          className={
            live
              ? "absolute inset-x-0 top-0 z-20 mx-auto w-full max-w-screen-xl px-5 pt-24 md:px-10 md:pt-28"
              : "mx-auto w-full max-w-screen-xl px-5 md:px-10"
          }
        >
          <p className="text-gris-texto font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            Niveles en los que intervenimos
          </p>
          <p className="text-gris-texto mt-3 max-w-[38ch] font-sans text-[0.98rem] leading-relaxed">
            De lo micro a lo macro: cinco niveles donde la transformación se
            sostiene.
          </p>
        </div>

        {/* Titular grande del final (aparece al cerrar las cards). */}
        {live && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-5 md:px-10">
            <h2
              data-nivel-headline
              className="font-display text-azul-principal mx-auto w-full max-w-screen-xl font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.4rem, 1rem + 5vw, 5rem)", lineHeight: 1.02 }}
            >
              Del aula,
              <br />
              <span className="text-verde-concepto-texto">
                al sistema educativo.
              </span>
            </h2>
          </div>
        )}

        {/* Los 5 niveles como cards. */}
        <div
          className={
            live
              ? "absolute inset-0 z-10"
              : "mx-auto mt-12 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 md:px-10"
          }
        >
          {NIVELES.map((niv, i) => (
            <article
              key={niv.k}
              data-nivel-card
              className={
                live
                  ? "absolute w-[clamp(250px,24vw,22rem)] cursor-pointer select-none"
                  : "relative"
              }
              style={live ? POS[i] : undefined}
              {...(live
                ? {
                    role: "button",
                    tabIndex: 0,
                    "aria-expanded": true,
                    "aria-label": `${niv.k}: ver detalle`,
                  }
                : {})}
            >
              {/* Ping al aterrizar: una onda que se expande y se va. */}
              {live && (
                <span
                  data-nivel-ping
                  aria-hidden="true"
                  className="border-verde-concepto/50 pointer-events-none absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-0"
                />
              )}
              <div className="border-azul-principal/8 relative rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgb(31_45_77/0.04),0_24px_50px_-24px_rgb(31_45_77/0.18)]">
                {/* Pista de click: + que rota a × cuando la abrís a mano. */}
                {live && (
                  <span
                    data-nivel-mas
                    aria-hidden="true"
                    className="text-verde-concepto-texto absolute top-4 right-5 font-mono text-[1.15rem] leading-none transition-transform duration-300"
                  >
                    +
                  </span>
                )}
                <div data-collapse-icon className="overflow-hidden">
                  <span className="bg-verde-concepto/10 text-verde-concepto-texto mb-4 flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[0.85rem] font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-azul-principal text-[1.35rem] leading-tight font-bold">
                  {niv.k}
                </h3>
                <div data-collapse className="overflow-hidden">
                  <p className="text-gris-texto mt-3 font-sans text-[0.95rem] leading-relaxed">
                    {niv.d}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* En fallback el titular va al pie, visible. */}
        {!live && (
          <div className="mx-auto mt-14 w-full max-w-screen-xl px-5 md:px-10">
            <h2
              className="font-display text-azul-principal font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 1rem + 4vw, 3.6rem)", lineHeight: 1.05 }}
            >
              Del aula,{" "}
              <span className="text-verde-concepto-texto">al sistema educativo.</span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
