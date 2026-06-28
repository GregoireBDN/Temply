import 'reflect-metadata'
process.loadEnvFile()
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(fastifyCookie)

  // Security headers (CSP, HSTS, X-Frame-Options, etc.). The default CSP is
  // strict: the API only returns JSON, so no inline scripts/styles are needed.
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        baseUri: [`'self'`],
        objectSrc: [`'none'`],
        scriptSrc: [`'self'`],
        styleSrc: [`'self'`],
        imgSrc: [`'self'`, 'data:'],
      },
    },
  })

  // The Swagger UI (/api/docs) is the only HTML page and relies on inline
  // scripts/styles, so it gets a relaxed CSP — scoped to that route only,
  // instead of weakening the policy for the whole API.
  const SWAGGER_CSP = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `script-src 'self' 'unsafe-inline'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: validator.swagger.io`,
  ].join('; ')

  app
    .getHttpAdapter()
    .getInstance()
    .addHook('onSend', (request, reply, payload, done) => {
      if (request.url.startsWith('/api/docs')) {
        reply.header('Content-Security-Policy', SWAGGER_CSP)
      }
      done(null, payload)
    })

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
