import { SentencesEntity } from "../entities/sentences.entity";

export const SENTENCES_REPOSITORY_TOKEN = "ISentencesRepository";

export interface ISentencesRepository {
    findOneByDate(datetime: string): Promise<SentencesEntity>;
    findByDateRange(
        startDate: string,
        endDate: string,
    ): Promise<SentencesEntity[]>;
    existsByDate(datetime: string): Promise<boolean>;
}
