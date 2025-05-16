import { GetWeeklySentencesResponse } from "./get-weekly-sentences.usecase";

export const GET_WEEKLY_SENTENCES_USECASE_TOKEN = "IGetWeeklySentencesUseCase";

export interface IGetWeeklySentencesUseCase {
    execute(date: string): Promise<GetWeeklySentencesResponse>;
}
