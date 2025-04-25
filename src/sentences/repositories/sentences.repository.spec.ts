import { Test, TestingModule } from "@nestjs/testing";
import { SentencesRepository } from "./sentences.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SentencesEntity } from "../entities/sentences.entity";

const mockSentencesRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
});
