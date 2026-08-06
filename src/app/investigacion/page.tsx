import type { Metadata } from "next";
import { InvestigacionHero } from "@/features/investigacion/components/InvestigacionHero";
import { SentidoInvestigacion } from "@/features/investigacion/components/SentidoInvestigacion";
import { LineasInvestigacion } from "@/features/investigacion/components/LineasInvestigacion";
import { CicloInvestigacion } from "@/features/investigacion/components/CicloInvestigacion";
import { VolvemosInvestigar } from "@/features/investigacion/components/VolvemosInvestigar";
import { InvestigacionEnAccion } from "@/features/investigacion/components/InvestigacionEnAccion";
import { PuenteBiblioteca } from "@/features/investigacion/components/PuenteBiblioteca";
import { CierreInvestigacion } from "@/features/investigacion/components/CierreInvestigacion";

export const metadata: Metadata = {
  title: "Investigación",
  description:
    "Investigar para transformar: Empoderamiento Docente produce conocimiento propio sobre la matemática escolar y lo devuelve al aula en un ciclo continuo de investigación, acción y análisis.",
};

/**
 * Página Investigación — recorrido completo del sitemap (site-map-ED (1).pdf,
 * pág. 04): Hero → Por qué investigamos → Líneas → Ciclo → Volvemos a
 * investigar → En acción → Puente con Biblioteca → Cierre.
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
      <LineasInvestigacion />
      <CicloInvestigacion />
      <VolvemosInvestigar />
      <InvestigacionEnAccion />
      <PuenteBiblioteca />
      <CierreInvestigacion />
    </main>
  );
}
