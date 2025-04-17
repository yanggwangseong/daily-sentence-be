import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabsEntity } from '../entities/vocabs.entity';

@Injectable()
export class VocabsRepository extends Repository<VocabsEntity> {
	constructor(
		@InjectRepository(VocabsEntity)
		private readonly repository: Repository<VocabsEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}
