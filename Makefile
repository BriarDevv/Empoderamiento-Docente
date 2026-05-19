# Makefile — atajos cross-platform para Empoderamiento Docente
#
# Equivale a los scripts de package.json. Útil si preferís 'make build' en
# vez de 'pnpm build'. En Windows nativo necesitás Git Bash + make instalado
# (en macOS y Linux funciona out-of-the-box).
#
# Listar atajos: make help (o sólo 'make' — es el target default).

.DEFAULT_GOAL := help

.PHONY: help install dev build start lint typecheck format format-check doctor check check-all clean

help: ## Mostrar este menú
	@echo "Atajos disponibles:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Instalar dependencias con pnpm (requiere OK humano por §5.6)
	pnpm install

dev: ## Levantar dev server (Next.js)
	pnpm dev

build: ## Build de producción
	pnpm build

start: ## Servir el build (después de 'make build')
	pnpm start

lint: ## Correr ESLint
	pnpm lint

typecheck: ## Correr tsc --noEmit
	pnpm typecheck

format: ## Aplicar Prettier (escribe)
	pnpm format

format-check: ## Verificar formato (Prettier --check)
	pnpm format:check

doctor: ## Health check de §5 hard rules (scripts/ed-doctor.sh)
	pnpm doctor

check: ## Lint + typecheck + format:check
	pnpm check

check-all: ## check + doctor (todo lo que pide el CI)
	pnpm check:all

clean: ## Borrar build artifacts y node_modules
	rm -rf .next out node_modules
