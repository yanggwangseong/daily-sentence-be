import { Test, TestingModule } from "@nestjs/testing";

import { toKoreanLocalDateString } from "../../../common/utils/date.util";
import { SentencesEntity } from "../../entities/sentences.entity";
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

        it("should return sentence data mapped to response format", async () => {
            mockSentencesRepository.findOneByDate.mockResolvedValue(
                mockSentence,
            );
            const date = toKoreanLocalDateString(mockSentence.createdAt);
            const result = await useCase.execute(date);

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
    });
});
