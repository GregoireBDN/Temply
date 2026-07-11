import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { authControllerForgotPassword, toastError } = vi.hoisted(() => ({
  authControllerForgotPassword: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock('#/api', () => ({ authControllerForgotPassword }))
vi.mock('sonner', () => ({ toast: { error: toastError } }))

import { ForgotForm } from './ForgotForm'

describe('ForgotForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects an invalid email without calling the API', async () => {
    const user = userEvent.setup()
    render(<ForgotForm />)

    await user.type(screen.getByLabelText('Email'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Envoyer le lien' }))

    expect(await screen.findByText('Email invalide')).toBeInTheDocument()
    expect(authControllerForgotPassword).not.toHaveBeenCalled()
  })

  it('shows the neutral confirmation message after a successful submit', async () => {
    authControllerForgotPassword.mockResolvedValue({
      response: new Response(null, { status: 204 }),
    })
    const user = userEvent.setup()
    render(<ForgotForm />)

    await user.type(screen.getByLabelText('Email'), 'user@test.com')
    await user.click(screen.getByRole('button', { name: 'Envoyer le lien' }))

    await waitFor(() =>
      expect(authControllerForgotPassword).toHaveBeenCalledWith({
        body: { email: 'user@test.com' },
        throwOnError: false,
      }),
    )
    expect(
      await screen.findByText(/un lien de réinitialisation vous a été envoyé/i),
    ).toBeInTheDocument()
    expect(toastError).not.toHaveBeenCalled()
  })

  it('toasts and stays on the form when rate-limited', async () => {
    authControllerForgotPassword.mockResolvedValue({
      response: new Response(null, { status: 429, headers: { 'retry-after': '30' } }),
    })
    const user = userEvent.setup()
    render(<ForgotForm />)

    await user.type(screen.getByLabelText('Email'), 'user@test.com')
    await user.click(screen.getByRole('button', { name: 'Envoyer le lien' }))

    await waitFor(() => expect(toastError).toHaveBeenCalled())
    // Still on the form, confirmation not shown.
    expect(screen.getByRole('button', { name: 'Envoyer le lien' })).toBeInTheDocument()
  })
})
