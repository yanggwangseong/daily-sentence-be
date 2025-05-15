import { BadRequestException } from "@nestjs/common";

import { EmailPipe } from "./email.pipe";

describe("EmailPipe", () => {
    let pipe: EmailPipe;

    beforeEach(() => {
        pipe = new EmailPipe();
    });

    describe("transform", () => {
        describe("when the email is valid", () => {
            it("should return the email", () => {
                const email = "test@test.com";
                const result = pipe.transform(email);
                expect(result).toBe(email);
                expect(pipe.transform(email)).toMatch(email);
            });
        });

        describe("when the email is invalid", () => {
            it("should throw an error", () => {
                const email = "test";
                expect(() => pipe.transform(email)).toThrow(
                    new BadRequestException("이메일 형식이 올바르지 않습니다."),
                );
            });
        });

        describe("when the email is too long", () => {
            it("should throw an error", () => {
                const email = "test".repeat(100) + "@test.com";
                expect(() => pipe.transform(email)).toThrow(
                    new BadRequestException("이메일은 100자 이하여야 합니다."),
                );
            });
        });
    });
});
