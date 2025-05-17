import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

import { SuccessResponseDto } from "../response/success-response.dto";

/**
 * 성공 응답 글로벌 인터셉터
 * @summary 성공 응답 글로벌 인터셉터
 * @description 성공 응답 글로벌 인터셉터
 * @version 1.0.0
 * @author 양광성
 * @since 2025-05-17
 */
@Injectable()
export class SuccessResponseInterceptor<T>
    implements NestInterceptor<T, SuccessResponseDto<T>>
{
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<SuccessResponseDto<T>> {
        return next.handle().pipe(
            map(
                (data): SuccessResponseDto<T> => ({
                    success: true,
                    data,
                }),
            ),
        );
    }
}
