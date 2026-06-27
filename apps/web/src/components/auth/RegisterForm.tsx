import { authControllerRegister } from '#/api'
import { isRateLimited, rateLimitMessage } from '#/lib/api-errors'
import { useAuth } from '#/lib/auth-context'
import { ROUTES } from '#/lib/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Button, Field, FieldError, FieldLabel, Input, PasswordInput } from '@temply/ui'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { registerSchema, type RegisterValues } from './auth.schemas'

export function RegisterForm() {
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', name: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(values: RegisterValues) {
    const res = await authControllerRegister({
      body: { email: values.email, name: values.name, password: values.password },
      throwOnError: false,
    })
    if (res.error) {
      toast.error(
        isRateLimited(res.response)
          ? rateLimitMessage(res.response)
          : getErrorMessage(res.error),
      )
      return
    }
    await refresh()
    await navigate({ to: ROUTES.verifyEmail })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field data-invalid={!!form.formState.errors.name}>
        <FieldLabel htmlFor="register-name">Nom</FieldLabel>
        <Input
          id="register-name"
          type="text"
          autoComplete="name"
          aria-invalid={!!form.formState.errors.name}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <FieldError>{form.formState.errors.name.message}</FieldError>
        )}
      </Field>

      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="register-email">Email</FieldLabel>
        <Input
          id="register-email"
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
        <FieldLabel htmlFor="register-password">Mot de passe</FieldLabel>
        <PasswordInput
          id="register-password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.password}
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <FieldError>{form.formState.errors.password.message}</FieldError>
        )}
      </Field>

      <Field data-invalid={!!form.formState.errors.confirmPassword}>
        <FieldLabel htmlFor="register-confirm-password">Confirmer le mot de passe</FieldLabel>
        <PasswordInput
          id="register-confirm-password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.confirmPassword}
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword && (
          <FieldError>{form.formState.errors.confirmPassword.message}</FieldError>
        )}
      </Field>

      <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
        Créer un compte
      </Button>
    </form>
  )
}

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }
  return 'Une erreur est survenue'
}
