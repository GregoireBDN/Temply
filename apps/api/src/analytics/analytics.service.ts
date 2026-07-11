import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import { PinoLogger } from 'nestjs-pino'
import { PostHog } from 'posthog-node'
import { env } from '#/config/env'

/**
 * Thin wrapper around the PostHog Node client for server-side event capture and
 * error tracking. When `POSTHOG_KEY` is unset the client is `null` and every
 * method is a no-op, so the rest of the app can call it unconditionally without
 * guarding on configuration.
 *
 * The client buffers events and flushes them in the background; `onModuleDestroy`
 * drains that buffer on shutdown (wired via `app.enableShutdownHooks()`) so
 * in-flight events aren't lost when the process exits.
 */
@Injectable()
export class AnalyticsService implements OnModuleDestroy {
  private readonly client: PostHog | null

  // Explicit @Inject(PinoLogger) (rather than reflected constructor metadata)
  // keeps the reference a value, so esbuild-based runners like tsx — used by the
  // OpenAPI spec generator — don't elide it and break injection.
  constructor(@Inject(PinoLogger) private readonly logger: PinoLogger) {
    this.logger.setContext(AnalyticsService.name)

    this.client = env.POSTHOG_KEY
      ? new PostHog(env.POSTHOG_KEY, { host: env.POSTHOG_HOST })
      : null

    if (!this.client) {
      this.logger.info('PostHog disabled: POSTHOG_KEY is not set')
    }
  }

  /** Records a product event for a given user (or a stable id for anonymous). */
  capture(
    distinctId: string,
    event: string,
    properties?: Record<string, unknown>,
  ): void {
    this.client?.capture({ distinctId, event, properties })
  }

  /** Reports an exception to PostHog error tracking. */
  captureException(
    error: unknown,
    distinctId?: string,
    properties?: Record<string, unknown>,
  ): void {
    this.client?.captureException(error, distinctId, properties)
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.shutdown()
  }
}
