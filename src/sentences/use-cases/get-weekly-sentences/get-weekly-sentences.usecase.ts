import { Inject, Injectable } from "@nestjs/common";

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

    async execute(date: string): Promise<GetWeeklySentencesResponse> {
        const inputDate = new Date(date);

        // 월요일을 주의 시작으로 계산 (1: 월요일, ..., 0: 일요일)
        const day = inputDate.getDay();
        const diff = day === 0 ? 6 : day - 1; // 일요일(0)이면 6을 빼고, 아니면 요일-1을 빼서 월요일로 맞춤

        // 월요일(시작일)
        const startDate = new Date(inputDate);
        startDate.setDate(inputDate.getDate() - diff);

        // 일요일(종료일)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const startDateStr = startDate.toLocaleDateString("sv-SE", {
            timeZone: "Asia/Seoul",
        });
        const endDateStr = endDate.toLocaleDateString("sv-SE", {
            timeZone: "Asia/Seoul",
        });

        const sentences = await this.sentencesRepository.findByDateRange(
            startDateStr,
            endDateStr,
        );

        return sentences.map((sentence) => ({
            date: new Date(sentence.createdAt).toLocaleDateString("sv-SE", {
                timeZone: "Asia/Seoul",
            }),
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
