import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RegisterForm } from './RegisterForm'

const { authControllerRegister, navigate, refresh, toastError } = vi.hoisted(
  () => ({
    authControllerRegister: vi.fn(),
    navigate: vi.fn(),
    refresh: vi.fn(),
    toastError: vi.fn(),
  }),
)

vi.mock('#/api', () => ({ authControllerRegister }))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigate }))
vi.mock('#/lib/auth-context', () => ({ useAuth: () => ({ refresh }) }))
vi.mock('sonner', () => ({ toast: { error: toastError } }))

function fill(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<Record<string, string>> = {},
) {
  const values = {
    name: 'New User',
    email: 'new@test.com',
    password: 'password123',
    confirm: 'password123',
    ...overrides,
  }
  return Promise.resolve()
    .then(() => user.type(screen.getByLabelText('Nom'), values.name))
    .then(() => user.type(screen.getByLabelText('Email'), values.email))
    .then(() =>
      user.type(screen.getByLabelText('Mot de passe'), values.password),
    )
    .then(() =>
      user.type(
        screen.getByLabelText('Confirmer le mot de passe'),
        values.confirm,
      ),
    )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    refresh.mockResolvedValue(undefined)
    navigate.mockResolvedValue(undefined)
  })

  it('requires matching passwords', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await fill(user, { confirm: 'different1' })
    await user.click(screen.getByRole('button', { name: 'Créer un compte' }))

    expect(
      await screen.findByText('Les mots de passe ne correspondent pas'),
    ).toBeInTheDocument()
    expect(authControllerRegister).not.toHaveBeenCalled()
  })

  it('registers and redirects to verify-email on success', async () => {
    authControllerRegister.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<RegisterForm />)

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Créer un compte' }))

    await waitFor(() =>
      expect(authControllerRegister).toHaveBeenCalledWith({
        body: {
          email: 'new@test.com',
          name: 'New User',
          password: 'password123',
        },
        throwOnError: false,
      }),
    )
    expect(refresh).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith({ to: '/verify-email' })
  })

  it('toasts the API error message and does not navigate on failure', async () => {
    authControllerRegister.mockResolvedValue({
      error: { message: 'Email already in use' },
      response: new Response(null, { status: 409 }),
    })
    const user = userEvent.setup()
    render(<RegisterForm />)

    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Créer un compte' }))

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('Email already in use'),
    )
    expect(navigate).not.toHaveBeenCalled()
  })
})
