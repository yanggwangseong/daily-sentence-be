import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { VisitsEntity } from "../entities/visits.entity";

@Injectable()
export class VisitsRepository extends Repository<VisitsEntity> {
    constructor(
        @InjectRepository(VisitsEntity)
        repository: Repository<VisitsEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
