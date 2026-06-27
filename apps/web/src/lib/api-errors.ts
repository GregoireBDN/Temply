/**
 * Helpers to surface API rate limiting (HTTP 429) to the user.
 *
 * The API throttles sensitive auth routes (login, register, forgot-password,
 * resend-verification) and replies with `429 Too Many Requests` plus a
 * `Retry-After` header (seconds). Without this, forms would mislabel a 429 as
 * "wrong credentials" or show the raw English ThrottlerException message.
 */

/** True when the API rejected the request because of rate limiting. */
export function isRateLimited(response?: Response): boolean {
  return response?.status === 429
}

function readHeaderInt(response: Response | undefined, name: string): number | null {
  const raw = response?.headers.get(name)
  if (raw == null) return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

/** Remaining attempts in the current window, or null if the header is absent. */
export function rateLimitRemaining(response?: Response): number | null {
  return readHeaderInt(response, 'x-ratelimit-remaining')
}

function blockDuration(response?: Response): string {
  const reset = readHeaderInt(response, 'x-ratelimit-reset')
  if (reset != null && reset > 0) {
    if (reset >= 60) {
      const minutes = Math.round(reset / 60)
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`
    }
    return `${reset} ${reset > 1 ? 'secondes' : 'seconde'}`
  }
  return 'un moment'
}

/**
 * Preventive warning shown alongside a failed (but not yet blocked) attempt,
 * when the user is about to hit the rate limit. Returns null when there are
 * still comfortably many attempts left.
 */
export function rateLimitWarning(response?: Response): string | null {
  const remaining = rateLimitRemaining(response)
  if (remaining == null || remaining > 1) return null
  if (remaining === 1) {
    return `Il ne vous reste qu'un essai avant d'être bloqué pendant ${blockDuration(response)}.`
  }
  // remaining === 0 : la prochaine requête sera bloquée.
  return `Dernière tentative : la prochaine sera bloquée pendant ${blockDuration(response)}.`
}

/**
 * User-facing French message for a rate-limited response, including the
 * Retry-After delay when the API provides it.
 */
export function rateLimitMessage(response?: Response): string {
  const retryAfter = Number(response?.headers.get('retry-after'))
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    const unit = retryAfter > 1 ? 'secondes' : 'seconde'
    return `Trop de tentatives. Réessayez dans ${retryAfter} ${unit}.`
  }
  return 'Trop de tentatives. Réessayez dans quelques instants.'
}
