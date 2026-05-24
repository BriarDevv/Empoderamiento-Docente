import type { JSX, RefObject } from "react";
import { BookOpen, Target, Users } from "@/components/ui/icons";
import type { TeamMember, Tier } from "../types/team";

interface ModalContentProps {
  member: TeamMember;
  /** Ref a la columna de contenido — el hook de animación lo usa para
   *  animar los hijos en stagger al abrir/cerrar. */
  contentRef: RefObject<HTMLDivElement | null>;
}

/**
 * Columna derecha del TeamModal: badge de país, nombre, rol, semblanza,
 * credenciales, especialidad y CTA condicional de LinkedIn. JSX puro
 * sin refs ni efectos propios.
 */
export function ModalContent({ member, contentRef }: ModalContentProps) {
  return (
    <div className="md:border-azul-claro/40 relative md:min-h-0 md:overflow-hidden md:border-l">
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
          <span className="bg-verde-concepto h-px w-7" aria-hidden="true" />
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
                member.credentials.length >= 4 ? "sm:columns-2 sm:gap-x-6" : ""
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
