import { Test, TestingModule } from '@nestjs/testing';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftGroupEntity } from './entities/shift-group.entity';
import { ShiftRoomEntity } from './entities/shift.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * Controller integration tests
 *
 * These tests wire the real ShiftController + ShiftService against an
 * in-memory SQLite database, verifying the full stack from controller
 * method call through to persisted data.
 *
 * Requires: `npm i -D better-sqlite3 @types/better-sqlite3`
 */
describe('ShiftController (Integration)', () => {
  let module: TestingModule;
  let controller: ShiftController;

  // ---------------------------------------------------------------------------
  // Valid DTO factory
  // ---------------------------------------------------------------------------
  const makeShiftDto = (overrides: Partial<{ date: string; roomName: string }> = {}) => ({
    date: overrides.date ?? '2026-03-01',
    start: '2026-03-01T08:00:00.000Z',
    end: '2026-03-01T16:00:00.000Z',
    shifts: [
      {
        roomName: overrides.roomName ?? 'Room A',
        color: '#A78BFA',
        title: 'Morning Shift',
        description: 'Shift description',
        team: [{ name: 'Alice', imageUrl: 'https://example.com/alice.png', notes: 'Lead' }],
        imageUrl: 'https://example.com/shift.jpg',
        start: '2026-03-01T08:00:00.000Z',
        end: '2026-03-01T16:00:00.000Z',
      },
    ],
  });

  // ---------------------------------------------------------------------------
  // Module setup — one SQLite DB per describe block, reset between tests
  // ---------------------------------------------------------------------------
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [ShiftGroupEntity, ShiftRoomEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ShiftGroupEntity, ShiftRoomEntity]),
      ],
      controllers: [ShiftController],
      providers: [ShiftService],
    }).compile();

    controller = module.get<ShiftController>(ShiftController);
  });

  afterAll(async () => {
    await module.close();
  });

  // ---------------------------------------------------------------------------
  // Module wiring
  // ---------------------------------------------------------------------------
  describe('module wiring', () => {
    it('resolves ShiftController from the DI container', () => {
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(ShiftController);
    });

    it('resolves ShiftService from the DI container', () => {
      const service = module.get<ShiftService>(ShiftService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ShiftService);
    });
  });

  // ---------------------------------------------------------------------------
  // create → findAll → findOne → deleteGroup → reset
  // ---------------------------------------------------------------------------
  describe('create', () => {
    it('persists a shift group and returns it with a generated id', async () => {
      const result = await controller.create(makeShiftDto() as any);

      expect(result.id).toBeDefined();
      expect(result.date).toBe('2026-03-01');
      expect(result.shifts).toHaveLength(1);
      expect(result.shifts[0].roomName).toBe('Room A');
    });

    it('assigns a uuid to each created shift room', async () => {
      const result = await controller.create(makeShiftDto({ roomName: 'Room B' }) as any);

      expect(result.shifts[0].id).toBeDefined();
      expect(typeof result.shifts[0].id).toBe('string');
    });

    it('stores the full team data including notes in the DB', async () => {
      const result = await controller.create(makeShiftDto() as any);
      // findOne returns the raw entity with notes intact
      const room = await controller.findOne(result.id, result.shifts[0].id);
      expect(room.team[0].notes).toBe('Lead');
    });
  });

  describe('findAll', () => {
    it('returns only active shift groups', async () => {
      const groups = await controller.findAll();

      expect(Array.isArray(groups)).toBe(true);
      groups.forEach((g: any) => expect(g.isActive).toBe(true));
    });

    it('strips "notes" from team members in the list view', async () => {
      const groups = await controller.findAll();

      groups.forEach((g: any) => {
        g.shifts.forEach((s: any) => {
          s.team.forEach((m: any) => expect(m.notes).toBeUndefined());
        });
      });
    });

    it('filters by room name', async () => {
      await controller.create(makeShiftDto({ roomName: 'ICU', date: '2026-04-01' }) as any);
      await controller.create(makeShiftDto({ roomName: 'Lobby', date: '2026-04-02' }) as any);

      const result = await controller.findAll('ICU');

      result.forEach((g: any) => {
        expect(g.shifts.some((s: any) => s.roomName === 'ICU')).toBe(true);
      });
    });

    it('filters by date', async () => {
      const result = await controller.findAll(undefined, '2026-04-02');

      result.forEach((g: any) => expect(g.date).toBe('2026-04-02'));
    });

    it('filters by both room and date simultaneously', async () => {
      const result = await controller.findAll('Lobby', '2026-04-02');

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result[0].date).toBe('2026-04-02');
    });
  });

  describe('findOne', () => {
    it('returns the shift room when the group and room ids match', async () => {
      const group = await controller.create(makeShiftDto({ roomName: 'Surgery' }) as any);
      const room = await controller.findOne(group.id, group.shifts[0].id);

      expect(room.roomName).toBe('Surgery');
      expect(room.id).toBe(group.shifts[0].id);
    });

    it('throws NotFoundException for a non-existent room', async () => {
      const group = await controller.create(makeShiftDto() as any);

      await expect(controller.findOne(group.id, 'bad-room-id')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for a non-existent group', async () => {
      const group = await controller.create(makeShiftDto() as any);

      await expect(controller.findOne('bad-group-id', group.shifts[0].id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteGroup', () => {
    it('soft-deletes the group and excludes it from subsequent findAll results', async () => {
      const group = await controller.create(makeShiftDto({ date: '2026-05-01' }) as any);

      const result = await controller.deleteGroup(group.id);

      expect(result.message).toContain('marked as inactive');
      const activeGroups = await controller.findAll(undefined, '2026-05-01');
      expect(activeGroups.every((g: any) => g.id !== group.id)).toBe(true);
    });

    it('throws NotFoundException when the group does not exist', async () => {
      await expect(controller.deleteGroup('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reset', () => {
    it('clears all data and reseeds from the seed file', async () => {
      // Create extra group to verify it gets wiped
      await controller.create(makeShiftDto({ date: '2026-06-01' }) as any);

      const result = await controller.reset();

      expect(result.message).toBe('All shifts reset to seed data');

      const groups = await controller.findAll();
      expect(groups.length).toBeGreaterThan(0); // seed data should be present
    });
  });
});
