/**
 * Loads `.env` into `process.env` as an import side effect.
 *
 * This MUST be the very first import of any entrypoint. ES module imports are
 * hoisted and evaluated in order before other top-level statements, so calling
 * `process.loadEnvFile()` inline between imports runs *after* the module graph
 * (including `config/env.ts`) has already been evaluated — leaving every
 * variable at its default. Importing this side-effect module first guarantees
 * the file is loaded before anything reads `process.env`.
 *
 * The file is optional: in production the process is given real environment
 * variables and no `.env` exists, so a missing file is ignored.
 */
try {
  process.loadEnvFile()
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
}
