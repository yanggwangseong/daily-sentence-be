import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { VideosEntity } from "../entities/videos.entity";

@Injectable()
export class VideosRepository extends Repository<VideosEntity> {
    constructor(
        @InjectRepository(VideosEntity)
        repository: Repository<VideosEntity>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}
