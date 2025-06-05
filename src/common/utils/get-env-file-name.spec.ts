import { getEnvFileName } from "./get-env-file-name";

describe("getEnvFileName", () => {
    it("should return the correct env file name", () => {
        expect(getEnvFileName("production")).toBe(".production.env");
        expect(getEnvFileName("stage")).toBe(".stage.env");
        expect(getEnvFileName("development")).toBe(".development.env");
    });
});
