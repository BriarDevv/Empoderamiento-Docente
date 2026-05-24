"use client";

// Las mutaciones de DOM (`card.style.visibility = ...`) son legítimas
// para la animación morph-clone: GSAP ya impone semántica imperativa
// fuera del flow declarativo de React. Disabled a nivel archivo.
/* eslint-disable react-hooks/immutability */

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks/useIsomorphicLayoutEffect";
import { useLockScroll } from "@/lib/hooks/useLockScroll";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { ModalOpenContext } from "../components/TeamModal";

const EASE_OPEN = "expo.out";
const EASE_CLOSE = "power3.inOut";

export interface MorphCloneRefs {
  backdropRef: React.RefObject<HTMLDivElement | null>;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  photoSlotRef: React.RefObject<HTMLDivElement | null>;
  slotImgRef: React.RefObject<HTMLDivElement | null>;
  morphImgRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
}

interface UseMorphCloneOptions {
  openContext: ModalOpenContext | null;
  onClose: () => void;
}

interface UseMorphCloneResult extends MorphCloneRefs {
  triggerClose: () => void;
}

/**
 * Maneja la animación morph-clone del TeamModal: refs, lock de scroll,
 * timeline de apertura (card → slot del sheet), timeline de cierre
 * (slot → card), ESC y focus inicial al botón "Cerrar". El componente
 * que lo consume queda con JSX puro.
 */
export function useMorphClone({
  openContext,
  onClose,
}: UseMorphCloneOptions): UseMorphCloneResult {
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
  useLockScroll(isOpen);

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

    gsap
      .timeline({ onComplete: finish })
      .to(
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
  // (esa foto sí scrolla con el sheet — el morph era position:fixed).
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
              // Switch: muestro la foto del slot (en flow del DOM,
              // scrolla con el sheet) y oculto el morph clone.
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
      // la card original (vive fuera del scope del contexto).
      photoEl.style.visibility = "";
    };
  }, [openContext, reducedMotion]);

  return {
    backdropRef,
    sheetRef,
    photoSlotRef,
    slotImgRef,
    morphImgRef,
    contentRef,
    closeBtnRef,
    triggerClose,
  };
}
