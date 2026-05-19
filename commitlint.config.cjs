// Conventional Commits + tipos custom de Empoderamiento Docente.
// Detalle de la convención en docs/COMMITS.md.

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Tipos válidos — alineados con docs/COMMITS.md §2.
    // Suma 'content' y 'design' a los 11 estándar de Conventional Commits.
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "build",
        "ci",
        "content",
        "design",
        "revert",
      ],
    ],

    // Descripción imperativa en español ("agregar", "corregir"). No forzamos
    // un case específico porque puede empezar con nombre propio (ej.
    // "feat(home): integrar GSAP") que tiene minúsculas igual.
    "subject-case": [0],

    // Sin punto final en el header (docs/COMMITS.md §1).
    "subject-full-stop": [2, "never", "."],

    // Header ≤ 72 chars (docs/COMMITS.md §1).
    "header-max-length": [2, "always", 72],

    // Body wrap a 72 cols (docs/COMMITS.md §5).
    "body-max-line-length": [2, "always", 72],

    // El scope queda libre. docs/COMMITS.md §3 lista los recomendados pero
    // no enforce-a porque pueden aparecer áreas nuevas.
  },
};
