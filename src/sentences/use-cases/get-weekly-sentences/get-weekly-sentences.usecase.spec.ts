import { Test, TestingModule } from "@nestjs/testing";

import { SentencesEntity } from "@APP/sentences/entities/sentences.entity";

import {
    ISentencesRepository,
    SENTENCES_REPOSITORY_TOKEN,
} from "../../repositories/sentences.repository.interface";
import { GetWeeklySentencesUseCase } from "./get-weekly-sentences.usecase";

describe("GetWeeklySentencesUseCase", () => {
    let useCase: GetWeeklySentencesUseCase;
    let mockSentencesRepository: jest.Mocked<
        Pick<ISentencesRepository, "findByDateRange">
    >;

    beforeEach(async () => {
        // Repository 모킹
        mockSentencesRepository = {
            findByDateRange: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GetWeeklySentencesUseCase,
                {
                    provide: SENTENCES_REPOSITORY_TOKEN,
                    useValue: mockSentencesRepository,
                },
            ],
        }).compile();

        useCase = module.get<GetWeeklySentencesUseCase>(
            GetWeeklySentencesUseCase,
        );
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    describe("execute", () => {
        const mockSentences = [
            {
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
            },
            {
                id: 2,
                sentence: "Hello, world!",
                meaning: "헬로 월드!",
                createdAt: new Date("2025-01-02"),
                updatedAt: new Date("2025-01-02"),
                vocabs: [
                    {
                        id: 1,
                        word: "Hello",
                        definition: "헬로",
                    },
                ],
                video: null,
            },
        ] as SentencesEntity[];

        it("should return weekly sentences", async () => {
            // 주간 문장 반환 모킹
            mockSentencesRepository.findByDateRange.mockResolvedValue(
                mockSentences,
            );

            // 2025-05-16 (금요일)을 기준으로 테스트
            const result = await useCase.execute("2025-05-16");

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                date: expect.any(String),
                sentence: mockSentences[0]?.sentence,
                meaning: mockSentences[0]?.meaning,
                vocab: [
                    {
                        word: mockSentences[0]?.vocabs[0]?.word,
                        definition: mockSentences[0]?.vocabs[0]?.definition,
                    },
                ],
                videoUrl: mockSentences[0]?.video?.videoUrl || "",
            });
            expect(result[1]).toEqual({
                date: expect.any(String),
                sentence: mockSentences[1]?.sentence,
                meaning: mockSentences[1]?.meaning,
                vocab: [
                    {
                        word: mockSentences[1]?.vocabs[0]?.word,
                        definition: mockSentences[1]?.vocabs[0]?.definition,
                    },
                ],
                videoUrl: "",
            });

            // 시작일과 종료일 날짜 형식이 맞는지 확인
            expect(
                mockSentencesRepository.findByDateRange,
            ).toHaveBeenCalledWith(
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), // yyyy-MM-dd 형식
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), // yyyy-MM-dd 형식
            );
        });

        it("should return empty array when no sentences found", async () => {
            // 결과가 없는 경우
            mockSentencesRepository.findByDateRange.mockResolvedValue([]);

            const result = await useCase.execute("2025-05-16");

            expect(result).toEqual([]);
            expect(mockSentencesRepository.findByDateRange).toHaveBeenCalled();
        });

        it("should calculate correct date range for Sunday", async () => {
            // 일요일(2025-05-16)을 입력하면 이전 주 월요일(2025-05-09)부터 일요일(2025-05-16)까지 계산해야 함
            mockSentencesRepository.findByDateRange.mockResolvedValue([]);

            await useCase.execute("2025-05-16"); // 일요일

            // 첫 번째 인자는 "2025-05-09"(월요일), 두 번째 인자는 "2025-05-16"(일요일)이어야 함
            expect(
                mockSentencesRepository.findByDateRange,
            ).toHaveBeenCalledWith(
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
                expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
            );
        });
    });
});
