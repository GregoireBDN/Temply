import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { render } from 'react-email'
import { env } from '#/config/env'
import { ResetPasswordEmail } from './templates/reset-password'
import { VerifyEmail } from './templates/verify-email'

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER
      ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
      : undefined,
  })

  /**
   * Verify the SMTP connection/credentials without sending mail. Used by the
   * health check to surface a broken mail pipeline.
   */
  async verifyConnection(): Promise<void> {
    await this.transporter.verify()
  }

  async sendEmailVerification(to: string, verifyUrl: string): Promise<void> {
    const html = await render(VerifyEmail({ verifyUrl }))
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: 'Vérifiez votre adresse email',
      html,
    })
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const html = await render(ResetPasswordEmail({ resetUrl }))
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html,
    })
  }
}
