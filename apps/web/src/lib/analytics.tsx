import { PostHogProvider } from '@posthog/react'

/**
 * Client-side PostHog: product analytics (autocapture + pageviews on route
 * change) and browser error tracking. Configured via Vite public env vars.
 *
 * When `VITE_POSTHOG_KEY` is unset the provider is skipped entirely, so local
 * dev runs without a PostHog project. `PostHogProvider` (the `apiKey`/`options`
 * form) is SSR-safe: it only initialises the client in the browser.
 */
const POSTHOG_KEY = import.meta.env['VITE_POSTHOG_KEY'] as string | undefined
const POSTHOG_HOST =
  (import.meta.env['VITE_POSTHOG_HOST'] as string | undefined) ??
  'https://us.i.posthog.com'

/**
 * True when PostHog is configured. `usePostHog()` always returns the global
 * singleton (never undefined), so consumers gate their calls on this flag to
 * avoid firing events against an uninitialised instance when analytics is off.
 */
export const analyticsEnabled = Boolean(POSTHOG_KEY)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!POSTHOG_KEY) return <>{children}</>

  return (
    <PostHogProvider
      apiKey={POSTHOG_KEY}
      options={{
        api_host: POSTHOG_HOST,
        defaults: '2026-05-30',
        // Capture unhandled exceptions and promise rejections for error tracking.
        capture_exceptions: true,
        // Only create person profiles once a user is identified (post-login).
        person_profiles: 'identified_only',
      }}
    >
      {children}
    </PostHogProvider>
  )
}
