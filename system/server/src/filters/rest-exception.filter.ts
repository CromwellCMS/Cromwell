import { ArgumentsHost, Catch, ExceptionFilter as NestExceptionFilter, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { loadEnv } from '../helpers/settings';

@Catch(HttpException)
export class RestExceptionFilter implements NestExceptionFilter {
  public async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || 'Internal error';

    const { envMode } = loadEnv();
    if (envMode !== 'prod' || (envMode === 'prod' && !status)) {
      console.error(exception);
    }

    response.status(status).send({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
