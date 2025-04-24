import { Injectable } from '@nestjs/common';
import { SentencesRepository } from './repositories/sentences.repository';

@Injectable()
export class SentencesService {
	constructor(private readonly sentencesRepository: SentencesRepository) {}

	async getSentences(date: string) {
		const koreanDate = new Date(date).toLocaleDateString('sv-SE', {
			timeZone: 'Asia/Seoul',
		});

		const sentence = await this.sentencesRepository.findOneByDate(koreanDate);

		if (!sentence) return null;

		return {
			date: new Date(sentence.createdAt).toLocaleDateString('sv-SE', {
				timeZone: 'Asia/Seoul',
			}),
			sentence: sentence.sentence,
			meaning: sentence.meaning,
			vocab: sentence.vocabs.map((v) => ({
				word: v.word,
				definition: v.definition,
			})),
			videoUrl: sentence.video?.videoUrl ?? '',
		};
	}

	async getWeeklySentences(date: string) {
		const inputDate = new Date(date);

		const startDate = new Date(inputDate);
		startDate.setDate(inputDate.getDate() - inputDate.getDay());
		const endDate = new Date(inputDate);
		endDate.setDate(inputDate.getDate() - inputDate.getDay() + 6);

		const startDateStr = startDate.toLocaleDateString('sv-SE', {
			timeZone: 'Asia/Seoul',
		});
		const endDateStr = endDate.toLocaleDateString('sv-SE', {
			timeZone: 'Asia/Seoul',
		});

		const sentences = await this.sentencesRepository.findByDateRange(
			startDateStr,
			endDateStr,
		);

		return sentences.map((sentence) => ({
			date: new Date(sentence.createdAt).toLocaleDateString('sv-SE', {
				timeZone: 'Asia/Seoul',
			}),
			sentence: sentence.sentence,
			meaning: sentence.meaning,
			vocab: sentence.vocabs.map((v) => ({
				word: v.word,
				definition: v.definition,
			})),
			videoUrl: sentence.video?.videoUrl ?? '',
		}));
	}
}
