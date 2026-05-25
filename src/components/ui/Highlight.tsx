type Props = {
  children: React.ReactNode;
  /** Color del highlight. Default verde-concepto. Acepta tokens del @theme. */
  tone?: "verde" | "naranja";
};

/**
 * Highlight tipo marcador del manual de marca (pág. 9, 13, 17): trazo
 * semitransparente con bordes orgánicos, cubre la mitad inferior del
 * texto y se extiende un poco más allá de él horizontalmente — como un
 * highlighter real, no un underline recto.
 *
 * Implementación: SVG inline como background-image (path con curvas
 * Bezier sutilmente onduladas). `box-decoration-break: clone` garantiza
 * que el trazo se aplique línea a línea si la palabra se rompe en varias.
 *
 * Semánticamente sigue siendo `<mark>` — lectores de pantalla anuncian
 * "highlighted".
 */

// SVGs encodeados como data-URI. Forma: trazo de marcador con bordes
// superior e inferior con leve ondulación Bezier. `preserveAspectRatio`
// none permite que el SVG estire horizontalmente al ancho del texto.
const STROKE_VERDE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 32' preserveAspectRatio='none'><path d='M3,7 C20,4 50,3 90,5 C130,4 170,5 200,4 C220,5 230,6 237,5 L237,26 C220,29 200,27 180,27 C150,28 120,27 90,28 C60,27 30,28 3,26 Z' fill='%233e7c6d' fill-opacity='0.85'/></svg>\")";

const STROKE_NARANJA =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 32' preserveAspectRatio='none'><path d='M3,7 C20,4 50,3 90,5 C130,4 170,5 200,4 C220,5 230,6 237,5 L237,26 C220,29 200,27 180,27 C150,28 120,27 90,28 C60,27 30,28 3,26 Z' fill='%23e07a2f' fill-opacity='0.85'/></svg>\")";

export function Highlight({ children, tone = "verde" }: Props) {
  return (
    <mark
      className="bg-transparent text-inherit"
      style={{
        backgroundImage: tone === "verde" ? STROKE_VERDE : STROKE_NARANJA,
        // El trazo cubre ~85% del alto del texto, centrado (75% desde top).
        // Más alto y más opaco para contraste fuerte sobre fondos navy.
        backgroundSize: "100% 0.85em",
        backgroundPosition: "0 75%",
        backgroundRepeat: "no-repeat",
        // Padding horizontal sutil: el trazo se extiende un poco más allá
        // del texto, como un marcador real.
        paddingInline: "0.1em",
        // Si el texto se rompe en varias líneas, repetir el trazo por línea.
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </mark>
  );
}
