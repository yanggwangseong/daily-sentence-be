import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { VideosEntity } from "../entities/videos.entity";
import { VideosRepository } from "./videos.repository";

describe("VideosRepository", () => {
    let videosRepository: VideosRepository;

    beforeEach(async () => {
        const mockVideosRepository = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VideosRepository,
                {
                    provide: getRepositoryToken(VideosEntity),
                    useValue: mockVideosRepository,
                },
            ],
        }).compile();

        videosRepository = module.get<VideosRepository>(VideosRepository);
    });

    it("should be defined", () => {
        expect(videosRepository).toBeDefined();
    });
});
