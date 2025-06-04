import { Type } from "@nestjs/common";

import {
    isFunctionType,
    isLazyTypeFunc,
    isMergebleObject,
    isObject,
    isPrimitiveType,
} from "./swagger-type-guard";

describe("isObject", () => {
    it("should return true if the object is an object", () => {
        const obj = { a: 1, b: 2 };
        expect(isObject(obj)).toBe(true);
    });

    it("should return false if the object is null", () => {
        const obj = null;
        expect(isObject(obj)).toBe(false);
    });

    it("should return false if the object is undefined", () => {
        const obj = undefined;
        expect(isObject(obj)).toBe(false);
    });

    it("should return false if the object is a function", () => {
        const obj = () => {};
        expect(isObject(obj)).toBe(false);
    });
});

describe("isMergebleObject", () => {
    it("should return true if the object is mergeable", () => {
        const obj = { a: 1, b: 2 };
        expect(isMergebleObject(obj)).toBe(true);
    });

    it("should return false if the object is not mergeable", () => {
        const obj = [1, 2, 3];
        expect(isMergebleObject(obj)).toBe(false);
    });

    it("should return false if the object is null", () => {
        const obj = null;
        expect(isMergebleObject(obj)).toBe(false);
    });

    it("should return false if the object is undefined", () => {
        const obj = undefined;
        expect(isMergebleObject(obj)).toBe(false);
    });
});

describe("isFunctionType", () => {
    it("should return true if the object is a function", () => {
        const obj = () => {};
        expect(isFunctionType(obj)).toBe(true);
    });

    it("should return false if the object is not a function", () => {
        const obj = { a: 1, b: 2 };
        expect(isFunctionType(obj)).toBe(false);
    });
});

describe("isLazyTypeFunc", () => {
    it("should return true if the object is a lazy type function", () => {
        const obj = function type() {} as unknown as Type<unknown>;
        expect(isLazyTypeFunc(obj)).toBe(true);
    });

    it("should return false if the object is a regular function", () => {
        const obj = function regularFunction() {} as unknown as Type<unknown>;
        expect(isLazyTypeFunc(obj)).toBe(false);
    });

    it("should return false if the object is not a function", () => {
        const obj = { type: () => {} } as unknown as Type<unknown>;
        expect(isLazyTypeFunc(obj)).toBe(false);
    });

    it("should return false if the object is null", () => {
        const obj = null as unknown as Type<unknown>;
        expect(isLazyTypeFunc(obj)).toBe(false);
    });

    it("should return false if the object is undefined", () => {
        const obj = undefined as unknown as Type<unknown>;
        expect(isLazyTypeFunc(obj)).toBe(false);
    });

    it("should return false if the object is a plain object", () => {
        const obj = { a: 1, b: 2 } as unknown as Type<unknown>;
        expect(isLazyTypeFunc(obj)).toBe(false);
    });
});

describe("isPrimitiveType", () => {
    it("should return true if the type is String constructor", () => {
        expect(isPrimitiveType(String)).toBe(true);
    });

    it("should return true if the type is Boolean constructor", () => {
        expect(isPrimitiveType(Boolean)).toBe(true);
    });

    it("should return true if the type is Number constructor", () => {
        expect(isPrimitiveType(Number)).toBe(true);
    });

    it("should return false if the type is a custom function", () => {
        const customFunction = () => {};
        expect(isPrimitiveType(customFunction)).toBe(false);
    });

    it("should return false if the type is an array of functions", () => {
        const arrayOfFunctions = [() => {}];
        expect(isPrimitiveType(arrayOfFunctions)).toBe(false);
    });

    it("should return false if the type is a plain object", () => {
        const plainObject = { a: 1 };
        expect(isPrimitiveType(plainObject)).toBe(false);
    });

    it("should return false if the type is undefined", () => {
        expect(isPrimitiveType(undefined)).toBe(false);
    });

    it("should return false if the type is a string", () => {
        expect(isPrimitiveType("string")).toBe(false);
    });
});
