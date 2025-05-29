import { SubscribersEntity } from "../entities/subscribers.entity";

export const SUBSCRIBERS_REPOSITORY_TOKEN = "ISubscribersRepository";

export interface ISubscribersRepository {
    findByEmail(email: string): Promise<SubscribersEntity | null>;
    createSubscriber(email: string): Promise<SubscribersEntity>;
}
