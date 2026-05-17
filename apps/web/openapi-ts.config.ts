import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: '../api/openapi.json',
  output: {
    path: 'src/api',
    postProcess: ['prettier'],
  },
  plugins: [
    '@hey-api/client-fetch',
    {
      name: '@hey-api/sdk',
      operations: { nesting: 'operationId' },
    },
    {
      name: '@hey-api/typescript',
      enums: 'javascript',
    },
  ],
})
