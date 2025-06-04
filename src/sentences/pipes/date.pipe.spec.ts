import { BadRequestException } from "@nestjs/common";

import { toKoreanLocalDateString } from "../../common/utils/date.util";
import { DatePipe } from "./date.pipe";

describe("DatePipe", () => {
    let pipe: DatePipe;

    beforeEach(() => {
        pipe = new DatePipe();
    });

    describe("transform", () => {
        describe("when the date is valid", () => {
            it("should return the date", () => {
                const date = "2025-01-01";
                const result = pipe.transform(date);
                expect(result).toBe(toKoreanLocalDateString(new Date(date)));
            });
        });

        describe("when the date is invalid", () => {
            it("should throw an error", () => {
                const date = "invalid-date";
                expect(() => pipe.transform(date)).toThrow(
                    new BadRequestException("유효하지 않은 날짜 형식입니다."),
                );
            });
        });
    });
});
