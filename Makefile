.PHONY: install \
        dev dev-web dev-api \
        build lint typecheck test clean \
        up down docker-logs \
        migrate-up migrate-down

COMPOSE = docker compose
DBMATE  = $(COMPOSE) --profile migrate run --rm migrate

install: ## Установить все зависимости workspace
	npm install

dev: ## Запустить все приложения в dev-режиме через Turborepo
	npx turbo run dev

dev-web: ## Запустить только frontend в dev-режиме
	npm run dev --workspace=apps/web

dev-api: ## Запустить только API в dev-режиме
	npm run dev --workspace=apps/api

build: ## Собрать все приложения и пакеты
	npx turbo run build

lint: ## Запустить ESLint во всех workspace
	npx turbo run lint

typecheck: ## Запустить проверку типов TypeScript во всех workspace
	npx turbo run typecheck

test: ## Запустить все unit-тесты
	npx turbo run test

docker-logs: ## Показать логи запущенных контейнеров
	$(COMPOSE) logs -f

up: ## Запустить все сервисы
	$(COMPOSE) up --build -d

down: ## Остановить и удалить все сервисы
	$(COMPOSE) down

migrate-up: ## Применить все миграции
	$(DBMATE) up

migrate-down: ## Откатить последнюю применённую миграцию
	$(DBMATE) down

clean: ## Удалить все артефакты сборки и node_modules
	npx turbo run clean
	rm -rf node_modules
