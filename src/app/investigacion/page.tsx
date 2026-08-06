import type { Metadata } from "next";
import { InvestigacionHero } from "@/features/investigacion/components/InvestigacionHero";
import { SentidoInvestigacion } from "@/features/investigacion/components/SentidoInvestigacion";

export const metadata: Metadata = {
  title: "Investigación",
  description:
    "Investigar para transformar: Empoderamiento Docente produce conocimiento propio sobre la matemática escolar y lo devuelve al aula en un ciclo continuo de investigación, acción y análisis.",
};

/**
 * Página Investigación — sigue el recorrido del sitemap (site-map-ED (1).pdf,
 * pág. 04):
 *  1 Hero "Investigar para transformar" (↓ Líneas · ↗ Biblioteca)
 *  2 Por qué investigamos (el sentido)
 *  3 Líneas de investigación (los 7 temas)
 *  4 Ciclo de investigación aplicada (el método, 4 fases)
 *  5 Volvemos a investigar (mejora continua, 4 pasos)
 *  6 Investigación en acción (casos / producción académica → Contacto)
 *  7 Conexión con Biblioteca (puente ↗ Biblioteca)
 *  8 Cierre (→ Contacto)
 *
 * Contenido de fuentes oficiales (modelo conceptual del cliente): base
 * epistemológica socioepistemológica, 7 líneas, ciclo CME de 4 fases,
 * feedback loop, producción real (RELIME 2025, Bolema 2025, libro).
 */
export default function InvestigacionPage() {
  return (
    <main>
      <InvestigacionHero />
      <SentidoInvestigacion />
      {/* Próximas secciones del sitemap: Líneas · Ciclo · Volvemos a
          investigar · En acción · Puente · Cierre. */}
    </main>
  );
}
