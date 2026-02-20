import { Test, TestingModule } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShiftGroupEntity } from './entities/shift-group.entity';
import { ShiftRoomEntity } from './entities/shift.entity';
import { NotFoundException } from '@nestjs/common';

describe('ShiftService (Unit)', () => {
  let service: ShiftService;

  // ---------------------------------------------------------------------------
  // Shared fixtures
  // ---------------------------------------------------------------------------
  const teamWithNotes = [
    { name: 'Alice', imageUrl: 'https://example.com/alice.png', notes: 'Lead surgeon' },
    { name: 'Bob', imageUrl: null, notes: null },
  ];

  const mockRoom = {
    id: 'room-uuid-1',
    groupId: 'group-uuid-1',
    roomName: 'Room 1',
    color: '#A78BFA',
    title: 'Morning Surgery',
    description: 'Surgical procedures',
    imageUrl: 'https://example.com/room.jpg',
    start: '2026-02-18T06:00:00Z',
    end: '2026-02-18T12:00:00Z',
    team: teamWithNotes,
  };

  const mockGroup = {
    id: 'group-uuid-1',
    date: '2026-02-18',
    start: '2026-02-18T06:00:00Z',
    end: '2026-02-18T22:00:00Z',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    shifts: [mockRoom],
  };

  // ---------------------------------------------------------------------------
  // Query-builder chain — shared for both findAll and reset paths
  // ---------------------------------------------------------------------------
  const qbMock = {
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockGroup]),
    delete: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockGroupRepo = {
    count: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(qbMock),
  };

  const mockRoomRepo = {
    create: jest.fn((dto) => dto),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(qbMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftService,
        { provide: getRepositoryToken(ShiftGroupEntity), useValue: mockGroupRepo },
        { provide: getRepositoryToken(ShiftRoomEntity), useValue: mockRoomRepo },
      ],
    }).compile();

    service = module.get<ShiftService>(ShiftService);
    jest.clearAllMocks();

    // Restore mock implementations after clearAllMocks
    mockGroupRepo.createQueryBuilder.mockReturnValue(qbMock);
    mockRoomRepo.createQueryBuilder.mockReturnValue(qbMock);
    qbMock.select.mockReturnThis();
    qbMock.leftJoinAndSelect.mockReturnThis();
    qbMock.where.mockReturnThis();
    qbMock.andWhere.mockReturnThis();
    qbMock.addOrderBy.mockReturnThis();
    qbMock.getMany.mockResolvedValue([mockGroup]);
    qbMock.delete.mockReturnThis();
    qbMock.execute.mockResolvedValue({ affected: 1 });
    mockGroupRepo.create.mockImplementation((dto) => dto);
    mockRoomRepo.create.mockImplementation((dto) => dto);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // onModuleInit
  // ---------------------------------------------------------------------------
  describe('onModuleInit', () => {
    it('seeds the database when the table is empty (count === 0)', async () => {
      mockGroupRepo.count.mockResolvedValueOnce(0);
      mockGroupRepo.save.mockResolvedValueOnce(undefined);

      await service.onModuleInit();

      expect(mockGroupRepo.count).toHaveBeenCalledTimes(1);
      expect(mockGroupRepo.save).toHaveBeenCalledTimes(1);
    });

    it('skips seeding when records already exist (count > 0)', async () => {
      mockGroupRepo.count.mockResolvedValueOnce(3);

      await service.onModuleInit();

      expect(mockGroupRepo.count).toHaveBeenCalledTimes(1);
      expect(mockGroupRepo.save).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------
  describe('create', () => {
    const dto = {
      date: '2026-03-01',
      start: '2026-03-01T08:00:00Z',
      end: '2026-03-01T16:00:00Z',
      shifts: [
        {
          roomName: 'Test Room',
          color: '#FF0000',
          title: 'Night Shift',
          description: 'Overnight duties',
          team: [{ name: 'Charlie', imageUrl: null, notes: null }],
          imageUrl: null,
          start: '2026-03-01T08:00:00Z',
          end: '2026-03-01T16:00:00Z',
        },
      ],
    };

    it('creates a shift group and persists it', async () => {
      const savedGroup = { ...dto, id: 'new-group-id', shifts: dto.shifts };
      mockGroupRepo.save.mockResolvedValueOnce(savedGroup);

      const result = await service.create(dto as any);

      expect(mockGroupRepo.create).toHaveBeenCalledTimes(1);
      expect(mockRoomRepo.create).toHaveBeenCalledTimes(dto.shifts.length);
      expect(mockGroupRepo.save).toHaveBeenCalledTimes(1);
      expect(result.id).toBe('new-group-id');
    });

    it('passes each shift room through roomRepo.create', async () => {
      mockGroupRepo.save.mockResolvedValueOnce({ ...dto, id: 'g-2', shifts: dto.shifts });

      await service.create(dto as any);

      expect(mockRoomRepo.create).toHaveBeenCalledWith(dto.shifts[0]);
    });

    it('includes the rooms in the group entity that gets saved', async () => {
      const savedGroup = { ...dto, id: 'g-3', shifts: dto.shifts };
      mockGroupRepo.save.mockResolvedValueOnce(savedGroup);

      await service.create(dto as any);

      const callArg = mockGroupRepo.create.mock.calls[0][0];
      expect(callArg.date).toBe(dto.date);
      expect(callArg.start).toBe(dto.start);
      expect(callArg.end).toBe(dto.end);
      expect(Array.isArray(callArg.shifts)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // findAll
  // ---------------------------------------------------------------------------
  describe('findAll', () => {
    it('returns active shift groups with no filters', async () => {
      const result = await service.findAll();

      expect(mockGroupRepo.createQueryBuilder).toHaveBeenCalledWith('group');
      expect(qbMock.where).toHaveBeenCalledWith('group.isActive = :isActive', { isActive: true });
      expect(qbMock.andWhere).not.toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('group-uuid-1');
    });

    it('strips "notes" from every team member in the response', async () => {
      const result = await service.findAll();
      const team = result[0].shifts[0].team;

      expect(team).toHaveLength(2);
      expect(team[0]).toEqual({ name: 'Alice', imageUrl: 'https://example.com/alice.png' });
      expect(team[1]).toEqual({ name: 'Bob', imageUrl: null });
      team.forEach((m: any) => expect(m.notes).toBeUndefined());
    });

    it('applies a date filter when date is provided', async () => {
      await service.findAll(undefined, '2026-02-18');

      expect(qbMock.andWhere).toHaveBeenCalledWith('group.date = :date', { date: '2026-02-18' });
    });

    it('applies a room filter when room is provided', async () => {
      await service.findAll('Room 1');

      expect(qbMock.andWhere).toHaveBeenCalledWith('shift.roomName = :room', { room: 'Room 1' });
    });

    it('applies both filters when room and date are provided', async () => {
      await service.findAll('Room 1', '2026-02-18');

      expect(qbMock.andWhere).toHaveBeenCalledWith('group.date = :date', { date: '2026-02-18' });
      expect(qbMock.andWhere).toHaveBeenCalledWith('shift.roomName = :room', { room: 'Room 1' });
    });

    it('orders shifts by start ASC NULLS LAST', async () => {
      await service.findAll();

      expect(qbMock.addOrderBy).toHaveBeenCalledWith('shift.start', 'ASC', 'NULLS LAST');
    });

    it('returns an empty array when no active groups are found', async () => {
      qbMock.getMany.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // findOne
  // ---------------------------------------------------------------------------
  describe('findOne', () => {
    it('returns the shift room when it exists in the group', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(mockRoom);

      const result = await service.findOne('group-uuid-1', 'room-uuid-1');

      expect(mockRoomRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'room-uuid-1', groupId: 'group-uuid-1' },
      });
      expect(result).toEqual(mockRoom);
    });

    it('throws NotFoundException when the room is not found', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('group-uuid-1', 'bad-room')).rejects.toThrow(NotFoundException);
    });

    it('includes groupId in the where clause to scope the lookup', async () => {
      mockRoomRepo.findOne.mockResolvedValueOnce(null);

      await service.findOne('g-1', 'r-1').catch(() => {});

      expect(mockRoomRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'r-1', groupId: 'g-1' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // deleteGroup
  // ---------------------------------------------------------------------------
  describe('deleteGroup', () => {
    it('soft-deletes a group by setting isActive to false', async () => {
      mockGroupRepo.findOne.mockResolvedValueOnce(mockGroup);
      mockGroupRepo.update.mockResolvedValueOnce({ affected: 1 });

      const result = await service.deleteGroup('group-uuid-1');

      expect(mockGroupRepo.findOne).toHaveBeenCalledWith({ where: { id: 'group-uuid-1' } });
      expect(mockGroupRepo.update).toHaveBeenCalledWith('group-uuid-1', { isActive: false });
      expect(result).toEqual({ message: 'Shift group group-uuid-1 marked as inactive' });
    });

    it('throws NotFoundException when the group does not exist', async () => {
      mockGroupRepo.findOne.mockResolvedValueOnce(null);

      await expect(service.deleteGroup('bad-id')).rejects.toThrow(NotFoundException);
      expect(mockGroupRepo.update).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // reset
  // ---------------------------------------------------------------------------
  describe('reset', () => {
    it('deletes all rooms and groups, then reseeds', async () => {
      mockGroupRepo.save.mockResolvedValueOnce(undefined);

      const result = await service.reset();

      expect(result).toEqual({ message: 'All shifts reset to seed data' });
      expect(qbMock.delete).toHaveBeenCalled();
      expect(qbMock.execute).toHaveBeenCalled();
      expect(mockGroupRepo.save).toHaveBeenCalledTimes(1);
    });

    it('uses groupRepo.create to build seed entities before saving', async () => {
      mockGroupRepo.save.mockResolvedValueOnce([]);

      await service.reset();

      expect(mockGroupRepo.create).toHaveBeenCalled();
    });
  });
});
