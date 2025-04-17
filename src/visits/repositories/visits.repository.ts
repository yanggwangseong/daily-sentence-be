import { Injectable } from '@nestjs/common';
import { VisitsEntity } from '../entities/visits.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VisitsRepository extends Repository<VisitsEntity> {
	constructor(
		@InjectRepository(VisitsEntity)
		private readonly repository: Repository<VisitsEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
