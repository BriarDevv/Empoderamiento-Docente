type Props = {
  /** Número a mostrar, ej. "01". */
  n: string;
  /** Color del número. Por defecto sutil sobre fondo claro. */
  variant?: "dark" | "light";
  className?: string;
};

/**
 * Número editorial gigante usado como ancla visual en secciones.
 * Eco directo de las placas numeradas del manual de marca (1-9).
 */
export function SectionNumber({ n, variant = "dark", className = "" }: Props) {
  const color =
    variant === "dark" ? "text-azul-principal/15" : "text-azul-claro/20";

  return (
    <span
      aria-hidden="true"
      className={`font-display block leading-none font-bold tabular-nums ${color} ${className}`}
      style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
    >
      {n}
    </span>
  );
}
