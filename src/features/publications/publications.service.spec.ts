import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsService } from './publications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublicationEntity } from './entities/publication.entity';
import { NotFoundException } from '@nestjs/common';

describe('PublicationsService (Unit)', () => {
  let service: PublicationsService;

  // ---------------------------------------------------------------------------
  // Shared fixture
  // ---------------------------------------------------------------------------
  const mockPublication: PublicationEntity = {
    id: 'pub-uuid-1',
    title: 'AI in Modern Healthcare',
    summary: "A short overview of AI's role in diagnostics.",
    content: 'Full article content here.',
    tags: ['AI', 'Healthcare'],
    author: 'Jane Doe',
    date: '2026-02-18',
    readTime: '4 mins',
    imageUrl: 'https://example.com/image.jpg',
    isActive: true,
    createdAt: new Date('2026-01-01'),
  };

  const mockRepo = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationsService,
        { provide: getRepositoryToken(PublicationEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<PublicationsService>(PublicationsService);
    jest.clearAllMocks();
    mockRepo.create.mockImplementation((dto) => dto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // onModuleInit
  // ---------------------------------------------------------------------------
  describe('onModuleInit', () => {
    it('seeds the database when no publications exist (count === 0)', async () => {
      mockRepo.count.mockResolvedValueOnce(0);
      const seedItems = [{ title: 'Seed 1' }];
      mockRepo.create.mockReturnValueOnce(seedItems);
      mockRepo.save.mockResolvedValueOnce(seedItems);

      await service.onModuleInit();

      expect(mockRepo.count).toHaveBeenCalledTimes(1);
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('skips seeding when publications already exist (count > 0)', async () => {
      mockRepo.count.mockResolvedValueOnce(3);

      await service.onModuleInit();

      expect(mockRepo.count).toHaveBeenCalledTimes(1);
      expect(mockRepo.create).not.toHaveBeenCalled();
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------
  describe('create', () => {
    const dto = {
      title: 'New Publication',
      summary: 'Short summary',
      content: 'Full content body',
      tags: ['tag1', 'tag2'],
      author: 'John Smith',
      date: '2026-03-01',
      readTime: '3 mins',
      imageUrl: 'https://example.com/img.jpg',
    };

    it('creates and persists a new publication', async () => {
      const saved = { ...dto, id: 'new-pub-id', isActive: true, createdAt: new Date() };
      mockRepo.create.mockReturnValueOnce(dto);
      mockRepo.save.mockResolvedValueOnce(saved);

      const result = await service.create(dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('new-pub-id');
    });

    it('returns the entity with all dto fields intact', async () => {
      const saved = { ...dto, id: 'p-2', isActive: true, createdAt: new Date() };
      mockRepo.create.mockReturnValueOnce(dto);
      mockRepo.save.mockResolvedValueOnce(saved);

      const result = await service.create(dto as any);

      expect(result.title).toBe(dto.title);
      expect(result.author).toBe(dto.author);
    });
  });

  // ---------------------------------------------------------------------------
  // findAll
  // ---------------------------------------------------------------------------
  describe('findAll', () => {
    it('queries only summary fields and excludes content', async () => {
      mockRepo.find.mockResolvedValueOnce([mockPublication]);

      const result = await service.findAll();

      expect(result).toEqual([mockPublication]);
      expect(mockRepo.find).toHaveBeenCalledWith({
        select: ['id', 'title', 'summary', 'tags', 'author', 'date', 'readTime', 'imageUrl', 'createdAt'],
      });
    });

    it('returns an empty array when there are no publications', async () => {
      mockRepo.find.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // findOne
  // ---------------------------------------------------------------------------
  describe('findOne', () => {
    it('returns the full publication entity including content', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockPublication);

      const result = await service.findOne('pub-uuid-1');

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'pub-uuid-1' } });
      expect(result).toEqual(mockPublication);
      expect(result.content).toBeDefined();
    });

    it('throws NotFoundException when the publication does not exist', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('scopes the lookup by the exact id provided', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);

      await service.findOne('specific-id').catch(() => {});

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'specific-id' } });
    });
  });

  // ---------------------------------------------------------------------------
  // deletePublication
  // ---------------------------------------------------------------------------
  describe('deletePublication', () => {
    it('soft-deletes by setting isActive to false', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockPublication);
      mockRepo.update.mockResolvedValueOnce({ affected: 1 });

      const result = await service.deletePublication('pub-uuid-1');

      expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'pub-uuid-1' } });
      expect(mockRepo.update).toHaveBeenCalledWith('pub-uuid-1', { isActive: false });
      expect(result).toEqual({ message: 'Publication pub-uuid-1 marked as inactive' });
    });

    it('throws NotFoundException when the publication does not exist', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.deletePublication('bad-id')).rejects.toThrow(NotFoundException);
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // reset
  // ---------------------------------------------------------------------------
  describe('reset', () => {
    it('deletes all records and reseeds from seed data', async () => {
      mockRepo.delete.mockResolvedValueOnce({ affected: 3 });
      const seedItems = [{ title: 'Seed 1' }];
      mockRepo.create.mockReturnValueOnce(seedItems);
      mockRepo.save.mockResolvedValueOnce(seedItems);

      const result = await service.reset();

      expect(result).toEqual({ message: 'All publications reset to seed data' });
      expect(mockRepo.delete).toHaveBeenCalledWith({});
      expect(mockRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('passes an empty object to delete to clear all rows', async () => {
      mockRepo.delete.mockResolvedValueOnce({ affected: 1 });
      mockRepo.create.mockReturnValueOnce([]);
      mockRepo.save.mockResolvedValueOnce([]);

      await service.reset();

      expect(mockRepo.delete).toHaveBeenCalledWith({});
    });
  });
});
