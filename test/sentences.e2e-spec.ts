import request from "supertest";
import { AppModule } from "@APP/app.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DataSource, Repository } from "typeorm";

import { SentencesEntity } from "@APP/sentences/entities/sentences.entity";
import { VideosEntity } from "@APP/sentences/entities/videos.entity";
import { VocabsEntity } from "@APP/sentences/entities/vocabs.entity";

describe("Sentences", () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let videosRepository: Repository<VideosEntity>;
    let sentencesRepository: Repository<SentencesEntity>;
    let vocabsRepository: Repository<VocabsEntity>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        dataSource = app.get<DataSource>(DataSource);

        videosRepository = dataSource.getRepository(VideosEntity);
        sentencesRepository = dataSource.getRepository(SentencesEntity);
        vocabsRepository = dataSource.getRepository(VocabsEntity);

        await app.init();

        const video1 = await videosRepository.save({
            videoUrl: "https://youtube.com/shorts/test-video",
            createdAt: new Date("2024-03-20"),
            updatedAt: new Date("2024-03-20"),
        });

        const sentence1 = await sentencesRepository.save({
            sentence: "Hello World",
            meaning: "안녕하세요",
            video: video1,
            createdAt: new Date("2024-03-20"),
            updatedAt: new Date("2024-03-20"),
        });

        await vocabsRepository.save({
            word: "Hello",
            definition: "인사하다",
            sentence: sentence1,
            createdAt: new Date("2024-03-20"),
            updatedAt: new Date("2024-03-20"),
        });

        const video2 = await videosRepository.save({
            videoUrl: "https://youtube.com/shorts/test-video-2",
            createdAt: new Date("2024-03-21"),
            updatedAt: new Date("2024-03-21"),
        });

        const sentence2 = await sentencesRepository.save({
            sentence: "Good Morning",
            meaning: "좋은 아침이에요",
            video: video2,
            createdAt: new Date("2024-03-21"),
            updatedAt: new Date("2024-03-21"),
        });

        await vocabsRepository.save({
            word: "Morning",
            definition: "아침",
            sentence: sentence2,
            createdAt: new Date("2024-03-21"),
            updatedAt: new Date("2024-03-21"),
        });
    });

    describe("GET /sentences/days/:date", () => {
        it("should return sentences for a specific date", async () => {
            const response = await request(app.getHttpServer())
                .get("/sentences/days/2024-03-20")
                .expect(200);

            const firstSentence = response.body;
            expect(firstSentence).toHaveProperty("sentence", "Hello World");
            expect(firstSentence).toHaveProperty("meaning", "안녕하세요");
            expect(firstSentence).toHaveProperty(
                "videoUrl",
                "https://youtube.com/shorts/test-video",
            );
            expect(firstSentence).toHaveProperty("vocab", [
                {
                    word: "Hello",
                    definition: "인사하다",
                },
            ]);
        });

        it("should return 404 when no sentences found for the date", async () => {
            await request(app.getHttpServer())
                .get("/sentences/days/2024-03-22")
                .expect(404);
        });
    });

    describe("GET /sentences/weeklys/:date", () => {
        it("should return weekly sentences", async () => {
            const response = await request(app.getHttpServer())
                .get("/sentences/weeklys/2024-03-20")
                .expect(200);

            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            const sentences = response.body.map((s: any) => s.sentence);
            expect(sentences).toContain("Hello World");
            expect(sentences).toContain("Good Morning");
        });

        it("should return empty array when no sentences found in the week", async () => {
            const response = await request(app.getHttpServer())
                .get("/sentences/weeklys/2024-03-27")
                .expect(200);

            expect(response.body).toBeDefined();
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
