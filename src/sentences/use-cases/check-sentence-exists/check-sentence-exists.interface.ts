export const CHECK_SENTENCE_EXISTS_USECASE_TOKEN =
    "CHECK_SENTENCE_EXISTS_USECASE_TOKEN";

export interface ICheckSentenceExistsUseCase {
    execute(date: string): Promise<boolean>;
}
