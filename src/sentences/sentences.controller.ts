import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { SentencesService } from './sentences.service';

@Controller('sentences')
export class SentencesController {
	constructor(private readonly sentencesService: SentencesService) {}

	@Get('/days/:date')
	async getSentences(@Param('date') date: string) {
		const sentences = await this.sentencesService.getSentences(date);

		if (!sentences) {
			throw new NotFoundException('Sentences not found');
		}

		return sentences;
	}

	@Get('/weeklys/:date')
	getWeeklySentences(@Param('date') date: string) {
		return this.sentencesService.getWeeklySentences(date);
	}
}
