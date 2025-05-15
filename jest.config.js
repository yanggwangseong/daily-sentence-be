module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    coverageReporters: ["lcov", "text"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.spec.ts",
        "!src/**/*.module.ts",
        "!src/**/main.ts",
        "!src/**/index.ts",
        "!src/**/application.ts",
        "!src/**/*.entity.ts",
        "!src/**/env-keys.const.ts",
        "!**/node_modules/**",
        "!**/dist/**",
    ],
};
