import { toKoreanLocalDateString } from "./date.util";

describe("toKoreanLocalDateString", () => {
    it("should return the date in the format YYYY-MM-DD", () => {
        const date = new Date("2025-01-01");
        const result = toKoreanLocalDateString(date);
        expect(result).toBe("2025-01-01");
    });
});
