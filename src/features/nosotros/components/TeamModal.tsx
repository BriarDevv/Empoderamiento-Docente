"use client";

import { X } from "@/components/ui/icons";
import { useMorphClone } from "../hooks/useMorphClone";
import type { TeamMember } from "../types/team";
import { ModalContent } from "./ModalContent";
import { MorphMonogram } from "./MorphMonogram";

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
 * Composición: este componente arma el scaffolding (backdrop, sheet,
 * header, photo slot). useMorphClone aporta la animación + refs. La
 * columna derecha del sheet vive en ModalContent.
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
            <header className="border-azul-claro/40 flex flex-shrink-0 items-center justify-between border-b px-5 py-3 md:px-7">
              {/* Índice del miembro actual a la izquierda — espacio
                  secundario / metadata editorial. */}
              <span className="text-gris-texto font-sans text-[10px] font-medium tracking-[0.22em] uppercase">
                {String(openContext.index).padStart(2, "0")}{" "}
                <span className="opacity-40">/</span>{" "}
                {String(total).padStart(2, "0")}
              </span>
              {/* Botón Cerrar a la derecha — patrón estándar de modales
                  modernos (esquina superior derecha = acción de cerrar). */}
              <button
                ref={closeBtnRef}
                onClick={triggerClose}
                aria-label="Cerrar"
                className="text-azul-principal hover:text-naranja-accion group flex items-center gap-2.5 transition-colors"
              >
                <span className="font-sans text-[10px] font-medium tracking-[0.22em] uppercase">
                  Cerrar
                </span>
                <span className="border-azul-principal/20 group-hover:border-naranja-accion relative inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors">
                  <X size={10} />
                </span>
              </button>
            </header>

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

              <ModalContent member={member} contentRef={contentRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
