"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TAMBORES } from "../data";
import { getLenis } from "@/lib/lenis";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * La torre de tambores — el "espiral" de Qué hacemos (referencia Noomo).
 *
 * Todo el contenido de la página vive en una torre de cilindros de texto:
 * cada tambor lleva su nombre envuelto alrededor (rebanado en caracteres
 * posicionados con rotateY(θ)·translateZ(R), CSS 3D puro, sin WebGL). El
 * scroll hace dos cosas a la vez: TRASLADA la torre verticalmente (viajás de
 * tambor en tambor, viendo asomar el siguiente desde abajo) y hace GIRAR
 * cada tambor sobre su eje, cada uno con su desfase para que no roten en
 * bloque. La cara trasera se ve espejada y "esmerilada" (color transparent +
 * text-shadow — filter blur a 60fps pincharía).
 *
 * Geometría: radio ÚNICO para toda la torre (es una sola torre, como la
 * referencia); cada tambor ajusta tamaño de letra y repeticiones del nombre
 * para que su vuelta cierre exacta en esa circunferencia.
 *
 * Los textos de apoyo (título oficial + frase verde + detalle) NO viajan con
 * los tambores: viven en ranuras fijas al pie y se cruzan (crossfade +
 * textContent, sin re-render de React) cuando cambia el tambor activo. El
 * medallón central marca la posición en la torre.
 *
 * Performance: solo se pintan los tambores en cuadro (los demás quedan
 * visibility:hidden); por frame se escriben ~2 transforms + las opacidades
 * de las rebanadas visibles.
 *
 * Mobile / touch / prefers-reduced-motion: bloques planos apilados.
 */

const SEP = "  •  ";
const ANCHO_CHAR = 0.62; // ancho promedio (em) de Manrope extrabold mayúsculas
const F_MAX = 148;
const SVH_POR_TAMBOR = 130; // cuánto scroll dura cada estación de la torre
// Ángulos de los chips de frase sobre la banda (3 por tambor, repartidos).
const CHIP_ANGS = [40, 160, 280];

type GeoTambor = { f: number; paso: number; slices: string[] };
type Geo = { r: number; sp: number; alto: number; drums: GeoTambor[] };

function calcularGeo(w: number, h: number): Geo {
  const r = Math.min(w * 0.36, 540);
  const circ = 2 * Math.PI * r;
  const drums = TAMBORES.map((t) => {
    const base = (t.tambor + SEP).toUpperCase();
    // Repeticiones para que la letra no pase de F_MAX al cerrar la vuelta.
    const k = Math.max(1, Math.ceil(circ / (ANCHO_CHAR * F_MAX) / base.length));
    const slices = Array.from(base.repeat(k));
    const f = Math.min(F_MAX, circ / (ANCHO_CHAR * slices.length));
    return { f, paso: 360 / slices.length, slices };
  });
  // Separación entre tambores: lo justo para que el siguiente asome desde
  // abajo mientras el activo está al frente — a mitad de viaje los dos se
  // ven a la vez, sin vacío entre medio (continuidad de torre).
  return { r, sp: Math.max(370, h * 0.46), alto: h, drums };
}

export function TorreLineas() {
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const towerRef = useRef<HTMLDivElement | null>(null);
  const drumRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spanRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const fotoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const pulsos = useRef<number[]>([]); // latido elástico por tambor (escala extra)
  const tituloRef = useRef<HTMLParagraphElement | null>(null);
  const fraseRef = useRef<HTMLParagraphElement | null>(null);
  const detalleRef = useRef<HTMLParagraphElement | null>(null);
  const apoyoRef = useRef<HTMLDivElement | null>(null);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (min-width: 768px)").matches) return;
    setLive(true);
  }, [reduced]);

  useIsomorphicLayoutEffect(() => {
    if (!live) return;
    const medir = () => setGeo(calcularGeo(window.innerWidth, window.innerHeight));
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [live]);

  useIsomorphicLayoutEffect(() => {
    if (!live || !geo) return;
    const zone = zoneRef.current;
    const stage = stageRef.current;
    const tower = towerRef.current;
    if (!zone || !stage || !tower) return;

    const n = TAMBORES.length;
    const ocultos: boolean[] = TAMBORES.map(() => false);
    let deriva = 0;
    let activo = 0;
    let enCuadro = false;
    const avance = { p: 0 };

    const pintar = () => {
      const y = -avance.p * (n - 1) * geo.sp;
      tower.style.transform = `translateY(${y}px)`;
      for (let i = 0; i < n; i++) {
        const drum = drumRefs.current[i];
        const foto = fotoRefs.current[i];
        if (!drum) continue;
        const wy = i * geo.sp + y; // 0 = centro de cámara
        const visible = Math.abs(wy) < geo.alto * 1.05;
        if (!visible) {
          if (!ocultos[i]) {
            drum.style.visibility = "hidden";
            if (foto) foto.style.visibility = "hidden";
            ocultos[i] = true;
          }
          continue;
        }
        if (ocultos[i]) {
          drum.style.visibility = "";
          if (foto) foto.style.visibility = "";
          ocultos[i] = false;
        }
        // Giro: avanza con el scroll + desfase por tambor + deriva constante.
        // El latido (pulsos) es el "beat" elástico cuando el tambor llega.
        const rot = 26 + avance.p * 560 + i * 47 + deriva;
        const lat = 1 + (pulsos.current[i] || 0);
        drum.style.transform = `translate(-50%, -50%) translateY(${i * geo.sp}px) rotateY(${rot}deg) scale(${lat})`;
        // La foto viaja con la torre pero un toque más lenta (parallax).
        if (foto) {
          foto.style.transform = `translate(-50%, -50%) translateY(${i * geo.sp - wy * 0.1}px)`;
        }

        const g = geo.drums[i];
        const spans = spanRefs.current[i] ?? [];
        for (let j = 0; j < spans.length; j++) {
          const s = spans[j];
          if (!s) continue;
          const a = (((j * g.paso + rot) % 360) + 360) % 360;
          const c = Math.cos((a * Math.PI) / 180);
          if (c > 0) {
            s.style.opacity = String(0.2 + 0.8 * c);
            s.style.color = "";
            s.style.textShadow = "none";
          } else {
            s.style.opacity = String(0.1 + 0.12 * -c);
            s.style.color = "transparent";
            s.style.textShadow = "0 0 14px rgba(31, 45, 77, 0.5)";
          }
        }

        // Chips de frase: legibles solo del lado de adelante.
        const chips = chipRefs.current[i] ?? [];
        for (let k = 0; k < chips.length; k++) {
          const chip = chips[k];
          if (!chip) continue;
          const a = (((CHIP_ANGS[k] + rot) % 360) + 360) % 360;
          const c = Math.cos((a * Math.PI) / 180);
          chip.style.opacity = c > 0.12 ? String(0.2 + 0.8 * c) : "0";
        }
      }

      // Los apoyos respiran con la torre: plenos en cada estación, se apagan
      // durante el viaje (así el tambor que llega nunca los pisa).
      const pos = avance.p * (n - 1);
      const dist = Math.abs(pos - Math.round(pos)); // 0 en estación, 0.5 a mitad de viaje
      if (apoyoRef.current) {
        apoyoRef.current.style.opacity = String(Math.max(0, 1 - dist * 2.6));
      }

      // Riel derecho: barra y porcentaje del recorrido.
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${avance.p})`;
      const pct = `${Math.round(avance.p * 100)}%`;
      if (pctRef.current && pctRef.current.textContent !== pct) {
        pctRef.current.textContent = pct;
      }

      // Estación activa → cruzar los textos de apoyo (sin re-render React).
      const act = Math.min(n - 1, Math.max(0, Math.round(pos)));
      if (act !== activo) {
        activo = act;
        railRefs.current.forEach((el, i) => {
          if (el) el.dataset.active = String(i === act);
        });
        // Latido: el tambor que llega hace un pulso elástico (la escala extra
        // la lee pintar en cada frame, así compone con el giro).
        const beat = { v: 0.05 };
        pulsos.current[act] = beat.v;
        gsap.to(beat, {
          v: 0,
          duration: 0.9,
          ease: "elastic.out(1.2, 0.5)",
          onUpdate: () => {
            pulsos.current[act] = beat.v;
          },
        });
        const t = TAMBORES[act];
        gsap
          .timeline()
          .to("[data-torre-slot]", { autoAlpha: 0, y: -10, duration: 0.22, ease: "power2.in" })
          .add(() => {
            if (tituloRef.current) tituloRef.current.textContent = t.titulo;
            if (fraseRef.current) fraseRef.current.textContent = t.frase;
            if (detalleRef.current) detalleRef.current.textContent = t.detalle;
          })
          .to("[data-torre-slot]", { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
      }
    };

    // Deriva constante mientras la torre está en viewport.
    const tick = (_t: number, dt: number) => {
      if (!enCuadro) return;
      deriva -= dt * 0.0035;
      pintar();
    };
    gsap.ticker.add(tick);

    const ctx = gsap.context(() => {
      gsap.to(avance, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: zone,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            enCuadro = self.isActive;
          },
        },
        onUpdate: pintar,
      });

      // (La aparición del bloque de apoyo la maneja pintar(): opacidad por
      // cercanía a la estación — un tween acá pelearía con esa escritura.)
    }, stage);

    pintar();

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, [live, geo]);

  drumRefs.current = [];
  spanRefs.current = TAMBORES.map(() => []);
  railRefs.current = [];
  fotoRefs.current = [];
  chipRefs.current = TAMBORES.map(() => []);

  // Riel izquierdo: saltar a la estación i (misma cuenta que hace pintar
  // al revés: posición de scroll donde el avance p = i/(n-1)).
  const saltarA = (i: number) => {
    const zone = zoneRef.current;
    if (!zone) return;
    const top = zone.getBoundingClientRect().top + window.scrollY;
    const destino =
      top + (zone.offsetHeight - window.innerHeight) * (i / (TAMBORES.length - 1));
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(destino, { duration: 1.4 });
    else window.scrollTo({ top: destino, behavior: "smooth" });
  };

  return (
    <section
      id="recorrido"
      className="bg-gris-fondo relative"
      aria-label="Líneas de acción"
    >
      {/* Grilla de puntos §6 sobre gris, como la referencia. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle,color-mix(in_srgb,var(--color-azul-principal)_22%,transparent)_1.1px,transparent_1.6px)] [background-size:22px_22px]"
      />

      {/* Contenido real para lectores de pantalla: la torre es decorativa. */}
      <ul className="sr-only">
        {TAMBORES.map((t) => (
          <li key={t.id}>
            <h3>{t.titulo}</h3>
            <p>{t.frase}</p>
            <p>{t.detalle}</p>
          </li>
        ))}
      </ul>

      <div
        ref={zoneRef}
        className="relative"
        style={live ? { height: `${100 + TAMBORES.length * SVH_POR_TAMBOR}svh` } : undefined}
      >
        <div
          ref={stageRef}
          className={
            live ? "sticky top-0 flex h-[100svh] flex-col overflow-clip" : "flex flex-col"
          }
          aria-hidden={live || undefined}
        >
          <div className="relative z-20 mx-auto flex w-full max-w-screen-xl items-baseline justify-between px-5 pt-24 md:px-10 md:pt-28">
            <p className="text-gris-texto font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              Qué hacemos · El recorrido
            </p>
            <p className="text-gris-texto/70 hidden font-mono text-[0.7rem] tracking-[0.14em] uppercase md:block">
              Scrolleá para girar ↓
            </p>
          </div>

          {/* Niebla arriba y abajo del escenario: los tambores que entran o
              salen se desvanecen antes de pisar el encabezado o los apoyos.
              (z-10: sobre la escena, debajo de header/rieles/apoyos en z-20.) */}
          {live && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--color-gris-fondo) 20%, color-mix(in srgb, var(--color-gris-fondo) 65%, transparent), transparent)",
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-60"
                style={{
                  background:
                    "linear-gradient(to top, var(--color-gris-fondo) 30%, color-mix(in srgb, var(--color-gris-fondo) 70%, transparent), transparent)",
                }}
              />
            </>
          )}

          {live && geo ? (
            <>
              {/* ── Riel izquierdo: las estaciones, clickeables ──────────── */}
              <nav
                aria-hidden="true"
                className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 flex-col gap-1 lg:flex xl:left-8"
              >
                {TAMBORES.map((t, i) => (
                  <button
                    key={t.id}
                    ref={(el) => {
                      railRefs.current[i] = el;
                    }}
                    type="button"
                    tabIndex={-1}
                    data-active={i === 0}
                    onClick={() => saltarA(i)}
                    className="group text-gris-texto/55 hover:text-azul-principal data-[active=true]:text-azul-principal flex cursor-pointer items-center gap-2 py-0.5 text-left font-mono text-[0.62rem] tracking-[0.12em] uppercase transition-colors"
                  >
                    <span className="group-data-[active=true]:bg-verde-concepto inline-block h-1 w-1 rounded-full bg-current opacity-40 transition-all group-data-[active=true]:scale-150 group-data-[active=true]:opacity-100" />
                    {String(i + 1).padStart(2, "0")} {t.tambor}
                  </button>
                ))}
              </nav>

              {/* ── Riel derecho: progreso del recorrido ─────────────────── */}
              <div
                aria-hidden="true"
                className="absolute top-1/2 right-5 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex xl:right-9"
              >
                <span className="text-gris-texto/60 font-mono text-[0.6rem] tracking-[0.16em] uppercase [writing-mode:vertical-rl]">
                  Recorrido
                </span>
                <span className="bg-azul-principal/15 relative block h-36 w-px overflow-hidden">
                  <span
                    ref={fillRef}
                    className="bg-verde-concepto absolute inset-0 origin-top"
                    style={{ transform: "scaleY(0)" }}
                  />
                </span>
                <span
                  ref={pctRef}
                  className="text-azul-principal font-mono text-[0.62rem] tracking-[0.12em]"
                >
                  0%
                </span>
              </div>

              {/* ── Escena 3D: la torre entera dentro de una perspectiva ── */}
              <div
                className="relative min-h-0 flex-1"
                style={{ perspective: "1500px", perspectiveOrigin: "50% 42%" }}
              >
                {/* Picado de cámara fijo; adentro, la torre que se traslada. */}
                <div
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: "translate(-50%, -46%) rotateX(11deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    ref={towerRef}
                    className="will-change-transform"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Fotos flotando DENTRO de cada tambor (la "medusa" de la
                        referencia): no rotan — viajan con la torre con leve
                        parallax. En 3D quedan entre el texto esmerilado de
                        atrás y el texto nítido de adelante. */}
                    {TAMBORES.map((t, i) => (
                      <div
                        key={"foto-" + t.id}
                        ref={(el) => {
                          fotoRefs.current[i] = el;
                        }}
                        aria-hidden="true"
                        className="absolute will-change-transform"
                        style={{
                          transform: `translate(-50%, -50%) translateY(${i * geo.sp}px)`,
                        }}
                      >
                        <div className="relative h-[30vmin] w-[30vmin] overflow-hidden rounded-full opacity-95 shadow-[0_30px_80px_-30px_rgb(15_23_42/0.5)]">
                          <Image
                            src={t.foto}
                            alt=""
                            fill
                            sizes="30vmin"
                            className="object-cover"
                          />
                          <span className="bg-azul-principal/10 absolute inset-0" />
                        </div>
                      </div>
                    ))}

                    {TAMBORES.map((t, i) => {
                      const g = geo.drums[i];
                      return (
                        <div
                          key={t.id}
                          ref={(el) => {
                            drumRefs.current[i] = el;
                          }}
                          className="absolute will-change-transform"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: `translate(-50%, -50%) translateY(${i * geo.sp}px)`,
                          }}
                        >
                          {/* Aros del cilindro */}
                          {[-1, 1].map((lado) => (
                            <div
                              key={lado}
                              aria-hidden="true"
                              className="border-azul-principal/15 absolute rounded-full border"
                              style={{
                                width: geo.r * 2.06,
                                height: geo.r * 2.06,
                                left: -geo.r * 1.03,
                                top: -geo.r * 1.03,
                                transform: `translateY(${lado * g.f * 0.72}px) rotateX(90deg)`,
                              }}
                            />
                          ))}
                          {/* Chips con la frase de la línea, girando sobre la
                              banda; de espaldas se apagan (pintar). */}
                          {CHIP_ANGS.map((ang, k) => (
                            <div
                              key={"chip-" + k}
                              ref={(el) => {
                                chipRefs.current[i][k] = el;
                              }}
                              aria-hidden="true"
                              className="text-azul-principal/85 absolute w-[32ch] text-center font-mono text-[0.68rem] tracking-[0.14em] uppercase [backface-visibility:hidden]"
                              style={{
                                transform: `translate(-50%, -50%) rotateY(${ang}deg) translateZ(${geo.r + 2}px) translateY(${g.f * 0.62}px)`,
                                opacity: 0,
                              }}
                            >
                              {String(i + 1).padStart(2, "0")} · {t.frase}
                            </div>
                          ))}

                          {/* Rebanadas del nombre */}
                          {g.slices.map((ch, j) => (
                            <span
                              key={j}
                              ref={(el) => {
                                spanRefs.current[i][j] = el;
                              }}
                              className="font-display text-azul-principal absolute select-none font-extrabold"
                              style={{
                                fontSize: g.f,
                                lineHeight: 1,
                                transform: `translate(-50%, -50%) rotateY(${j * g.paso}deg) translateZ(${geo.r}px)`,
                              }}
                            >
                              {ch === " " ? " " : ch}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* ── Apoyos fijos al pie: se cruzan al cambiar de tambor ── */}
              <div
                ref={apoyoRef}
                className="relative z-20 mx-auto grid w-full max-w-screen-xl gap-5 px-5 pb-12 md:grid-cols-2 md:gap-10 md:px-10"
              >
                <div>
                  <p
                    ref={tituloRef}
                    data-torre-slot
                    className="text-azul-principal font-sans text-[0.95rem] font-semibold"
                  >
                    {TAMBORES[0].titulo}
                  </p>
                  <p
                    ref={fraseRef}
                    data-torre-slot
                    className="text-verde-concepto-texto font-display mt-2 max-w-[26ch] text-[1.3rem] leading-snug font-bold md:text-[1.5rem]"
                  >
                    {TAMBORES[0].frase}
                  </p>
                </div>
                <p
                  ref={detalleRef}
                  data-torre-slot
                  className="text-gris-texto max-w-[52ch] font-sans text-[0.95rem] leading-relaxed md:self-end md:justify-self-end md:text-[1.02rem]"
                >
                  {TAMBORES[0].detalle}
                </p>
              </div>
            </>
          ) : (
            /* ── Fallback plano: todas las estaciones apiladas ── */
            <div className="mx-auto w-full max-w-screen-xl px-5 pb-20 md:px-10">
              {TAMBORES.map((t, i) => (
                <article key={t.id} className="border-azul-principal/10 border-t py-12 first:border-t-0">
                  <p className="text-gris-texto font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                    {String(i + 1).padStart(2, "0")} / {String(TAMBORES.length).padStart(2, "0")}
                  </p>
                  <h3
                    className="font-display text-azul-principal mt-3 font-extrabold tracking-[-0.02em]"
                    style={{ fontSize: "clamp(1.9rem, 1rem + 4vw, 3.2rem)", lineHeight: 1.05 }}
                  >
                    {t.titulo}
                  </h3>
                  <p className="text-verde-concepto-texto font-display mt-4 max-w-[28ch] text-[1.15rem] leading-snug font-bold">
                    {t.frase}
                  </p>
                  <p className="text-gris-texto mt-3 max-w-[56ch] font-sans text-[0.98rem] leading-relaxed">
                    {t.detalle}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
