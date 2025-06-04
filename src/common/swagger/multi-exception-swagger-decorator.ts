import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

import { ExceptionResponseDto } from "../response/exception-response.dto";
import { toKoreanLocalDateString } from "../utils/date.util";
import { createApiProperty } from "./create-api-propety";

export interface MultiExceptionSwaggerOptions {
    /**
     * 응답 디티오를 인자로받습니다
     * 예시 : ResponseBadRequestDto
     */
    model: Type<any>;
    /**
     * 예시의 제목을 적습니다
     */
    exampleTitle: string;
    /**
     * 서비스 레이어에서 적었던 오류 메시지를 기술합니다.
     */
    message: string | Record<string, Array<string>>;
    /**
     * 어떠한 상황일 때 오류가나는지 기술합니다.
     */
    exampleDescription: string;
    /**
     * 에러 코드에 대해 기술합니다.
     */
    code?: string;
}

export const multiExceptionResponse = (
    StatusCode: HttpStatus,
    exceptionResponseOptions: MultiExceptionSwaggerOptions[],
) => {
    const examples = exceptionResponseOptions
        .map((error: MultiExceptionSwaggerOptions) => {
            if (typeof error.message !== "string") {
                throw Error(
                    "http오류는 넘겨줄때 string 타입으로 주셔야합니다.",
                );
            }

            const commonErrorInstance =
                createApiProperty<ExceptionResponseDto>(ExceptionResponseDto);
            commonErrorInstance.success = false;
            commonErrorInstance.timestamp = toKoreanLocalDateString(new Date());
            commonErrorInstance.message = error.message;
            commonErrorInstance.status = StatusCode;

            return {
                [error.exampleTitle]: {
                    value: commonErrorInstance,
                    description: error.exampleDescription,
                },
            };
        })
        .reduce(function (result, item) {
            Object.assign(result, item);
            return result;
        }, {}); // null 값 있을경우 필터링

    return applyDecorators(
        ApiExtraModels(ExceptionResponseDto),
        ApiResponse({
            status: StatusCode,
            content: {
                "application/json": {
                    schema: {
                        additionalProperties: {
                            $ref: getSchemaPath(ExceptionResponseDto),
                        },
                    },
                    examples: examples,
                },
            },
        }),
    );
};
