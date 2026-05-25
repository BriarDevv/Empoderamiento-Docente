import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  /** light = sobre fondo claro · dark = sobre navy. */
  variant?: "light" | "dark";
};

/**
 * Botón secundario. Transparente + border. No compite con el primario
 * (no usa naranja). Foco accesible con outline verde-concepto.
 *
 * Microinteracciones (globals.css):
 * - `.btn-premium` — hover lift sutil + active depress.
 * - `.btn-sheen` — luz diagonal blanca que barre al hover. En el secondary
 *   se ve apenas (overlay 18% blanco sobre fondo transparente) — agrega
 *   peso premium sin competir con el primario.
 *
 * NO usa `.btn-ico` porque el secondary acepta children libres (algunos
 * uses externos ponen el ArrowRight inline). Si en el futuro queremos la
 * misma launch animation, se agrega una prop `icon` dedicada.
 */
export function ButtonSecondary({ href, children, variant = "light" }: Props) {
  const themed =
    variant === "light"
      ? "border-azul-principal/80 text-azul-principal hover:bg-azul-principal hover:text-white"
      : "border-white/70 text-white hover:bg-white hover:text-azul-principal";

  return (
    <Link
      href={href}
      className={`btn-premium focus-visible:outline-verde-concepto relative inline-flex items-center justify-center overflow-hidden rounded-lg border bg-transparent px-6 py-3 font-sans text-[0.95rem] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${themed}`}
    >
      <span className="btn-sheen" aria-hidden="true" />
      <span className="relative z-[1]">{children}</span>
    </Link>
  );
}
