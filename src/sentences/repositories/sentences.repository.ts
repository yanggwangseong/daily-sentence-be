import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SentencesEntity } from '../entities/sentences.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SentencesRepository extends Repository<SentencesEntity> {
	constructor(
		@InjectRepository(SentencesEntity)
		private readonly repository: Repository<SentencesEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
