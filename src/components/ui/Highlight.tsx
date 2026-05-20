type Props = {
  children: React.ReactNode;
  /** Color del highlight. Default verde-concepto. Acepta tokens del @theme. */
  tone?: "verde" | "naranja";
};

/**
 * <mark> semántico con el highlight tipo marcador del manual de marca.
 * Anuncia "highlighted" en lectores de pantalla. El tinte default verde
 * respeta la regla del manual ("verde para conceptos"); naranja queda
 * disponible para CTAs textuales puntuales — usar con cuidado.
 */
export function Highlight({ children, tone = "verde" }: Props) {
  const bg = tone === "verde" ? "bg-verde-concepto/30" : "bg-naranja-accion/25";
  return (
    <mark className={`-mx-1 rounded-sm px-1 text-inherit ${bg}`}>
      {children}
    </mark>
  );
}
