import { SentencesEntity } from "../entities/sentences.entity";

export const SENTENCES_REPOSITORY_TOKEN = "ISentencesRepository";

export interface ISentencesRepository {
    findOneByDate(datetime: string): Promise<SentencesEntity | null>;
    findByDateRange(
        startDate: string,
        endDate: string,
    ): Promise<SentencesEntity[]>;
}
