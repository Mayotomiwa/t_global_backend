import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { seedProfile } from 'src/common/seeds/profile.seed';

@Injectable()
export class ProfileService implements OnModuleInit {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repo: Repository<ProfileEntity>,
  ) { }

  async onModuleInit(): Promise<void> {
    const count = await this.repo.count();
    if (count === 0) {
      this.logger.log('No profile found — seeding database…');
      await this.repo.save(this.repo.create(seedProfile()));
      this.logger.log('Profile seeded');
    }
  }

  async get(): Promise<ProfileEntity> {
    const profile = await this.repo.findOne({ where: { isActive: true } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(dto: CreateProfileDto): Promise<ProfileEntity> {
    const profile = await this.get();
    Object.assign(profile, dto);
    const saved = await this.repo.save(profile);
    this.logger.log(`Updated profile [${saved.id}]`);
    return saved;
  }

  async reset(): Promise<{ message: string }> {
    await this.repo.delete({});
    await this.repo.save(this.repo.create(seedProfile()));
    this.logger.warn('Profile reset to seed data');
    return { message: 'Profile reset to seed data' };
  }
}
