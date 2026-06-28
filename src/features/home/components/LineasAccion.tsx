"use client";

import { useRef, type ComponentType } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Lightbulb,
  School,
  Target,
  TrendingUp,
  Users,
  type IconProps,
} from "@/components/ui/icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Linea = {
  n: string;
  titulo: string;
  detalle: string;
  Icon: ComponentType<IconProps>;
};

// Las 7 líneas de acción de ED. Copy en voz de marca: lenguaje inclusivo
// ("las y los"), "estudiantes", sin "capacitar"/"formar" — ED acompaña,
// diseña y transforma. La salida de la sección conecta con Investigación.
const LINEAS: readonly Linea[] = [
  {
    n: "01",
    titulo: "Desarrollo Profesional y Transformación Docente",
    detalle:
      "Acompañamos a las y los docentes en un crecimiento profesional que transforma su práctica.",
    Icon: Users,
  },
  {
    n: "02",
    titulo: "Diseño Curricular y Arquitectura Pedagógica",
    detalle:
      "Diseñamos trayectos y secuencias que dan estructura al aprendizaje matemático.",
    Icon: Compass,
  },
  {
    n: "03",
    titulo: "Evaluación y Analítica Educativa",
    detalle:
      "Leemos datos y evidencia para comprender y enriquecer los procesos de aprendizaje.",
    Icon: TrendingUp,
  },
  {
    n: "04",
    titulo: "Recursos para desarrollar el pensamiento matemático",
    detalle:
      "Creamos materiales que despiertan el pensamiento matemático de las y los estudiantes.",
    Icon: Lightbulb,
  },
  {
    n: "05",
    titulo: "Consultoría Estratégica en Matemática Educativa",
    detalle:
      "Asesoramos las decisiones institucionales desde la matemática educativa.",
    Icon: Target,
  },
  {
    n: "06",
    titulo: "Investigación e Innovación",
    detalle:
      "Investigamos para que cada propuesta nazca de evidencia y vuelva al aula.",
    Icon: BookOpen,
  },
  {
    n: "07",
    titulo: "Soluciones Institucionales Integrales",
    detalle:
      "Articulamos procesos a la medida de cada institución, de principio a fin.",
    Icon: School,
  },
];

const CARD_W = 360; // px — fallback del ancho de carta (el real se mide en runtime)

/**
 * Líneas de acción — abanico de cartas.
 *
 * El título queda centrado detrás. A medida que se scrollea, las 7 cartas
 * suben desde abajo una a una y se asientan en un abanico que ocupa todo
 * el ancho máximo de la grilla, tapando el título.
 *
 * Desktop + motion → escenario sticky animado con GSAP (integrado con
 * Lenis vía el ticker global). Mobile / tablet / reduced-motion → grilla
 * estática legible (la clase .is-live se agrega pre-paint solo cuando hay
 * que animar, así no hay flash grilla→abanico).
 */
export function LineasAccion() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Con motion permitido se anima en todos lados: abanico horizontal en
    // desktop, pila vertical superpuesta en mobile/tablet. Reduced-motion cae a
    // la grilla estática.
    if (reduced) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const scroll = root.querySelector<HTMLElement>("[data-deck-scroll]");
    const stage = root.querySelector<HTMLElement>("[data-deck-stage]");
    const cta = root.querySelector<HTMLElement>("[data-deck-cta]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-deck-card]", root);
    if (!scroll || !stage || cards.length !== LINEAS.length) return;

    root.classList.add("is-live");
    if (!isDesktop) root.classList.add("is-stack");

    // Limpieza de listeners del tilt interactivo (se llenan dentro del ctx).
    const tiltCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const total = cards.length;
      const center = (total - 1) / 2; // índice central

      // Posición de reposo de cada carta según el dispositivo.
      let restX: (i: number) => number;
      let restY: (i: number) => number;
      let restRot: (i: number) => number;

      if (isDesktop) {
        // Desktop: ABANICO horizontal. El paso (spread) se calcula EN VIVO desde
        // el ancho del escenario y de la carta (responsiva, ver globals.css). Así,
        // al cambiar el ancho de la ventana se recalcula (ver onResize) y el
        // abanico NO se pasa de la pantalla. Margen cómodo a los costados.
        const stepNow = () => {
          const cardW = cards[0].offsetWidth || CARD_W;
          const half = stage.clientWidth / 2;
          const maxCenter = Math.max(120, half - cardW / 2 - 58);
          return (2 * maxCenter) / (total - 1);
        };
        restX = (i) => (i - center) * stepNow();
        restRot = (i) => (i - center) * 1.6;
        // Arco leve: las cartas de los extremos quedan apenas más abajo.
        restY = (i) => Math.pow(i - center, 2) * 4 - 8;
      } else {
        // Mobile/tablet: PILA VERTICAL superpuesta, ANCLADA ARRIBA. Cada carta
        // queda más abajo que la anterior, con un paso MENOR que su alto → se
        // superponen (asoma el encabezado de cada una; la última, entera).
        // Reservamos una BANDA INFERIOR para el CTA "Explorar…": la pila no
        // llega hasta abajo, así el CTA queda en aire limpio y no compite con
        // las cartas. El paso se mide para que la pila entre en ese espacio.
        const cardH = cards[0].offsetHeight || 300;
        const stageH = stage.clientHeight;
        const TOP_PAD = 36; // respiro arriba
        const CTA_BAND = 156; // banda inferior reservada al CTA (con aire)
        const usable = stageH - TOP_PAD - CTA_BAND;
        const V_STEP = Math.min(
          cardH * 0.5,
          Math.max(34, (usable - cardH) / (total - 1)),
        );
        restX = () => 0;
        restRot = (i) => (i - center) * 0.5; // fan muy sutil (pila vertical)
        // La carta se centra por CSS → restY es el offset desde el centro del
        // escenario. Anclamos la carta 0 en TOP_PAD y apilamos hacia abajo.
        restY = (i) => TOP_PAD + cardH / 2 + i * V_STEP - stageH / 2;
      }

      // Estado inicial: cada carta en su columna, fuera de cuadro por abajo.
      cards.forEach((card, i) => {
        gsap.set(card, {
          x: restX(i),
          y: restY(i) + 640,
          rotation: restRot(i) - 3,
          scale: 0.94,
          opacity: 0,
          zIndex: 10 + i,
        });
      });
      // El CTA de cierre arranca oculto: se revela al final del reparto.
      if (cta) gsap.set(cta, { opacity: 0, y: 24 });

      const seg = 1 / total;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scroll,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      // Cada carta sube desde abajo a su lugar (x ya fijo en su columna).
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            y: restY(i),
            rotation: restRot(i),
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            duration: seg * 0.85,
          },
          i * seg,
        );
      });
      // CTA: entra cuando aterriza la última carta (tramo final del scroll).
      if (cta) {
        tl.to(
          cta,
          {
            opacity: 1,
            y: 0,
            ease: "power3.out",
            duration: seg * 0.85,
          },
          (total - 1) * seg,
        );
      }

      // --- Tilt interactivo (solo desktop con puntero fino) ------------
      // Al pasar el mouse, la carta sube al frente y se inclina apenas
      // siguiendo el cursor (como una carta física que levantás de la mano),
      // así se lee sin volver a scrollear. GSAP del abanico vive en el <li>;
      // el tilt vive en la capa interna → los transforms se componen sin
      // pisarse. En mobile (touch) no aplica.
      if (isDesktop) {
      const TILT_MAX = 9; // grados máximos de inclinación
      const LIFT = -16; // px que "levanta" la carta
      const HOVER_SCALE = 1.05;

      cards.forEach((card) => {
        const inner = card.querySelector<HTMLElement>("[data-deck-inner]");
        if (!inner) return;

        gsap.set(inner, { transformPerspective: 900, transformOrigin: "center" });

        const tween = { duration: 0.5, ease: "power3.out" } as const;
        const rotX = gsap.quickTo(inner, "rotationX", tween);
        const rotY = gsap.quickTo(inner, "rotationY", tween);
        const moveY = gsap.quickTo(inner, "y", tween);
        // "scale" como atajo no es válido en quickTo → se separa por eje.
        const scaleX = gsap.quickTo(inner, "scaleX", tween);
        const scaleY = gsap.quickTo(inner, "scaleY", tween);
        const setScale = (v: number) => {
          scaleX(v);
          scaleY(v);
        };

        const baseZ = card.style.zIndex; // z del abanico fijado por GSAP

        const onEnter = () => {
          card.style.zIndex = "100";
          moveY(LIFT);
          setScale(HOVER_SCALE);
        };
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
          const py = (e.clientY - r.top) / r.height - 0.5;
          rotY(px * TILT_MAX * 2);
          rotX(-py * TILT_MAX * 2);
        };
        const onLeave = () => {
          card.style.zIndex = baseZ;
          rotX(0);
          rotY(0);
          moveY(0);
          setScale(1);
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        tiltCleanups.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });
      } // fin tilt (isDesktop)

      // Recalcular el spread del abanico al cambiar el ancho de la ventana: el
      // restX depende del ancho del escenario; sin esto, al achicar la ventana
      // el abanico (calculado con el ancho anterior) se pasa de la pantalla.
      // Solo toca x (alto/rotación no dependen del ancho). En mobile restX=0.
      let resizeRaf = 0;
      const onResize = () => {
        if (!isDesktop) return;
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => {
          cards.forEach((card, i) => gsap.set(card, { x: restX(i) }));
        });
      };
      window.addEventListener("resize", onResize);
      tiltCleanups.push(() => {
        cancelAnimationFrame(resizeRaf);
        window.removeEventListener("resize", onResize);
      });
    }, root);

    return () => {
      tiltCleanups.forEach((fn) => fn());
      ctx.revert();
      root.classList.remove("is-live");
      root.classList.remove("is-stack");
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-section="lineas"
      className="deck from-white to-gris-fondo relative bg-gradient-to-b"
      aria-label="Líneas de acción"
    >
      <div data-deck-scroll className="deck-scroll">
        <div
          data-deck-stage
          className="deck-stage relative mx-auto max-w-screen-xl px-5 py-24 md:px-10 md:py-28"
        >
          {/* Encabezado: en grilla va arriba centrado; en live el título se
              reubica al centro y la bajada abajo. */}
          <div className="deck-head text-center">
            <h2
              className="deck-title font-display text-azul-principal font-bold tracking-[-0.022em]"
              style={{
                fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
                lineHeight: 1.02,
              }}
            >
              Líneas de acción
            </h2>
            <p className="deck-caption text-gris-texto mx-auto mt-5 max-w-xl font-sans text-[0.97rem] leading-relaxed">
              Las áreas donde acompañamos, diseñamos y transformamos el
              aprendizaje de la matemática junto a las y los docentes.
            </p>
          </div>

          {/* Las cartas. */}
          <ul className="deck-cards mt-14 md:mt-16">
            {LINEAS.map(({ n, titulo, detalle, Icon }, i) => {
              const azulBase = i % 2 === 1;
              return (
                <li key={n} data-deck-card className="deck-card">
                  <div
                    data-deck-inner
                    className="deck-card-inner flex h-full flex-col overflow-hidden"
                  >
                  {/* Encabezado de la carta: etiqueta de acción + paginado. */}
                  <div className="flex items-start justify-between px-7 pt-6">
                    <span className="text-naranja-accion font-mono inline-flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.26em] uppercase">
                      <span
                        aria-hidden="true"
                        className="bg-naranja-accion block h-px w-5"
                      />
                      Línea {n}
                    </span>
                    <span className="text-azul-principal/20 font-mono text-[0.72rem] font-medium tabular-nums">
                      {n} / 07
                    </span>
                  </div>

                  {/* Título (héroe de la carta) + detalle. */}
                  <div className="flex flex-1 flex-col px-7 pt-5">
                    <h3 className="font-display text-azul-principal text-[1.32rem] leading-[1.12] font-bold tracking-[-0.012em]">
                      {titulo}
                    </h3>
                    <p className="text-gris-texto mt-3 font-sans text-[0.92rem] leading-relaxed">
                      {detalle}
                    </p>
                  </div>

                  {/* Base con el ícono de marca — identidad propia por línea. */}
                  <div
                    className={`relative mt-6 flex h-[5.5rem] items-center justify-center overflow-hidden lg:h-[8.5rem] ${
                      azulBase
                        ? "bg-azul-claro/25 text-azul-medio"
                        : "bg-verde-concepto/[0.12] text-verde-concepto"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-3 -bottom-3 h-24 w-24 opacity-50 [background-image:radial-gradient(circle,rgb(74_111_165/0.22)_2px,transparent_2.5px)] [background-size:14px_14px]"
                    />
                    <Icon size={52} strokeWidth={1.4} />
                  </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Salida → Investigación (no Contacto). CTA de cierre: en live
              aparece abajo-centro cuando ya salieron todas las cartas. */}
          <div
            data-deck-cta
            className="deck-cta mt-12 flex justify-center md:justify-start"
          >
            <Link
              href="/investigacion"
              className="group inline-flex items-center gap-3"
            >
              <span className="border-azul-principal/15 group-hover:border-naranja-accion group-hover:bg-naranja-accion inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 group-hover:text-white">
                <ArrowRight size={17} />
              </span>
              <span className="text-azul-principal group-hover:text-naranja-accion font-sans text-[0.93rem] font-medium tracking-wide transition-colors duration-500">
                Explorar nuestra investigación
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
