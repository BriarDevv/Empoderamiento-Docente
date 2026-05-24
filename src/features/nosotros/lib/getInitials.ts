/**
 * Devuelve las iniciales del nombre para los monogramas del equipo.
 * - 1 token: primeras 2 letras (`"Daniela"` → `"DA"`).
 * - 2+ tokens: primera letra del primero + del último (`"Daniela
 *   Reyes-Gasperini"` → `"DR"`).
 * - String vacía: `""`.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
