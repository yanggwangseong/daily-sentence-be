import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import { SentencesService } from "../sentences.service";

@Injectable()
export class SentenceExistsByDateMiddleware implements NestMiddleware {
    constructor(private readonly sentenceService: SentencesService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { date } = req.params as { date: string };
        const exist = await this.sentenceService.existsByDate(date);

        /**
         * return res를 해야지만 Global Filter에서 처리되지 않는다.
         */
        if (!exist) {
            return res.status(404).json({
                error: true,
                message: "해당 날짜에 문장이 없습니다.",
            });
        }
        next();
    }
}
