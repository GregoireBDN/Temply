import { defineConfig, devices } from '@playwright/test'

/**
 * E2E config for the auth happy path (register → verify-email → login).
 *
 * Prerequisites (not started by Playwright):
 *   - PostgreSQL + Mailpit via `docker compose up -d` at the repo root.
 *
 * The web (3000) and API (4000) dev servers are started below and reused if
 * they are already running. Mailpit's web API (8025) is polled by the test to
 * retrieve the verification link — override its origin with MAILPIT_URL.
 */
const WEB_URL = process.env['WEB_URL'] ?? 'http://localhost:3000'
const API_URL = process.env['VITE_API_URL'] ?? 'http://localhost:4000'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: WEB_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter @temply/api dev',
      url: `${API_URL}/api/health`,
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
      cwd: '../..',
    },
    {
      command: 'pnpm --filter @temply/web dev',
      url: WEB_URL,
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
      cwd: '../..',
    },
  ],
})
