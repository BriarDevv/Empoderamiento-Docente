import type { Metadata } from "next";
import { BibliotecaHero } from "@/features/biblioteca/components/BibliotecaHero";

export const metadata: Metadata = {
  title: "Biblioteca",
  description:
    "Publicaciones y recursos de Empoderamiento Docente: producción académica, materiales pedagógicos y proyectos, abiertos para llevar al aula.",
};

export default function BibliotecaPage() {
  return (
    <main>
      <BibliotecaHero />
      {/* Próximas secciones (sitemap): Buscador + filtros (tipo, tema, público,
          año, proyecto) · Material destacado · Categorías principales · Listado
          de recursos (#materiales) · Puente con Investigación · Cierre. */}
    </main>
  );
}
