import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { authControllerLogin, authControllerRegister } from '#/api'
import { ROUTES } from '#/lib/routes'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Field, FieldError, FieldLabel, Input, Separator } from '@temply/ui'
import { FcGoogle } from 'react-icons/fc'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

const API_URL = import.meta.env['VITE_API_URL'] ?? 'http://localhost:4000'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Au moins 8 caractères'),
})

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(1, 'Nom requis'),
  password: z.string().min(8, 'Au moins 8 caractères'),
})

type LoginValues = z.infer<typeof loginSchema>
type RegisterValues = z.infer<typeof registerSchema>

function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const navigate = useNavigate()

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', name: '', password: '' },
  })

  async function onSubmitLogin(values: LoginValues) {
    const res = await authControllerLogin({ body: values, throwOnError: false })
    if (res.error) {
      const message = getErrorMessage(res.error)
      toast.error(message)
      return
    }
    await navigate({ to: ROUTES.home })
  }

  async function onSubmitRegister(values: RegisterValues) {
    const res = await authControllerRegister({ body: values, throwOnError: false })
    if (res.error) {
      const message = getErrorMessage(res.error)
      toast.error(message)
      return
    }
    await navigate({ to: ROUTES.home })
  }

  function switchMode(next: 'login' | 'register') {
    loginForm.reset()
    registerForm.reset()
    setMode(next)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Connectez-vous à votre compte Temply'
              : 'Créez votre compte Temply'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Google OAuth */}
          <Button asChild fullWidth variant="secondary" outline>
            <a href={`${API_URL}/api/auth/google`} className="inline-flex items-center gap-2">
              <FcGoogle />
              Continuer avec Google
            </a>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground shrink-0 text-xs">ou</span>
            <Separator className="flex-1" />
          </div>

          {/* Email / Password form */}
          {mode === 'login' ? (
            <form
              onSubmit={loginForm.handleSubmit(onSubmitLogin)}
              className="space-y-3"
              noValidate
            >
              <Field
                data-invalid={!!loginForm.formState.errors.email}
              >
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!loginForm.formState.errors.email}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <FieldError>{loginForm.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field
                data-invalid={!!loginForm.formState.errors.password}
              >
                <FieldLabel htmlFor="login-password">Mot de passe</FieldLabel>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!loginForm.formState.errors.password}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <FieldError>{loginForm.formState.errors.password.message}</FieldError>
                )}
              </Field>

              <Button
                type="submit"
                fullWidth
                loading={loginForm.formState.isSubmitting}
              >
                Se connecter
              </Button>
            </form>
          ) : (
            <form
              onSubmit={registerForm.handleSubmit(onSubmitRegister)}
              className="space-y-3"
              noValidate
            >
              <Field
                data-invalid={!!registerForm.formState.errors.name}
              >
                <FieldLabel htmlFor="register-name">Nom</FieldLabel>
                <Input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!registerForm.formState.errors.name}
                  {...registerForm.register('name')}
                />
                {registerForm.formState.errors.name && (
                  <FieldError>{registerForm.formState.errors.name.message}</FieldError>
                )}
              </Field>

              <Field
                data-invalid={!!registerForm.formState.errors.email}
              >
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!registerForm.formState.errors.email}
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <FieldError>{registerForm.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field
                data-invalid={!!registerForm.formState.errors.password}
              >
                <FieldLabel htmlFor="register-password">Mot de passe</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!registerForm.formState.errors.password}
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <FieldError>{registerForm.formState.errors.password.message}</FieldError>
                )}
              </Field>

              <Button
                type="submit"
                fullWidth
                loading={registerForm.formState.isSubmitting}
              >
                Créer un compte
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          {mode === 'login' ? (
            <p className="text-muted-foreground text-sm">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                S&apos;inscrire
              </button>
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
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
