import { Catch, ExceptionFilter as NestExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(HttpException)
export class RestExceptionFilter implements NestExceptionFilter {
  public async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message || 'Internal error';

    response.status(status).send({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
