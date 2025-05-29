import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { AppModule } from "@APP/app.module";

describe("Health", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    describe("GET /", () => {
        it("should return OK", async () => {
            const response = await request(app.getHttpServer())
                .get("/")
                .expect(200);

            expect(response.text).toBe("OK");
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
