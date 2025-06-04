import { Controller, Get, Inject, Param } from "@nestjs/common";

import { DatePipe } from "./pipes/date.pipe";
import { SentencesService } from "./sentences.service";
import { SENTENCES_SERVICE_TOKEN } from "./sentences.service.interface";

@Controller("sentences")
export class SentencesController {
    constructor(
        @Inject(SENTENCES_SERVICE_TOKEN)
        private readonly sentencesService: SentencesService,
    ) {}

    @Get("/days/:date")
    getSentences(@Param("date", new DatePipe()) date: string) {
        return this.sentencesService.getSentences(date);
    }

    @Get("/weeklys/:date")
    getWeeklySentences(@Param("date", new DatePipe()) date: string) {
        return this.sentencesService.getWeeklySentences(date);
    }
}
