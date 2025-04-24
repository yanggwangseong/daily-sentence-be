import { Injectable } from '@nestjs/common';
import { SubscribersRepository } from './repositories/subscribers.repository';

@Injectable()
export class SubscribersService {
	constructor(private readonly subscribersRepository: SubscribersRepository) {}

	async create(email: string) {
		const subscriber = await this.subscribersRepository.findByEmail(email);
		if (subscriber) {
			return subscriber;
		}

		return this.subscribersRepository.createSubscriber(email);
	}
}
