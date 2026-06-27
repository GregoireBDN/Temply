import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  MailCheckIcon,
  PaletteIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ZapIcon,
} from 'lucide-react'
import { authControllerResendVerification } from '#/api'
import type { UserDto } from '#/api/types.gen'
import { isRateLimited, rateLimitMessage } from '#/lib/api-errors'
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@temply/ui'
import { getMe } from '#/lib/auth'
import { ROUTES } from '#/lib/routes'

export const Route = createFileRoute('/')({
  loader: async () => ({ user: await getMe() }),
  component: HomePage,
})

function HomePage() {
  const { user } = Route.useLoaderData()
  return user ? <LoggedInHome user={user} /> : <LandingPage />
}

function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 6) return 'Bonne nuit'
  if (hour < 18) return 'Bonjour'
  return 'Bonsoir'
}

function LoggedInHome({ user }: { user: UserDto }) {
  const firstName = user.name.split(' ')[0] ?? user.name
  const greeting = getGreeting()
  const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const needsVerification = !user.emailVerifiedAt

  return (
    <main className="page-wrap relative flex flex-1 flex-col justify-center px-4 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="bg-primary/20 absolute -top-24 left-1/4 size-72 rounded-full blur-3xl animate-pulse" />
        <div
          className="bg-info/20 absolute -top-10 right-1/4 size-72 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {greeting},{' '}
            <span className="from-primary to-info bg-gradient-to-r bg-clip-text text-transparent">
              {firstName}
            </span>{' '}
            <span className="inline-block origin-[70%_70%] animate-[wave_1.4s_ease-in-out_2]">
              👋
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {needsVerification
              ? 'Bienvenue sur Temply ! Une dernière étape avant de profiter pleinement de votre compte.'
              : `Heureux de vous revoir. Membre depuis ${memberSince}.`}
          </p>
        </header>

        {needsVerification && <VerifyEmailCard email={user.email} />}
      </div>

      <style>{`
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </main>
  )
}

function VerifyEmailCard({ email }: { email: string }) {
  const [resending, setResending] = useState(false)
  const [sent, setSent] = useState(false)

  async function onResend() {
    setResending(true)
    const res = await authControllerResendVerification({ throwOnError: false })
    setResending(false)
    if (res.error) {
      toast.error(
        isRateLimited(res.response)
          ? rateLimitMessage(res.response)
          : "Impossible d'envoyer l'email",
      )
      return
    }
    setSent(true)
    toast.success('Email renvoyé avec succès')
  }

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
          <MailCheckIcon className="size-5" />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-base">Vérifiez votre adresse email</CardTitle>
          <CardDescription className="leading-relaxed">
            Un lien de confirmation a été envoyé à{' '}
            <span className="text-foreground font-medium">{email}</span>. Cliquez dessus
            pour activer l&apos;ensemble des fonctionnalités de votre compte.
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter className="flex-wrap gap-2">
        {sent ? (
          <div className="text-success flex items-center gap-2 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2Icon className="size-4" />
            Email renvoyé. Pensez à vérifier vos spams.
          </div>
        ) : (
          <>
            <Button onClick={onResend} loading={resending} size="sm">
              <RefreshCwIcon className="size-4" />
              Renvoyer le lien
            </Button>
            <Button asChild variant="secondary" ghost size="sm">
              <Link to="/verify-email">
                J&apos;ai reçu l&apos;email
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Auth intégrée',
    description:
      "JWT httpOnly, OAuth Google, inscription et connexion prêts à l'emploi. Sécurisé par défaut.",
  },
  {
    icon: ZapIcon,
    title: 'Stack moderne',
    description:
      'NestJS + Fastify côté API, React 19 + TanStack Start (SSR) côté web, Tailwind CSS v4.',
  },
  {
    icon: PaletteIcon,
    title: 'UI complète',
    description:
      'Bibliothèque de composants basée sur Radix UI — boutons, formulaires, overlays, thème clair/sombre.',
  },
  {
    icon: DatabaseIcon,
    title: 'Base de données',
    description:
      'Drizzle ORM + PostgreSQL avec migrations versionnées et schémas typés de bout en bout.',
  },
] as const

const stack = [
  'NestJS',
  'React 19',
  'TanStack Router',
  'TanStack Start',
  'Drizzle ORM',
  'PostgreSQL',
  'Tailwind CSS v4',
  'Radix UI',
  'Zod',
  'pnpm',
  'Turborepo',
]

function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 flex justify-center">
        <div
          className="bg-primary/25 size-[40rem] rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
      </div>
      <div className="pointer-events-none absolute -top-10 right-0 -z-10">
        <div
          className="bg-info/20 size-[28rem] rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '1s' }}
        />
      </div>
      <div className="pointer-events-none absolute top-1/2 left-0 -z-10">
        <div
          className="bg-accent/30 size-[24rem] rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '7s', animationDelay: '2s' }}
        />
      </div>

      <section className="px-4 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-500">
            <SparklesIcon className="size-4" />
            Boilerplate full-stack moderne
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-75">
            Démarrez votre projet
            <br />
            <span className="from-primary via-info to-primary bg-gradient-to-r bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]">
              full-stack en minutes
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Temply vous offre une base complète — authentification, API, base de données et
            composants UI — prête à l'emploi. Concentrez-vous sur votre produit.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              asChild
              size="xl"
              pill
              className="transition-transform hover:-translate-y-0.5"
            >
              <Link to={ROUTES.auth}>
                Créer un compte
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="secondary"
              outline
              pill
              className="transition-transform hover:-translate-y-0.5"
            >
              <Link to={ROUTES.auth}>Se connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-border border-t px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-500">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-card ring-foreground/10 hover:ring-primary/30 relative rounded-2xl p-6 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="bg-primary/10 text-primary mb-4 inline-flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-t px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase">
            Stack technique
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {stack.map((tech, i) => (
              <span
                key={tech}
                className="bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary cursor-default rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 animate-in fade-in zoom-in-95 duration-500"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </main>
  )
}
