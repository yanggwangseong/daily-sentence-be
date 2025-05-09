import { getRepositoryToken } from "@nestjs/typeorm";

import { Test, TestingModule } from "@nestjs/testing";
import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersRepository } from "./repositories/subscribers.repository";
import { SubscribersService } from "./subscribers.service";

// Repository 모킹
const mockSubscribersRepository = {
    findByEmail: jest.fn(),
    createSubscriber: jest.fn(),
};

describe("subscribersService", () => {
    let subscribersService: SubscribersService;

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
    });

    it("should be defined", () => {
        expect(subscribersService).toBeDefined();
    });

    describe("create", () => {
        const mockSubscriber = {
            id: 1,
            email: "test@test.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies SubscribersEntity;

        it("should create a subscriber", async () => {
            jest.spyOn(
                mockSubscribersRepository,
                "createSubscriber",
            ).mockResolvedValue(mockSubscriber);

            const result = await subscribersService.create("test@test.com");

            expect(result).toEqual(mockSubscriber);
            expect(
                mockSubscribersRepository.createSubscriber,
            ).toHaveBeenCalledWith("test@test.com");
        });

        it("should return an error if the subscriber already exists", async () => {
            jest.spyOn(
                mockSubscribersRepository,
                "findByEmail",
            ).mockResolvedValue(mockSubscriber);

            const result = await subscribersService.create("test@test.com");

            expect(result).toEqual({
                message: "이미 구독자입니다.",
                error: true,
            });
        });
    });
});
