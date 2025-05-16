import { SubscribersEntity } from "./entities/subscribers.entity";

export const SUBSCRIBERS_SERVICE_TOKEN = "ISubscribersService";

export interface ISubscribersService {
    create(
        email: string,
    ): Promise<SubscribersEntity | { message: string; error: boolean }>;
}
