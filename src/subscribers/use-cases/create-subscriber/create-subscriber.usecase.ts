import { Inject, Injectable } from "@nestjs/common";

import { SubscribersEntity } from "../../entities/subscribers.entity";
import {
    ISubscribersRepository,
    SUBSCRIBERS_REPOSITORY_TOKEN,
} from "../../repositories/subscribers.repository.interface";
import { ICreateSubscriberUseCase } from "./create-subscriber.interface";

export interface CreateSubscriberResponse {
    subscriber?: SubscribersEntity;
    message?: string;
    error?: boolean;
}

@Injectable()
export class CreateSubscriberUseCase implements ICreateSubscriberUseCase {
    constructor(
        @Inject(SUBSCRIBERS_REPOSITORY_TOKEN)
        private readonly subscribersRepository: ISubscribersRepository,
    ) {}

    async execute(email: string): Promise<CreateSubscriberResponse> {
        const subscriber = await this.subscribersRepository.findByEmail(email);

        if (subscriber) {
            return {
                message: "이미 구독자입니다.",
                error: true,
            };
        }

        const newSubscriber =
            await this.subscribersRepository.createSubscriber(email);

        return {
            subscriber: newSubscriber,
        };
    }
}
