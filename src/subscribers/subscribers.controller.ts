import { ConflictException, Controller, Param, Post } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { EmailPipe } from './pipes/email.pipe';

@Controller('subscribers')
export class SubscribersController {
	constructor(private readonly subscribersService: SubscribersService) {}

	@Post(':email')
	async create(@Param('email', new EmailPipe()) email: string) {
		const subscriber = await this.subscribersService.create(email);

		if (subscriber) throw new ConflictException('이미 구독자입니다.');

		return {
			message: '구독자 등록 완료',
			subscriber,
		};
	}
}
