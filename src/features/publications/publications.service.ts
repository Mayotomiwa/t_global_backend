import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationEntity } from './entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { seedPublications } from 'src/common/seeds/publication.seed';

@Injectable()
export class PublicationsService implements OnModuleInit {
  private readonly logger = new Logger(PublicationsService.name);

  constructor(
    @InjectRepository(PublicationEntity)
    private readonly repo: Repository<PublicationEntity>,
  ) { }

  async onModuleInit(): Promise<void> {
    const count = await this.repo.count();
    if (count === 0) {
      this.logger.log('No publications found — seeding database…');
      const seeds = seedPublications();
      await this.repo.save(this.repo.create(seeds));
      this.logger.log(`Seeded ${seeds.length} publications`);
    }
  }

  async create(dto: CreatePublicationDto): Promise<PublicationEntity> {
    const pub = this.repo.create(dto);
    const saved = await this.repo.save(pub);
    this.logger.log(`Created publication "${saved.title}" [${saved.id}]`);
    return saved;
  }

  async findAll(): Promise<Omit<PublicationEntity, 'content'>[]> {
    return this.repo.find({
      select: ['id', 'title', 'summary', 'tags', 'author', 'date', 'readTime', 'imageUrl', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<PublicationEntity> {
    const pub = await this.repo.findOne({ where: { id } });
    if (!pub) throw new NotFoundException(`Publication ${id} not found`);
    return pub;
  }

  async deletePublication(id: string): Promise<{ message: string }> {
    const pub = await this.repo.findOne({ where: { id } });
    if (!pub) {
      throw new NotFoundException(`Publication ${id} not found`);
    }
    await this.repo.update(id, { isActive: false });
    this.logger.log(`Soft-deleted publication ${id}`);
    return { message: `Publication ${id} marked as inactive` };
  }

  async reset(): Promise<{ message: string }> {
    await this.repo.delete({});
    const seeds = seedPublications();
    await this.repo.save(this.repo.create(seeds));
    this.logger.warn('All publications reset to seed data');
    return { message: 'All publications reset to seed data' };
  }
}