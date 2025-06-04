import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { VocabsEntity } from "../entities/vocabs.entity";
import { VocabsRepository } from "./vocabs.repository";

describe("VocabsRepository", () => {
    let vocabsRepository: VocabsRepository;

    beforeEach(async () => {
        const mockVocabsRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VocabsRepository,
                {
                    provide: getRepositoryToken(VocabsEntity),
                    useValue: mockVocabsRepository,
                },
            ],
        }).compile();

        vocabsRepository = module.get<VocabsRepository>(VocabsRepository);
    });

    it("should be defined", () => {
        expect(vocabsRepository).toBeDefined();
    });
});
