import { getRepositoryToken } from "@nestjs/typeorm";

import { Test, TestingModule } from "@nestjs/testing";
import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersRepository } from "./repositories/subscribers.repository";
import { SubscribersService } from "./subscribers.service";

// Repository 모킹
const mockSubscribersRepository = {
    create: jest.fn(),
};

describe("subscribersService", () => {
    let subscribersService: SubscribersService;
    let subscribersRepository: SubscribersRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscribersService,
                {
                    provide: SubscribersRepository,
                    useValue: mockSubscribersRepository,
                },
                {
                    provide: getRepositoryToken(SubscribersEntity),
                    useValue: {},
                },
            ],
        }).compile();

        subscribersService = module.get<SubscribersService>(SubscribersService);
        subscribersRepository = module.get<SubscribersRepository>(
            SubscribersRepository,
        );
    });

    it("should be defined", () => {
        expect(subscribersService).toBeDefined();
    });
});
