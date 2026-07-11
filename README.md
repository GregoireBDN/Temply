# Temply

Template full-stack TypeScript prêt à l'emploi : monorepo **pnpm + Turborepo** avec une API NestJS, un front React 19 (TanStack Start, SSR), une librairie de composants et un pipeline de client API typé de bout en bout.

L'auth, l'envoi d'emails, l'analytics/error-tracking, la CI et le build Docker de prod sont déjà branchés — l'objectif est de démarrer une nouvelle app sans repartir de zéro.

## Sommaire

- [Ce qui est inclus](#ce-qui-est-inclus)
- [Prérequis](#prérequis)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du monorepo](#structure-du-monorepo)
- [Commandes](#commandes)
- [Client API typé](#client-api-typé)
- [Variables d'environnement](#variables-denvironnement)
- [Tests](#tests)
- [Docker](#docker)

## Ce qui est inclus

- **Auth complète** — password (register / login / logout, hash bcrypt), vérification d'email, forgot/reset password, refresh tokens, et OAuth Google (PKCE) + Apple. JWT cookie httpOnly.
- **Emails transactionnels** — templates React Email rendus en HTML, envoyés via nodemailer/SMTP. En dev, tout arrive dans Mailpit.
- **Analytics & error tracking** — wrapper PostHog côté API (product events + exceptions 5xx) et côté web (autocapture, pageviews). No-op tant que les clés ne sont pas renseignées.
- **Client API typé** — la spec OpenAPI est générée depuis l'API et le client fetch web est généré à partir de cette spec (voir [Client API typé](#client-api-typé)).
- **Librairie UI** — `@temply/ui` (Radix + Tailwind v4), documentée dans Storybook.
- **CI** — GitHub Actions (`.github/workflows/ci.yml`) : lint, types, tests, build.
- **Docker** — `docker-compose.yml` (dev : Postgres + Mailpit) et `docker-compose.prod.yml` (build multi-stage de tous les services).

## Prérequis

- **Node.js** ≥ 20 (LTS)
- **pnpm** 10.11.0 (défini via `packageManager` — active-le avec `corepack enable`)
- **Docker** (pour PostgreSQL + Mailpit en local)

## Démarrage rapide

```bash
# 1. Installer les dépendances
corepack enable
pnpm install

# 2. Lancer les services de dev (PostgreSQL + Mailpit)
docker compose up -d

# 3. Configurer l'API
cp apps/api/.env.example apps/api/.env
# éditer apps/api/.env si besoin — les valeurs par défaut ciblent les conteneurs Docker

# 4. Appliquer les migrations de base de données
pnpm db:migrate

# 5. Lancer toutes les apps
pnpm dev
```

| Service         | URL                     |
| --------------- | ----------------------- |
| Web (front)     | http://localhost:3000   |
| API             | http://localhost:4000/api |
| Storybook (UI)  | http://localhost:6006   |
| Mailpit (mails) | http://localhost:8025   |
| PostgreSQL      | localhost:5432          |

## Structure du monorepo

```
apps/
  api/       NestJS (Fastify), port 4000, routes préfixées /api
  web/       React 19 + TanStack Start (SSR), port 3000
  ui-docs/   Storybook v9 pour @temply/ui, port 6006
packages/
  shared/              @temply/shared — schémas Zod partagés
  ui/                  @temply/ui — composants Radix + Tailwind
  config-typescript/   configs TS partagées (base / nestjs / react)
```

> Détails d'architecture (modules API, routing web, conventions) : voir [`CLAUDE.md`](./CLAUDE.md).

## Commandes

Toutes lancées depuis la racine (Turborepo orchestre les apps) :

```bash
pnpm dev            # démarre toutes les apps
pnpm build          # build de production
pnpm test           # tests (Vitest)
pnpm lint           # ESLint
pnpm check-types    # tsc --noEmit
pnpm generate       # régénère la spec OpenAPI + le client web typé
pnpm format         # Prettier + ESLint --fix

# Base de données (Drizzle)
pnpm db:generate    # génère une migration
pnpm db:migrate     # applique les migrations
pnpm db:studio      # ouvre Drizzle Studio
```

Scoper à une seule app :

```bash
pnpm --filter @temply/api dev
pnpm --filter @temply/web dev
pnpm --filter @temply/ui-docs dev
```

Un hook pre-commit (`lint-staged`) applique ESLint + Prettier sur les fichiers modifiés.

## Client API typé

Le front ne fait **pas** d'appels `fetch` à la main — il consomme un client généré et typé :

1. `apps/api` génère `apps/api/openapi.json` (`pnpm --filter @temply/api generate`).
2. `apps/web` génère un client fetch typé dans `apps/web/src/api/` à partir de cette spec (`@hey-api/openapi-ts`).
3. `pnpm generate` à la racine enchaîne les deux dans le bon ordre.

Après avoir modifié un DTO ou un controller de l'API, annote l'endpoint avec les décorateurs `@nestjs/swagger` puis relance `pnpm generate`. **Ne jamais éditer `apps/web/src/api/` à la main.**

## Variables d'environnement

Copier `apps/api/.env.example` vers `apps/api/.env`. Principales clés :

- `DATABASE_URL` — chaîne de connexion PostgreSQL
- `JWT_SECRET` — secret de signature des JWT
- `APP_URL` — origine du front (défaut : `http://localhost:3000`)
- OAuth Google : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- OAuth Apple : `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, `APPLE_REDIRECT_URI`
- SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` (défauts → Mailpit)

Les valeurs par défaut de `.env.example` correspondent aux conteneurs de `docker-compose.yml` — l'app tourne en local sans configuration supplémentaire.

L'analytics est optionnelle : renseigner `POSTHOG_KEY` (API) et `VITE_POSTHOG_KEY` (web) pour l'activer. Non renseignées, ces intégrations sont des no-op.

## Tests

Les deux apps utilisent **Vitest**.

```bash
pnpm test                                   # tous les tests
pnpm --filter @temply/api test              # tests API
pnpm --filter @temply/web test              # tests web (jsdom + Testing Library)

# Un seul fichier
cd apps/api && pnpm vitest run src/auth/auth.service.spec.ts
cd apps/web && pnpm vitest run src/components/auth/LoginForm.test.tsx

# E2E web (Playwright)
pnpm --filter @temply/web test:e2e
```

## Docker

```bash
# Dev — PostgreSQL + Mailpit (les apps tournent sur le host)
docker compose up -d

# Prod — build et lance tous les services
docker compose -f docker-compose.prod.yml up --build -d
```

`docker-compose.prod.yml` attend les variables suivantes (via un `.env` racine ou l'environnement du shell) : `POSTGRES_USER`, `POSTGRES_PASSWORD`, `JWT_SECRET`, `APP_URL`, les credentials OAuth Google/Apple et la config SMTP.
