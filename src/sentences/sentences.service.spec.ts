import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { SentencesEntity } from "./entities/sentences.entity";
import { VideosEntity } from "./entities/videos.entity";
import { VocabsEntity } from "./entities/vocabs.entity";
import { SentencesService } from "./sentences.service";
import {
    CHECK_SENTENCE_EXISTS_USECASE_TOKEN,
    GET_SENTENCE_USECASE_TOKEN,
    GET_WEEKLY_SENTENCES_USECASE_TOKEN,
    GetSentenceError,
    GetSentenceResponse,
    GetWeeklySentencesResponse,
    ICheckSentenceExistsUseCase,
    IGetSentenceUseCase,
    IGetWeeklySentencesUseCase,
} from "./use-cases";

describe("sentencesService", () => {
    let sentencesService: SentencesService;

    let mockGetSentenceUseCase: jest.Mocked<IGetSentenceUseCase>;
    let mockGetWeeklySentencesUseCase: jest.Mocked<IGetWeeklySentencesUseCase>;
    let mockCheckSentenceExistsUseCase: jest.Mocked<ICheckSentenceExistsUseCase>;

    beforeEach(async () => {
        mockGetSentenceUseCase = {
            execute: jest.fn(),
        };

        mockGetWeeklySentencesUseCase = {
            execute: jest.fn(),
        };

        mockCheckSentenceExistsUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SentencesService,
                {
                    provide: GET_SENTENCE_USECASE_TOKEN,
                    useValue: mockGetSentenceUseCase,
                },
                {
                    provide: GET_WEEKLY_SENTENCES_USECASE_TOKEN,
                    useValue: mockGetWeeklySentencesUseCase,
                },
                {
                    provide: CHECK_SENTENCE_EXISTS_USECASE_TOKEN,
                    useValue: mockCheckSentenceExistsUseCase,
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
                date: "2025-01-01",
                id: 1,
                sentence: "Hello, world!",
                meaning: "헬로 월드!",
                createdAt: new Date("2025-01-01"),
                updatedAt: new Date("2025-01-01"),
                vocab: [{ word: "Hello", definition: "헬로" }],
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            } as unknown as GetSentenceResponse | GetSentenceError;

            mockGetSentenceUseCase.execute.mockReturnValue(
                Promise.resolve(mockSentence),
            );

            const result = await sentencesService.getSentences("2025-01-01");

            expect(result).toEqual(mockSentence);
        });

        it("should return null when no sentence is found for the given date", async () => {
            mockGetSentenceUseCase.execute.mockReturnValue(
                Promise.resolve({
                    error: true,
                    message: "해당 날짜에 문장이 없습니다.",
                }),
            );

            const result = await sentencesService.getSentences("2025-01-01");

            expect(result).toEqual({
                error: true,
                message: "해당 날짜에 문장이 없습니다.",
            });
            expect(mockGetSentenceUseCase.execute).toHaveBeenCalledWith(
                "2025-01-01",
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
                    createdAt: new Date("2025-01-01"),
                    updatedAt: new Date("2025-01-01"),
                    vocabs: [{ word: "Hello", definition: "헬로" }],
                    video: {
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    },
                },
                {
                    id: 2,
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    createdAt: new Date("2025-01-02"),
                    updatedAt: new Date("2025-01-02"),
                    vocabs: [{ word: "Hello", definition: "헬로" }],
                    video: {
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    },
                },
            ] as unknown as GetWeeklySentencesResponse;

            mockGetWeeklySentencesUseCase.execute.mockReturnValue(
                Promise.resolve(mockSentences),
            );

            const result =
                await sentencesService.getWeeklySentences("2025-01-01");

            expect(result).toEqual(mockSentences);
            expect(mockGetWeeklySentencesUseCase.execute).toHaveBeenCalledWith(
                "2025-01-01",
            );
        });
    });

    /**
     * existsByDate
     */
    describe("existsByDate", () => {
        it("should return true if sentence exists", async () => {
            mockCheckSentenceExistsUseCase.execute.mockReturnValue(
                Promise.resolve(true),
            );

            const result = await sentencesService.existsByDate("2025-01-01");

            expect(result).toBe(true);
            expect(mockCheckSentenceExistsUseCase.execute).toHaveBeenCalledWith(
                "2025-01-01",
            );
        });

        it("should return false if sentence does not exist", async () => {
            mockCheckSentenceExistsUseCase.execute.mockReturnValue(
                Promise.resolve(false),
            );

            const result = await sentencesService.existsByDate("2025-01-01");

            expect(result).toBe(false);
            expect(mockCheckSentenceExistsUseCase.execute).toHaveBeenCalledWith(
                "2025-01-01",
            );
        });
    });
});
