"use client";

import { useCallback, useRef, useState } from "react";
import { PageHeader } from "@/features/nosotros/components/PageHeader";
import { TeamSection } from "@/features/nosotros/components/TeamSection";
import {
  TeamModal,
  type ModalOpenContext,
} from "@/features/nosotros/components/TeamModal";
import { team, teamByTier } from "@/features/nosotros/data/team";
import type { TeamMember } from "@/features/nosotros/types/team";

export default function NosotrosPage() {
  const [openContext, setOpenContext] = useState<ModalOpenContext | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleOpen = useCallback((member: TeamMember, photoEl: HTMLElement) => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    const index = team.findIndex((m) => m.id === member.id) + 1;
    setOpenContext({ member, index, photoEl });
  }, []);

  const handleClose = useCallback(() => {
    setOpenContext(null);
    setTimeout(() => {
      lastFocusedRef.current?.focus();
    }, 100);
  }, []);

  const directionCount = teamByTier.direccion.length;
  const leadersCount = teamByTier.lideres.length;

  return (
    <main className="relative flex-1">
      <PageHeader />

      <TeamSection
        number="01"
        title="Dirección"
        subtitle="Quienes trazan el rumbo de la consultora y articulan la visión académica del equipo."
        members={teamByTier.direccion}
        variant="large"
        startIndex={1}
        onOpen={handleOpen}
      />

      <TeamSection
        number="02"
        title="Líderes de Área y Proyecto"
        subtitle="Quienes sostienen la estructura académica y conducen las líneas de investigación."
        members={teamByTier.lideres}
        variant="medium"
        startIndex={1 + directionCount}
        onOpen={handleOpen}
      />

      <TeamSection
        number="03"
        title="Facilitación y Diseño"
        subtitle="Quienes construyen la práctica de aula y diseñan los materiales que llegan a docentes."
        members={teamByTier.facilitacion}
        variant="small"
        startIndex={1 + directionCount + leadersCount}
        onOpen={handleOpen}
      />

      <TeamModal
        openContext={openContext}
        total={team.length}
        onClose={handleClose}
      />
    </main>
  );
}
