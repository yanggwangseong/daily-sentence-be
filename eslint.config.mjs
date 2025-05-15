import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    // TypeScript ESLint 추천 설정 확장
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    {
        
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        // 언어 파서 및 옵션 설정
        languageOptions: {
            parser: tsParser, // TypeScript 파서 사용
            ecmaVersion: 2020, // ECMAScript 버전
            sourceType: "script", // 모듈 타입 (script/module)

            parserOptions: {
                project: ["tsconfig.json"], // TypeScript 프로젝트 설정 파일
            },
        },

        // ESLint 규칙 설정
        rules: {
            "@typescript-eslint/interface-name-prefix": "off", // 인터페이스 이름 접두사 규칙 끄기
            "@typescript-eslint/explicit-function-return-type": "off", // 함수 반환 타입 명시 강제 끄기
            "@typescript-eslint/explicit-module-boundary-types": "off", // 모듈 경계 타입 명시 강제 끄기
            "@typescript-eslint/no-empty-interface": "off", // 빈 인터페이스 허용
            "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 허용
            "@typescript-eslint/no-floating-promises": "error", // 처리되지 않은 Promise를 에러로 처리
            "@typescript-eslint/no-inferrable-types": "off", // 추론 가능한 타입 명시 허용
            "@typescript-eslint/no-namespace": "off", // namespace 사용 허용
            "@typescript-eslint/no-empty-function": "off", // 빈 함수 허용
            "@typescript-eslint/only-throw-error": "error", // Error 객체만 throw 하도록 강제
            "@typescript-eslint/no-unused-vars": "warn", // 사용하지 않는 변수에 대해 경고
        },
    },
];
