"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MathField } from "@/components/ui/MathField";
import {
  ArrowUpRight,
  Users,
  Lightbulb,
  School,
  TrendingUp,
  Compass,
} from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Contacto como EXPERIENCIA DE UNA SOLA PANTALLA: acá no se scrollea, se
 * TRANSFORMA. Los estados viven apilados en el mismo viewport y morfean uno
 * en otro, en cadena y de ida:
 *
 *  0 · HERO — "Hablemos." gigante y EDITORIAL (izquierda, ancho total, en el
 *      lenguaje del hero de Qué es ED). La palabra sola: nada de eyebrow,
 *      bajada, botón ni hint. NO es una pantalla que haya que descartar: no
 *      pide ningún gesto, dura ~1,4s y se desarma SOLA. Antes era un peaje
 *      (scroll o "Empezar" para pasar) que cobraba un gesto y no entregaba
 *      nada nuevo — el titular repetía lo que decía la pantalla siguiente.
 *
 *      Tampoco hay ya piezas flotantes con contenido institucional que VOLABAN
 *      y se convertían en las tarjetas de tema: era un truco lindo pero
 *      mentiroso — "Presencia · Chile, México…" no se transforma en "Formación
 *      y acompañamiento", es otro contenido disfrazado de la misma materia. Y
 *      cinco cajas iguales alrededor de una palabra son un tablero de
 *      post-its, no una composición. Quedan solo las tarjetas que son.
 *  1 · APERTURA — el desarme: "Hablemos." NO se dispersa: VIAJA. Se achica
 *      hasta su lugar definitivo como titular del selector, y las tarjetas de
 *      tema entran en cascada a su alrededor. Por eso hay un solo titular
 *      acomodándose y no dos diciendo lo mismo — la palabra es la semilla del
 *      layout, no un cartel previo.
 *  2 · FORMULARIO — al elegir tema, la tarjeta elegida viaja (ghost FLIP)
 *      hasta el chip del formulario y los campos suben en cascada. "Cambiar
 *      tema" vuelve al selector sin perder lo tipeado.
 *  3 · CIERRE — al enviar: «Cada propuesta empieza con una conversación.»
 *
 * Lo secundario del sitemap (otros canales + compartir perfil, menor
 * jerarquía) es la BARRA fija de abajo, presente en todos los estados.
 *
 * Durante la intro el scroll queda quieto (los ghosts son position:fixed y un
 * scroll a mitad de vuelo los despega de su destino), pero NO con
 * `body.overflow = hidden`: eso saca la barra, ensancha el viewport y hace
 * saltar todo el contenido centrado al soltarlo. Lo frenan los handlers en
 * captura. Y si alguien no la quiere mirar, el gesto la SALTEA (saltarIntro)
 * en vez de quedar tragado — la intro se muestra, no se impone.
 *
 * Envío sin backend todavía: arma un mailto: con asunto y cuerpo precargados.
 * Cuando se integre Supabase se reemplaza por un insert (confirmar schema
 * antes — AGENTS.md §12).
 *
 * Reduced-motion: se entra directo al selector, sin intro ni vuelos. El fondo
 * de nodos (MathField) queda vivo detrás siempre.
 */

const TEMAS = [
  {
    key: "formacion",
    titulo: "Formación y acompañamiento",
    detalle: "Trayectos, asesorías y trabajo con escuelas.",
    Icon: Users,
  },
  {
    key: "investigacion",
    titulo: "Investigación",
    detalle: "Líneas de estudio y colaboración académica.",
    Icon: Lightbulb,
  },
  {
    key: "alianzas",
    titulo: "Alianzas institucionales",
    detalle: "Convenios con organizaciones y gobiernos.",
    Icon: School,
  },
  {
    key: "prensa",
    titulo: "Prensa y difusión",
    detalle: "Entrevistas, notas y comunicación.",
    Icon: TrendingUp,
  },
  {
    key: "otra",
    titulo: "Otra consulta",
    detalle: "Todo lo que no entra en las anteriores.",
    Icon: Compass,
  },
] as const;

type TemaKey = (typeof TEMAS)[number]["key"];
type Vista = "hero" | "apertura" | "formulario" | "cierre";

// Un solo titular para toda la experiencia: nace gigante en el hero y aterriza
// como encabezado del selector. No hay un segundo titular.
const TITULO = "Hablemos.";

export function ContactoExperiencia() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [vista, setVista] = useState<Vista>("hero");
  const [tema, setTema] = useState<TemaKey | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [introListo, setIntroListo] = useState(false);
  const animando = useRef(false);
  const introVivo = useRef(true);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const desarmeTl = useRef<gsap.core.Timeline | null>(null);
  const ghosts = useRef<HTMLElement[]>([]);

  const temaActivo = TEMAS.find((t) => t.key === tema);
  const mailtoPerfil = `mailto:${siteConfig.contacto.email}?subject=${encodeURIComponent(
    "[Web] Comparto mi perfil",
  )}`;

  const panel = (v: Vista) =>
    rootRef.current?.querySelector<HTMLElement>(`[data-panel="${v}"]`) ?? null;

  // Los ghosts viven en <body> (position:fixed), fuera del ctx de GSAP: si la
  // intro se saltea o el componente se desmonta a mitad de vuelo, nadie más
  // los saca.
  const limpiarGhosts = () => {
    ghosts.current.forEach((g) => g.remove());
    ghosts.current = [];
  };

  // Fin de la intro (por completarse o por salteo): se sueltan los listeners
  // que retenían el scroll. NO se toca `body.overflow` ni se fuerza el top —
  // ver el porqué en el efecto de entrada.
  const finIntro = () => {
    introVivo.current = false;
    animando.current = false;
    limpiarGhosts();
    setIntroListo(true);
  };

  // ── HERO → APERTURA: el desarme (viaje de ida) ──────────────────────────
  const desarmar = () => {
    if (animando.current) return;
    const root = rootRef.current;
    if (!root) return;
    setVista("apertura");

    if (reduced) {
      gsap.set(panel("hero"), { autoAlpha: 0 });
      gsap.set(panel("apertura"), { autoAlpha: 1 });
      finIntro();
      return;
    }

    animando.current = true;
    const cards = gsap.utils.toArray<HTMLElement>("[data-tema-card]");
    const head = gsap.utils.toArray<HTMLElement>("[data-ap-head]");

    // preparar la apertura: visible como capa pero con TODO oculto, para que
    // el desarme la vaya encendiendo por partes
    gsap.set(panel("apertura"), { autoAlpha: 1 });
    gsap.set(cards, { autoAlpha: 0 });
    gsap.set(head, { autoAlpha: 0 });
    gsap.set("[data-ap-under]", { scaleX: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(panel("hero"), { autoAlpha: 0 });
        finIntro();
      },
    });
    desarmeTl.current = tl;

    // ── "Hablemos." VIAJA (no se dispersa) ────────────────────────────────
    // Es el mismo titular: se achica y se acomoda arriba del selector. El
    // ghost se anima por SCALE (no por font-size, que es layout) desde el
    // tamaño del hero hasta el del encabezado; con la misma familia, peso,
    // tracking y line-height en los dos, la razón de font-size alcanza para
    // que el ghost calce clavado sobre ambos.
    const srcTit = root.querySelector<HTMLElement>("[data-hero-titulo]");
    const dstTit = root.querySelector<HTMLElement>("[data-ap-titulo]");
    const h2 = root.querySelector<HTMLElement>("[data-ap-h2]");

    if (srcTit && dstTit && h2) {
      const s = srcTit.getBoundingClientRect();
      const d = dstTit.getBoundingClientRect();
      const cs = getComputedStyle(dstTit);
      const fsSrc = parseFloat(getComputedStyle(srcTit).fontSize);
      const fsDst = parseFloat(cs.fontSize);
      const ratio = fsDst > 0 ? fsSrc / fsDst : 1;

      const gt = document.createElement("div");
      gt.textContent = TITULO;
      gt.setAttribute("aria-hidden", "true");
      Object.assign(gt.style, {
        position: "fixed",
        left: `${d.left}px`,
        top: `${d.top}px`,
        margin: "0",
        whiteSpace: "nowrap",
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        fontSize: `${fsDst}px`,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        zIndex: "46",
        pointerEvents: "none",
        transformOrigin: "left top",
      } as unknown as CSSStyleDeclaration);
      document.body.appendChild(gt);
      ghosts.current.push(gt);

      gsap.set(h2, { autoAlpha: 0 });
      tl.set(srcTit, { autoAlpha: 0 }, 0)
        .fromTo(
          gt,
          { x: s.left - d.left, y: s.top - d.top, scale: ratio },
          { x: 0, y: 0, scale: 1, duration: 0.8 },
          0,
        )
        .set(h2, { autoAlpha: 1 }, 0.78)
        .to(gt, { autoAlpha: 0, duration: 0.12, onComplete: () => gt.remove() }, 0.78);
    } else {
      // sin medida (titular no montado): corte simple, sin viaje
      tl.to(srcTit, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0);
    }

    // las tarjetas entran en cascada mientras el titular todavía viaja: el
    // layout se arma ALREDEDOR de la palabra que se acomoda
    tl.fromTo(
      cards,
      { autoAlpha: 0, y: 20, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)", stagger: 0.06 },
      0.35,
    );

    // eyebrow y bajada
    tl.fromTo(
      head,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08 },
      0.5,
    );
    tl.to("[data-ap-under]", { scaleX: 1, duration: 0.55, ease: "power3.inOut" }, 0.8);
  };

  // ── Saltear la intro ────────────────────────────────────────────────────
  // El gesto de scroll ya NO paga un peaje (la intro se desarma sola): saltea.
  // Se lo traga en captura para que no le llegue a Lenis — si no, acumula el
  // impulso y arrastra la página en pleno vuelo, con los ghosts fixed clavados
  // en su destino viejo.
  const saltarIntro = () => {
    if (!introVivo.current) return;
    introTl.current?.kill();
    desarmeTl.current?.kill();
    setVista("apertura");

    gsap.set(panel("hero"), { autoAlpha: 0 });
    gsap.set(panel("apertura"), { autoAlpha: 1 });
    gsap.set("[data-ap-h2]", { autoAlpha: 1 });
    gsap.set("[data-ap-head]", { autoAlpha: 1, y: 0 });
    gsap.set("[data-tema-card]", { autoAlpha: 1, x: 0, y: 0, scale: 1 });
    gsap.set("[data-ap-under]", { scaleX: 1 });
    gsap.set("[data-barra]", { autoAlpha: 1, y: 0 });
    finIntro();
  };

  // ── Entrada inicial: el hero se arma y se desarma SOLO ──────────────────
  // Sin piezas, el hero es solo la palabra: las letras suben y listo. Se fueron
  // con ellas la deriva perpetua y el parallax de mouse, que no tenían a quién
  // moverle nada.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // estado base: solo el hero visible
      gsap.set('[data-panel="apertura"]', { autoAlpha: 0 });
      gsap.set('[data-panel="formulario"]', { autoAlpha: 0 });
      gsap.set('[data-panel="cierre"]', { autoAlpha: 0 });
      if (reduced) return;

      const chars = gsap.utils.toArray<HTMLElement>("[data-hero-char]");

      const tl = gsap.timeline({ delay: 0.25, defaults: { ease: "power3.out" } });
      introTl.current = tl;
      tl.fromTo(
        chars,
        { autoAlpha: 0, yPercent: 105, rotateX: -70, transformOrigin: "50% 100%", transformPerspective: 600 },
        { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.7, ease: "back.out(1.5)", stagger: 0.04 },
        0,
      )
        .fromTo("[data-barra]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.55)
        // …y acá está el punto: NADIE tiene que hacer nada. La intro no pide un
        // gesto para pagar el peaje — se desarma sola apenas terminó de armarse
        // y de darse un beat para leerse.
        .call(() => desarmar(), undefined, 1.2);
    }, root);

    // sin intro: se entra directo al selector, ya armado
    if (reduced) desarmar();

    // NADA de `body.overflow = "hidden"` para quieto el scroll durante la
    // intro: al soltarlo reaparece la barra, el viewport se ensancha y TODO el
    // contenido centrado pega un salto de media barra (~7px) justo cuando
    // termina la intro. La barra se queda siempre; al scroll lo frenan los
    // handlers en captura de abajo, que además saltean la intro.
    return () => {
      ctx.revert();
      limpiarGhosts();
    };
  }, [reduced]);

  // Mientras la intro corre, cualquier intento de scroll la saltea. Estos
  // handlers son los que reemplazan al lock: en captura, el evento se consume
  // ANTES de llegarle a Lenis (si no, acumula el impulso y arrastra la página
  // en pleno vuelo, con los ghosts fixed clavados en su destino viejo).
  //
  // El `scroll` va aparte y sin preventDefault (no es cancelable): es la red
  // para lo que wheel/touch no cubren — arrastrar la barra, autoscroll del
  // botón del medio. Ahí no se puede evitar el desplazamiento, así que la
  // intro se saltea y el usuario sigue scrolleando, que es lo que pidió.
  //
  // Apenas termina (introListo) los listeners se van y el scroll vuelve a ser
  // scroll: el peaje no se reemplaza por otro peaje.
  useEffect(() => {
    if (reduced || introListo) return;
    const saltar = (e: Event) => {
      if (!introVivo.current) return;
      e.preventDefault();
      e.stopPropagation();
      saltarIntro();
    };
    const onScroll = () => {
      if (introVivo.current) saltarIntro();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!introVivo.current) return;
      if (["ArrowDown", "PageDown", "End", " "].includes(e.key)) {
        e.preventDefault();
        saltarIntro();
      }
    };
    window.addEventListener("wheel", saltar, { capture: true, passive: false });
    window.addEventListener("touchmove", saltar, { capture: true, passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", saltar, { capture: true });
      window.removeEventListener("touchmove", saltar, { capture: true });
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, introListo]);

  // ── APERTURA → FORMULARIO: la tarjeta elegida viaja hasta el chip ───────
  const elegirTema = (key: TemaKey, cardEl: HTMLElement) => {
    if (animando.current) return;
    setTema(key);
    setVista("formulario");

    if (reduced) {
      gsap.set(panel("apertura"), { autoAlpha: 0 });
      gsap.set(panel("formulario"), { autoAlpha: 1 });
      return;
    }

    animando.current = true;
    const cardRect = cardEl.getBoundingClientRect();
    const titulo = TEMAS.find((t) => t.key === key)?.titulo ?? "";

    // esperar el re-render (el chip ya tiene el texto final) y medir en vivo
    requestAnimationFrame(() => {
      const root = rootRef.current;
      const chip = root?.querySelector<HTMLElement>("[data-chip-tema]");
      if (!root || !chip) {
        gsap.set(panel("apertura"), { autoAlpha: 0 });
        gsap.set(panel("formulario"), { autoAlpha: 1 });
        animando.current = false;
        return;
      }
      const chipRect = chip.getBoundingClientRect();

      // ghost: nace como la tarjeta y aterriza como el chip navy
      const ghost = document.createElement("div");
      ghost.textContent = titulo;
      ghost.setAttribute("aria-hidden", "true");
      Object.assign(ghost.style, {
        position: "fixed",
        left: `${cardRect.left}px`,
        top: `${cardRect.top}px`,
        width: `${cardRect.width}px`,
        height: `${cardRect.height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1.1rem",
        textAlign: "center",
        background: "#ffffff",
        color: "#1f2d4d",
        border: "1px solid rgb(169 197 232 / 0.5)",
        borderRadius: "1rem",
        fontFamily: "var(--font-manrope), sans-serif",
        fontWeight: "600",
        fontSize: "0.95rem",
        lineHeight: "1.2",
        zIndex: "45",
        pointerEvents: "none",
        boxShadow: "0 10px 30px -18px rgb(31 45 77 / 0.35)",
      } as CSSStyleDeclaration);
      document.body.appendChild(ghost);

      const otras = gsap.utils.toArray<HTMLElement>("[data-tema-card]").filter((c) => c !== cardEl);
      const campos = gsap.utils.toArray<HTMLElement>("[data-campo]");

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.to(ghost, { autoAlpha: 0, duration: 0.14, onComplete: () => ghost.remove() });
          animando.current = false;
          root.querySelector<HTMLInputElement>("#ct-nombre")?.focus({ preventScroll: true });
        },
      });

      tl.set(cardEl, { autoAlpha: 0 }, 0)
        // el resto de la apertura se disuelve
        .to(otras, { autoAlpha: 0, scale: 0.92, y: 10, duration: 0.4, stagger: 0.03 }, 0)
        .to("[data-ap-head], [data-ap-h2]", { autoAlpha: 0, y: -16, duration: 0.4 }, 0)
        .set(panel("apertura"), { autoAlpha: 0 }, 0.42)
        // el ghost VIAJA: posición + tamaño de card → chip…
        .to(
          ghost,
          {
            left: chipRect.left,
            top: chipRect.top,
            width: chipRect.width,
            height: chipRect.height,
            borderRadius: "999px",
            fontSize: "0.8rem",
            boxShadow: "none",
            duration: 0.6,
          },
          0.08,
        )
        // …y recién al acoplarse vira a navy (interpolar todo el viaje
        // ensuciaba el color con un gris intermedio)
        .to(ghost, { background: "#1f2d4d", color: "#ffffff", duration: 0.22, ease: "power1.inOut" }, 0.46)
        // el formulario se arma alrededor del chip que aterriza
        .set(panel("formulario"), { autoAlpha: 1 }, 0.5)
        .fromTo(
          campos,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.06 },
          0.55,
        );
    });
  };

  // ── FORMULARIO → APERTURA (cambiar de tema, sin perder lo tipeado) ──────
  const cambiarTema = () => {
    if (animando.current) return;
    setVista("apertura");

    if (reduced) {
      gsap.set(panel("formulario"), { autoAlpha: 0 });
      gsap.set(panel("apertura"), { autoAlpha: 1 });
      return;
    }

    animando.current = true;
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        animando.current = false;
      },
    });
    tl.to(panel("formulario"), { autoAlpha: 0, duration: 0.35, ease: "power2.in" })
      .set(panel("apertura"), { autoAlpha: 1 })
      .fromTo("[data-ap-head], [data-ap-h2]", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.5 })
      .fromTo(
        "[data-tema-card]",
        { autoAlpha: 0, scale: 0.92, y: 10 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.7)", stagger: 0.05 },
        "-=0.3",
      );
  };

  // ── FORMULARIO → CIERRE (mailto + confirmación) ─────────────────────────
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const institucion = String(data.get("institucion") ?? "").trim();
    const pais = String(data.get("pais") ?? "").trim();
    const mensaje = String(data.get("mensaje") ?? "").trim();

    const asunto = `[Web] ${temaActivo?.titulo ?? "Consulta"} — ${nombre}`;
    const cuerpo = [
      mensaje,
      "",
      "—",
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      institucion ? `Institución: ${institucion}` : null,
      pais ? `País: ${pais}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    // mientras no haya backend, abre el correo con todo precargado
    window.location.href = `mailto:${siteConfig.contacto.email}?subject=${encodeURIComponent(
      asunto,
    )}&body=${encodeURIComponent(cuerpo)}`;

    setVista("cierre");
    if (reduced) {
      gsap.set(panel("formulario"), { autoAlpha: 0 });
      gsap.set(panel("cierre"), { autoAlpha: 1 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("[data-campo]", { autoAlpha: 0, y: -12, duration: 0.3, stagger: 0.03, ease: "power2.in" })
      .to(panel("formulario"), { autoAlpha: 0, duration: 0.25 }, "-=0.1")
      .set(panel("cierre"), { autoAlpha: 1 })
      .fromTo("[data-fin-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.inOut" })
      .fromTo(
        "[data-fin-bit]",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.35",
      );
  };

  // ── CIERRE → APERTURA (otra consulta) ───────────────────────────────────
  const otraConsulta = () => {
    setVista("apertura");
    if (reduced) {
      gsap.set(panel("cierre"), { autoAlpha: 0 });
      gsap.set(panel("apertura"), { autoAlpha: 1 });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(panel("cierre"), { autoAlpha: 0, duration: 0.3, ease: "power2.in" })
      .set(panel("apertura"), { autoAlpha: 1 })
      .fromTo("[data-ap-head], [data-ap-h2]", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.5 })
      .fromTo(
        "[data-tema-card]",
        { autoAlpha: 0, scale: 0.92 },
        { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.7)", stagger: 0.05 },
        "-=0.3",
      );
  };

  const copiarMail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contacto.email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      // sin permiso de clipboard el mail queda visible igual
    }
  };

  const inputBase =
    "w-full rounded-xl border border-azul-claro/50 bg-white px-4 py-2.5 font-sans text-[0.95rem] text-azul-principal placeholder:text-gris-texto/60 transition-colors focus:border-verde-concepto focus:outline-none focus:ring-2 focus:ring-verde-concepto/25";

  return (
    <section
      ref={rootRef}
      className="bg-grain-light relative isolate h-[100svh] overflow-hidden bg-gradient-to-b from-white via-white to-gris-fondo/50"
      aria-label="Contacto"
    >
      {/* Fondo de nodos vivo durante toda la experiencia */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-30">
        <MathField className="h-full w-full" />
      </div>

      {/* ── Escenario: los cuatro estados apilados ────────────────────────── */}
      <div className="relative z-10 mx-auto h-full w-full max-w-screen-xl px-5 md:px-10">
        {/* 0 · HERO */}
        <div
          data-panel="hero"
          aria-hidden={vista !== "hero"}
          inert={vista !== "hero"}
          className="absolute inset-x-5 top-0 bottom-16 md:inset-x-10"
        >
          {/* Titular editorial: izquierda y a ancho total, en el lenguaje del
              hero de Qué es ED. Nada más: sin eyebrow, sin bajada, sin botón,
              sin hint de scroll y sin piezas flotando alrededor. Solo la
              palabra — no hay nada que decidir todavía. */}
          <div className="flex h-full flex-col justify-center">
            <h1
              className="font-display text-azul-principal font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(3.4rem, 1rem + 10vw, 9rem)", lineHeight: 0.95 }}
            >
              <span className="sr-only">{TITULO}</span>
              <span data-hero-titulo aria-hidden="true" className="inline-block whitespace-nowrap">
                {TITULO.split("").map((c, i) => (
                  <span key={i} data-hero-char className="inline-block will-change-transform">
                    {c}
                  </span>
                ))}
              </span>
            </h1>
          </div>
        </div>

        {/* 1 · APERTURA */}
        {/* my-auto (y no justify-center en el padre): con 5 tarjetas apiladas
            el contenido no entra en mobile, y justify-center lo recorta de los
            DOS lados — el titular se iba arriba del navbar y las tarjetas se
            metían abajo de la barra. Así se centra si entra, y si no entra
            arranca del tope y se scrollea. Mismo patrón que el formulario.
            overflow-x-hidden porque overflow-y solo ya hace que overflow-x
            compute a `auto`: en reposo no desborda nada, pero el back.out con
            que entran las tarjetas pasa apenas de scale 1 y eso alcanza para
            que parpadee un scrollbar horizontal en pleno desarme. */}
        <div
          data-panel="apertura"
          aria-hidden={vista !== "apertura"}
          inert={vista !== "apertura"}
          className="absolute inset-x-5 top-0 bottom-16 flex overflow-x-hidden overflow-y-auto pt-24 pb-4 md:inset-x-10 md:pt-28"
        >
          <div className="my-auto w-full">
            <div data-ap-head>
              <Eyebrow>Contacto</Eyebrow>
            </div>
            {/* Acá ATERRIZA el titular del hero (destino del viaje). Misma
                familia, peso, tracking y line-height que el h1: el ghost es un
                scale exacto entre los dos. */}
            <h2
              data-ap-h2
              className="font-display text-azul-principal mt-5 font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(2.2rem, 1rem + 4vw, 4.2rem)", lineHeight: 0.95 }}
            >
              <span className="sr-only">{TITULO}</span>
              <span data-ap-titulo aria-hidden="true" className="relative inline-block whitespace-nowrap">
                {TITULO}
                <span
                  data-ap-under
                  aria-hidden="true"
                  className="bg-verde-concepto/70 absolute right-0 -bottom-[0.06em] left-0 block h-[0.05em] origin-left rounded-full"
                />
              </span>
            </h2>
            <p data-ap-head className="text-gris-texto mt-5 max-w-[46ch] font-sans text-[1.02rem] leading-relaxed">
              Del otro lado hay personas que investigan y enseñan. Elegí el tema
              y contanos qué tenés en mente.
            </p>

            <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Tema de la consulta">
              {TEMAS.map((t, i) => (
                <button
                  key={t.key}
                  type="button"
                  data-tema-card
                  onClick={(e) => elegirTema(t.key, e.currentTarget)}
                  className="group border-azul-claro/50 hover:border-verde-concepto/60 focus-visible:outline-verde-concepto relative flex min-h-[9.75rem] flex-col overflow-hidden rounded-2xl border bg-white p-5 text-left transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-22px_rgb(31_45_77/0.28)] focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {/* Wash verde que sube desde abajo en hover (scaleY → compositor-friendly). */}
                  <span
                    aria-hidden="true"
                    className="from-verde-concepto/[0.10] via-verde-concepto/[0.04] pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t to-transparent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                  />

                  {/* Número + ícono de marca */}
                  <div className="relative flex items-center justify-between">
                    <span className="text-azul-principal/30 font-mono text-[0.7rem] font-medium tracking-[0.14em] tabular-nums">
                      0{i + 1}
                    </span>
                    <t.Icon
                      size={26}
                      className="text-azul-principal/35 transition-colors duration-300 group-hover:text-verde-concepto"
                    />
                  </div>

                  {/* Título + detalle */}
                  <span className="font-display text-azul-principal relative mt-5 block text-[1.02rem] leading-snug font-semibold">
                    {t.titulo}
                  </span>
                  <span className="text-gris-texto relative mt-2 block font-sans text-[0.82rem] leading-relaxed">
                    {t.detalle}
                  </span>

                  {/* "Elegir →" que entra en hover, anclado abajo */}
                  <span className="text-verde-concepto relative mt-auto flex translate-y-1 items-center gap-1.5 pt-4 font-mono text-[0.66rem] tracking-[0.16em] uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Elegir
                    <ArrowUpRight size={13} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2 · FORMULARIO */}
        <div
          data-panel="formulario"
          aria-hidden={vista !== "formulario"}
          inert={vista !== "formulario"}
          className="absolute inset-x-5 top-0 bottom-16 flex overflow-y-auto pt-28 pb-4 md:inset-x-10"
        >
          {/* my-auto (y no justify-center en el padre): si el contenido no
              entra, se scrollea desde arriba sin que el tope quede recortado
              bajo el navbar */}
          <form onSubmit={enviar} className="mx-auto my-auto w-full max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              {/* Acá ATERRIZA la tarjeta elegida (destino del vuelo) */}
              <span
                data-chip-tema
                className="bg-azul-principal inline-flex items-center rounded-full px-4 py-2 font-sans text-[0.8rem] font-semibold text-white"
              >
                {temaActivo?.titulo ?? "Consulta"}
              </span>
              <button
                type="button"
                onClick={cambiarTema}
                className="text-gris-texto hover:text-verde-concepto font-mono text-[0.72rem] tracking-[0.12em] uppercase transition-colors"
              >
                Cambiar tema
              </button>
            </div>

            <h2
              data-campo
              className="font-display text-azul-principal mt-4 text-[1.35rem] font-bold tracking-[-0.01em] md:text-[1.6rem]"
            >
              Contanos tu consulta
            </h2>

            <div className="mt-5 grid gap-3.5 md:grid-cols-2">
              <div data-campo>
                <label htmlFor="ct-nombre" className="text-azul-principal mb-1.5 block font-sans text-sm font-medium">
                  Nombre y apellido *
                </label>
                <input id="ct-nombre" name="nombre" required autoComplete="name" className={inputBase} />
              </div>
              <div data-campo>
                <label htmlFor="ct-email" className="text-azul-principal mb-1.5 block font-sans text-sm font-medium">
                  Email *
                </label>
                <input id="ct-email" name="email" type="email" required autoComplete="email" className={inputBase} />
              </div>
              <div data-campo>
                <label
                  htmlFor="ct-institucion"
                  className="text-azul-principal mb-1.5 block font-sans text-sm font-medium"
                >
                  Institución u organización
                </label>
                <input id="ct-institucion" name="institucion" autoComplete="organization" className={inputBase} />
              </div>
              <div data-campo>
                <label htmlFor="ct-pais" className="text-azul-principal mb-1.5 block font-sans text-sm font-medium">
                  País
                </label>
                <select id="ct-pais" name="pais" defaultValue="" className={inputBase}>
                  <option value="">Elegir…</option>
                  {siteConfig.paises.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div data-campo className="md:col-span-2">
                <label htmlFor="ct-mensaje" className="text-azul-principal mb-1.5 block font-sans text-sm font-medium">
                  Mensaje *
                </label>
                <textarea
                  id="ct-mensaje"
                  name="mensaje"
                  required
                  rows={3}
                  placeholder="Contanos qué tenés en mente…"
                  className={`${inputBase} resize-none`}
                />
              </div>
            </div>

            <div data-campo className="mt-5 flex flex-wrap items-center gap-4">
              {/* Espejo de ButtonPrimary como <button> de submit (el componente
                  solo acepta href). Único naranja en pantalla. */}
              <button
                type="submit"
                className="group bg-naranja-accion hover:bg-naranja-accion/90 hover:shadow-naranja-accion/30 focus-visible:outline-naranja-accion inline-flex items-center gap-2 rounded-lg px-6 py-3 font-sans text-[0.95rem] font-medium text-white transition-all hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span>Enviar consulta</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              <p className="text-gris-texto font-sans text-[0.83rem]">
                Se abre tu correo con la consulta lista para enviar.
              </p>
            </div>
          </form>
        </div>

        {/* 3 · CIERRE */}
        <div
          data-panel="cierre"
          aria-hidden={vista !== "cierre"}
          inert={vista !== "cierre"}
          className="absolute inset-x-5 top-0 bottom-16 flex flex-col items-center justify-center text-center md:inset-x-10"
        >
          <span
            data-fin-rule
            aria-hidden="true"
            className="bg-verde-concepto block h-[2px] w-24 origin-center rounded-full"
          />
          <p
            data-fin-bit
            className="font-display text-azul-principal mt-8 max-w-[20ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(1.9rem, 1rem + 3vw, 3.2rem)", lineHeight: 1.12 }}
          >
            Cada propuesta empieza con una conversación.
          </p>
          <p data-fin-bit className="text-gris-texto mt-6 max-w-[52ch] font-sans text-[0.98rem] leading-relaxed">
            Se abrió tu correo con la consulta lista. Si no se abrió, escribinos
            directo a{" "}
            <a
              href={`mailto:${siteConfig.contacto.email}`}
              className="text-azul-principal hover:text-verde-concepto font-medium transition-colors"
            >
              {siteConfig.contacto.email}
            </a>
            .
          </p>
          <button
            data-fin-bit
            type="button"
            onClick={otraConsulta}
            className="border-azul-principal/25 text-azul-principal hover:border-verde-concepto hover:text-verde-concepto mt-9 inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-sans text-[0.95rem] font-medium transition-colors"
          >
            Hacer otra consulta
          </button>
        </div>
      </div>

      {/* ── Barra fija: otros canales + perfil (menor jerarquía) ─────────── */}
      <div
        data-barra
        className="border-azul-claro/30 absolute inset-x-0 bottom-0 z-20 border-t bg-white/70 backdrop-blur-sm"
      >
        <div className="text-gris-texto mx-auto flex h-16 w-full max-w-screen-xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 font-mono text-[0.7rem] tracking-[0.12em] uppercase md:px-10">
          <span className="flex items-center gap-3">
            <a
              href={`mailto:${siteConfig.contacto.email}`}
              className="hover:text-verde-concepto normal-case transition-colors"
            >
              {siteConfig.contacto.email}
            </a>
            <button
              type="button"
              onClick={copiarMail}
              className="text-verde-concepto hover:text-azul-principal transition-colors"
            >
              {copiado ? "Copiado ✓" : "Copiar"}
            </button>
          </span>
          <span className="hidden lg:block">
            Santiago de Chile · Presencia en {siteConfig.paises.length} países
          </span>
          <a href={mailtoPerfil} className="hover:text-verde-concepto flex items-center gap-1.5 transition-colors">
            ¿Querés compartir tu perfil?
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
