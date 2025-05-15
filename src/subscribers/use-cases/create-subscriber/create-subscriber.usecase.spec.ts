import { Test, TestingModule } from "@nestjs/testing";

import { SubscribersEntity } from "../../entities/subscribers.entity";
import {
    ISubscribersRepository,
    SUBSCRIBERS_REPOSITORY_TOKEN,
} from "../../repositories/subscribers.repository.interface";
import { CreateSubscriberUseCase } from "./create-subscriber.usecase";

describe("CreateSubscriberUseCase", () => {
    let useCase: CreateSubscriberUseCase;
    let mockSubscribersRepository: jest.Mocked<ISubscribersRepository>;

    beforeEach(async () => {
        // Repository 모킹
        mockSubscribersRepository = {
            findByEmail: jest.fn(),
            createSubscriber: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateSubscriberUseCase,
                {
                    provide: SUBSCRIBERS_REPOSITORY_TOKEN,
                    useValue: mockSubscribersRepository,
                },
            ],
        }).compile();

        useCase = module.get<CreateSubscriberUseCase>(CreateSubscriberUseCase);
    });

    it("should be defined", () => {
        expect(useCase).toBeDefined();
    });

    describe("execute", () => {
        const mockSubscriber = {
            id: 1,
            email: "test@test.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies SubscribersEntity;

        it("should create a subscriber when email doesn't exist", async () => {
            // 이메일이 존재하지 않는 경우
            mockSubscribersRepository.findByEmail.mockResolvedValue(null);
            mockSubscribersRepository.createSubscriber.mockResolvedValue(
                mockSubscriber,
            );

            const result = await useCase.execute("test@test.com");

            expect(result).toEqual({
                subscriber: mockSubscriber,
            });
            expect(mockSubscribersRepository.findByEmail).toHaveBeenCalledWith(
                "test@test.com",
            );
            expect(
                mockSubscribersRepository.createSubscriber,
            ).toHaveBeenCalledWith("test@test.com");
        });

        it("should return error when email already exists", async () => {
            // 이메일이 이미 존재하는 경우
            mockSubscribersRepository.findByEmail.mockResolvedValue(
                mockSubscriber,
            );

            const result = await useCase.execute("test@test.com");

            expect(result).toEqual({
                message: "이미 구독자입니다.",
                error: true,
            });
            expect(mockSubscribersRepository.findByEmail).toHaveBeenCalledWith(
                "test@test.com",
            );
            expect(
                mockSubscribersRepository.createSubscriber,
            ).not.toHaveBeenCalled();
        });
    });
});
