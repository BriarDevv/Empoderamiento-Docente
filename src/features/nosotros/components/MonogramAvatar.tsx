import { getInitials } from "../lib/getInitials";

interface MonogramAvatarProps {
  name: string;
  className?: string;
}

/**
 * Fallback cuando una persona del equipo no tiene foto. Letras grandes
 * sobre fondo azul-principal con una línea diagonal verde sutil para
 * marcar que es un placeholder intencional.
 */
export function MonogramAvatar({ name, className = "" }: MonogramAvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`bg-azul-principal relative flex items-center justify-center overflow-hidden ${className}`}
      aria-label={`Retrato de ${name} (pendiente)`}
      role="img"
    >
      <span
        className="font-display text-azul-claro/40 font-light select-none"
        style={{ fontSize: "clamp(72px, 14vw, 180px)", lineHeight: 1 }}
      >
        {initials}
      </span>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          stroke="var(--color-verde-concepto)"
          strokeWidth="0.3"
          strokeOpacity="0.35"
        />
      </svg>
    </div>
  );
}
