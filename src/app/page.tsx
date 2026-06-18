import { Hero } from "@/features/home/Hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      {/* TEMPORAL: espacio para scrollear y ver el navbar en estado sólido.
          Se reemplaza cuando armemos el resto de la home. */}
      <section className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gris-texto">Próximamente: el resto de la home.</p>
      </section>
    </main>
  );
}
