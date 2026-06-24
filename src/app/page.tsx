import { IntroGate } from "@/features/home/components/IntroGate";
import { HeroQuienes } from "@/features/home/components/HeroQuienes";
import { ComoTrabajamos } from "@/features/home/components/ComoTrabajamos";
import { LineasAccion } from "@/features/home/components/LineasAccion";

export default function Home() {
  return (
    <main>
      <IntroGate />
      {/* Hero (intacto) + transición horizontal a "Quiénes somos" */}
      <HeroQuienes />
      {/* Ancla del scroll-hint del Hero */}
      <div id="contenido" />
      <ComoTrabajamos />
      <LineasAccion />
    </main>
  );
}
