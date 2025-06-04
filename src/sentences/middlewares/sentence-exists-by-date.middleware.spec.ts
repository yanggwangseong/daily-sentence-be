import { Test, TestingModule } from "@nestjs/testing";
import { Request, Response } from "express";

import {
    ISentencesService,
    SENTENCES_SERVICE_TOKEN,
} from "../sentences.service.interface";
import { SentenceExistsByDateMiddleware } from "./sentence-exists-by-date.middleware";

describe("SentenceExistsByDateMiddleware", () => {
    let middleware: SentenceExistsByDateMiddleware;
    let mockSentencesService: jest.Mocked<
        Pick<ISentencesService, "existsByDate">
    >;

    beforeEach(async () => {
        mockSentencesService = {
            existsByDate: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SentenceExistsByDateMiddleware,
                {
                    provide: SENTENCES_SERVICE_TOKEN,
                    useValue: mockSentencesService,
                },
            ],
        }).compile();

        middleware = module.get<SentenceExistsByDateMiddleware>(
            SentenceExistsByDateMiddleware,
        );
    });

    it("should be defined", () => {
        expect(middleware).toBeDefined();
    });

    it("should return 404 if the sentence does not exist", async () => {
        mockSentencesService.existsByDate.mockResolvedValue(false);

        const req = { params: { date: "2025-01-01" } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
        const next = jest.fn();

        await middleware.use(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            message: "해당 날짜에 문장이 없습니다.",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if the sentence exists", async () => {
        mockSentencesService.existsByDate.mockResolvedValue(true);

        const req = { params: { date: "2025-01-01" } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
        const next = jest.fn();

        await middleware.use(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should return 404 if the date is invalid", async () => {
        const req = { params: { date: "invalid-date" } } as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Response;
        const next = jest.fn();

        await middleware.use(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: true,
            message: "해당 날짜에 문장이 없습니다.",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
