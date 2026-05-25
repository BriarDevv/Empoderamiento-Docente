import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Props = {
  href: string;
  children: ReactNode;
  /** Mostrar la flecha (con launch/swap animation) a la derecha. Default true. */
  withArrow?: boolean;
};

/**
 * CTA primario. Único naranja por viewport (DESIGN.md §1 reglas duras).
 *
 * Microinteracciones (globals.css):
 * - `.btn-premium` — hover lift `translateY(-2px)`, active depress, transitions
 *   con cubic-bezier circular-out.
 * - `.btn-sheen` — luz blanca diagonal que barre al hover (sutil, 18% white).
 * - `.btn-ico` — la flecha "despega" hacia la derecha y entra un clon desde
 *   la izquierda con micro-overshoot. Sugiere "el botón te lleva a algún lado".
 */
export function ButtonPrimary({ href, children, withArrow = true }: Props) {
  return (
    <Link
      href={href}
      className="btn-premium bg-naranja-accion hover:bg-naranja-accion/95 hover:shadow-naranja-accion/30 focus-visible:outline-naranja-accion relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-6 py-3 font-sans text-[0.95rem] font-medium text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span className="btn-sheen" aria-hidden="true" />
      <span className="relative z-[1]">{children}</span>
      {withArrow && (
        <span className="btn-ico relative z-[1]" aria-hidden="true">
          <span className="btn-ico__main">
            <ArrowRight size={16} />
          </span>
          <span className="btn-ico__ghost">
            <ArrowRight size={16} />
          </span>
        </span>
      )}
    </Link>
  );
}
