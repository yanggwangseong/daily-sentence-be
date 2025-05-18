import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SentryModule } from "@sentry/nestjs/setup";
import path from "path";

import { TypeOrmModuleOptions } from "@APP/common/typeorm";

import { HealthController } from "./health.controller";
import { SentencesModule } from "./sentences/sentences.module";
import { SubscribersModule } from "./subscribers/subscribers.module";
import { VisitsModule } from "./visits/visits.module";

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: [
                path.resolve(process.cwd(), `.${process.env["NODE_ENV"]}.env`),
            ],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(TypeOrmModuleOptions),
        SentencesModule,
        VisitsModule,
        SubscribersModule,
    ],
    controllers: [HealthController],
    providers: [],
    exports: [],
})
export class AppModule {}
