import { Injectable } from '@nestjs/common';
import { SentencesRepository } from './repositories/sentences.repository';

@Injectable()
export class SentencesService {
	constructor(private readonly sentencesRepository: SentencesRepository) {}

	async getSentences(date: string) {
		const sentence = await this.sentencesRepository.findOneByDate(date);

		if (!sentence) return null;

		return {
			date: sentence.createdAt.toISOString().split('T')[0],
			sentence: sentence.sentence,
			meaning: sentence.meaning,
			vocab: sentence.vocabs.map((v) => ({
				word: v.word,
				definition: v.definition,
			})),
			videoUrl: sentence.video?.videoUrl ?? '',
		};
	}
}
