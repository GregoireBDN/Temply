import { expect } from '@playwright/test'
import type { APIRequestContext } from '@playwright/test'

const MAILPIT_URL = process.env['MAILPIT_URL'] ?? 'http://localhost:8025'

interface MailpitAddress {
  Mailbox: string
  Domain: string
}

interface MailpitMessage {
  To: MailpitAddress[]
  Content: { Body: string }
}

/** Minimal quoted-printable decoder — enough to recover ASCII URLs from bodies. */
function decodeQuotedPrintable(input: string): string {
  return input
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
}

function addressOf(message: MailpitMessage): string[] {
  return message.To.map((to) => `${to.Mailbox}@${to.Domain}`)
}

/**
 * Polls Mailpit until an email addressed to `recipient` contains a link to
 * `path` (e.g. `/verify-email`), then returns that absolute URL.
 */
export async function waitForEmailLink(
  request: APIRequestContext,
  recipient: string,
  path: string,
): Promise<string> {
  const pattern = new RegExp(`https?://[^\\s"'<>]*${path}[^\\s"'<>]*`)

  for (let attempt = 0; attempt < 20; attempt++) {
    const res = await request.get(`${MAILPIT_URL}/api/v1/messages`)
    if (res.ok()) {
      const payload = (await res.json()) as
        | MailpitMessage[]
        | { messages: MailpitMessage[] }
      const messages = Array.isArray(payload) ? payload : payload.messages
      for (const message of messages) {
        if (!addressOf(message).includes(recipient)) continue
        const link = decodeQuotedPrintable(message.Content.Body).match(pattern)
        if (link) return link[0]
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  throw new Error(
    `No email to ${recipient} containing a "${path}" link arrived in time`,
  )
}

/** Removes all stored messages so a test starts from a clean inbox. */
export async function clearMailbox(request: APIRequestContext): Promise<void> {
  const res = await request.delete(`${MAILPIT_URL}/api/v1/messages`)
  expect(res.ok()).toBeTruthy()
}
