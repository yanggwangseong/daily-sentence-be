import { Test, TestingModule } from "@nestjs/testing";
import { SentencesRepository } from "./sentences.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SentencesEntity } from "../entities/sentences.entity";

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
                createdAt: new Date("2021-01-01"),
                updatedAt: new Date("2021-01-01"),
            };

            const queryBuilderMock = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(mockSentence),
            };

            jest.spyOn(
                mockSentencesRepository,
                "createQueryBuilder",
            ).mockReturnValue(queryBuilderMock as any);

            const sentence =
                await sentencesRepository.findOneByDate("2021-01-01");

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
                { date: "2021-01-01" },
            );
            expect(queryBuilderMock.getOne).toHaveBeenCalled();
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
                    createdAt: new Date("2021-01-01"),
                    updatedAt: new Date("2021-01-01"),
                },
                {
                    id: 2,
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    createdAt: new Date("2021-01-02"),
                    updatedAt: new Date("2021-01-02"),
                },
            ];

            const queryBuilderMock = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                getMany: jest.fn().mockResolvedValue(mockSentences),
            };

            jest.spyOn(
                mockSentencesRepository,
                "createQueryBuilder",
            ).mockReturnValue(queryBuilderMock as any);

            const sentences = await sentencesRepository.findByDateRange(
                "2021-01-01",
                "2021-01-02",
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
                    startDate: "2021-01-01",
                    endDate: "2021-01-02",
                },
            );
            expect(queryBuilderMock.getMany).toHaveBeenCalled();
        });
    });
});
