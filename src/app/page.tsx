import { HomeAnimations } from "@/features/home/animations/HomeAnimations";
import { Hero } from "@/features/home/components/Hero";
import { CicloTrabajo } from "@/features/home/components/CicloTrabajo";
import { SobreEd } from "@/features/home/components/SobreEd";
import { Impacto } from "@/features/home/components/Impacto";
import { Aliados } from "@/features/home/components/Aliados";
import { ComunidadRedes } from "@/features/home/components/ComunidadRedes";

export default function Home() {
  return (
    <main className="flex-1">
      <HomeAnimations>
        <Hero />
        <CicloTrabajo />
        <SobreEd />
        <Impacto />
        <Aliados />
        <ComunidadRedes />
      </HomeAnimations>
    </main>
  );
}
