import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { DataSource, Repository } from "typeorm";

import { AppModule } from "@APP/app.module";
import { SubscribersEntity } from "@APP/subscribers/entities/subscribers.entity";

describe("Subscribers", () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let subscribersRepository: Repository<SubscribersEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        dataSource = app.get<DataSource>(DataSource);
        subscribersRepository = dataSource.getRepository(SubscribersEntity);

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
        // 테스트 데이터 정리
        await subscribersRepository.delete({});

        // 데이터베이스 연결 종료 및 앱 종료
        await dataSource.destroy();
        await app.close();
    });
});
