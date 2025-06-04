import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { VisitsEntity } from "../entities/visits.entity";
import { VisitsRepository } from "./visits.repository";

describe("VisitsRepository", () => {
    let visitsRepository: VisitsRepository;

    beforeEach(async () => {
        const mockVisitsRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VisitsRepository,
                {
                    provide: getRepositoryToken(VisitsEntity),
                    useValue: mockVisitsRepository,
                },
            ],
        }).compile();

        visitsRepository = module.get<VisitsRepository>(VisitsRepository);
    });

    it("should be defined", () => {
        expect(visitsRepository).toBeDefined();
    });
});
