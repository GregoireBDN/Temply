import { getRequestHeader } from '@tanstack/react-start/server'

/**
 * Forward the current request's cookies to the API for SSR loaders.
 * Use inside createServerFn() handlers that call generated API services.
 */
export function withServerCookies(): { headers?: Record<string, string> } {
  const cookie = getRequestHeader('cookie')
  return cookie ? { headers: { cookie } } : {}
}
