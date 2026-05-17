import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { render } from 'react-email'
import { ResetPasswordEmail } from './templates/reset-password'
import { VerifyEmail } from './templates/verify-email'

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env['SMTP_HOST'] ?? 'localhost',
    port: parseInt(process.env['SMTP_PORT'] ?? '1025', 10),
    secure: process.env['SMTP_SECURE'] === 'true',
    auth:
      process.env['SMTP_USER']
        ? { user: process.env['SMTP_USER'], pass: process.env['SMTP_PASSWORD'] }
        : undefined,
  })

  async sendEmailVerification(to: string, verifyUrl: string): Promise<void> {
    const html = await render(VerifyEmail({ verifyUrl }))
    await this.transporter.sendMail({
      from: process.env['EMAIL_FROM'] ?? 'noreply@temply.app',
      to,
      subject: 'Vérifiez votre adresse email',
      html,
    })
  }

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    const html = await render(ResetPasswordEmail({ resetUrl }))
    await this.transporter.sendMail({
      from: process.env['EMAIL_FROM'] ?? 'noreply@temply.app',
      to,
      subject: 'Réinitialisation de votre mot de passe',
      html,
    })
  }
}
