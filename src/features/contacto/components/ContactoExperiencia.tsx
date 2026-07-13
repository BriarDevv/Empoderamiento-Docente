"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MathField } from "@/components/ui/MathField";
import { ArrowUpRight } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Contacto como EXPERIENCIA DE UNA SOLA PANTALLA: acá no se scrollea, se
 * TRANSFORMA. Los estados viven apilados en el mismo viewport y morfean uno
 * en otro, en cadena y de ida:
 *
 *  0 · HERO — "Hablemos." gigante rodeado de piezas flotantes con contenido
 *      institucional real (países, pilares de marca, mail). El gesto de
 *      scroll (o "Empezar") lo DESARMA: las letras se dispersan y las cinco
 *      piezas VUELAN y se transforman en las cinco tarjetas de tema. Mientras
 *      el hero está activo el scroll real queda bloqueado — el gesto dispara
 *      la transformación, no un desplazamiento. Viaje de ida: no se vuelve.
 *  1 · APERTURA — "Empecemos una conversación." + las 5 tarjetas de tema.
 *  2 · FORMULARIO — al elegir tema, la tarjeta elegida viaja (ghost FLIP)
 *      hasta el chip del formulario y los campos suben en cascada. "Cambiar
 *      tema" vuelve al selector sin perder lo tipeado.
 *  3 · CIERRE — al enviar: «Cada propuesta empieza con una conversación.»
 *
 * Lo secundario del sitemap (otros canales + compartir perfil, menor
 * jerarquía) es la BARRA fija de abajo, presente en todos los estados.
 *
 * Envío sin backend todavía: arma un mailto: con asunto y cuerpo precargados.
 * Cuando se integre Supabase se reemplaza por un insert (confirmar schema
 * antes — AGENTS.md §12).
 *
 * Reduced-motion: los cambios de estado son instantáneos (sin vuelos ni
 * dispersión). El fondo de nodos (MathField) queda vivo detrás siempre.
 */

const TEMAS = [
  {
    key: "formacion",
    titulo: "Formación y acompañamiento",
    detalle: "Trayectos, asesorías y trabajo con escuelas.",
  },
  {
    key: "investigacion",
    titulo: "Investigación",
    detalle: "Líneas de estudio y colaboración académica.",
  },
  {
    key: "alianzas",
    titulo: "Alianzas institucionales",
    detalle: "Convenios con organizaciones y gobiernos.",
  },
  {
    key: "prensa",
    titulo: "Prensa y difusión",
    detalle: "Entrevistas, notas y comunicación.",
  },
  {
    key: "otra",
    titulo: "Otra consulta",
    detalle: "Todo lo que no entra en las anteriores.",
  },
] as const;

type TemaKey = (typeof TEMAS)[number]["key"];
type Vista = "hero" | "apertura" | "formulario" | "cierre";

const TITULO_HERO = "Hablemos.";

// Piezas flotantes del hero: contenido institucional REAL (siteConfig +
// frases pilares verbatim). En el desarme, la pieza i se transforma en la
// tarjeta de tema i.
const PIEZAS = [
  { label: "Presencia", texto: "Chile · México · Argentina · Colombia · Brasil" },
  { label: "Comunidad", texto: "Comunidad docente en torno a la Matemática Educativa" },
  { label: "Cómo trabajamos", texto: "Investigación · diseño · acompañamiento" },
  { label: "Mail directo", texto: siteConfig.contacto.email },
  { label: "Nuestra brújula", texto: "Potenciamos fortalezas, fortalecemos potencialidades" },
] as const;

// Posición de cada pieza alrededor del titular (solo desktop; en mobile las
// piezas se ocultan y el desarme cae al pop directo de las tarjetas).
const PIEZA_POS = [
  "left-[4%] top-[17%]",
  "right-[5%] top-[20%]",
  "left-[7%] bottom-[26%]",
  "right-[8%] bottom-[19%]",
  "right-[2%] top-[47%]",
] as const;

export function ContactoExperiencia() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const [vista, setVista] = useState<Vista>("hero");
  const [tema, setTema] = useState<TemaKey | null>(null);
  const [copiado, setCopiado] = useState(false);
  const animando = useRef(false);

  const temaActivo = TEMAS.find((t) => t.key === tema);
  const mailtoPerfil = `mailto:${siteConfig.contacto.email}?subject=${encodeURIComponent(
    "[Web] Comparto mi perfil",
  )}`;

  const panel = (v: Vista) =>
    rootRef.current?.querySelector<HTMLElement>(`[data-panel="${v}"]`) ?? null;

  // ── Scroll real bloqueado mientras el hero está activo ──────────────────
  // El desbloqueo NO va atado al estado: lo hace desarmar() recién cuando la
  // transición termina — si se libera al instante, el impulso de la rueda
  // (que Lenis también escucha) empuja la página en pleno desarme.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ── Entrada inicial: el hero se arma ────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let removeMove: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // estado base: solo el hero visible
      gsap.set('[data-panel="apertura"]', { autoAlpha: 0 });
      gsap.set('[data-panel="formulario"]', { autoAlpha: 0 });
      gsap.set('[data-panel="cierre"]', { autoAlpha: 0 });
      if (reduced) return;

      const chars = gsap.utils.toArray<HTMLElement>("[data-hero-char]");
      const piezas = gsap.utils.toArray<HTMLElement>("[data-pieza]");

      const tl = gsap.timeline({ delay: 0.3, defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-bit]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09 },
        0,
      )
        .fromTo(
          chars,
          { autoAlpha: 0, yPercent: 105, rotateX: -70, transformOrigin: "50% 100%", transformPerspective: 600 },
          { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.85, ease: "back.out(1.5)", stagger: 0.05 },
          0.15,
        )
        .fromTo(
          piezas,
          { autoAlpha: 0, y: 24, scale: 0.92 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.7)", stagger: 0.09 },
          0.55,
        )
        .fromTo("[data-barra]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.0);

      // deriva perpetua de las piezas (solo translate: nada se descuelga)
      piezas.forEach((p, i) => {
        gsap.to(p, {
          y: `+=${8 + (i % 3) * 4}`,
          duration: 2.6 + (i % 3) * 0.7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2 + i * 0.2,
        });
      });

      // parallax de mouse sobre las piezas (pointer fino)
      if (window.matchMedia("(pointer: fine)").matches) {
        let tx = 0;
        let ty = 0;
        let cx = 0;
        let cy = 0;
        const onMove = (e: MouseEvent) => {
          tx = (e.clientX / window.innerWidth) * 2 - 1;
          ty = (e.clientY / window.innerHeight) * 2 - 1;
        };
        const loop = () => {
          cx += (tx - cx) * 0.06;
          cy += (ty - cy) * 0.06;
          piezas.forEach((p, i) => {
            const depth = 0.6 + (i % 3) * 0.35;
            gsap.set(p, { x: cx * 14 * depth });
          });
          raf = requestAnimationFrame(loop);
        };
        window.addEventListener("mousemove", onMove);
        raf = requestAnimationFrame(loop);
        removeMove = () => window.removeEventListener("mousemove", onMove);
      }
    }, root);

    return () => {
      cancelAnimationFrame(raf);
      removeMove?.();
      ctx.revert();
    };
  }, [reduced]);

  // ── HERO → APERTURA: el desarme (viaje de ida) ──────────────────────────
  const desarmar = () => {
    if (animando.current) return;
    const root = rootRef.current;
    if (!root) return;
    setVista("apertura");

    if (reduced) {
      gsap.set(panel("hero"), { autoAlpha: 0 });
      gsap.set(panel("apertura"), { autoAlpha: 1 });
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      return;
    }

    animando.current = true;
    const chars = gsap.utils.toArray<HTMLElement>("[data-hero-char]");
    const piezas = gsap.utils.toArray<HTMLElement>("[data-pieza]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-tema-card]");
    const head = gsap.utils.toArray<HTMLElement>("[data-ap-head]");

    // preparar la apertura: visible como capa pero con TODO oculto (cada
    // pieza que aterriza enciende su tarjeta)
    gsap.set(panel("apertura"), { autoAlpha: 1 });
    gsap.set(cards, { autoAlpha: 0 });
    gsap.set(head, { autoAlpha: 0 });
    gsap.set("[data-ap-under]", { scaleX: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(panel("hero"), { autoAlpha: 0 });
        // recién acá se libera el scroll (el impulso de la rueda ya murió) y
        // se asegura el top por si Lenis alcanzó a arrastrar algo
        window.scrollTo(0, 0);
        document.body.style.overflow = "";
        animando.current = false;
      },
    });

    // las letras de "Hablemos." se dispersan (ángulo áureo + deriva arriba)
    chars.forEach((c, i) => {
      const ang = i * 2.399;
      tl.to(
        c,
        {
          x: Math.cos(ang) * (120 + (i % 4) * 60),
          y: Math.sin(ang) * 70 - 90,
          rotation: ((i % 5) - 2) * 24,
          autoAlpha: 0,
          filter: "blur(7px)",
          duration: 0.6,
          ease: "power2.in",
        },
        i * 0.02,
      );
    });

    // eyebrow, bajada, CTA y hint se van rápido
    tl.to("[data-hero-bit]", { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" }, 0);

    // cada pieza VUELA y se transforma en su tarjeta de tema
    piezas.forEach((p, i) => {
      const card = cards[i];
      if (!card) return;
      const o = p.getBoundingClientRect();
      const d = card.getBoundingClientRect();

      // pieza oculta en mobile (sin rect): la tarjeta hace pop directo
      if (!o.width || !d.width) {
        tl.fromTo(
          card,
          { autoAlpha: 0, y: 20, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
          0.45 + i * 0.06,
        );
        return;
      }

      // ghost: cáscara blanca con el texto de la pieza, que viaja y toma el
      // lugar exacto de la tarjeta
      const ghost = document.createElement("div");
      ghost.textContent = p.querySelector("[data-pieza-texto]")?.textContent ?? "";
      ghost.setAttribute("aria-hidden", "true");
      Object.assign(ghost.style, {
        position: "fixed",
        left: `${o.left}px`,
        top: `${o.top}px`,
        width: `${o.width}px`,
        height: `${o.height}px`,
        display: "flex",
        alignItems: "center",
        padding: "0.9rem 1.1rem",
        background: "#ffffff",
        color: "#1f2d4d",
        border: "1px solid rgb(169 197 232 / 0.5)",
        borderRadius: "1rem",
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "0.8rem",
        lineHeight: "1.35",
        overflow: "hidden",
        zIndex: "45",
        pointerEvents: "none",
        boxShadow: "0 10px 30px -18px rgb(31 45 77 / 0.35)",
      } as CSSStyleDeclaration);
      document.body.appendChild(ghost);

      const at = 0.12 + i * 0.06;
      tl.set(p, { autoAlpha: 0 }, at)
        .to(
          ghost,
          {
            left: d.left,
            top: d.top,
            width: d.width,
            height: d.height,
            duration: 0.68,
            ease: "power3.inOut",
          },
          at,
        )
        // al acoplarse: la tarjeta real enciende con un asentado y el ghost
        // se funde (la materia "cambia de contenido" al aterrizar)
        .fromTo(
          card,
          { autoAlpha: 0, scale: 1.05 },
          { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" },
          at + 0.6,
        )
        .to(
          ghost,
          {
            autoAlpha: 0,
            duration: 0.2,
            onComplete: () => ghost.remove(),
          },
          at + 0.62,
        );
    });

    // el encabezado de la apertura sube al final del desarme
    tl.fromTo(
      head,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.08 },
      0.85,
    );
    tl.to("[data-ap-under]", { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 1.1);
  };

  // el gesto de scroll dispara el desarme (no hay scroll real en el hero).
  // Captura + stopPropagation: el evento se consume ANTES de que le llegue a
  // Lenis — si no, Lenis acumula el impulso y arrastra la página en pleno
  // desarme (o al liberar el lock).
  useEffect(() => {
    if (vista !== "hero") return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 4) desarmar();
    };
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      desarmar();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) desarmar();
    };
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("touchmove", onTouch, { capture: true, passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchmove", onTouch, { capture: true });
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, reduced]);

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
        .to("[data-ap-head]", { autoAlpha: 0, y: -16, duration: 0.4 }, 0)
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
      .fromTo("[data-ap-head]", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.5 })
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
      .fromTo("[data-ap-head]", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.5 })
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
          {/* Piezas flotantes (contenido institucional real) */}
          {PIEZAS.map((p, i) => (
            <div
              key={p.label + i}
              data-pieza
              className={`border-azul-claro/50 absolute hidden w-56 rounded-2xl border bg-white p-4 shadow-[0_10px_30px_-18px_rgb(31_45_77/0.35)] md:block ${PIEZA_POS[i]}`}
            >
              <p className="text-verde-concepto font-mono text-[0.62rem] tracking-[0.14em] uppercase">
                {p.label}
              </p>
              <p data-pieza-texto className="text-azul-principal mt-1.5 font-sans text-[0.82rem] leading-relaxed">
                {p.texto}
              </p>
            </div>
          ))}

          {/* Titular + bajada + CTA, centrados */}
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div data-hero-bit>
              <Eyebrow>Contacto</Eyebrow>
            </div>
            <h1
              className="font-display text-azul-principal mt-6 font-extrabold tracking-[-0.03em]"
              style={{ fontSize: "clamp(3.4rem, 1rem + 10vw, 9rem)", lineHeight: 0.95 }}
            >
              <span className="sr-only">{TITULO_HERO}</span>
              <span aria-hidden="true">
                {TITULO_HERO.split("").map((c, i) => (
                  <span key={i} data-hero-char className="inline-block will-change-transform">
                    {c}
                  </span>
                ))}
              </span>
            </h1>
            <p
              data-hero-bit
              className="text-gris-texto mt-6 max-w-[44ch] font-sans text-[1.02rem] leading-relaxed md:text-[1.1rem]"
            >
              Del otro lado hay personas que investigan y enseñan. Consultas
              profesionales, propuestas y alianzas.
            </p>
            <button
              data-hero-bit
              type="button"
              onClick={desarmar}
              className="border-azul-principal/25 text-azul-principal hover:border-verde-concepto hover:text-verde-concepto mt-9 inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-sans text-[0.95rem] font-medium transition-colors"
            >
              Empezar
            </button>

            {/* hint: el gesto de scroll transforma */}
            <div data-hero-bit className="text-gris-texto absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
              <svg
                width="18"
                height="28"
                viewBox="0 0 22 34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                className="shrink-0"
              >
                <rect x="1" y="1" width="20" height="32" rx="10" />
                <line x1="11" y1="8" x2="11" y2="13" strokeLinecap="round" className="animate-pulse" />
              </svg>
              <span className="font-mono text-[0.68rem] tracking-[0.14em] uppercase">
                Scrolleá para empezar
              </span>
            </div>
          </div>
        </div>

        {/* 1 · APERTURA */}
        <div
          data-panel="apertura"
          aria-hidden={vista !== "apertura"}
          inert={vista !== "apertura"}
          className="absolute inset-x-5 top-0 bottom-16 flex flex-col justify-center md:inset-x-10"
        >
          <div data-ap-head>
            <Eyebrow>Contacto</Eyebrow>
          </div>
          <h2
            data-ap-head
            className="font-display text-azul-principal mt-5 max-w-[16ch] font-bold tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.2rem, 1rem + 4vw, 4.2rem)", lineHeight: 1.06 }}
          >
            Empecemos una{" "}
            <span className="relative inline-block whitespace-nowrap">
              conversación.
              <span
                data-ap-under
                aria-hidden="true"
                className="bg-verde-concepto/70 absolute right-0 -bottom-[0.06em] left-0 block h-[0.05em] origin-left rounded-full"
              />
            </span>
          </h2>
          <p data-ap-head className="text-gris-texto mt-5 max-w-[46ch] font-sans text-[1.02rem] leading-relaxed">
            Elegí el tema y contanos qué tenés en mente. Consultas
            profesionales, propuestas y alianzas — sin vueltas.
          </p>

          <div className="mt-9 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Tema de la consulta">
            {TEMAS.map((t) => (
              <button
                key={t.key}
                type="button"
                data-tema-card
                onClick={(e) => elegirTema(t.key, e.currentTarget)}
                className="group border-azul-claro/50 text-azul-principal hover:border-verde-concepto/60 focus-visible:outline-verde-concepto rounded-2xl border bg-white p-5 text-left transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="font-display block text-[1rem] leading-snug font-semibold">{t.titulo}</span>
                <span className="text-gris-texto mt-2 block font-sans text-[0.83rem] leading-relaxed">
                  {t.detalle}
                </span>
              </button>
            ))}
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
