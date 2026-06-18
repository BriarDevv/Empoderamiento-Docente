"use client";

import Link from "next/link";
import { MagneticButton } from "./MagneticButton";

interface CtaButtonProps {
  readonly href: string;
  readonly label: string;
  readonly className?: string;
}

/**
 * CTA naranja (pill) — único acento de acción del nav. Magnético + sweep de
 * relleno en hover (clip por scaleX) + micro text-swap del label. Solo
 * transform/opacity. El sweep oscurece ~el hover que pide DESIGN.md §7.
 */
export function CtaButton({ href, label, className }: CtaButtonProps) {
  return (
    <MagneticButton strength={0.5}>
      <Link
        href={href}
        className={`group bg-naranja-accion relative inline-flex items-center overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-white ${className ?? ""}`}
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-black/15 transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
            {label}
          </span>
          <span className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            {label}
          </span>
        </span>
      </Link>
    </MagneticButton>
  );
}
