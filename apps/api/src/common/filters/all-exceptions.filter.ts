import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PinoLogger } from 'nestjs-pino'

/**
 * Uniform error envelope returned for every unhandled exception. A single shape
 * means clients never have to special-case how an error is structured.
 */
export interface ErrorResponse {
  statusCode: number
  /** Short, machine-friendly label, e.g. `Bad Request`. */
  error: string
  /** Human-readable detail(s). Always an array for a stable shape. */
  message: string[]
  /** Correlation id — quote this when reporting an issue (see `x-request-id`). */
  requestId: string
  /** ISO-8601 timestamp of when the error was produced. */
  timestamp: string
  /** Request path that produced the error. */
  path: string
}

/**
 * Catches every exception escaping a request handler and renders it as a single
 * normalised JSON envelope ({@link ErrorResponse}).
 *
 * `HttpException`s keep their status and message; anything else is treated as an
 * unexpected fault and reported as a generic 500 (the internal message is logged
 * but never leaked to the client). Every error line carries the request's
 * correlation id via the injected pino logger.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // Explicit @Inject(PinoLogger) (rather than relying on reflected constructor
  // metadata) keeps the reference as a value, so esbuild-based runners like tsx
  // — used by the OpenAPI spec generator — don't elide it and break injection.
  constructor(@Inject(PinoLogger) private readonly logger: PinoLogger) {
    this.logger.setContext(AllExceptionsFilter.name)
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const reply = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    const { status, message } = this.normalise(exception)
    const requestId = String(request.id)

    const body: ErrorResponse = {
      statusCode: status,
      error: HttpStatus[status] ? toLabel(HttpStatus[status]) : 'Error',
      message,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    // 5xx are unexpected faults: log the full exception (stack included). 4xx
    // are expected client errors: log a terse line at warn for traceability.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        { err: exception, requestId, path: request.url },
        'Unhandled exception',
      )
    } else {
      this.logger.warn(
        { requestId, path: request.url, statusCode: status },
        message.join('; '),
      )
    }

    reply.status(status).send(body)
  }

  /** Derives an HTTP status and normalised message array from any thrown value. */
  private normalise(exception: unknown): {
    status: number
    message: string[]
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const response = exception.getResponse()

      // Nest's built-in exceptions return either a string or an object whose
      // `message` is a string or string[] (e.g. ValidationPipe errors).
      if (typeof response === 'string') {
        return { status, message: [response] }
      }
      const raw = (response as { message?: unknown }).message
      if (Array.isArray(raw)) {
        return { status, message: raw.map(String) }
      }
      if (typeof raw === 'string') {
        return { status, message: [raw] }
      }
      return { status, message: [exception.message] }
    }

    // Anything else is an unexpected fault: hide internals behind a generic 500.
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal server error'],
    }
  }
}

/** Turns an enum key like `BAD_REQUEST` into a label like `Bad Request`. */
function toLabel(key: string): string {
  return key
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
