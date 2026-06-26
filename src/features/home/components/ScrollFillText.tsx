/**
 * Texto que se "rellena" palabra por palabra con el scroll (estilo blueprint):
 * cada palabra es un <span data-qs-word> que HeroQuienes enciende de gris tenue
 * al color final. Las palabras marcadas como `accent` se resaltan en AZUL de
 * marca; el resto se completa en VERDE. Sin animación (reduced-motion) quedan en
 * su color final por CSS (verde base / azul los acentos). [[ed-copy-oficial]]
 */
import type { CSSProperties } from "react";

export type FillSeg = { t: string; accent?: boolean };

export function ScrollFillText({
  segments,
  className,
  style,
}: {
  segments: FillSeg[];
  className?: string;
  style?: CSSProperties;
}) {
  const words: { w: string; accent?: boolean }[] = [];
  segments.forEach((s) =>
    s.t
      .trim()
      .split(/\s+/)
      .forEach((w) => words.push({ w, accent: s.accent })),
  );

  return (
    <p data-qs-fill className={className} style={style}>
      {words.map((it, i) => (
        <span
          key={i}
          data-qs-word
          {...(it.accent ? { "data-accent": "" } : {})}
          className={it.accent ? "text-azul-principal" : undefined}
        >
          {it.w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
