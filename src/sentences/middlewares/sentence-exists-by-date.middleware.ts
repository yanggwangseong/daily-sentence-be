import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { SentencesService } from "../sentences.service";
import { SENTENCES_SERVICE_TOKEN } from "../sentences.service.interface";

@Injectable()
export class SentenceExistsByDateMiddleware implements NestMiddleware {
    constructor(
        @Inject(SENTENCES_SERVICE_TOKEN)
        private readonly sentencesService: SentencesService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { date } = req.params as { date: string };
        const exist = await this.sentencesService.existsByDate(date);

        /**
         * return res를 해야지만 Global Filter에서 처리되지 않는다.
         */
        if (!exist) {
            res.status(404).json({
                error: true,
                message: "해당 날짜에 문장이 없습니다.",
            });
            return;
        }
        next();
    }
}
