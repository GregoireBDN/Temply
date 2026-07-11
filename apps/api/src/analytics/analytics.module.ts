import { Global, Module } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

/**
 * Global so any module (the exceptions filter, auth, ...) can inject
 * {@link AnalyticsService} without re-importing this module.
 */
@Global()
@Module({
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
