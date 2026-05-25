import type { Metadata } from "next";
import { PageHeader } from "@/features/sumate/components/PageHeader";
import { SumateComunidad } from "@/features/sumate/components/SumateComunidad";
import { SumateInstitucional } from "@/features/sumate/components/SumateInstitucional";

export const metadata: Metadata = {
  title: "Sumate",
  description:
    "Postulate al equipo de Empoderamiento Docente. También podés sumarte a la comunidad docente o llevar ED a tu institución.",
};

/**
 * Página /sumate.
 *
 * Estructura "form-first" (decisión de IA Mayo 2026):
 * - PageHeader contiene el formulario de postulación EMBEBIDO arriba a
 *   la derecha. El user que viene a postularse lo ve al instante.
 * - SumateComunidad y SumateInstitucional vienen abajo como secciones
 *   secundarias para los otros 2 paths de sumarse (cards de redes /
 *   redirección al form B2B de /contacto).
 *
 * El PathSelector original (3 cards anchor centradas) se eliminó —
 * los mini-links inline en el copy del hero cumplen ese rol sin
 * agregar otra sección scrollable.
 */
export default function SumatePage() {
  return (
    <main className="flex-1">
      <PageHeader />
      <SumateComunidad />
      <SumateInstitucional />
    </main>
  );
}
