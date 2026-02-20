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
 * Shifts API — end-to-end tests
 *
 * A full NestJS application is bootstrapped with an in-memory SQLite database
 * so every request goes through ValidationPipe → Controller → Service → DB →
 * ResponseInterceptor / TransformException filter, exactly as in production.
 *
 * Requires: `npm i -D better-sqlite3 @types/better-sqlite3`
 */
describe('Shifts API (e2e)', () => {
  let app: INestApplication;

  // Shared IDs set by the "create" test, used by subsequent tests
  let createdGroupId: string;
  let createdRoomId: string;

  // ---------------------------------------------------------------------------
  // Valid DTO factory
  // ---------------------------------------------------------------------------
  const validDto = () => ({
    date: '2026-03-15',
    start: '2026-03-15T08:00:00.000Z',
    end: '2026-03-15T16:00:00.000Z',
    shifts: [
      {
        roomName: 'Room E2E',
        color: '#A78BFA',
        title: 'E2E Shift',
        description: 'End-to-end test shift',
        team: [{ name: 'Alice', imageUrl: 'https://example.com/alice.png', notes: 'Lead' }],
        imageUrl: 'https://example.com/shift.jpg',
        start: '2026-03-15T08:00:00.000Z',
        end: '2026-03-15T16:00:00.000Z',
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // App bootstrap (once per suite; seeding happens via onModuleInit)
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
  // POST /shifts
  // ---------------------------------------------------------------------------
  describe('POST /shifts', () => {
    it('creates a shift group and returns 201 with the ApiResponse envelope', async () => {
      const res = await request(app.getHttpServer())
        .post('/shifts')
        .send(validDto())
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.statusCode).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.date).toBe('2026-03-15');
      expect(res.body.data.shifts).toHaveLength(1);
      expect(res.body.data.shifts[0].roomName).toBe('Room E2E');

      // Capture ids for later tests
      createdGroupId = res.body.data.id;
      createdRoomId = res.body.data.shifts[0].id;
    });

    it('returns 400 when required fields are missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/shifts')
        .send({ date: '2026-03-15' }) // missing start, end, shifts
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('400');
    });

    it('returns 400 when the color is not a valid hex colour', async () => {
      const dto = validDto();
      dto.shifts[0].color = 'not-a-colour';

      const res = await request(app.getHttpServer())
        .post('/shifts')
        .send(dto)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('returns 400 when the shifts array is empty', async () => {
      const res = await request(app.getHttpServer())
        .post('/shifts')
        .send({ ...validDto(), shifts: [] })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('strips extra fields not declared in the DTO (whitelist)', async () => {
      const dto = { ...validDto(), unexpectedField: 'should-be-stripped' };

      const res = await request(app.getHttpServer())
        .post('/shifts')
        .send(dto)
        .expect(201);

      expect((res.body.data as any).unexpectedField).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // GET /shifts
  // ---------------------------------------------------------------------------
  describe('GET /shifts', () => {
    it('returns 200 with an array of active shift groups', async () => {
      const res = await request(app.getHttpServer()).get('/shifts').expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('strips "notes" from team members in the list response', async () => {
      const res = await request(app.getHttpServer()).get('/shifts').expect(200);

      res.body.data.forEach((group: any) => {
        group.shifts.forEach((shift: any) => {
          shift.team.forEach((member: any) => {
            expect(member.notes).toBeUndefined();
          });
        });
      });
    });

    it('filters by room name via ?room=', async () => {
      const res = await request(app.getHttpServer())
        .get('/shifts?room=Room E2E')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach((group: any) => {
        expect(group.shifts.some((s: any) => s.roomName === 'Room E2E')).toBe(true);
      });
    });

    it('filters by date via ?date=', async () => {
      const res = await request(app.getHttpServer())
        .get('/shifts?date=2026-03-15')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach((group: any) => {
        expect(group.date).toBe('2026-03-15');
      });
    });

    it('returns an empty data array when no groups match the filter', async () => {
      const res = await request(app.getHttpServer())
        .get('/shifts?date=1900-01-01')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // GET /shifts/:groupId/:roomId
  // ---------------------------------------------------------------------------
  describe('GET /shifts/:groupId/:roomId', () => {
    it('returns 200 with the full room detail including team notes', async () => {
      const res = await request(app.getHttpServer())
        .get(`/shifts/${createdGroupId}/${createdRoomId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdRoomId);
      expect(res.body.data.roomName).toBe('Room E2E');
      // findOne returns the raw entity — notes should be present
      expect(res.body.data.team[0].notes).toBe('Lead');
    });

    it('returns 404 when the room id does not exist in the group', async () => {
      const res = await request(app.getHttpServer())
        .get(`/shifts/${createdGroupId}/00000000-0000-0000-0000-000000000000`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('404');
    });

    it('returns 404 when the group id does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get(`/shifts/00000000-0000-0000-0000-000000000000/${createdRoomId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('404');
    });
  });

  // ---------------------------------------------------------------------------
  // DELETE /shifts/:groupId  (soft-delete)
  // ---------------------------------------------------------------------------
  describe('DELETE /shifts/:groupId', () => {
    it('soft-deletes the group and returns 200 with a message', async () => {
      // Create a dedicated group for this test to avoid side-effects
      const createRes = await request(app.getHttpServer())
        .post('/shifts')
        .send({ ...validDto(), date: '2026-05-01' })
        .expect(201);

      const groupIdToDelete = createRes.body.data.id;

      const deleteRes = await request(app.getHttpServer())
        .delete(`/shifts/${groupIdToDelete}`)
        .expect(200);

      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data.message).toContain('marked as inactive');
    });

    it('excludes the soft-deleted group from subsequent GET /shifts results', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/shifts')
        .send({ ...validDto(), date: '2026-05-02' })
        .expect(201);

      const gId = createRes.body.data.id;
      await request(app.getHttpServer()).delete(`/shifts/${gId}`).expect(200);

      const listRes = await request(app.getHttpServer())
        .get('/shifts?date=2026-05-02')
        .expect(200);

      expect(listRes.body.data.every((g: any) => g.id !== gId)).toBe(true);
    });

    it('returns 404 when the group does not exist', async () => {
      const res = await request(app.getHttpServer())
        .delete('/shifts/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.statusCode).toBe('404');
    });
  });

  // ---------------------------------------------------------------------------
  // DELETE /shifts/reset
  // ---------------------------------------------------------------------------
  describe('DELETE /shifts/reset', () => {
    it('resets all shift data to the seed set and returns 200', async () => {
      const res = await request(app.getHttpServer())
        .delete('/shifts/reset')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('All shifts reset to seed data');
    });

    it('restores seeded shift groups after the reset', async () => {
      await request(app.getHttpServer()).delete('/shifts/reset').expect(200);

      const listRes = await request(app.getHttpServer()).get('/shifts').expect(200);

      expect(listRes.body.data.length).toBeGreaterThan(0);
    });
  });
});
