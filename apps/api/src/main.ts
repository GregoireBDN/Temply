import 'reflect-metadata'
process.loadEnvFile()
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(fastifyCookie)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: process.env['APP_URL'] ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    // Expose rate-limit headers so the web client can warn the user before
    // they get blocked (and read the retry delay once they are).
    exposedHeaders: [
      'Retry-After',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],
  })
  app.setGlobalPrefix('api')

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Temply API')
    .setVersion('1.0')
    .addCookieAuth('token')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
  })

  const port = process.env['PORT'] ?? 4000
  await app.listen(port)
  console.warn(`API running on http://localhost:${port}/api`)
  console.warn(`Swagger UI: http://localhost:${port}/api/docs`)
}

bootstrap()
