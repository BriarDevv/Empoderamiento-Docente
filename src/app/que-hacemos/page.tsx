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

// Sitemap pág. 02 con un desvío pedido por el cliente: el recorrido (la
// torre de líneas) va INMEDIATAMENTE después del hero — el botón "Entrar" y
// el scroll natural caen ahí. El resto conserva el orden del sitemap:
// Enfoque → Cómo trabajamos → Niveles → Proyectos → Cierre.
export default function QueHacemosPage() {
  return (
    <main>
      <QueHacemosHero />
      <TorreLineas />
      <EnfoqueTransformacion />
      <CaminoDeTrabajo />
      <NivelesEscala />
      <ProyectosAplicaciones />
      <CierreQueHacemos />
    </main>
  );
}
