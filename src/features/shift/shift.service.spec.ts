import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShiftService } from './shift.service';
import { ShiftGroupEntity } from './entities/shift.entity';
import { ShiftRoomEntity } from './entities/shift-group.entity';

const mockGroupRepo = {
  count: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn((v) => v),
  save: jest.fn((v) => v),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  })),
};

const mockRoomRepo = {
  findOne: jest.fn(),
  create: jest.fn((v) => v),
};

describe('ShiftService', () => {
  let service: ShiftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftService,
        { provide: getRepositoryToken(ShiftGroupEntity), useValue: mockGroupRepo },
        { provide: getRepositoryToken(ShiftRoomEntity), useValue: mockRoomRepo },
      ],
    }).compile();

    service = module.get<ShiftService>(ShiftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
