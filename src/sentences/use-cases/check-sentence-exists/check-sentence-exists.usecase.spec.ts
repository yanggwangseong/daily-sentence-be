import { Test, TestingModule } from "@nestjs/testing";

import {
    ISentencesRepository,
    SENTENCES_REPOSITORY_TOKEN,
} from "../../repositories/sentences.repository.interface";
import { CheckSentenceExistsUseCase } from "./check-sentence-exists.usecase";

describe("CheckSentenceExistsUseCase", () => {
    let useCase: CheckSentenceExistsUseCase;
    let mockSentencesRepository: jest.Mocked<
        Pick<ISentencesRepository, "existsByDate">
    >;

    beforeEach(async () => {
        mockSentencesRepository = {
            existsByDate: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CheckSentenceExistsUseCase,
                {
                    provide: SENTENCES_REPOSITORY_TOKEN,
                    useValue: mockSentencesRepository,
                },
            ],
        }).compile();

        useCase = module.get<CheckSentenceExistsUseCase>(
            CheckSentenceExistsUseCase,
        );
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    it("should return true if sentence exists", async () => {
        mockSentencesRepository.existsByDate.mockResolvedValue(true);

        const result = await useCase.execute("2025-01-01");

        expect(result).toBe(true);
        expect(mockSentencesRepository.existsByDate).toHaveBeenCalledWith(
            "2025-01-01",
        );
    });

    it("should return false if sentence does not exist", async () => {
        mockSentencesRepository.existsByDate.mockResolvedValue(false);

        const result = await useCase.execute("2025-01-01");

        expect(result).toBe(false);
        expect(mockSentencesRepository.existsByDate).toHaveBeenCalledWith(
            "2025-01-01",
        );
    });
});
