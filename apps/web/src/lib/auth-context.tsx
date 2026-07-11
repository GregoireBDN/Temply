import { usePostHog } from '@posthog/react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authControllerLogout, authControllerMe } from '#/api'
import type { UserDto } from '#/api/types.gen'
import { analyticsEnabled } from '#/lib/analytics'
import { applyThemeMode } from '#/lib/use-theme'

type AuthState = {
  user: UserDto | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)
  // Always the PostHog singleton; only initialised when analyticsEnabled.
  const posthog = usePostHog()

  const refresh = useCallback(async () => {
    const res = await authControllerMe({ throwOnError: false })
    const fetched = res.error || !res.data ? null : res.data
    setUser(fetched)
    setLoading(false)
    if (fetched) {
      applyThemeMode(fetched.theme)
      // Tie subsequent events to this user in PostHog.
      if (analyticsEnabled) posthog.identify(fetched.id, { email: fetched.email })
    }
  }, [posthog])

  const logout = useCallback(async () => {
    await authControllerLogout({ throwOnError: false })
    setUser(null)
    // Stop associating events with the logged-out user.
    if (analyticsEnabled) posthog.reset()
  }, [posthog])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
