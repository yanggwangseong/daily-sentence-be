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

	findOneByDate(datetime: string) {
		return this.repository
			.createQueryBuilder('sentence')
			.leftJoinAndSelect('sentence.vocabs', 'vocab')
			.leftJoinAndSelect('sentence.video', 'video')
			.where('DATE(sentence.createdAt) = :date', { date: datetime })
			.getOne();
	}

	findByDateRange(startDate: string, endDate: string) {
		return this.repository
			.createQueryBuilder('sentence')
			.leftJoinAndSelect('sentence.vocabs', 'vocab')
			.leftJoinAndSelect('sentence.video', 'video')
			.where('sentence.createdAt BETWEEN :startDate AND :endDate', {
				startDate,
				endDate,
			})
			.getMany();
	}
}
