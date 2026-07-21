import type { Metadata } from "next";
import { QueEsEdHero } from "@/features/que-es-ed/components/QueEsEdHero";
import { OrigenEd } from "@/features/que-es-ed/components/OrigenEd";
import { MiradaEd } from "@/features/que-es-ed/components/MiradaEd";
import { RedEd } from "@/features/que-es-ed/components/RedEd";
import { ImpulsanEd } from "@/features/que-es-ed/components/ImpulsanEd";
import { DistintoEd } from "@/features/que-es-ed/components/DistintoEd";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Empoderamiento Docente no es una capacitación más: investigación, diseño y acompañamiento para transformar la relación con el saber matemático escolar.",
};

export default function QuienesSomosPage() {
  return (
    <main>
      <QueEsEdHero />
      <OrigenEd />
      <MiradaEd />
      <RedEd />
      <ImpulsanEd />
      <DistintoEd />
      {/* Próximas secciones (sitemap): Trayectoria y alianzas · Cierre. */}
    </main>
  );
}
