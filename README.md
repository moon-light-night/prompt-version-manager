# Prompt Version Manager

Сервис для управления LLM-промптами, их версиями, переменными и тест-кейсами.

---

## Технологический стек

| Слой | Технология |
|------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Redux Toolkit, TanStack Query, React Hook Form + Zod, Vitest |
| **Backend** | Next.js 14, TypeScript, tRPC v11 (end-to-end type-safe RPC), GraphQL Yoga, PostgreSQL 16, dbmate |
| **Infra** | Docker Compose, Nginx, Turborepo |

---

## Архитектурная документация

- Общий индекс документации: [docs/README.md](docs/README.md)
- C4 Context: [docs/c4-context.md](docs/c4-context.md)
- C4 Container: [docs/c4-container.md](docs/c4-container.md)
- ERD баз данных: [docs/erd.md](docs/erd.md)
- Sequence diagrams: [docs/sequence-diagrams.md](docs/sequence-diagrams.md)

---

## Быстрый старт

### Требования

- Node.js ≥ 20
- Docker и Docker Compose
- npm ≥ 10

### Настройка

```bash
cp .env.example .env
make install
```

### Запуск в Docker

```bash
make up
make migrate-up
```

- Приложение: http://localhost:5173

## Переменные окружения

Полный список — в `.env.example`. Основные значения по умолчанию:

| Переменная | Значение по умолчанию | Описание |
|----------|------------------------|----------|
| `DATABASE_URL` | `postgresql://pvm_user:pvm_pass@localhost:5432/pvm_db` | Строка подключения к PostgreSQL |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | см. `.env.example` | Конфигурация PostgreSQL для Docker Compose |
| `POSTGRES_PORT` | `5432` | Порт PostgreSQL на хосте |
| `API_PORT` | `3001` | Порт API-сервера |
| `WEB_PORT` | `3000` | Порт frontend-сервера в dev-режиме |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | Базовый URL API (dev) |
| `NEXT_PUBLIC_TRPC_URL` | `http://localhost:3001/api/trpc` | tRPC endpoint (dev) |
| `NEXT_PUBLIC_GRAPHQL_URL` | `http://localhost:3001/api/graphql` | GraphQL endpoint (dev) |
| `NGINX_PORT` | `5173` | Порт Nginx на хосте (Docker) |

## Документация архитектуры

- Основные схемы находятся в `docs/README.md`
