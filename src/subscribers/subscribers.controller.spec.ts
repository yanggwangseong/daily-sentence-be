import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersController } from "./subscribers.controller";
import { SubscribersService } from "./subscribers.service";

// Service 모킹
const mockSubscribersService = {
    create: jest.fn(),
};

describe("SubscribersController", () => {
    let controller: SubscribersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubscribersController],
            providers: [
                SubscribersService,
                {
                    provide: SubscribersService,
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

            jest.spyOn(mockSubscribersService, "create").mockResolvedValue(
                mockSubscriber,
            );

            const result = await controller.create("test@test.com");

            expect(result).toEqual({
                message: "구독자 등록 완료",
                subscriber: mockSubscriber,
            });
        });

        it("should return an error if the subscriber already exists", async () => {
            jest.spyOn(mockSubscribersService, "create").mockResolvedValue({
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
