import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ShiftModule } from '../src/features/shift/shift.module';
import { PublicationsModule } from '../src/features/publications/publications.module';
import { ShiftGroupEntity } from '../src/features/shift/entities/shift-group.entity';
import { ShiftRoomEntity } from '../src/features/shift/entities/shift.entity';
import { PublicationEntity } from '../src/features/publications/entities/publication.entity';
import { TransformException } from '../src/common/filters/exception.filters';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptors';

/**
 * Publications API — end-to-end tests
 *
 * A full NestJS application is bootstrapped with an in-memory SQLite database
 * so every request goes through ValidationPipe → Controller → Service → DB →
 * ResponseInterceptor / TransformException filter, exactly as in production.
 *
 * Requires: `npm i -D better-sqlite3 @types/better-sqlite3`
 */
describe('Publications API (e2e)', () => {
  let app: INestApplication;

  // Shared id set by the "create" test and reused in subsequent tests
  let createdId: string;

  // ---------------------------------------------------------------------------
  // Valid DTO factory
  // ---------------------------------------------------------------------------
  const validDto = (overrides: Partial<{ title: string }> = {}) => ({
    title: overrides.title ?? 'E2E Publication',
    summary: 'An e2e test publication summary',
    content: 'Full content of the e2e test publication.',
    tags: ['e2e', 'test'],
    author: 'E2E Author',
    date: '2026-03-20',
    readTime: '5 mins',
    imageUrl: 'https://example.com/image.jpg',
  });

  // ---------------------------------------------------------------------------
  // App bootstrap
  // ---------------------------------------------------------------------------
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [ShiftGroupEntity, ShiftRoomEntity, PublicationEntity],
          synchronize: true,
        }),
        ShiftModule,
        PublicationsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new TransformException());
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------------------------------------------------------------------------
  // POST /publications
  // ---------------------------------------------------------------------------
  describe('POST /publications', () => {
    it('creates a publication and returns 201 with the ApiResponse envelope', async () => {
      const res = await request(app.getHttpServer())
        .post('/publications')
        .send(validDto())
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.statusCode).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('E2E Publication');
      expect(res.body.data.content).toBe('Full content of the e2e test publication.');
      expect(res.body.data.isActive).toBe(true);

      createdId = res.body.data.id;
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/publications')
        .send({ title: 'Incomplete' }) // missing summary, content, tags, etc.
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('400');
    });

    it('returns 400 when imageUrl is not a valid URL', async () => {
      const res = await request(app.getHttpServer())
        .post('/publications')
        .send({ ...validDto(), imageUrl: 'not-a-url' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('returns 400 when tags is not an array', async () => {
      const res = await request(app.getHttpServer())
        .post('/publications')
        .send({ ...validDto(), tags: 'single-string' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('strips extra unknown fields (whitelist mode)', async () => {
      const dto = { ...validDto(), unknownField: 'should-be-stripped' };

      const res = await request(app.getHttpServer())
        .post('/publications')
        .send(dto)
        .expect(201);

      expect((res.body.data as any).unknownField).toBeUndefined();
    });

    it('accepts a publication without an optional imageUrl', async () => {
      const { imageUrl: _, ...dtoWithoutImage } = validDto();

      const res = await request(app.getHttpServer())
        .post('/publications')
        .send(dtoWithoutImage)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // GET /publications
  // ---------------------------------------------------------------------------
  describe('GET /publications', () => {
    it('returns 200 with an array of publication summaries', async () => {
      const res = await request(app.getHttpServer()).get('/publications').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('omits the content field from each list item', async () => {
      const res = await request(app.getHttpServer()).get('/publications').expect(200);

      res.body.data.forEach((pub: any) => {
        expect(pub.content).toBeUndefined();
      });
    });

    it('includes id, title, summary, tags, author, date, readTime in each item', async () => {
      const res = await request(app.getHttpServer()).get('/publications').expect(200);

      const pub = res.body.data.find((p: any) => p.id === createdId);
      expect(pub).toBeDefined();
      expect(pub.title).toBe('E2E Publication');
      expect(pub.summary).toBeDefined();
      expect(pub.tags).toEqual(['e2e', 'test']);
      expect(pub.createdAt).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // GET /publications/:id
  // ---------------------------------------------------------------------------
  describe('GET /publications/:id', () => {
    it('returns 200 with the full publication including content', async () => {
      const res = await request(app.getHttpServer())
        .get(`/publications/${createdId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdId);
      expect(res.body.data.title).toBe('E2E Publication');
      expect(res.body.data.content).toBe('Full content of the e2e test publication.');
    });

    it('returns 404 for an unknown id', async () => {
      const res = await request(app.getHttpServer())
        .get('/publications/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('404');
    });
  });

  // ---------------------------------------------------------------------------
  // DELETE /publications/:id  (soft-delete)
  // ---------------------------------------------------------------------------
  describe('DELETE /publications/:id', () => {
    it('soft-deletes the publication and returns 200 with a message', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/publications')
        .send(validDto({ title: 'To Be Soft-Deleted' }))
        .expect(201);

      const idToDelete = createRes.body.data.id;

      const deleteRes = await request(app.getHttpServer())
        .delete(`/publications/${idToDelete}`)
        .expect(200);

      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.message).toContain('marked as inactive');
    });

    it('soft-deleted publication is still retrievable via GET /publications/:id', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/publications')
        .send(validDto({ title: 'Verify Inactive State' }))
        .expect(201);

      const id = createRes.body.data.id;
      await request(app.getHttpServer()).delete(`/publications/${id}`).expect(200);

      const getRes = await request(app.getHttpServer())
        .get(`/publications/${id}`)
        .expect(200);

      expect(getRes.body.data.isActive).toBe(false);
    });

    it('returns 404 when the publication does not exist', async () => {
      const res = await request(app.getHttpServer())
        .delete('/publications/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('404');
    });
  });

  // ---------------------------------------------------------------------------
  // DELETE /publications/reset
  // ---------------------------------------------------------------------------
  describe('DELETE /publications/reset', () => {
    it('resets all publication data to the seed set and returns 200', async () => {
      const res = await request(app.getHttpServer())
        .delete('/publications/reset')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('All publications reset to seed data');
    });

    it('restores the seeded publications after the reset', async () => {
      await request(app.getHttpServer()).delete('/publications/reset').expect(200);

      const listRes = await request(app.getHttpServer()).get('/publications').expect(200);

      expect(listRes.body.data.length).toBeGreaterThan(0);
      // The e2e publication created earlier should no longer exist after reset
      expect(listRes.body.data.every((p: any) => p.title !== 'E2E Publication')).toBe(true);
    });
  });
});
