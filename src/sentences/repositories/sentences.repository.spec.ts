import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { SentencesEntity } from "../entities/sentences.entity";
import { SentencesRepository } from "./sentences.repository";

const mockSentencesRepository = {
    createQueryBuilder: jest.fn(),
};

describe("SentencesRepository", () => {
    let sentencesRepository: SentencesRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SentencesRepository,
                {
                    provide: getRepositoryToken(SentencesEntity),
                    useValue: mockSentencesRepository,
                },
            ],
        }).compile();

        sentencesRepository =
            module.get<SentencesRepository>(SentencesRepository);
    });

    it("should be defined", () => {
        expect(sentencesRepository).toBeDefined();
    });

    /**
     * findOneByDate
     */
    describe("findOneByDate", () => {
        it("should return a sentence by date", async () => {
            const mockSentence = {
                id: 1,
                sentence: "Hello, world!",
                meaning: "헬로 월드!",
                createdAt: new Date("2025-01-01"),
                updatedAt: new Date("2025-01-01"),
                vocabs: [
                    {
                        id: 1,
                        word: "Hello",
                        definition: "헬로",
                    },
                ],
                video: {
                    id: 1,
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
            };

            const queryBuilderMock = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                getOneOrFail: jest.fn().mockResolvedValue(mockSentence),
            };

            mockSentencesRepository.createQueryBuilder.mockReturnValue(
                queryBuilderMock,
            );

            const sentence =
                await sentencesRepository.findOneByDate("2025-01-01");

            expect(sentence).toEqual(mockSentence);
            expect(
                mockSentencesRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("sentence");
            expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
                1,
                "sentence.vocabs",
                "vocab",
            );
            expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
                2,
                "sentence.video",
                "video",
            );
            expect(queryBuilderMock.where).toHaveBeenCalledWith(
                "DATE(sentence.createdAt) = :date",
                { date: "2025-01-01" },
            );
            expect(queryBuilderMock.getOneOrFail).toHaveBeenCalled();
        });
    });

    /**
     * existsByDate
     */
    describe("existsByDate", () => {
        it("should return true if sentence exists", async () => {
            const queryBuilderMock = {
                where: jest.fn().mockReturnThis(),
                getExists: jest.fn().mockResolvedValue(true),
            };

            mockSentencesRepository.createQueryBuilder.mockReturnValue(
                queryBuilderMock,
            );

            const exists = await sentencesRepository.existsByDate("2025-01-01");

            expect(exists).toBe(true);
            expect(
                mockSentencesRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("sentence");
            expect(queryBuilderMock.where).toHaveBeenCalledWith(
                "DATE(sentence.createdAt) = :date",
                { date: "2025-01-01" },
            );
            expect(queryBuilderMock.getExists).toHaveBeenCalled();
        });

        it("should return false if sentence does not exist", async () => {
            const queryBuilderMock = {
                where: jest.fn().mockReturnThis(),
                getExists: jest.fn().mockResolvedValue(false),
            };

            mockSentencesRepository.createQueryBuilder.mockReturnValue(
                queryBuilderMock,
            );

            const exists = await sentencesRepository.existsByDate("2025-01-01");

            expect(exists).toBe(false);
            expect(
                mockSentencesRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("sentence");
            expect(queryBuilderMock.where).toHaveBeenCalledWith(
                "DATE(sentence.createdAt) = :date",
                { date: "2025-01-01" },
            );
            expect(queryBuilderMock.getExists).toHaveBeenCalled();
        });
    });

    /**
     * findByDateRange
     */
    describe("findByDateRange", () => {
        it("should return sentences by date range", async () => {
            const mockSentences = [
                {
                    id: 1,
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    createdAt: new Date("2025-01-01"),
                    updatedAt: new Date("2025-01-01"),
                },
                {
                    id: 2,
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    createdAt: new Date("2025-01-02"),
                    updatedAt: new Date("2025-01-02"),
                },
            ];

            const queryBuilderMock = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(mockSentences),
            };

            mockSentencesRepository.createQueryBuilder.mockReturnValue(
                queryBuilderMock,
            );

            const sentences = await sentencesRepository.findByDateRange(
                "2025-01-01",
                "2025-01-02",
            );

            expect(sentences).toEqual(mockSentences);
            expect(
                mockSentencesRepository.createQueryBuilder,
            ).toHaveBeenCalledWith("sentence");
            expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
                1,
                "sentence.vocabs",
                "vocab",
            );
            expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
                2,
                "sentence.video",
                "video",
            );
            expect(queryBuilderMock.where).toHaveBeenCalledWith(
                "DATE(sentence.createdAt) BETWEEN :startDate AND :endDate",
                {
                    startDate: "2025-01-01",
                    endDate: "2025-01-02",
                },
            );
            expect(queryBuilderMock.getMany).toHaveBeenCalled();
        });
    });
});
