import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersService } from "./subscribers.service";
import { SUBSCRIBERS_SERVICE_TOKEN } from "./subscribers.service.interface";
import {
    CREATE_SUBSCRIBER_USECASE_TOKEN,
    ICreateSubscriberUseCase,
} from "./use-cases/create-subscriber/create-subscriber.interface";

describe("SubscribersService", () => {
    let subscribersService: SubscribersService;
    let mockCreateSubscriberUseCase: jest.Mocked<ICreateSubscriberUseCase>;

    beforeEach(async () => {
        mockCreateSubscriberUseCase = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: SUBSCRIBERS_SERVICE_TOKEN,
                    useClass: SubscribersService,
                },
                {
                    provide: CREATE_SUBSCRIBER_USECASE_TOKEN,
                    useValue: mockCreateSubscriberUseCase,
                },
                {
                    provide: getRepositoryToken(SubscribersEntity),
                    useValue: {},
                },
            ],
        }).compile();

        subscribersService = module.get<SubscribersService>(
            SUBSCRIBERS_SERVICE_TOKEN,
        );
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
            // 유스케이스가 새 구독자를 반환하도록 모킹
            mockCreateSubscriberUseCase.execute.mockResolvedValue({
                subscriber: mockSubscriber,
            });

            const result = await subscribersService.create("test@test.com");

            expect(result).toEqual(mockSubscriber);
            expect(mockCreateSubscriberUseCase.execute).toHaveBeenCalledWith(
                "test@test.com",
            );
        });

        it("should return an error if the subscriber already exists", async () => {
            // 유스케이스가 에러를 반환하도록 모킹
            mockCreateSubscriberUseCase.execute.mockResolvedValue({
                message: "이미 구독자입니다.",
                error: true,
            });

            const result = await subscribersService.create("test@test.com");

            expect(result).toEqual({
                message: "이미 구독자입니다.",
                error: true,
            });
            expect(mockCreateSubscriberUseCase.execute).toHaveBeenCalledWith(
                "test@test.com",
            );
        });

        it("should return an error if subscriber creation fails", async () => {
            // 유스케이스가 subscriber를 undefined로 반환하도록 모킹
            mockCreateSubscriberUseCase.execute.mockResolvedValue({
                subscriber: undefined,
            });

            const result = await subscribersService.create("test@test.com");

            expect(result).toEqual({
                message: "구독자 생성에 실패했습니다.",
                error: true,
            });
            expect(mockCreateSubscriberUseCase.execute).toHaveBeenCalledWith(
                "test@test.com",
            );
        });
    });
});
