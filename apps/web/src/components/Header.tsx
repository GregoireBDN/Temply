import { useAuth } from '#/lib/auth-context'
import { ROUTES } from '#/lib/routes'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Button, ConfirmDialog } from '@temply/ui'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { pathname } = useLocation()
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isLanding = pathname === ROUTES.home && !user

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      await navigate({ to: ROUTES.auth })
    } finally {
      setLoggingOut(false)
      setLogoutOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link to={ROUTES.home} className="inline-flex items-center no-underline">
            <img src="/temply-logo.svg" alt="Temply" className="h-8 w-auto" />
          </Link>
        </h2>

        <div className="ml-auto flex items-center gap-2">
          {!loading && isLanding && (
            <Button asChild size="sm">
              <Link to={ROUTES.auth}>Se connecter</Link>
            </Button>
          )}
          {user && (
            <>
              <Button
                asChild
                variant="secondary"
                ghost
                size="xl"
                pill
                iconOnly
                aria-label="Réglages"
                title="Réglages"
              >
                <Link to={ROUTES.profile}>
                  <SettingsIcon />
                </Link>
              </Button>
              <Button
                variant="secondary"
                ghost
                size="xl"
                pill
                iconOnly
                iconStart={<LogOutIcon />}
                aria-label="Se déconnecter"
                title="Se déconnecter"
                onClick={() => setLogoutOpen(true)}
              />
              <ConfirmDialog
                open={logoutOpen}
                onOpenChange={setLogoutOpen}
                onConfirm={handleLogout}
                title="Se déconnecter ?"
                description="Êtes-vous sûr de vouloir vous déconnecter ?"
                confirmLabel="Se déconnecter"
                cancelLabel="Annuler"
                variant="danger"
                loading={loggingOut}
              />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
