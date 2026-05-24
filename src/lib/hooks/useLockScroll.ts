import { useEffect } from "react";

/**
 * Bloquea el scroll del <body> mientras `locked` sea true. Restaura el
 * valor previo de `overflow` al desmontar o cuando `locked` pasa a false.
 *
 * Pensado para modales / overlays que necesitan congelar el contenido
 * detrás (ej. TeamModal en /nosotros).
 */
export function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
