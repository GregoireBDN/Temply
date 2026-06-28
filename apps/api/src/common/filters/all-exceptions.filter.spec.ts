import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import type { PinoLogger } from 'nestjs-pino'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AllExceptionsFilter, type ErrorResponse } from './all-exceptions.filter'

function createHost(requestId = 'req-123', url = '/api/widgets') {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  }
  const request = { id: requestId, url }
  const host = {
    switchToHttp: () => ({
      getResponse: () => reply,
      getRequest: () => request,
    }),
  } as unknown as ArgumentsHost
  return { host, reply }
}

describe('AllExceptionsFilter', () => {
  let logger: {
    error: ReturnType<typeof vi.fn>
    warn: ReturnType<typeof vi.fn>
    setContext: ReturnType<typeof vi.fn>
  }
  let filter: AllExceptionsFilter

  beforeEach(() => {
    logger = { error: vi.fn(), warn: vi.fn(), setContext: vi.fn() }
    filter = new AllExceptionsFilter(logger as unknown as PinoLogger)
  })

  function captureBody(reply: { send: ReturnType<typeof vi.fn> }): ErrorResponse {
    return reply.send.mock.calls[0][0] as ErrorResponse
  }

  it('normalises an HttpException into the uniform envelope', () => {
    const { host, reply } = createHost()

    filter.catch(new NotFoundException('User 42 not found'), host)

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND)
    const body = captureBody(reply)
    expect(body).toMatchObject({
      statusCode: 404,
      error: 'Not Found',
      message: ['User 42 not found'],
      requestId: 'req-123',
      path: '/api/widgets',
    })
    expect(body.timestamp).toEqual(expect.any(String))
    expect(logger.warn).toHaveBeenCalledOnce()
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('preserves ValidationPipe message arrays', () => {
    const { host, reply } = createHost()

    filter.catch(
      new BadRequestException({
        statusCode: 400,
        message: ['email must be an email', 'password is too short'],
        error: 'Bad Request',
      }),
      host,
    )

    const body = captureBody(reply)
    expect(body.statusCode).toBe(400)
    expect(body.error).toBe('Bad Request')
    expect(body.message).toEqual([
      'email must be an email',
      'password is too short',
    ])
  })

  it('hides internals behind a generic 500 for unexpected faults', () => {
    const { host, reply } = createHost()
    const boom = new Error('connection string leaked secret')

    filter.catch(boom, host)

    expect(reply.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    )
    const body = captureBody(reply)
    expect(body.message).toEqual(['Internal server error'])
    expect(body.error).toBe('Internal Server Error')
    // The original error is logged (with stack) but never sent to the client.
    expect(logger.error).toHaveBeenCalledOnce()
    expect(JSON.stringify(body)).not.toContain('leaked secret')
  })

  it('echoes the correlation id from the request', () => {
    const { host, reply } = createHost('abc-789')

    filter.catch(new HttpException('teapot', HttpStatus.I_AM_A_TEAPOT), host)

    expect(captureBody(reply).requestId).toBe('abc-789')
  })
})
