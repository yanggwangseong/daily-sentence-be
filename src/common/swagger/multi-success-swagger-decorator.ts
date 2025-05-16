import { HttpStatus, Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";

import { SuccessResponseDto } from "../response/success-response.dto";
import { createApiProperty } from "./create-api-propety";
import { mergeObjects } from "./merge-to-object";

export interface MultiSuccessSwaggerOptions {
    /**
     * 응답 디티오를 인자로받습니다
     * 예시 : ResponseRequestValidationDto
     */
    model: Type<any>;
    /**
     * 예시의 제목을 적습니다
     */
    exampleTitle: string;
    /**
     *  깊은 복사로 변경하고 싶은 응답값을 적습니다. 오버라이트 됩니다.
     *  nested 된 obj 인 경우엔 해당 obj 가 바뀌는것이아닌 안에 있는 property만 바뀝니다.
     *  즉 주어진 객체로 리프 프로퍼티에 대해 오버라이트됩니다.
     */
    overrideValue?: Record<string, any>;
    /**
     * 어떠한 상황일 때 예시형태의 응답값을 주는지 기술 합니다.
     */
    exampleDescription: string;
}

export const multiSuccessResponse = (
    StatusCode: HttpStatus,
    succesResponseOptions: MultiSuccessSwaggerOptions[],
) => {
    const examples = succesResponseOptions
        .map((response: MultiSuccessSwaggerOptions) => {
            // base CommonResponse 를 만듭니다.
            const commonResponseInstance =
                createApiProperty<SuccessResponseDto<any>>(SuccessResponseDto);

            const DtoModel = response.model;

            // dto 객체를 만든다. 제네릭은 옵셔널 한 값이라 없으면 없는대로 만든다.
            const dtoData = createApiProperty<typeof DtoModel>(DtoModel);
            // overrideValue가 있으면 오버라이트
            // 정보를 좀더 커스텀 할 수있다.
            if (response.overrideValue) {
                commonResponseInstance.data = mergeObjects(
                    {},
                    dtoData,
                    response.overrideValue,
                );
            } else {
                commonResponseInstance.data = dtoData;
            }

            // 예시 정보를 만든다 ( 스웨거의 examplse)
            return {
                [response.exampleTitle]: {
                    value: commonResponseInstance,
                    description: response.exampleDescription,
                },
            };
        })
        .reduce(function (result, item) {
            Object.assign(result, item);
            return result;
        }, {}); // null 값 있을경우 필터링

    // 스키마를 정의 내리기 위한 함수들
    const extraModel = succesResponseOptions.map((e) => {
        return e.model;
    }) as unknown as Type[];
    // 중복값 제거
    const setOfExtraModel = new Set(extraModel);
    // $ref 추가
    const pathsOfDto = [...setOfExtraModel].map((e) => {
        return { $ref: getSchemaPath(e) };
    });

    // 데코레이터를 만든다.
    return applyDecorators(
        // $ref를 사용하기 위해선 extraModel 로 등록 시켜야한다.
        ApiExtraModels(...extraModel, SuccessResponseDto),
        ApiResponse({
            status: StatusCode,
            content: {
                "application/json": {
                    schema: {
                        // 베이스 스키마
                        additionalProperties: {
                            $ref: getSchemaPath(SuccessResponseDto),
                        },
                        // dto 스키마들
                        oneOf: [...pathsOfDto],
                    },
                    // 예시값
                    examples: examples,
                },
            },
        }),
    );
};
