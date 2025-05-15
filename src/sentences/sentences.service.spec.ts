import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { SentencesEntity } from "./entities/sentences.entity";
import { VideosEntity } from "./entities/videos.entity";
import { VocabsEntity } from "./entities/vocabs.entity";
import { SENTENCES_REPOSITORY_TOKEN } from "./repositories/sentences.repository.interface";
import { SentencesService } from "./sentences.service";

// Repository 모킹
const mockSentencesRepository = {
    findOneByDate: jest.fn(),
    findByDateRange: jest.fn(),
};

describe("sentencesService", () => {
    let sentencesService: SentencesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SentencesService,
                {
                    provide: SENTENCES_REPOSITORY_TOKEN,
                    useValue: mockSentencesRepository,
                },
                {
                    provide: getRepositoryToken(SentencesEntity),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(VocabsEntity),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(VideosEntity),
                    useValue: {},
                },
            ],
        }).compile();

        sentencesService = module.get<SentencesService>(SentencesService);
    });

    it("should be defined", () => {
        expect(sentencesService).toBeDefined();
    });

    /**
     * getSentences
     */
    describe("getSentences", () => {
        it("should return a sentence by date", async () => {
            const mockSentence = {
                id: 1,
                sentence: "Hello, world!",
                meaning: "헬로 월드!",
                createdAt: new Date("2021-01-01"),
                updatedAt: new Date("2021-01-01"),
                vocabs: [{ word: "Hello", definition: "헬로" }],
                video: {
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
            };

            jest.spyOn(
                mockSentencesRepository,
                "findOneByDate",
            ).mockResolvedValue(mockSentence);

            const result = await sentencesService.getSentences("2021-01-01");

            expect(result).toEqual({
                date: "2021-01-01",
                sentence: "Hello, world!",
                meaning: "헬로 월드!",
                vocab: [{ word: "Hello", definition: "헬로" }],
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            });
        });

        it("should return null when no sentence is found for the given date", async () => {
            jest.spyOn(
                mockSentencesRepository,
                "findOneByDate",
            ).mockResolvedValue(null);

            const result = await sentencesService.getSentences("2021-01-01");

            expect(result).toBeNull();
            expect(mockSentencesRepository.findOneByDate).toHaveBeenCalledWith(
                "2021-01-01",
            );
        });
    });

    /**
     * getWeeklySentences
     */
    describe("getWeeklySentences", () => {
        it("should return sentences for the week", async () => {
            const mockSentences = [
                {
                    id: 1,
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    createdAt: new Date("2021-01-01"),
                    updatedAt: new Date("2021-01-01"),
                    vocabs: [{ word: "Hello", definition: "헬로" }],
                    video: {
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    },
                },
                {
                    id: 2,
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    createdAt: new Date("2021-01-02"),
                    updatedAt: new Date("2021-01-02"),
                    vocabs: [{ word: "Hello", definition: "헬로" }],
                    video: {
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    },
                },
            ];

            jest.spyOn(
                mockSentencesRepository,
                "findByDateRange",
            ).mockResolvedValue(mockSentences);

            const result =
                await sentencesService.getWeeklySentences("2021-01-01");

            expect(result).toEqual([
                {
                    date: "2021-01-01",
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    vocab: [{ word: "Hello", definition: "헬로" }],
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
                {
                    date: "2021-01-02",
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    vocab: [{ word: "Hello", definition: "헬로" }],
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
            ]);
            expect(
                mockSentencesRepository.findByDateRange,
            ).toHaveBeenCalledWith("2020-12-28", "2021-01-03");
        });
    });
});
