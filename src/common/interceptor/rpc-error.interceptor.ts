import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'rpc') return next.handle();

    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          const statusCode = err.getStatus();
          const response = err.getResponse();
          const message =
            typeof response === 'string'
              ? response
              : (response as { message?: string })?.message ?? err.message;
          return throwError(
            () => new RpcException(JSON.stringify({ statusCode, message })),
          );
        }
        if (err instanceof RpcException) {
          return throwError(() => err);
        }
        return throwError(
          () =>
            new RpcException(
              err instanceof Error ? err.message : 'Internal server error',
            ),
        );
      }),
    );
  }
}
