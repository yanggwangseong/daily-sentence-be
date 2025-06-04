import { Type } from "@nestjs/common";

export type FunctionType = (...args: any[]) => any;

export const isObject = (item: any): boolean => {
    return item !== null && typeof item === "object";
};

export const isMergebleObject = (item: any): boolean => {
    return isObject(item) && !Array.isArray(item);
};

export const isFunctionType = (value: any): value is FunctionType => {
    return typeof value === "function";
};

export const isLazyTypeFunc = (
    type: FunctionType | Type<unknown>,
): type is { type: FunctionType } & FunctionType => {
    return isFunctionType(type) && type.name == "type";
};

// 원시타입인지 확인하는 커스텀 타입 체커
export const isPrimitiveType = (
    type:
        | string
        | FunctionType
        | Type<unknown>
        | [FunctionType]
        | Record<string, any>
        | undefined,
): boolean => {
    return (
        typeof type === "function" &&
        [String, Boolean, Number].some((item) => item === type)
    );
};
