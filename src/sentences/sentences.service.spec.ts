import { getRepositoryToken } from "@nestjs/typeorm";
import { SentencesService } from "./sentences.service";
import { Test, TestingModule } from "@nestjs/testing";
import { SentencesEntity } from "./entities/sentences.entity";
import { SentencesRepository } from "./repositories/sentences.repository";
import { VocabsEntity } from "./entities/vocabs.entity";
import { VideosEntity } from "./entities/videos.entity";

// Repository 모킹
const mockSentencesRepository = {
    findOneByDate: jest.fn(),
    findByDateRange: jest.fn(),
};

describe("sentencesService", () => {
    let sentencesService: SentencesService;
    let sentencesRepository: SentencesRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SentencesService,
                {
                    provide: SentencesRepository,
                    useValue: mockSentencesRepository,
                },
                {
                    provide: getRepositoryToken(SentencesEntity),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(VocabsEntity),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(VideosEntity),
                    useValue: {},
                },
            ],
        }).compile();

        sentencesService = module.get<SentencesService>(SentencesService);
        sentencesRepository =
            module.get<SentencesRepository>(SentencesRepository);
    });

    it("should be defined", () => {
        expect(sentencesService).toBeDefined();
    });
});
