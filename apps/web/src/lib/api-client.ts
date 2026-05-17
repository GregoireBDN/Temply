import { client } from '#/api/client.gen'

// Configure the default client used by all generated API services.
// Import this file at the app entry point (router.tsx) before any API call.
client.setConfig({
  baseUrl: import.meta.env['VITE_API_URL'] ?? 'http://localhost:4000',
  credentials: 'include',
})

export { client }
