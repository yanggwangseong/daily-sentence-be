import { Type } from "@nestjs/common";
import { ApiPropertyOptions } from "@nestjs/swagger";

import {
    FunctionType,
    isLazyTypeFunc,
    isPrimitiveType,
} from "../utils/swagger-type-guard";

// 스웨거 메타데이터 키
const DECORATORS_PREFIX = "swagger";
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

// Type 인지 확인하는 커스텀 타입 체커
function checkType(object: any): object is Type {
    return object;
}

type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
    fieldName: string;
};

const getPrimitiveOrEnumValue = (property: ApiPropertyOptionsWithFieldName) => {
    if (typeof property.example !== "undefined") {
        return property.example;
    }
    return property.description;
};

const handleLazyType = (property: ApiPropertyOptionsWithFieldName) => {
    const constructorType = (property.type as FunctionType)();
    if (Array.isArray(constructorType)) {
        return [createApiProperty(constructorType[0])];
    }
    if (property.isArray) {
        return [createApiProperty(constructorType)];
    }
    return createApiProperty(constructorType);
};

const handleClassType = (property: ApiPropertyOptionsWithFieldName) => {
    if (property.isArray) {
        return [createApiProperty(property.type as Type<unknown>)];
    }
    return createApiProperty(property.type as Type);
};

export function createApiProperty<T>(dtoClass: Type): T {
    // 디티오로 생성자를 만들지 않고 해당 타입만 가져옴.
    // 생성자에 인자가 들어간경우 에러가 남.
    const mappingDto: Record<string, any> = {};

    // metadata 에서 apiProperty로 저장했던 필드명들을 불러옴
    const propertiesArray: string[] =
        Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) ??
        [];

    // apiProperty로 적었던 필드명 하나하나의 정보를 가져오기 위함
    const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map(
        (field) => {
            // :fieldName 형식이라서 앞에 : 를 짤라줌
            const fieldName = field.substring(1);
            // 각 필드마다 메타데이터를 가져옴
            const obj = Reflect.getMetadata(
                API_MODEL_PROPERTIES,
                dtoClass.prototype,
                fieldName,
            );
            obj.fieldName = fieldName;
            return obj;
        },
    );

    //  mappingDto 를 만듬
    for (const property of properties) {
        const propertyType = property.type;
        if (!propertyType) continue;

        if (
            propertyType === "string" ||
            propertyType === "number" ||
            isPrimitiveType(propertyType)
        ) {
            mappingDto[property.fieldName] = getPrimitiveOrEnumValue(property);
            continue;
        }

        if (isLazyTypeFunc(propertyType as FunctionType | Type<unknown>)) {
            mappingDto[property.fieldName] = handleLazyType(property);
            continue;
        }

        if (checkType(propertyType)) {
            mappingDto[property.fieldName] = handleClassType(property);
        }
    }
    return mappingDto as T;
}
