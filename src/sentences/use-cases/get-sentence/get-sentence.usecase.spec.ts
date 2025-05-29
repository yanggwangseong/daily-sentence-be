import { Test, TestingModule } from "@nestjs/testing";

import { SentencesEntity } from "@APP/sentences/entities/sentences.entity";

import {
    ISentencesRepository,
    SENTENCES_REPOSITORY_TOKEN,
} from "../../repositories/sentences.repository.interface";
import { GetSentenceUseCase } from "./get-sentence.usecase";

describe("GetSentenceUseCase", () => {
    let useCase: GetSentenceUseCase;
    let mockSentencesRepository: jest.Mocked<
        Pick<ISentencesRepository, "findOneByDate">
    >;

    beforeEach(async () => {
        // Repository 모킹
        mockSentencesRepository = {
            findOneByDate: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetSentenceUseCase,
                {
                    provide: SENTENCES_REPOSITORY_TOKEN,
                    useValue: mockSentencesRepository,
                },
            ],
        }).compile();

        useCase = module.get<GetSentenceUseCase>(GetSentenceUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    describe("execute", () => {
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
        } as SentencesEntity;

        it("should return sentence data when sentence exists", async () => {
            // 문장이 존재하는 경우
            mockSentencesRepository.findOneByDate.mockResolvedValue(
                mockSentence,
            );

            const result = await useCase.execute("2025-01-01");

            expect(result).toEqual({
                date: expect.any(String),
                sentence: mockSentence.sentence,
                meaning: mockSentence.meaning,
                vocab: [
                    {
                        word: mockSentence.vocabs[0]?.word,
                        definition: mockSentence.vocabs[0]?.definition,
                    },
                ],
                videoUrl: mockSentence.video?.videoUrl || "",
            });
            expect(mockSentencesRepository.findOneByDate).toHaveBeenCalled();
        });

        it("should return error when sentence doesn't exist", async () => {
            // 문장이 존재하지 않는 경우
            mockSentencesRepository.findOneByDate.mockResolvedValue(null);

            const result = await useCase.execute("2023-01-01");

            expect(result).toEqual({
                error: true,
                message: "해당 날짜에 문장이 없습니다.",
            });
            expect(mockSentencesRepository.findOneByDate).toHaveBeenCalled();
        });
    });
});
