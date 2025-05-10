import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VisitsEntity } from "./entities/visits.entity";
import { VisitsRepository } from "./repositories/visits.repository";
import { VisitsController } from "./visits.controller";
import { VisitsService } from "./visits.service";

@Module({
    imports: [TypeOrmModule.forFeature([VisitsEntity])],
    controllers: [VisitsController],
    providers: [VisitsService, VisitsRepository],
    exports: [],
})
export class VisitsModule {}
