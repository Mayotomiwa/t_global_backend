import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShiftGroupEntity } from './entities/shift-group.entity';
import { ShiftRoomEntity } from './entities/shift.entity';
import { CreateShiftGroupDto } from './dto/create-shift-group.dto';
import { seedShifts } from 'src/common/seeds/shift.seed';

@Injectable()
export class ShiftService implements OnModuleInit {
  private readonly logger = new Logger(ShiftService.name);

  constructor(
    @InjectRepository(ShiftGroupEntity)
    private readonly groupRepo: Repository<ShiftGroupEntity>,
    @InjectRepository(ShiftRoomEntity)
    private readonly roomRepo: Repository<ShiftRoomEntity>,
  ) { }
  private async seedData(): Promise<void> {
    const seeds = seedShifts();
    const groups = seeds.map((seed) =>
      this.groupRepo.create({
        ...seed,
        rooms: (seed.rooms ?? []) as ShiftRoomEntity[],
      }),
    );
    await this.groupRepo.save(groups);
  }

  async onModuleInit(): Promise<void> {
    const count = await this.groupRepo.count();
    if (count === 0) {
      this.logger.log('No shifts found — seeding database…');
      await this.seedData();
      this.logger.log('Shift groups seeded');
    }
  }


  async create(dto: CreateShiftGroupDto): Promise<ShiftGroupEntity> {
    const group = this.groupRepo.create({
      date: dto.date,
      start: dto.start,
      end: dto.end,
      color: dto.color,
      rooms: dto.rooms.map((r) => this.roomRepo.create(r)),
    });
    const saved = await this.groupRepo.save(group);
    this.logger.log(`Created shift group ${saved.id}`);
    return saved;
  }

  async findAll(room?: string, date?: string): Promise<ShiftGroupEntity[]> {
    const qb = this.groupRepo
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.rooms', 'room')
      .where('group.isActive = :isActive', { isActive: true });

    if (date) {
      qb.andWhere('group.date = :date', { date });
    }
    if (room) {
      qb.andWhere('room.roomName = :room', { room });
    }

    return qb.getMany();
  }

  async findOne(groupId: string, roomId: string): Promise<ShiftRoomEntity> {
    const room = await this.roomRepo.findOne({
      where: { id: roomId, groupId },
    });
    if (!room) {
      throw new NotFoundException(
        `ShiftRoom ${roomId} not found in group ${groupId}`,
      );
    }
    return room;
  }

  async deleteGroup(groupId: string): Promise<{ message: string }> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`ShiftGroup ${groupId} not found`);
    }
    await this.groupRepo.update(groupId, { isActive: false });
    this.logger.log(`Soft-deleted shift group ${groupId}`);
    return { message: `Shift group ${groupId} marked as inactive` };
  }

  async reset(): Promise<{ message: string }> {
    await this.roomRepo.createQueryBuilder().delete().execute();
    await this.groupRepo.createQueryBuilder().delete().execute();
    await this.seedData();
    this.logger.warn('All shifts reset to seed data');
    return { message: 'All shifts reset to seed data' };
  }
}