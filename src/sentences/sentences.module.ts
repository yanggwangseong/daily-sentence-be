import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SentencesEntity } from "./entities/sentences.entity";
import { VideosEntity } from "./entities/videos.entity";
import { VocabsEntity } from "./entities/vocabs.entity";
import { SentencesRepository } from "./repositories/sentences.repository";
import { SENTENCES_REPOSITORY_TOKEN } from "./repositories/sentences.repository.interface";
import { VideosRepository } from "./repositories/videos.repository";
import { VocabsRepository } from "./repositories/vocabs.repository";
import { SentencesController } from "./sentences.controller";
import { SentencesService } from "./sentences.service";
import { SENTENCES_SERVICE_TOKEN } from "./sentences.service.interface";
import {
    GET_SENTENCE_USECASE_TOKEN,
    GET_WEEKLY_SENTENCES_USECASE_TOKEN,
    GetSentenceUseCase,
    GetWeeklySentencesUseCase,
} from "./use-cases";

/**
 * sentences 모듈
 * @description 문장 관리 모듈
 * @author 양광성
 * @todo Dynamic Provider 설계가 필요함
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([SentencesEntity, VocabsEntity, VideosEntity]),
    ],
    controllers: [SentencesController],
    providers: [
        {
            provide: SENTENCES_SERVICE_TOKEN,
            useClass: SentencesService,
        },
        {
            provide: SENTENCES_REPOSITORY_TOKEN,
            useClass: SentencesRepository,
        },
        {
            provide: GET_SENTENCE_USECASE_TOKEN,
            useClass: GetSentenceUseCase,
        },
        {
            provide: GET_WEEKLY_SENTENCES_USECASE_TOKEN,
            useClass: GetWeeklySentencesUseCase,
        },
        VocabsRepository,
        VideosRepository,
    ],
    exports: [],
})
export class SentencesModule {}
