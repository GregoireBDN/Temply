FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @temply/api build
RUN pnpm --filter @temply/api deploy --prod /prod/api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /prod/api .
EXPOSE 4000
# Probe the real Terminus health endpoint (checks the DB and SMTP). A 5xx makes
# `fetch` resolve with `ok: false`, so the container is reported unhealthy.
HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://localhost:4000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main"]
