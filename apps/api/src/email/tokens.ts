// Hex equivalents of the CSS variables defined in globals.css.
// Used in email templates where CSS custom properties are not supported.

export const emailTokens = {
  // oklch(0.54 0.2 264) — royal blue
  primary: '#2f63e1',
  primaryFg: '#ffffff',

  // oklch(0.975 0.007 260) — off-white with subtle blue tint
  background: '#f4f6f9',
  // oklch(l + 0.02) — slightly lighter than background
  card: '#ffffff',

  // oklch(0.22 0.025 55) — warm dark brown
  foreground: '#1e1813',
  // oklch(l + 0.33) — lightened foreground
  mutedFg: '#7a6e68',

  // oklch(l - 0.085) — slightly darker than background
  border: '#d7dbdf',

  // oklch(61.892% 0.16585 18.437) — coral-red
  destructive: '#e05252',

  radius: '8px',
} as const
