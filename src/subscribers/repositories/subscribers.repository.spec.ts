import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SubscribersEntity } from "../entities/subscribers.entity";
import { SubscribersRepository } from "./subscribers.repository";

describe("SubscribersRepository", () => {
    let subscribersRepository: SubscribersRepository;
    let mockRepository: jest.Mocked<
        Pick<Repository<SubscribersEntity>, "findOne" | "save">
    >;

    beforeEach(async () => {
        mockRepository = {
            findOne: jest.fn(),
            save: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SubscribersRepository,
                {
                    provide: getRepositoryToken(SubscribersEntity),
                    useValue: mockRepository,
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

    describe("findByEmail", () => {
        it("should return a subscriber by email", async () => {
            const mockSubscriber = {
                id: 1,
                email: "test@test.com",
                createdAt: new Date(),
                updatedAt: new Date(),
            } as SubscribersEntity;

            mockRepository.findOne.mockResolvedValue(mockSubscriber);

            const result =
                await subscribersRepository.findByEmail("test@test.com");

            expect(result).toEqual(mockSubscriber);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { email: "test@test.com" },
            });
        });

        it("should return null if no subscriber is found", async () => {
            mockRepository.findOne.mockResolvedValue(null);

            const result =
                await subscribersRepository.findByEmail("test@test.com");

            expect(result).toBeNull();
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { email: "test@test.com" },
            });
        });
    });

    describe("createSubscriber", () => {
        it("should create a subscriber", async () => {
            const mockSubscriber = {
                id: 1,
                email: "test@test.com",
                createdAt: new Date(),
                updatedAt: new Date(),
            } satisfies SubscribersEntity;

            mockRepository.save.mockResolvedValue(mockSubscriber);

            const result =
                await subscribersRepository.createSubscriber("test@test.com");

            expect(result).toEqual(mockSubscriber);
            expect(mockRepository.save).toHaveBeenCalledWith({
                email: "test@test.com",
            });
        });
    });
});
