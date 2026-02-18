import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationEntity } from './entities/publication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationEntity])],
  controllers: [PublicationsController],
  providers: [PublicationsService],
})
export class PublicationsModule { }
