import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublicationsService } from './publications.service';
import { PublicationEntity } from './entities/publication.entity';

const mockRepo = {
  count: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn((v) => v),
  save: jest.fn((v) => v),
  delete: jest.fn(),
};

describe('PublicationsService', () => {
  let service: PublicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationsService,
        { provide: getRepositoryToken(PublicationEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<PublicationsService>(PublicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
