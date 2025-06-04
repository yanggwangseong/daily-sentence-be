import { GetSentenceResponse } from "./get-sentence.usecase";

export const GET_SENTENCE_USECASE_TOKEN = "IGetSentenceUseCase";

export interface IGetSentenceUseCase {
    execute(date: string): Promise<GetSentenceResponse>;
}
