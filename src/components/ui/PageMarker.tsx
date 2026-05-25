type Props = {
  /** Número de página, ej. "001". Va a tabular-nums. */
  number: string;
  /** Label uppercase, ej. "Home", "Nosotros", "Sumate". */
  label: string;
  /** Tema según el fondo donde se monta. `dark` = sobre claro, `light` = sobre navy. */
  variant?: "dark" | "light";
  /** Clases para position absolute / top / left desde el padre. */
  className?: string;
};

/**
 * Marker editorial de página — versión INTERMEDIA: más visible que el
 * marker chiquito esquina derecha que teníamos antes (text-[0.7rem]),
 * pero compact horizontal en una sola línea para no invadir el contenido
 * principal del hero.
 *
 * Composición: `[002] — [dash verde] — [NOSOTROS]`
 *
 * Cada página de la web monta este componente con su número + label.
 * Junto al cambio de color de fondo por página, ayuda a la
 * identificación inmediata de en qué página está el visitante.
 */
export function PageMarker({
  number,
  label,
  variant = "dark",
  className = "",
}: Props) {
  const numberColor =
    variant === "dark" ? "text-azul-principal/40" : "text-white/50";
  const labelColor =
    variant === "dark" ? "text-azul-principal/65" : "text-azul-claro/85";

  return (
    <div
      className={`pointer-events-none inline-flex items-center gap-3 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`font-display leading-none font-bold tracking-tight tabular-nums ${numberColor}`}
        style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
      >
        {number}
      </span>
      <span
        aria-hidden="true"
        className="bg-verde-concepto block h-px w-7 flex-shrink-0"
      />
      <span
        className={`font-sans text-[0.74rem] font-medium tracking-[0.22em] uppercase ${labelColor}`}
      >
        {label}
      </span>
    </div>
  );
}
