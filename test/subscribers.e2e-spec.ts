import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { DataSource } from "typeorm";

import { AppModule } from "@APP/app.module";

describe("Subscribers", () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        dataSource = app.get<DataSource>(DataSource);
        await app.init();
    });

    describe("POST /subscribers/:email", () => {
        it("should create a new subscriber", async () => {
            const response = await request(app.getHttpServer())
                .post("/subscribers/test@test.com")
                .expect(201);

            expect(response.body).toHaveProperty("message", "구독자 등록 완료");
            expect(response.body).toHaveProperty("subscriber");
            expect(response.body.subscriber).toHaveProperty(
                "email",
                "test@test.com",
            );
        });

        it("should return 409 when the email already exists", async () => {
            await request(app.getHttpServer())
                .post("/subscribers/existing@test.com")
                .expect(201);

            const response = await request(app.getHttpServer())
                .post("/subscribers/existing@test.com")
                .expect(409);

            expect(response.body).toHaveProperty(
                "message",
                "이미 구독자입니다.",
            );
        });

        it("should return 400 when the email is invalid", async () => {
            const response = await request(app.getHttpServer())
                .post("/subscribers/invalid-email")
                .expect(400);

            expect(response.body).toHaveProperty(
                "message",
                "이메일 형식이 올바르지 않습니다.",
            );
        });

        it("should return 400 when the email contains special characters", async () => {
            const response = await request(app.getHttpServer())
                .post("/subscribers/test@test.com!")
                .expect(400);

            expect(response.body).toHaveProperty(
                "message",
                "이메일 형식이 올바르지 않습니다.",
            );
        });

        it("should return 400 when the email is too long", async () => {
            const longEmail = "a".repeat(100) + "@test.com";
            const response = await request(app.getHttpServer())
                .post(`/subscribers/${longEmail}`)
                .expect(400);

            expect(response.body).toHaveProperty(
                "message",
                "이메일은 100자 이하여야 합니다.",
            );
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
