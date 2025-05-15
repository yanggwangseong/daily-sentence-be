import { Inject, Injectable } from "@nestjs/common";

import {
    ISubscribersRepository,
    SUBSCRIBERS_REPOSITORY_TOKEN,
} from "./repositories/subscribers.repository.interface";

@Injectable()
export class SubscribersService {
    constructor(
        @Inject(SUBSCRIBERS_REPOSITORY_TOKEN)
        private readonly subscribersRepository: ISubscribersRepository,
    ) {}

    async create(email: string) {
        const subscriber = await this.subscribersRepository.findByEmail(email);

        if (subscriber) {
            return {
                message: "이미 구독자입니다.",
                error: true,
            };
        }

        return this.subscribersRepository.createSubscriber(email);
    }
}
