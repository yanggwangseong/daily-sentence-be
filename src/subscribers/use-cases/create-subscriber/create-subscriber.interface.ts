import { CreateSubscriberResponse } from "./create-subscriber.usecase";

export const CREATE_SUBSCRIBER_USECASE_TOKEN = "ICreateSubscriberUseCase";

export interface ICreateSubscriberUseCase {
    execute(email: string): Promise<CreateSubscriberResponse>;
}
