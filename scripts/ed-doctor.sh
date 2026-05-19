#!/usr/bin/env bash
# ed-doctor — health check pre-PR para Empoderamiento Docente
#
# Cómo correr:
#   pnpm doctor
#   bash scripts/ed-doctor.sh
#
# Salida:
#   0 = todos los checks pasaron (warnings permitidos)
#   1 = al menos un check falló (bloquea CI y pre-commit)
#
# Reglas verificadas: AGENTS.md §5 (hard rules) + docs/AI_GUIDELINES.md.

set -uo pipefail

cd "$(git rev-parse --show-toplevel)"

PASS=0
FAIL=0
WARN=0
TOTAL=7

# ── colores ────────────────────────────────────────────────────────────────
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  GREEN=$(tput setaf 2); RED=$(tput setaf 1); YELLOW=$(tput setaf 3)
  BLUE=$(tput setaf 4); BOLD=$(tput bold); RESET=$(tput sgr0)
else
  GREEN=""; RED=""; YELLOW=""; BLUE=""; BOLD=""; RESET=""
fi

header() { echo; echo "${BOLD}${BLUE}═══ $1 ═══${RESET}"; }
ok()     { echo "${GREEN}✓${RESET} $1"; PASS=$((PASS+1)); }
warn()   { echo "${YELLOW}⚠${RESET} $1"; WARN=$((WARN+1)); }
bad()    { echo "${RED}✗${RESET} $1"; FAIL=$((FAIL+1)); }

# ── 1. .env.example presente ───────────────────────────────────────────────
header "[1/$TOTAL] .env.example presente en root"
if [[ -f .env.example ]]; then
  ok ".env.example existe"
else
  bad "Falta .env.example en root. Documentar las variables que el código lee."
fi

# ── 2. ningún .env real trackeado ──────────────────────────────────────────
header "[2/$TOTAL] Ningún .env real trackeado"
tracked_envs=$(git ls-files | grep -E '^\.env($|\.local|\.development|\.production|\.test)' | grep -v '^\.env\.example$' || true)
if [[ -z "$tracked_envs" ]]; then
  ok "No hay .env reales trackeados"
else
  bad "Archivos .env trackeados (riesgo de leak de secrets):"
  echo "$tracked_envs" | sed 's/^/    /'
  bad "    → quitarlos del index y rotar cualquier credencial expuesta."
fi

# ── 3. sin URIs de MongoDB con credenciales en src/ ────────────────────────
header "[3/$TOTAL] Sin URIs de MongoDB con credenciales en src/"
if [[ -d src ]]; then
  secrets=$(grep -rE "mongodb(\+srv)?://[^[:space:]\"'\\\\]+:[^[:space:]\"'\\\\]+@" src/ 2>/dev/null || true)
  if [[ -z "$secrets" ]]; then
    ok "No hay credenciales de MongoDB literales en src/"
  else
    bad "Encontradas URIs con credenciales en src/:"
    echo "$secrets" | sed 's/^/    /'
  fi
else
  warn "No existe src/ — skip"
fi

# ── 4. lenguaje inclusivo (WARN, no bloquea) ───────────────────────────────
header "[4/$TOTAL] Lenguaje inclusivo (WARN)"
patrones_prohibidos=(
  '\balumn[oa]s?\b'
  '\blos profesores\b'
  '\blos docentes\b'
  '\blos maestros\b'
)
hits=""
search_dirs=()
[[ -d src ]] && search_dirs+=("src")
[[ -d content ]] && search_dirs+=("content")

if [[ ${#search_dirs[@]} -gt 0 ]]; then
  for pattern in "${patrones_prohibidos[@]}"; do
    found=$(grep -rniE "$pattern" \
              --include='*.tsx' --include='*.ts' --include='*.md' --include='*.mdx' \
              "${search_dirs[@]}" 2>/dev/null || true)
    if [[ -n "$found" ]]; then
      hits+="$found"$'\n'
    fi
  done
fi

if [[ -z "$hits" ]]; then
  ok "Cero ocurrencias de masculino genérico o 'alumnos' en copy"
else
  warn "Posibles violaciones de lenguaje inclusivo (revisar — puede ser desdoblamiento legítimo):"
  echo "$hits" | sed 's/^/    /'
  echo "    → ver AGENTS.md §5.1 y docs/GLOSSARY.md"
fi

# ── 5. adapters de IA referencian AGENTS.md ────────────────────────────────
header "[5/$TOTAL] Adapters referencian AGENTS.md"
adapters_problema=""
for adapter in CLAUDE.md CODEX.md GEMINI.md; do
  if [[ -f "$adapter" ]] && ! grep -q 'AGENTS\.md' "$adapter"; then
    adapters_problema+="$adapter "
  fi
done
if [[ -z "$adapters_problema" ]]; then
  ok "Adapters CLAUDE/CODEX/GEMINI referencian AGENTS.md como fuente de verdad"
else
  bad "Adapters sin referencia a AGENTS.md: ${adapters_problema}"
  bad "    → cada adapter debe declarar que AGENTS.md es la fuente de verdad."
fi

# ── 6. rama actual deriva del tip de origin/main ───────────────────────────
header "[6/$TOTAL] Rama deriva del tip de origin/main"
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$current_branch" == "main" ]]; then
  ok "Estás en main — check no aplica"
elif git rev-parse --verify origin/main >/dev/null 2>&1; then
  origin_main=$(git rev-parse origin/main)
  merge_base=$(git merge-base HEAD origin/main 2>/dev/null || echo "")
  if [[ -z "$merge_base" ]]; then
    bad "No hay merge-base entre HEAD y origin/main — ¿branches divergentes?"
  elif [[ "$merge_base" == "$origin_main" ]]; then
    ok "Rama '$current_branch' deriva del tip de origin/main"
  else
    bad "Rama '$current_branch' NO deriva del tip de origin/main."
    bad "    → 'git fetch origin && git rebase origin/main' antes de seguir."
  fi
else
  warn "No hay tracking de origin/main — skip"
fi

# ── 7. lockfile pnpm-lock.yaml trackeado ───────────────────────────────────
header "[7/$TOTAL] Lockfile pnpm-lock.yaml trackeado"
if git ls-files | grep -qx 'pnpm-lock.yaml'; then
  ok "pnpm-lock.yaml está trackeado"
elif [[ -f pnpm-lock.yaml ]]; then
  bad "pnpm-lock.yaml existe pero NO está trackeado en git — agregarlo y commitearlo."
else
  warn "No existe pnpm-lock.yaml — corré 'pnpm install' primero"
fi

# ── resumen ────────────────────────────────────────────────────────────────
echo
echo "${BOLD}═════════════════════════════════════${RESET}"
echo "${BOLD}Resumen:${RESET} ${GREEN}${PASS} pasaron${RESET} · ${YELLOW}${WARN} warnings${RESET} · ${RED}${FAIL} fallaron${RESET}"
echo "${BOLD}═════════════════════════════════════${RESET}"

if [[ $FAIL -gt 0 ]]; then
  echo
  echo "${RED}${BOLD}ed-doctor encontró problemas bloqueantes. Resolver antes de PR.${RESET}"
  exit 1
fi

echo
echo "${GREEN}${BOLD}OK — todo verde (warnings no bloquean).${RESET}"
exit 0
