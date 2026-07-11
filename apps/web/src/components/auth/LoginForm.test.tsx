import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginForm } from './LoginForm'

// Hoisted mocks: referenced inside vi.mock factories (which run before imports).
const { authControllerLogin, navigate, refresh } = vi.hoisted(() => ({
  authControllerLogin: vi.fn(),
  navigate: vi.fn(),
  refresh: vi.fn(),
}))

vi.mock('#/api', () => ({ authControllerLogin }))
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigate }))
vi.mock('#/lib/auth-context', () => ({ useAuth: () => ({ refresh }) }))

function setup() {
  const onSwitchToForgot = vi.fn()
  render(<LoginForm onSwitchToForgot={onSwitchToForgot} />)
  return { user: userEvent.setup(), onSwitchToForgot }
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    refresh.mockResolvedValue(undefined)
    navigate.mockResolvedValue(undefined)
  })

  it('shows validation errors and does not call the API for invalid input', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.type(screen.getByLabelText('Mot de passe'), 'short')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(await screen.findByText('Email invalide')).toBeInTheDocument()
    expect(screen.getByText('Au moins 8 caractères')).toBeInTheDocument()
    expect(authControllerLogin).not.toHaveBeenCalled()
  })

  it('logs in, refreshes auth and navigates home on success', async () => {
    authControllerLogin.mockResolvedValue({ error: null })
    const { user } = setup()

    await user.type(screen.getByLabelText('Email'), 'user@test.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    await waitFor(() =>
      expect(authControllerLogin).toHaveBeenCalledWith({
        body: { email: 'user@test.com', password: 'password123' },
        throwOnError: false,
      }),
    )
    expect(refresh).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith({ to: '/' })
  })

  it('surfaces an error alert and stays on the page when credentials are wrong', async () => {
    authControllerLogin.mockResolvedValue({
      error: { message: 'Invalid credentials' },
      response: new Response(null, { status: 401 }),
    })
    const { user } = setup()

    await user.type(screen.getByLabelText('Email'), 'user@test.com')
    await user.type(screen.getByLabelText('Mot de passe'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))

    expect(
      await screen.findByText('Email ou mot de passe incorrect'),
    ).toBeInTheDocument()
    expect(refresh).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('triggers the forgot-password switch', async () => {
    const { user, onSwitchToForgot } = setup()

    await user.click(
      screen.getByRole('button', { name: 'Mot de passe oublié ?' }),
    )

    expect(onSwitchToForgot).toHaveBeenCalled()
  })
})
