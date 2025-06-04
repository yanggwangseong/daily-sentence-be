import { DayOfWeek, LocalDate } from "@js-joda/core";
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

    getSentences(date: string): Promise<GetSentenceResponse> {
        return this.getSentenceUseCase.execute(date);
    }

    getWeeklySentences(date: string): Promise<GetWeeklySentencesResponse> {
        const { startDateStr, endDateStr } = this.getWeeklyRange(date);

        return this.getWeeklySentencesUseCase.execute(startDateStr, endDateStr);
    }

    existsByDate(date: string): Promise<boolean> {
        return this.checkSentenceExistsUseCase.execute(date);
    }

    private getWeeklyRange(date: string): {
        startDateStr: string;
        endDateStr: string;
    } {
        const inputDate = LocalDate.parse(date); // ex: "2025-06-04"

        const dayOfWeek = inputDate.dayOfWeek(); // 월=1 ~ 일=7
        const diff =
            dayOfWeek === DayOfWeek.SUNDAY
                ? 6
                : dayOfWeek.ordinal() - DayOfWeek.MONDAY.ordinal(); // 월요일 기준

        const startDate = inputDate.minusDays(diff);
        const endDate = startDate.plusDays(6);

        return {
            startDateStr: startDate.toString(), // ex: "2025-06-02"
            endDateStr: endDate.toString(), // ex: "2025-06-08"
        };
    }
}
