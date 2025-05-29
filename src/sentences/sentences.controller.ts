import {
    Controller,
    Get,
    Inject,
    NotFoundException,
    Param,
} from "@nestjs/common";

import { SentencesService } from "./sentences.service";
import { SENTENCES_SERVICE_TOKEN } from "./sentences.service.interface";

@Controller("sentences")
export class SentencesController {
    constructor(
        @Inject(SENTENCES_SERVICE_TOKEN)
        private readonly sentencesService: SentencesService,
    ) {}

    @Get("/days/:date")
    async getSentences(@Param("date") date: string) {
        const sentences = await this.sentencesService.getSentences(date);

        if (typeof sentences === "object" && "error" in sentences) {
            throw new NotFoundException(sentences.message);
        }

        return sentences;
    }

    @Get("/weeklys/:date")
    getWeeklySentences(@Param("date") date: string) {
        return this.sentencesService.getWeeklySentences(date);
    }
}
