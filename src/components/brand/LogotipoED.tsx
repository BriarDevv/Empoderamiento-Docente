import Image from "next/image";

type Props = {
  /** principal = navy sobre claro · negativo = blanco sobre oscuro */
  variant?: "principal" | "negativo";
  className?: string;
  alt?: string;
};

const SRC = {
  principal: "/brand/logotipo-ed-principal.svg",
  negativo: "/brand/logotipo-ed-negativo.svg",
} as const;

const NATURAL = {
  principal: { width: 262, height: 335 },
  negativo: { width: 237, height: 303 },
} as const;

/**
 * Logotipo compacto de ED (monograma "ED" + caja con el faro). Sin
 * wordmark. Útil para favicons, header chico, footer compacto.
 * SVGs oficiales servidos desde /public/brand/.
 */
export function LogotipoED({
  variant = "principal",
  className = "",
  alt = "Empoderamiento Docente",
}: Props) {
  const { width, height } = NATURAL[variant];
  return (
    <Image
      src={SRC[variant]}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
