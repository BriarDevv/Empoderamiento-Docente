import { BlueprintHero } from "@/features/blueprint/BlueprintHero";

// TEMP: demo de réplica del hero de blueprintapps.io sobre nuevo-frontend.
// La home original (Hero de ED) está versionada en git para restaurar.
export default function Home() {
  return (
    <main className="flex-1">
      <BlueprintHero />
    </main>
  );
}
