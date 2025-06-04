import { Inject, Injectable } from "@nestjs/common";

import { toKoreanLocalDateString } from "../../../common/utils/date.util";
import {
    ISentencesRepository,
    SENTENCES_REPOSITORY_TOKEN,
} from "../../repositories/sentences.repository.interface";
import { VocabDto } from "../get-sentence/get-sentence.usecase";
import { IGetWeeklySentencesUseCase } from "./get-weekly-sentences.interface";

export interface SentenceResponse {
    date: string;
    sentence: string;
    meaning: string;
    vocab: VocabDto[];
    videoUrl: string;
}

export type GetWeeklySentencesResponse = SentenceResponse[];

@Injectable()
export class GetWeeklySentencesUseCase implements IGetWeeklySentencesUseCase {
    constructor(
        @Inject(SENTENCES_REPOSITORY_TOKEN)
        private readonly sentencesRepository: ISentencesRepository,
    ) {}

    async execute(
        startDateStr: string,
        endDateStr: string,
    ): Promise<GetWeeklySentencesResponse> {
        const sentences = await this.sentencesRepository.findByDateRange(
            startDateStr,
            endDateStr,
        );

        return sentences.map((sentence) => ({
            date: toKoreanLocalDateString(sentence.createdAt),
            sentence: sentence.sentence,
            meaning: sentence.meaning,
            vocab: sentence.vocabs.map((v) => ({
                word: v.word,
                definition: v.definition,
            })),
            videoUrl: sentence.video?.videoUrl ?? "",
        }));
    }
}
