import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { authControllerResetPassword } from '#/api'
import { ROUTES } from '#/lib/routes'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldError,
  FieldLabel,
  PasswordInput,
} from '@temply/ui'

export const Route = createFileRoute('/reset-password')({
  validateSearch: z.object({ token: z.string().optional() }),
  component: ResetPasswordPage,
})

const resetSchema = z
  .object({
    password: z.string().min(8, 'Au moins 8 caractères'),
    confirm: z.string().min(8, 'Au moins 8 caractères'),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm'],
  })

type ResetValues = z.infer<typeof resetSchema>

function ResetPasswordPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const [done, setDone] = useState(false)

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirm: '' },
  })

  async function onSubmit(values: ResetValues) {
    if (!token) {
      toast.error('Lien invalide ou expiré')
      return
    }

    const res = await authControllerResetPassword({
      body: { token, password: values.password },
      throwOnError: false,
    })

    if (res.error) {
      const message = getErrorMessage(res.error)
      toast.error(message)
      return
    }

    setDone(true)
    toast.success('Mot de passe mis à jour')
    setTimeout(() => navigate({ to: ROUTES.auth }), 2000)
  }

  if (!token) {
    return (
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Lien invalide</CardTitle>
            <CardDescription>
              Ce lien de réinitialisation est invalide ou a expiré.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild variant="secondary">
              <a href={ROUTES.auth}>Retour à la connexion</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nouveau mot de passe</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe pour votre compte.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {done ? (
            <p className="text-muted-foreground text-center text-sm py-4">
              Mot de passe mis à jour. Redirection en cours…
            </p>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
              noValidate
            >
              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel htmlFor="new-password">
                  Nouveau mot de passe
                </FieldLabel>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <FieldError>
                    {form.formState.errors.password.message}
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={!!form.formState.errors.confirm}>
                <FieldLabel htmlFor="confirm-password">
                  Confirmer le mot de passe
                </FieldLabel>
                <PasswordInput
                  id="confirm-password"
                  autoComplete="new-password"
                  aria-invalid={!!form.formState.errors.confirm}
                  {...form.register('confirm')}
                />
                {form.formState.errors.confirm && (
                  <FieldError>
                    {form.formState.errors.confirm.message}
                  </FieldError>
                )}
              </Field>

              <Button
                type="submit"
                fullWidth
                loading={form.formState.isSubmitting}
              >
                Réinitialiser le mot de passe
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return (error as { message: string }).message
  }
  return 'Une erreur est survenue'
}
