import { Injectable } from '@nestjs/common';
import { SentencesRepository } from './repositories/sentences.repository';

@Injectable()
export class SentencesService {
	constructor(private readonly sentencesRepository: SentencesRepository) {}

	getSentences(date: string) {
		return this.sentencesRepository.findOneByDate(date);
	}
}
