import { Inject, Injectable } from "@nestjs/common";

import { toKoreanLocalDateString } from "../../../common/utils/date.util";
import {
    ISentencesRepository,
    SENTENCES_REPOSITORY_TOKEN,
} from "../../repositories/sentences.repository.interface";
import { IGetSentenceUseCase } from "./get-sentence.interface";

export interface VocabDto {
    word: string;
    definition: string;
}

export interface GetSentenceResponse {
    date: string;
    sentence: string;
    meaning: string;
    vocab: VocabDto[];
    videoUrl: string;
}

export interface GetSentenceError {
    error: boolean;
    message: string;
}

/**
 * 해당 날짜의 문장을 조회하는 유스케이스
 * @author 양광성
 * @description 해당 날짜의 문장을 조회하는 유스케이스
 * @param date 날짜
 * @returns 문장 조회 결과
 * @todo if문 예외처리에 대한 관심사를 middleware로 분리하자
 */

@Injectable()
export class GetSentenceUseCase implements IGetSentenceUseCase {
    constructor(
        @Inject(SENTENCES_REPOSITORY_TOKEN)
        private readonly sentencesRepository: ISentencesRepository,
    ) {}

    async execute(date: string): Promise<GetSentenceResponse> {
        const sentence = await this.sentencesRepository.findOneByDate(date);

        return {
            date: toKoreanLocalDateString(sentence.createdAt),
            sentence: sentence.sentence,
            meaning: sentence.meaning,
            vocab: sentence.vocabs.map((v) => ({
                word: v.word,
                definition: v.definition,
            })),
            videoUrl: sentence.video?.videoUrl ?? "",
        };
    }
}
