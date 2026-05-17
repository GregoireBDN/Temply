import { authControllerResendVerification, authControllerVerifyEmail } from '#/api'
import { useAuth } from '#/lib/auth-context'
import { ROUTES } from '#/lib/routes'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@temply/ui'
import { CheckCircle2Icon, RefreshCwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/verify-email')({
  validateSearch: z.object({ token: z.string().optional() }),
  component: VerifyEmailPage,
})

type Status = 'idle' | 'loading' | 'success' | 'error'

function VerifyEmailPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'idle')
  const [resending, setResending] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  useEffect(() => {
    if (!token) return

    authControllerVerifyEmail({ body: { token }, throwOnError: false })
      .then((res) => {
        setStatus(res.error ? 'error' : 'success')
      })
      .catch(() => setStatus('error'))
  }, [token])

  async function onResend() {
    setResending(true)
    const res = await authControllerResendVerification({ throwOnError: false })
    setResending(false)
    if (res.error) {
      toast.error("Impossible d'envoyer l'email")
      return
    }
    setResendSent(true)
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Vérification en cours…</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-6">
        <Card className="border-l-success/50 w-full max-w-sm border-l-4">
          <CardHeader>
            <CardTitle className="text-lg">Email vérifié</CardTitle>
            <CardDescription className="leading-relaxed">
              Votre adresse email a bien été vérifiée. Vous avez maintenant accès à
              l&apos;ensemble des fonctionnalités de votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-0">
            <Button onClick={() => navigate({ to: ROUTES.home })} className="w-full">
              Retour à l&apos;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-6">
        <Card className="border-l-destructive w-full max-w-sm border-l-4">
          <CardHeader>
            <CardTitle className="text-destructive text-lg">Lien invalide</CardTitle>
            <CardDescription className="leading-relaxed">
              Ce lien de vérification est invalide ou a expiré.
              {user && !resendSent && ' Demandez-en un nouveau pour activer votre compte.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-0 flex flex-col gap-2">
            {user && (
              resendSent ? (
                <div className="text-success bg-success/10 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium">
                  <CheckCircle2Icon className="size-4" />
                  Un nouvel email a été envoyé.
                </div>
              ) : (
                <Button onClick={onResend} loading={resending} className="w-full">
                  <RefreshCwIcon className="size-4" />
                  Renvoyer un lien
                </Button>
              )
            )}
            <Button asChild variant="secondary" ghost className="w-full">
              <Link to={ROUTES.home}>Retour à l&apos;accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
          <CardDescription>
            Un email de vérification vous a été envoyé. Cliquez sur le lien dans l&apos;email pour
            activer votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-center text-sm">
            Pensez à vérifier vos spams si vous ne voyez pas l&apos;email.
          </p>
          {user && (
            resendSent ? (
              <p className="text-center text-sm text-green-600">
                Un nouvel email a été envoyé.
              </p>
            ) : (
              <div className="flex justify-center">
                <Button variant="secondary" onClick={onResend} loading={resending}>
                  Renvoyer l&apos;email
                </Button>
              </div>
            )
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="secondary">
            <Link to={ROUTES.home}>Retour à l&apos;accueil</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
