"use client";

import { type JSX } from "react";
import { Target, Users, BookOpen, X } from "@/components/ui/icons";
import { useMorphClone } from "../hooks/useMorphClone";
import { getInitials } from "../lib/getInitials";
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

/**
 * Modal con morph clone animation. Al abrir, una copia flotante de la
 * foto vuela desde la posición de la card hasta el slot del modal,
 * mientras backdrop y sheet aparecen detrás. Al cerrar, vuelve.
 *
 * La animación + refs + ESC + lock de scroll viven en useMorphClone;
 * este componente queda con JSX puro.
 */
export function TeamModal({ openContext, total, onClose }: TeamModalProps) {
  const {
    backdropRef,
    sheetRef,
    photoSlotRef,
    slotImgRef,
    morphImgRef,
    contentRef,
    closeBtnRef,
    triggerClose,
  } = useMorphClone({ openContext, onClose });

  if (!openContext) return null;
  const member = openContext.member;

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
            className="border-azul-claro/40 relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[1040px] flex-col overflow-hidden border bg-white shadow-[var(--shadow-modal-navy)] md:max-h-[calc(100dvh-3rem)]"
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
  const initials = getInitials(name);

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
