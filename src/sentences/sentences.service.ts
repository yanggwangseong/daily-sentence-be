import { Injectable } from "@nestjs/common";
import { SentencesRepository } from "./repositories/sentences.repository";

@Injectable()
export class SentencesService {
    constructor(private readonly sentencesRepository: SentencesRepository) {}

    async getSentences(date: string) {
        const koreanDate = new Date(date).toLocaleDateString("sv-SE", {
            timeZone: "Asia/Seoul",
        });

        const sentence =
            await this.sentencesRepository.findOneByDate(koreanDate);

        if (!sentence) return null;

        return {
            date: new Date(sentence.createdAt).toLocaleDateString("sv-SE", {
                timeZone: "Asia/Seoul",
            }),
            sentence: sentence.sentence,
            meaning: sentence.meaning,
            vocab: sentence.vocabs.map((v) => ({
                word: v.word,
                definition: v.definition,
            })),
            videoUrl: sentence.video?.videoUrl ?? "",
        };
    }

    async getWeeklySentences(date: string) {
        const inputDate = new Date(date);

        // 월요일을 주의 시작으로 계산 (1: 월요일, ..., 0: 일요일)
        const day = inputDate.getDay();
        const diff = day === 0 ? 6 : day - 1; // 일요일(0)이면 6을 빼고, 아니면 요일-1을 빼서 월요일로 맞춤

        // 월요일(시작일)
        const startDate = new Date(inputDate);
        startDate.setDate(inputDate.getDate() - diff);

        // 일요일(종료일)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const startDateStr = startDate.toLocaleDateString("sv-SE", {
            timeZone: "Asia/Seoul",
        });
        const endDateStr = endDate.toLocaleDateString("sv-SE", {
            timeZone: "Asia/Seoul",
        });

        const sentences = await this.sentencesRepository.findByDateRange(
            startDateStr,
            endDateStr,
        );

        return sentences.map((sentence) => ({
            date: new Date(sentence.createdAt).toLocaleDateString("sv-SE", {
                timeZone: "Asia/Seoul",
            }),
            sentence: sentence.sentence,
            meaning: sentence.meaning,
            vocab: sentence.vocabs.map((v) => ({
                word: v.word,
                definition: v.definition,
            })),
            videoUrl: sentence.video?.videoUrl ?? "",
        }));
    }
}
