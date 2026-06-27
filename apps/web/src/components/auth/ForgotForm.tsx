import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { authControllerForgotPassword } from '#/api'
import { isRateLimited, rateLimitMessage } from '#/lib/api-errors'
import { forgotSchema, type ForgotValues } from './auth.schemas'
import { Button, Field, FieldError, FieldLabel, Input } from '@temply/ui'

export function ForgotForm() {
  const [sent, setSent] = useState(false)

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotValues) {
    const res = await authControllerForgotPassword({ body: values, throwOnError: false })
    if (isRateLimited(res.response)) {
      toast.error(rateLimitMessage(res.response))
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-muted-foreground text-center text-sm py-4">
        Si cet email est associé à un compte, un lien de réinitialisation vous a été envoyé.
      </p>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <FieldError>{form.formState.errors.email.message}</FieldError>
        )}
      </Field>
      <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
        Envoyer le lien
      </Button>
    </form>
  )
}
