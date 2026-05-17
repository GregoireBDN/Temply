import { z } from 'zod'

const emailField = z.email('Email invalide')
const passwordField = z.string().min(8, 'Au moins 8 caractères')

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
})

export const registerSchema = z
  .object({
    email: emailField,
    name: z.string().min(1, 'Nom requis'),
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export const forgotSchema = z.object({
  email: emailField,
})

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ForgotValues = z.infer<typeof forgotSchema>
