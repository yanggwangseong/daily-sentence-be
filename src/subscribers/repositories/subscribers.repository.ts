import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { SubscribersEntity } from "../entities/subscribers.entity";
import { InjectRepository } from "@nestjs/typeorm";

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
