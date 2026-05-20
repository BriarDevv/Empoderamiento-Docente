import Link from "next/link";
import { LogoED } from "@/components/brand/LogoED";
import { LogotipoED } from "@/components/brand/LogotipoED";
import { siteConfig } from "@/config/site";

type Props = {
  /** Variante del lockup. `full` = logo con wordmark · `compact` = solo monograma. */
  variant?: "compact" | "full";
  /** Tema del logo. `dark` = sobre claro (principal) · `light` = sobre navy (negativo). */
  tone?: "dark" | "light";
  className?: string;
  /** Si es true, envuelve en `<Link href="/">`. */
  asLink?: boolean;
};

/**
 * Marca de ED. Usa los SVG oficiales del manual de marca.
 * `full` = `LogoED` (con wordmark) · `compact` = `LogotipoED` (solo monograma).
 */
export function Brand({
  variant = "compact",
  tone = "dark",
  className = "",
  asLink = true,
}: Props) {
  const logoVariant = tone === "dark" ? "principal" : "negativo";

  const content =
    variant === "full" ? (
      <LogoED
        variant={logoVariant}
        className={`h-9 w-auto md:h-10 ${className}`}
      />
    ) : (
      <LogotipoED
        variant={logoVariant}
        className={`h-9 w-auto md:h-10 ${className}`}
      />
    );

  if (!asLink) return content;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — Inicio`}
      className="inline-flex"
    >
      {content}
    </Link>
  );
}
