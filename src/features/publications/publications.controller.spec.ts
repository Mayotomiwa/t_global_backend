import { Test, TestingModule } from '@nestjs/testing';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationEntity } from './entities/publication.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * Controller integration tests
 *
 * These tests wire the real PublicationsController + PublicationsService
 * against an in-memory SQLite database, verifying the full controller→service→
 * repository chain without a running PostgreSQL instance.
 *
 * Requires: `npm i -D better-sqlite3 @types/better-sqlite3`
 */
describe('PublicationsController (Integration)', () => {
  let module: TestingModule;
  let controller: PublicationsController;

  // ---------------------------------------------------------------------------
  // Valid DTO factory
  // ---------------------------------------------------------------------------
  const makePubDto = (overrides: Partial<{ title: string; tags: string[] }> = {}) => ({
    title: overrides.title ?? 'Test Article',
    summary: 'A test summary',
    content: 'Full content of the test article.',
    tags: overrides.tags ?? ['test'],
    author: 'Test Author',
    date: '2026-03-01',
    readTime: '3 mins',
    imageUrl: 'https://example.com/image.jpg',
  });

  // ---------------------------------------------------------------------------
  // Module setup — shared across all tests in this suite
  // ---------------------------------------------------------------------------
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [PublicationEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([PublicationEntity]),
      ],
      controllers: [PublicationsController],
      providers: [PublicationsService],
    }).compile();

    controller = module.get<PublicationsController>(PublicationsController);
  });

  afterAll(async () => {
    await module.close();
  });

  // ---------------------------------------------------------------------------
  // Module wiring
  // ---------------------------------------------------------------------------
  describe('module wiring', () => {
    it('resolves PublicationsController from the DI container', () => {
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(PublicationsController);
    });

    it('resolves PublicationsService from the DI container', () => {
      const service = module.get<PublicationsService>(PublicationsService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(PublicationsService);
    });
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------
  describe('create', () => {
    it('persists a publication and returns it with a generated id', async () => {
      const result = await controller.create(makePubDto() as any);

      expect(result.id).toBeDefined();
      expect(result.title).toBe('Test Article');
      expect(result.content).toBe('Full content of the test article.');
    });

    it('stores isActive as true by default', async () => {
      const result = await controller.create(makePubDto({ title: 'Active Test' }) as any);

      expect(result.isActive).toBe(true);
    });

    it('persists all fields supplied in the DTO', async () => {
      const dto = makePubDto({ title: 'Full DTO Test', tags: ['a', 'b'] });
      const result = await controller.create(dto as any);

      expect(result.summary).toBe(dto.summary);
      expect(result.author).toBe(dto.author);
      expect(result.readTime).toBe(dto.readTime);
      expect(result.tags).toEqual(['a', 'b']);
    });
  });

  // ---------------------------------------------------------------------------
  // findAll
  // ---------------------------------------------------------------------------
  describe('findAll', () => {
    it('returns an array containing at least the created publications', async () => {
      await controller.create(makePubDto({ title: 'List Test' }) as any);

      const result = await controller.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('excludes the content field from list results', async () => {
      const result = await controller.findAll();

      result.forEach((p: any) => {
        expect(p.content).toBeUndefined();
      });
    });

    it('includes id, title, summary, tags, author, date, readTime, imageUrl, createdAt', async () => {
      await controller.create(makePubDto({ title: 'Field Check' }) as any);

      const result = await controller.findAll();
      const item = result.find((p: any) => p.title === 'Field Check');

      expect(item).toBeDefined();
      expect(item!.id).toBeDefined();
      expect(item!.title).toBe('Field Check');
      expect(item!.createdAt).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // findOne
  // ---------------------------------------------------------------------------
  describe('findOne', () => {
    it('returns the full publication including content', async () => {
      const created = await controller.create(makePubDto({ title: 'Detail Test' }) as any);
      const result = await controller.findOne(created.id);

      expect(result.id).toBe(created.id);
      expect(result.title).toBe('Detail Test');
      expect(result.content).toBe('Full content of the test article.');
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(controller.findOne('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ---------------------------------------------------------------------------
  // deletePublication
  // ---------------------------------------------------------------------------
  describe('deletePublication', () => {
    it('sets isActive to false without removing the record from the DB', async () => {
      const created = await controller.create(makePubDto({ title: 'To Soft-Delete' }) as any);

      const result = await controller.deletePublication(created.id);

      expect(result.message).toContain('marked as inactive');

      // findOne still returns the record, but with isActive = false
      const afterDelete = await controller.findOne(created.id);
      expect(afterDelete.isActive).toBe(false);
    });

    it('throws NotFoundException when the publication does not exist', async () => {
      await expect(
        controller.deletePublication('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------------------------------------
  // reset
  // ---------------------------------------------------------------------------
  describe('reset', () => {
    it('clears all data and restores seed publications', async () => {
      // Add an extra publication that should be wiped by reset
      await controller.create(makePubDto({ title: 'Should Be Wiped' }) as any);

      const result = await controller.reset();

      expect(result.message).toBe('All publications reset to seed data');

      // After reset the list should contain only seed entries (no 'Should Be Wiped')
      const all = await controller.findAll();
      expect(all.length).toBeGreaterThan(0);
      expect(all.every((p: any) => p.title !== 'Should Be Wiped')).toBe(true);
    });
  });
});
