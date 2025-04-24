import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SubscribersEntity } from '../entities/subscribers.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscribersRepository extends Repository<SubscribersEntity> {
	constructor(
		@InjectRepository(SubscribersEntity)
		repository: Repository<SubscribersEntity>,
	) {
		super(repository.target, repository.manager, repository.queryRunner);
	}

	async findByEmail(email: string) {
		return this.findOne({ where: { email } });
	}

	async createSubscriber(email: string) {
		return this.save({ email });
	}
}
