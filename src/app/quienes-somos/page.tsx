import type { Metadata } from "next";
import { QuienesSomosHero } from "@/features/quienes-somos/components/QuienesSomosHero";
import { OrigenEd } from "@/features/quienes-somos/components/OrigenEd";
import { MiradaEd } from "@/features/quienes-somos/components/MiradaEd";
import { RedEd } from "@/features/quienes-somos/components/RedEd";
import { ImpulsanEd } from "@/features/quienes-somos/components/ImpulsanEd";
import { DistintoEd } from "@/features/quienes-somos/components/DistintoEd";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Empoderamiento Docente no es una capacitación más: investigación, diseño y acompañamiento para transformar la relación con el saber matemático escolar.",
};

export default function QuienesSomosPage() {
  return (
    <main>
      <QuienesSomosHero />
      <OrigenEd />
      <MiradaEd />
      <RedEd />
      <ImpulsanEd />
      <DistintoEd />
      {/* Próximas secciones (sitemap): Trayectoria y alianzas · Cierre. */}
    </main>
  );
}
