import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SentencesController } from "./sentences.controller";
import {
    ISentencesService,
    SENTENCES_SERVICE_TOKEN,
} from "./sentences.service.interface";

describe("sentencesController", () => {
    let controller: SentencesController;

    let mockSentencesService: jest.Mocked<ISentencesService>;

    beforeEach(async () => {
        mockSentencesService = {
            getSentences: jest.fn(),
            getWeeklySentences: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SentencesController],
            providers: [
                {
                    provide: SENTENCES_SERVICE_TOKEN,
                    useValue: mockSentencesService,
                },
            ],
        }).compile();

        controller = module.get<SentencesController>(SentencesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    /**
     * getSentences
     */
    describe("getSentences", () => {
        it("should return a sentence by date", async () => {
            const mockSentence = {
                date: "2021-01-01",
                sentence: "Hello, world!",
                meaning: "헬로 월드!",
                vocab: [{ word: "Hello", definition: "헬로" }],
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            };

            mockSentencesService.getSentences.mockResolvedValue(mockSentence);

            const result = await controller.getSentences("2021-01-01");

            expect(result).toEqual(mockSentence);
        });

        it("should throw NotFoundException when no sentence is found for the given date", async () => {
            mockSentencesService.getSentences.mockResolvedValue({
                error: true,
                message: "해당 날짜에 문장이 없습니다.",
            });

            await expect(controller.getSentences("2021-01-01")).rejects.toThrow(
                new NotFoundException("해당 날짜에 문장이 없습니다."),
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
                    date: "2021-01-01",
                    sentence: "Hello, world!",
                    meaning: "헬로 월드!",
                    vocab: [{ word: "Hello", definition: "헬로" }],
                    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                },
            ];

            mockSentencesService.getWeeklySentences.mockResolvedValue(
                mockSentences,
            );

            const result = await controller.getWeeklySentences("2021-01-01");

            expect(result).toEqual(mockSentences);
        });
    });
});
