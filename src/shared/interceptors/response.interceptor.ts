import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

type ResponseData<T> = T | { message?: string; data?: T };

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data: ResponseData<T>) => {
        const isObject = typeof data === 'object' && data !== null;

        return {
          success: true,
          statusCode: response.statusCode,
          message:
            isObject && 'message' in data ? data.message : 'Request successful',
          data: isObject && 'data' in data ? data.data : data,
        };
      }),
    );
  }
}
