import { Test, TestingModule } from "@nestjs/testing";
import { SubscribersRepository } from "./subscribers.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SubscribersEntity } from "../entities/subscribers.entity";

const mockSubscribersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("SubscribersRepository", () => {
    let subscribersRepository: SubscribersRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscribersRepository,
                {
                    provide: getRepositoryToken(SubscribersEntity),
                    useValue: mockSubscribersRepository,
                },
            ],
        }).compile();

        subscribersRepository = module.get<SubscribersRepository>(
            SubscribersRepository,
        );
    });

    it("should be defined", () => {
        expect(subscribersRepository).toBeDefined();
    });
});
