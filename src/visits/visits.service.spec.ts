import { Test, TestingModule } from "@nestjs/testing";

import { VisitsService } from "./visits.service";

describe("VisitsService", () => {
    let visitsService: VisitsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [VisitsService],
        }).compile();

        visitsService = module.get<VisitsService>(VisitsService);
    });

    it("should be defined", () => {
        expect(visitsService).toBeDefined();
    });
});
