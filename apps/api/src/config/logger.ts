import { randomUUID } from 'node:crypto'
import type { IncomingHttpHeaders } from 'node:http'
import type { Params } from 'nestjs-pino'
import { env } from './env'

/**
 * Header carrying the request-correlation id. Honoured on the way in (a value
 * sent by an upstream proxy/gateway is reused) and echoed on the way out so the
 * caller can quote it when reporting an issue.
 */
export const REQUEST_ID_HEADER = 'x-request-id'

/**
 * Fastify request-id generator: reuse an incoming correlation id when present,
 * otherwise mint a UUID. The value becomes Fastify's `req.id`, which `nestjs-pino`
 * surfaces as `reqId` on every log line for that request.
 */
export const genReqId = (req: { headers: IncomingHttpHeaders }): string => {
  const existing = req.headers[REQUEST_ID_HEADER]
  return (Array.isArray(existing) ? existing[0] : existing) ?? randomUUID()
}

/**
 * `nestjs-pino` configuration: structured JSON logs with a stable `reqId` on
 * every line so all logs emitted while handling one request can be correlated.
 *
 * In production logs are raw JSON (one object per line) for ingestion by a log
 * collector. In development they are pretty-printed for readability.
 */
export const loggerParams: Params = {
  pinoHttp: {
    level: env.isProduction ? 'info' : 'debug',

    // Pretty-print locally; emit raw JSON in production.
    transport: env.isProduction
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            translateTime: 'SYS:HH:MM:ss.l',
            ignore: 'pid,hostname',
          },
        },

    // Never log credentials or session cookies.
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      remove: true,
    },

    // Surface server faults at `error`, client errors at `warn`.
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error'
      if (res.statusCode >= 400) return 'warn'
      return 'info'
    },
  },
}
