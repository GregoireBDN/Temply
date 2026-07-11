import { expect, test } from '@playwright/test'
import { clearMailbox, waitForEmailLink } from './mailpit'

/**
 * Happy-path auth journey against the real stack:
 *   register → receive verification email → verify → log in.
 *
 * Requires Postgres + Mailpit (`docker compose up -d`); the web/API dev servers
 * are started by playwright.config.ts.
 */
test('register, verify email, then log in', async ({ page, request }) => {
  await clearMailbox(request)

  const unique = `e2e${Date.now()}`
  const email = `${unique}@temply.test`
  const password = 'password123'
  const firstName = unique // user.name's first token, shown on the home page

  // 1. Register a fresh account.
  await page.goto('/auth')
  await page.getByRole('button', { name: "S'inscrire" }).click()
  await page.getByLabel('Nom').fill(`${firstName} Tester`)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Mot de passe').fill(password)
  await page.getByRole('button', { name: 'Créer un compte' }).click()

  // Registration logs the user in and lands on the home page.
  await expect(page).toHaveURL('/')

  // 2. Pull the verification link out of the email Mailpit captured.
  const verifyUrl = await waitForEmailLink(request, email, '/verify-email')
  await page.goto(verifyUrl)
  await expect(page.getByText('Email vérifié')).toBeVisible()

  // 3. Log out, then log back in with the same credentials.
  await page.context().clearCookies()
  await page.goto('/auth')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Mot de passe').fill(password)
  await page.getByRole('button', { name: 'Se connecter' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByText(firstName, { exact: false })).toBeVisible()
})
