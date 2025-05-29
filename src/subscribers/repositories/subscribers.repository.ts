import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SubscribersEntity } from "../entities/subscribers.entity";
import { ISubscribersRepository } from "./subscribers.repository.interface";

@Injectable()
export class SubscribersRepository implements ISubscribersRepository {
    constructor(
        @InjectRepository(SubscribersEntity)
        private readonly repository: Repository<SubscribersEntity>,
    ) {}

    findByEmail(email: string): Promise<SubscribersEntity | null> {
        return this.repository.findOne({ where: { email } });
    }

    createSubscriber(email: string): Promise<SubscribersEntity> {
        return this.repository.save({ email });
    }
}
