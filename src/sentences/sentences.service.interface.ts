import { GetSentenceResponse, GetWeeklySentencesResponse } from "./use-cases";

export const SENTENCES_SERVICE_TOKEN = Symbol("SENTENCES_SERVICE_TOKEN");

/**
 * sentences 서비스 인터페이스
 * @description sentences 서비스 인터페이스
 * @author 양광성
 */
export interface ISentencesService {
    getSentences(date: string): Promise<GetSentenceResponse>;
    getWeeklySentences(date: string): Promise<GetWeeklySentencesResponse>;
    existsByDate(date: string): Promise<boolean>;
}
