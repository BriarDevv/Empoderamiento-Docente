/**
 * Áreas de interés del formulario de postulación. Reflejan las líneas
 * en las que ED contrata profesionales (infografía oficial: investigación,
 * diseño curricular, formación docente, recursos, etc.).
 *
 * Si Daniela quiere ajustar la lista o sumar áreas nuevas, editar este
 * archivo — está centralizado para que el dropdown del form coincida con
 * lo que efectivamente buscan en RR.HH.
 */
export const AREAS_INTERES = [
  "Investigación",
  "Formación docente",
  "Diseño curricular y pedagógico",
  "Desarrollo de recursos digitales",
  "Comunicación y contenidos",
  "Administración / coordinación de proyectos",
  "Otra (especificar en el mensaje)",
] as const;

export type AreaInteres = (typeof AREAS_INTERES)[number];
