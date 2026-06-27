import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { authControllerLogin } from '#/api'
import { isRateLimited, rateLimitMessage, rateLimitWarning } from '#/lib/api-errors'
import { useAuth } from '#/lib/auth-context'
import { ROUTES } from '#/lib/routes'
import { Alert, AlertAction, AlertDescription, Button, Field, FieldError, FieldLabel, Input, PasswordInput } from '@temply/ui'
import { loginSchema, type LoginValues } from './auth.schemas'

interface LoginFormProps {
  onSwitchToForgot: () => void
}

export function LoginForm({ onSwitchToForgot }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginValues) {
    setError(null)
    const res = await authControllerLogin({ body: values, throwOnError: false })
    if (res.error) {
      if (isRateLimited(res.response)) {
        setError(rateLimitMessage(res.response))
        return
      }
      const warning = rateLimitWarning(res.response)
      setError(
        warning
          ? `Email ou mot de passe incorrect. ${warning}`
          : 'Email ou mot de passe incorrect',
      )
      return
    }
    await refresh()
    await navigate({ to: ROUTES.home })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="login-email">Email</FieldLabel>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <FieldError>{form.formState.errors.email.message}</FieldError>
        )}
      </Field>

      <Field data-invalid={!!form.formState.errors.password}>
        <FieldLabel htmlFor="login-password">Mot de passe</FieldLabel>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.password}
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <FieldError>{form.formState.errors.password.message}</FieldError>
        )}
      </Field>

      <div className="text-right">
        <Button type="button" variant="secondary" link size="xs" onClick={onSwitchToForgot}>
          Mot de passe oublié ?
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <AlertAction onClick={() => setError(null)} aria-label="Fermer">
            <X className="size-3.5" />
          </AlertAction>
        </Alert>
      )}

      <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
        Se connecter
      </Button>
    </form>
  )
}
