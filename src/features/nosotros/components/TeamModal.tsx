"use client";

import { useCallback, useEffect, useRef, type JSX } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useLockScroll } from "@/lib/hooks/useLockScroll";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Target, Users, BookOpen, X } from "@/components/ui/icons";
import type { TeamMember, Tier } from "../types/team";

export interface ModalOpenContext {
  member: TeamMember;
  index: number;
  /** Wrapper de la foto en la card — usado para el morph clone. */
  photoEl: HTMLElement;
}

interface TeamModalProps {
  openContext: ModalOpenContext | null;
  total: number;
  onClose: () => void;
}

const EASE_OPEN = "expo.out";
const EASE_CLOSE = "power3.inOut";

/**
 * Modal con morph clone animation. Al abrir, una copia flotante de la
 * foto vuela desde la posición de la card hasta el slot del modal,
 * mientras backdrop y sheet aparecen detrás. Al cerrar, vuelve.
 *
 * Re-tinteado al manual ED: navy/blanco/verde/naranja. Watermark
 * Lucide-style (Target/Users/BookOpen) según tier. LinkedIn naranja.
 */
export function TeamModal({ openContext, total, onClose }: TeamModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const photoSlotRef = useRef<HTMLDivElement>(null);
  const slotImgRef = useRef<HTMLDivElement>(null);
  const morphImgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const closingGuard = useRef(false);
  const reducedMotion = useReducedMotion();

  const isOpen = openContext !== null;
  const member = openContext?.member ?? null;

  useLockScroll(isOpen);

  // Close trigger memoizado para poder referenciarlo en effects.
  // eslint-disable-next-line react-hooks/immutability
  const triggerClose = useCallback(() => {
    if (closingGuard.current || !openContext) return;
    closingGuard.current = true;

    const morph = morphImgRef.current;
    const backdrop = backdropRef.current;
    const sheet = sheetRef.current;
    const content = contentRef.current;

    const card = openContext.photoEl;

    const slotImg = slotImgRef.current;

    const finish = () => {
      // Restauramos la visibilidad de la foto original (mutación del DOM
      // legítima dentro de un efecto imperativo de animación).
      // eslint-disable-next-line react-hooks/immutability
      card.style.visibility = "";
      closingGuard.current = false;
      onClose();
    };

    if (reducedMotion || !morph || !backdrop || !sheet || !content) {
      finish();
      return;
    }

    const slot = photoSlotRef.current;
    const cardRect = card.getBoundingClientRect();

    // Re-tomo control del morph desde la posición actual del slot
    // (la foto que está en el sheet) y oculto la del slot mientras
    // vuela de vuelta hacia la card.
    if (slot && slotImg) {
      const slotRect = slot.getBoundingClientRect();
      gsap.set(morph, {
        position: "fixed",
        top: slotRect.top,
        left: slotRect.left,
        width: slotRect.width,
        height: slotRect.height,
        opacity: 1,
      });
      gsap.set(slotImg, { opacity: 0 });
    }

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(
      content.children,
      {
        opacity: 0,
        y: 8,
        duration: 0.25,
        stagger: 0.02,
        ease: "power2.in",
      },
      0,
    )
      .to(sheet, { opacity: 0, y: 10, duration: 0.4, ease: "power2.in" }, 0.05)
      .to(
        morph,
        {
          top: cardRect.top,
          left: cardRect.left,
          width: cardRect.width,
          height: cardRect.height,
          duration: 0.7,
          ease: EASE_CLOSE,
        },
        0.1,
      )
      .to(backdrop, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.2);
  }, [openContext, reducedMotion, onClose]);

  // ESC + focus inicial al botón "Cerrar".
  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerClose();
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 240);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen, triggerClose]);

  // Apertura: morph clone vuela desde la card hasta el slot del modal.
  // Cuando termina, el morph se oculta y la foto del slot toma el relevo
  // (esa foto sí escolla con el sheet — el morph era position:fixed y se
  // salía del card al scrollear).

  useIsomorphicLayoutEffect(() => {
    if (!openContext) return;
    const morph = morphImgRef.current;
    const slot = photoSlotRef.current;
    const slotImg = slotImgRef.current;
    const backdrop = backdropRef.current;
    const sheet = sheetRef.current;
    const content = contentRef.current;
    if (!morph || !slot || !backdrop || !sheet || !content) return;

    const photoEl = openContext.photoEl;
    const cardRect = photoEl.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();

    const ctx = gsap.context(() => {
      gsap.set(morph, {
        position: "fixed",
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        zIndex: 60,
        opacity: 1,
        force3D: true,
      });

      if (slotImg) gsap.set(slotImg, { opacity: 0 });
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(sheet, { opacity: 0, y: 24 });
      gsap.set(content.children, { opacity: 0, y: 14 });

      if (reducedMotion) {
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(sheet, { opacity: 1, y: 0 });
        gsap.set(content.children, { opacity: 1, y: 0 });
        gsap.set(morph, { opacity: 0 });
        if (slotImg) gsap.set(slotImg, { opacity: 1 });
        return;
      }

      // Oculto la foto real de la card mientras vuela el clon (mutación
      // del DOM legítima dentro de un efecto imperativo).

      photoEl.style.visibility = "hidden";

      gsap
        .timeline()
        .to(backdrop, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(sheet, { opacity: 1, y: 0, duration: 0.7, ease: EASE_OPEN }, 0.05)
        .to(
          morph,
          {
            top: slotRect.top,
            left: slotRect.left,
            width: slotRect.width,
            height: slotRect.height,
            duration: 0.7,
            ease: EASE_OPEN,
            onComplete: () => {
              // Switch: muestro la foto del slot (en flow del DOM, scrolla
              // con el sheet) y oculto el morph clone.
              if (slotImg) gsap.set(slotImg, { opacity: 1 });
              gsap.set(morph, { opacity: 0 });
            },
          },
          0,
        )
        .to(
          content.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.045,
            ease: "power2.out",
          },
          0.35,
        );
    });

    return () => {
      ctx.revert();
      // ctx.revert mata los timelines pero no restaura el visibility de
      // la card original (vive fuera del scope del contexto). Si el
      // componente desmonta a mitad de animación, lo restauramos a mano.

      photoEl.style.visibility = "";
    };
  }, [openContext, reducedMotion]);

  if (!openContext || !member) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-name"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="bg-azul-principal/85 fixed inset-0"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        onClick={triggerClose}
        aria-hidden="true"
      />

      {/* Clon morfeable de la foto. */}
      <div
        ref={morphImgRef}
        aria-hidden="true"
        className="bg-azul-principal pointer-events-none overflow-hidden will-change-transform"
        style={{ opacity: 0 }}
      >
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <MorphMonogram name={member.name} />
        )}
      </div>

      {/* Viewport scrollable */}
      <div
        className="fixed inset-0 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) triggerClose();
        }}
      >
        <div className="flex min-h-full items-start justify-center px-4 py-6 md:items-center md:px-10 md:py-10">
          <div
            ref={sheetRef}
            className="border-azul-claro/40 relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[1040px] flex-col overflow-hidden border bg-white shadow-[0_40px_80px_-20px_rgba(31,42,68,0.25)] md:max-h-[calc(100dvh-3rem)]"
          >
            {/* Header del modal */}
            <header className="border-azul-claro/40 flex flex-shrink-0 items-center justify-between border-b px-5 py-3 md:px-7">
              <button
                ref={closeBtnRef}
                onClick={triggerClose}
                aria-label="Cerrar"
                className="text-azul-principal hover:text-naranja-accion group flex items-center gap-2.5 transition-colors"
              >
                <span className="border-azul-principal/20 group-hover:border-naranja-accion relative inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors">
                  <X size={10} />
                </span>
                <span className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase">
                  Cerrar
                </span>
              </button>
              <span className="text-gris-texto font-sans text-[10px] font-medium tracking-[0.22em] uppercase">
                {String(openContext.index).padStart(2, "0")}{" "}
                <span className="opacity-40">/</span>{" "}
                {String(total).padStart(2, "0")}
              </span>
            </header>

            {/* Body — 2 columnas */}
            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
              {/* Slot de la foto — destino del morph. Una vez termina la
                  apertura, la foto real del slot toma el relevo del clone
                  para que el scroll del sheet la arrastre. */}
              <div
                ref={photoSlotRef}
                className="bg-azul-principal relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full"
              >
                <div
                  ref={slotImgRef}
                  className="absolute inset-0"
                  style={{ opacity: 0 }}
                  aria-hidden="true"
                >
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <MorphMonogram name={member.name} />
                  )}
                </div>
              </div>

              {/* Columna de contenido */}
              <div className="md:border-azul-claro/40 relative md:min-h-0 md:overflow-hidden md:border-l">
                {/* Watermark del tier */}
                <TierWatermark tier={member.tier} />

                <div
                  ref={contentRef}
                  className="relative space-y-3 px-5 py-5 md:space-y-[14px] md:px-8 md:py-6 lg:px-10"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="bg-azul-principal inline-flex items-center justify-center px-1.5 py-0.5 font-sans text-[9.5px] font-medium tracking-[0.22em] text-white uppercase">
                      {member.countryCode}
                    </span>
                    <span className="text-gris-texto font-sans text-[9.5px] font-medium tracking-[0.22em] uppercase">
                      {tierLabel(member.tier)} · {member.country}
                    </span>
                  </div>

                  <h2
                    id="team-modal-name"
                    className="font-display text-azul-principal text-h2 leading-[1.05] font-bold"
                    style={{ letterSpacing: "-0.015em" }}
                  >
                    {member.name}
                  </h2>

                  <p className="text-azul-principal font-sans text-[11px] leading-[1.35] font-medium tracking-[0.18em] uppercase">
                    {member.role}
                  </p>

                  <div className="flex items-center gap-3">
                    <span
                      className="bg-verde-concepto h-px w-7"
                      aria-hidden="true"
                    />
                    <span className="text-gris-texto font-sans text-[9px] font-medium tracking-[0.28em] uppercase">
                      Semblanza
                    </span>
                  </div>

                  <p className="text-gris-texto font-sans text-[14px] leading-[1.6]">
                    {member.bio}
                  </p>

                  <div className="border-azul-claro/40 grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-3 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <span className="text-gris-texto block font-sans text-[9px] font-medium tracking-[0.28em] uppercase">
                        Formación
                      </span>
                      <ul
                        className={`space-y-1 ${
                          member.credentials.length >= 4
                            ? "sm:columns-2 sm:gap-x-6"
                            : ""
                        }`}
                      >
                        {member.credentials.map((c) => (
                          <li
                            key={c}
                            className="text-azul-principal before:bg-verde-concepto relative break-inside-avoid pl-3.5 font-sans text-[12px] leading-[1.5] before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-2 before:content-['']"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <span className="text-gris-texto block font-sans text-[9px] font-medium tracking-[0.28em] uppercase">
                        Especialidad
                      </span>
                      <p className="text-azul-principal font-sans text-[12px] leading-[1.5]">
                        {member.specialty}
                      </p>
                    </div>
                  </div>

                  {member.linkedin && (
                    <div className="pt-0.5">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-naranja-accion hover:bg-naranja-accion/90 group inline-flex items-center gap-2.5 px-3.5 py-2 font-sans text-[10px] font-medium tracking-[0.22em] text-white uppercase transition-colors duration-300"
                        aria-label={`Ver perfil de ${member.name} en LinkedIn`}
                      >
                        Ver en LinkedIn
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 17L17 7M17 7H9M17 7V15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TierWatermark({ tier }: { tier: Tier }): JSX.Element {
  const icon =
    tier === "direccion" ? (
      <Target size={200} />
    ) : tier === "lideres" ? (
      <Users size={200} />
    ) : (
      <BookOpen size={200} />
    );

  return (
    <span
      aria-hidden="true"
      className="text-azul-principal pointer-events-none absolute top-0 right-0 hidden select-none md:block"
      style={{
        opacity: 0.06,
        transform: "translate(20%, -10%)",
      }}
    >
      {icon}
    </span>
  );
}

function MorphMonogram({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

  return (
    <div className="bg-azul-principal flex h-full w-full items-center justify-center">
      <span
        className="font-display text-azul-claro/40 font-light"
        style={{ fontSize: "clamp(60px, 10vw, 160px)" }}
      >
        {initials}
      </span>
    </div>
  );
}

function tierLabel(tier: Tier): string {
  switch (tier) {
    case "direccion":
      return "Dirección";
    case "lideres":
      return "Liderazgo";
    case "facilitacion":
      return "Facilitación";
  }
}
