import { Inject, Injectable } from "@nestjs/common";

import { SubscribersEntity } from "./entities/subscribers.entity";
import { ISubscribersService } from "./subscribers.service.interface";
import {
    CREATE_SUBSCRIBER_USECASE_TOKEN,
    ICreateSubscriberUseCase,
} from "./use-cases/create-subscriber/create-subscriber.interface";

@Injectable()
export class SubscribersService implements ISubscribersService {
    constructor(
        @Inject(CREATE_SUBSCRIBER_USECASE_TOKEN)
        private readonly createSubscriberUseCase: ICreateSubscriberUseCase,
    ) {}

    async create(
        email: string,
    ): Promise<SubscribersEntity | { message: string; error: boolean }> {
        const result = await this.createSubscriberUseCase.execute(email);

        if (result.error) {
            return {
                message: result.message ?? "오류가 발생했습니다.",
                error: true,
            };
        }

        if (!result.subscriber) {
            return {
                message: "구독자 생성에 실패했습니다.",
                error: true,
            };
        }

        return result.subscriber;
    }
}
