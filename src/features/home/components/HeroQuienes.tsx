import { Hero } from "./Hero";
import { MathField } from "@/components/ui/MathField";

/**
 * Wrapper del Hero. Mantiene el campo de nodos (MathField) como capa ambiental
 * persistente detrás del hero.
 *
 * La sección "Quiénes somos" (Manifiesto) y su transición horizontal —el hero
 * salía por la izquierda y Quiénes somos entraba desde la derecha— fueron
 * removidas. El contenido de Manifiesto queda disponible para la futura página
 * /quienes-somos.
 */
export function HeroQuienes() {
  return (
    <div className="from-white via-white to-gris-fondo/40 relative isolate bg-gradient-to-b">
      {/* Nodos ambientales persistentes detrás del hero. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        aria-hidden="true"
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <MathField className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-10">
        <Hero />
      </div>
    </div>
  );
}
