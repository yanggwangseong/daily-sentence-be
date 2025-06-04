import { Inject, Injectable } from "@nestjs/common";

import {
    ISentencesRepository,
    SENTENCES_REPOSITORY_TOKEN,
} from "../../repositories/sentences.repository.interface";
import { ICheckSentenceExistsUseCase } from "./check-sentence-exists.interface";

/**
 * 해당 날짜의 문장 존재 여부를 확인하는 유스케이스
 * @author 양광성
 * @description 해당 날짜의 문장 존재 여부를 확인하는 유스케이스
 * @param date 날짜
 * @returns 문장 존재 여부
 */
@Injectable()
export class CheckSentenceExistsUseCase implements ICheckSentenceExistsUseCase {
    constructor(
        @Inject(SENTENCES_REPOSITORY_TOKEN)
        private readonly sentencesRepository: ISentencesRepository,
    ) {}

    execute(date: string): Promise<boolean> {
        return this.sentencesRepository.existsByDate(date);
    }
}
