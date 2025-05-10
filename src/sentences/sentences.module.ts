import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SentencesEntity } from "./entities/sentences.entity";
import { VideosEntity } from "./entities/videos.entity";
import { VocabsEntity } from "./entities/vocabs.entity";
import { SentencesRepository } from "./repositories/sentences.repository";
import { VideosRepository } from "./repositories/videos.repository";
import { VocabsRepository } from "./repositories/vocabs.repository";
import { SentencesController } from "./sentences.controller";
import { SentencesService } from "./sentences.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([SentencesEntity, VocabsEntity, VideosEntity]),
    ],
    controllers: [SentencesController],
    providers: [
        SentencesService,
        SentencesRepository,
        VocabsRepository,
        VideosRepository,
    ],
    exports: [],
})
export class SentencesModule {}
