import { createServerFn } from '@tanstack/react-start'
import { createClient } from '#/api/client'
import { authControllerMe } from '#/api'
import { withServerCookies } from '#/lib/server-api'
import type { UserDto } from '#/api/types.gen'

export const getMe = createServerFn().handler(
  async (): Promise<UserDto | null> => {
    const apiClient = createClient({
      baseUrl: process.env['VITE_API_URL'] ?? 'http://localhost:4000',
    })
    const res = await authControllerMe({
      client: apiClient,
      throwOnError: false,
      ...withServerCookies(),
    })
    if (res.error || !res.data) return null
    return res.data
  },
)
