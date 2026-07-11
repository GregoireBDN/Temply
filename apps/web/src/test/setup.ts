import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount any rendered tree between tests so the jsdom DOM stays isolated.
afterEach(() => {
  cleanup()
})
