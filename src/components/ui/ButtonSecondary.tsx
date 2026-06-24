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
 */
export function ButtonSecondary({ href, children, variant = "light" }: Props) {
  const themed =
    variant === "light"
      ? "border-azul-principal/80 text-azul-principal hover:bg-azul-principal hover:text-white"
      : "border-white/70 text-white hover:bg-white hover:text-azul-principal";

  return (
    <Link
      href={href}
      className={`focus-visible:outline-verde-concepto inline-flex items-center justify-center rounded-lg border bg-transparent px-6 py-3 font-sans text-[0.95rem] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${themed}`}
    >
      {children}
    </Link>
  );
}
