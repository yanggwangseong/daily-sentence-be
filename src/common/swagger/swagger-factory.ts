import { HttpStatus, applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import {
    MultiExceptionSwaggerOptions,
    multiExceptionResponse,
} from "./multi-exception-swagger-decorator";
import {
    MultiSuccessSwaggerOptions,
    multiSuccessResponse,
} from "./multi-success-swagger-decorator";

interface SwaggerOptions {
    summary: string;
    status?: HttpStatus;
}

/**
 * Swagger 데코레이터 생성 Static Factory Method
 */
export class SwaggerFactory {
    /**
     * 기본 Swagger 데코레이터 생성
     * @param options Swagger 옵션
     * @param SuccesResponseOptions 성공 응답 옵션
     * @param ExceptionResponseOptions 예외 응답 옵션
     * @param additionalDecorators 추가할 데코레이터 배열
     * @returns
     */
    static create(
        options: SwaggerOptions,
        SuccesResponseOptions: MultiSuccessSwaggerOptions[],
        ExceptionResponseOptions: MultiExceptionSwaggerOptions[],
        additionalDecorators: MethodDecorator[] = [],
    ) {
        return applyDecorators(
            ApiOperation(options),
            multiSuccessResponse(
                options.status ?? HttpStatus.OK,
                SuccesResponseOptions,
            ),
            multiExceptionResponse(
                options.status ?? HttpStatus.BAD_REQUEST,
                ExceptionResponseOptions,
            ),
            ...additionalDecorators,
        );
    }
}
