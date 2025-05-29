import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SentencesEntity } from "../entities/sentences.entity";
import { ISentencesRepository } from "./sentences.repository.interface";

@Injectable()
export class SentencesRepository implements ISentencesRepository {
    constructor(
        @InjectRepository(SentencesEntity)
        private readonly repository: Repository<SentencesEntity>,
    ) {}

    findOneByDate(datetime: string): Promise<SentencesEntity | null> {
        return this.repository
            .createQueryBuilder("sentence")
            .select([
                "sentence.id",
                "sentence.sentence",
                "sentence.meaning",
                "sentence.createdAt",
                "sentence.updatedAt",
            ])
            .addSelect(["vocab.id", "vocab.word", "vocab.definition"])
            .addSelect(["video.id", "video.videoUrl"])
            .leftJoinAndSelect("sentence.vocabs", "vocab")
            .leftJoinAndSelect("sentence.video", "video")
            .where("DATE(sentence.createdAt) = :date", { date: datetime })
            .getOne();
    }

    findByDateRange(
        startDate: string,
        endDate: string,
    ): Promise<SentencesEntity[]> {
        return this.repository
            .createQueryBuilder("sentence")
            .select([
                "sentence.id",
                "sentence.sentence",
                "sentence.meaning",
                "sentence.createdAt",
                "sentence.updatedAt",
            ])
            .addSelect(["vocab.word", "vocab.definition"])
            .addSelect(["video.videoUrl"])
            .leftJoinAndSelect("sentence.vocabs", "vocab")
            .leftJoinAndSelect("sentence.video", "video")
            .where("DATE(sentence.createdAt) BETWEEN :startDate AND :endDate", {
                startDate,
                endDate,
            })
            .getMany();
    }
}
