import type { Metadata } from "next";
import { QueHacemosHero } from "@/features/que-hacemos/components/QueHacemosHero";
import { EnfoqueTransformacion } from "@/features/que-hacemos/components/EnfoqueTransformacion";
import { CaminoDeTrabajo } from "@/features/que-hacemos/components/CaminoDeTrabajo";
import { TorreLineas } from "@/features/que-hacemos/components/TorreLineas";
import { NivelesEscala } from "@/features/que-hacemos/components/NivelesEscala";
import { ProyectosAplicaciones } from "@/features/que-hacemos/components/ProyectosAplicaciones";
import { CierreQueHacemos } from "@/features/que-hacemos/components/CierreQueHacemos";

export const metadata: Metadata = {
  title: "Qué hacemos",
  description:
    "Cómo trabaja Empoderamiento Docente: enfoque, camino de trabajo, líneas de acción, niveles de intervención y proyectos que transforman la matemática escolar.",
};

// Sitemap pág. 02, orden canónico: Hero → Nuestro enfoque → Cómo trabajamos
// (4 pasos) → Líneas de acción (7, la torre) → Niveles (5) → Proyectos y
// aplicaciones → Cierre.
export default function QueHacemosPage() {
  return (
    <main>
      <QueHacemosHero />
      <EnfoqueTransformacion />
      <CaminoDeTrabajo />
      <TorreLineas />
      <NivelesEscala />
      <ProyectosAplicaciones />
      <CierreQueHacemos />
    </main>
  );
}
