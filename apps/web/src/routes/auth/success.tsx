import { createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from '#/lib/routes'

export const Route = createFileRoute('/auth/success')({
  beforeLoad: () => {
    throw redirect({ to: ROUTES.home })
  },
  component: () => null,
})
