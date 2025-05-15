import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubscribersEntity } from "./entities/subscribers.entity";
import { SubscribersRepository } from "./repositories/subscribers.repository";
import { SUBSCRIBERS_REPOSITORY_TOKEN } from "./repositories/subscribers.repository.interface";
import { SubscribersController } from "./subscribers.controller";
import { SubscribersService } from "./subscribers.service";

@Module({
    imports: [TypeOrmModule.forFeature([SubscribersEntity])],
    controllers: [SubscribersController],
    providers: [
        SubscribersService,
        {
            provide: SUBSCRIBERS_REPOSITORY_TOKEN,
            useClass: SubscribersRepository,
        },
    ],
    exports: [],
})
export class SubscribersModule {}
