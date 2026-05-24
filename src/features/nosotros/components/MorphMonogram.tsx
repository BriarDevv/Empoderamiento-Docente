import { getInitials } from "../lib/getInitials";

/**
 * Iniciales sobre fondo navy para personas sin foto. Usado dentro del
 * morph clone y del slot del TeamModal.
 */
export function MorphMonogram({ name }: { name: string }) {
  const initials = getInitials(name);

  return (
    <div className="bg-azul-principal flex h-full w-full items-center justify-center">
      <span
        className="font-display text-azul-claro/40 font-light"
        style={{ fontSize: "clamp(60px, 10vw, 160px)" }}
      >
        {initials}
      </span>
    </div>
  );
}
