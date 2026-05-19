#!/usr/bin/env bash
# init — bootstrap mínimo para developer nuevo en Empoderamiento Docente
#
# Cómo correr:
#   bash scripts/init.sh
#
# Qué hace:
#   1. Chequea que las herramientas mínimas estén instaladas.
#   2. Copia .env.example → .env.local si no existe todavía.
#   3. Te dice qué hacer después.
#
# Qué NO hace (a propósito — requiere OK humano por AGENTS.md §5.6):
#   - 'pnpm install' — corré pnpm install vos cuando estés listo.
#   - Crear branches ni commits.
#   - Tocar credenciales de Mongo.

set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  GREEN=$(tput setaf 2); RED=$(tput setaf 1); YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  GREEN=""; RED=""; YELLOW=""; BLUE=""; BOLD=""; RESET=""
fi

ok()    { echo "${GREEN}✓${RESET} $1"; }
warn()  { echo "${YELLOW}⚠${RESET} $1"; }
bad()   { echo "${RED}✗${RESET} $1"; }
title() { echo; echo "${BOLD}${BLUE}── $1 ──${RESET}"; }

MISSING=0

# ── 1. herramientas requeridas ─────────────────────────────────────────────
title "Herramientas requeridas"

check_tool() {
  local cmd="$1"
  local min_version="$2"
  local install_hint="$3"

  if command -v "$cmd" >/dev/null 2>&1; then
    local version
    version=$("$cmd" --version 2>&1 | head -1)
    ok "$cmd disponible — $version"
  else
    bad "$cmd no está instalado. Instalar: $install_hint"
    MISSING=$((MISSING+1))
  fi
}

check_tool git "any"   "https://git-scm.com/downloads"
check_tool node "22+"  "https://nodejs.org (LTS 22 o superior)"
check_tool pnpm "11+"  "corepack enable && corepack prepare pnpm@latest --activate"
check_tool bash "any"  "(macOS / Linux nativo; Windows: Git Bash o WSL)"

if [[ $MISSING -gt 0 ]]; then
  echo
  bad "Faltan $MISSING herramientas. Instalalas y volvé a correr 'bash scripts/init.sh'."
  exit 1
fi

# ── 2. .env.local ──────────────────────────────────────────────────────────
title "Variables de entorno"

if [[ -f .env.local ]]; then
  ok ".env.local ya existe — no se toca."
elif [[ -f .env.example ]]; then
  cp .env.example .env.local
  ok "Creé .env.local copiando .env.example."
  warn "Completar las variables (especialmente MONGODB_URI) antes de 'pnpm dev'."
else
  bad "No existe .env.example en root — error inesperado del repo."
  exit 1
fi

# ── 3. siguiente paso ──────────────────────────────────────────────────────
title "Listo"

cat <<EOF

${BOLD}Siguientes pasos:${RESET}

  1. ${BOLD}Instalar dependencias${RESET}
       pnpm install

  2. ${BOLD}Completar credenciales${RESET} en .env.local
       MONGODB_URI=...

  3. ${BOLD}Correr health check${RESET}
       pnpm doctor

  4. ${BOLD}Levantar dev server${RESET}
       pnpm dev

${BOLD}Para empezar a contribuir leé:${RESET}
  - README.md           — quickstart y arquitectura
  - AGENTS.md           — reglas no negociables del repo
  - docs/COMMITS.md     — convención de commits
  - CLAUDE.md           — si usás Claude Code
  - CODEX.md / GEMINI.md — si usás otro CLI

EOF
