import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersRepository } from "./repositories/subscribers.repository";
import { SUBSCRIBERS_REPOSITORY_TOKEN } from "./repositories/subscribers.repository.interface";
import { SubscribersController } from "./subscribers.controller";
import { SubscribersService } from "./subscribers.service";
import { SUBSCRIBERS_SERVICE_TOKEN } from "./subscribers.service.interface";
import { CREATE_SUBSCRIBER_USECASE_TOKEN } from "./use-cases/create-subscriber/create-subscriber.interface";
import { CreateSubscriberUseCase } from "./use-cases/create-subscriber/create-subscriber.usecase";

/**
 * subscribers 모듈
 * @description 구독자 관리 모듈
 * @author 양광성
 * @todo Dynamic Provider 설계가 필요함
 */
@Module({
    imports: [TypeOrmModule.forFeature([SubscribersEntity])],
    controllers: [SubscribersController],
    providers: [
        {
            provide: SUBSCRIBERS_SERVICE_TOKEN,
            useClass: SubscribersService,
        },
        {
            provide: SUBSCRIBERS_REPOSITORY_TOKEN,
            useClass: SubscribersRepository,
        },
        {
            provide: CREATE_SUBSCRIBER_USECASE_TOKEN,
            useClass: CreateSubscriberUseCase,
        },
    ],
    exports: [SUBSCRIBERS_SERVICE_TOKEN],
})
export class SubscribersModule {}
