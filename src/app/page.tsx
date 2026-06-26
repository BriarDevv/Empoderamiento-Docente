import { HeroQuienes } from "@/features/home/components/HeroQuienes";
import { DatosDuros } from "@/features/home/components/DatosDuros";
import { ComoTrabajamos } from "@/features/home/components/ComoTrabajamos";
import { LineasAccion } from "@/features/home/components/LineasAccion";

export default function Home() {
  return (
    <main>
      {/* IntroGate removido: se entra directo al Inicio (sin "Comenzá la
          experiencia"). El Hero y el navbar animan en el mount — ver
          intro-signal.ts (entered/revealed = true por defecto). */}
      <HeroQuienes />
      {/* Ancla del scroll-hint del Hero */}
      <div id="contenido" />
      <DatosDuros />
      <ComoTrabajamos />
      <LineasAccion />
    </main>
  );
}
