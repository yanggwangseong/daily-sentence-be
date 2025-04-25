import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

import { TypeOrmModuleOptions } from "@APP/common/typeorm";
import { SentencesModule } from "./sentences/sentences.module";
import { VisitsModule } from "./visits/visits.module";
import { SubscribersModule } from "./subscribers/subscribers.module";

@Module({
    imports: [
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
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
