import { Inject, Injectable } from "@nestjs/common";

import { ISentencesService } from "./sentences.service.interface";
import {
    CHECK_SENTENCE_EXISTS_USECASE_TOKEN,
    GET_SENTENCE_USECASE_TOKEN,
    GET_WEEKLY_SENTENCES_USECASE_TOKEN,
    GetSentenceResponse,
    GetWeeklySentencesResponse,
    ICheckSentenceExistsUseCase,
    IGetSentenceUseCase,
    IGetWeeklySentencesUseCase,
} from "./use-cases";

export interface GetSentenceError {
    error: boolean;
    message: string;
}

@Injectable()
export class SentencesService implements ISentencesService {
    constructor(
        @Inject(GET_SENTENCE_USECASE_TOKEN)
        private readonly getSentenceUseCase: IGetSentenceUseCase,
        @Inject(GET_WEEKLY_SENTENCES_USECASE_TOKEN)
        private readonly getWeeklySentencesUseCase: IGetWeeklySentencesUseCase,
        @Inject(CHECK_SENTENCE_EXISTS_USECASE_TOKEN)
        private readonly checkSentenceExistsUseCase: ICheckSentenceExistsUseCase,
    ) {}

    getSentences(
        date: string,
    ): Promise<GetSentenceResponse | GetSentenceError> {
        const koreanDate = new Date(date).toLocaleDateString("sv-SE", {
            timeZone: "Asia/Seoul",
        });

        return this.getSentenceUseCase.execute(koreanDate);
    }

    getWeeklySentences(date: string): Promise<GetWeeklySentencesResponse> {
        return this.getWeeklySentencesUseCase.execute(date);
    }

    existsByDate(date: string): Promise<boolean> {
        return this.checkSentenceExistsUseCase.execute(date);
    }
}
