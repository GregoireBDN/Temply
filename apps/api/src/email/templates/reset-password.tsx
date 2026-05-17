import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { emailTokens as t } from '#/email/tokens'

interface ResetPasswordEmailProps {
  resetUrl: string
}

const APP_NAME = 'Temply'
const APP_URL = process.env['APP_URL'] ?? 'http://localhost:3000'

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Réinitialisez votre mot de passe {APP_NAME}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Img
              src={`${APP_URL}/temply-logo.svg`}
              alt={APP_NAME}
              height={36}
              style={logoImg}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Réinitialisation de mot de passe</Heading>
            <Text style={paragraph}>
              Vous avez demandé à réinitialiser le mot de passe de votre compte <strong>{APP_NAME}</strong>.
              Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
            </Text>
            <Text style={paragraph}>
              Ce lien est valable <strong>1 heure</strong>. Passé ce délai, vous devrez faire une nouvelle demande.
            </Text>

            <Section style={buttonSection}>
              <Button href={resetUrl} style={button}>
                Réinitialiser mon mot de passe
              </Button>
            </Section>

            <Hr style={divider} />

            <Text style={small}>
              Si vous n&apos;avez pas fait cette demande, ignorez cet email — votre mot de passe ne sera pas modifié.
            </Text>
            <Text style={small}>
              Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :{' '}
              <a href={resetUrl} style={link}>{resetUrl}</a>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {APP_NAME} · <a href={APP_URL} style={link}>{APP_URL}</a>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: t.background,
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '40px 0',
}

const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
}

const header: React.CSSProperties = {
  backgroundColor: t.card,
  borderRadius: `${t.radius} ${t.radius} 0 0`,
  borderTop: `4px solid ${t.primary}`,
  padding: '28px 40px',
  textAlign: 'center',
}

const logoImg: React.CSSProperties = {
  display: 'block',
  margin: '0 auto',
}

const content: React.CSSProperties = {
  backgroundColor: t.card,
  padding: '40px',
}

const h1: React.CSSProperties = {
  color: t.foreground,
  fontSize: '22px',
  fontWeight: '700',
  letterSpacing: '-0.3px',
  lineHeight: '1.3',
  margin: '0 0 16px',
}

const paragraph: React.CSSProperties = {
  color: t.mutedFg,
  fontSize: '15px',
  lineHeight: '1.7',
  margin: '0 0 14px',
}

const buttonSection: React.CSSProperties = {
  margin: '28px 0',
  textAlign: 'center',
}

const button: React.CSSProperties = {
  backgroundColor: t.primary,
  borderRadius: t.radius,
  color: t.primaryFg,
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '14px 32px',
  textDecoration: 'none',
}

const divider: React.CSSProperties = {
  borderColor: t.border,
  borderTopWidth: '1px',
  margin: '28px 0',
}

const small: React.CSSProperties = {
  color: t.mutedFg,
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 10px',
}

const link: React.CSSProperties = {
  color: t.primary,
  textDecoration: 'underline',
}

const footer: React.CSSProperties = {
  backgroundColor: t.background,
  borderRadius: `0 0 ${t.radius} ${t.radius}`,
  borderTop: `1px solid ${t.border}`,
  padding: '20px 40px',
  textAlign: 'center',
}

const footerText: React.CSSProperties = {
  color: t.mutedFg,
  fontSize: '12px',
  margin: 0,
}
