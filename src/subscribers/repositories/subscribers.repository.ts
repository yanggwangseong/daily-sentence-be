import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SubscribersEntity } from "../entities/subscribers.entity";

@Injectable()
export class SubscribersRepository {
    constructor(
        @InjectRepository(SubscribersEntity)
        private readonly repository: Repository<SubscribersEntity>,
    ) {}

    findByEmail(email: string) {
        return this.repository.findOne({ where: { email } });
    }

    createSubscriber(email: string) {
        return this.repository.save({ email });
    }
}
