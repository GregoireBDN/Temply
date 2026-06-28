# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

pnpm + Turborepo monorepo with three apps and three shared packages:

- `apps/api` — NestJS backend (Fastify adapter), port 4000, all routes prefixed with `/api`
- `apps/web` — React 19 + TanStack Start (SSR), port 3000
- `apps/ui-docs` — Storybook v9 for the `@temply/ui` component library, port 6006
- `packages/shared` — `@temply/shared`, shared Zod schemas used by both apps
- `packages/ui` — `@temply/ui`, the Radix + Tailwind component library consumed by `apps/web` and documented by `apps/ui-docs`
- `packages/config-typescript` — shared TypeScript configs (`base.json`, `nestjs.json`, `react.json`)

## Commands

```bash
# From repo root — runs all apps via Turborepo
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm check-types
pnpm generate        # regenerate OpenAPI spec + typed web client (see "Typed API client")

# Scoped to a single app
pnpm --filter @temply/api dev
pnpm --filter @temply/web dev
pnpm --filter @temply/ui-docs dev   # Storybook

# Database (run from apps/api or use --filter)
pnpm --filter @temply/api db:generate   # generate Drizzle migrations
pnpm --filter @temply/api db:migrate    # apply migrations
pnpm --filter @temply/api db:studio     # Drizzle Studio

# Run a single web test
cd apps/web && pnpm vitest run src/path/to/test.ts

# Run API tests
cd apps/api && pnpm vitest run src/auth/auth.service.spec.ts
```

Pre-commit hook runs `lint-staged`: ESLint + Prettier on `.ts`/`.tsx`, Prettier on JSON/MD/YAML.

**Testing note**: Both apps use **Vitest**. The web app's `test` script runs `vitest run`. The API also has a `vitest.config.ts` (Node environment, picks up `src/**/*.spec.ts`) and its `test` script runs `vitest run` — use `pnpm --filter @temply/api test` (or the `pnpm vitest run <file>` form above for a single spec).

## Typed API client (codegen pipeline)

The web app talks to the API through a **generated, type-safe client** — do not hand-write fetch calls or edit the generated output.

1. `apps/api` generates `apps/api/openapi.json` via `pnpm --filter @temply/api generate` (`src/generate-spec.ts` boots the Nest app in-memory and dumps the Swagger document).
2. `apps/web` consumes that spec via `@hey-api/openapi-ts` (`apps/web/openapi-ts.config.ts`), emitting a typed fetch client into `apps/web/src/api/` (`client.gen.ts`, `sdk.gen.ts`, `types.gen.ts`).
3. Turborepo's `generate` task chains these via `^generate`, so `pnpm generate` from the root runs API spec generation before the web client generation. `build` and `check-types` depend on `generate`.

`apps/web/src/api/` is **generated** — regenerate it (`pnpm generate`) after changing API DTOs/controllers rather than editing it by hand. Annotate API endpoints with `@nestjs/swagger` decorators (`@ApiBody`, `@ApiOkResponse`, `@ApiTags`, etc.) so they surface correctly in the generated client.

## API Architecture (NestJS)

Standard NestJS module structure: each domain has a `*.module.ts`, `*.controller.ts`, `*.service.ts`, and `*.schema.ts`. Current modules: `Auth`, `User`, `Email`, `Database`.

**Database**: `DatabaseService` exposes `db` (a Drizzle `PostgresJsDatabase`). All tables extend `coreColumns` from `apps/api/src/database/schema/core.schema.ts` which adds `id` (UUID PK), `createdAt`, `updatedAt`. Import schemas via `apps/api/src/database/schema/index.ts`.

**Auth**: Cookie-based JWT (`httpOnly`, `sameSite: lax`). The `token` cookie holds a 7-day JWT. Use `@UseGuards(JwtGuard)` on protected routes — `JwtGuard` verifies the cookie and attaches `{ sub: userId }` to `request.user`; read it via the `@CurrentUser()` decorator (`apps/api/src/auth/decorators/`). Two auth paths coexist:

- **Password auth**: `register` / `login` / `logout` (passwords hashed with `bcryptjs`), plus `forgot-password` / `reset-password` and email verification (`verify-email`, `resend-verification`). Verification and reset tokens are handled in `apps/api/src/email/tokens.ts`.
- **OAuth** (Google PKCE, Apple) via the `arctic` library (loaded dynamically on module init). OAuth state is stored in short-lived httpOnly cookies (`oauth_state`, `code_verifier`) during the flow; callbacks redirect to `${APP_URL}/auth/success` with the `token` cookie set.

**Email**: `EmailModule` renders React Email templates (`apps/api/src/email/templates/*.tsx`) to HTML via `react-email` and sends them with `nodemailer` over SMTP. In dev, SMTP points at **Mailpit** (`localhost:1025`, web UI at `localhost:8025`) started by `docker compose`.

**Path alias**: `#/*` resolves to `./src/*` in both the API and web apps.

## Web Architecture (TanStack Start)

File-based routing via TanStack Router — routes live in `apps/web/src/routes/`. `routeTree.gen.ts` is auto-generated; never edit it manually. The root layout is `routes/__root.tsx`.

**UI components**: live in the shared `@temply/ui` package (`packages/ui/src/components/`), Radix UI primitives styled with Tailwind CSS v4. Import them from `@temply/ui`. Use the `cn()` helper (`@temply/ui/lib/utils`, clsx + tailwind-merge) for class merging. App-specific composite components stay under `apps/web/src/components/`.

**Auth state**: client auth context in `apps/web/src/lib/auth-context.tsx`; theme via `apps/web/src/lib/use-theme.ts`.

**Styling**: Tailwind CSS v4 via `@tailwindcss/vite`. Global styles in `apps/web/src/globals.css`; shared design tokens come from `@temply/ui/globals.css`. Theme (light/dark/auto) is initialized via an inline script in `__root.tsx` before hydration to avoid flash.

**Testing**: Vitest + Testing Library (`jsdom` environment).

## Component Library (`@temply/ui` + `apps/ui-docs`)

`packages/ui` is the single source of truth for primitives. It exports components individually (`@temply/ui/components/*`), the barrel (`@temply/ui`), `./globals.css`, and `./lib/utils`. `apps/ui-docs` is a Storybook v9 (react-vite) instance documenting these components, with `@storybook/addon-vitest` for component tests (`pnpm --filter @temply/ui-docs test-storybook`). When adding or changing a primitive, update it in `packages/ui` (not `apps/web`) and add/adjust its story in `apps/ui-docs`.

## Containerisation

```bash
# Dev — lance PostgreSQL + Mailpit (les apps tournent sur le host)
docker compose up -d

# Production — build et lance tous les services
docker compose -f docker-compose.prod.yml up --build -d
```

`docker-compose.yml` expose PostgreSQL sur `localhost:5432` avec `user/password/temply` et Mailpit (SMTP `localhost:1025`, UI `localhost:8025`) pour correspondre aux valeurs par défaut de `apps/api/.env.example`.

`docker-compose.prod.yml` attend les variables d'environnement suivantes (via un fichier `.env` à la racine ou l'environnement du shell) : `POSTGRES_USER`, `POSTGRES_PASSWORD`, `JWT_SECRET`, `APP_URL`, les credentials OAuth Google/Apple, et la configuration SMTP.

Les Dockerfiles (`apps/api/Dockerfile`, `apps/web/Dockerfile`) utilisent un build multi-stage depuis la racine du monorepo comme contexte. L'API utilise `pnpm deploy --prod` pour produire une image optimisée. Le web copie uniquement le répertoire Nitro `.output/` (bundle SSR auto-suffisant).

## Environment Setup (API)

Copy `apps/api/.env.example` to `apps/api/.env` and fill in:
- `DATABASE_URL` — PostgreSQL connection string
- Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`)
- Apple OAuth credentials (`APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`, `APPLE_REDIRECT_URI`)
- `JWT_SECRET`
- `APP_URL` — web app origin (default: `http://localhost:3000`)
- SMTP config (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`) — defaults target the dev Mailpit container
