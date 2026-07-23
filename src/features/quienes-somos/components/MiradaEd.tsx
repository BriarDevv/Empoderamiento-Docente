"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * "Nuestra mirada" (sección 3 del sitemap de Quiénes somos) — CONSTELACIÓN.
 *
 * Rediseño inspirado en la lógica espacial de nominal.so ("How it works"),
 * traducida al lenguaje editorial de ED: un mapa conceptual claro con
 * "NUESTRA MIRADA" como núcleo y tres nodos conectados (01 Pensamiento
 * matemático · 02 Empoderamiento desde el saber · 03 Transformación
 * educativa). El scroll conduce una cámara sobria (translate + scale del
 * escenario) que se acerca a cada nodo; su texto se revela en la zona
 * derecha de lectura y desde el nodo emergen FICHAS conceptuales que suben
 * con deriva lateral, sincronizadas con el scrub (reversibles). Al final la
 * cámara regresa al mapa completo, el núcleo se convierte en la SÍNTESIS y
 * las líneas se ramifican en una red incipiente (puntos nuevos) que hace de
 * puente hacia «La red tiene nombres» (ImpulsanEd, intacta).
 *
 * Colores del manual, solo acentos (fondo constante marfil/claro):
 *  01 verde-concepto · 02 azul-medio · 03 naranja-accion en dosis mínimas
 *  (mismo uso decorativo puntual que ya tienen el nodo "Hoy" y las cápsulas
 *  de progreso; el naranja dominante sigue reservado a CTAs).
 *
 * A11y / reduced-motion: la constelación (SVG + nodos visuales) es
 * decorativa (aria-hidden) y se oculta sin motion; el contenido real vive
 * en bloques en orden lógico del DOM que quedan apilados en flow. Las
 * fichas son <li> sin semántica de botón ni cursor pointer.
 *
 * El CTA «Mirá cómo lo hacemos» sigue retirado de esta transición (ruta
 * /que-hacemos viva en el nav).
 */

type Perspectiva = {
  id: string;
  accent: string;
  /**
   * Color del texto de la palabra destacada. Nulo = la palabra va en navy
   * con SUBRAYADO decorativo del acento (el naranja no alcanza 3:1 como
   * texto sobre el fondo claro; como regla decorativa no necesita ratio).
   */
  acentoTexto: string | null;
  label: string;
  /** Frase principal; `tachado` es el fragmento que se tacha (si existe). */
  fraseAntes: string;
  tachado?: string;
  frasePunto: string;
  /** Frase afirmativa partida para acentuar `afirmativaAccent`. */
  afirmativaPre: string;
  afirmativaAccent: string;
  afirmativaPost: string;
  apoyo: string;
  fichas: readonly string[];
};

const PERSPECTIVAS: readonly Perspectiva[] = [
  {
    id: "01",
    accent: "#1f9a78", // verde-concepto
    acentoTexto: "#1f9a78",
    label: "Pensamiento matemático",
    fraseAntes: "La matemática no es solo ",
    tachado: "resolver cuentas",
    frasePunto: ".",
    afirmativaPre: "Es una manera de ",
    afirmativaAccent: "pensar, argumentar y actuar",
    afirmativaPost: " en el mundo.",
    apoyo:
      "El contenido curricular permite construir estrategias, tomar decisiones y desarrollar herramientas dentro y fuera del aula.",
    fichas: [
      "Construir estrategias",
      "Argumentar",
      "Tomar decisiones",
      "Resolver problemas",
      "Actuar dentro y fuera del aula",
    ],
  },
  {
    id: "02",
    accent: "#4a6fa5", // azul-medio
    // «transformar» conserva el verde ya aprobado en el lenguaje del sitio;
    // el nodo se diferencia del 01 por su acento azul-medio.
    acentoTexto: "#1f9a78",
    label: "Empoderamiento desde el saber",
    fraseAntes: "El poder no es ",
    tachado: "sobre otras personas",
    frasePunto: ".",
    afirmativaPre: "Es poder para ",
    afirmativaAccent: "transformar",
    afirmativaPost: ".",
    apoyo:
      "Saber, reflexión y experiencia construyen en el cuerpo docente la convicción de «puedo transformar».",
    fichas: [
      "Saber",
      "Reflexión",
      "Experiencia",
      "Convicción para transformar",
      "Mirada no deficitaria",
    ],
  },
  {
    id: "03",
    accent: "#e07a2f", // naranja-accion (dosis mínima, señal de acento)
    acentoTexto: null, // navy + subrayado naranja (contraste AA garantizado)
    label: "Transformación educativa",
    fraseAntes: "La educación es un derecho",
    frasePunto: ".",
    afirmativaPre: "Transformarla es ",
    afirmativaAccent: "ampliar posibilidades",
    afirmativaPost: ".",
    apoyo:
      "Pensamos la educación desde la práctica, la inclusión, la justicia social y la construcción colectiva del conocimiento.",
    fichas: [
      "Perspectiva de género",
      "Inclusión",
      "Justicia social",
      "Construcción colectiva del conocimiento",
      "Mirada no deficitaria del profesorado",
    ],
  },
] as const;

/** Posiciones (en % del escenario) del núcleo y los tres nodos. */
const CENTRO = { x: 50, y: 46 } as const;
const NODOS = [
  { x: 24, y: 30 },
  { x: 76, y: 36 },
  { x: 40, y: 74 },
] as const;

/**
 * Geometría SVG en viewBox 0 0 160 90 (misma proporción que los desktops
 * objetivo): así el estirado de preserveAspectRatio="none" es casi uniforme
 * y el draw-in por dasharray funciona SIN vector-effect (con non-scaling-
 * stroke, Chromium dashea en espacio de pantalla y el truco de
 * getTotalLength se rompe: las líneas "ocultas" quedaban como guiones).
 * Coordenadas = (x% * 1.6, y% * 0.9) de las posiciones de los nodos.
 */
const LINEAS = [
  "M 80 41.4 Q 57.6 36 38.4 27",
  "M 80 41.4 Q 102.4 38.7 121.6 32.4",
  "M 80 41.4 Q 70.4 55.8 64 66.6",
] as const;

/** Arcos tenues entre nodos (el sistema, siempre insinuado). */
const ARCOS = [
  "M 38.4 27 Q 80 19.8 121.6 32.4",
  "M 121.6 32.4 Q 99.2 54 64 66.6",
  "M 64 66.6 Q 41.6 48.6 38.4 27",
] as const;

/** Ramificaciones finales: de cada nodo nacen conexiones nuevas (fase red). */
const RAMAS = [
  { d: "M 38.4 27 L 22.4 18.9", fin: { x: 22.4, y: 18.9 } },
  { d: "M 38.4 27 L 24 35.1", fin: { x: 24, y: 35.1 } },
  { d: "M 38.4 27 L 49.6 15.3", fin: { x: 49.6, y: 15.3 } },
  { d: "M 121.6 32.4 L 139.2 24.3", fin: { x: 139.2, y: 24.3 } },
  { d: "M 121.6 32.4 L 140.8 40.5", fin: { x: 140.8, y: 40.5 } },
  { d: "M 121.6 32.4 L 112 19.8", fin: { x: 112, y: 19.8 } },
  { d: "M 64 66.6 L 46.4 75.6", fin: { x: 46.4, y: 75.6 } },
  { d: "M 64 66.6 L 81.6 76.5", fin: { x: 81.6, y: 76.5 } },
  { d: "M 64 66.6 L 43.2 61.2", fin: { x: 43.2, y: 61.2 } },
] as const;

/** Zoom de cámara y punto de pantalla donde aterriza cada nodo activo. */
const CAMARA = [
  { scale: 1.5, tx: 0.25, ty: 0.46 },
  { scale: 1.5, tx: 0.23, ty: 0.42 },
  { scale: 1.5, tx: 0.24, ty: 0.46 },
] as const;

const NEUTRO_DOT = "rgba(31,45,77,0.28)";

export function MiradaEd() {
  const rootRef = useRef<HTMLElement | null>(null);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const zone = zoneRef.current;
    if (!root || !zone || reduced) return;

    // Los tweens del indicador nacen en onUpdate (async): quedan fuera del
    // registro de gsap.context, así que se matan a mano en el cleanup.
    let dotEls: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      // Scope a root: evita colisiones con data-attrs de otras secciones.
      const q = (sel: string) => root.querySelector<HTMLElement>(sel);
      const qa = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, root);

      const stage = q("[data-stage]");
      const centro = q("[data-centro]");
      const sintesis = q("[data-sintesis]");
      const puentes = qa("[data-puente]");
      const dots = qa("[data-mirada-dot]");
      dotEls = dots;
      const nodoCores = qa("[data-nodo-core]");
      const nodoDots = qa("[data-nodo-dot]");
      const nodoHalos = qa("[data-nodo-halo]");
      const nodoNums = qa("[data-nodo-num]");
      const nodoLabels = qa("[data-nodo-label]");
      const detalles = qa("[data-detalle]");
      const strikes = qa("[data-strike]");
      const fichaGrupos = qa("[data-fichas]");
      const lineas = gsap.utils.toArray<SVGPathElement>("[data-linea]", root);
      const arcos = gsap.utils.toArray<SVGPathElement>("[data-arco]", root);
      const ramas = gsap.utils.toArray<SVGPathElement>("[data-rama]", root);
      const ramdots = gsap.utils.toArray<SVGCircleElement>("[data-ramdot]", root);
      if (!stage || !centro || !sintesis || detalles.length !== 3) return;

      // clientWidth (sin scrollbar): la cámara aterriza donde el usuario ve.
      const W = () => document.documentElement.clientWidth;
      const H = () => window.innerHeight;

      // ── Acople de la lámina clara sobre el navy de Origen (se conserva) ──
      // El origin va en un set previo: en un fromTo con scrub GSAP no lo
      // aplica en el frame 0 si viaja solo en el "to" (pitfall documentado
      // en OrigenEd). Sin esto, escalar una sección de 780svh desde el
      // centro abre una banda de fondo crudo sobre el navy anterior.
      gsap.set(root, { transformOrigin: "50% 0%" });
      gsap.fromTo(
        root,
        { scale: 0.97, y: 36 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 96%", end: "top 14%", scrub: true },
        },
      );

      // ── Estados iniciales (solo con motion) ──────────────────────────────
      gsap.set(stage, { transformOrigin: "0 0" });
      gsap.set([centro, sintesis], { position: "absolute", inset: 0 });
      gsap.set(sintesis, { autoAlpha: 0 });
      gsap.set(qa("[data-centro-bit]"), { autoAlpha: 0, y: 22 });
      gsap.set(puentes, { autoAlpha: 0, y: 18 });

      // Detalles: zona de lectura derecha (viewport-anclada, no escala).
      detalles.forEach((d) => {
        gsap.set(d, { position: "absolute", inset: 0, pointerEvents: "none" });
        const inner = d.querySelector<HTMLElement>("[data-detalle-inner]");
        if (inner) {
          gsap.set(inner, {
            position: "absolute",
            left: "auto",
            right: "6vw",
            top: "50%",
            yPercent: -50,
            width: "min(32vw, 26rem)",
            textAlign: "left",
            margin: 0,
            autoAlpha: 0,
          });
        }
      });
      gsap.set(strikes, { scaleX: 0, transformOrigin: "left center" });

      // Fichas: capas absolutas que nacen bajo el viewport y suben.
      fichaGrupos.forEach((g) => {
        gsap.set(g, { position: "absolute", inset: 0, pointerEvents: "none" });
        const items = gsap.utils.toArray<HTMLElement>("[data-ficha]", g);
        items.forEach((f, k) => {
          gsap.set(f, {
            position: "absolute",
            left: `${32 + (k % 3) * 7}vw`,
            top: 0,
            maxWidth: "12rem",
            rotation: k % 2 === 0 ? -1.2 : 1.4,
            y: H() * 1.05,
            autoAlpha: 0,
          });
        });
      });

      // Nodos: nacen apagados y chicos; líneas sin dibujar; ramas ocultas.
      gsap.set(nodoCores, { autoAlpha: 0, scale: 0.6 });
      gsap.set(nodoHalos, { autoAlpha: 0 });
      [...lineas, ...ramas].forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(arcos, { autoAlpha: 0 });
      gsap.set(ramdots, { scale: 0, transformOrigin: "center", autoAlpha: 0 });

      // ── Indicador de progreso (5 momentos, color = principio activo) ─────
      const FASE_COLOR = ["#4a6fa5", "#1f9a78", "#4a6fa5", "#e07a2f", "#1f2d4d"];
      let lastIdx = -1;
      const setDot = (p: number) => {
        const bounds = [0.108, 0.288, 0.467, 0.646];
        let idx = 0;
        for (let i = 0; i < bounds.length; i++) if (p >= bounds[i]) idx = i + 1;
        if (idx === lastIdx) return;
        lastIdx = idx;
        dots.forEach((d, i) => {
          gsap.to(d, {
            width: i === idx ? 26 : 8,
            backgroundColor: i === idx ? FASE_COLOR[idx] : "rgba(31,45,77,0.18)",
            duration: 0.35,
            ease: "power2.out",
          });
        });
      };

      // ── Timeline maestro (12 unidades sobre toda la zona) ────────────────
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: zone,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setDot(self.progress),
        },
      });

      // FASE 0 — el mapa se presenta: núcleo, líneas, nodos.
      tl.to(qa("[data-centro-bit]"), { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.12, ease: "power3.out" }, 0.1);
      lineas.forEach((p, i) => {
        tl.to(p, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" }, 0.35 + i * 0.12);
      });
      tl.to(nodoCores, { autoAlpha: 0.55, scale: 1, duration: 0.4, stagger: 0.12, ease: "power3.out" }, 0.55);
      tl.to(arcos, { autoAlpha: 0.12, duration: 0.35 }, 0.85);

      // Núcleo se retira antes del primer acercamiento.
      tl.to(centro, { autoAlpha: 0, duration: 0.28 }, 1.02);

      // FASES 1-5 — acercamiento, revelado y salida de cada principio.
      PERSPECTIVAS.forEach((p, i) => {
        const S = 1.3 + i * 2.15;
        const cam = CAMARA[i];
        const nodo = NODOS[i];

        // Cámara: el nodo activo aterriza en la zona izquierda de lectura.
        tl.to(
          stage,
          {
            scale: cam.scale,
            x: () => cam.tx * W() - cam.scale * (nodo.x / 100) * W(),
            y: () => cam.ty * H() - cam.scale * (nodo.y / 100) * H(),
            duration: 0.55,
          },
          S,
        );

        // Estados del sistema: activo pleno, recorridos como memoria (0.55),
        // futuros insinuados (0.25) — el color solo no identifica al activo.
        nodoCores.forEach((core, j) => {
          const target = j === i ? 1 : j < i ? 0.55 : 0.25;
          tl.to(core, { autoAlpha: target, scale: j === i ? 1.08 : 1, duration: 0.3 }, S + 0.22);
        });
        // Nodo activo: acento + halo pre-pintado (solo opacity, compositado).
        tl.to(nodoDots[i], { backgroundColor: p.accent, duration: 0.3 }, S + 0.22);
        if (nodoHalos[i]) tl.to(nodoHalos[i], { autoAlpha: 1, duration: 0.3 }, S + 0.22);
        tl.to(nodoNums[i], { color: p.accent, duration: 0.3 }, S + 0.22);
        tl.to(lineas[i], { stroke: p.accent, opacity: 1, duration: 0.35 }, S + 0.22);

        // Zona de lectura (derecha).
        const inner = detalles[i].querySelector<HTMLElement>("[data-detalle-inner]");
        if (inner) {
          tl.fromTo(
            inner,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" },
            S + 0.5,
          );
        }
        if (strikes[i]) {
          tl.to(strikes[i], { scaleX: 1, duration: 0.4, ease: "power2.out" }, S + 0.85);
        }

        // Fichas: nacen cerca del nodo (abajo), suben con deriva a la derecha.
        // Movimiento (y/x) y opacidad viajan en tweens separados para que
        // ningún par de tweens escriba la misma propiedad en tramos
        // superpuestos (scrub estable en ambas direcciones). El timing
        // encierra TODO el grupo dentro de su fase (última ficha muere en
        // S+2.06 < S+2.15) con ~3-4 visibles a la vez.
        const items = gsap.utils.toArray<HTMLElement>("[data-ficha]", fichaGrupos[i]);
        items.forEach((f, k) => {
          const at = S + 0.55 + k * 0.19;
          tl.fromTo(
            f,
            { y: () => H() * 1.05 },
            { y: () => -H() * 0.32, x: () => W() * 0.03, duration: 0.75, ease: "none" },
            at,
          );
          tl.to(f, { autoAlpha: 1, duration: 0.14, ease: "none" }, at);
          tl.to(f, { autoAlpha: 0, duration: 0.2, ease: "none" }, at + 0.55);
        });

        // Salida: lectura se repliega; el halo del activo se apaga y el nodo
        // queda como memoria (recorrido).
        if (inner) tl.to(inner, { autoAlpha: 0, y: -16, duration: 0.24 }, S + 1.9);
        if (nodoHalos[i]) tl.to(nodoHalos[i], { autoAlpha: 0, duration: 0.25 }, S + 1.92);
        tl.to(nodoCores[i], { autoAlpha: 0.78, scale: 1, duration: 0.25 }, S + 1.92);
        tl.to(lineas[i], { opacity: 0.55, duration: 0.25 }, S + 1.92);
      });

      // FASE 6 — regreso al mapa completo + síntesis en el núcleo. Los
      // labels de los nodos se atenúan (los puntos conservan su acento):
      // la síntesis centrada no compite con texto navy de fondo.
      tl.to(stage, { x: 0, y: 0, scale: 1, duration: 0.6 }, 7.75);
      tl.to(nodoCores, { autoAlpha: 0.85, duration: 0.35 }, 8.05);
      tl.to(nodoLabels, { autoAlpha: 0.3, duration: 0.35 }, 8.05);
      tl.to(arcos, { autoAlpha: 0.2, duration: 0.35 }, 8.05);
      tl.to(sintesis, { autoAlpha: 1, duration: 0.45 }, 8.5);
      tl.fromTo(
        q("[data-sintesis-frase]"),
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
        8.55,
      );

      // FASE 7 — la mirada se ramifica: la red incipiente y el puente.
      ramas.forEach((r, k) => {
        tl.to(r, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 9.25 + k * 0.05);
      });
      tl.to(ramdots, { scale: 1, autoAlpha: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" }, 9.45);
      tl.to(puentes[0], { autoAlpha: 1, y: 0, duration: 0.4 }, 9.95);
      tl.to(puentes[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 10.45);
      tl.to({}, { duration: 1.1 }, 10.9); // respiro antes de soltar el pin
      setDot(0);
    }, root);

    return () => {
      gsap.killTweensOf(dotEls);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="mirada"
      className="bg-grain-light to-gris-fondo/60 relative z-30 -mt-[4svh] overflow-clip rounded-t-[2.5rem] bg-gradient-to-b from-white shadow-[0_-24px_60px_-30px_rgb(15_23_42/0.35)]"
      aria-label="Nuestra mirada"
    >
      <div ref={zoneRef} className="relative h-[780svh] motion-reduce:h-auto">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden motion-reduce:static motion-reduce:h-auto">
          {/* ── Escenario decorativo: constelación (líneas + nodos) ─────────
              Es la capa que la "cámara" recorre. Decorativa: el contenido
              real vive en los bloques de texto de abajo. ── */}
          <div
            data-stage
            aria-hidden="true"
            className="absolute inset-0 will-change-transform motion-reduce:hidden"
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 160 90"
              preserveAspectRatio="none"
            >
              {ARCOS.map((d, i) => (
                <path
                  key={`arco-${i}`}
                  data-arco
                  d={d}
                  fill="none"
                  stroke="#1f2d4d"
                  strokeWidth="0.12"
                  strokeDasharray="0.35 0.95"
                />
              ))}
              {LINEAS.map((d, i) => (
                <path
                  key={`linea-${i}`}
                  data-linea
                  d={d}
                  fill="none"
                  stroke="rgba(31,45,77,0.32)"
                  strokeWidth="0.16"
                  strokeLinecap="round"
                />
              ))}
              {RAMAS.map((r, i) => (
                <path
                  key={`rama-${i}`}
                  data-rama
                  d={r.d}
                  fill="none"
                  stroke="rgba(31,45,77,0.35)"
                  strokeWidth="0.13"
                  strokeLinecap="round"
                />
              ))}
              {RAMAS.map((r, i) => (
                <circle
                  key={`ramdot-${i}`}
                  data-ramdot
                  cx={r.fin.x}
                  cy={r.fin.y}
                  r="0.5"
                  fill="#4a6fa5"
                />
              ))}
            </svg>

            {/* Nodos (wrapper posiciona; el core anima — GSAP no pisa el
                translate de centrado) */}
            {PERSPECTIVAS.map((p, i) => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${NODOS[i].x}%`,
                  top: `${NODOS[i].y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  data-nodo-core={i}
                  className="flex items-center gap-3 will-change-transform"
                >
                  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                    {/* Halo pre-pintado: solo se anima su opacidad */}
                    <span
                      data-nodo-halo
                      className="absolute -inset-[7px] rounded-full"
                      style={{ backgroundColor: `${p.accent}1f` }}
                    />
                    <span
                      data-nodo-dot
                      className="relative block h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: NEUTRO_DOT }}
                    />
                  </span>
                  <span
                    data-nodo-num
                    className="text-azul-principal/60 font-mono text-[0.8rem] font-medium tracking-[0.18em]"
                  >
                    {p.id}
                  </span>
                  <span
                    data-nodo-label
                    className="font-display text-azul-principal text-[1.02rem] font-semibold whitespace-nowrap md:text-[1.15rem]"
                  >
                    {p.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Núcleo: apertura del mapa ─────────────────────────────────── */}
          <div
            data-centro
            className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
          >
            <span
              data-centro-bit
              className="text-gris-texto font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase"
            >
              Nuestra mirada
            </span>
            <h2
              data-centro-bit
              className="font-display text-azul-principal mt-5 max-w-[16ch] text-balance font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.1rem, 1rem + 3.6vw, 3.6rem)", lineHeight: 1.08 }}
            >
              Una misma mirada, tres principios.
            </h2>
            <p
              data-centro-bit
              className="text-gris-texto mt-5 max-w-[38ch] font-sans text-[1.02rem] leading-relaxed md:text-[1.1rem]"
            >
              Pensamiento matemático, saber y transformación.
            </p>
          </div>

          {/* ── Zonas de lectura + fichas por principio ───────────────────── */}
          {PERSPECTIVAS.map((p, i) => (
            <div key={p.id} className="contents">
              <div
                data-detalle={i}
                className="motion-reduce:py-14"
              >
                <div
                  data-detalle-inner
                  className="mx-auto max-w-xl px-6 text-center motion-safe:px-0"
                >
                  {/* Barra de acento decorativa: el color identifica al
                      principio sin comprometer el contraste del texto. */}
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-3 block h-[3px] w-8 rounded-full motion-safe:mx-0"
                    style={{ backgroundColor: p.accent }}
                  />
                  <span className="text-azul-principal/75 font-mono text-[0.78rem] font-medium tracking-[0.24em] uppercase">
                    {p.id} — {p.label}
                  </span>
                  <h3
                    className="font-display text-azul-principal mt-4 font-bold tracking-[-0.02em]"
                    style={{ fontSize: "clamp(1.7rem, 1rem + 1.6vw, 2.4rem)", lineHeight: 1.14 }}
                  >
                    {p.fraseAntes}
                    {p.tachado ? (
                      <span className="relative inline-block whitespace-nowrap">
                        <span className="text-azul-principal/70">{p.tachado}</span>
                        <span
                          data-strike
                          aria-hidden="true"
                          className="bg-azul-principal/60 absolute top-1/2 left-0 h-[0.07em] w-full -translate-y-1/2 rounded-full"
                        />
                      </span>
                    ) : null}
                    {p.frasePunto}
                  </h3>
                  <p
                    className="font-display text-azul-principal mt-3 font-semibold"
                    style={{ fontSize: "clamp(1.25rem, 0.9rem + 1vw, 1.7rem)", lineHeight: 1.25 }}
                  >
                    {p.afirmativaPre}
                    {p.acentoTexto ? (
                      <span style={{ color: p.acentoTexto }}>{p.afirmativaAccent}</span>
                    ) : (
                      <span className="relative inline-block">
                        {p.afirmativaAccent}
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-[0.06em] left-0 h-[0.09em] w-full rounded-full"
                          style={{ backgroundColor: p.accent }}
                        />
                      </span>
                    )}
                    {p.afirmativaPost}
                  </p>
                  <p className="text-gris-texto mt-4 max-w-[46ch] font-sans text-[0.98rem] leading-relaxed md:text-[1.04rem]">
                    {p.apoyo}
                  </p>
                </div>
              </div>

              {/* Fichas conceptuales: capas de pensamiento que nacen del nodo
                  activo y suben. Sin semántica interactiva. */}
              <ul
                data-fichas={i}
                className="m-0 flex list-none flex-wrap items-center justify-center gap-3 px-6 pb-10 motion-reduce:mx-auto motion-reduce:max-w-xl"
              >
                {p.fichas.map((f, k) => (
                  <li
                    key={f}
                    data-ficha
                    className="border-azul-principal/12 rounded-xl border bg-white/90 px-5 py-3 font-sans text-[0.95rem] font-medium shadow-[0_10px_30px_-18px_rgb(31_45_77/0.35)] will-change-transform"
                    style={{
                      color: "#1f2d4d",
                      borderLeft: `3px solid ${p.accent}`,
                      transitionDelay: `${k * 40}ms`,
                    }}
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Síntesis + puente hacia la red ────────────────────────────── */}
          <div
            data-sintesis
            className="flex h-full flex-col items-center justify-center px-6 text-center motion-reduce:h-auto motion-reduce:py-24"
          >
            <p
              data-sintesis-frase
              className="font-display text-azul-principal max-w-[24ch] text-balance font-bold tracking-[-0.02em]"
              style={{ fontSize: "clamp(1.8rem, 1rem + 2.4vw, 3rem)", lineHeight: 1.16 }}
            >
              Pensamiento matemático, saber y transformación forman{" "}
              <span className="text-verde-concepto">una misma mirada</span>.
            </p>
            <p
              data-puente
              className="text-azul-principal mt-8 max-w-[36ch] font-sans text-[1.05rem] leading-relaxed font-medium md:text-[1.15rem]"
            >
              Una mirada así no se construye desde una sola voz.
            </p>
            <p
              data-puente
              className="text-gris-texto mt-3 max-w-[44ch] font-sans text-[0.98rem] leading-relaxed md:text-[1.05rem]"
            >
              Se sostiene en una red de especialistas, trayectorias y
              experiencias diversas.
            </p>
          </div>

          {/* Indicador de progreso: mapa · 01 · 02 · 03 · síntesis */}
          <div
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2.5 motion-reduce:hidden"
            aria-hidden="true"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} data-mirada-dot className="bg-azul-principal/18 h-2 w-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
