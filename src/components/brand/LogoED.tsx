import Image from "next/image";

type Props = {
  /** principal = navy sobre claro · negativo = blanco sobre oscuro */
  variant?: "principal" | "negativo";
  className?: string;
  /** Marcar como LCP candidate (true en el hero). */
  priority?: boolean;
  /** Alt text. Default: "Empoderamiento Docente". */
  alt?: string;
};

const SRC = {
  principal: "/brand/logo-ed-principal.svg",
  negativo: "/brand/logo-ed-negativo.svg",
} as const;

const NATURAL = {
  principal: { width: 619, height: 328 },
  negativo: { width: 625, height: 303 },
} as const;

/**
 * Logo completo de ED (lockup horizontal con monograma + caja del faro +
 * wordmark "EMPODERAMIENTO DOCENTE"). SVGs oficiales del manual de marca
 * servidos desde /public/brand/.
 */
export function LogoED({
  variant = "principal",
  className = "",
  priority = false,
  alt = "Empoderamiento Docente",
}: Props) {
  const { width, height } = NATURAL[variant];
  return (
    <Image
      src={SRC[variant]}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
