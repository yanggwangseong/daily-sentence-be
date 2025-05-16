import {
    GetSentenceError,
    GetSentenceResponse,
    GetWeeklySentencesResponse,
} from "./use-cases";

export const SENTENCES_SERVICE_TOKEN = Symbol("SENTENCES_SERVICE_TOKEN");

/**
 * sentences 서비스 인터페이스
 * @description sentences 서비스 인터페이스
 * @author 양광성
 * @todo Return Type이 LSP를 만족하게 설계하여 OCP를 만족하게 설계해야 함
 */
export interface ISentencesService {
    getSentences(date: string): Promise<GetSentenceResponse | GetSentenceError>;
    getWeeklySentences(date: string): Promise<GetWeeklySentencesResponse>;
}
