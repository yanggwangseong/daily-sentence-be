import {
    ConflictException,
    Controller,
    Inject,
    Param,
    Post,
} from "@nestjs/common";

import { EmailPipe } from "./pipes/email.pipe";
import {
    ISubscribersService,
    SUBSCRIBERS_SERVICE_TOKEN,
} from "./subscribers.service.interface";

@Controller("subscribers")
export class SubscribersController {
    constructor(
        @Inject(SUBSCRIBERS_SERVICE_TOKEN)
        private readonly subscribersService: ISubscribersService,
    ) {}

    @Post(":email")
    async create(@Param("email", new EmailPipe()) email: string) {
        const subscriber = await this.subscribersService.create(email);

        if (typeof subscriber === "object" && "error" in subscriber) {
            throw new ConflictException(subscriber.message);
        }

        return {
            message: "구독자 등록 완료",
            subscriber,
        };
    }
}
