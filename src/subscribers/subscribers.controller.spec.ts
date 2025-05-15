import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersController } from "./subscribers.controller";
import {
    ISubscribersService,
    SUBSCRIBERS_SERVICE_TOKEN,
} from "./subscribers.service.interface";

describe("SubscribersController", () => {
    let controller: SubscribersController;
    let mockSubscribersService: jest.Mocked<ISubscribersService>;

    beforeEach(async () => {
        mockSubscribersService = {
            create: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubscribersController],
            providers: [
                {
                    provide: SUBSCRIBERS_SERVICE_TOKEN,
                    useValue: mockSubscribersService,
                },
            ],
        }).compile();

        controller = module.get<SubscribersController>(SubscribersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("create", () => {
        it("should create a subscriber", async () => {
            const mockSubscriber = {
                id: 1,
                email: "test@test.com",
                createdAt: new Date(),
                updatedAt: new Date(),
            } satisfies SubscribersEntity;

            mockSubscribersService.create.mockResolvedValue(mockSubscriber);

            const result = await controller.create("test@test.com");

            expect(result).toEqual({
                message: "구독자 등록 완료",
                subscriber: mockSubscriber,
            });
        });

        it("should return an error if the subscriber already exists", async () => {
            mockSubscribersService.create.mockResolvedValue({
                message: "이미 구독자입니다.",
                error: true,
            });

            await expect(controller.create("test@test.com")).rejects.toThrow(
                ConflictException,
            );

            expect(mockSubscribersService.create).toHaveBeenCalledWith(
                "test@test.com",
            );
        });
    });
});
